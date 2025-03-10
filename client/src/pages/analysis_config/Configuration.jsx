// Backup code

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Checkbox } from "../../components/ui/checkbox";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "../../components/ui/collapsible";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import { Button } from "../../components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import axios from 'axios';
// import "./configuration.css";

// const Configuration = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // State management
//   const [categories, setCategories] = useState({
//     'Research Focus': {
//       items: {
//         "Authors": false,
//         "Author full names": false,
//         "Author(s) ID": false,
//         "Title": false,
//         "Abstract": false,
//         "Author Keywords": false,
//         "Index Keywords": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Publication Details': {
//       items: {
//         "Year": false,
//         "Source title": false,
//         "Volume": false,
//         "Issue": false,
//         "Art. No.": false,
//         "Page start": false,
//         "Page end": false,
//         "Page count": false,
//         "DOI": false,
//         "Link": false,
//         "Publisher": false,
//         "Publication Stage": false,
//         "Document Type": false,
//         "Language of Original Document": false,
//         "Abbreviated Source Title": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Citation & Impact': {
//       items: {
//         "Cited by": false,
//         "References": false,
//         "ISSN": false,
//         "ISBN": false,
//         "CODEN": false,
//         "PubMed ID": false,
//         "Open Access": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Affiliations & Funding': {
//       items: {
//         "Affiliations": false,
//         "Authors with affiliations": false,
//         "Funding Details": false,
//         "Funding Texts": false,
//         "Correspondence Address": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Conference Information': {
//       items: {
//         "Conference name": false,
//         "Conference date": false,
//         "Conference location": false,
//         "Conference code": false,
//         "Sponsors": false,
//         "Editors": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Chemical & Biological Data': {
//       items: {
//         "Molecular Sequence Numbers": false,
//         "Chemicals/CAS": false,
//         "Tradenames": false,
//         "Manufacturers": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Indexing & Source': {
//       items: {
//         "Source": false,
//         "EID": false,
//       },
//       isOpen: false,
//       isSelected: false
//     }
//   });

//   const [selectedFeatures, setSelectedFeatures] = useState([]);
//   const [availableColumns, setAvailableColumns] = useState([]);
//   const [columnMappings, setColumnMappings] = useState({});
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Load columns from localStorage and fetch preview data
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         // Check if we have data in localStorage
//         const columns = JSON.parse(localStorage.getItem('availableColumns') || '[]');
//         const storedTotalRecords = localStorage.getItem('totalRecords');
        
//         if (!columns.length) {
//           toast({
//             variant: "destructive",
//             title: "No data found",
//             description: "Please upload a file from the home page first.",
//           });
//           navigate('/');
//           return;
//         }
        
//         setAvailableColumns(columns);
//       } catch (error) {
//         console.error("Data loading error:", error);
//         toast({
//           variant: "destructive",
//           title: "Error loading data",
//           description: "Failed to load file data. Redirecting to home page.",
//         });
//         setTimeout(() => navigate('/'), 2000);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate, toast]);

//   // Update mappings when selected features change
//   useEffect(() => {
//     // Reset mappings for newly selected features
//     const initialMappings = { ...columnMappings };
    
//     selectedFeatures.forEach(feature => {
//       if (!initialMappings[feature]) {
//         initialMappings[feature] = '';
//       }
//     });
    
//     // Remove mappings for unselected features
//     Object.keys(initialMappings).forEach(key => {
//       if (!selectedFeatures.includes(key)) {
//         delete initialMappings[key];
//       }
//     });
    
//     setColumnMappings(initialMappings);
//   }, [selectedFeatures]);

//   // Category management
//   const toggleCategory = (categoryName) => {
//     setCategories(prev => ({
//       ...prev,
//       [categoryName]: {
//         ...prev[categoryName],
//         isOpen: !prev[categoryName].isOpen
//       }
//     }));
//   };

//   const handleCategorySelect = (categoryName, checked) => {
//     setCategories(prev => ({
//       ...prev,
//       [categoryName]: {
//         ...prev[categoryName],
//         isSelected: checked,
//         items: Object.keys(prev[categoryName].items).reduce((acc, item) => ({
//           ...acc,
//           [item]: checked
//         }), {})
//       }
//     }));
//   };

//   const handleSubcategorySelect = (categoryName, subcategoryName, checked) => {
//     setCategories(prev => {
//       const updatedCategory = {
//         ...prev[categoryName],
//         items: {
//           ...prev[categoryName].items,
//           [subcategoryName]: checked
//         }
//       };
      
