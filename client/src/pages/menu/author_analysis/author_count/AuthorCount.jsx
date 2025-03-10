import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver";
import MenuLayout from "@/layouts/MenuLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, DownloadCloud, Save } from "lucide-react";

ChartJS.register(
  ArcElement,
  LogarithmicScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AuthorCount = () => {
  const chartRef = useRef(null);
  const [openSection, setOpenSection] = useState("tools");
  const [showLegend, setShowLegend] = useState(true);
  const [authorCounts, setAuthorCounts] = useState([]);
  const [chartColor, setChartColor] = useState("#2563eb");
  const [lineColor, setLineColor] = useState("#6d28d9");
  const [fontSize, setFontSize] = useState(12);
  const [chartTitle, setChartTitle] = useState("Authors Vs Papers");
  const [showGrid, setShowGrid] = useState(false);
  const [error, setError] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [pointColor, setPointColor] = useState("#9f1239");
  const [isLoading, setIsLoading] = useState(true);

  // Axis label customization
  const [xAxisLabelSize, setXAxisLabelSize] = useState(12);
  const [yAxisLabelSize, setYAxisLabelSize] = useState(12);
  const [showChartTitle, setShowChartTitle] = useState(true);
  const [xAxisLabel, setXAxisLabel] = useState("Paper Count");
  const [yAxisLabel, setYAxisLabel] = useState("Number of Authors");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/get-data/");
      if (!response.ok) {
        throw new Error("Failed to fetch author data");
      }
      const data = await response.json();
      processAuthorData(data);
    } catch (err) {
      setError("Error fetching data: " + err.message);
      setNoDataMessage("Unable to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const processAuthorData = (data) => {
    const authorPaperCounts = new Map();

    data.forEach((item) => {
      if (item.Authors) {
        const authors = item.Authors.split(";").map((author) => author.trim());
        authors.forEach((author) => {
          authorPaperCounts.set(
            author,
            (authorPaperCounts.get(author) || 0) + 1
          );
        });
      }
    });

    const countDistribution = new Map();
    authorPaperCounts.forEach((count) => {
      countDistribution.set(count, (countDistribution.get(count) || 0) + 1);
    });

    const result = Array.from(countDistribution.entries()).sort(
      (a, b) => a[0] - b[0]
    );
    setAuthorCounts(result);
    setNoDataMessage(result.length === 0 ? "No data available" : "");
  };

  const exportToCSV = () => {
    const header = `${xAxisLabel},${yAxisLabel}\n`;
    const csvData = authorCounts
      .map(([paperCount, authorCount]) => `${paperCount},${authorCount}`)
      .join("\n");
    const blob = new Blob([header + csvData], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "author_papers_data.csv");
  };

  const handleDownloadImage = () => {
    const canvas = chartRef.current?.canvas;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.download = "author-analysis-chart.png";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSectionToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "logarithmic",
        position: "bottom",
        title: {
          display: true,
          text: xAxisLabel,
          font: { size: xAxisLabelSize },
        },
        grid: { display: showGrid },
        ticks: {
          callback: (value) => {
            const exp = Math.log10(value);
            return Number.isInteger(exp) ? value : "";
          },
          font: { size: fontSize },
          color: "#000",
        },
      },
      y: {
        type: "logarithmic",
        title: {
          display: true,
          text: yAxisLabel,
          font: { size: yAxisLabelSize },
        },
        grid: { display: showGrid },
        ticks: {
          callback: (value) => {
            const exp = Math.log10(value);
            return Number.isInteger(exp) ? value : "";
          },
          font: { size: fontSize },
          color: "#000",
        },
      },
    },
    plugins: {
      legend: {
        display: showLegend,
        labels: { font: { size: fontSize } },
      },
      title: {
        display: showChartTitle,
        text: chartTitle,
        font: { size: fontSize + 2 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            return `Papers: ${ctx.parsed.x}, Authors: ${ctx.parsed.y}`;
          },
        },
      },
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7,
        backgroundColor: pointColor,
        borderWidth: 0,
      },
      line: {
        tension: 0.6,
        borderWidth: 2,
        borderColor: lineColor,
        fill: false,
      },
    },
  };

  const sortedAuthorCounts = [...authorCounts].sort((a, b) => a[0] - b[0]);

  const chartData = {
    datasets: [
      {
        label: "Number of Papers per Author Group Size",
        data: sortedAuthorCounts.map(([paperCount, authorCount]) => ({
          x: paperCount,
          y: authorCount,
        })),
        backgroundColor: pointColor,
        borderColor: lineColor,
        pointBackgroundColor: pointColor,
        pointBorderColor: "transparent",
        pointRadius: 5,
        pointHoverRadius: 7,
        showLine: true,
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <MenuLayout>
      <div className="w-full">
        <div className="content-con w-full">
          <div className="plot-con">
            <div className="plot-header">
              <h2 className="text-xl font-semibold text-center">
                Author Distribution Analysis
              </h2>
            </div>
            <div className="plot-content border m-2 rounded-md bg-white h-[500px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-red-500">
                  {error}
                </div>
              ) : (
                <Line ref={chartRef} data={chartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Features Container */}
          <div className="features-con">
            {/* Tools Section */}
            <Collapsible
              open={openSection === "tools"}
              onOpenChange={() => handleSectionToggle("tools")}
              className="tools-con"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full section-header">
                  <span className="font-semibold">Chart Controls</span>
                  {openSection === "tools" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="section-content">
                <div className="tools-full flex gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleDownloadImage}
                  >
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    Export PNG
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={exportToCSV}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save CSV
                  </Button>
                </div>

                <div className="customization-options">
                  <div className="my-3 mb-1">
                    <p className="text-sm font-semibold text-gray-400">
                      Customization
                    </p>
                  </div>
                  <div className="tools-grid grid grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">X Label</Label>
                        <Input
                          value={xAxisLabel}
                          onChange={(e) => setXAxisLabel(e.target.value)}
                          className="h-8"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Title Size</Label>
                        <Slider
                          value={[fontSize]}
                          onValueChange={(value) => setFontSize(value[0])}
                          min={8}
                          max={16}
                          step={1}
                          className="py-0"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">X Label Size</Label>
                          <Slider
                            value={[xAxisLabelSize]}
                            onValueChange={(value) =>
                              setXAxisLabelSize(value[0])
                            }
                            min={8}
                            max={20}
                            step={1}
                            className="py-0"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Y Label Size</Label>
                          <Slider
                            value={[yAxisLabelSize]}
                            onValueChange={(value) =>
                              setYAxisLabelSize(value[0])
                            }
                            min={8}
                            max={20}
                            step={1}
                            className="py-0"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="space-y-2 flex-1">
                          <Label className="text-xs">Point Color</Label>
                          <Input
                            type="color"
                            value={pointColor}
                            onChange={(e) => setPointColor(e.target.value)}
                            className="h-8 w-full p-1"
                          />
                        </div>

                        <div className="space-y-2 flex-1">
                          <Label className="text-xs">Line Color</Label>
                          <Input
                            type="color"
                            value={lineColor}
                            onChange={(e) => setLineColor(e.target.value)}
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
                          value={yAxisLabel}
                          onChange={(e) => setYAxisLabel(e.target.value)}
                          className="h-8"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Chart Title</Label>
                        <Input
                          value={chartTitle}
                          onChange={(e) => setChartTitle(e.target.value)}
                          className="h-8"
                        />
                      </div>

                      <div className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="showTitle"
                            checked={showChartTitle}
                            onCheckedChange={(checked) =>
                              setShowChartTitle(checked)
                            }
                          />
                          <Label htmlFor="showTitle" className="text-xs">
                            Show Title
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="showGrid"
                            checked={showGrid}
                            onCheckedChange={(checked) => setShowGrid(checked)}
                          />
                          <Label htmlFor="showGrid" className="text-xs">
                            Show Grid
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="showLegend"
                            checked={showLegend}
                            onCheckedChange={(checked) =>
                              setShowLegend(checked)
                            }
                          />
                          <Label htmlFor="showLegend" className="text-xs">
                            Show Legend
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible
              open={openSection === "summary"}
              onOpenChange={() => handleSectionToggle("summary")}
              className="summary-con"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full section-header">
                  <span className="font-semibold">Summary</span>
                  {openSection === "summary" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="section-content">
                <div className="space-y-2 p-2">
                  <h3 className="text-sm font-semibold">
                    Author Distribution Insights
                  </h3>
                  {authorCounts.length > 0 ? (
                    <div className="text-xs space-y-2">
                      <p>
                        <span className="font-medium">Total Data Points:</span>{" "}
                        {authorCounts.length}
                      </p>
                      <p>
                        <span className="font-medium">
                          Average Authors Per Paper:
                        </span>{" "}
                        {(
                          authorCounts.reduce(
                            (acc, [authorCount, paperCount]) =>
                              acc + authorCount * paperCount,
                            0
                          ) /
                          authorCounts.reduce(
                            (acc, [_, paperCount]) => acc + paperCount,
                            0
                          )
                        ).toFixed(2)}
                      </p>
                      <p>
                        <span className="font-medium">
                          Most Common Author Count:
                        </span>{" "}
                        {
                          authorCounts.reduce(
                            (max, current) =>
                              current[1] > max[1] ? current : max,
                            [0, 0]
                          )[0]
                        }
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      No data available for analysis
                    </p>
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

export default AuthorCount;
