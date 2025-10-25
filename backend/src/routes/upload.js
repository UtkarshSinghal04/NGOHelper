/**
 * Upload routes
 */

const express = require('express');
const multer = require('multer');
const { uploadCSV, getJobStatusById } = require('../controllers/uploadController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateJobId } = require('../middleware/validation');

const router = express.Router();

// Configure multer for CSV file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Public route for CSV upload
router.post('/upload', upload.single('csvFile'), uploadCSV);

// Public route for job status (needed for frontend progress tracking)
router.get('/job-status/:jobId', validateJobId, getJobStatusById);

// Admin route for all jobs (optional)
router.get('/jobs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { getAllJobs } = require('../services/jobService');
    const jobs = await getAllJobs();
    res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully',
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve jobs'
    });
  }
});

module.exports = router;
