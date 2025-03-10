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
    LogarithmicScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
import { ChevronDown, ChevronUp, DownloadCloud, Save } from 'lucide-react';
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
    Legend,
    LogarithmicScale,
);

const Document_type = () => {
    // State Management
    const [openSections, setOpenSections] = useState({ tools: true, summary: true });
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
        xAxisLabel: 'Document types',
        yAxisLabel: 'Number of types of Documents',
        xAxisTickRotation: 0,
        yAxisTickRotation: 0
    });
    const chartRef = useRef(null);
    const [topDocuments, setTopDocuments] = useState([]);
    const [yearRange, setYearRange] = useState([]);
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [maxDisplayCount, setMaxDisplayCount] = useState(7);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState(null);
    const [rawData, setRawData] = useState([]);
    const [useLogScale, setUseLogScale] = useState(false);

    const colors = [
        "#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea",
        "#0891b2", "#be123c", "#15803d", "#854d0e", "#7e22ce"
    ];

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Process data when startYear, endYear, or maxDisplayCount changes
    useEffect(() => {
        if (startYear && endYear && yearRange.length > 0) {
            processDocumentData();
        }
    }, [startYear, endYear, maxDisplayCount]);

    // Helper Functions
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/get-data/");
            const data = response.data;
            setRawData(data);

            const years = [...new Set(data.map(item => item.Year))].sort();
            setYearRange(years);
            setStartYear(years[0]);
            setEndYear(years[years.length - 1]);

            processDocumentData();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const processDocumentData = () => {
        if (!rawData.length) return;

        const filteredData = rawData.filter(item => {
            const year = parseInt(item.Year);
            return year >= parseInt(startYear) && year <= parseInt(endYear);
        });

        const documentCounts = filteredData.reduce((acc, item) => {
            const docType = item['Document Type'] ||
                item['document type'] ||
                item['Document'] ||
                item['document'];

            if (docType && docType.trim() !== '' && docType.toLowerCase() !== 'null') {
                const normalizedType = docType.trim();
                acc[normalizedType] = (acc[normalizedType] || 0) + 1;
            }
            return acc;
        }, {});

        const sortedDocuments = Object.entries(documentCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, maxDisplayCount);

        setTopDocuments(sortedDocuments);
    };

    const generateSummary = async () => {
        setIsSummarizing(true);
        setSummaryError(null);
        setSummary("");

        try {
            const summaryData = topDocuments.map(([docType, count]) => ({
                documentType: docType,
                count
            }));

            const totalDocuments = summaryData.reduce((sum, item) => sum + item.count, 0);
            const avgDocuments = totalDocuments / summaryData.length;
            const maxCount = Math.max(...summaryData.map(item => item.count));
            const topDocumentType = summaryData.find(item => item.count === maxCount);

            const prompt = `
                Please analyze this document type distribution data and provide a clear, concise summary:
                
                Time Period: ${startYear} to ${endYear}
                Number of Document Types Shown: ${maxDisplayCount}
                Total Documents: ${totalDocuments}
                
                Key Statistics:
                - Average Documents per Type: ${avgDocuments.toFixed(2)}
                - Top Document Type: ${topDocumentType?.documentType} (${topDocumentType?.count} documents)
                
                Document Type Data:
                ${summaryData.map(item => `${item.documentType}: ${item.count} documents`).join('\n')}
                
                Please provide a concise analysis of the distribution, patterns, and notable observations in this document type distribution data.
            `;

            const response = await axios.post(
                "http://127.0.0.1:8000/api/generate-summary/",
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

    const chartData = {
        labels: topDocuments.map(([name]) => name),
        datasets: [{
            label: "Count",
            data: topDocuments.map(([, count]) => count),
            backgroundColor: chartConfig.visualizationType === "bar" ?
                chartConfig.lineColor :
                colors,
            borderColor: chartConfig.visualizationType === "bar" ?
                chartConfig.pointColor :
                colors,
            borderWidth: 1,
        }],
    };

    const getChartOptions = () => {
        const isHorizontal = chartConfig.orientation === "horizontal";
        const valueAxis = isHorizontal ? "x" : "y";
        const categoryAxis = isHorizontal ? "y" : "x";
        const isPieOrDoughnut = chartConfig.visualizationType === "pie" || chartConfig.visualizationType === "doughnut";

        const getLogTicksAndLabels = () => {
            const ticks = [];
            const labels = new Map();
            const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵'];
            for (let i = 0; i <= 5; i++) {
                const value = Math.pow(10, i);
                ticks.push(value);
                labels.set(value, `10${superscripts[i]}`);
            }
            return { ticks: ticks.sort((a, b) => a - b), labels };
        };

        const { ticks, labels } = getLogTicksAndLabels();

        return {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: isHorizontal ? "y" : "x",
            plugins: {
                legend: {
                    display: chartConfig.showLegend,
                    position: "top",
                    labels: {
                        color: "#000000",
                        font: { size: chartConfig.fontSize },
                    },
                },
                title: {
                    display: chartConfig.showTitle,
                    text: `Top ${maxDisplayCount} Languages by Number of Documents`,
                    color: "#000000",
                    font: { size: chartConfig.fontSize + 4 },
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (context) {
                            return ` ${context.raw.toLocaleString()}`;
                        }
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
            scales: isPieOrDoughnut ? {} : {
                [valueAxis]: {
                    type: useLogScale ? "logarithmic" : "linear",
                    display: true,
                    grid: { display: chartConfig.showGrid },
                    min: useLogScale ? 1 : 0,
                    title: {
                        display: true,
                        text: chartConfig.xAxisLabel,
                        font: { size: chartConfig.AxisLabelSize },
                    },
                    ticks: {
                        font: { size: chartConfig.tickLabelSize },
                        maxRotation: isHorizontal ? chartConfig.xAxisTickRotation : chartConfig.yAxisTickRotation,
                        minRotation: isHorizontal ? chartConfig.xAxisTickRotation : chartConfig.yAxisTickRotation,
                        callback: function (value) {
                            if (useLogScale) {
                                if (ticks.includes(value)) {
                                    return labels.get(value);
                                }
                                return '';
                            }
                            return value.toLocaleString();
                        },
                    },
                },
                [categoryAxis]: {
                    display: true,
                    grid: { display: chartConfig.showGrid },
                    title: {
                        display: true,
                        text: chartConfig.yAxisLabel,
                        font: { size: chartConfig.AxisLabelSize },
                    },
                    ticks: {
                        font: { size: chartConfig.fontSize },
                        maxRotation: isHorizontal ? chartConfig.yAxisTickRotation : chartConfig.xAxisTickRotation,
                        minRotation: isHorizontal ? chartConfig.yAxisTickRotation : chartConfig.xAxisTickRotation,
                    },
                },
            },
        };
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
                    saveAs(dataUrl, 'document_distribution.png');
                    chartElement.style.background = originalBackground;
                })
                .catch((err) => {
                    console.error('Error downloading chart:', err);
                    chartElement.style.background = originalBackground;
                });
        }
    };

    const exportToCSV = () => {
        const csvData = topDocuments.map(([docType, count]) => `${docType},${count}`).join('\n');
        const blob = new Blob([`Document Type,Count\n${csvData}`], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'document_distribution.csv');
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
                            <h2 className="text-xl font-semibold text-center">Document Types</h2>
                        </div>
                        <div className="plot-content border m-2 rounded-md bg-white">
                            {chartConfig.visualizationType === 'bar' && (
                                <Bar ref={chartRef} data={chartData} options={getChartOptions()} />
                            )}
                            {chartConfig.visualizationType === 'pie' && (
                                <Pie ref={chartRef} data={chartData} options={getChartOptions()} />
                            )}
                            {chartConfig.visualizationType === 'doughnut' && (
                                <Doughnut ref={chartRef} data={chartData} options={getChartOptions()} />
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
                                    {openSections.tools ? (
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
                                                onValueChange={(value) => setChartConfig(prev => ({ ...prev, visualizationType: value }))}
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
                                        <div className="space-y-2">
                                            <Label className="text-xs">Count</Label>
                                            <Select
                                                value={maxDisplayCount.toString()}
                                                onValueChange={(value) => setMaxDisplayCount(parseInt(value))}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select count" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="3">Top 3</SelectItem>
                                                    <SelectItem value="5">Top 5</SelectItem>
                                                    <SelectItem value="7">Top 7</SelectItem>
                                                    <SelectItem value="10">Top 10</SelectItem>
                                                    <SelectItem value="15">Top 15</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-3">
                                        {/* Orientation */}
                                        <div className="space-y-2">
                                            <Label className="text-xs">Orientation</Label>
                                            <Select
                                                value={chartConfig.orientation}
                                                onValueChange={(value) => setChartConfig(prev => ({ ...prev, orientation: value }))}
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
                                        <div className="space-y-2">
                                            <Label className="text-xs">Scale</Label>
                                            <Select
                                                value={useLogScale ? "Logarithmic" : "Normal"}
                                                onValueChange={(value) => setUseLogScale(value === "Logarithmic")}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Normal">Linear Scale</SelectItem>
                                                    <SelectItem value="Logarithmic">Logarithmic Scale</SelectItem>
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
                                                    <Label className="text-xs">Line Color</Label>
                                                    <Input
                                                        type="color"
                                                        value={chartConfig.lineColor}
                                                        onChange={(e) => setChartConfig(prev => ({ ...prev, lineColor: e.target.value }))}
                                                        className="h-8 w-full p-1"
                                                    />
                                                </div>
                                                <div className="space-y-2 flex-1">
                                                    <Label className="text-xs">Point Color</Label>
                                                    <Input
                                                        type="color"
                                                        value={chartConfig.pointColor}
                                                        onChange={(e) => setChartConfig(prev => ({ ...prev, pointColor: e.target.value }))}
                                                        className="h-8 w-full p-1"
                                                    />
                                                </div>
                                            </div>
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

                                            {/* Rotation Controls */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label className="text-xs">X Rotation</Label>
                                                    <Slider
                                                        value={[chartConfig.xAxisTickRotation]}
                                                        onValueChange={(value) => setChartConfig(prev => ({ ...prev, xAxisTickRotation: value[0] }))}
                                                        min={0}
                                                        max={90}
                                                        step={5}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Y Rotation</Label>
                                                    <Slider
                                                        value={[chartConfig.yAxisTickRotation]}
                                                        onValueChange={(value) => setChartConfig(prev => ({ ...prev, yAxisTickRotation: value[0] }))}
                                                        min={0}
                                                        max={90}
                                                        step={5}
                                                    />
                                                </div>
                                            </div>

                                            {/* Display Options */}
                                            <div className="space-y-2">
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

export default Document_type;