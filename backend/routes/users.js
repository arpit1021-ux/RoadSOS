const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('emergencyContacts');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
