// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { Bar } from "react-chartjs-2";
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from "chart.js";

// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend
// // );

// // const Journals = () => {
// //   const [data, setData] = useState([]);
// //   const [topJournals, setTopJournals] = useState([]);
// //   const [yearRange, setYearRange] = useState([]);
// //   const [startYear, setStartYear] = useState("");
// //   const [endYear, setEndYear] = useState("");
// //   const [maxDisplayCount, setMaxDisplayCount] = useState(15);
// //   const [showGrid, setShowGrid] = useState(true);
// //   const [chartOrientation, setChartOrientation] = useState("horizontal");
// //   const [chartColor, setChartColor] = useState("#2563eb");
// //   const [fontSize, setFontSize] = useState(10);
// //   const [chartTitle, setChartTitle] = useState("Journal Distribution");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [noDataMessage, setNoDataMessage] = useState("");

// //   useEffect(() => {
// //     setIsLoading(true);
// //     fetchData();
// //   }, []);

// //   const fetchData = async () => {
    
// //     setError(null);
// //     try {
// //       const response = await axios.get("http://3.6.36.17:80/api/get-data/");
// //       const years = [...new Set(response.data.map(item => item.Year))].sort();
// //       setYearRange(years);
// //       setStartYear(years[0]);
// //       setEndYear(years[years.length - 1]);
// //       processJournalData(response.data);
// //     } catch (err) {
// //       console.error(`Error fetching data:`, err);
// //       setError(err.message);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const processJournalData = (data) => {
// //     const journalCounts = data.reduce((acc, item) => {
// //       const journal = item['Source title'] || 
// //                      item['source title'] || 
// //                      item.Source_title || 
// //                      'Unknown Journal';
      
// //       if (journal && journal.trim() !== '') {
// //         const normalizedJournal = journal.trim();
// //         acc[normalizedJournal] = (acc[normalizedJournal] || 0) + 1;
// //       }
// //       return acc;
// //     }, {});

// //     const sortedJournals = Object.entries(journalCounts)
// //       .sort((a, b) => b[1] - a[1])
// //       .slice(0, maxDisplayCount);

// //     setTopJournals(sortedJournals);
// //     setNoDataMessage(sortedJournals.length === 0 ? "No data available" : "");
// //   };