//       // Check if all items are selected to update the category's selected state
//       const allSelected = Object.values(updatedCategory.items).every(value => value);
//       const anySelected = Object.values(updatedCategory.items).some(value => value);
      
//       updatedCategory.isSelected = allSelected;
//       updatedCategory.partiallySelected = anySelected && !allSelected;
      
//       return {
//         ...prev,
//         [categoryName]: updatedCategory
//       };
//     });
//   };

//   // Update selected features when categories change
//   useEffect(() => {
//     const newSelectedFeatures = [];
//     Object.entries(categories).forEach(([_, category]) => {
//       Object.entries(category.items || {}).forEach(([subcategoryName, isSelected]) => {
//         if (isSelected) {
//           newSelectedFeatures.push(subcategoryName);
//         }
//       });
//     });
//     setSelectedFeatures(newSelectedFeatures);
//   }, [categories]);

//   // Mapping management
//   const handleMappingChange = (feature, column) => {
//     setColumnMappings(prev => ({
//       ...prev,
//       [feature]: column
//     }));
//   };

//   const isValidMapping = () => {
//     if (selectedFeatures.length === 0) return false;
    
//     const allMapped = selectedFeatures.every(feature => columnMappings[feature]);
//     const mappedColumns = selectedFeatures.map(feature => columnMappings[feature]);
//     const uniqueMappings = new Set(mappedColumns).size === mappedColumns.length;
    
//     return allMapped && uniqueMappings;
//   };

//   // Smart suggestion for mapping
//   const suggestMappings = () => {
//     const suggestions = {};
    
//     selectedFeatures.forEach(feature => {
//       // Look for exact matches
//       const exactMatch = availableColumns.find(col => 
//         col.toLowerCase() === feature.toLowerCase());
      
//       if (exactMatch && !Object.values(suggestions).includes(exactMatch)) {
//         suggestions[feature] = exactMatch;
//         return;
//       }
      
//       // Look for partial matches
//       const partialMatches = availableColumns.filter(col => 
//         col.toLowerCase().includes(feature.toLowerCase()) || 
//         feature.toLowerCase().includes(col.toLowerCase()));
      
//       if (partialMatches.length > 0) {
//         const bestMatch = partialMatches[0];
//         if (!Object.values(suggestions).includes(bestMatch)) {
//           suggestions[feature] = bestMatch;
//         }
//       }
//     });
    
//     setColumnMappings(prev => ({
//       ...prev,
//       ...suggestions
//     }));
    
//     toast({
//       title: "Auto-mapping suggested",
//       description: `Mapped ${Object.keys(suggestions).length} fields automatically`,
//     });
//   };

//   // Use the existing APIs to process the file with mappings
//   const handleSaveAndContinue = async () => {
//     if (!isValidMapping()) {
//       toast({
//         variant: "destructive",
//         title: "Invalid mapping",
//         description: "Please ensure all selected features are mapped to unique columns.",
//       });
//       return;
//     }
  
//     setIsProcessing(true);
  
//     try {
//       // Create the mappings object
//       const selectedMappings = selectedFeatures.reduce((acc, feature) => {
//         acc[feature] = columnMappings[feature];
//         return acc;
//       }, {});
  
//       toast({
//         title: "Processing data",
//         description: "Applying column mappings to the uploaded file...",
//       });
      
//       // Save the mappings configuration using the existing endpoint
//       await axios.post("http://127.0.0.1:8000/api/send-column-mappings/", {
//         mappings: selectedMappings,
//         columns: Object.values(selectedMappings),
//         features: selectedFeatures,
//         categories: Object.entries(categories).reduce((acc, [name, category]) => {
//           acc[name] = {
//             selected: category.isSelected,
//             items: category.items
//           };
//           return acc;
//         }, {})
//       });

//       // Process the data with mappings using the existing endpoint
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/upload-csv2/",
//         {
//           mappings: selectedMappings
//         },
//         {
//           headers: {
//             "Content-Type": "application/json"
//           }
//         }
//       );
  
//       if (response.data.message) {
//         toast({
//           title: "Success",
//           description: "Your file has been processed successfully.",
//         });
        
//         // Clear localStorage after successful processing
//         localStorage.removeItem('availableColumns');
//         localStorage.removeItem('totalRecords');
//         localStorage.removeItem('uploadedFileName');
        
