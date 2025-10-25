/**
 * Main server file
 */

const app = require('./app');
const { initializeDatabase, closeDatabase } = require('./config/database');
const { createDefaultAdmin } = require('./services/authService');

// --- CHANGE 1: Parse the PORT to ensure it's an integer ---
const PORT = parseInt(process.env.PORT || 3001);

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Create default admin user
    await createDefaultAdmin();
    console.log('Default admin user created');

    // Start server
    // --- CHANGE 2: Bind to '0.0.0.0' for containerized hosting ---
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 NGO Helper API server is running on port ${PORT}`);

      // Note: These localhost links will only work on your local machine.
      // In production, you'll use your public Railway URL.
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Admin login: http://localhost:${PORT}/api/auth/login`);
      console.log(`📝 Report submission: http://localhost:${PORT}/api/report`);
      console.log(`📤 CSV upload: http://localhost:${PORT}/api/reports/upload`);
      console.log(`📈 Dashboard: http://localhost:${PORT}/api/report/dashboard`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await closeDatabase();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();