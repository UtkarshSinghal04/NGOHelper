/**
 * Authentication routes
 */

const express = require('express');
const { login, getCurrentUser, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
