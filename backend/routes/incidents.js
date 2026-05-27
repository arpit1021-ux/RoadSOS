const express = require('express');
const router = express.Router();
const IncidentReport = require('../models/IncidentReport');

router.post('/', async (req, res) => {
  try {
    const { type, location, address, description, reportedBy, userId } = req.body;
    const incident = new IncidentReport({ type, location, address, description, reportedBy, userId });
    await incident.save();
    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const incidents = await IncidentReport.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query;
    const incidents = await IncidentReport.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    res.json(incidents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
