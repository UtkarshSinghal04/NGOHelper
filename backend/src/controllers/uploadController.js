/**
 * Upload controller for CSV bulk upload
 */

const { createJob, getJobStatus } = require('../services/jobService');
const { processCSVFile } = require('../services/csvService');

/**
 * Upload CSV file for bulk processing
 */
const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No CSV file uploaded'
      });
      return;
    }

    // Create a new job for tracking
    const jobId = await createJob();

    // Process CSV file asynchronously
    processCSVFile(req.file.buffer, jobId)
      .then(() => {
        console.log(`CSV processing completed for job ${jobId}`);
      })
      .catch((error) => {
        console.error(`CSV processing failed for job ${jobId}:`, error);
      });

    res.status(202).json({
      success: true,
      message: 'CSV upload accepted for processing',
      data: {
        jobId,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Upload CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process CSV upload'
    });
  }
};

/**
 * Get job status
 */
const getJobStatusById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await getJobStatus(jobId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Get job status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve job status'
    });
  }
};

module.exports = {
  uploadCSV,
  getJobStatusById
};
