/**
 * Contact service for handling contact form submissions
 */

const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../config/database');

const db = getDatabase();

/**
 * Submit a contact form
 */
const submitContact = async (contactData) => {
  return new Promise((resolve, reject) => {
    const contactId = uuidv4();
    const currentDate = new Date().toISOString();

    db.run(
      `INSERT INTO contacts (id, name, email, ngo_id, subject, message, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        contactId,
        contactData.name,
        contactData.email,
        contactData.ngoId || null,
        contactData.subject,
        contactData.message,
        'new',
        currentDate,
        currentDate
      ],
      function(err) {
        if (err) {
          reject(err);
          return;
        }

        // Return the created contact
        const contact = {
          id: contactId,
          name: contactData.name,
          email: contactData.email,
          ngoId: contactData.ngoId,
          subject: contactData.subject,
          message: contactData.message,
          status: 'new',
          createdAt: currentDate,
          updatedAt: currentDate
        };

        resolve(contact);
      }
    );
  });
};

/**
 * Get all contacts (for admin use)
 */
const getAllContacts = async () => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM contacts ORDER BY created_at DESC',
      (err, contacts) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(contacts);
      }
    );
  });
};

/**
 * Get contacts by status
 */
const getContactsByStatus = async (status) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM contacts WHERE status = ? ORDER BY created_at DESC',
      [status],
      (err, contacts) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(contacts);
      }
    );
  });
};

/**
 * Update contact status
 */
const updateContactStatus = async (contactId, status) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date().toISOString();
    
    db.run(
      'UPDATE contacts SET status = ?, updated_at = ? WHERE id = ?',
      [status, currentDate, contactId],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        if (this.changes === 0) {
          reject(new Error('Contact not found'));
          return;
        }
        
        resolve({ id: contactId, status, updatedAt: currentDate });
      }
    );
  });
};

/**
 * Get contact by ID
 */
const getContactById = async (contactId) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM contacts WHERE id = ?',
      [contactId],
      (err, contact) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(contact);
      }
    );
  });
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactsByStatus,
  updateContactStatus,
  getContactById
};
