/**
 * Report controller
 */

const { submitReport, getMonthlySummary } = require('../services/reportService');

/**
 * Submit a single report
 */
const submitSingleReport = async (req, res) => {
  try {
    const reportData = req.body;
    const report = await submitReport(reportData);
    
    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: report
    });
  } catch (error) {
    console.error('Submit report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report'
    });
  }
};

/**
 * Get dashboard data for a specific month
 */
const getDashboardData = async (req, res) => {
  try {
    const { month, year } = req.query;
    const yearNumber = year ? parseInt(year) : new Date().getFullYear();
    
    if (!month) {
      res.status(400).json({
        success: false,
        message: 'Month parameter is required'
      });
      return;
    }

    const summary = await getMonthlySummary(month, yearNumber);
    
    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: summary
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data'
    });
  }
};

module.exports = {
  submitSingleReport,
  getDashboardData
};
