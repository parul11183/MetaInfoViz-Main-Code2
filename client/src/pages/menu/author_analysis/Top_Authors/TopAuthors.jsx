import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const TopAuthors = () => {
    const [openSection, setOpenSection] = useState('tools');
    const [data, setData] = useState([]);
    const [topAuthors, setTopAuthors] = useState([]);
    const [yearRange, setYearRange] = useState([]);
    const [noDataMessage, setNoDataMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [displayedAuthorsCount, setDisplayedAuthorsCount] = useState(0);
    const [chartColors, setChartColors] = useState([]);

    const generateColors = (count) => {
        return Array.from({ length: count }, () => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
    };

    const [chartConfig, setChartConfig] = useState({
        startYear: '',
        endYear: '',
        visualizationType: 'horizontal', // 'vertical' or 'horizontal'
        count: '15',
        barColor: '#6d28d9',
        fontSize: 12,
        axisTickSize: 10,
        showLegend: true,
        showGrid: true,
        showTitle: true,
        axisLabelSize: 12,
        xAxisLabel: 'Authors',
        yAxisLabel: 'Publications',
        xAxisTickRotation: 0,
        yAxisTickRotation: 0
    });

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://13.233.2.203:80/api/get-data/");
            const jsonData = response.data;
            console.log("Fetched Data:", jsonData);

            const years = [...new Set(jsonData.map(item => item.Year))].sort();
            setYearRange(years);
            setChartConfig(prev => ({
                ...prev,
                startYear: years[0] || '',
                endYear: years[years.length - 1] || ''
            }));

            setData(jsonData);
            processAuthorData(jsonData);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.message);
            setNoDataMessage("Failed to load author data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (topAuthors.length > 0) {
            setChartColors(generateColors(topAuthors.length));
        }
    }, [topAuthors]);

    useEffect(() => {
        if (data.length > 0) {
            processAuthorData(data);
        }
    }, [chartConfig.startYear, chartConfig.endYear, chartConfig.count, data]);

    const processAuthorData = (rawData) => {
        // Filter data based on selected year range
        let filteredData = rawData;
        if (chartConfig.startYear && chartConfig.endYear) {
            filteredData = rawData.filter(
                item => item.Year >= parseInt(chartConfig.startYear) &&
                    item.Year <= parseInt(chartConfig.endYear)
            );
        }

        // Count publications by author
        const authorCounts = {};
        filteredData.forEach(item => {
            const authors = item.Authors ? item.Authors.split(";").map(author => author.trim()) : [];
            authors.forEach(author => {
                authorCounts[author] = (authorCounts[author] || 0) + 1;
            });
        });

        // Sort and slice to get top N authors
        const sortedAuthors = Object.entries(authorCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, parseInt(chartConfig.count));

        setTopAuthors(sortedAuthors);
        setDisplayedAuthorsCount(Object.keys(authorCounts).length);
        setNoDataMessage(sortedAuthors.length === 0 ? "No data available for the selected year range" : "");
    };

    const generateSummary = async () => {
        setIsSummarizing(true);
        setSummary("");
        try {
            const response = await axios.post('http://13.233.2.203:80/api/generate-summary/', {
                authors: topAuthors,
                yearRange: { start: chartConfig.startYear, end: chartConfig.endYear },
                totalAuthors: displayedAuthorsCount
            });

            setSummary(response.data.summary);
        } catch (err) {
            console.error('Error generating summary:', err);
        } finally {
            setIsSummarizing(false);
        }
    };

    const chartData = {
        labels: topAuthors.map(item => item[0]),
        datasets: [{
            label: 'Number of Publications',
            data: topAuthors.map(item => item[1]),
            backgroundColor: chartConfig.barColor,
            borderColor: '#fff',
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: chartConfig.visualizationType === 'horizontal' ? 'y' : 'x', // Dynamic axis for horizontal/vertical bars
        plugins: {
            legend: {
                display: chartConfig.showLegend,
            },
            title: {
                display: chartConfig.showTitle,
                text: `Top ${chartConfig.count} Authors (${chartConfig.startYear}-${chartConfig.endYear})`,
                font: {
                    size: chartConfig.fontSize
                }
            }
        },
        scales: {
            x: {
                grid: { display: chartConfig.showGrid },
                title: { display: true, text: chartConfig.visualizationType === 'horizontal' ? chartConfig.yAxisLabel : chartConfig.xAxisLabel, font: { size: chartConfig.axisLabelSize } },
                ticks: {
                    font: { size: chartConfig.axisTickSize },
                    autoSkip: false,
                    maxRotation: chartConfig.xAxisTickRotation,
                    minRotation: chartConfig.xAxisTickRotation
                }
            },
            y: {
                grid: { display: chartConfig.showGrid },
                title: { display: true, text: chartConfig.visualizationType === 'horizontal' ? chartConfig.xAxisLabel : chartConfig.yAxisLabel, font: { size: chartConfig.axisLabelSize } },
                ticks: {
                    font: { size: chartConfig.axisTickSize },
                    autoSkip: false,
                    maxRotation: chartConfig.yAxisTickRotation,
                    minRotation: chartConfig.yAxisTickRotation
                }
            }
        }
    };

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleDownloadImage = () => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;
    
        // Get the device pixel ratio
        const pixelRatio = window.devicePixelRatio || 1;
    
        // Create a new canvas with higher resolution
        const newCanvas = document.createElement('canvas');
        const context = newCanvas.getContext('2d');
    
        if (!context) return;
    
        // Set the actual width and height of the canvas
        const rect = canvas.getBoundingClientRect();
    
        // Scale the canvas dimensions by the pixel ratio
        newCanvas.width = rect.width * pixelRatio;
        newCanvas.height = rect.height * pixelRatio;
    
        // Scale the context to ensure proper resolution
        context.scale(pixelRatio, pixelRatio);
    
        // Set white background
        context.fillStyle = "white";
        context.fillRect(0, 0, rect.width, rect.height);
    
        // Draw the original canvas content onto the new canvas
        context.drawImage(canvas, 0, 0, rect.width, rect.height);
    
        // Get the high-resolution data URL
        const url = newCanvas.toDataURL('image/png', 1.0);
    
        // Create and trigger download
        const link = document.createElement('a');
        link.download = `author-analysis-${chartConfig.startYear}-${chartConfig.endYear}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadCSV = () => {
        const csvContent = "Author,Publications\n" +
            topAuthors.map(([author, count]) => `"${author}",${count}`).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `author-data-${chartConfig.startYear}-${chartConfig.endYear}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <MenuLayout>
            <div className="w-full">
                <div className="content-con w-full">
                    <div className="plot-con">
                        <div className="plot-header">
                            <h2 className="text-xl font-semibold text-center">Top Authors Analysis</h2>
                        </div>
                        <div className="plot-content border m-2 rounded-md bg-white h-[500px]">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                                </div>
                            ) : (
                                <Bar data={chartData} options={options} />
                            )}
                        </div>
                    </div>

                    {/* Features Container */}
                    <div className="features-con">
                        {/* Tools Section */}
                        <Collapsible
                            open={openSection === 'tools'}
                            onOpenChange={() => handleSectionToggle('tools')}
                            className="tools-con"
                        >
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="w-full section-header">
                                    <span className="font-semibold">Chart Controls</span>
                                    {openSection === 'tools' ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="section-content">
                                {/* Actions Row */}
                                <div className="tools-full flex gap-2 mb-4">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={handleDownloadImage}>
                                        <DownloadCloud className="h-4 w-4 mr-2" />
                                        Export PNG
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1" onClick={handleDownloadCSV}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save CSV
                                    </Button>
                                </div>

                                <div className="tools-grid">
                                    {/* Left Column */}
                                    <div className="space-y-3">
                                        {/* Visualization Type */}
                                        <div className="space-y-2">
                                            <Label className="text-xs">Chart Orientation</Label>
                                            <Select
                                                value={chartConfig.visualizationType}
                                                onValueChange={(value) => setChartConfig(prev => ({ ...prev, visualizationType: value }))}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="vertical">Vertical Bar</SelectItem>
                                                    <SelectItem value="horizontal">Horizontal Bar</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Start Year</Label>
                                            <Select
                                                value={chartConfig.startYear}
                                                onValueChange={(value) => setChartConfig(prev => ({ ...prev, startYear: value }))}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {yearRange.map(year => (
                                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-3">
                                        {/* Count */}
                                        <div className="space-y-2">
                                            <Label className="text-xs">Count</Label>
                                            <Select
                                                value={chartConfig.count}
                                                onValueChange={(value) => setChartConfig(prev => ({ ...prev, count: value }))}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="10">Top 10</SelectItem>
                                                    <SelectItem value="15">Top 15</SelectItem>
                                                    <SelectItem value="20">Top 20</SelectItem>
                                                    <SelectItem value="25">Top 25</SelectItem>
                                                    <SelectItem value="30">Top 30</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* End Year */}
                                        <div className="space-y-2">
                                            <Label className="text-xs">End Year</Label>
                                            <Select
                                                value={chartConfig.endYear}
                                                onValueChange={(value) => setChartConfig(prev => ({ ...prev, endYear: value }))}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {yearRange.map(year => (
                                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Customization Options */}
                                <div className="customization-options">
                                    <div className="my-3 mb-1">
                                        <p className="text-sm font-semibold text-gray-400">Customization</p>
                                    </div>
                                    <div className="tools-grid">
                                        {/* Left Column */}
                                        <div className="space-y-3">
                                            {/* Axis Label Inputs */}
                                            <div className="space-y-1">
                                                <Label className="text-xs">X Label</Label>
                                                <Input
                                                    value={chartConfig.xAxisLabel}
                                                    onChange={(e) => setChartConfig(prev => ({ ...prev, xAxisLabel: e.target.value }))}
                                                    className="h-8"
                                                />
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
                                                        value={[chartConfig.axisLabelSize]}
                                                        onValueChange={(value) => setChartConfig(prev => ({ ...prev, axisLabelSize: value[0] }))}
                                                        min={10}
                                                        max={20}
                                                        step={1}
                                                        className="py-0"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Tick Size</Label>
                                                    <Slider
                                                        value={[chartConfig.axisTickSize]}
                                                        onValueChange={(value) => setChartConfig(prev => ({ ...prev, axisTickSize: value[0] }))}
                                                        min={4}
                                                        max={20}
                                                        step={1}
                                                        className="py-0"
                                                    />
                                                </div>
                                            </div>

                                            {/* Colors */}
                                            <div className="flex gap-2">
                                                <div className="space-y-2 flex-1">
                                                    <Label className="text-xs">Bar Color</Label>
                                                    <Input
                                                        type="color"
                                                        value={chartConfig.barColor}
                                                        onChange={(e) => setChartConfig(prev => ({ ...prev, barColor: e.target.value }))}
                                                        className="h-8 w-full p-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Y Label</Label>
                                                <Input
                                                    value={chartConfig.yAxisLabel}
                                                    onChange={(e) => setChartConfig(prev => ({ ...prev, yAxisLabel: e.target.value }))}
                                                    className="h-8"
                                                />
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
                                                        className="py-0"
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
                                                        className="py-0"
                                                    />
                                                </div>
                                            </div>

                                            {/* Checkboxes */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={chartConfig.showLegend}
                                                        onCheckedChange={(checked) => setChartConfig(prev => ({ ...prev, showLegend: checked }))}
                                                    />
                                                    <Label className="text-xs">Show Legend</Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={chartConfig.showGrid}
                                                        onCheckedChange={(checked) => setChartConfig(prev => ({ ...prev, showGrid: checked }))}
                                                    />
                                                    <Label className="text-xs">Show Grid</Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={chartConfig.showTitle}
                                                        onCheckedChange={(checked) => setChartConfig(prev => ({ ...prev, showTitle: checked }))}
                                                    />
                                                    <Label className="text-xs">Show Title</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Summary Section */}
                        <Collapsible
                            open={openSection === 'summary'}
                            onOpenChange={() => handleSectionToggle('summary')}
                            className="summary-con"
                        >
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="w-full section-header">
                                    <span className="font-semibold">Summary</span>
                                    {openSection === 'summary' ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="section-content">
                                <div className="space-y-2">
                                    <p>Summary content</p>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>
            </div>
        </MenuLayout>
    );
};

export default TopAuthors;