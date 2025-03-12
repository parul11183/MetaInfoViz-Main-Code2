import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Documents = () => {
  const chartRef = useRef(null);
  const [topDocuments, setTopDocuments] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [showLegend, setShowLegend] = useState(true);
  const [yearRange, setYearRange] = useState([]);
  const [maxDisplayCount, setMaxDisplayCount] = useState(15);
  const [topLanguages, setTopLanguages] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [chartOrientation, setChartOrientation] = useState("horizontal");
  const [chartColor, setChartColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(10);
  const [chartTitle, setChartTitle] = useState("Document Type");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const colors = [
    "#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea",
    "#0891b2", "#be123c", "#15803d", "#854d0e", "#7e22ce"
  ];

  const styles = {
    container: {
      display: "flex",
      gap: "24px",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "16px"
    },
    chartPanel: {
      flex: "2",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      padding: "24px"
    },
    controlPanel: {
      flex: "1",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      padding: "24px",
      fontSize:"10px"
    },
    title: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "16px"
    },
    chartContainer: {
      height: "500px",
      position: "relative"
    },
    loadingSpinner: {
      position: "absolute",
      inset: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    spinner: {
      width: "48px",
      height: "48px",
      border: "4px solid #2563eb",
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    errorMessage: {
      position: "absolute",
      inset: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#dc2626"
    },
    controlGroup: {
      marginBottom: "16px"
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "8px"
    },
    select: {
      width: "100%",
      padding: "8px",
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
      backgroundColor: "white"
    },
    checkbox: {
      width: "12px",
      height: "12px",
      marginRight: "8px"
    },
    range: {
      width: "100%"
    },
    colorPicker: {
      width: "100%",
      height: "40px",
      borderRadius: "6px"
    },
    downloadButton: {
      width: "100%",
      backgroundColor: "#2563eb",
      color: "white",
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer"
    },
    disabledButton: {
      opacity: "0.5",
      cursor: "not-allowed"
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://3.6.36.17:80/api/get-data/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const years = [...new Set(data.map(item => item.Year))].sort();
      setYearRange(years);
      processDocumentData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const processDocumentData = (data) => {
    const documentCounts = data.reduce((acc, item) => {
      // Check for Document Type field first
      const docType = item['Document Type'] || 
                     item['document type'] || 
                     item.Document || 
                     item.document;
                  
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

// Update chart data to use topDocuments instead of topLanguages
const chartData = {
    labels: topDocuments.map(([name]) => name),
    datasets: [
      {
        label: "Count",
        data: topDocuments.map(([, count]) => count),
        backgroundColor: chartType === "bar" ? chartColor : colors,
        borderColor: chartType === "bar" ? chartColor : colors,
        borderWidth: 1,
      },
    ],
};

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: chartOrientation === "horizontal" ? "y" : "x",
    plugins: {
      legend: {
        display: showLegend,
        position: "top",
        labels: {
          color: "#000000", // Legend font color
          font: {
            size: fontSize,
          },
        },
      },
      title: {
        display: true,
        text: chartTitle,
        color: "#000000", // Title font color
        font: {
          size: 16,
        },
      },
      tooltip: {
        enabled: true,
        bodyFont: {
          size: fontSize,
          color: "#000000", // Tooltip font color
        },
      },
    },
    scales:
      chartType === "bar"
        ? {
            x: {
              display: true,
              beginAtZero: true,
              grid: {
                display: showGrid,
                drawBorder: true,
                borderColor: "#000000", // Set x-axis border color to black
              },
              ticks: {
                display: true,
                color: "#000000", // X-axis ticks color
                font: {
                  size: fontSize,
                },
              },
              border: {
                color: "#000000",
              },
              title: {
                display: true,
                text:
                  chartOrientation === "horizontal"
                    ? "Number of Documents"
                    : "Document Type",
                color: "#000000", // X-axis title color
              },
            },
            y: {
              display: true,
              beginAtZero: true,
              grid: {
                display: showGrid,
                drawBorder: true,
                borderColor: "#000000", // Set y-axis border color to black
              },
              border: {
                color: "#000000",
              },
              ticks: {
                display: true,
                color: "#000000", // Y-axis ticks color
                font: {
                  size: fontSize,
                },
              },
              title: {
                display: true,
                text:
                  chartOrientation === "horizontal"
                    ? "Document Type"
                    : "Number of Documents",
                color: "#000000", // Y-axis title color
              },
            },
          }
        : {}, // No scales for pie or doughnut charts
    datasets: [
      {
        // This is where you set the default bar color to black
        backgroundColor: "#000000", // Default bar color
        borderColor: "#000000", // Border color
        borderWidth: 1, // Optional: adjust the border width of the bars
        data: chartData, // Assuming you have chartData defined elsewhere
      },
    ],
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
          saveAs(dataUrl, 'language_distribution.png');
          chartElement.style.background = originalBackground;
        })
        .catch((err) => {
          console.error('Error downloading chart:', err);
          chartElement.style.background = originalBackground;
        });
    }
  };

  const exportToCSV = () => {
    const csvData = topLanguages.map(([language, count]) => `${language},${count}`).join('\n');
    const blob = new Blob([`Language,Count\n${csvData}`], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'language_distribution.csv');
  };


  return (
    <div style={styles.container}>
      {/* Chart Panel */}
      <div style={styles.chartPanel}>
        {/* <h2 style={styles.title}>{chartTitle}</h2> */}
        <div style={styles.chartContainer}>
          {isLoading ? (
            <div style={styles.loadingSpinner}>
              <div style={styles.spinner} />
            </div>
          ) : error ? (
            <div style={styles.errorMessage}>
              {error}
            </div>
          ) : (
            <Chart ref={chartRef} type={chartType} data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Controls Panel */}
      <div style={styles.controlPanel}>
        <h2 style={styles.title}>Chart Options</h2>
        <div>
          {/* Chart Type */}
          <div style={styles.controlGroup}>
            <label style={styles.label}>Chart Type</label>
            <select
  value={chartType}
  onChange={(e) => setChartType(e.target.value)}
  style={styles.select}
>
  <option value="bar">Bar Chart</option>
  <option value="pie">Pie Chart</option>
  <option value="doughnut">Doughnut Chart</option>
</select>

          </div>

          {/* Orientation */}
          <div style={styles.controlGroup}>
            <label style={styles.label}>Orientation</label>
            <select
              value={chartOrientation}
              onChange={(e) => setChartOrientation(e.target.value)}
              style={styles.select}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>

          {/* Show Grid */}
          <div style={styles.controlGroup}>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                style={styles.checkbox}
              />
              Show Grid
            </label>
          </div>

          {/* Show Legend */}
          <div style={styles.controlGroup}>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showLegend}
                onChange={(e) => setShowLegend(e.target.checked)}
                style={styles.checkbox}
              />
              Show Legend
            </label>
          </div>

          {/* Font Size */}
          <div style={styles.controlGroup}>
            <label style={styles.label}>
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="8"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              style={styles.range}
            />
          </div>

          {/* Chart Color */}
          <div style={styles.controlGroup}>
            <label style={styles.label}>Chart Color (Bar)</label>
            <input
              type="color"
              value={chartColor}
              onChange={(e) => setChartColor(e.target.value)}
              style={styles.colorPicker}
            />
          </div>

          {/* Download Button */}
                    <div style={{ textAlign: "center", marginTop: "5px" }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleDownload("png")}
                        style={{ marginRight: "10px" }}
                      >
                        <FontAwesomeIcon
                          icon={faDownload}
                          style={{ marginRight: "5px" }}
                        />
                        PNG
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        onClick={exportToCSV}
                      >
                        <FontAwesomeIcon
                          icon={faDownload}
                          style={{ marginRight: "5px" }}
                        />
                        CSV
                      </button>
                    </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;