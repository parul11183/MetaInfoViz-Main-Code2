// import React, { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
// import Papa from 'papaparse';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Quartile = () => {
//   const [quartileData, setQuartileData] = useState([]);
//   const [chartColor, setChartColor] = useState("#2563eb");
//   const [borderColor, setBorderColor] = useState("#1e40af");
//   const [showGrid, setShowGrid] = useState(true);
//   const [fontSize, setFontSize] = useState(12);
//   const [chartOrientation, setChartOrientation] = useState("vertical");
//   const [showChartTitle, setShowChartTitle] = useState(true);
//   const [showLegend, setShowLegend] = useState(true);
//   const [xAxisLabel, setXAxisLabel] = useState("Quartile");
//   const [yAxisLabel, setYAxisLabel] = useState("Number of Journals");
//   const [xAxisLabelSize, setXAxisLabelSize] = useState(12);
//   const [yAxisLabelSize, setYAxisLabelSize] = useState(12);

//   useEffect(() => {
//     fetch('/scimagojr 2023.csv')
//       .then(response => response.text())
//       .then(csvText => {
//         Papa.parse(csvText, {
//           header: true,
//           delimiter: ";",
//           complete: (results) => {
//             const quartileCounts = {
//               Q1: 0,
//               Q2: 0,
//               Q3: 0,
//               Q4: 0
//             };

//             results.data.forEach(row => {
//               const quartile = row["SJR Best Quartile"];
//               if (quartile in quartileCounts) {
//                 quartileCounts[quartile]++;
//               }
//             });

//             setQuartileData([
//               quartileCounts.Q1,
//               quartileCounts.Q2,
//               quartileCounts.Q3,
//               quartileCounts.Q4
//             ]);
//           }
//         });
//       });
//   }, []);

//   const chartData = {
//     labels: ['Q1', 'Q2', 'Q3', 'Q4'],
//     datasets: [
//       {
//         label: 'Number of Journals',
//         data: quartileData,
//         backgroundColor: chartColor,
//         borderColor: borderColor,
//         borderWidth: 1,
//       }
//     ]
//   };

//   const chartOptions = {
//     indexAxis: chartOrientation === 'horizontal' ? 'y' : 'x',
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: showLegend,
//         position: 'top',
//       },
//       title: {
//         display: showChartTitle,
//         text: 'Journal Distribution by Quartile',
//         font: {
//           size: fontSize
//         }
//       },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           label: (context) => `Count: ${context.parsed[chartOrientation === 'horizontal' ? 'x' : 'y']}`
//         }
//       }
//     },
//     scales: {
//       x: {
//         grid: {
//           display: showGrid
//         },
//         title: {
//           display: true,
//           text: chartOrientation === 'horizontal' ? yAxisLabel : xAxisLabel,
//           font: {
//             size: xAxisLabelSize
//           }
//         },
//         ticks: {
//           font: {
//             size: fontSize
//           }
//         }
//       },
//       y: {
//         grid: {
//           display: showGrid
//         },
//         title: {
//           display: true,
//           text: chartOrientation === 'horizontal' ? xAxisLabel : yAxisLabel,
//           font: {
//             size: yAxisLabelSize
//           }
//         },
//         ticks: {
//           font: {
//             size: fontSize
//           }
//         }
//       }
//     }
//   };

//   return (
//     <div style={{ margin: "auto", padding: "20px", maxWidth: "1400px" }}>
//       <div style={{ display: "flex", gap: "20px" }}>
//         <div style={{ flex: 1, minWidth: "300px", maxWidth: "820px" }}>
//           <div style={{ height: "500px", background: "white" }}>
//             <Bar data={chartData} options={chartOptions} />
//           </div>
//         </div>

//         <div style={{ flex: "0 0 300px" }}>
//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Chart Orientation:
//               <select
//                 value={chartOrientation}
//                 onChange={(e) => setChartOrientation(e.target.value)}
//                 style={{ marginLeft: "10px", width: "150px" }}
//               >
//                 <option value="vertical">Vertical</option>
//                 <option value="horizontal">Horizontal</option>
//               </select>
//             </label>
//           </div>

//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Chart Color:
//               <input
//                 type="color"
//                 value={chartColor}
//                 onChange={(e) => setChartColor(e.target.value)}
//                 style={{ marginLeft: "10px" }}
//               />
//             </label>