//         // Navigate to DataPreview instead of Dashboard
//         navigate('/data-preview');
//       } else {
//         throw new Error("Unexpected response format");
//       }
  
//     } catch (error) {
//       console.error("Save error:", error);
//       toast({
//         variant: "destructive",
//         title: "Process failed",
//         description: error.response?.data?.error || error.message || "Failed to process data",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="configuration-maincon">
//       {isLoading ? (
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading column data...</p>
//           </div>
//         </div>
//       ) : (
//         <div className="config-container flex">
//           {/* Categories Section */}
//           <div className="categories-con flex-shrink overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-4">Categories</h2>
//             <p className="text-sm text-gray-500 mb-4">
//               Select analysis categories ({selectedFeatures.length} features selected)
//             </p>

//             {Object.entries(categories).map(([categoryName, category]) => (
//               <div key={categoryName} className="category-group mb-4">
//                 <Collapsible open={category.isOpen}>
//                   <div className="category-header flex items-center gap-2 mb-2">
//                     <Checkbox
//                       checked={category.isSelected}
//                       indeterminate={category.partiallySelected}
//                       onCheckedChange={(checked) => 
//                         handleCategorySelect(categoryName, checked)}
//                     />
//                     <CollapsibleTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => toggleCategory(categoryName)}
//                         className="flex items-center justify-between w-full"
//                       >
//                         <span>{categoryName}</span>
//                         {category.isOpen ? 
//                           <ChevronUp className="h-4 w-4" /> : 
//                           <ChevronDown className="h-4 w-4" />}
//                       </Button>
//                     </CollapsibleTrigger>
//                   </div>

//                   <CollapsibleContent>
//                     <div className="ml-6 space-y-2">
//                       {Object.entries(category.items || {}).map(([subcategoryName, isSelected]) => (
//                         <div key={subcategoryName} className="flex items-center gap-2">
//                           <Checkbox
//                             checked={isSelected}
//                             onCheckedChange={(checked) => 
//                               handleSubcategorySelect(categoryName, subcategoryName, checked)}
//                           />
//                           <span className="text-sm">{subcategoryName}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </CollapsibleContent>
//                 </Collapsible>
//               </div>
//             ))}
//           </div>

//           {/* Features Section */}
//           <div className="attributes-con flex-1">
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <h2 className="text-2xl font-bold">Column Mapping</h2>
//                 <p className="text-sm text-gray-500">Using columns from temp upload</p>
//               </div>
//               {selectedFeatures.length > 0 && (
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   onClick={suggestMappings}
//                 >
//                   Auto-Suggest Mappings
//                 </Button>
//               )}
//             </div>
            
//             <p className="text-sm text-gray-500 mb-4">
//               Map {selectedFeatures.length} selected features to available columns ({availableColumns.length} available)
//             </p>

//             {selectedFeatures.length === 0 ? (
//               <div className="bg-gray-100 p-6 rounded-lg text-center">
//                 <p className="text-gray-600">Select categories from the left panel to begin mapping</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[65vh]">
//                 {selectedFeatures.map((feature) => (
//                   <div key={feature} className="feature-item p-3 border rounded-lg">
//                     <div className="feature-title mb-2">
//                       <h6 className="text-sm font-medium">{feature}</h6>
//                     </div>
//                     <Select 
//                       onValueChange={(value) => handleMappingChange(feature, value)}
//                       value={columnMappings[feature] || ""}
//                     >
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select column" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {availableColumns.map((column) => (
//                           <SelectItem 
//                             key={column} 
//                             value={column}
//                             disabled={
//                               Object.values(columnMappings).includes(column) && 
//                               columnMappings[feature] !== column
//                             }
//                           >
//                             {column}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <div className="navigation-footer w-full fixed bottom-0 bg-white border-t py-3 px-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <div className="stats">
//             <span className="text-sm text-gray-600">
//               {selectedFeatures.length} features selected | 
//               {Object.keys(columnMappings).filter(k => columnMappings[k]).length}/{selectedFeatures.length} mapped
//             </span>
//           </div>
//           <div className="flex gap-3">
//             <Link to="/">
//               <Button variant="outline">
//                 Previous
//               </Button>
//             </Link>
//             <Button 
//               className="bg-purple-600 hover:bg-purple-700"
//               onClick={handleSaveAndContinue}
//               disabled={isProcessing || !isValidMapping()}
//             >
//               {isProcessing ? "Processing..." : "Save & Continue"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Configuration;


// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Checkbox } from "../../components/ui/checkbox";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "../../components/ui/collapsible";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import { Button } from "../../components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import axios from 'axios';
// import "./configuration.css";

// const Configuration = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // State management
//   const [categories, setCategories] = useState({
//     'Research Focus': {
//       items: {
//         "Authors": false,
//         "Author full names": false,
//         "Author(s) ID": false,
//         "Title": false,
//         "Abstract": false,
//         "Author Keywords": false,
//         "Index Keywords": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Publication Details': {
//       items: {
//         "Year": false,
//         "Source title": false,
//         "Volume": false,
//         "Issue": false,
//         "Art. No.": false,
//         "Page start": false,
//         "Page end": false,
//         "Page count": false,
//         "DOI": false,
//         "Link": false,
//         "Publisher": false,
//         "Publication Stage": false,
//         "Document Type": false,
//         "Language of Original Document": false,
//         "Abbreviated Source Title": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Citation & Impact': {
//       items: {
//         "Cited by": false,
//         "References": false,
//         "ISSN": false,
//         "ISBN": false,
//         "CODEN": false,
//         "PubMed ID": false,
//         "Open Access": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Affiliations & Funding': {
//       items: {
//         "Affiliations": false,
//         "Authors with affiliations": false,
//         "Funding Details": false,
//         "Funding Texts": false,
//         "Correspondence Address": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Conference Information': {
//       items: {
//         "Conference name": false,
//         "Conference date": false,
//         "Conference location": false,
//         "Conference code": false,
//         "Sponsors": false,
//         "Editors": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Chemical & Biological Data': {
//       items: {
//         "Molecular Sequence Numbers": false,
//         "Chemicals/CAS": false,
//         "Tradenames": false,
//         "Manufacturers": false,
//       },
//       isOpen: false,
//       isSelected: false
//     },
//     'Indexing & Source': {
//       items: {
//         "Source": false,
//         "EID": false,
//       },
//       isOpen: false,
//       isSelected: false
//     }
//   });

//   const [selectedFeatures, setSelectedFeatures] = useState([]);
//   const [availableColumns, setAvailableColumns] = useState([]);
//   const [columnMappings, setColumnMappings] = useState({});
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Load columns from localStorage
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         // Check if we have data in localStorage
//         const columns = JSON.parse(localStorage.getItem('availableColumns') || '[]');
//         if (!columns.length) {
//           toast({
//             variant: "destructive",
//             title: "No data found",
//             description: "Please upload a file from the home page first.",
//           });
//           navigate('/');
//           return;
//         }
//         setAvailableColumns(columns);
//       } catch (error) {
//         console.error("Data loading error:", error);
//         toast({
//           variant: "destructive",
//           title: "Error loading data",
//           description: "Failed to load file data. Redirecting to home page.",
//         });
//         setTimeout(() => navigate('/'), 2000);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate, toast]);

//   // Update mappings when selected features change
//   useEffect(() => {
//     const initialMappings = { ...columnMappings };
//     selectedFeatures.forEach(feature => {
//       if (!initialMappings[feature]) {
//         initialMappings[feature] = '';
//       }
//     });
//     Object.keys(initialMappings).forEach(key => {
//       if (!selectedFeatures.includes(key)) {
//         delete initialMappings[key];
//       }
//     });
//     setColumnMappings(initialMappings);
//   }, [selectedFeatures]);

//   // Category management
//   const toggleCategory = (categoryName) => {
//     setCategories(prev => ({
//       ...prev,
//       [categoryName]: {
//         ...prev[categoryName],
//         isOpen: !prev[categoryName].isOpen
//       }
//     }));
//   };

//   const handleCategorySelect = (categoryName, checked) => {
//     setCategories(prev => ({
//       ...prev,
//       [categoryName]: {
//         ...prev[categoryName],
//         isSelected: checked,
//         items: Object.keys(prev[categoryName].items).reduce((acc, item) => ({
//           ...acc,
//           [item]: checked
//         }), {})
//       }
//     }));
//   };

//   const handleSubcategorySelect = (categoryName, subcategoryName, checked) => {
//     setCategories(prev => {
//       const updatedCategory = {
//         ...prev[categoryName],
//         items: {
//           ...prev[categoryName].items,
//           [subcategoryName]: checked
//         }
//       };

