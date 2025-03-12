import React, { useState, useEffect, useRef } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import MenuLayout from '@/layouts/MenuLayout';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, DownloadCloud, RefreshCcw, Save } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "../../../menu/menu.css";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Open_Access = () => {
    const [openSections, setOpenSections] = useState({
        tools: true,  // default open state for each section
        summary: true
    });
    const [chartConfig, setChartConfig] = useState({
        publicationType: 'average',
        visualizationType: 'bar',
        lineColor: '#6d28d9',
        pointColor: '#9f1239',
        fontSize: 12,
        orientation: 'vertical',
        showLegend: true,
        showGrid: true,
        showTitle: true,
        AxisLabelSize: 12,
        tickLabelSize: 8,
        xAxisLabel: 'Open Access Status',
        yAxisLabel: 'Number of Documents',
        xAxisTickRotation: 0,
        yAxisTickRotation: 0
    });

    const chartRef = useRef(null);
    const [topDocuments, setTopDocuments] = useState([]);
    const [accessTypes, setAccessTypes] = useState([]);
    const [yearRange, setYearRange] = useState([]);
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [maxDisplayCount, setMaxDisplayCount] = useState(15);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState(null);
    const [rawData, setRawData] = useState([]);
    const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(null);
    const [customSegmentColors, setCustomSegmentColors] = useState({});

    const defaultColors = [
        "#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea",
        "#0891b2", "#be123c", "#15803d", "#854d0e", "#7e22ce"
    ];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (startYear && endYear && yearRange.length > 0) {
            processData();
        }
    }, [startYear, endYear, maxDisplayCount]);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("http://3.6.36.17:80/api/get-data/");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRawData(data);
            const years = [...new Set(data.map(item => item.Year))].sort();
            setYearRange(years);
            if (!startYear) setStartYear(years[0]);
            if (!endYear) setEndYear(years[years.length - 1]);
            processData(data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const processData = () => {
        if (!rawData.length) return;

        const filteredData = rawData.filter(item => {
            const year = parseInt(item.Year);
            return year >= parseInt(startYear) && year <= parseInt(endYear);
        });

        // Process Open Access Status
        const accessCounts = filteredData.reduce((acc, item) => {
            let status = (item["Open Access"] || "").toLowerCase().trim();
            if (status.includes("open access") || status.includes("oa") || status.includes("All Open Access; Hybrid Gold Open Access")) {
                status = "Open Access";
            } else {
                status = "Not Open Access";
            }
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        accessCounts["Open Access"] = accessCounts["Open Access"] || 0;
        accessCounts["Not Open Access"] = accessCounts["Not Open Access"] || 0;

        const sortedAccess = Object.entries(accessCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, maxDisplayCount);

        setAccessTypes(sortedAccess);
    };

    const generateSummary = async () => {
        setIsSummarizing(true);
        setSummaryError(null);
        setSummary("");

        try {
            const summaryData = chartConfig.publicationType === 'document' ? 
                topDocuments.map(([docType, count]) => ({
                    type: docType,
                    count
                })) :
                accessTypes.map(([status, count]) => ({
                    type: status,
                    count
                }));

            const total = summaryData.reduce((sum, item) => sum + item.count, 0);
            const avg = total / summaryData.length;
            const maxCount = Math.max(...summaryData.map(item => item.count));
            const topType = summaryData.find(item => item.count === maxCount);

            const prompt = `
                Please analyze this ${chartConfig.publicationType = 'open access status'} distribution data and provide a clear, concise summary:
                
                Time Period: ${startYear} to ${endYear}
                Number of ${chartConfig.publicationType ='Statuses'} Shown: ${maxDisplayCount}
                Total ${chartConfig.publicationType === 'document' ? 'Documents' : 'Publications'}: ${total}
                
                Key Statistics:
                - Average ${chartConfig.publicationType ='Publications'} per ${chartConfig.publicationType === 'document' ? 'Type' : 'Status'}: ${avg.toFixed(2)}
                - Top ${chartConfig.publicationType ='Status'}: ${topType?.type} (${topType?.count} ${chartConfig.publicationType ='publications'})
                
                ${chartConfig.publicationType ='Status'} Data:
                ${summaryData.map(item => `${item.type}: ${item.count} ${chartConfig.publicationType = 'publications'}`).join('\n')}
                
                Please provide a concise analysis of the distribution, patterns, and notable observations in this ${chartConfig.publicationType ='open access status'} distribution data.
            `;

            const response = await axios.post(
                "http://3.6.36.17:80/api/generate-summary/",
                { prompt },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000
                }
            );

            if (!response.data || !response.data.summary) {
                throw new Error("Invalid response format from server");
            }

            setSummary(response.data.summary);
        } catch (error) {
            setSummaryError(
                error.response?.data?.error || 
                error.message || 
                "An error occurred while generating the summary"
            );
        } finally {
            setIsSummarizing(false);
        }
    };

    const getSegmentColors = () => {
        // For pie/doughnut charts, use custom colors if defined, otherwise use default colors
        if (chartConfig.visualizationType === 'pie' || chartConfig.visualizationType === 'doughnut') {
            const labels = chartConfig.publicationType === 'document' ? 
                topDocuments.map(([name]) => name) : 
                accessTypes.map(([name]) => name || "Not Specified");
            
            return labels.map((label, index) => 
                customSegmentColors[index] || defaultColors[index % defaultColors.length]
            );
        }
        
        // For bar charts, use the line color
        return chartConfig.lineColor;
    };

    const getBorderColors = () => {
        // For pie/doughnut charts, use the point color as border
        if (chartConfig.visualizationType === 'pie' || chartConfig.visualizationType === 'doughnut') {
            return new Array(
                (chartConfig.publicationType === 'document' ? topDocuments.length : accessTypes.length)
            ).fill(chartConfig.pointColor);
        }
        
        // For bar charts, use the point color
        return chartConfig.pointColor;
    };

    const handleChartClick = (event, chartElements) => {
        if (!chartElements.length) return;
        if (chartConfig.visualizationType !== 'pie' && chartConfig.visualizationType !== 'doughnut') return;
        
        const index = chartElements[0].index;
        setSelectedSegmentIndex(index);
    };

    // Update segment color when the color picker changes and a segment is selected
    const handleColorChange = (color) => {
        if (selectedSegmentIndex !== null && 
            (chartConfig.visualizationType === 'pie' || chartConfig.visualizationType === 'doughnut')) {
            setCustomSegmentColors(prev => ({
                ...prev,
                [selectedSegmentIndex]: color
            }));
        } else {
            setChartConfig(prev => ({ ...prev, lineColor: color }));
        }
    };

    const chartData = {
        labels: chartConfig.publicationType === 'document' ? 
            topDocuments.map(([name]) => name) : 
            accessTypes.map(([name]) => name || "Not Specified"),
        datasets: [{
            label: "Count",
            data: chartConfig.publicationType === 'document' ? 
                topDocuments.map(([, count]) => count) : 
                accessTypes.map(([, count]) => count),
            backgroundColor: getSegmentColors(),
            borderColor: getBorderColors(),
            borderWidth: 1,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: chartConfig.orientation === "horizontal" ? "y" : "x",
        onClick: handleChartClick,
        plugins: {
            legend: {
                display: chartConfig.showLegend,
                position: "top",
                labels: {
                    color: "#000000",
                    font: {
                        size: chartConfig.fontSize,
                    },
                },
            },
            title: {
                display: chartConfig.showTitle,
                text: chartConfig.publicationType = 'Open Access Status Distribution',
                color: "#000000",
                font: {
                    size: chartConfig.fontSize + 4,
                },
            },
            tooltip: {
                enabled: true,
                bodyFont: {
                    size: chartConfig.fontSize,
                },
            },
            datalabels: {
                color: '#000000',
                font: {
                    size: 12,
                    weight: 'bold'
                }
            }
        },
        scales: chartConfig.visualizationType === "bar" ? {
            x: {
                display: true,
                beginAtZero: true,
                grid: {
                    display: chartConfig.showGrid,
                    drawBorder: true,
                    borderColor: "#000000",
                },
                ticks: {
                    display: true,
                    color: "#000000",
                    font: {
                        size: chartConfig.tickLabelSize,
                    },
                    maxRotation: chartConfig.xAxisTickRotation || 0,
                    minRotation: chartConfig.xAxisTickRotation || 0
                },
                border: {
                    color: "#000000",
                },
                title: {
                    display: true,
                    text: chartConfig.orientation === "horizontal" ? 
                        chartConfig.yAxisLabel : 
                        chartConfig.xAxisLabel,
                    color: "#000000",
                    font: {
                        size: chartConfig.AxisLabelSize,
                    },
                },
            },
            y: {
                display: true,
                beginAtZero: true,
                grid: {
                    display: chartConfig.showGrid,
                    drawBorder: true,
                    borderColor: "#000000",
                },
                border: {
                    color: "#000000",
                },
                ticks: {
                    display: true,
                    color: "#000000",
                    font: {
                        size: chartConfig.tickLabelSize,
                    },
                    maxRotation: chartConfig.yAxisTickRotation || 0,
                    minRotation: chartConfig.yAxisTickRotation || 0
                },
                title: {
                    display: true,
                    text: chartConfig.orientation === "horizontal" ? 
                        chartConfig.xAxisLabel : 
                        chartConfig.yAxisLabel,
                    color: "#000000",
                    font: {
                        size: chartConfig.AxisLabelSize,
                    },
                },
            },
        } : {}
    };

    const handleDownload = (format) => {
        const chartElement = chartRef.current?.canvas;
        if (!chartElement) return;

        if (format === 'png') {
            const originalBackground = chartElement.style.background;
            chartElement.style.background = 'white';
            
            toPng(chartElement, {
                backgroundColor: '#ffffff',
                style: { background: 'white' },
            })
                .then((dataUrl) => {
                    saveAs(dataUrl, `${chartConfig.publicationType === 'document' ? 'document' : 'open_access'}_distribution.png`);
                    chartElement.style.background = originalBackground;
                })
                .catch((err) => {
                    console.error('Error downloading chart:', err);
                    chartElement.style.background = originalBackground;
                });
        }
    };

    const exportToCSV = () => {
        const csvData = chartConfig.publicationType === 'document' ? 
            topDocuments.map(([docType, count]) => `${docType},${count}`) : 
            accessTypes.map(([status, count]) => `${status},${count}`);
        const blob = new Blob([`${chartConfig.publicationType ='Status'},Count\n${csvData.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${chartConfig.publicationType === 'document' ? 'document' : 'open_access'}_distribution.csv`);
    };

    const handleSectionToggle = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <MenuLayout>
            <div className="w-full h-screen overflow-y-auto">
                <div className="content-con w-full">
                    {/* Plot Container */}
                    <div className="plot-con">
                        <div className="plot-header">
                            <h2 className="text-xl font-semibold text-center">Open Access Analysis</h2>
                        </div>
                        <div className="plot-content border m-2 rounded-md bg-white">
                            {chartConfig.visualizationType === 'bar' && (
                                <Bar ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartConfig.visualizationType === 'pie' && (
                                <Pie ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartConfig.visualizationType === 'doughnut' && (
                                <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                        </div>
                        <div className="plot-caption my-2 text-center">
                            <p>Caption</p>
                        </div>
                    </div>

                    {/* Features Container */}
                    <div className="features-con">
                        {/* Tools Section */}
                        <Collapsible
                            open={openSections.tools}
                            onOpenChange={() => handleSectionToggle('tools')}
                            className="tools-con"
                        >
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="w-full section-header">
                                    <span className="font-semibold">Chart Controls</span>
                                    {openSections === 'tools' ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="section-content">
                                {/* Actions Row */}
                                <div className="tools-full flex gap-2 mb-4">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload('png')}>
                                        <DownloadCloud className="h-4 w-4 mr-2" />
                                        Export PNG
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1" onClick={exportToCSV}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save CSV
                                    </Button>
                                </div>

                                <div className="tools-grid">
                                    {/* Left Column */}
                                    <div className="space-y-3">
                                        {/* Visualization Type */}
                                        <div className="space-y-2">
                                            <Label className="text-xs">Visualization</Label>
                                            <Select
                                                value={chartConfig.visualizationType}
                                                onValueChange={(value) => {
                                                    setChartConfig(prev => ({ ...prev, visualizationType: value }));
                                                    setSelectedSegmentIndex(null); // Reset selected segment when changing chart type
                                                    setCustomSegmentColors({}); // Reset custom colors
                                                }}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pie">Pie</SelectItem>
                                                    <SelectItem value="bar">Bar</SelectItem>
                                                    <SelectItem value="doughnut">Doughnut</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-3">
                                        {/* Year Gap */}
                                        <div className="space-y-2">
                                            <Label className="text-xs">Orientation</Label>
                                            <Select
                                                value={chartConfig.orientation}
                                                onValueChange={(value) => setChartConfig(prev => ({ 
                                                    ...prev, 
                                                    orientation: value 
                                                }))}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="vertical">Vertical</SelectItem>
                                                    <SelectItem value="horizontal">Horizontal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="customization-options">
                                    <div className="my-3 mb-1">
                                        <p className="text-sm font-semibold text-gray-400">Customization</p>
                                    </div>
                                    <div className="tools-grid">
                                        {/* Left Column */}
                                        <div className="space-y-3">
                                            {/* Axis Label Inputs */}
                                            <div className="flex flex-col gap-2">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">X Label</Label>
                                                    <Input
                                                        value={chartConfig.xAxisLabel}
                                                        onChange={(e) => setChartConfig(prev => ({ ...prev, xAxisLabel: e.target.value }))}
                                                        className="h-8"
                                                    />
                                                </div>
                                            </div>

                                            {/* Font Controls */}
                                            <div className="space-y-2">
                                                <Label className="text-xs">Title Size</Label>
                                                <Slider
                                                    value={[chartConfig.fontSize]}
                                                    onValueChange={(value) => setChartConfig(prev => ({ ...prev, fontSize: value[0] }))}
                                                    min={8}
                                                    max={16}
                                                    step={1}
                                                    className="py-0"
                                                />
                                            </div>

                                            {/* Axis Labels */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label className="text-xs">Label Size</Label>
                                                    <Slider
                                                        value={[chartConfig.AxisLabelSize]}
                                                        onValueChange={(value) => setChartConfig(prev => ({ ...prev, AxisLabelSize: value[0] }))}
                                                        min={12}
                                                        max={23}
                                                        step={1}
                                                        className="py-0"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Tick Size</Label>
                                                    <Slider
                                                        value={[chartConfig.tickLabelSize]}
                                                        onValueChange={(value) => setChartConfig(prev => ({ ...prev, tickLabelSize: value[0] }))}
                                                        min={10}
                                                        max={20}
                                                        step={1}
                                                        className="py-0"
                                                    />
                                                </div>
                                            </div>

                                            {/* Colors */}
                                            <div className='flex gap-2'>
                                                <div className="space-y-2 flex-1">
                                                    <Label className="text-xs">
                                                        {selectedSegmentIndex !== null && 
                                                         (chartConfig.visualizationType === 'pie' || chartConfig.visualizationType === 'doughnut') 
                                                            ? `Segment ${selectedSegmentIndex + 1} Color` 
                                                            : 'Fill Color'}
                                                    </Label>
                                                    <Input
                                                        type="color"
                                                        value={
                                                            selectedSegmentIndex !== null && 
                                                            (chartConfig.visualizationType === 'pie' || chartConfig.visualizationType === 'doughnut')
                                                                ? customSegmentColors[selectedSegmentIndex] || 
                                                                  defaultColors[selectedSegmentIndex % defaultColors.length]
                                                                : chartConfig.lineColor
                                                        }
                                                        onChange={(e) => handleColorChange(e.target.value)}
                                                        className="h-8 w-full p-1"
                                                    />
                                                </div>
                                                <div className="space-y-2 flex-1">
                                                    <Label className="text-xs">
                                                        {chartConfig.visualizationType === 'pie' || chartConfig.visualizationType === 'doughnut' 
                                                            ? 'Border Color' 
                                                            : 'Point Color'}
                                                    </Label>
                                                    <Input
                                                        type="color"
                                                        value={chartConfig.pointColor}
                                                        onChange={(e) => setChartConfig(prev => ({ ...prev, pointColor: e.target.value }))}
                                                        className="h-8 w-full p-1"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Selection instruction for pie/doughnut */}
                                            {(chartConfig.visualizationType === 'pie' || chartConfig.visualizationType === 'doughnut') && (
                                                <div className="text-sm text-gray-500 italic">
                                                    Click on a segment to select and change its color
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-3">
                                            <div className="flex flex-col gap-2">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Y Label</Label>
                                                    <Input
                                                        value={chartConfig.yAxisLabel}
                                                        onChange={(e) => setChartConfig(prev => ({ ...prev, yAxisLabel: e.target.value }))}
                                                        className="h-8"
                                                    />
                                                </div>
                                            </div>
                                            {/* Display Options */}
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <Label className="text-xs">X Rotation</Label>
                                                        <Slider
                                                            value={[chartConfig.xAxisTickRotation]}
                                                            onValueChange={(value) => setChartConfig(prev => ({ 
                                                                ...prev, 
                                                                xAxisTickRotation: value[0] 
                                                            }))}
                                                            min={0}
                                                            max={90}
                                                            step={5}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Y Rotation</Label>
                                                        <Slider
                                                            value={[chartConfig.yAxisTickRotation]}
                                                            onValueChange={(value) => setChartConfig(prev => ({ 
                                                                ...prev, 
                                                                yAxisTickRotation: value[0] 
                                                            }))}
                                                            min={0}
                                                            max={90}
                                                            step={5}
                                                        />
                                                    </div>
                                                </div>
                                                <Label className="text-xs">Display Options</Label>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="showLegend"
                                                            checked={chartConfig.showLegend}
                                                            onCheckedChange={(checked) =>
                                                                setChartConfig(prev => ({ ...prev, showLegend: checked }))
                                                            }
                                                        />
                                                        <label
                                                            htmlFor="showLegend"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            Show Legend
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="showGrid"
                                                            checked={chartConfig.showGrid}
                                                            onCheckedChange={(checked) =>
                                                                setChartConfig(prev => ({ ...prev, showGrid: checked }))
                                                            }
                                                        />
                                                        <label
                                                            htmlFor="showGrid"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            Show Grid
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="showTitle"
                                                            checked={chartConfig.showTitle}
                                                            onCheckedChange={(checked) =>
                                                                setChartConfig(prev => ({ ...prev, showTitle: checked }))
                                                            }
                                                        />
                                                        <label
                                                            htmlFor="showTitle"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            Show Title
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Summary Section */}
                        <Collapsible
                            open={openSections.summary}
                            onOpenChange={() => handleSectionToggle('summary')}
                            className="mt-4"
                        >
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="w-full section-header">
                                    <span className="font-semibold">Summary</span>
                                    {openSections.summary ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="section-content">
                                <div className="space-y-4">
                                    <Button
                                        onClick={generateSummary}
                                        disabled={isSummarizing}
                                        className="w-full"
                                    >
                                        Generate Summary
                                    </Button>
                                    {summaryError && (
                                        <p className="text-red-500 text-sm">{summaryError}</p>
                                    )}
                                    {summary && (
                                        <div className="p-4 bg-gray-50 rounded-md">
                                            <p className="text-sm text-black">{summary}</p>
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>
            </div>
        </MenuLayout>
    );
};

export default Open_Access;