//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Border Color:
//               <input
//                 type="color"
//                 value={borderColor}
//                 onChange={(e) => setBorderColor(e.target.value)}
//                 style={{ marginLeft: "10px" }}
//               />
//             </label>
//           </div>

//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ display: "block" }}>
//               Show Grid:
//               <input
//                 type="checkbox"
//                 checked={showGrid}
//                 onChange={(e) => setShowGrid(e.target.checked)}
//                 style={{ marginLeft: "10px" }}
//               />
//             </label>
//           </div>

//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Font Size:
//               <input
//                 type="range"
//                 min="8"
//                 max="24"
//                 value={fontSize}
//                 onChange={(e) => setFontSize(parseInt(e.target.value))}
//                 style={{ marginLeft: "10px", width: "120px" }}
//               />
//               <span style={{ marginLeft: "5px" }}>{fontSize}px</span>
//             </label>
//           </div>

//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ display: "block" }}>
//               Show Chart Title:
//               <input
//                 type="checkbox"
//                 checked={showChartTitle}
//                 onChange={(e) => setShowChartTitle(e.target.checked)}
//                 style={{ marginLeft: "10px" }}
//               />
//             </label>

//             <label style={{ display: "block", marginTop: "10px" }}>
//               Show Legend:
//               <input
//                 type="checkbox"
//                 checked={showLegend}
//                 onChange={(e) => setShowLegend(e.target.checked)}
//                 style={{ marginLeft: "10px" }}
//               />
//             </label>
//           </div>

//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ display: "block", marginBottom: "10px" }}>
//               X-Axis Label:
//               <input
//                 type="text"
//                 value={xAxisLabel}
//                 onChange={(e) => setXAxisLabel(e.target.value)}
//                 style={{ marginLeft: "10px", width: "150px" }}
//               />
//             </label>

//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Y-Axis Label:
//               <input
//                 type="text"
//                 value={yAxisLabel}
//                 onChange={(e) => setYAxisLabel(e.target.value)}
//                 style={{ marginLeft: "10px", width: "150px" }}
//               />
//             </label>
//           </div>

//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ display: "block", marginBottom: "10px" }}>
//               X-Axis Label Size:
//               <input
//                 type="range"
//                 min="8"
//                 max="24"
//                 value={xAxisLabelSize}
//                 onChange={(e) => setXAxisLabelSize(parseInt(e.target.value))}
//                 style={{ marginLeft: "10px", width: "120px" }}
//               />
//               <span style={{ marginLeft: "5px" }}>{xAxisLabelSize}px</span>
//             </label>

