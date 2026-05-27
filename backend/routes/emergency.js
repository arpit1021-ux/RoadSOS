const express = require('express');
const router = express.Router();
const EmergencyLog = require('../models/EmergencyLog');

router.post('/sos', async (req, res) => {
  try {
    const { location, userId } = req.body;
    const log = new EmergencyLog({ location, userId });
    await log.save();
    res.json({ 
      message: 'SOS triggered successfully',
      logId: log._id,
      services: getDummyServices()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/log', async (req, res) => {
  try {
    const log = new EmergencyLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function getDummyServices() {
  return {
    hospitals: [
      { id: 'h1', name: 'City General Hospital', distance: '2.3 km', eta: '5 mins', phone: '911' },
      { id: 'h2', name: 'Trauma Center', distance: '3.1 km', eta: '7 mins', phone: '911' }
    ],
    ambulances: [
      { id: 'a1', name: 'Ambulance #1', distance: '1.5 km', eta: '4 mins', phone: '911' },
      { id: 'a2', name: 'Ambulance #2', distance: '2.8 km', eta: '6 mins', phone: '911' }
    ],
    police: [
      { id: 'p1', name: 'Police Station Downtown', distance: '1.2 km', eta: '3 mins', phone: '911' }
    ]
  };
}

module.exports = router;
