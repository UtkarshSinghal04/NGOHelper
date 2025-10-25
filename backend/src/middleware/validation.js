/**
 * Request validation middleware
 */

const { body, validationResult, param, query } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Login validation rules
 */
const validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

/**
 * Report submission validation rules
 */
const validateReportSubmission = [
  body('ngoId')
    .notEmpty()
    .withMessage('NGO ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('NGO ID must be between 1 and 50 characters'),
  body('month')
    .notEmpty()
    .withMessage('Month is required')
    .isIn(['January', 'February', 'March', 'April', 'May', 'June', 
           'July', 'August', 'September', 'October', 'November', 'December'])
    .withMessage('Invalid month'),
  body('peopleHelped')
    .isInt({ min: 0 })
    .withMessage('People helped must be a non-negative integer'),
  body('eventsConducted')
    .isInt({ min: 0 })
    .withMessage('Events conducted must be a non-negative integer'),
  body('fundsUtilized')
    .isFloat({ min: 0 })
    .withMessage('Funds utilized must be a non-negative number'),
  handleValidationErrors
];

/**
 * Dashboard query validation rules
 */
const validateDashboardQuery = [
  query('month')
    .notEmpty()
    .withMessage('Month is required')
    .isIn(['January', 'February', 'March', 'April', 'May', 'June', 
           'July', 'August', 'September', 'October', 'November', 'December'])
    .withMessage('Invalid month'),
  query('year')
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Year must be between 2020 and 2030'),
  handleValidationErrors
];

/**
 * Job ID parameter validation
 */
const validateJobId = [
  param('jobId')
    .isUUID()
    .withMessage('Invalid job ID format'),
  handleValidationErrors
];

/**
 * Contact form submission validation rules
 */
const validateContactSubmission = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('ngoId')
    .optional()
    .isLength({ max: 50 })
    .withMessage('NGO ID must be less than 50 characters')
    .trim(),
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be between 1 and 200 characters')
    .trim(),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters')
    .trim(),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateReportSubmission,
  validateDashboardQuery,
  validateJobId,
  validateContactSubmission
};
