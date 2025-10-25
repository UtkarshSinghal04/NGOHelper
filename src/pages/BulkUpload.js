import React, { useState, useRef } from 'react';

/**
 * Bulk Upload page component
 * Allows NGOs to upload CSV files with multiple reports
 * Simulates backend processing with progress updates
 */
const BulkUpload = () => {
  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [processedRows, setProcessedRows] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showJobId, setShowJobId] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [successfulRows, setSuccessfulRows] = useState(0);
  const [invalidRowsCount, setInvalidRowsCount] = useState(0);
  
  // Ref for file input
  const fileInputRef = useRef(null);

  /**
   * Copy job ID to clipboard
   */
  const copyJobId = async () => {
    if (currentJobId) {
      try {
        await navigator.clipboard.writeText(currentJobId);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 5000); // Hide success message after 5 seconds
        console.log('Job ID copied to clipboard');
      } catch (error) {
        console.error('Failed to copy job ID:', error);
      }
    }
  };

  /**
   * Handle file selection
   * Validates file type and sets the selected file
   */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setUploadError('Please select a valid CSV file.');
        return;
      }
      
      setSelectedFile(file);
      setUploadError(null);
      setUploadComplete(false);
    }
  };

  /**
   * Upload CSV file to backend and track processing
   */
  const uploadCSVFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('http://localhost:3001/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const jobId = result.data.jobId;
        setCurrentJobId(jobId);
        setShowJobId(true);
        console.log('CSV upload accepted, job ID:', jobId);
        
        // Start polling for job status
        pollJobStatus(jobId);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload CSV file: ' + error);
      setIsUploading(false);
    }
  };

  /**
   * Poll job status until completion
   */
  const pollJobStatus = async (jobId) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/reports/job-status/${jobId}`);
        const result = await response.json();

        if (result.success && result.data) {
          const { status, progress, totalRows, processedRows, errorMessage } = result.data;
          setTotalRows(totalRows);
          setProcessedRows(processedRows);
          setUploadProgress(progress);

          if (status === 'completed') {
            clearInterval(pollInterval);
            setUploadComplete(true);
            setIsUploading(false);
            setSuccessfulRows(processedRows);
            setInvalidRowsCount(0);
            // Keep jobId visible for 5 seconds after completion
            setTimeout(() => {
              setCurrentJobId(null);
              setShowJobId(false);
            }, 5000);
            console.log('CSV processing completed successfully');
          } else if (status === 'completed_with_errors') {
            clearInterval(pollInterval);
            setUploadComplete(true);
            setIsUploading(false);
            // Parse error message to extract validation results
            try {
              const validationResults = JSON.parse(errorMessage);
              setSuccessfulRows(validationResults.successfulRows || 0);
              setInvalidRowsCount(validationResults.invalidRows || 0);
              setValidationErrors(validationResults.errors || []);
            } catch (e) {
              console.error('Error parsing validation results:', e);
              setSuccessfulRows(processedRows);
            }
            // Keep jobId visible for 5 seconds after completion
            setTimeout(() => {
              setCurrentJobId(null);
              setShowJobId(false);
            }, 5000);
            console.log('CSV processing completed with validation errors');
          } else if (status === 'failed') {
            clearInterval(pollInterval);
            setUploadError('CSV processing failed: ' + errorMessage);
            setIsUploading(false);
            // Keep jobId visible for 5 seconds after failure
            setTimeout(() => {
              setCurrentJobId(null);
              setShowJobId(false);
            }, 5000);
          }
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        clearInterval(pollInterval);
        setUploadError('Failed to track processing status');
        setIsUploading(false);
      }
    }, 1000); // Poll every second
  };

  /**
   * Handle file upload and processing
   * Uploads CSV file to backend for processing
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadComplete(false);

    try {
      // Upload CSV file to backend
      await uploadCSVFile(selectedFile);
    } catch (error) {
      setUploadError('An error occurred during processing. Please try again.');
      setIsUploading(false);
    }
  };

  /**
   * Reset the upload form
   */
  const handleReset = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setTotalRows(0);
    setProcessedRows(0);
    setUploadComplete(false);
    setUploadError(null);
    setCurrentJobId(null);
    setShowJobId(false);
    setCopySuccess(false);
    setValidationErrors([]);
    setSuccessfulRows(0);
    setInvalidRowsCount(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Bulk Report Upload</h1>

        {/* File Upload Section */}
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="space-y-4">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {selectedFile ? selectedFile.name : 'Click to upload CSV file'}
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    or drag and drop your CSV file here
                  </span>
                </label>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="sr-only"
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {uploadError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {uploadError}
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-800">Processing CSV...</span>
                <span className="text-sm text-blue-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-blue-700">
                Processed {processedRows} of {totalRows} rows
              </div>
            </div>
          </div>
        )}

        {/* Job ID Display */}
        {showJobId && currentJobId && (
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Job ID:</span>
                  <span className="ml-2 text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {currentJobId}
                  </span>
                </div>
                <button
                  onClick={copyJobId}
                  className={`ml-4 px-3 py-1 text-xs rounded transition-colors duration-200 ${
                    copySuccess 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Save this Job ID for tracking your upload progress
              </p>
            </div>
          </div>
        )}

        {/* Upload Complete */}
        {uploadComplete && (
          <div className="mb-6">
            {invalidRowsCount === 0 ? (
              <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Upload completed successfully! {successfulRows} rows processed.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Upload completed with validation errors! {successfulRows} rows processed successfully, {invalidRowsCount} rows had errors.
                </div>
                {/* Show validation errors */}
                {validationErrors.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium mb-2">Validation Errors:</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {validationErrors.map((error, index) => (
                        <div key={index} className="bg-white p-2 rounded border text-sm">
                          <div className="font-medium text-red-600">Row {error.rowNumber}:</div>
                          <ul className="list-disc list-inside text-red-600 ml-2">
                            {error.errors.map((err, errIndex) => (
                              <li key={errIndex}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`px-6 py-2 rounded-md font-medium ${
              !selectedFile || isUploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors duration-200`}
          >
            {isUploading ? 'Processing...' : 'Upload & Process'}
          </button>
          
          <button
            onClick={handleReset}
            disabled={isUploading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>

        {/* CSV Format Instructions */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-md">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">CSV Format Requirements:</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>Required columns:</strong> NGO ID, Month, Year, People Helped, Events Conducted, Funds Utilized</p>
            <p><strong>Sample format:</strong></p>
            <div className="bg-white p-2 rounded border text-xs font-mono">
              NGO ID,Month,Year,People Helped,Events Conducted,Funds Utilized<br/>
              NGO001,January,2024,150,5,25000<br/>
              NGO002,January,2024,200,8,30000
            </div>
            <p className="mt-2"><strong>Validation Rules:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>NGO ID: Required, cannot be empty</li>
              <li>Month: Must be a valid month name (January, February, March, etc.)</li>
              <li>Year: Must be between 2020 and current year</li>
              <li>People Helped: Must be a number greater than 0</li>
              <li>Events Conducted: Must be a number greater than 0</li>
              <li>Funds Utilized: Must be a number greater than 0</li>
            </ul>
            <p className="mt-2">• First row should contain column headers</p>
            <p>• Use comma (,) as delimiter</p>
            <p>• Invalid rows will be skipped and shown in the error report</p>
            <p>• You can submit reports multiple times — only your latest submission will be considered final</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
