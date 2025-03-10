import React, { useState, useCallback } from 'react';
import { Upload, FileType } from 'lucide-react';

const FileDropInput = ({ onFilesSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileNames, setFileNames] = useState([]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const fileNamesList = Array.from(files).map(file => file.name);
      setFileNames(fileNamesList);
      onFilesSelect(files);
    }
  }, [onFilesSelect]);

  const handleFilesSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNamesList = Array.from(files).map(file => file.name);
      setFileNames(fileNamesList);
      onFilesSelect(files);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative rounded-lg border-2 border-dashed transition-all duration-200 ease-in-out min-h-[160px] flex flex-col items-center justify-center p-8 
        ${isDragging 
          ? 'border-purple-400 bg-purple-400/10' 
          : 'border-white/20 hover:border-purple-400/50'}`}
    >
      <input
        type="file"
        onChange={handleFilesSelect}
        accept=".csv"
        multiple
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Upload 
        className={`w-10 h-10 mb-3 ${isDragging ? 'text-purple-400' : 'text-white/60'}`} 
      />
      {fileNames.length > 0 ? (
        <div className="text-center">
          <FileType className="w-6 h-6 inline-block mr-2 text-purple-400" />
          <span className="text-white">{fileNames.join(', ')}</span>
        </div>
      ) : (
        <>
          <p className="text-lg font-medium text-white mb-1">
            Drop your documents here
          </p>
          <p className="text-sm text-white/60">
            or click to browse
          </p>
          <p className="text-xs text-white/40 mt-2">
            Upload .csv files
          </p>
        </>
      )}
    </div>
  );
};

export default FileDropInput;

