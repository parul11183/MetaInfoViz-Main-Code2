import React, { useState } from 'react';
import { SignIn, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import FileDropInput from '@/components/ui/file-drop-input';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import './home.css';

const Home = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Modify your existing FileDropInput to handle multiple files
  const handleFileSelect = (files) => {
    // Handle both single file and multiple files
    const fileArray = files instanceof FileList ? Array.from(files) : [files].filter(Boolean);
    
    if (fileArray.length === 0) return;
    
    // Validate file types
    const invalidFiles = fileArray.filter(file => 
      file.type !== 'text/csv' && 
      file.type !== 'application/vnd.ms-excel' && 
      file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    
    if (invalidFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Invalid file type(s)",
        description: "Please upload only CSV or Excel files.",
      });
      return;
    }

    setSelectedFiles(fileArray);
    toast({
      title: `${fileArray.length} file(s) selected`,
      description: "Click 'Analyze Documents' to proceed.",
    });
  };

  const handleAnalyzeClick = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload files first.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      toast({
        title: "Analysis started",
        description: `Processing ${selectedFiles.length} file(s)...`,
      });

      // Create FormData for the main upload-csv request
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      // First save each file to temp storage
      for (const file of selectedFiles) {
        const tempFormData = new FormData();
        tempFormData.append('file', file);
        
        await axios.post(
          "http://3.6.36.17:80/api/temp_upload/",
          tempFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        );
      }

      // Then process all files together for column analysis
      const response = await axios.post(
        "http://3.6.36.17:80/api/upload-csv/",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      // Store column information in localStorage
      if (response.data && response.data.columns) {
        localStorage.setItem('availableColumns', JSON.stringify(response.data.columns));
        localStorage.setItem('totalRecords', response.data.total_records || 0);
        localStorage.setItem('csvUploaded', 'true');
        // Store file names for reference
        localStorage.setItem('uploadedFiles', JSON.stringify(selectedFiles.map(f => f.name)));
      }

      toast({
        title: "Analysis complete",
        description: "Proceeding to configuration page.",
      });
      
      navigate('/configuration');
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error.response?.data?.error || "Failed to process files. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="home-container">
      {isSignedIn && (
        <div className="fixed top-4 right-4 z-50">
          <UserButton />
        </div>
      )}
      <div className="hero-content">
        {/* Left Section */}
        <div className="hero-text">
          <h1 className="text-8xl font-bold tracking-tight sm:text-7xl text-white bg-clip-text text-transparent glow">
            MetaInfoSci
          </h1>
          <p className="text-lg text-gray-200">
            Transform your document analysis with powerful visualization tools. 
            Upload multiple documents and discover insights through interactive 
            visual representations of metadata and content relationships.
          </p>
          <div className="flex gap-4">
            <Button variant="default" size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white">
              Learn More
            </Button>
            <Button variant="outline" size="lg" 
              className="border-purple-400 text-purple-400 hover:bg-purple-400/10">
              Documentation
            </Button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full max-w-sm rounded-lg glass-card">
          {isSignedIn ? (
            <div className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-white">Upload Documents</h2>
              
              {/* Use standard input for multiple file selection */}
              <div className="file-drop-area border-2 border-dashed border-purple-400/50 rounded-lg p-6 text-center cursor-pointer hover:bg-purple-400/10 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  id="file-input"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  disabled={isUploading}
                  multiple
                  accept=".csv,.xls,.xlsx"
                />
                <label htmlFor="file-input" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-300 mb-1">Drag & drop multiple files here</p>
                  <p className="text-xs text-gray-400">or click to browse</p>
                </label>
              </div>
              
              {/* Display selected files */}
              {selectedFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-purple-300 mb-1">
                    {selectedFiles.length} file(s) selected:
                  </p>
                  <div className="max-h-24 overflow-y-auto bg-black/30 rounded-md p-2">
                    <ul className="text-xs text-gray-300 list-disc pl-4">
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="truncate">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleAnalyzeClick}
                disabled={isUploading}
              >
                {isUploading ? "Processing..." : `Analyze Document${selectedFiles.length !== 1 ? 's' : ''}`}
              </Button>
            </div>
          ) : (
            <SignIn/>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;