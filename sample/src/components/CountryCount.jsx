// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Bar } from "react-chartjs-2";
// import { toPng } from "html-to-image";
// import { saveAs } from "file-saver";
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
// import ChartDataLabels from "chartjs-plugin-datalabels";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartDataLabels
// );

// const CountryCount = () => {
//   const [topCountries, setTopCountries] = useState([]);
//   const [chartOrientation, setChartOrientation] = useState("horizontal");
//   const [chartColor, setChartColor] = useState("#3498db");
//   const [borderColor, setBorderColor] = useState("#2980b9");
//   const [fontSize, setFontSize] = useState(12);
//   const [yearRange, setYearRange] = useState([]);
//   const [startYear, setStartYear] = useState("");
//   const [endYear, setEndYear] = useState("");
//   const [error, setError] = useState(null);
//   const [showGrid, setShowGrid] = useState(true);
//   const [noDataMessage, setNoDataMessage] = useState("");
  
//   const [showChartTitle, setShowChartTitle] = useState(true);
//   const [showLegend, setShowLegend] = useState(false);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(15);
//   const [xAxisLabel, setXAxisLabel] = useState("Number of Publications");
//   const [yAxisLabel, setYAxisLabel] = useState("Countries");
//   const [xAxisLabelSize, setXAxisLabelSize] = useState(12);
//   const [yAxisLabelSize, setYAxisLabelSize] = useState(12);

//   const [originalData, setOriginalData] = useState([]);

//   const extractCountry = (address) => {
//     const countryMappings = {
//       'United States': ['USA', 'United States', 'U.S.', 'U.S.A', 'America', 'United States of America'],
//       'United Kingdom': ['UK', 'United Kingdom', 'Great Britain', 'England'],
//       'China': ['China', 'P.R. China', 'People\'s Republic of China'],
//       'India': ['India'],
//       'Japan': ['Japan'],
//       'Germany': ['Germany'],
//       'France': ['France'],
//       'Canada': ['Canada'],
//       'Australia': ['Australia'],
//       'Italy': ['Italy'],
//       'Spain': ['Spain'],
//       'Brazil': ['Brazil'],
//       'South Korea': ['South Korea', 'Korea'],
//       'Russia': ['Russia', 'Russian Federation'],
//       'Switzerland': ['Switzerland'],
//       'Pakistan': ['Pakistan']
//     };

//     for (const [country, keywords] of Object.entries(countryMappings)) {
//       if (keywords.some(keyword => 
//         address.toLowerCase().includes(keyword.toLowerCase())
//       )) {
//         return country;
//       }
//     }

//     const parts = address.split(',');
//     const lastPart = parts[parts.length - 1].trim();
    
