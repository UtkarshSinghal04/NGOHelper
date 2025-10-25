/**
 * Express application setup
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const uploadRoutes = require('./routes/upload');
const contactRoutes = require('./routes/contacts');

const app = express();

// Security middleware
app.use(helmet());


// --- UPDATED CORS CONFIGURATION ---
// List of allowed domains
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:3000', // Your local React
  'https://ngo-helper-three.vercel.app'          // Your Vercel frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or if the origin is in our allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('This request is blocked by CORS policy'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));
// --- END OF UPDATE ---

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NGO Helper API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/reports', uploadRoutes);
app.use('/api/contacts', contactRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large. Maximum size is 10MB.'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;