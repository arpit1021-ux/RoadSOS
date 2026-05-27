const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, bloodGroup, medicalNotes } = req.body;
    const user = new User({ name, phone, email, bloodGroup, medicalNotes });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, email } = req.body;
    const user = await User.findOne({ $or: [{ phone }, { email }] });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
