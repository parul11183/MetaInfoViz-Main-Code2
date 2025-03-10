import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import "../NewStyle.css";

const FIXED_COLUMNS = [
  "Authors", "Author full names", "Author(s) ID", "Title", "Year", "Source title", 
  "Volume", "Issue", "Art. No.", "Page start", "Page end", "Page count", "Cited by", "DOI", "Link", "Affiliations", 
  "Authors with affiliations", "Abstract", "Author Keywords", "Index Keywords", "Molecular Sequence Numbers", 
  "Chemicals/CAS", "Tradenames", "Manufacturers", "Funding Details", "Funding Texts", "References", 
  "Correspondence Address", "Editors", "Publisher", "Sponsors", "Conference name", "Conference date", "Conference location", 
  "Conference code", "ISSN", "ISBN", "CODEN", "PubMed ID", "Language of Original Document", "Abbreviated Source Title", 
  "Document Type", "Publication Stage", "Open Access", "Source", "EID"
];



const ColumnMappingComponent = ({ selectedColumns, onBack, onSubmit }) => {
  const [mappings, setMappings] = useState(
    // Initialize mappings with empty strings instead of column names
    selectedColumns.reduce((acc, column) => {
      // Check if column exists in FIXED_COLUMNS
      const hasMatch = FIXED_COLUMNS.includes(column);
      acc[column] = hasMatch ? column : '';
      return acc;
    }, {})
  );

  // Track which fixed columns are currently selected
  const getUsedColumns = (currentMappings) => {
    return new Set(Object.values(currentMappings).filter(value => value));
  };

  // Handle the change when a mapping is selected
  const handleMappingChange = (selectedColumn, fixedColumn) => {
    setMappings(prev => ({
      ...prev,
      [selectedColumn]: fixedColumn
    }));
  };

  

  const handleSubmitMapping = async () => {

    const mappedColumns = Object.values(
    mappings
  ).reduce((acc, mapped) => {
    if (!acc.seen.has(mapped) && mapped) {
      acc.unique.push(mapped);
      acc.seen.add(mapped);
    }
    return acc;
  }, { unique: [], seen: new Set() }).unique;

    const changedMappings = Object.entries(mappings).reduce((acc, [original, mapped]) => {
      
        acc[original] = mapped;
      
      return acc;
    }, {});

   

    if (Object.keys(changedMappings).length > 0) {
      try {
        await axios.post("http://127.0.0.1:8000/api/send-column-mappings/", {
          mappings: changedMappings, columns: mappedColumns
        });
      } catch (error) {
        console.error("Error updating column names:", error);
      }
    }
    onSubmit(mappings);
  };

  // Get currently used columns for dropdown disabling
  const usedColumns = getUsedColumns(mappings);

  // Check if submit should be disabled
  const isSubmitDisabled = 
    Object.values(mappings).some(value => !value) || // Any empty mapping
    new Set(Object.values(mappings).filter(Boolean)).size !== 
    Object.values(mappings).filter(Boolean).length || // Duplicate mappings
    Object.values(mappings).every(value => !value); // All dropdowns empty

  return (
    <div className="container mt-4" >
      <h4 style={{ textAlign: "center" }}>Map Selected Columns to Fixed Columns</h4>

      <div className="row" style={{ marginTop: "4rem" }}>
        <div className="col-md-6">
          <h5>Selected Columns</h5>
          <ul className="list-group">
            {selectedColumns.map(column => (
              <li key={column} className="list-group-item">
                {column}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h5>Map to Fixed Columns</h5>
          {selectedColumns.map(column => (
            <div key={column} className="mb-3">
              <label className="form-label">{column}</label>
              <select
                className="form-select"
                value={mappings[column]}
                onChange={(e) => handleMappingChange(column, e.target.value)}
              >
                {/* Add empty option as the first choice */}
                <option value="">Select a column</option>
                {FIXED_COLUMNS.map(fixedColumn => (
                  <option
                    key={fixedColumn}
                    value={fixedColumn}
                    disabled={usedColumns.has(fixedColumn) && mappings[column] !== fixedColumn}
                  >
                    {fixedColumn}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmitMapping}
          disabled={isSubmitDisabled}
        >
          Submit Mapping
        </button>
      </div>
    </div>
  );
};




function App() {

  const [excelFiles, setExcelFiles] = useState([]);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [showNote, setShowNote] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMapping, setShowMapping] = useState(false);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [fileCount, setFileCount] = useState(0);
  const [showAddMore, setShowAddMore] = useState(false);
  const [showAdditionalUpload, setShowAdditionalUpload] = useState(false);
  const [accumulatedFiles, setAccumulatedFiles] = useState([]);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/get-data/");
        setExcelData(response.data.slice(0, 5));
        if (response.data.length > 0) {
          setAvailableColumns(Object.keys(response.data[0]));
        }
      } catch (error) {
        console.error("Error fetching data after reload:", error);
      }
    };
    fetchData();
  }, []);

 const handleFiles = (e) => {
  const fileTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  let selectedFiles = Array.from(e.target.files);
  let validFiles = [];
  let errors = [];

  // Log the selected files (for debugging)
  console.log(`Selected ${selectedFiles.length} files`);

  selectedFiles.forEach((file) => {
    console.log(`Checking file: ${file.name}, type: ${file.type}`);
    if (fileTypes.includes(file.type)) {
      validFiles.push(file);
    } else {
      errors.push(`File ${file.name} is not a valid type`);
    }
  });

  if (errors.length === 0) {
    setAccumulatedFiles(prev => {
      const newFiles = [...prev, ...validFiles];
      console.log(`Total accumulated files: ${newFiles.length}`);
      return newFiles;
    });
    setFileCount(prev => prev + validFiles.length);
    setIsReadyToSubmit(true);
    setUploadError(null);
  } else {
    setUploadError(errors.join(", "));
  }
};

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);

    if (excelFiles.length > 0) {
      const formData = new FormData();
      setExcelFiles(accumulatedFiles);
      setIsReadyToSubmit(true);
      }};

 const handleSubmitForAnalysis = async () => {
  if (accumulatedFiles.length === 0) {
    setUploadError("Please select files to upload");
    return;
  }

  const formData = new FormData();
  
  // Log the number of files being processed
  console.log(`Processing ${accumulatedFiles.length} files`);
  
  // Append each file to formData with the correct field name
  accumulatedFiles.forEach((file, index) => {
    console.log(`Appending file ${index + 1}: ${file.name}`);
    formData.append('files', file);
  });

  try {
    setLoadingMessage("Uploading files...");
    
    // Log the FormData content (for debugging)
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await axios.post(
      "http://127.0.0.1:8000/api/upload-csv/",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // setUploadProgress(percentCompleted);
        },
      }
    );

    setAvailableColumns(response.data.columns);
    setShowModal(true);
    setLoadingMessage("");
    setUploadProgress(0);
    
    const dataResponse = await axios.get("http://127.0.0.1:8000/api/get-data/");
    setExcelData(dataResponse.data.slice(0, 5));
    setTotalRecords(response.data.total_records || dataResponse.data.length); // Add this line
  } catch (error) {
    console.error("Upload error:", error);
    setUploadError(
      error.response?.data?.error || 
      "Error uploading files. Please ensure files are selected and try again."
    );
    setLoadingMessage("");
  }
};



  const handleDelete = async () => {
    try {
      setSelectedColumns([]);
      setFileCount(0);
      setAccumulatedFiles([]);
      setIsReadyToSubmit(false);
      setExcelData(null);
      setTotalRecords(0);
      const deleteResponse = await axios.delete(
        "http://127.0.0.1:8000/api/delete-all/"
      );
      console.log(deleteResponse.data.message);
      setExcelData(null);
    } catch (error) {
      console.error("Error deleting records:", error);
    }
  };




  const handleAddMoreFiles = (e) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.csv,.xls,.xlsx';
    fileInput.onchange = handleFiles;
    fileInput.click();
  };


 

  const handleColumnChange = (column) => {
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.includes(column)
        ? prevSelectedColumns.filter((col) => col !== column)
        : [...prevSelectedColumns, column]
    );
  };

  const handleNextStep = () => {
    setShowModal(false);
    setShowMapping(true);
  };

  const handleBackToSelection = () => {
    setShowMapping(false);
    setShowModal(true);
  };

  const handleMappingSubmit = async (mappings) => {
    if (accumulatedFiles.length === 0) {
      setUploadError("No files selected for upload");
      return;
    }
  
    try {
      setShowMapping(false);
      setLoadingMessage("Uploading and processing files..."); 
  
      // Create FormData with all accumulated files
      const formData = new FormData();
      accumulatedFiles.forEach((file, index) => {
        formData.append("files", file);
      });
  
      // Add mappings to FormData
      formData.append("mappings", JSON.stringify(mappings));
  
      // First upload and process the files with mappings
      const uploadResponse = await axios.post(
        "http://127.0.0.1:8000/api/upload-csv2/", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // setUploadProgress(percentCompleted);
          },
        }
      );
  
      // If upload successful, fetch the processed data
      if (uploadResponse.status === 200) {
        setLoadingMessage("Retrieving processed data...");
        const dataResponse = await axios.get("http://127.0.0.1:8000/api/get-data/");
        setExcelData(dataResponse.data.slice(0, 5));
      }
  
      // Reset states after successful processing
      setLoadingMessage("");
      setUploadProgress(0);
      setAccumulatedFiles([]);
      setFileCount(0);
      setIsReadyToSubmit(false);
      setShowMapping(false);
  
    } catch (error) {
      console.error("Error processing files:", error);
      setUploadError(
        error.response?.data?.error || 
        "Error processing files. Please try again."
      );
      setLoadingMessage("");
      setUploadProgress(0);
    }
  };

 
  const handleSelectAllColumns = () => {
    // If all columns are already selected, unselect them
    if (selectedColumns.length === availableColumns.length) {
      setSelectedColumns([]);
    } else {
      // Select all available columns
      setSelectedColumns([...availableColumns]);
    }
  };
  

  return (
    <div className="wrapper mt-3">
      {!showMapping ? (
        <>
          <form className="form-group custom-form" onSubmit={handleFileSubmit}>
            <div className="d-flex flex-column align-items-center">
              <div className="d-flex justify-content-center gap-2 mb-3">
                <input
                  type="file"
                  className="form-control form-control-sm"
                  required
                  multiple
                  onChange={handleFiles}
                  accept=".csv,.xls,.xlsx"
                  style={{ width: 'auto' }}
                />
                          {fileCount > 0 && (
            <button
              type="button"
              className="btn btn-secondary btn-md"
              onClick={handleAddMoreFiles}
            >
              Add More Files
            </button>
          )}
                
              </div>
              <div
                className="text-center position-relative"
                onMouseEnter={() => setShowNote(true)}
                onMouseLeave={() => setShowNote(true)}
              >
                <h6>Upload files</h6>
                {fileCount > 0 && (
                  <p className="text-muted">
                    Total files uploaded: {fileCount}
                  </p>
                )}

                {showNote && (
                  <div className="hover-note">
                    <b>NOTE :</b> CSV files must have same column names and order
                  </div>
                )}
              </div>
              <br />
              {/* <button type="submit" className="btn btn-success btn-md">
                UPLOAD
              </button> */}

{/* <div className="d-flex gap-2 mt-3"> */}
                {/* {fileCount > 0 && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-md"
                    onClick={handleAddMoreFiles}
                  >
                    Add More Files
                  </button>
                )} */}
                {/* </div> */}

<div className="d-flex gap-2 mt-3">
      {isReadyToSubmit && (
        <button
          type="button"
          className="btn btn-primary btn-md"
          onClick={handleSubmitForAnalysis}
        >
          Submit for Analysis
        </button>
      )}
      
      {fileCount > 0 && (
        <button
          type="button"
          className="btn btn-danger btn-md"
          onClick={handleDelete}
        >
          Reset
        </button>
      )}
    </div>

              {loadingMessage && (
              <div className="loading-message">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>{loadingMessage}</p>
              </div>
              )}

                
              {typeError && (
                <div className="alert alert-danger mt-3" role="alert">
                  {typeError}
                </div>
              )}

              {uploadError && (
                <div className="alert alert-danger mt-3" role="alert">
                  {uploadError}
                </div>
              )}
            </div>
          </form>
          

          {uploadProgress > 0 && (
            <div className="progress mt-3" style={{ width: "20%", margin: "0 auto" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {uploadProgress}%
              </div>
            </div>
          )}
          
          
          {excelData && excelData.length > 0 && (
            <div className="viewer mt-3">
              <div className="container">
                {fileCount === 1 && (
                  <div className="text-center mb-3">
                    {/* <form onSubmit={handleAddMoreFiles} className="d-inline-block">
                      <div className="d-flex gap-2 align-items-center">
                        <input
                          type="file"
                          className="form-control form-control-sm"
                          multiple
                          onChange={handleFiles}
                          accept=".csv,.xls,.xlsx"
                        />
                        <button type="submit" className="btn btn-primary btn-md">
                          Add More Files
                        </button>
                      </div>
                    </form> */}
                  </div>
                )}
                <div className="scrollable-container">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped small">
                      <thead>
                        <tr>
                          {Object.keys(excelData[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {excelData.map((individualExcelData, index) => (
                          <tr key={index}>
                            {Object.keys(individualExcelData).map((key) => (
                              <td key={key}>{individualExcelData[key]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                      {/* Add this section below the table */}
      <div className="text-center mt-3 mb-3">
        <p className="fw-bold">
        {/* Showing {excelData.length} preview records from total {totalRecords} records in {fileCount} file{fileCount > 1 ? 's' : ''} */}
        </p>
      </div>
              </div>
{/* 
              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-danger btn-md"
                  onClick={handleDelete}
                >
                  DELETE ALL RECORDS
                </button>
              </div> */}
            </div>
          )}


{showModal && (
  <div className="modal show d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Select Columns for Analysis</h5>
          <button
            type="button"
            className="close"
            onClick={() => setShowModal(false)}
          >
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {/* Select All Button */}
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => handleSelectAllColumns()}
            >
              Select All
            </button>
          </div>

          {availableColumns.map((column) => (
            <div key={column} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                value={column}
                onChange={() => handleColumnChange(column)}
                checked={selectedColumns.includes(column)}
              />
              <label className="form-check-label">{column}</label>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNextStep}
            disabled={selectedColumns.length === 0}
          >
            Next
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
        </>
      ) : (
        <ColumnMappingComponent 
          selectedColumns={selectedColumns}
          onBack={handleBackToSelection}
          onSubmit={handleMappingSubmit}
        />
      )}
    </div>
  );
}

export default App;