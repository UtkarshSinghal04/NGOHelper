/**
 * Authentication service
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../config/database');

const db = getDatabase();

/**
 * Create default admin user if it doesn't exist
 */
const createDefaultAdmin = async () => {
  return new Promise((resolve, reject) => {
    // Check if admin user exists
    db.get('SELECT id FROM users WHERE username = ?', ['admin'], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row) {
        console.log('Admin user already exists');
        resolve();
        return;
      }

      // Create admin user
      const adminId = uuidv4();
      const hashedPassword = bcrypt.hashSync('#utkarsh*123', 10);

      db.run(
        'INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
        [adminId, 'admin', hashedPassword, 'admin'],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          console.log('Default admin user created');
          resolve();
        }
      );
    });
  });
};

/**
 * Authenticate user login
 */
const authenticateUser = async (credentials) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [credentials.username],
      (err, user) => {
        if (err) {
          reject(err);
          return;
        }

        if (!user) {
          resolve({
            success: false,
            message: 'Invalid username or password'
          });
          return;
        }

        // Verify password
        const isValidPassword = bcrypt.compareSync(credentials.password, user.password);
        if (!isValidPassword) {
          resolve({
            success: false,
            message: 'Invalid username or password'
          });
          return;
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
        const token = jwt.sign(
          { 
            id: user.id, 
            username: user.username, 
            role: user.role 
          },
          jwtSecret,
          { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        resolve({
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: user.id,
              username: user.username,
              role: user.role
            }
          }
        });
      }
    );
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  createDefaultAdmin,
  authenticateUser,
  verifyToken
};