// //   const chartData = {
// //     labels: topJournals.map(([name]) => name),
// //     datasets: [
// //       {
// //         label: "Publications",
// //         data: topJournals.map(([, count]) => count),
// //         backgroundColor: chartColor,
// //         borderColor: chartColor,
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   const chartOptions = {
// //     indexAxis: chartOrientation === "horizontal" ? "y" : "x",
// //     responsive: true,
// //     maintainAspectRatio: false,
// //     plugins: {
// //       legend: {
// //         position: "top",
// //         labels: {
// //           font: {
// //             size: fontSize,
// //           },
// //         },
// //       },
// //       title: {
// //         display: true,
// //         text: chartTitle,
// //         font: {
// //           size: fontSize + 4,
// //           weight: "bold",
// //         },
// //       },
// //     },
// //     scales: {
// //       x: {
// //         grid: {
// //           display: showGrid,
// //         },
// //         ticks: {
// //           font: {
// //             size: fontSize,
// //           },
// //         },
// //       },
// //       y: {
// //         grid: {
// //           display: showGrid,
// //         },
// //         ticks: {
// //           font: {
// //             size: fontSize,
// //           },
// //         },
// //       },
// //     },
// //   };

// //   const styles = {
// //     container: {
// //       display: "flex",
// //       gap: "24px",
// //       maxWidth: "1200px",
// //       margin: "0 auto",
// //       padding: "16px",
// //     },
// //     chartPanel: {
// //       flex: "2",
// //       backgroundColor: "white",
// //       borderRadius: "8px",
// //       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
// //       padding: "24px",
// //     },
// //     controlPanel: {
// //       flex: "1",
// //       backgroundColor: "white",
// //       borderRadius: "8px",
// //       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
// //       padding: "24px",
// //       fontSize: "10px",
// //     },
// //     loadingContainer: {
// //       display: "flex",
// //       alignItems: "center",
// //       justifyContent: "center",
// //       height: "100%",
// //       width: "100%",
// //     },
// //     spinner: {
// //       width: "48px",
// //       height: "48px",
// //       border: "4px solid #2563eb",
// //       borderTopColor: "transparent",
// //       borderRadius: "50%",
// //       animation: "spin 1s linear infinite",
// //     },
// //     chartContainer: {
// //       height: "500px",
// //       position: "relative",
// //     },
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <style>
// //         {`
// //           @keyframes spin {
// //             0% { transform: rotate(0deg); }
// //             100% { transform: rotate(360deg); }
// //           }
// //         `}
// //       </style>
// //       <div style={styles.chartPanel}>
// //         {isLoading ? (
// //           <div style={styles.loadingContainer}>
// //             <div style={styles.spinner} />
// //           </div>
// //         ) : error ? (
// //           <div>Error: {error}</div>
// //         ) : noDataMessage ? (
// //           <div>{noDataMessage}</div>
// //         ) : (
// //           <div style={styles.chartContainer}>
// //             <Bar data={chartData} options={chartOptions} />
// //           </div>
// //         )}
// //       </div>
// //       <div style={styles.controlPanel}>
// //         <h3>Display Options</h3>
// //         <div>
// //           <label>
// //             Max Display Count:
// //             <select
// //               value={maxDisplayCount}
// //               onChange={(e) => setMaxDisplayCount(Number(e.target.value))}
// //             >
// //               <option value={5}>Top 5</option>
// //               <option value={10}>Top 10</option>
// //               <option value={15}>Top 15</option>
// //               <option value={20}>Top 20</option>
// //             </select>
// //           </label>
// //         </div>
// //         <div>
// //           <label>
// //             Chart Orientation:
// //             <select
// //               value={chartOrientation}
// //               onChange={(e) => setChartOrientation(e.target.value)}
// //             >
// //               <option value="horizontal">Horizontal</option>
// //               <option value="vertical">Vertical</option>
// //             </select>
// //           </label>
// //         </div>
// //         <div>
// //           <label>
// //             Font Size:
// //             <input
// //               type="number"
// //               value={fontSize}
// //               onChange={(e) => setFontSize(Number(e.target.value))}
// //               min="8"
// //               max="16"
// //             />
// //           </label>
// //         </div>
// //         <div>
// //           <label>
// //             <input
// //               type="checkbox"
// //               checked={showGrid}
// //               onChange={(e) => setShowGrid(e.target.checked)}
// //             />
// //             Show Grid
// //           </label>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Journals;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Bar } from "react-chartjs-2";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faDownload } from "@fortawesome/free-solid-svg-icons";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Journals = () => {
//   const [data, setData] = useState([]);
//   const [topJournals, setTopJournals] = useState([]);
//   const [yearRange, setYearRange] = useState([]);
//   const [startYear, setStartYear] = useState("");
//   const [endYear, setEndYear] = useState("");
//   const [maxDisplayCount, setMaxDisplayCount] = useState(15);
//   const [displayedJournalsCount, setDisplayedJournalsCount] = useState(0);
//   const [sliderMax, setSliderMax] = useState(15);
//   const [showGrid, setShowGrid] = useState(true);
//   const [chartOrientation, setChartOrientation] = useState("horizontal");
//   const [chartColor, setChartColor] = useState("#2563eb");
//   const [borderColor, setBorderColor] = useState("#1e40af");
//   const [fontSize, setFontSize] = useState(12);
//   const [xAxisLabel, setXAxisLabel] = useState("Journals");
//   const [yAxisLabel, setYAxisLabel] = useState("Number of Publications");
//   const [xAxisLabelSize, setXAxisLabelSize] = useState(12);
//   const [yAxisLabelSize, setYAxisLabelSize] = useState(12);
//   const [showChartTitle, setShowChartTitle] = useState(true);
//   const [showLegend, setShowLegend] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [noDataMessage, setNoDataMessage] = useState("");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get("http://3.6.36.17:80/api/get-data/");
//       const years = [...new Set(response.data.map(item => item.Year))].sort();
//       setYearRange(years);
//       setStartYear(years[0]);
//       setEndYear(years[years.length - 1]);
//       processJournalData(response.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const processJournalData = (data) => {
//     const journalCounts = {};
//     data.forEach(item => {
//       const journal = item['Source title'] || item.Source_title || 'Unknown';
//       journalCounts[journal] = (journalCounts[journal] || 0) + 1;
//     });

//     const sortedJournals = Object.entries(journalCounts)
//       .sort(([,a], [,b]) => b - a)
//       .slice(0, maxDisplayCount);

//     setTopJournals(sortedJournals);
//     setDisplayedJournalsCount(Object.keys(journalCounts).length);
//     setSliderMax(Math.min(50, Object.keys(journalCounts).length));
//   };

//   const handleYearChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "startYear") setStartYear(value);
//     if (name === "endYear") setEndYear(value);
//   };

//   const applyYearFilter = () => {
//     const filteredData = data.filter(
//       item => item.Year >= startYear && item.Year <= endYear
//     );
//     processJournalData(filteredData);
//   };

//   const handleSliderChange = (e) => {
//     setMaxDisplayCount(Number(e.target.value));
//     processJournalData(data);
//   };

//   const chartData = {
//     labels: topJournals.map(item => item[0]),
//     datasets: [{
//       label: "Number of Publications",
//       data: topJournals.map(item => item[1]),
//       backgroundColor: chartColor,
//       borderColor: borderColor,
//       borderWidth: 1,
//     }]
//   };

//   const chartOptions = {
//     indexAxis: chartOrientation === "horizontal" ? "y" : "x",
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: showLegend,
//         position: "top",
//       },
//       title: {
//         display: showChartTitle,
//         text: "Journal Distribution",
//         font: { size: fontSize + 4 }
//       },
//     },
//     scales: {
//       x: {
//         grid: { display: showGrid },
//         title: {
//           display: true,
//           text: xAxisLabel,
//           font: { size: xAxisLabelSize }
//         }
//       },
//       y: {
//         grid: { display: showGrid },
//         title: {
//           display: true,
//           text: yAxisLabel,
//           font: { size: yAxisLabelSize }
//         }
//       }
//     }
//   };

//   const styles = {
//     container: {
//       margin: "auto",
//       padding: "20px",
//       maxWidth: "1400px",
//       fontSize: "12px",
//     },
//     mainContent: {
//       display: "flex",
//       gap: "20px",
//       flexWrap: "wrap",
//     },
//     chartSection: {
//       flex: "1",
//       minWidth: "300px",
//       maxWidth: "820px",
//       backgroundColor: "white",
//       borderRadius: "8px",
//       boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//       padding: "20px",
//     },
//     loadingContainer: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       minHeight: "500px",
//     },
//     spinner: {
//       width: "50px",
//       height: "50px",
//       border: "5px solid #f3f3f3",
//       borderTop: "5px solid #3498db",
//       borderRadius: "50%",
//       animation: "spin 1s linear infinite",
//     },
//     controlPanel: {
//       marginLeft: "20px",
//       flex: "0 0 300px",
//       padding: "20px",
//       backgroundColor: "white",
//       borderRadius: "8px",
//       boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//     },
//     chartContainer: {
//       height: "500px",
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//       <div style={styles.mainContent}>
//         <div style={styles.chartSection}>
//           {isLoading ? (
//             <div style={styles.loadingContainer}>
//               <div style={styles.spinner} />
//             </div>
//           ) : error ? (
//             <div className="alert alert-danger">{error}</div>
//           ) : noDataMessage ? (
//             <div className="alert alert-warning">{noDataMessage}</div>
//           ) : (
//             <div style={styles.chartContainer}>
//               <Bar data={chartData} options={chartOptions} />
//             </div>
//           )}
//         </div>

//         <div style={styles.controlPanel}>
//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Display Count:
//               <input
//                 type="range"
//                 min="1"
//                 max={sliderMax}
//                 value={maxDisplayCount}
//                 onChange={handleSliderChange}
//                 style={{ width: "100%" }}
//               />
//               <span>{maxDisplayCount}</span>
//             </label>
//           </div>

//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Chart Options:
//               <select
//                 value={chartOrientation}
//                 onChange={(e) => setChartOrientation(e.target.value)}
//                 style={{ width: "100%", marginTop: "5px" }}
//               >
//                 <option value="horizontal">Horizontal</option>
//                 <option value="vertical">Vertical</option>
//               </select>
//             </label>

//             <div style={{ marginTop: "10px" }}>
//               <label style={{ marginRight: "15px" }}>
//                 <input
//                   type="checkbox"
//                   checked={showGrid}
//                   onChange={(e) => setShowGrid(e.target.checked)}
//                 /> Show Grid
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={showLegend}
//                   onChange={(e) => setShowLegend(e.target.checked)}
//                 /> Show Legend
//               </label>
//             </div>
//           </div>

//           <div style={{ marginBottom: "20px" }}>
//             <button
//               className="btn btn-primary"
//               style={{ marginRight: "10px" }}
//               onClick={() => {/* Add download handler */}}
//             >
//               <FontAwesomeIcon icon={faDownload} style={{ marginRight: "5px" }} />
//               PNG
//             </button>
//             <button
//               className="btn btn-secondary"
//               onClick={() => {/* Add CSV export handler */}}
//             >
//               <FontAwesomeIcon icon={faDownload} style={{ marginRight: "5px" }} />
//               CSV
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Journals;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Journals = () => {
  const [data, setData] = useState([]);
  const [topJournals, setTopJournals] = useState([]);
  const [yearRange, setYearRange] = useState([]);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [maxDisplayCount, setMaxDisplayCount] = useState(15);
  const [displayedJournalsCount, setDisplayedJournalsCount] = useState(0);
  const [sliderMax, setSliderMax] = useState(15);
  const [showGrid, setShowGrid] = useState(true);
  const [chartOrientation, setChartOrientation] = useState("horizontal");
  const [chartColor, setChartColor] = useState("#2563eb");
  const [borderColor, setBorderColor] = useState("#1e40af");
  const [fontSize, setFontSize] = useState(12);
  const [xAxisLabel, setXAxisLabel] = useState("Journals");
  const [yAxisLabel, setYAxisLabel] = useState("Number of Publications");
  const [xAxisLabelSize, setXAxisLabelSize] = useState(12);
  const [yAxisLabelSize, setYAxisLabelSize] = useState(12);
  const [showChartTitle, setShowChartTitle] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://3.6.36.17:80/api/get-data/");
      const years = [...new Set(response.data.map(item => item.Year))].sort();
      setYearRange(years);
      setStartYear(years[0]);
      setEndYear(years[years.length - 1]);
      setData(response.data);
      processJournalData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      }
    };

  const processJournalData = (data) => {
    const journalCounts = {};
    data.forEach(item => {
      const journal = item['Source title'] || item.Source_title || 'Unknown';
      journalCounts[journal] = (journalCounts[journal] || 0) + 1;
    });

    const sortedJournals = Object.entries(journalCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxDisplayCount);

    setTopJournals(sortedJournals);
    setDisplayedJournalsCount(Object.keys(journalCounts).length);
    setSliderMax(Math.min(50, Object.keys(journalCounts).length));
  };

  const handleYearChange = (e) => {
    const { name, value } = e.target;
    if (name === "startYear") setStartYear(value);
    if (name === "endYear") setEndYear(value);
  };

  const applyYearFilter = () => {
    const filteredData = data.filter(
      item => item.Year >= startYear && item.Year <= endYear
    );
    processJournalData(filteredData);
  };

  const handleSliderChange = (e) => {
    setMaxDisplayCount(Number(e.target.value));
    processJournalData(data);
  };

  const handleDownload = async () => {
    try {
      const chartElement = document.getElementById('bar-chart');
      if (chartElement) {
        const dataUrl = await toPng(chartElement);
        saveAs(dataUrl, 'journals_chart.png');
      }
    } catch (err) {
      console.error('Error downloading chart:', err);
    }
  };

  const exportToCSV = () => {
    const csvData = topJournals.map(([journal, count]) => `${journal},${count}`).join('\n');
    const blob = new Blob([`Journal,Publications\n${csvData}`], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'journals_data.csv');
  };

  const chartData = {
    labels: topJournals.map(item => item[0]),
    datasets: [{
      label: "Number of Publications",
      data: topJournals.map(item => item[1]),
      backgroundColor: chartColor,
      borderColor: borderColor,
      borderWidth: 1,
    }]
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
        display: showChartTitle,
        text: `Top ${maxDisplayCount} Publishers`,
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
      datalabels: {
        anchor: chartOrientation === "horizontal" ? "end" : "end",
        align: chartOrientation === "horizontal" ? "right" : "top",
        color: "#000000", // Data labels font color
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 4,
        font: {
          weight: "bold",
          size: 12,
        },
        padding: 6,
        formatter: (value) => `${value}`,
        display: (context) => context.dataset.data[context.dataIndex] > 0,
      },
    },
    scales: {
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
          text: chartOrientation === "horizontal" ? yAxisLabel : xAxisLabel,
          color: "#000000", // X-axis title color
          font: {
            size: xAxisLabelSize,
          },
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          display: showGrid,
          drawBorder: true,
          // Set y-axis border color to black
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
          text: chartOrientation === "horizontal" ? xAxisLabel : yAxisLabel,
          color: "#000000", // Y-axis title color
          font: {
            size: yAxisLabelSize,
          },
        },
      },
    },
  };

  const styles = {
    container: {
      margin: "auto",
      padding: "20px",
      maxWidth: "1400px",
      fontSize: "12px",
    },
    mainContent: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    },
    chartSection: {
      flex: "1",
      minWidth: "300px",
      maxWidth: "820px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      padding: "20px",
    },
    loadingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "500px",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "5px solid #f3f3f3",
      borderTop: "5px solid #3498db",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    controlPanel: {
      marginLeft: "20px",
      // flex: "0 0 300px",
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    chartContainer: {
      height: "500px",
    },
    control: {
      marginBottom: "15px",
    },

    select: {
      width: "100%",
      padding: "8px",
      marginBottom: "10px",
    },
    colorPicker: {
      marginLeft: "10px",
      width: "60px",
    },

    button: {
      width: "100%",
      padding: "8px",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={styles.mainContent}>
        <div style={styles.chartSection}>
          {isLoading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner} />
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : noDataMessage ? (
            <div className="alert alert-warning">{noDataMessage}</div>
          ) : (
            <div id="bar-chart" style={styles.chartContainer}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
          
        </div>

        <div style={styles.controlPanel}>
          <div style={styles.control}>
            <label style={styles.label}>
              Display Count:
              <input
                type="range"
                min="1"
                max={sliderMax}
                value={maxDisplayCount}
                onChange={handleSliderChange}
                style={{ width: "100%" }}
              />
              <span>{maxDisplayCount}</span>
            </label>

            <button
              className="btn btn-primary"
              style={{ marginTop: "10px", width: "100%" }}
              onClick={applyYearFilter}
            >
              Apply Filter
            </button>
          </div>

         {/* Chart Customization Controls */}
         <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Chart Orientation:
              <select
                value={chartOrientation}
                onChange={(e) => setChartOrientation(e.target.value)}
                style={{ marginLeft: "10px" }}
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </label>

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

            <label style={{ display: "block", marginBottom: "10px" }}>
                  Graph Size:
                  <input
                    type="range"
                    min="8"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    style={{ marginLeft: "10px", width: "120px" }}
                  />
                  <span style={{ marginLeft: "5px" }}>{fontSize}</span>
              </label>

            <div style={{ display: "flex" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      marginLeft: "3px",
                    }}
                  >
                    Show Chart Title:
                    <input
                      type="checkbox"
                      checked={showChartTitle}
                      onChange={(e) => setShowChartTitle(e.target.checked)}
                      style={{ marginLeft: "10px" }}
                    />
                  </label>
    
                  <label
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      marginLeft: "3px",
                    }}
                  >
                    Show Legend:
                    <input
                      type="checkbox"
                      checked={showLegend}
                      onChange={(e) => setShowLegend(e.target.checked)}
                      style={{ marginLeft: "10px" }}
                    />
                  </label>
    
                  <label
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      marginLeft: "3px",
                    }}
                  >
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
                  X-Axis Label:
                  <input
                    type="text"
                    value={xAxisLabel}
                    onChange={(e) => setXAxisLabel(e.target.value)}
                    style={{ marginLeft: "10px", width: "100%" }}
                  />
                </label>
            </div>
            <label style={{ display: "block", marginBottom: "10px" }}>
                    Y-Axis Label:
                    <input
                      type="text"
                      value={yAxisLabel}
                      onChange={(e) => setYAxisLabel(e.target.value)}
                      style={{ marginLeft: "10px", width: "100%" }}
                    />
                  </label>
    
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
                    <span style={{ marginLeft: "5px" }}>{xAxisLabelSize}</span>
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
                    <span style={{ marginLeft: "5px" }}>{yAxisLabelSize}</span>
                  </label>
    
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              className="btn btn-primary"
              style={{ marginRight: "10px" }}
              onClick={handleDownload}
            >
              <FontAwesomeIcon icon={faDownload} style={{ marginRight: "5px" }} />
              PNG
            </button>
            <button
              className="btn btn-secondary"
              onClick={exportToCSV}
            >
              <FontAwesomeIcon icon={faDownload} style={{ marginRight: "5px" }} />
              CSV
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Journals;