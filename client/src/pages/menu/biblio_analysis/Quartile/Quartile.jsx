import React, { useState, useEffect } from 'react';
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
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Quartile = () => {
    const [openSections, setOpenSections] = useState({
        tools: true,  // default open state for each section
        summary: true
    });
    const [data, setData] = useState([]);
    const [yearRange, setYearRange] = useState([]);
    const [startYear, setStartYear] = useState([]);
    const [endYear, setEndYear] = useState([]);
    const [noDataMessage, setNoDataMessage] = useState("");
    const [issnToQuartile, setIssnToQuartile] = useState(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [journalData, setJournalData] = useState([]);
    const [summary, setSummary] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState(null);
    const [chartColors, setChartColors] = useState([]);
 const [quartileData, setQuartileData] = useState([0, 0, 0, 0]); // Q1, Q2, Q3, Q4
  const [chartConfig, setChartConfig] = useState({
    startYear: '',
    endYear: '',
    visualizationType: 'bar',
    lineColor: '#6d28d9',
    orientation: 'vertical',
    pointColor: '#9f1239',
    fontSize: 12,
    axisTickSize: 10,
    showLegend: true,
    showGrid: true,
    showTitle: true,
    axisLabelSize: 12,
    xAxisLabel: 'Quartiles',
    yAxisLabel: 'Publications',
    xAxisTickRotation: 0,
    yAxisTickRotation: 0
    });

    const generateColors = (count) => {
        return Array.from({ length: count }, () => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
    };

    useEffect(() => {
        if (journalData.length > 0 && issnToQuartile.size > 0 && startYear && endYear) {
          processQuartileData(journalData, issnToQuartile);
        }
      }, [startYear, endYear, journalData, issnToQuartile]);

      useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch Scimago data
                const scimagoResponse = await fetch('/scimagojr 2023.csv');
                const scimagoText = await scimagoResponse.text();

                // Parse CSV
                const rows = scimagoText.trim().split("\n");
                const headers = rows[0].split(";");
                const dataRows = rows.slice(1);

                const mapping = new Map();

                dataRows.forEach(row => {
                    const values = row.split(";");
                    const rowData = headers.reduce((acc, header, index) => {
                        acc[header.trim()] = values[index]?.trim();
                        return acc;
                    }, {});

                    if (rowData.Issn) {
                        const issns = rowData.Issn.replace(/["\s]/g, '').split(',');
                        issns.forEach(issn => {
                            mapping.set(issn, rowData["SJR Best Quartile"]);
                        });
                    }
                });

                setIssnToQuartile(mapping);

                // Fetch journal data
                const apiResponse = await fetch("http://13.233.2.203:80/api/get-data/");
                const data = await apiResponse.json();
                setJournalData(data);

                const years = [...new Set(data.map(item => item.Year))].sort();
                const minYear = years[0]?.toString() || "";
                const maxYear = years[years.length - 1]?.toString() || "";

                setYearRange(years);
                setChartConfig(prev => ({
                    ...prev,
                    startYear: minYear,
                    endYear: maxYear
                }));

                // Process initial data
                processQuartileData(data, mapping, minYear, maxYear);

            } catch (err) {
                setError("Error fetching data: " + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (journalData.length > 0 && issnToQuartile.size > 0) {
            processQuartileData(journalData, issnToQuartile);
        }
    }, [chartConfig.startYear, chartConfig.endYear, journalData, issnToQuartile]);

    const processQuartileData = (data, mapping) => {
        const filteredData = data.filter(journal => {
            const journalYear = parseInt(journal.Year);
            const startYearInt = parseInt(chartConfig.startYear);
            const endYearInt = parseInt(chartConfig.endYear);
            return journalYear >= startYearInt && journalYear <= endYearInt;
        });

        const quartileCounts = {
            Q1: 0,
            Q2: 0,
            Q3: 0,
            Q4: 0
        };

        filteredData.forEach(journal => {
            if (journal.ISSN) {
                const quartile = mapping.get(journal.ISSN);
                if (quartile && quartile in quartileCounts) {
                    quartileCounts[quartile]++;
                }
            }
        });

        setQuartileData([
            quartileCounts.Q1,
            quartileCounts.Q2,
            quartileCounts.Q3,
            quartileCounts.Q4
        ]);
    };

    const generateSummary = async () => {
        setIsSummarizing(true);
        setSummaryError(null);
        setSummary("");
    
        try {
            // Calculate total publications and percentages for each quartile
            const totalPublications = quartileData.reduce((sum, count) => sum + count, 0);
            const quartilePercentages = quartileData.map(count => ((count / totalPublications) * 100).toFixed(1));
    
            // Construct the prompt for the summary
            const prompt = `
                Please analyze the following journal quartile distribution data and provide a clear, concise summary:
    
                **Time Period:** ${chartConfig.startYear} to ${chartConfig.endYear}
                **Total Publications Analyzed:** ${totalPublications}
    
                **Quartile Distribution:**
                - **Q1 (Highest):** ${quartileData[0]} journals (${quartilePercentages[0]}%)
                - **Q2:** ${quartileData[1]} journals (${quartilePercentages[1]}%)
                - **Q3:** ${quartileData[2]} journals (${quartilePercentages[2]}%)
                - **Q4 (Lowest):** ${quartileData[3]} journals (${quartilePercentages[3]}%)
    
                **Analysis:**
                1. **Dominant Quartile:** Identify the quartile with the highest number of publications and its significance.
                2. **Diversity:** Comment on the distribution of publications across quartiles. Is the distribution balanced or skewed?
                3. **Trends:** Highlight any trends or patterns in the quartile distribution over the selected time period.
                4. **Anomalies:** Point out any anomalies or unexpected findings, such as unusually high or low counts in specific quartiles.
                5. **Insights:** Provide insights into what the quartile distribution might imply about the quality or impact of the publications.
    
    
                Please provide a concise and insightful analysis of the quartile distribution data, focusing on the key observations and their implications.
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

      const chartData = {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [{
          label: 'Number of Publications',
          data: quartileData,
          backgroundColor: chartConfig.visualizationType === 'bar'
            ? chartConfig.lineColor
            : generateColors(4), // Generate 4 colors for quartiles
          borderColor: chartConfig.visualizationType === 'bar'
            ? chartConfig.pointColor
            : '#fff',
          borderWidth: 1
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: chartConfig.visualizationType === "bar" && chartConfig.orientation === "horizontal" ? "y" : "x",
        plugins: {
            legend: {
                display: chartConfig.showLegend,
                labels: {
                    color: '#000000' // Set legend text to black
                }
            },
            title: {
                display: chartConfig.showTitle,
                text: `Quartile Distribution (${chartConfig.startYear}-${chartConfig.endYear})`,
                font: {
                    size: chartConfig.fontSize
                },
                color: '#000000' // Set title text to black
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
        scales: chartConfig.visualizationType === "bar" ? {
            x: {
                grid: { display: chartConfig.showGrid },
                title: { 
                    display: true, 
                    text: chartConfig.orientation === "horizontal" ? chartConfig.yAxisLabel : chartConfig.xAxisLabel,
                    font: { size: chartConfig.axisLabelSize },
                    color: '#000000' // Set title text to black
                },
                ticks: {
                    font: { size: chartConfig.axisTickSize },
                    autoSkip: false,
                    maxRotation: chartConfig.xAxisTickRotation,
                    minRotation: chartConfig.xAxisTickRotation,
                    color: '#000000' // Set title text to black
                }
            },
            y: {
                grid: { display: chartConfig.showGrid },
                title: { 
                    display: true, 
                    text: chartConfig.orientation === "horizontal" ? chartConfig.xAxisLabel : chartConfig.yAxisLabel,
                    font: { size: chartConfig.axisLabelSize },
                    color: '#000000' // Set title text to black
                },
                ticks: {
                    font: { size: chartConfig.axisTickSize },
                    autoSkip: false,
                    maxRotation: chartConfig.yAxisTickRotation,
                    minRotation: chartConfig.yAxisTickRotation,
                    color: '#000000' // Set title text to black
                }
            }
        } : {}
    };

    const handleYearChange = (type, value) => {
        setChartConfig(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleSectionToggle = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    const handleDownloadImage = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `journal-analysis-${chartConfig.startYear}-${chartConfig.endYear}.png`;
            link.href = url;
            link.click();
        }
    };

    const handleDownloadCSV = () => {
        const csvContent = "Quartile,Publications\n" +
          ["Q1", "Q2", "Q3", "Q4"].map((quartile, index) => `"${quartile}",${quartileData[index]}`).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quartile-data-${chartConfig.startYear}-${chartConfig.endYear}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      };

    return (
        <MenuLayout>
            <div className="w-full h-screen overflow-y-auto">
                <div className="content-con w-full">
                    <div className="plot-con">
                        <div className="plot-header">
                            <h2 className="text-xl font-semibold text-center">Quartile Analysis</h2>
                        </div>
                        <div className="plot-content border m-2 rounded-md bg-white h-[500px]">
              {chartConfig.visualizationType === 'bar' ? (
                <Bar data={chartData} options={options} />
              ) : chartConfig.visualizationType === 'pie' ? (
                <Pie data={chartData} options={options} />
              ) : chartConfig.visualizationType === 'doughnut' ? (
                <Doughnut data={chartData} options={options} />
              ) : null}
            </div>
                    </div>
                    <div className="features-con">
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
                                    </div>
                                    <div className="space-y-3">
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
                                                    open={openSections.summary}
                                                    onOpenChange={() => handleSectionToggle('summary')}
                                                    className="mt-4"
                                                >
                                                    <CollapsibleTrigger asChild>
                                                        <Button variant="ghost" className="w-full section-header">
                                                            <span className="font-semibold">Summary</span>
                                                            {openSections === 'summary' ? (
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

export default Quartile;