//       const allSelected = Object.values(updatedCategory.items).every(value => value);
//       const anySelected = Object.values(updatedCategory.items).some(value => value);

//       updatedCategory.isSelected = allSelected;
//       updatedCategory.partiallySelected = anySelected && !allSelected;

//       return {
//         ...prev,
//         [categoryName]: updatedCategory
//       };
//     });
//   };

//   // Update selected features when categories change
//   useEffect(() => {
//     const newSelectedFeatures = [];
//     Object.entries(categories).forEach(([_, category]) => {
//       Object.entries(category.items || {}).forEach(([subcategoryName, isSelected]) => {
//         if (isSelected) {
//           newSelectedFeatures.push(subcategoryName);
//         }
//       });
//     });
//     setSelectedFeatures(newSelectedFeatures);
//   }, [categories]);

//   // Mapping management
//   const handleMappingChange = (feature, column) => {
//     setColumnMappings(prev => ({
//       ...prev,
//       [feature]: column
//     }));
//   };

//   const isValidMapping = () => {
//     if (selectedFeatures.length === 0) return false;
//     const allMapped = selectedFeatures.every(feature => columnMappings[feature]);
//     const mappedColumns = selectedFeatures.map(feature => columnMappings[feature]);
//     const uniqueMappings = new Set(mappedColumns).size === mappedColumns.length;
//     return allMapped && uniqueMappings;
//   };

//   // Smart suggestion for mapping
//   const suggestMappings = () => {
//     const suggestions = {};
//     selectedFeatures.forEach(feature => {
//       const exactMatch = availableColumns.find(col => 
//         col.toLowerCase() === feature.toLowerCase());
//       if (exactMatch && !Object.values(suggestions).includes(exactMatch)) {
//         suggestions[feature] = exactMatch;
//         return;
//       }
//       const partialMatches = availableColumns.filter(col => 
//         col.toLowerCase().includes(feature.toLowerCase()) || 
//         feature.toLowerCase().includes(col.toLowerCase()));
//       if (partialMatches.length > 0) {
//         const bestMatch = partialMatches[0];
//         if (!Object.values(suggestions).includes(bestMatch)) {
//           suggestions[feature] = bestMatch;
//         }
//       }
//     });
//     setColumnMappings(prev => ({
//       ...prev,
//       ...suggestions
//     }));
//     toast({
//       title: "Auto-mapping suggested",
//       description: `Mapped ${Object.keys(suggestions).length} fields automatically`,
//     });
//   };

//   // Instead of processing the file here, navigate to preview
// const handleProceedToPreview = async () => {
//   if (!isValidMapping()) {
//     toast({
//       variant: "destructive",
//       title: "Invalid mapping",
//       description: "Please ensure all selected features are mapped to unique columns.",
//     });
//     return;
//   }

//   // Save the mappings configuration in localStorage
//   const selectedMappings = selectedFeatures.reduce((acc, feature) => {
//     acc[feature] = columnMappings[feature];
//     return acc;
//   }, {});

//   // Optionally, also save category selections if needed
//   const categoryConfig = Object.entries(categories).reduce((acc, [name, category]) => {
//     acc[name] = {
//       selected: category.isSelected,
//       items: category.items
//     };
//     return acc;
//   }, {});

//   localStorage.setItem('columnMappings', JSON.stringify(selectedMappings));
//   localStorage.setItem('categoryConfig', JSON.stringify(categoryConfig));

//   // Navigate to the preview page
//   navigate('/data-preview');
// };

//   return (
//     <div className="configuration-maincon">
//       {isLoading ? (
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading column data...</p>
//           </div>
//         </div>
//       ) : (
//         <div className="config-container flex">
//           {/* Categories Section */}
//           <div className="categories-con flex-shrink overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-4">Categories</h2>
//             <p className="text-sm text-gray-500 mb-4">
//               Select analysis categories ({selectedFeatures.length} features selected)
//             </p>

//             {Object.entries(categories).map(([categoryName, category]) => (
//               <div key={categoryName} className="category-group mb-4">
//                 <Collapsible open={category.isOpen}>
//                   <div className="category-header flex items-center gap-2 mb-2">
//                     <Checkbox
//                       checked={category.isSelected}
//                       indeterminate={category.partiallySelected}
//                       onCheckedChange={(checked) => 
//                         handleCategorySelect(categoryName, checked)}
//                     />
//                     <CollapsibleTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => toggleCategory(categoryName)}
//                         className="flex items-center justify-between w-full"
//                       >
//                         <span>{categoryName}</span>
//                         {category.isOpen ? 
//                           <ChevronUp className="h-4 w-4" /> : 
//                           <ChevronDown className="h-4 w-4" />}
//                       </Button>
//                     </CollapsibleTrigger>
//                   </div>