//     return lastPart.length > 2 && lastPart.length < 30 ? lastPart : 'Unknown';
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     indexAxis: chartOrientation === "horizontal" ? "y" : "x",
//     plugins: {
//       legend: {
//         display: showLegend,
//       },
//       title: {
//         display: showChartTitle,
//         text: `Top ${maxDisplayCount} Countries by Number of Publications`,
//         color: "#000000",
//         font: {
//           size: 16,
//         },
//       },
//       tooltip: {
//         enabled: true,
//         bodyFont: {
//           size: fontSize,
//         },
//       },
//       datalabels: {
//         anchor: chartOrientation === "horizontal" ? "end" : "end",
//         align: chartOrientation === "horizontal" ? "right" : "top",
//         color: "#000000",
//         backgroundColor: "rgba(255, 255, 255, 0.7)",
//         borderRadius: 4,
//         font: {
//           weight: "bold",
//           size: 12,
//         },
//         padding: 6,
//         formatter: (value) => `${value}`,
//         display: (context) => context.dataset.data[context.dataIndex] > 0,
//       },
//     },
//     scales: {
//       x: {
//         display: true,
//         beginAtZero: true,
//         grid: {
//           display: showGrid,
//           drawBorder: true,
//         },
//         ticks: {
//           display: true,
//           font: {
//             size: fontSize,
//           },
//           precision: 0,
//         },
//         title: {
//           display: true,
//           text: xAxisLabel,
//           color: "#000000",
//           font: {
//             size: xAxisLabelSize,
//           },
//         },
//       },
//       y: {
//         display: true,
//         grid: {
//           display: showGrid,
//           drawBorder: true,
//         },
//         ticks: {
//           display: true,
//           font: {
//             size: fontSize,
//           },
//         },
//         title: {
//           display: true,
//           text: yAxisLabel,
//           color: "#000000",
//           font: {
//             size: yAxisLabelSize,
//           },
//         },
//       },
//     },
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (originalData.length > 0) {
//       processCountryData(originalData);
//     }
//   }, [originalData, maxDisplayCount, startYear, endYear]);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get("http://3.6.36.17:80/api/get-data/");
//       const data = response.data;
      
//       setOriginalData(data);
      
//       const years = [...new Set(data.map((item) => item.Year))].sort();
//       setYearRange(years);
//       setStartYear(years[0]);
//       setEndYear(years[years.length - 1]);
//     } catch (err) {
//       setError("Error fetching data: " + err.message);
//     }
//   };

//   const handleYearChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "startYear") {
//       setStartYear(value);
//     } else {
//       setEndYear(value);
//     }
//   };

//   const applyYearFilter = () => {
//     processCountryData(originalData);
//   };

//   const handleSliderChange = (e) => {
//     const newMaxCount = parseInt(e.target.value);
//     setMaxDisplayCount(newMaxCount);
//   };

//   const processCountryData = (data = []) => {
//     const filteredData = data.filter(
//       (item) => parseInt(item.Year) >= parseInt(startYear) && 
//                 parseInt(item.Year) <= parseInt(endYear)
//     );

//     const countryCounts = {};
//     filteredData.forEach((item) => {
//       if (item.Correspondence_Address) {
//         const country = extractCountry(item.Correspondence_Address);
//         countryCounts[country] = (countryCounts[country] || 0) + 1;
//       }
//     });

//     const sortedCountries = Object.entries(countryCounts)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, maxDisplayCount);

//     setTopCountries(sortedCountries);
//     setNoDataMessage(
//       sortedCountries.length === 0
//         ? "No data available for the selected year range"
//         : ""
//     );
//   };

//   const handleDownload = () => {
//     const chartElement = document.getElementById("bar-chart");
//     if (chartElement) {
//       toPng(chartElement, { backgroundColor: "#ffffff" })
//         .then((dataUrl) => {
//           saveAs(dataUrl, `top_countries_publications_${startYear}-${endYear}.png`);
//         })
//         .catch((err) => {
//           console.error("Error downloading chart:", err);
//         });
//     }
//   };

//   const exportToCSV = () => {
//     const csvContent = [
//       "Country,Number of Publications",
//       ...topCountries.map(([country, count]) => `${country},${count}`)
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", `top_countries_publications_${startYear}-${endYear}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const sliderMax = Math.min(30, originalData.length > 0 
//     ? [...new Set(
//         originalData
//           .map(item => item.Correspondence_Address ? extractCountry(item.Correspondence_Address) : null)
//           .filter(country => country !== null)
//       )].length 
//     : 15);

//   return (
//     <div
//       style={{
//         margin: "auto",
//         padding: "20px",
//         maxWidth: "1400px",
//         fontSize: "12px",
//       }}
//     >
//       <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//         <div style={{ flex: "1", minWidth: "300px", maxWidth: "820px" }}>
//           {error && <div className="alert alert-danger">{error}</div>}
//           {noDataMessage && (
//             <div className="alert alert-warning">{noDataMessage}</div>
//           )}

//           <div style={{ width: "100%", height: "500px" }}>
//             <div id="bar-chart" style={{ height: "100%", background: "white" }}>
//               <Bar
//                 data={{
//                   labels: topCountries.map((item) => item[0]),
//                   datasets: [
//                     {
//                       label: "Number of Publications",
//                       data: topCountries.map((item) => item[1]),
//                       backgroundColor: chartColor,
//                       borderColor: borderColor,
//                       borderWidth: 1,
//                     },
//                   ],
//                 }}
//                 options={chartOptions}
//               />
//             </div>
//             <div style={{ marginTop: "10px" }}>
//               *Showing {maxDisplayCount} countries{" "}
//               {startYear && endYear && (
//                 <>
//                   for years {startYear} - {endYear}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         <div style={{ marginLeft: "40px", flex: "0 0 300px" }}>
//           <div style={{ marginBottom: "20px" }}>
//             <label>Start Year: </label>
//             <select
//               name="startYear"
//               value={startYear}
//               onChange={handleYearChange}
//             >
//               {yearRange.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>

//             <label style={{ marginLeft: "20px" }}>End Year: </label>
//             <select name="endYear" value={endYear} onChange={handleYearChange}>
//               {yearRange.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>

//             <button
//               className="btn btn-primary"
//               style={{ marginTop: "10px", width: "100%" }}
//               onClick={applyYearFilter}
//             >
//               Apply Filter
//             </button>
//           </div>
//           <div style={{ marginBottom: "20px" }}>
//             <label>Number of Journals to Display: </label>
//             <input
//               type="range"
//               min="1"
//               max={sliderMax}
//               value={maxDisplayCount}
//               onChange={handleSliderChange}
//               style={{ width: "100%" }}
//             />
//             <span>{maxDisplayCount}</span>
//           </div>

//           <div style={{ marginBottom: "15px" }}>
//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Chart Orientation:
//               <select
//                 value={chartOrientation}
//                 onChange={(e) => setChartOrientation(e.target.value)}
//                 style={{ marginLeft: "10px" }}
//               >
//                 <option value="horizontal">Horizontal</option>
//                 <option value="vertical">Vertical</option>
//               </select>
//             </label>

//             <div style={{ display: "flex" }}>
//               <label style={{ display: "block", marginBottom: "10px" }}>
//                 Chart Color:
//                 <input
//                   type="color"
//                   value={chartColor}
//                   onChange={(e) => setChartColor(e.target.value)}
//                   style={{ marginLeft: "10px" }}
//                 />
//               </label>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "10px",
//                   marginLeft: "10px",
//                 }}
//               >
//                 Border Color:
//                 <input
//                   type="color"
//                   value={borderColor}
//                   onChange={(e) => setBorderColor(e.target.value)}
//                   style={{ marginLeft: "10px" }}
//                 />
//               </label>
//             </div>

//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Graph Size:
//               <input
//                 type="range"
//                 min="8"
//                 max="24"
//                 value={fontSize}
//                 onChange={(e) => setFontSize(parseInt(e.target.value))}
//                 style={{ marginLeft: "10px", width: "120px" }}
//               />
//               <span style={{ marginLeft: "5px" }}>{fontSize}</span>
//             </label>

//             <div style={{ display: "flex" }}>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "10px",
//                   marginLeft: "3px",
//                 }}
//               >
//                 Show Chart Title:
//                 <input
//                   type="checkbox"
//                   checked={showChartTitle}
//                   onChange={(e) => setShowChartTitle(e.target.checked)}
//                   style={{ marginLeft: "10px" }}
//                 />
//               </label>

//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "10px",
//                   marginLeft: "3px",
//                 }}
//               >
//                 Show Legend:
//                 <input
//                   type="checkbox"
//                   checked={showLegend}
//                   onChange={(e) => setShowLegend(e.target.checked)}
//                   style={{ marginLeft: "10px" }}
//                 />
//               </label>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "10px",
//                   marginLeft: "3px",
//                 }}
//               >
//                 Show Grid:
//                 <input
//                   type="checkbox"
//                   checked={showGrid}
//                   onChange={(e) => setShowGrid(e.target.checked)}
//                   style={{ marginLeft: "10px" }}
//                 />
//               </label>
//             </div>

//             <div style={{ marginBottom: "20px" }}>
//               <label style={{ display: "block", marginBottom: "10px" }}>
//                 X-Axis Label:
//                 <input
//                   type="text"
//                   value={xAxisLabel}
//                   onChange={(e) => setXAxisLabel(e.target.value)}
//                   style={{ marginLeft: "10px", width: "100%" }}
//                 />
//               </label>

//               <label style={{ display: "block", marginBottom: "10px" }}>
//                 Y-Axis Label:
//                 <input
//                   type="text"
//                   value={yAxisLabel}
//                   onChange={(e) => setYAxisLabel(e.target.value)}
//                   style={{ marginLeft: "10px", width: "100%" }}
//                 />
//               </label>

//               <label style={{ display: "block", marginBottom: "10px" }}>
//                 X-Axis Label Size:
//                 <input
//                   type="range"
//                   min="8"
//                   max="24"
//                   value={xAxisLabelSize}
//                   onChange={(e) => setXAxisLabelSize(parseInt(e.target.value))}
//                   style={{ marginLeft: "10px", width: "120px" }}
//                 />
//                 <span style={{ marginLeft: "5px" }}>{xAxisLabelSize}</span>
//               </label>

//               <label style={{ display: "block", marginBottom: "10px" }}>
//                 Y-Axis Label Size:
//                 <input
//                   type="range"
//                   min="8"
//                   max="24"
//                   value={yAxisLabelSize}
//                   onChange={(e) => setYAxisLabelSize(parseInt(e.target.value))}
//                   style={{ marginLeft: "10px", width: "120px" }}
//                 />
//                 <span style={{ marginLeft: "5px" }}>{yAxisLabelSize}</span>
//               </label>

//               <div style={{ textAlign: "center", marginTop: "20px" }}>
//                 <button
//                   className="btn btn-primary"
//                   onClick={handleDownload}
//                   style={{ marginRight: "10px" }}
//                 >
//                   <FontAwesomeIcon
//                     icon={faDownload}
//                     style={{ marginRight: "5px" }}
//                   />
//                   PNG
//                 </button>
//                 <button className="btn btn-secondary " onClick={exportToCSV}>
//                   <FontAwesomeIcon
//                     icon={faDownload}
//                     style={{ marginRight: "5px" }}
//                   />
//                   CSV
//                 </button>
//               </div>
//               </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CountryCount;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
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
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const CountryCount = () => {
  const [topCountries, setTopCountries] = useState([]);
  const [chartOrientation, setChartOrientation] = useState("horizontal");
  const [chartColor, setChartColor] = useState("#3498db");
  const [borderColor, setBorderColor] = useState("#2980b9");
  const [fontSize, setFontSize] = useState(12);
  const [yearRange, setYearRange] = useState([]);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [error, setError] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [noDataMessage, setNoDataMessage] = useState("");
  
  const [showChartTitle, setShowChartTitle] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [maxDisplayCount, setMaxDisplayCount] = useState(15);
  const [xAxisLabel, setXAxisLabel] = useState("Number of Publications");
  const [yAxisLabel, setYAxisLabel] = useState("Countries");
  const [xAxisLabelSize, setXAxisLabelSize] = useState(12);
  const [yAxisLabelSize, setYAxisLabelSize] = useState(12);

  const [originalData, setOriginalData] = useState([]);

  const extractCountry = (address) => {
    const countryMappings = {
   'Afghanistan': ['Afghanistan', 'Islamic Republic of Afghanistan'],
    'Albania': ['Albania', 'Republic of Albania'],
    'Algeria': ['Algeria', 'People\'s Democratic Republic of Algeria'],
    'Andorra': ['Andorra', 'Principality of Andorra'],
    'Angola': ['Angola', 'Republic of Angola'],
    'Antigua and Barbuda': ['Antigua', 'Barbuda', 'Antigua and Barbuda'],
    'Argentina': ['Argentina', 'Argentine Republic'],
    'Armenia': ['Armenia', 'Republic of Armenia'],
    'Australia': ['Australia', 'Commonwealth of Australia'],
    'Austria': ['Austria', 'Republic of Austria'],
    'Azerbaijan': ['Azerbaijan', 'Republic of Azerbaijan'],
    'Bahamas': ['Bahamas', 'The Bahamas', 'Commonwealth of The Bahamas'],
    'Bahrain': ['Bahrain', 'Kingdom of Bahrain'],
    'Bangladesh': ['Bangladesh', 'People\'s Republic of Bangladesh'],
    'Barbados': ['Barbados', 'Island of Barbados'],
    'Belarus': ['Belarus', 'Republic of Belarus', 'Byelorussia'],
    'Belgium': ['Belgium', 'Kingdom of Belgium'],
    'Belize': ['Belize', 'Belize Islands'],
    'Benin': ['Benin', 'Republic of Benin', 'Dahomey'],
    'Bhutan': ['Bhutan', 'Kingdom of Bhutan', 'Druk Yul'],
    'Bolivia': ['Bolivia', 'Plurinational State of Bolivia'],
    'Bosnia and Herzegovina': ['Bosnia', 'Herzegovina', 'Bosnia and Herzegovina', 'BiH'],
    'Botswana': ['Botswana', 'Republic of Botswana'],
    'Brazil': ['Brazil', 'Federative Republic of Brazil'],
    'Brunei': ['Brunei', 'Brunei Darussalam', 'Nation of Brunei'],
    'Bulgaria': ['Bulgaria', 'Republic of Bulgaria'],
    'Burkina Faso': ['Burkina Faso', 'Republic of Burkina Faso'],
    'Burundi': ['Burundi', 'Republic of Burundi'],
    'Cabo Verde': ['Cabo Verde', 'Cape Verde', 'Republic of Cabo Verde'],
    'Cambodia': ['Cambodia', 'Kampuchea', 'Kingdom of Cambodia'],
    'Cameroon': ['Cameroon', 'Republic of Cameroon'],
    'Canada': ['Canada', 'Canadian Confederation'],
    'Central African Republic': ['Central African Republic', 'CAR', 'République centrafricaine'],
    'Chad': ['Chad', 'Republic of Chad'],
    "Chile": ["Chile"],
    "China": ['China', 'People\'s Republic of China', 'PRC', 'Mainland China','P.R. China', 'PRC'],
    "Colombia": ["Colombia"],
    "Taiwan": ['Republic of China (ROC)', 'Taiwan'],
    "Macau":['Macao', 'Macau'],
    "Comoros": ["Comoros"],
    "Congo": ["Congo", "Republic of the Congo", "Congo-Brazzaville"],
    "Congo (DRC)": ["Congo (DRC)", "Democratic Republic of the Congo", "Congo-Kinshasa"],
    "Costa Rica": ["Costa Rica"],
    "Croatia": ["Croatia", "Hrvatska"],
    "Cuba": ["Cuba"],
    "Cyprus": ["Cyprus"],
    "Czechia": ["Czechia", "Czech Republic"],
    "Denmark": ["Denmark", "Danmark"],
    "Djibouti": ["Djibouti"],
    "Dominica": ["Dominica"],
    "Dominican Republic": ["Dominican Republic", "República Dominicana"],
    "Ecuador": ["Ecuador"],
    "Egypt": ["Egypt", "Arab Republic of Egypt"],
    "El Salvador": ["El Salvador", "Salvador"],
    "Equatorial Guinea": ["Equatorial Guinea"],
    "Eritrea": ["Eritrea"],
    "Estonia": ["Estonia"],
    "Eswatini": ["Eswatini", "Swaziland"],
    "Ethiopia": ["Ethiopia"],
    "Fiji": ["Fiji"],
    "Finland": ["Finland"],
    "France": ["France", "French Republic"],
    "Gabon": ["Gabon"],
    "Gambia": ["Gambia", "The Gambia"],
    "Georgia": ["Georgia"],
    "Germany": ["Germany", "Deutschland","Bundesrepublik Deutschland","The Federal Republic of Germany","Federal Republic of Germany"],
    "Ghana": ["Ghana"],
    "Greece": ["Greece", "Hellas"],
    "Grenada": ["Grenada"],
    "Guatemala": ["Guatemala"],
    "Guinea": ["Guinea"],
    "Guinea-Bissau": ["Guinea-Bissau"],
    "Guyana": ["Guyana"],
    "Haiti": ["Haiti"],
    "Honduras": ["Honduras"],
    "Hungary": ["Hungary", "Magyarország"],
    "Hong Kong": ["Hong Kong", "HK"],
    "Iceland": ["Iceland"],
    "India": ["India", "Republic of India", "Bharat"],
    "Indonesia": ["Indonesia"],
    "Iran": ["Iran", "Islamic Republic of Iran"],
    "Iraq": ["Iraq"],
    "Ireland": ["Ireland", "Eire"],
    "Israel": ["Israel"],
    "Italy": ["Italy", "Italia"],
    "Ivory Coast": ["Ivory Coast", "Côte d'Ivoire"],
    "Jamaica": ["Jamaica"],
    "Japan": ["Japan", "Nihon", "Nippon","State of Japan","Japanese Archipelago","Jipangu","Yamato","日本"],
    "Jordan": ["Jordan"],
    "Kazakhstan": ["Kazakhstan"],
    "Kenya": ["Kenya"],
    "Kiribati": ["Kiribati"],
    "Korea (North)": ["North Korea", "DPRK", "Democratic People's Republic of Korea"],
    "Korea (South)": ["South Korea", "Korea", "Republic of Korea", "ROK"],
    "Kosovo": ["Kosovo"],
    "Kuwait": ["Kuwait"],
    "Kyrgyzstan": ["Kyrgyzstan"],
    "Laos": ["Laos", "Lao People's Democratic Republic"],
    "Latvia": ["Latvia"],
    "Lebanon": ["Lebanon"],
    "Lesotho": ["Lesotho"],
    "Liberia": ["Liberia"],
    "Libya": ["Libya"],
    "Liechtenstein": ["Liechtenstein"],
    "Lithuania": ["Lithuania"],
    "Luxembourg": ["Luxembourg"],
    "Madagascar": ["Madagascar"],
    "Malawi": ["Malawi"],
    "Malaysia": ["Malaysia"],
    "Maldives": ["Maldives"],
    "Mali": ["Mali"],
    "Malta": ["Malta"],
    "Marshall Islands": ["Marshall Islands"],
    "Mauritania": ["Mauritania"],
    "Mauritius": ["Mauritius"],
    "Mexico": ["Mexico", "México"],
    "Micronesia": ["Micronesia", "Federated States of Micronesia"],
    "Moldova": ["Moldova", "Republic of Moldova"],
    "Monaco": ["Monaco"],
    "Mongolia": ["Mongolia"],
    "Montenegro": ["Montenegro"],
    "Morocco": ["Morocco", "Maroc", "Maghreb"],
    "Mozambique": ["Mozambique"],
    "Myanmar": ["Myanmar", "Burma"],
    "Namibia": ["Namibia"],
    "Nauru": ["Nauru"],
    "Nepal": ["Nepal"],
    "Netherlands": ["Netherlands", "Holland"],
    "New Zealand": ["New Zealand", "NZ"],
    "Nicaragua": ["Nicaragua"],
    "Niger": ["Niger"],
    "Nigeria": ["Nigeria"],
    "North Macedonia": ["North Macedonia", "Macedonia"],
    "Norway": ["Norway", "Norge"],
    "Oman": ["Oman"],
    "Pakistan": ["Pakistan"],
    "Palau": ["Palau"],
    "Puerto Rico": ["Puerto Rico"," Puerto Rico"],
    "Palestine": ["Palestine", "State of Palestine"],
    "Panama": ["Panama"],
    'Papua New Guinea': ['Papua New Guinea'],
    'Paraguay': ['Paraguay'],
    'Peru': ['Peru'],
    'Philippines': ['Philippines', 'The Philippines'],
    'Poland': ['Poland'],
    'Portugal': ['Portugal'],
    'Qatar': ['Qatar'],
    'Yougoslavia':['Yugoslavia'],
    'Romania': ['Romania'],
    'Russia': ['Russia','Russian Federation','Rossiya','Federation of Russia', 'Soviet Union', 'RF','Российская Федерация', 'РФ'],
    'Rwanda': ['Rwanda'],
    'Saint Kitts and Nevis': ['Saint Kitts and Nevis'],
    'Saint Lucia': ['Saint Lucia'],
    'Saint Vincent and the Grenadines': ['Saint Vincent', 'Saint Vincent and the Grenadines'],
    'Samoa': ['Samoa'],
    'San Marino': ['San Marino'],
    'Sao Tome and Principe': ['Sao Tome and Principe'],
    'Saudi Arabia': ['Saudi Arabia'],
    'Senegal': ['Senegal'],
    'Serbia': ['Serbia'],
    'Seychelles': ['Seychelles'],
    'Sierra Leone': ['Sierra Leone'],
    'Singapore': ['Singapore'],
    'Slovakia': ['Slovakia'],
    'Slovenia': ['Slovenia'],
    'Solomon Islands': ['Solomon Islands'],
    'Somalia': ['Somalia'],
    'South Africa': ['South Africa','The Republic of South Africa ','RSA'],
    'South Sudan': ['South Sudan'],
    'Spain': ['Spain'],
    'Sri Lanka': ['Sri Lanka','Ceylon'],
    'Sudan': ['Sudan'],
    'Suriname': ['Suriname'],
    'Sweden': ['Sweden'],
    'Switzerland': ['Switzerland'],
    'Syria': ['Syria', 'Syrian Arab Republic'],
    'Tajikistan': ['Tajikistan'],
    'Tanzania': ['Tanzania', 'United Republic of Tanzania'],
    'Thailand': ['Thailand'],
    'Timor-Leste': ['Timor-Leste', 'East Timor'],
    'Togo': ['Togo'],
    'Tonga': ['Tonga'],
    'Trinidad and Tobago': ['Trinidad and Tobago'],
    'Tunisia': ['Tunisia'],
    'Turkey': ['Turkey', 'Türkiye'],
    'Turkmenistan': ['Turkmenistan'],
    'Tuvalu': ['Tuvalu'],
    'Uganda': ['Uganda'],
    'Ukraine': ['Ukraine'],
    'United Arab Emirates': ['UAE', 'United Arab Emirates'],
    'United Kingdom': ['UK', 'United Kingdom', 'Great Britain', 'England', 'The United Kingdom','United Kingdom', 'UK', 'Britain', 'Great Britain', 'England','Scotland', 'Wales', 'Northern Ireland', 'The United Kingdom of Great Britain and Northern Ireland'],
    'United States': ['USA', 'United States', 'U.S.', 'U.S.A', 'America', 'The United States of America', 'United States of America','USA', 'United States', 'U.S.', 'U.S.A', 'America','The United States of America', 'United States of America', 'The States'],
    'Uruguay': ['Uruguay'],
    'Uzbekistan': ['Uzbekistan'],
    'Vanuatu': ['Vanuatu'],
    'Vatican City': ['Vatican City', 'Holy See'],
    'Venezuela': ['Venezuela'],
    'Vietnam': ['Vietnam', 'Viet Nam', 'Socialist Republic of Vietnam'],
    'Yemen': ['Yemen'],
    'Zambia': ['Zambia'],
    'Zimbabwe': ['Zimbabwe']
    };

    for (const [country, keywords] of Object.entries(countryMappings)) {
      if (keywords.some(keyword => 
        address.toLowerCase().includes(keyword.toLowerCase())
      )) {
        return country;
      }
    }
    
    // If no match is found, handle the "unknown" case
    // const parts = address.split(',');
    // const lastPart = parts[parts.length - 1].trim();
    
    
    // if (lastPart.length > 2 && lastPart.length < 30) {
    //   console.log("Unknown text:", lastPart); // Log the unknown part
    //   return lastPart;
    // } else {
    //   console.log("Unknown text:", address); // Log the entire address as unknown
    //   return 'Unknown';
    // }
    
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: chartOrientation === "horizontal" ? "y" : "x",
    plugins: {
      legend: {
        display: showLegend,
      },
      title: {
        display: showChartTitle,
        text: `Top ${maxDisplayCount} Countries by Number of Publications`,
        color: "#000000",
        font: {
          size: 16,
        },
      },
      tooltip: {
        enabled: true,
        bodyFont: {
          size: fontSize,
        },
      },
      datalabels: {
        anchor: chartOrientation === "horizontal" ? "end" : "end",
        align: chartOrientation === "horizontal" ? "right" : "top",
        color: "#000000",
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
        },
        ticks: {
          display: true,
          font: {
            size: fontSize,
          },
          precision: 0,
        },
        title: {
          display: true,
          text: xAxisLabel,
          color: "#000000",
          font: {
            size: xAxisLabelSize,
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: showGrid,
          drawBorder: true,
        },
        ticks: {
          display: true,
          font: {
            size: fontSize,
          },
        },
        title: {
          display: true,
          text: yAxisLabel,
          color: "#000000",
          font: {
            size: yAxisLabelSize,
          },
        },
      },
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (originalData.length > 0) {
      processCountryData(originalData);
    }
  }, [originalData, maxDisplayCount, startYear, endYear]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get-data/");
      const data = response.data;
      
      setOriginalData(data);
      
      const years = [...new Set(data.map((item) => item.Year))].sort();
      setYearRange(years);
      setStartYear(years[0]);
      setEndYear(years[years.length - 1]);
    } catch (err) {
      setError("Error fetching data: " + err.message);
    }
  };

  const handleYearChange = (e) => {
    const { name, value } = e.target;
    if (name === "startYear") {
      setStartYear(value);
    } else {
      setEndYear(value);
    }
  };

  const applyYearFilter = () => {
    processCountryData(originalData);
  };

  const handleSliderChange = (e) => {
    const newMaxCount = parseInt(e.target.value);
    setMaxDisplayCount(newMaxCount);
  };

  const processCountryData = (data = []) => {
    const filteredData = data.filter(
      (item) => parseInt(item.Year) >= parseInt(startYear) && 
                parseInt(item.Year) <= parseInt(endYear)
    );

    const countryCounts = {};
filteredData.forEach((item) => {
  if (item["Correspondence Address"]) { // Use the updated key with space
    const country = extractCountry(item["Correspondence Address"]);
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  }
});

  const sortedCountries = Object.entries(countryCounts)
  .filter(([key, value]) => key !== 'undefined' && value !== undefined) // Filter out undefined
  .sort((a, b) => b[1] - a[1])
  .slice(0, maxDisplayCount);

setTopCountries(sortedCountries);
console.log(sortedCountries);
setNoDataMessage(
  sortedCountries.length === 0
    ? "No data available for the selected year range"
    : ""
);
  };

  const handleDownload = () => {
    const chartElement = document.getElementById("bar-chart");
    if (chartElement) {
      toPng(chartElement, { backgroundColor: "#ffffff" })
        .then((dataUrl) => {
          saveAs(dataUrl, `top_countries_publications_${startYear}-${endYear}.png`);
        })
        .catch((err) => {
          console.error("Error downloading chart:", err);
        });
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      "Country,Number of Publications",
      ...topCountries.map(([country, count]) => `${country},${count}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `top_countries_publications_${startYear}-${endYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sliderMax = Math.min(30, originalData.length > 0 
    ? [...new Set(
        originalData
          .map(item => item["Correspondence Address"] ? extractCountry(item["Correspondence Address"]) : null)
          .filter(country => country !== null)
      )].length 
    : 15);


  return (
    <div
      style={{
        margin: "auto",
        padding: "20px",
        maxWidth: "1400px",
        fontSize: "12px",
      }}
    >
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "300px", maxWidth: "820px" }}>
          {error && <div className="alert alert-danger">{error}</div>}
          {noDataMessage && (
            <div className="alert alert-warning">{noDataMessage}</div>
          )}

          <div style={{ width: "100%", height: "500px" }}>
            <div id="bar-chart" style={{ height: "100%", background: "white" }}>
              <Bar
                data={{
                  labels: topCountries.map((item) => item[0]),
                  datasets: [
                    {
                      label: "Number of Publications",
                      data: topCountries.map((item) => item[1]),
                      backgroundColor: chartColor,
                      borderColor: borderColor,
                      borderWidth: 1,
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              *Showing {maxDisplayCount} countries{" "}
              {startYear && endYear && (
                <>
                  for years {startYear} - {endYear}
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginLeft: "40px", flex: "0 0 300px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label>Start Year: </label>
            <select
              name="startYear"
              value={startYear}
              onChange={handleYearChange}
            >
              {yearRange.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <label style={{ marginLeft: "20px" }}>End Year: </label>
            <select name="endYear" value={endYear} onChange={handleYearChange}>
              {yearRange.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button
              className="btn btn-primary"
              style={{ marginTop: "10px", width: "100%" }}
              onClick={applyYearFilter}
            >
              Apply Filter
            </button>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Number of Countries to Display: </label>
            <input
              type="range"
              min="1"
              max={sliderMax}
              value={maxDisplayCount}
              onChange={handleSliderChange}
              style={{ width: "100%" }}
            />
            <span>{maxDisplayCount}</span>
          </div>

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

            <div style={{ display: "flex" }}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Chart Color:
                <input
                  type="color"
                  value={chartColor}
                  onChange={(e) => setChartColor(e.target.value)}
                  style={{ marginLeft: "10px" }}
                />
              </label>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  marginLeft: "10px",
                }}
              >
                Border Color:
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  style={{ marginLeft: "10px" }}
                />
              </label>
            </div>

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
                  onClick={handleDownload}
                  style={{ marginRight: "10px" }}
                >
                  <FontAwesomeIcon
                    icon={faDownload}
                    style={{ marginRight: "5px" }}
                  />
                  PNG
                </button>
                <button className="btn btn-secondary " onClick={exportToCSV}>
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
    </div>
  );
};

export default CountryCount;
