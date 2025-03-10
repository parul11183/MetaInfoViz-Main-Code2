import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const AuthorCount = () => {
  const [showLegend, setShowLegend] = useState(true);
  const [authorCounts, setAuthorCounts] = useState([]);
  const [borderColor, setBorderColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(12);
  const [chartTitle, setChartTitle] = useState("Unique Authors vs Papers Published");
  const [showGrid, setShowGrid] = useState(true);
  const [error, setError] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [pointColor, setPointColor] = useState('#2563eb');
  const [useLogarithmicScale, setUseLogarithmicScale] = useState(true);
  const [xAxisLabel, setXAxisLabel] = useState("Number of Authors");
  const [yAxisLabel, setYAxisLabel] = useState("Number of Papers");
  const [xAxisLabelSize, setXAxisLabelSize] = useState(12);
  const [yAxisLabelSize, setYAxisLabelSize] = useState(12);
  const [showChartTitle, setShowChartTitle] = useState(true);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "16px",
    },
    chartPanel: {
      flex: "2",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      padding: "24px",
      marginRight: "16px",
    },
    chartContainer: {
      height: "500px",
      position: "relative",
    },
    controlPanel: {
      flex: "1",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      padding: "12px",
      fontSize: "12px",
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/get-data/");
      if (!response.ok) {
        throw new Error('Failed to fetch author data');
      }
      const data = await response.json();
      processAuthorData(data);
    } catch (err) {
      setError("Error fetching data: " + err.message);
      setNoDataMessage("Unable to load data");
    }
  };

  const processAuthorData = (data) => {
    const papersByAuthorCount = new Map();
  
    data.forEach((item) => {
      if (item.Authors) {
        const authors = item.Authors.split(";").map(author => author.trim());
        const authorCount = Math.max(authors.length, 1);
  
        papersByAuthorCount.set(
          authorCount,
          (papersByAuthorCount.get(authorCount) || 0) + 1
        );
      }
    });
  
    const result = Array.from(papersByAuthorCount.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([authorCount, papers]) => ({
        x: authorCount,
        y: Math.max(papers, 1)
      }));
  
    setAuthorCounts(result);
    setNoDataMessage(result.length === 0 ? "No data available" : "");
  };

  const getLogTicksAndLabels = () => {
    const ticks = [];
    const labels = new Map();
    
    const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵'];
    
    // Only powers of 10 from 10⁰ to 10⁵
    for (let i = 0; i <= 5; i++) {
      const value = Math.pow(10, i);
      ticks.push(value);
      labels.set(value, `10${superscripts[i]}`);
    }
    
    return { ticks: ticks.sort((a, b) => a - b), labels };
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: useLogarithmicScale ? 'logarithmic' : 'linear',
        position: 'bottom',
        grid: {
          display: showGrid,
          drawBorder: true,
        },
        title: {
          display: true,
          text: xAxisLabel,
          color: 'black',
          font: {
            size: xAxisLabelSize,
          },
        },
        ticks: {
          color: 'black',
          font: {
            size: fontSize,
          },
          callback: function(value) {
            if (useLogarithmicScale) {
              const { labels } = getLogTicksAndLabels();
              return labels.get(value) || '';
            }
            return Number(value).toLocaleString();
          }
        },
        border: {
          color: 'black',
        },
        min: 1,
      },
      y: {
        type: useLogarithmicScale ? 'logarithmic' : 'linear',
        grid: {
          display: showGrid,
          drawBorder: true,
        },
        title: {
          display: true,
          text: yAxisLabel,
          color: 'black',
          font: {
            size: yAxisLabelSize,
          },
        },
        ticks: {
          color: '#000000',
          font: {
            size: fontSize,
          },
          callback: function(value) {
            // if (useLogarithmicScale) {
            //   if (Math.log10(value) % 1 === 0) {
            //     return `10${Math.log10(value) === 0 ? '' : '^' + Math.log10(value)}`;
            //   }
            //   return '';
            // }
            return Number(value).toLocaleString();
          }
        },
        border: {
          color: '#000000',
        },
        min: 1,
      },
    },
    plugins: {
      legend: {
        display: showLegend,
        labels: {
          color: 'black',
          font: {
            size: fontSize,
          },
        },
      },
      title: {
        display: showChartTitle,
        text: chartTitle,
        font: {
          size: 16,
        },
        color: 'black',
      },
      tooltip: {
        enabled: true,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const authors = Number(context.parsed.x).toLocaleString();
            const papers = Number(context.parsed.y).toLocaleString();
            return `${authors} authors, ${papers} papers`;
          }
        }
      },
      datalabels: {
        display: false
      }
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7,
      },
    },
  };

  const exportToCSV = () => {
    const header = `${xAxisLabel},${yAxisLabel}\n`;
    const csvData = authorCounts
      .map(item => `${item.x},${item.y}`)
      .join('\n');
    const blob = new Blob([header + csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'author_papers_data.csv');
  };

  const handleDownload = (format) => {
    if (format === 'png') {
      const chartElement = document.getElementById('scatter-chart');
      if (chartElement) {
        const originalBackground = chartElement.style.background;
        chartElement.style.background = 'white';
        toPng(chartElement, {
          backgroundColor: '#ffffff',
          style: { background: 'white' },
        })
          .then((dataUrl) => {
            saveAs(dataUrl, 'author_papers_chart.png');
            chartElement.style.background = originalBackground;
          })
          .catch((err) => {
            console.error('Error downloading chart:', err);
            chartElement.style.background = originalBackground;
          });
      }
    }
  };

  // const chartOptions = {
  //   responsive: true,
  //   scales: {
  //     x: {
  //       type: useLogarithmicScale ? 'logarithmic' : 'linear',
  //       position: 'bottom',
  //       grid: {
  //         display: showGrid,
  //         drawBorder: true,
  //       },
  //       title: {
  //         display: true,
  //         text: useLogarithmicScale ? `${xAxisLabel} (log scale)` : xAxisLabel,
  //         color: 'black',
  //         font: {
  //           size: xAxisLabelSize,
  //         },
  //       },
  //       ticks: {
  //         color: pointColor,
  //         font: {
  //           size: fontSize,
  //         },
  //         callback: function(value) {
  //           return Number(value).toLocaleString();
  //         }
  //       },
  //       border: {
  //         color: 'black',
  //       },
  //       min: 1,
  //     },
  //     y: {
  //       type: useLogarithmicScale ? 'logarithmic' : 'linear',
  //       grid: {
  //         display: showGrid,
  //         drawBorder: true,
  //       },
  //       title: {
  //         display: true,
  //         text: useLogarithmicScale ? `${yAxisLabel} (log scale)` : yAxisLabel,
  //         color: 'black',
  //         font: {
  //           size: yAxisLabelSize,
  //         },
  //       },
  //       ticks: {
  //         color: '#000000',
  //         font: {
  //           size: fontSize,
  //         },
  //         callback: function(value) {
  //           return Number(value).toLocaleString();
  //         }
  //       },
  //       border: {
  //         color: '#000000',
  //       },
  //       min: 1,
  //     },
  //   },
  //   plugins: {
  //     legend: {
  //       display: showLegend,
  //       labels: {
  //         color: 'black',
  //         font: {
  //           size: fontSize,
  //         },
  //       },
  //     },
  //     title: {
  //       display: showChartTitle,
  //       text: chartTitle,
  //       font: {
  //         size: 16,
  //       },
  //       color: 'black',
  //     },
  //     tooltip: {
  //       enabled: true,
  //       displayColors: false,
  //       callbacks: {
  //         label: function(context) {
  //           // Remove the 'x:' and 'y:' prefixes
  //           const authors = Number(context.parsed.x).toLocaleString();
  //           const papers = Number(context.parsed.y).toLocaleString();
  //           return `${authors} authors, ${papers} papers`;
  //         }
  //       }
  //     },
  //   },
  //   elements: {
  //     point: {
  //       radius: 5,
  //       hoverRadius: 7,
  //     },
  //   },
  // };

  return (
    <div style={styles.container}>
      {/* Chart Panel */}
      <div style={styles.chartPanel}>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <div style={styles.chartContainer}>
            {authorCounts.length > 0 ? (
              <div id="scatter-chart" style={{ height: '100%' }}>
                <Scatter
                  data={{
                    datasets: [{
                      label: "Number of Papers per Author Group Size",
                      data: authorCounts,
                      backgroundColor: pointColor,
                      borderColor: borderColor,
                      borderWidth: 1,
                      datalabels: {
                        display: false // Ensure data labels are disabled at dataset level
                      }
                    }],
                  }}
                  options={chartOptions}
                />
              </div>
            ) : (
              <div>{noDataMessage || "Loading data..."}</div>
            )}
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div style={{ marginLeft: '40px', flex: '0 0 300px', fontSize: '12px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Point Color:
            <input
              type="color"
              value={pointColor}
              onChange={(e) => setPointColor(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '10px' }}>
            Font Size:
            <input
              type="range"
              min="8"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              style={{ marginLeft: '10px', width: '120px' }}
            />
            <span style={{ marginLeft: '5px' }}>{fontSize}</span>
          </label>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Show Chart Title:
              <input
                type="checkbox"
                checked={showChartTitle}
                onChange={(e) => setShowChartTitle(e.target.checked)}
                style={{ marginLeft: '10px' }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '10px' }}>
              Show Legend:
              <input
                type="checkbox"
                checked={showLegend}
                onChange={(e) => setShowLegend(e.target.checked)}
                style={{ marginLeft: '10px' }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '10px' }}>
              Show Grid:
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                style={{ marginLeft: '10px' }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Use Logarithmic Scale:
              <input
                type="checkbox"
                checked={useLogarithmicScale}
                onChange={(e) => setUseLogarithmicScale(e.target.checked)}
                style={{ marginLeft: '10px' }}
              />
            </label>
          </div>

          <label style={{ display: 'block', marginBottom: '10px' }}>
            X-Axis Label Size:
            <input
              type="range"
              min="8"
              max="24"
              value={xAxisLabelSize}
              onChange={(e) => setXAxisLabelSize(parseInt(e.target.value))}
              style={{ marginLeft: '10px', width: '120px' }}
            />
            <span style={{ marginLeft: '5px' }}>{xAxisLabelSize}</span>
          </label>

          <label style={{ display: 'block', marginBottom: '10px' }}>
            Y-Axis Label Size:
            <input
              type="range"
              min="8"
              max="24"
              value={yAxisLabelSize}
              onChange={(e) => setYAxisLabelSize(parseInt(e.target.value))}
              style={{ marginLeft: '10px', width: '120px' }}
            />
            <span style={{ marginLeft: '5px' }}>{yAxisLabelSize}</span>
          </label>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              X-Axis Label:
              <input
                type="text"
                value={xAxisLabel}
                onChange={(e) => setXAxisLabel(e.target.value)}
                style={{ marginLeft: '10px', width: '100%' }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '10px' }}>
              Y-Axis Label:
              <input
                type="text"
                value={yAxisLabel}
                onChange={(e) => setYAxisLabel(e.target.value)}
                style={{ marginLeft: '10px', width: '100%' }}
              />
            </label>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                className="btn btn-primary"
                onClick={() => handleDownload("png")}
                style={{ marginRight: "10px", padding: "8px 16px" }}
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
                style={{ padding: "8px 16px" }}
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
    </div>
  );
};

export default AuthorCount;