//                   <CollapsibleContent>
//                     <div className="ml-6 space-y-2">
//                       {Object.entries(category.items || {}).map(([subcategoryName, isSelected]) => (
//                         <div key={subcategoryName} className="flex items-center gap-2">
//                           <Checkbox
//                             checked={isSelected}
//                             onCheckedChange={(checked) => 
//                               handleSubcategorySelect(categoryName, subcategoryName, checked)}
//                           />
//                           <span className="text-sm">{subcategoryName}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </CollapsibleContent>
//                 </Collapsible>
//               </div>
//             ))}
//           </div>

//           {/* Features Section */}
//           <div className="attributes-con flex-1">
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <h2 className="text-2xl font-bold">Column Mapping</h2>
//                 <p className="text-sm text-gray-500">Map selected features to available columns</p>
//               </div>
//               {selectedFeatures.length > 0 && (
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   onClick={suggestMappings}
//                 >
//                   Auto-Suggest Mappings
//                 </Button>
//               )}
//             </div>
            
//             <p className="text-sm text-gray-500 mb-4">
//               Map {selectedFeatures.length} selected features to available columns ({availableColumns.length} available)
//             </p>

//             {selectedFeatures.length === 0 ? (
//               <div className="bg-gray-100 p-6 rounded-lg text-center">
//                 <p className="text-gray-600">Select categories from the left panel to begin mapping</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[65vh]">
//                 {selectedFeatures.map((feature) => (
//                   <div key={feature} className="feature-item p-3 border rounded-lg">
//                     <div className="feature-title mb-2">
//                       <h6 className="text-sm font-medium">{feature}</h6>
//                     </div>
//                     <Select 
//                       onValueChange={(value) => handleMappingChange(feature, value)}
//                       value={columnMappings[feature] || ""}
//                     >
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select column" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {availableColumns.map((column) => (
//                           <SelectItem 
//                             key={column} 
//                             value={column}
//                             disabled={
//                               Object.values(columnMappings).includes(column) && 
//                               columnMappings[feature] !== column
//                             }
//                           >
//                             {column}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <div className="navigation-footer w-full fixed bottom-0 bg-white border-t py-3 px-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <div className="stats">
//             <span className="text-sm text-gray-600">
//               {selectedFeatures.length} features selected | 
//               {Object.keys(columnMappings).filter(k => columnMappings[k]).length}/{selectedFeatures.length} mapped
//             </span>
//           </div>
//           <div className="flex gap-3">
//             <Link to="/">
//               <Button variant="outline">
//                 Previous
//               </Button>
//             </Link>
//             <Button 
//               className="bg-purple-600 hover:bg-purple-700"
//               onClick={handleProceedToPreview}
//               disabled={isProcessing || !isValidMapping()}
//             >
//               {isProcessing ? "Processing..." : "Preview"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Configuration;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from "../../components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { useToast } from "@/hooks/use-toast";
import "./configuration.css";

