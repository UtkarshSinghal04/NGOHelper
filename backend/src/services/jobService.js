/**
 * Job service for handling async CSV processing
 */

const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../config/database');

const db = getDatabase();

/**
 * Create a new job
 */
const createJob = async () => {
  return new Promise((resolve, reject) => {
    const jobId = uuidv4();
    const currentDate = new Date().toISOString();

    db.run(
      'INSERT INTO jobs (id, status, progress, total_rows, processed_rows, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [jobId, 'pending', 0, 0, 0, currentDate, currentDate],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(jobId);
      }
    );
  });
};

/**
 * Get job status
 */
const getJobStatus = async (jobId) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM jobs WHERE id = ?',
      [jobId],
      (err, job) => {
        if (err) {
          reject(err);
          return;
        }

        if (!job) {
          resolve({
            success: false,
            message: 'Job not found'
          });
          return;
        }

        resolve({
          success: true,
          message: 'Job status retrieved successfully',
          data: {
            jobId: job.id,
            status: job.status,
            progress: job.progress,
            totalRows: job.total_rows,
            processedRows: job.processed_rows,
            errorMessage: job.error_message
          }
        });
      }
    );
  });
};

/**
 * Update job status
 */
const updateJobStatus = async (jobId, status, progress, totalRows, processedRows, errorMessage) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date().toISOString();
    
    let query = 'UPDATE jobs SET status = ?, updated_at = ?';
    const params = [status, currentDate];

    if (progress !== undefined) {
      query += ', progress = ?';
      params.push(progress);
    }

    if (totalRows !== undefined) {
      query += ', total_rows = ?';
      params.push(totalRows);
    }

    if (processedRows !== undefined) {
      query += ', processed_rows = ?';
      params.push(processedRows);
    }

    if (errorMessage !== undefined) {
      query += ', error_message = ?';
      params.push(errorMessage);
    }

    query += ' WHERE id = ?';
    params.push(jobId);

    db.run(query, params, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

/**
 * Update job with detailed validation results
 */
const updateJobWithValidationResults = async (jobId, status, progress, totalRows, processedRows, validationResults) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date().toISOString();
    
    db.run(
      'UPDATE jobs SET status = ?, progress = ?, total_rows = ?, processed_rows = ?, error_message = ?, updated_at = ? WHERE id = ?',
      [status, progress, totalRows, processedRows, JSON.stringify(validationResults), currentDate, jobId],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

/**
 * Get all jobs
 */
const getAllJobs = async () => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM jobs ORDER BY created_at DESC',
      (err, jobs) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(jobs);
      }
    );
  });
};

module.exports = {
  createJob,
  getJobStatus,
  updateJobStatus,
  updateJobWithValidationResults,
  getAllJobs
};
