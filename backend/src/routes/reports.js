/**
 * Report routes
 */

const express = require('express');
const { submitSingleReport, getDashboardData } = require('../controllers/reportController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateReportSubmission, validateDashboardQuery } = require('../middleware/validation');

const router = express.Router();

// Public route for report submission
router.post('/', validateReportSubmission, submitSingleReport);

// Admin routes
router.get('/dashboard', authenticateToken, requireAdmin, validateDashboardQuery, getDashboardData);

module.exports = router;