const Configuration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management 
  const [categories, setCategories] = useState({
    'Research Focus': {
      items: {
        "Authors": false,
        "Author full names": false,
        "Author(s) ID": false,
        "Title": false,
        "Abstract": false,
        "Author Keywords": false,
        "Index Keywords": false,
      },
      isOpen: false,
      isSelected: false
    },
    // Other categories remain unchanged
    'Publication Details': {
      items: {
        "Year": false,
        "Source title": false,
        "Volume": false,
        "Issue": false,
        "Art. No.": false,
        "Page start": false,
        "Page end": false,
        "Page count": false,
        "DOI": false,
        "Link": false,
        "Publisher": false,
        "Publication Stage": false,
        "Document Type": false,
        "Language of Original Document": false,
        "Abbreviated Source Title": false,
      },
      isOpen: false,
      isSelected: false
    },
    'Citation & Impact': {
      items: {
        "Cited by": false,
        "References": false,
        "ISSN": false,
        "ISBN": false,
        "CODEN": false,
        "PubMed ID": false,
        "Open Access": false,
      },
      isOpen: false,
      isSelected: false
    },
    'Affiliations & Funding': {
      items: {
        "Affiliations": false,
        "Authors with affiliations": false,
        "Funding Details": false,
        "Funding Texts": false,
        "Correspondence Address": false,
      },
      isOpen: false,
      isSelected: false
    },
    'Conference Information': {
      items: {
        "Conference name": false,
        "Conference date": false,
        "Conference location": false,
        "Conference code": false,
        "Sponsors": false,
        "Editors": false,
      },
      isOpen: false,
      isSelected: false
    },
    'Chemical & Biological Data': {
      items: {
        "Molecular Sequence Numbers": false,
        "Chemicals/CAS": false,
        "Tradenames": false,
        "Manufacturers": false,
      },
      isOpen: false,
      isSelected: false
    },
    'Indexing & Source': {
      items: {
        "Source": false,
        "EID": false,
      },
      isOpen: false,
      isSelected: false
    }
  });

  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [columnMappings, setColumnMappings] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // All the useEffects and handler functions remain the same
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const columns = JSON.parse(localStorage.getItem('availableColumns') || '[]');
        if (!columns.length) {
          toast({
            variant: "destructive",
            title: "No data found",
            description: "Please upload a file from the home page first.",
          });
          navigate('/');
          return;
        }
        setAvailableColumns(columns);
      } catch (error) {
        console.error("Data loading error:", error);
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "Failed to load file data. Redirecting to home page.",
        });
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  useEffect(() => {
    const initialMappings = { ...columnMappings };
    selectedFeatures.forEach(feature => {
      if (!initialMappings[feature]) {
        initialMappings[feature] = '';
      }
    });
    Object.keys(initialMappings).forEach(key => {
      if (!selectedFeatures.includes(key)) {
        delete initialMappings[key];
      }
    });
    setColumnMappings(initialMappings);
  }, [selectedFeatures]);

  const toggleCategory = (categoryName) => {
    setCategories(prev => ({
      ...prev,
      [categoryName]: {
        ...prev[categoryName],
        isOpen: !prev[categoryName].isOpen
      }
    }));
  };

  const handleCategorySelect = (categoryName, checked) => {
    setCategories(prev => ({
      ...prev,
      [categoryName]: {
        ...prev[categoryName],
        isSelected: checked,
        items: Object.keys(prev[categoryName].items).reduce((acc, item) => ({
          ...acc,
          [item]: checked
        }), {})
      }
    }));
  };

  const handleSubcategorySelect = (categoryName, subcategoryName, checked) => {
    setCategories(prev => {
      const updatedCategory = {
        ...prev[categoryName],
        items: {
          ...prev[categoryName].items,
          [subcategoryName]: checked
        }
      };

      const allSelected = Object.values(updatedCategory.items).every(value => value);
      const anySelected = Object.values(updatedCategory.items).some(value => value);

      updatedCategory.isSelected = allSelected;
      updatedCategory.partiallySelected = anySelected && !allSelected;

      return {
        ...prev,
        [categoryName]: updatedCategory
      };
    });
  };

  useEffect(() => {
    const newSelectedFeatures = [];
    Object.entries(categories).forEach(([_, category]) => {
      Object.entries(category.items || {}).forEach(([subcategoryName, isSelected]) => {
        if (isSelected) {
          newSelectedFeatures.push(subcategoryName);
        }
      });
    });
    setSelectedFeatures(newSelectedFeatures);
  }, [categories]);

  const handleMappingChange = (feature, column) => {
    setColumnMappings(prev => ({
      ...prev,
      [feature]: column
    }));
  };

  const isValidMapping = () => {
    if (selectedFeatures.length === 0) return false;
    const allMapped = selectedFeatures.every(feature => columnMappings[feature]);
    const mappedColumns = selectedFeatures.map(feature => columnMappings[feature]);
    const uniqueMappings = new Set(mappedColumns).size === mappedColumns.length;
    return allMapped && uniqueMappings;
  };

  const suggestMappings = () => {
    const suggestions = {};
    selectedFeatures.forEach(feature => {
      const exactMatch = availableColumns.find(col => 
        col.toLowerCase() === feature.toLowerCase());
      if (exactMatch && !Object.values(suggestions).includes(exactMatch)) {
        suggestions[feature] = exactMatch;
        return;
      }
      const partialMatches = availableColumns.filter(col => 
        col.toLowerCase().includes(feature.toLowerCase()) || 
        feature.toLowerCase().includes(col.toLowerCase()));
      if (partialMatches.length > 0) {
        const bestMatch = partialMatches[0];
        if (!Object.values(suggestions).includes(bestMatch)) {
          suggestions[feature] = bestMatch;
        }
      }
    });
    setColumnMappings(prev => ({
      ...prev,
      ...suggestions
    }));
    toast({
      title: "Auto-mapping suggested",
      description: `Mapped ${Object.keys(suggestions).length} fields automatically`,
    });
  };

  const handleProceedToPreview = async () => {
    if (!isValidMapping()) {
      toast({
        variant: "destructive",
        title: "Invalid mapping",
        description: "Please ensure all selected features are mapped to unique columns.",
      });
      return;
    }

    const selectedMappings = selectedFeatures.reduce((acc, feature) => {
      acc[feature] = columnMappings[feature];
      return acc;
    }, {});

    const categoryConfig = Object.entries(categories).reduce((acc, [name, category]) => {
      acc[name] = {
        selected: category.isSelected,
        items: category.items
      };
      return acc;
    }, {});

    localStorage.setItem('columnMappings', JSON.stringify(selectedMappings));
    localStorage.setItem('categoryConfig', JSON.stringify(categoryConfig));

    navigate('/data-preview');
  };

  return (
    <div className="configuration-maincon">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading column data...</p>
          </div>
        </div>
      ) : (
        <div className="config-container flex">
          {/* Categories Section - Same as before */}
          <div className="categories-con flex-shrink overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            <p className="text-sm text-gray-500 mb-4">
              Select analysis categories ({selectedFeatures.length} features selected)
            </p>

            {Object.entries(categories).map(([categoryName, category]) => (
              <div key={categoryName} className="category-group mb-4">
                <Collapsible open={category.isOpen}>
                  <div className="category-header flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={category.isSelected}
                      indeterminate={category.partiallySelected}
                      onCheckedChange={(checked) => 
                        handleCategorySelect(categoryName, checked)}
                    />
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategory(categoryName)}
                        className="flex items-center justify-between w-full"
                      >
                        <span>{categoryName}</span>
                        {category.isOpen ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <div className="ml-6 space-y-2">
                      {Object.entries(category.items || {}).map(([subcategoryName, isSelected]) => (
                        <div key={subcategoryName} className="flex items-center gap-2">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              handleSubcategorySelect(categoryName, subcategoryName, checked)}
                          />
                          <span className="text-sm">{subcategoryName}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>

          {/* Features Section - Modified for horizontal inline layout */}
          <div className="attributes-con flex-1">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">Column Mapping</h2>
                <p className="text-sm text-gray-500">Map selected features to available columns</p>
              </div>
              {selectedFeatures.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={suggestMappings}
                >
                  Auto-Suggest Mappings
                </Button>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Map {selectedFeatures.length} selected features to available columns ({availableColumns.length} available)
            </p>

            {selectedFeatures.length === 0 ? (
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p className="text-gray-600">Select categories from the left panel to begin mapping</p>
              </div>
            ) : (
              <div className="mapping-container overflow-y-auto pr-2 max-h-[65vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {selectedFeatures.map((feature) => (
                    <div key={feature} className="mapping-row bg-white p-3 border rounded-lg flex items-center">
                      <div className="feature-name w-2/5 pr-2 font-medium text-sm truncate" title={feature}>
                        {feature}
                      </div>
                      <div className="column-select w-3/5">
                        <Select 
                          onValueChange={(value) => handleMappingChange(feature, value)}
                          value={columnMappings[feature] || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableColumns.map((column) => (
                              <SelectItem 
                                key={column} 
                                value={column}
                                disabled={
                                  Object.values(columnMappings).includes(column) && 
                                  columnMappings[feature] !== column
                                }
                              >
                                {column}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Footer - Same as before */}
      <div className="navigation-footer w-full fixed bottom-0 bg-white border-t py-3 px-14">
        <div className="container mx-auto flex justify-between items-center">
          <div className="stats">
            <span className="text-sm text-gray-600">
              {selectedFeatures.length} features selected | 
              {Object.keys(columnMappings).filter(k => columnMappings[k]).length}/{selectedFeatures.length} mapped
            </span>
          </div>
          <div className="flex gap-3">
            <Link to="/">
              <Button variant="outline">
                Previous
              </Button>
            </Link>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleProceedToPreview}
              disabled={isProcessing || !isValidMapping()}
            >
              {isProcessing ? "Processing..." : "Preview"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;