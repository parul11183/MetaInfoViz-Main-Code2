import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const PublicationAnalysis = () => {
    const [openSection, setOpenSection] = React.useState('tools');
    const [chartConfig, setChartConfig] = useState({
        startYear: '2015',
        endYear: '2023',
        publicationType: 'average',
        visualizationType: 'line',
        lineColor: '#6d28d9',
        pointColor: '#9f1239',
        fontSize: 12,
        yearGap: '1',
        showLegend: true,
        showGrid: true,
        showTitle: true,
        xAxisLabelSize: 12,
        yAxisLabelSize: 12,
        xAxisLabel: 'Year',
        yAxisLabel: 'Publications'
    });

    // Generate random data
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Sample Data',
                data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)),
                borderColor: chartConfig.lineColor,
                backgroundColor: chartConfig.lineColor + '20',
                pointStyle: chartConfig.pointStyle,
                pointRadius: chartConfig.pointSize,
                tension: chartConfig.tension,
                borderWidth: chartConfig.borderWidth,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: chartConfig.showLegend,
            },
            title: {
                display: chartConfig.showTitle,
                text: 'Chart Title', 
            },
        },
        scales: {
            x: {
                grid: {
                    display: chartConfig.showGrid,
                },
                title: {
                    display: true,
                    text: chartConfig.xAxisLabel,
                    font: {
                        size: chartConfig.xAxisLabelSize
                    }
                }
            },
            y: {
                grid: {
                    display: chartConfig.showGrid,
                },
                title: {
                    display: true,
                    text: chartConfig.yAxisLabel,
                    font: {
                        size: chartConfig.yAxisLabelSize
                    }
                }
            },
        },
    };

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleExport = (format) => {
        // Handle export logic here
        console.log(`Exporting as ${format}`);
    };

    const handleRefreshData = () => {
        // Refresh data logic here
        console.log('Refreshing data');
    };

    return (
        <MenuLayout>
            <div className=" w-full">
                {/* <h1 className="text-3xl font-bold mb-4">Publication Analysis</h1> */}

                <div className="content-con w-full">
                    {/* Plot Container */}
                    <div className="plot-con">
                        <div className="plot-header">
                        <h2 className="text-xl font-semibold text-center">Publication Analysis</h2>
                        </div>
                        <div className="plot-content border m-2 rounded-md bg-white">
                            <Line data={data} options={options} />
                        </div>
                        <div className="plot-caption my-2 text-center">
                            <p>Caption</p>
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
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <DownloadCloud className="h-4 w-4 mr-2" />
                                        Export PNG
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save CSV
                                    </Button>
                                </div>

                                <div className="tools-grid">
                                    {/* Left Column */}
                                    <div className="space-y-3">
                                        {/* Year Range */}
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
                                                    {Array.from({ length: 9 }, (_, i) => (
                                                        <SelectItem key={2015 + i} value={(2015 + i).toString()}>
                                                            {2015 + i}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

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
                                                    <SelectItem value="line">Line</SelectItem>
                                                    <SelectItem value="bar">Bar</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>



                                        {/* Publication Type */}
                                        <div className="space-y-2">
                                            <Label className="text-xs">No. of Publications</Label>
                                            <Select
                                                value={chartConfig.publicationType}
                                                onValueChange={(value) => setChartConfig(prev => ({ ...prev, publicationType: value }))}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="total">Total</SelectItem>
                                                    <SelectItem value="average">Average</SelectItem>
                                                    <SelectItem value="cumulative">Cumulative</SelectItem>
                                                    <SelectItem value="median">Median</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-3">
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
                                                    {Array.from({ length: 9 }, (_, i) => (
                                                        <SelectItem key={2015 + i} value={(2015 + i).toString()}>
                                                            {2015 + i}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Year Gap */}
                                        <div className="space-y-2">
                                            <Label className="text-xs">Year Gap</Label>
                                            <Select
                                                value={chartConfig.yearGap}
                                                onValueChange={(value) => setChartConfig(prev => ({ ...prev, yearGap: value }))}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[1, 2, 3, 4, 5].map(gap => (
                                                        <SelectItem key={gap} value={gap.toString()}>
                                                            {gap} Year{gap > 1 ? 's' : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Publication Period */}
                                        <div className="space-y-2">
                                            <Label className="text-xs">Period</Label>
                                            <Select
                                                value={chartConfig.publicationType}
                                                onValueChange={(value) => setChartConfig(prev => ({ ...prev, publicationType: value }))}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="average">Yearwise</SelectItem>
                                                    <SelectItem value="cumulative">Decadewise</SelectItem>
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
                                                        value={[chartConfig.xAxisLabelSize]}
                                                        onValueChange={(value) => setChartConfig(prev => ({ ...prev, xAxisLabelSize: value[0] }))}
                                                        min={16}
                                                        max={23}
                                                        step={1}
                                                        className="py-0"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Ticks Size</Label>
                                                    <Slider
                                                        value={[chartConfig.yAxisLabelSize]}
                                                        onValueChange={(value) => setChartConfig(prev => ({ ...prev, yAxisLabelSize: value[0] }))}
                                                        min={10}
                                                        max={20}
                                                        step={1}
                                                        className="py-0"
                                                    />
                                                </div>
                                            </div>

                                            {/* Colors */}

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



                                            {/* Toggles */}
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="showTitle"
                                                        checked={chartConfig.showTitle}
                                                        onCheckedChange={(checked) => setChartConfig(prev => ({ ...prev, showTitle: checked }))}
                                                    />
                                                    <Label htmlFor="showTitle" className="text-xs">Show Title</Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="showGrid"
                                                        checked={chartConfig.showGrid}
                                                        onCheckedChange={(checked) => setChartConfig(prev => ({ ...prev, showGrid: checked }))}
                                                    />
                                                    <Label htmlFor="showGrid" className="text-xs">Show Grid</Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="showLegend"
                                                        checked={chartConfig.showLegend}
                                                        onCheckedChange={(checked) => setChartConfig(prev => ({ ...prev, showLegend: checked }))}
                                                    />
                                                    <Label htmlFor="showLegend" className="text-xs">Show Legend</Label>
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
                                <Button
                                    variant="ghost"
                                    className="w-full section-header"
                                >
                                    <span className="font-semibold">Summary</span>
                                    {openSection === 'summary' ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="section-content">
                                {/* Summary content goes here */}
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

export default PublicationAnalysis;
