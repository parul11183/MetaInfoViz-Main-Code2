import React, { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    LogarithmicScale,
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
    LogarithmicScale,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const LanguageAnalysis = () => {
    const [openSection, setOpenSection] = useState({
            tools: true,  // default open state for each section
            summary: true
        });
    const [data, setData] = useState([]);
    const [topLanguages, setTopLanguages] = useState([]);
    const [yearRange, setYearRange] = useState([]);
    const [noDataMessage, setNoDataMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState(null);
    const [displayedLanguagesCount, setDisplayedLanguagesCount] = useState(0);
    const [chartColors, setChartColors] = useState([]);
    const [useLogScale, setUseLogScale] = useState(false);

    const [chartConfig, setChartConfig] = useState({
        startYear: '',
        endYear: '',
        visualizationType: 'bar',
        count: '15',
        lineColor: '#6d28d9',
        pointColor: '#9f1239',
        fontSize: 12,
        axisTickSize: 10,
        showLegend: true,
        showGrid: true,
        showTitle: true,
        axisLabelSize: 12,
        orientation: 'vertical',
        xAxisLabel: 'Number of Documents',
        yAxisLabel: 'Languages',
        xAxisTickRotation: 0,
        yAxisTickRotation: 0
    });

    const generateColors = (count) => {
        return Array.from({ length: count }, () => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
    };

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
            processLanguageData(jsonData);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.message);
            setNoDataMessage("Failed to load language data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (topLanguages.length > 0) {
            setChartColors(generateColors(topLanguages.length));
        }
    }, [topLanguages]);

    useEffect(() => {
        if (data.length > 0) {
            processLanguageData(data);
        }
    }, [chartConfig.startYear, chartConfig.endYear, chartConfig.count, data]);

    const processLanguageData = (rawData) => {
        let filteredData = rawData;
        if (chartConfig.startYear && chartConfig.endYear) {
            filteredData = rawData.filter(
                item => item.Year >= parseInt(chartConfig.startYear) &&
                    item.Year <= parseInt(chartConfig.endYear)
            );
        }

        const languageCounts = filteredData.reduce((acc, item) => {
            const lang = item['Language of Original Document'] ||
                item['language of original document'] ||
                item.Language ||
                item.language;

            if (lang && lang.trim() !== '' && lang.toLowerCase() !== 'unknown') {
                const normalizedLang = lang.trim();
                acc[normalizedLang] = (acc[normalizedLang] || 0) + 1;
            }
            return acc;
        }, {});

        const sortedLanguages = Object.entries(languageCounts)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, parseInt(chartConfig.count));

        setTopLanguages(sortedLanguages);
        setDisplayedLanguagesCount(Object.keys(languageCounts).length);
        setNoDataMessage(sortedLanguages.length === 0 ? "No data available for the selected year range" : "");
    };
    const generateSummary = async () => {
        setIsSummarizing(true);
        setSummaryError(null);
        setSummary("");
    
        try {
            // Calculate total documents and average documents per language
            const totalDocuments = topLanguages.reduce((sum, [_, count]) => sum + count, 0);
            const averageDocuments = (totalDocuments / topLanguages.length).toFixed(2);
            const languagesWithSingleDocument = topLanguages.filter(([_, count]) => count === 1).length;
    
            // Construct the prompt for the summary
            const prompt = `
                Please analyze the following language distribution data and provide a clear, concise summary:
    
                **Time Period:** ${chartConfig.startYear} to ${chartConfig.endYear}
                **Number of Languages Shown:** ${chartConfig.count}
                **Total Documents Analyzed:** ${totalDocuments}
                **Total Unique Languages in Dataset:** ${displayedLanguagesCount}
    
                **Key Statistics:**
                - **Top Language:** ${topLanguages[0]?.[0]} (${topLanguages[0]?.[1]} documents)
                - **Average Documents per Language:** ${averageDocuments}
                - **Languages with Single Document:** ${languagesWithSingleDocument}
    
                **Language Distribution (Top ${chartConfig.count} Languages):**
                ${topLanguages.map(([language, count]) => `${language}: ${count} documents`).join('\n')}
    
                **Analysis:**
                1. **Dominant Languages:** Identify the most dominant languages and their percentage contribution to the total documents.
                2. **Anomalies:** Point out any anomalies or unexpected findings, such as languages with unusually high or low document counts.
                3. **Insights:** Provide insights into what the distribution might imply about the dataset's origin, usage, or context.
    
                **Additional Context:**
                - The data is visualized using a ${chartConfig.visualizationType} chart.
                - The scale used for the visualization is ${useLogScale ? "logarithmic" : "linear"}.
                - The chart orientation is ${chartConfig.orientation}.
    
                Please provide a concise and insightful analysis of the language distribution data, focusing on the key observations and their implications.
            `;
    
            // Send the prompt to the backend for summary generation
            const response = await axios.post(
                "http://13.233.2.203:80/api/generate-summary/",
                { prompt },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000, // 30 seconds timeout
                }
            );
    
            // Handle the response
            if (!response.data || !response.data.summary) {
                throw new Error("Invalid response format from server");
            }
    
            // Set the generated summary
            setSummary(response.data.summary);
        } catch (error) {
            // Handle errors
            setSummaryError(
                error.response?.data?.error ||
                error.message ||
                "An error occurred while generating the summary"
            );
        } finally {
            // Reset the loading state
            setIsSummarizing(false);
        }
    };

    const getChartData = () => {
        if (chartConfig.visualizationType === 'bar') {
            return {
                labels: topLanguages.map(([name]) => name),
                datasets: [{
                    label: "Count",
                    data: topLanguages.map(([_, count]) => count),
                    backgroundColor: chartConfig.lineColor,
                    borderColor: chartConfig.pointColor,
                    borderWidth: 2,
                }],
            };
        }

        return {
            labels: topLanguages.map(([name]) => name),
            datasets: [{
                data: topLanguages.map(([_, count]) => count),
                backgroundColor: chartColors,
                borderColor: chartColors,
                borderWidth: 1,
            }],
        };
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
                    text: `Top ${chartConfig.count} Languages by Number of Documents`,
                    color: "#000000",
                    font: { size: chartConfig.fontSize + 4 },
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            return ` ${context.raw.toLocaleString()}`;
                        }
                    },
                },
                datalabels: {
                    color: '#000000',
                    // anchor: chartConfig.visualizationType === 'bar' ? 'end' : 'center',
                    // align: chartConfig.visualizationType === 'bar' ? 'start' : 'center',
                    // offset: chartConfig.visualizationType === 'bar' ? 4 : 0,
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
                        font: { size: chartConfig.axisLabelSize },
                    },
                    ticks: {
                        font: { size: chartConfig.axisTickSize },
                        maxRotation: isHorizontal ? chartConfig.xAxisTickRotation : chartConfig.yAxisTickRotation,
                        minRotation: isHorizontal ? chartConfig.xAxisTickRotation : chartConfig.yAxisTickRotation,
                        callback: function(value) {
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
                        font: { size: chartConfig.axisLabelSize },
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

    const handleSectionToggle = (section) => {
        setOpenSection(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };


    const handleDownloadImage = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `language-analysis-${chartConfig.startYear}-${chartConfig.endYear}.png`;
            link.href = url;
            link.click();
        }
    };

    const handleDownloadCSV = () => {
        const csvContent = "Language,Documents\n" +
            topLanguages.map(([language, count]) => `"${language}",${count}`).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `language-data-${chartConfig.startYear}-${chartConfig.endYear}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const renderChart = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
            );
        }

        switch (chartConfig.visualizationType) {
            case 'bar':
                return <Bar data={getChartData()} options={getChartOptions()} />;
            case 'pie':
                return <Pie data={getChartData()} options={getChartOptions()} />;
            case 'doughnut':
                return <Doughnut data={getChartData()} options={getChartOptions()} />;
            default:
                return null;
        }
    };

    return (
        <MenuLayout>
            <div className="w-full h-screen overflow-y-auto">
                <div className="content-con w-full">
                    <div className="plot-con">
                        <div className="plot-header">
                            <h2 className="text-xl font-semibold text-center">Language Analysis</h2>
                        </div>
                        <div className="plot-content border m-2 rounded-md bg-white h-[500px]">
                            {renderChart()}
                        </div>
                    </div>
                    <div className="features-con">
                        <Collapsible
                            open={openSection.tools}
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
                                    <div className="space-y-3">
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
                                                    <SelectItem value="doughnut">Doughnut</SelectItem>
                                                    <SelectItem value="bar">Bar</SelectItem>
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
                                                    <SelectItem value="horizontal">Horizontal</SelectItem>
                                                    <SelectItem value="vertical">Vertical</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
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
                                <div className='customization-options'>
                                    <div className="my-3 mb-1">
                                        <p className='text-sm font-semibold text-gray-400'>Customization</p>
                                    </div>
                                    <div className="tools-grid">
                                        <div className="space-y-3">
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
                                            <div className='flex gap-2'>
                                                <div className=" space-y-2 flex-1">
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
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Y Label</Label>
                                                <Input
                                                    value={chartConfig.yAxisLabel}
                                                    onChange={(e) => setChartConfig(prev => ({ ...prev, yAxisLabel: e.target.value }))}
                                                    className="h-8"
                                                />
                                            </div>
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
                                                    open={openSection.summary}
                                                    onOpenChange={() => handleSectionToggle('summary')}
                                                    className="mt-4"
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

export default LanguageAnalysis;