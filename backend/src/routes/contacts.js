/**
 * Contact routes for handling contact form requests
 */

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middleware/auth');
const { validateContactSubmission } = require('../middleware/validation');

// Public route - submit contact form
router.post('/', validateContactSubmission, contactController.submitContact);

// Admin routes - require authentication
router.get('/', authenticateToken, contactController.getAllContacts);
router.get('/status/:status', authenticateToken, contactController.getContactsByStatus);
router.get('/:contactId', authenticateToken, contactController.getContactById);
router.put('/:contactId/status', authenticateToken, contactController.updateContactStatus);

module.exports = router;