//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Y-Axis Label Size:
//               <input
//                 type="range"
//                 min="8"
//                 max="24"
//                 value={yAxisLabelSize}
//                 onChange={(e) => setYAxisLabelSize(parseInt(e.target.value))}
//                 style={{ marginLeft: "10px", width: "120px" }}
//               />
//               <span style={{ marginLeft: "5px" }}>{yAxisLabelSize}px</span>
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Quartile;

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Quartile = () => {
  const [quartileData, setQuartileData] = useState([]);
  const [chartColor, setChartColor] = useState("#2563eb");
  const [borderColor, setBorderColor] = useState("#1e40af");
  const [showGrid, setShowGrid] = useState(true);
  const [fontSize, setFontSize] = useState(12);
  const [chartOrientation, setChartOrientation] = useState("vertical");
  const [showChartTitle, setShowChartTitle] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [xAxisLabel, setXAxisLabel] = useState("Quartile");
  const [yAxisLabel, setYAxisLabel] = useState("Number of Journals");
  const [xAxisLabelSize, setXAxisLabelSize] = useState(12);
  const [yAxisLabelSize, setYAxisLabelSize] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [issnToQuartile, setIssnToQuartile] = useState(new Map());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch Scimago data and create ISSN mapping
        const scimagoResponse = await fetch('/scimagojr 2023.csv');
        const scimagoText = await scimagoResponse.text();
        
        Papa.parse(scimagoText, {
          header: true,
          delimiter: ";",
          complete: async (results) => {
            // Create ISSN mapping
            const mapping = new Map();
            results.data.forEach(row => {
              if (row.Issn) {
                const issns = row.Issn.replace(/["\s]/g, '').split(',');
                issns.forEach(issn => {
                  mapping.set(issn, row["SJR Best Quartile"]);
                });
              }
            });
            setIssnToQuartile(mapping);

            // Fetch journal data from API
            try {
              const apiResponse = await fetch("http://3.6.36.17:80/api/get-data/");
              const journalData = await apiResponse.json();

              // Process journal data with ISSN mapping
              const quartileCounts = {
                Q1: 0,
                Q2: 0,
                Q3: 0,
                Q4: 0
              };

              journalData.forEach(journal => {
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
            } catch (err) {
              setError("Error fetching journal data: " + err.message);
            }
          }
        });
      } catch (err) {
        setError("Error fetching Scimago data: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Number of Journals',
      data: quartileData,
      backgroundColor: chartColor,
      borderColor: borderColor,
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    indexAxis: chartOrientation === 'horizontal' ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
      },
      title: {
        display: showChartTitle,
        text: 'Journal Distribution by Quartile',
        font: {
          size: fontSize
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `Count: ${context.parsed[chartOrientation === 'horizontal' ? 'x' : 'y']}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: showGrid
        },
        title: {
          display: true,
          text: chartOrientation === 'horizontal' ? yAxisLabel : xAxisLabel,
          font: {
            size: xAxisLabelSize
          }
        },
        ticks: {
          font: {
            size: fontSize
          }
        }
      },
      y: {
        grid: {
          display: showGrid
        },
        title: {
          display: true,
          text: chartOrientation === 'horizontal' ? xAxisLabel : yAxisLabel,
          font: {
            size: yAxisLabelSize
          }
        },
        ticks: {
          font: {
            size: fontSize
          }
        }
      }
    }
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
    <div style={{ margin: "auto", padding: "20px", maxWidth: "1400px" }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1, minWidth: "300px", maxWidth: "820px" }}>
          {error && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              {error}
            </div>
          )}
          <div style={{ height: "500px", background: "white" }}>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                Loading...
              </div>
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )}
          </div>
        </div>

        <div style={{ flex: "0 0 300px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Chart Orientation:
              <select
                value={chartOrientation}
                onChange={(e) => setChartOrientation(e.target.value)}
                style={{ marginLeft: "10px", width: "150px" }}
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Chart Color:
              <input
                type="color"
                value={chartColor}
                onChange={(e) => setChartColor(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "10px" }}>
              Border Color:
              <input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block" }}>
              Show Grid:
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Font Size:
              <input
                type="range"
                min="8"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                style={{ marginLeft: "10px", width: "120px" }}
              />
              <span style={{ marginLeft: "5px" }}>{fontSize}px</span>
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block" }}>
              Show Chart Title:
              <input
                type="checkbox"
                checked={showChartTitle}
                onChange={(e) => setShowChartTitle(e.target.checked)}
                style={{ marginLeft: "10px" }}
              />
            </label>

            <label style={{ display: "block", marginTop: "10px" }}>
              Show Legend:
              <input
                type="checkbox"
                checked={showLegend}
                onChange={(e) => setShowLegend(e.target.checked)}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              X-Axis Label:
              <input
                type="text"
                value={xAxisLabel}
                onChange={(e) => setXAxisLabel(e.target.value)}
                style={{ marginLeft: "10px", width: "150px" }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "10px" }}>
              Y-Axis Label:
              <input
                type="text"
                value={yAxisLabel}
                onChange={(e) => setYAxisLabel(e.target.value)}
                style={{ marginLeft: "10px", width: "150px" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              X-Axis Label Size:
              <input
                type="range"
                min="8"
                max="24"
                value={xAxisLabelSize}
                onChange={(e) => setXAxisLabelSize(parseInt(e.target.value))}
                style={{ marginLeft: "10px", width: "120px" }}
              />
              <span style={{ marginLeft: "5px" }}>{xAxisLabelSize}px</span>
            </label>

            <label style={{ display: "block", marginBottom: "10px" }}>
              Y-Axis Label Size:
              <input
                type="range"
                min="8"
                max="24"
                value={yAxisLabelSize}
                onChange={(e) => setYAxisLabelSize(parseInt(e.target.value))}
                style={{ marginLeft: "10px", width: "120px" }}
              />
              <span style={{ marginLeft: "5px" }}>{yAxisLabelSize}px</span>
            </label>
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
    </div>
  );
};

export default Quartile;