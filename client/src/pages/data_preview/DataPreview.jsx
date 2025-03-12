// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { CheckCircle2, AlertCircle } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import axios from 'axios';
// import Papa from 'papaparse'; // Make sure to install papaparse

// const DataPreview = () => {
//   const [previewData, setPreviewData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTempData = async () => {
//       try {
//         setIsLoading(true);
//         // Get the temporary file path from local storage
//         const filePath = localStorage.getItem('tempFilePath');
        
//         // Fetch the CSV file from the temp location
//         const response = await axios.get('http://3.6.36.17:80/api/read-temp-file/', {
//           params: {
//             file_path: filePath || 'temp_uploads/current_upload.csv'
//           }
//         });

//         if (response.data) {
//           // Parse CSV data
//           Papa.parse(response.data, {
//             header: true,
//             complete: (results) => {
//               const parsedData = results.data;
//               if (parsedData.length > 0) {
//                 setColumns(Object.keys(parsedData[0]));
//                 setPreviewData(parsedData.slice(0, 5)); // Show first 5 rows
//               }
//             },
//             error: (error) => {
//               console.error('Error parsing CSV:', error);
//               setError('Failed to parse CSV data');
//             }
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTempData();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading preview data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <div className="data-preview-container p-6 max-w-7xl mx-auto">
//       <Alert className="success-alert mb-6">
//         <CheckCircle2 className="h-4 w-4" />
//         <AlertTitle>Upload Successful</AlertTitle>
//         <AlertDescription>
//           Your file has been uploaded successfully. Here's a preview of the first 5 rows.
//         </AlertDescription>
//       </Alert>

//       <div className="preview-section">
//         <h2 className="text-2xl font-bold mb-4">Data Preview</h2>
        
//         <div className="table-container border rounded-lg overflow-x-auto">
//           {previewData.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-purple-50">
//                   {columns.map((column, index) => (
//                     <TableHead 
//                       key={index} 
//                       className="font-semibold text-purple-900 py-3 px-4"
//                     >
//                       {column}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {previewData.map((row, rowIndex) => (
//                   <TableRow 
//                     key={rowIndex}
//                     className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
//                   >
//                     {columns.map((column, colIndex) => (
//                       <TableCell 
//                         key={`${rowIndex}-${colIndex}`} 
//                         className="py-2 px-4"
//                       >
//                         {row[column]?.toString().substring(0, 100) || ''}
//                         {row[column]?.toString().length > 100 ? '...' : ''}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No data available for preview</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="navigation-buttons flex justify-between mt-6">
//         <Link to="/configuration">
//           <Button variant="outline">
//             Back to Configuration
//           </Button>
//         </Link>
//         <Link to="/dashboard">
//           <Button className="bg-purple-600 hover:bg-purple-700">
//             Continue to Dashboard
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default DataPreview;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from 'axios';
import Papa from 'papaparse';

const DataPreview = () => {
  const [previewData, setPreviewData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTempData = async () => {
      try {
        setIsLoading(true);
        // Get the temporary file path from local storage
        const filePath = localStorage.getItem('tempFilePath');
        
        // Fetch the CSV file from the temp location
        const response = await axios.get('http://3.6.36.17:80/api/read-temp-file/', {
          params: {
            file_path: filePath || 'temp_uploads/current_upload.csv'
          }
        });

        if (response.data) {
          // Parse CSV data
          Papa.parse(response.data, {
            header: true,
            complete: (results) => {
              const parsedData = results.data;
              if (parsedData.length > 0) {
                setColumns(Object.keys(parsedData[0]));
                setPreviewData(parsedData.slice(0, 10)); // Show first 10 rows
              }
            },
            error: (error) => {
              console.error('Error parsing CSV:', error);
              setError('Failed to parse CSV data');
            }
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTempData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading preview data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Define the expected columns for bibliographic data
  const bibliographicColumns = [
    "Authors", 
    "Author full names", 
    "Author(s) ID", 
    "Title", 
    "Year", 
    "Source title", 
    "Volume", 
    "Issue", 
    "Art. No.", 
    "Page start", 
    "Page end", 
    "Page count", 
    "Cited by", 
    "DOI"
  ];

  return (
    <div className="data-preview-container p-6 max-w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Data Preview</h1>
      
      <Alert className="success-alert mb-6">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Upload Successful</AlertTitle>
        <AlertDescription>
          Your bibliographic data has been uploaded successfully. Here's a preview of the data.
        </AlertDescription>
      </Alert>

      {/* Fixed height container with internal scrolling */}
      <div className="preview-section h-96">
        <div className="table-container border rounded-lg h-full">
          {previewData.length > 0 ? (
            <div className="overflow-auto h-full">
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-purple-50">
                    {bibliographicColumns.map((column, index) => (
                      <TableHead 
                        key={index} 
                        className="font-semibold text-purple-900 py-3 px-4 whitespace-nowrap"
                      >
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, rowIndex) => (
                    <TableRow 
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? 'bg-white hover:bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}
                    >
                      {bibliographicColumns.map((column, colIndex) => {
                        let cellContent = row[column] || '';
                        // Handle truncation for long content
                        const displayContent = cellContent.toString().length > 100 
                          ? cellContent.toString().substring(0, 100) + '...' 
                          : cellContent;
                          
                        return (
                          <TableCell 
                            key={`${rowIndex}-${colIndex}`} 
                            className="py-2 px-4 whitespace-nowrap"
                          >
                            {displayContent}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No data available for preview</p>
            </div>
          )}
        </div>
      </div>

      <div className="navigation-buttons flex justify-between mt-6">
        <Link to="/upload">
          <Button variant="outline">
            Back to Upload
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Continue to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DataPreview;