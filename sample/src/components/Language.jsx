// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   Chart as ChartJS,
// //   ArcElement,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   PointElement,
// //   LineElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from "chart.js";
// // import { Chart } from "react-chartjs-2";
// // import { toPng } from 'html-to-image';
// // import { saveAs } from 'file-saver';
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faDownload } from "@fortawesome/free-solid-svg-icons";

// // ChartJS.register(
// //   ArcElement,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   PointElement,
// //   LineElement,
// //   Title,
// //   Tooltip,
// //   Legend
// // );

// // const Language = () => {
// //   const chartRef = useRef(null);
// //   const [chartType, setChartType] = useState("scatter");
// //   const [showLegend, setShowLegend] = useState(true);
// //   const [yearRange, setYearRange] = useState([]);
// //   const [startYear, setStartYear] = useState("");
// //   const [endYear, setEndYear] = useState("");
// //   const [maxDisplayCount, setMaxDisplayCount] = useState(15);
// //   const [topLanguages, setTopLanguages] = useState([]);
// //   const [showGrid, setShowGrid] = useState(true);
// //   const [chartOrientation, setChartOrientation] = useState("horizontal");
// //   const [chartColor, setChartColor] = useState("#2563eb");
// //   const [fontSize, setFontSize] = useState(10);
// //   const [chartTitle, setChartTitle] = useState("Language Distribution");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [useLogScale, setUseLogScale] = useState(true);

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const fetchData = async () => {
// //     setIsLoading(true);
// //     try {
// //       const response = await fetch("http://127.0.0.1:8000/api/get-data/");
// //       const data = await response.json();
// //       const years = [...new Set(data.map((item) => item.Year))].sort();
// //       setYearRange(years);
// //       setStartYear(years[0]);
// //       setEndYear(years[years.length - 1]);
// //       processLanguageData(data);
// //     } catch (err) {
// //       console.error(`Error fetching data:`, err);
// //       setError("Failed to fetch data. Please try again later.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const processLanguageData = (data) => {
// //     const languageCounts = data.reduce((acc, item) => {
// //       const lang = item['Language of Original Document'] || 
// //                   item['language of original document'] || 
// //                   item.Language || 
// //                   item.language;
                  
// //       if (lang && lang.trim() !== '' && lang.toLowerCase() !== 'unknown') {
// //         const normalizedLang = lang.trim();
// //         acc[normalizedLang] = (acc[normalizedLang] || 0) + 1;
// //       }
// //       return acc;
// //     }, {});

// //     const sortedLanguages = Object.entries(languageCounts)
// //       .sort((a, b) => b[1] - a[1])
// //       .slice(0, maxDisplayCount);

// //     setTopLanguages(sortedLanguages);
// //   };

// //   const getChartData = () => {
// //     if (chartType === 'scatter') {
// //       return {
// //         datasets: [{
// //           label: 'Language Distribution',
// //           data: topLanguages.map((lang, index) => {
// //             const value = lang[1];
// //             const y = useLogScale 
// //               ? value === 0 
// //                 ? 0 
// //                 : Math.log10(value)
// //               : value;
            
// //             return {
// //               x: index + 1,
// //               y: y,
// //               label: lang[0],
// //               originalValue: value
// //             };
// //           }),
// //           backgroundColor: chartColor,
// //           pointRadius: 6,
// //           pointHoverRadius: 8,
// //         }]
// //       };
// //     }

// //     return {
// //       labels: topLanguages.map(([name]) => name),
// //       datasets: [{
// //         label: "Count",
// //         data: topLanguages.map(([_, count]) => count),
// //         backgroundColor: chartType === "bar" ? chartColor : colors,
// //         borderColor: chartType === "bar" ? chartColor : colors,
// //         borderWidth: 1,
// //       }],
// //     };
// //   };

// //   const getChartOptions = () => {
// //     const baseOptions = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: {
// //         legend: {
// //           display: showLegend,
// //           position: "top",
// //           labels: {
// //             color: "#000000",
// //             font: { size: fontSize },
// //           },
// //         },
// //         title: {
// //           display: true,
// //           text: chartTitle,
// //           color: "#000000",
// //           font: { size: 16 },
// //         },
// //         tooltip: {
// //           enabled: true,
// //           callbacks: {
// //             label: function(context) {
// //               if (chartType === 'scatter') {
// //                 const point = context.raw;
// //                 return `${point.label}: ${point.originalValue}`;
// //               }
// //               return context.formattedValue;
// //             }
// //           },
// //           bodyFont: {
// //             size: fontSize,
// //             color: "#000000",
// //           },
// //         },
// //       },
// //     };

// //     if (chartType === 'scatter') {
// //       return {
// //         ...baseOptions,
// //         scales: {
// //           x: {
// //             display: true,
// //             grid: { display: showGrid },
// //             title: {
// //               display: true,
// //               text: 'Language Index',
// //               color: "#000000",
// //             },
// //             ticks: {
// //               callback: function(value) {
// //                 const language = topLanguages[value - 1];
// //                 return language ? language[0] : '';
// //               }
// //             }
// //           },
// //           y: {
// //             display: true,
// //             grid: { display: showGrid },
// //             type: useLogScale ? 'logarithmic' : 'linear',
// //             title: {
// //               display: true,
// //               text: useLogScale ? 'Log10(Count)' : 'Count',
// //               color: "#000000",
// //             },
// //             ticks: {
// //               callback: function(value) {
// //                 if (useLogScale) {
// //                   return `10^${Math.floor(value)}`;
// //                 }
// //                 return value;
// //               }
// //             },
// //             min: useLogScale ? 0 : undefined,
// //             max: useLogScale 
// //               ? Math.ceil(Math.log10(Math.max(...topLanguages.map(l => l[1])))) 
// //               : undefined
// //           }
// //         },
// //         // Remove point labels
// //         plugins: {
// //           ...baseOptions.plugins,
// //           datalabels: {
// //             display: false
// //           }
// //         }
// //       };
// //     }

// //     return {
// //       ...baseOptions,
// //       indexAxis: chartOrientation === "horizontal" ? "y" : "x",
// //       scales: chartType === "bar" ? {
// //         x: {
// //           display: true,
// //           grid: { display: showGrid },
// //           title: {
// //             display: true,
// //             text: chartOrientation === "horizontal" ? "Number of Documents" : "Document Type",
// //             color: "#000000",
// //           },
// //         },
// //         y: {
// //           display: true,
// //           grid: { display: showGrid },
// //           title: {
// //             display: true,
// //             text: chartOrientation === "horizontal" ? "Document Type" : "Number of Documents",
// //             color: "#000000",
// //           },
// //         },
// //       } : {},
// //     };
// //   };

// //   const handleDownload = (format) => {
// //     const chartElement = chartRef.current?.canvas;
// //     if (!chartElement) return;

// //     if (format === 'png') {
// //       const originalBackground = chartElement.style.background;
// //       chartElement.style.background = 'white';
      
// //       toPng(chartElement, {
// //         backgroundColor: '#ffffff',
// //         style: { background: 'white' },
// //       })
// //         .then((dataUrl) => {
// //           saveAs(dataUrl, 'language_distribution.png');
// //           chartElement.style.background = originalBackground;
// //         })
// //         .catch((err) => {
// //           console.error('Error downloading chart:', err);
// //           chartElement.style.background = originalBackground;
// //         });
// //     }
// //   };

// //   const exportToCSV = () => {
// //     const csvData = topLanguages.map(([language, count]) => `${language},${count}`).join('\n');
// //     const blob = new Blob([`Language,Count\n${csvData}`], { type: 'text/csv;charset=utf-8;' });
// //     saveAs(blob, 'language_distribution.csv');
// //   };

// //   // Rest of your styles object remains the same
// //   const styles = {
// //     container: {
// //       display: "flex",
// //       gap: "24px",
// //       maxWidth: "1200px",
// //       margin: "0 auto",
// //       padding: "16px"
// //     },
// //     chartPanel: {
// //       flex: "2",
// //       backgroundColor: "white",
// //       borderRadius: "8px",
// //       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
// //       padding: "24px"
// //     },
// //     controlPanel: {
// //       flex: "1",
// //       backgroundColor: "white",
// //       borderRadius: "8px",
// //       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
// //       padding: "24px",
// //       fontSize: "10px"
// //     },
// //     title: {
// //       fontSize: "20px",
// //       fontWeight: "bold",
// //       marginBottom: "16px"
// //     },
// //     chartContainer: {
// //       height: "500px",
// //       position: "relative"
// //     },
// //     loadingSpinner: {
// //       position: "absolute",
// //       inset: "0",
// //       display: "flex",
// //       alignItems: "center",
// //       justifyContent: "center"
// //     },
// //     spinner: {
// //       width: "48px",
// //       height: "48px",
// //       border: "4px solid #2563eb",
// //       borderTopColor: "transparent",
// //       borderRadius: "50%",
// //       animation: "spin 1s linear infinite"
// //     },
// //     errorMessage: {
// //       position: "absolute",
// //       inset: "0",
// //       display: "flex",
// //       alignItems: "center",
// //       justifyContent: "center",
// //       color: "#dc2626"
// //     },
// //     controlGroup: {
// //       marginBottom: "16px"
// //     },
// //     label: {
// //       display: "block",
// //       fontSize: "14px",
// //       fontWeight: "500",
// //       marginBottom: "8px"
// //     },
// //     select: {
// //       width: "100%",
// //       padding: "8px",
// //       border: "1px solid #e5e7eb",
// //       borderRadius: "6px",
// //       backgroundColor: "white"
// //     },
// //     checkbox: {
// //       width: "12px",
// //       height: "12px",
// //       marginRight: "8px"
// //     },
// //     range: {
// //       width: "100%"
// //     },
// //     colorPicker: {
// //       width: "100%",
// //       height: "40px",
// //       borderRadius: "6px"
// //     }
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <div style={styles.chartPanel}>
// //         <div style={styles.chartContainer}>
// //           {isLoading ? (
// //             <div style={styles.loadingSpinner}>
// //               <div style={styles.spinner} />
// //             </div>
// //           ) : error ? (
// //             <div style={styles.errorMessage}>
// //               {error}
// //             </div>
// //           ) : (
// //             <Chart 
// //               ref={chartRef} 
// //               type={chartType === 'scatter' ? 'scatter' : chartType} 
// //               data={getChartData()} 
// //               options={getChartOptions()} 
// //             />
// //           )}
// //         </div>
// //       </div>

// //       <div style={styles.controlPanel}>
// //         <h2 style={styles.title}>Chart Options</h2>
// //         <div>
// //           <div style={styles.controlGroup}>
// //             <label style={styles.label}>Chart Type</label>
// //             <select
// //               value={chartType}
// //               onChange={(e) => setChartType(e.target.value)}
// //               style={styles.select}
// //             >
// //               <option value="scatter">Scatter Plot</option>
// //               <option value="bar">Bar Chart</option>
// //               <option value="pie">Pie Chart</option>
// //               <option value="doughnut">Doughnut Chart</option>
// //             </select>
// //           </div>

// //           {chartType !== 'scatter' && (
// //             <div style={styles.controlGroup}>
// //               <label style={styles.label}>Orientation</label>
// //               <select
// //                 value={chartOrientation}
// //                 onChange={(e) => setChartOrientation(e.target.value)}
// //                 style={styles.select}
// //               >
// //                 <option value="horizontal">Horizontal</option>
// //                 <option value="vertical">Vertical</option>
// //               </select>
// //             </div>
// //           )}

// //           <div style={styles.controlGroup}>
// //             <label style={{ display: "flex", alignItems: "center" }}>
// //               <input
// //                 type="checkbox"
// //                 checked={showGrid}
// //                 onChange={(e) => setShowGrid(e.target.checked)}
// //                 style={styles.checkbox}
// //               />
// //               Show Grid
// //             </label>
// //           </div>

// //           <div style={styles.controlGroup}>
// //             <label style={{ display: "flex", alignItems: "center" }}>
// //               <input
// //                 type="checkbox"
// //                 checked={showLegend}
// //                 onChange={(e) => setShowLegend(e.target.checked)}
// //                 style={styles.checkbox}
// //               />
// //               Show Legend
// //             </label>
// //           </div>

// //           {chartType === 'scatter' && (
// //             <div style={styles.controlGroup}>
// //               <label style={{ display: "flex", alignItems: "center" }}>
// //                 <input
// //                   type="checkbox"
// //                   checked={useLogScale}
// //                   onChange={(e) => setUseLogScale(e.target.checked)}
// //                   style={styles.checkbox}
// //                 />
// //                 Use Log Scale
// //               </label>
// //             </div>
// //           )}

// //           <div style={styles.controlGroup}>
// //             <label style={styles.label}>
// //               Font Size: {fontSize}px
// //             </label>
// //             <input
// //               type="range"
// //               min="8"
// //               max="24"
// //               value={fontSize}
// //               onChange={(e) => setFontSize(parseInt(e.target.value))}
// //               style={styles.range}
// //             />
// //           </div>

// //           <div style={styles.controlGroup}>
// //             <label style={styles.label}>Chart Color</label>
// //             <input
// //               type="color"
// //               value={chartColor}
// //               onChange={(e) => setChartColor(e.target.value)}
// //               style={styles.colorPicker}
// //             />
// //           </div>
// //           <div style={{ textAlign: "center", marginTop: "5px" }}>
// //             <button
// //               className="btn btn-primary"
// //               onClick={() => handleDownload("png")}
// //               style={{ marginRight: "10px" }}
// //             >
// //               <FontAwesomeIcon
// //                 icon={faDownload}
// //                 style={{ marginRight: "5px" }}
// //               />
// //               PNG
// //             </button>
// //             <button 
// //               className="btn btn-secondary" 
// //               onClick={exportToCSV}
// //             >
// //               <FontAwesomeIcon
// //                 icon={faDownload}
// //                 style={{ marginRight: "5px" }}
// //               />
// //               CSV
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Language;


// import React, { useState, useEffect, useRef } from "react";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Chart } from "react-chartjs-2";
// import { toPng } from 'html-to-image';
// import { saveAs } from 'file-saver';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faDownload } from "@fortawesome/free-solid-svg-icons";

// ChartJS.register(
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Language = () => {
//   const chartRef = useRef(null);
//   const [chartType, setChartType] = useState("bar");
//   const [showLegend, setShowLegend] = useState(true);
//   const [yearRange, setYearRange] = useState([]);
//   const [startYear, setStartYear] = useState("");
//   const [endYear, setEndYear] = useState("");
//   const [maxDisplayCount, setMaxDisplayCount] = useState(15);
//   const [topLanguages, setTopLanguages] = useState([]);
//   const [showGrid, setShowGrid] = useState(true);
//   const [chartOrientation, setChartOrientation] = useState("horizontal");
//   const [chartColor, setChartColor] = useState("#2563eb");
//   const [fontSize, setFontSize] = useState(10);
//   const [chartTitle, setChartTitle] = useState("Language Distribution");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [useLogScale, setUseLogScale] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/get-data/");
//       const data = await response.json();
//       const years = [...new Set(data.map((item) => item.Year))].sort();
//       setYearRange(years);
//       setStartYear(years[0]);
//       setEndYear(years[years.length - 1]);
//       processLanguageData(data);
//     } catch (err) {
//       console.error(`Error fetching data:`, err);
//       setError("Failed to fetch data. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const processLanguageData = (data) => {
//     const languageCounts = data.reduce((acc, item) => {
//       const lang = item['Language of Original Document'] || 
//                   item['language of original document'] || 
//                   item.Language || 
//                   item.language;
                  
//       if (lang && lang.trim() !== '' && lang.toLowerCase() !== 'unknown') {
//         const normalizedLang = lang.trim();
//         acc[normalizedLang] = (acc[normalizedLang] || 0) + 1;
//       }
//       return acc;
//     }, {});

//     const sortedLanguages = Object.entries(languageCounts)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, maxDisplayCount);

//     setTopLanguages(sortedLanguages);
//   };

//   const getChartData = () => {
//     return {
//       labels: topLanguages.map(([name]) => name),
//       datasets: [{
//         label: "Count",
//         data: topLanguages.map(([_, count]) => count),
//         backgroundColor: chartType === "bar" ? chartColor : generateColors(topLanguages.length),
//         borderColor: chartType === "bar" ? chartColor : generateColors(topLanguages.length),
//         borderWidth: 1,
//       }],
//     };
//   };

//   const generateColors = (count) => {
//     const colors = [];
//     for (let i = 0; i < count; i++) {
//       const hue = (i * 360) / count;
//       colors.push(`hsl(${hue}, 70%, 50%)`);
//     }
//     return colors;
//   };

//   const formatNumber = (value) => {
//     if (value === 0) return '0';
    
//     const log10 = Math.log10(value);
//     if (Math.abs(log10 - Math.round(log10)) < 0.0001) {
//       return `10${superscriptNumber(Math.round(log10))}`;
//     }
//     return value.toLocaleString();
//   };

//   const superscriptNumber = (num) => {
//     const superscripts = {
//       '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
//       '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
//       '-': '⁻'
//     };
//     return num.toString().split('').map(char => superscripts[char] || char).join('');
//   };

//   const getChartOptions = () => {
//     const baseOptions = {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           display: showLegend,
//           position: "top",
//           labels: {
//             color: "#000000",
//             font: { size: fontSize },
//           },
//         },
//         title: {
//           display: true,
//           text: chartTitle,
//           color: "#000000",
//           font: { size: 16 },
//         },
//         tooltip: {
//           enabled: true,
//           callbacks: {
//             label: function(context) {
//               const value = context.raw;
//               return ` ${value.toLocaleString()}`;
//             }
//           },
//           bodyFont: {
//             size: fontSize,
//           },
//         },
//       },
//     };

//     if (chartType === 'bar') {
//       const isHorizontal = chartOrientation === "horizontal";
//       const valueAxis = isHorizontal ? 'x' : 'y';
//       const categoryAxis = isHorizontal ? 'y' : 'x';

//       return {
//         ...baseOptions,
//         indexAxis: isHorizontal ? 'y' : 'x',
//         scales: {
//           [valueAxis]: {
//             display: true,
//             grid: { display: showGrid },
//             type: useLogScale ? 'logarithmic' : 'linear',
//             min: useLogScale ? 1 : 0,
//             title: {
//               display: true,
//               text: "Number of Documents",
//               color: "#000000",
//             },
//             ticks: {
//               callback: function(value) {
//                 return formatNumber(value);
//               },
//             },
//           },
//           [categoryAxis]: {
//             display: true,
//             grid: { display: showGrid },
//             title: {
//               display: true,
//               text: "Languages",
//               color: "#000000",
//             },
//           },
//         },
//       };
//     }

//     return baseOptions;
//   };

//   const handleDownload = (format) => {
//     const chartElement = chartRef.current?.canvas;
//     if (!chartElement) return;

//     if (format === 'png') {
//       const originalBackground = chartElement.style.background;
//       chartElement.style.background = 'white';
      
//       toPng(chartElement, {
//         backgroundColor: '#ffffff',
//         style: { background: 'white' },
//       })
//         .then((dataUrl) => {
//           saveAs(dataUrl, 'language_distribution.png');
//           chartElement.style.background = originalBackground;
//         })
//         .catch((err) => {
//           console.error('Error downloading chart:', err);
//           chartElement.style.background = originalBackground;
//         });
//     }
//   };

//   const exportToCSV = () => {
//     const csvData = topLanguages.map(([language, count]) => `${language},${count}`).join('\n');
//     const blob = new Blob([`Language,Count\n${csvData}`], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'language_distribution.csv');
//   };

//   const styles = {
//     container: {
//       display: "flex",
//       gap: "24px",
//       maxWidth: "1200px",
//       margin: "0 auto",
//       padding: "16px"
//     },
//     chartPanel: {
//       flex: "2",
//       backgroundColor: "white",
//       borderRadius: "8px",
//       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//       padding: "24px"
//     },
//     controlPanel: {
//       flex: "1",
//       backgroundColor: "white",
//       borderRadius: "8px",
//       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//       padding: "24px",
//       fontSize: "10px"
//     },
//     title: {
//       fontSize: "20px",
//       fontWeight: "bold",
//       marginBottom: "16px"
//     },
//     chartContainer: {
//       height: "500px",
//       position: "relative"
//     },
//     loadingSpinner: {
//       position: "absolute",
//       inset: "0",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center"
//     },
//     spinner: {
//       width: "48px",
//       height: "48px",
//       border: "4px solid #2563eb",
//       borderTopColor: "transparent",
//       borderRadius: "50%",
//       animation: "spin 1s linear infinite"
//     },
//     errorMessage: {
//       position: "absolute",
//       inset: "0",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       color: "#dc2626"
//     },
//     controlGroup: {
//       marginBottom: "16px"
//     },
//     label: {
//       display: "block",
//       fontSize: "14px",
//       fontWeight: "500",
//       marginBottom: "8px"
//     },
//     select: {
//       width: "100%",
//       padding: "8px",
//       border: "1px solid #e5e7eb",
//       borderRadius: "6px",
//       backgroundColor: "white"
//     },
//     checkbox: {
//       width: "12px",
//       height: "12px",
//       marginRight: "8px"
//     },
//     range: {
//       width: "100%"
//     },
//     colorPicker: {
//       width: "100%",
//       height: "40px",
//       borderRadius: "6px"
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.chartPanel}>
//         <div style={styles.chartContainer}>
//           {isLoading ? (
//             <div style={styles.loadingSpinner}>
//               <div style={styles.spinner} />
//             </div>
//           ) : error ? (
//             <div style={styles.errorMessage}>
//               {error}
//             </div>
//           ) : (
//             <Chart 
//               ref={chartRef} 
//               type={chartType} 
//               data={getChartData()} 
//               options={getChartOptions()} 
//             />
//           )}
//         </div>
//       </div>

//       <div style={styles.controlPanel}>
//         <h2 style={styles.title}>Chart Options</h2>
//         <div>
//           <div style={styles.controlGroup}>
//             <label style={styles.label}>Chart Type</label>
//             <select
//               value={chartType}
//               onChange={(e) => setChartType(e.target.value)}
//               style={styles.select}
//             >
//               <option value="bar">Bar Chart</option>
//               <option value="pie">Pie Chart</option>
//               <option value="doughnut">Doughnut Chart</option>
//             </select>
//           </div>

//           {chartType === 'bar' && (
//             <>
//               <div style={styles.controlGroup}>
//                 <label style={styles.label}>Orientation</label>
//                 <select
//                   value={chartOrientation}
//                   onChange={(e) => setChartOrientation(e.target.value)}
//                   style={styles.select}
//                 >
//                   <option value="horizontal">Horizontal</option>
//                   <option value="vertical">Vertical</option>
//                 </select>
//               </div>

//               <div style={styles.controlGroup}>
//                 <label style={{ display: "flex", alignItems: "center" }}>
//                   <input
//                     type="checkbox"
//                     checked={useLogScale}
//                     onChange={(e) => setUseLogScale(e.target.checked)}
//                     style={styles.checkbox}
//                   />
//                   Use Log Scale
//                 </label>
//               </div>
//             </>
//           )}

//           <div style={styles.controlGroup}>
//             <label style={{ display: "flex", alignItems: "center" }}>
//               <input
//                 type="checkbox"
//                 checked={showGrid}
//                 onChange={(e) => setShowGrid(e.target.checked)}
//                 style={styles.checkbox}
//               />
//               Show Grid
//             </label>
//           </div>

//           <div style={styles.controlGroup}>
//             <label style={{ display: "flex", alignItems: "center" }}>
//               <input
//                 type="checkbox"
//                 checked={showLegend}
//                 onChange={(e) => setShowLegend(e.target.checked)}
//                 style={styles.checkbox}
//               />
//               Show Legend
//             </label>
//           </div>

//           <div style={styles.controlGroup}>
//             <label style={styles.label}>
//               Font Size: {fontSize}px
//             </label>
//             <input
//               type="range"
//               min="8"
//               max="24"
//               value={fontSize}
//               onChange={(e) => setFontSize(parseInt(e.target.value))}
//               style={styles.range}
//             />
//           </div>

//           <div style={styles.controlGroup}>
//             <label style={styles.label}>Chart Color</label>
//             <input
//               type="color"
//               value={chartColor}
//               onChange={(e) => setChartColor(e.target.value)}
//               style={styles.colorPicker}
//             />
//           </div>

//           <div style={{ textAlign: "center", marginTop: "5px" }}>
//             <button
//               className="btn btn-primary"
//               onClick={() => handleDownload("png")}
//               style={{ marginRight: "10px" }}
//             >
//               <FontAwesomeIcon
//                 icon={faDownload}
//                 style={{ marginRight: "5px" }}
//               />
//               PNG
//             </button>
//             <button 
//               className="btn btn-secondary" 
//               onClick={exportToCSV}
//             >
//               <FontAwesomeIcon
//                 icon={faDownload}
//                 style={{ marginRight: "5px" }}
//               />
//               CSV
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Language;

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

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Language = () => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState("bar");
  const [showLegend, setShowLegend] = useState(true);
  const [yearRange, setYearRange] = useState([]);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [maxDisplayCount, setMaxDisplayCount] = useState(15);
  const [topLanguages, setTopLanguages] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [chartOrientation, setChartOrientation] = useState("horizontal");
  const [chartColor, setChartColor] = useState("#2563eb");
  const [fontSize, setFontSize] = useState(10);
  const [chartTitle, setChartTitle] = useState("Language Distribution");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useLogScale, setUseLogScale] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/get-data/");
      const data = await response.json();
      const years = [...new Set(data.map((item) => item.Year))].sort();
      setYearRange(years);
      setStartYear(years[0]);
      setEndYear(years[years.length - 1]);
      processLanguageData(data);
    } catch (err) {
      console.error(`Error fetching data:`, err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const processLanguageData = (data) => {
    const languageCounts = data.reduce((acc, item) => {
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
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxDisplayCount);

    setTopLanguages(sortedLanguages);
  };

  const getChartData = () => {
    if (chartType === 'bar') {
      return {
        labels: topLanguages.map(([name]) => name),
        datasets: [{
          label: "Count",
          data: topLanguages.map(([_, count]) => count),
          backgroundColor: chartColor,
          borderColor: chartColor,
          borderWidth: 1,
        }],
      };
    }

    // For pie/doughnut charts
    return {
      labels: topLanguages.map(([name]) => name),
      datasets: [{
        data: topLanguages.map(([_, count]) => count),
        backgroundColor: generateColors(topLanguages.length),
        borderColor: generateColors(topLanguages.length),
        borderWidth: 1,
      }],
    };
  };

  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  };

  const getChartOptions = () => {
    const isHorizontal = chartOrientation === "horizontal";
    const valueAxis = isHorizontal ? 'x' : 'y';
    const categoryAxis = isHorizontal ? 'y' : 'x';

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

    // const getLogTicksAndLabels = () => {
    //   const ticks = [];
    //   const labels = new Map();
      
    //   const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵'];
      
    //   // Powers of 10 from 10⁰ to 10⁵
    //   for (let i = 0; i <= 5; i++) {
    //     const value = Math.pow(10, i);
    //     ticks.push(value);
    //     labels.set(value, `10${superscripts[i]}`);
    //   }
          
    //   // Additional values between powers of 10 using consistent multipliers
    //   const multipliers = [2, 3, 5];
    //   for (let i = 0; i <= 4; i++) {  // Up to 10⁴ since we want to include values up to 50000
    //     const base = Math.pow(10, i);
    //     multipliers.forEach(mult => {
    //       const value = base * mult;
    //       ticks.push(value);
    //       labels.set(value, value.toLocaleString());
    //     });
    //   }
      
    //   return { ticks: ticks.sort((a, b) => a - b), labels };
    // };

    const { ticks, labels } = getLogTicksAndLabels();

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
          position: "top",
          labels: {
            color: "#000000",
            font: { size: fontSize },
          },
        },
        title: {
          display: true,
          text: chartTitle,
          color: "#000000",
          font: { size: 16 },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              return ` ${context.raw.toLocaleString()}`;
            }
          },
        },
      },
    };

    if (chartType === 'bar') {
      return {
        ...baseOptions,
        indexAxis: isHorizontal ? 'y' : 'x',
        scales: {
          [valueAxis]: {
            type: useLogScale ? 'logarithmic' : 'linear',
            grid: { display: showGrid },
            min: useLogScale ? 1 : 0,
            title: {
              display: true,
              text: "Number of Documents",
              color: "#000000",
            },
            ticks: {
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
            grid: { display: showGrid },
            title: {
              display: true,
              text: "Languages",
              color: "#000000",
            },
          },
        },
      };
    }

    return baseOptions;
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
      fontSize: "10px"
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
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chartPanel}>
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
            <Chart 
              ref={chartRef} 
              type={chartType} 
              data={getChartData()} 
              options={getChartOptions()} 
            />
          )}
        </div>
      </div>

      <div style={styles.controlPanel}>
        <h2 style={styles.title}>Chart Options</h2>
        <div>
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

          {chartType === 'bar' && (
            <>
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

              <div style={styles.controlGroup}>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={useLogScale}
                    onChange={(e) => setUseLogScale(e.target.checked)}
                    style={styles.checkbox}
                  />
                  Use Log Scale
                </label>
              </div>
            </>
          )}

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

          <div style={styles.controlGroup}>
            <label style={styles.label}>Chart Color</label>
            <input
              type="color"
              value={chartColor}
              onChange={(e) => setChartColor(e.target.value)}
              style={styles.colorPicker}
            />
          </div>

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

export default Language;