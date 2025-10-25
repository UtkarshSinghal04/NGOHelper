/**
 * Contact controller for handling contact form requests
 */

const contactService = require('../services/contactService');

/**
 * Submit contact form
 */
const submitContact = async (req, res) => {
  try {
    const { name, email, ngoId, subject, message } = req.body;

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      ngoId: ngoId ? ngoId.trim() : null,
      subject: subject.trim(),
      message: message.trim()
    };

    const contact = await contactService.submitContact(contactData);

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all contacts (admin only)
 */
const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactService.getAllContacts();
    
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get contacts by status (admin only)
 */
const getContactsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const contacts = await contactService.getContactsByStatus(status);
    
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Get contacts by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update contact status (admin only)
 */
const updateContactStatus = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['new', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const result = await contactService.updateContactStatus(contactId, status);
    
    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    if (error.message === 'Contact not found') {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get contact by ID (admin only)
 */
const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await contactService.getContactById(contactId);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactsByStatus,
  updateContactStatus,
  getContactById
};
