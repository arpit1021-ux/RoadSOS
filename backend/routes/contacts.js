const express = require('express');
const router = express.Router();
const EmergencyContact = require('../models/EmergencyContact');
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const contact = new EmergencyContact(req.body);
    await contact.save();
    if (req.body.userId) {
      await User.findByIdAndUpdate(req.body.userId, { $push: { emergencyContacts: contact._id } });
    }
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ userId: req.params.userId });
    res.json(contacts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:contactId', async (req, res) => {
  try {
    await EmergencyContact.findByIdAndDelete(req.params.contactId);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
