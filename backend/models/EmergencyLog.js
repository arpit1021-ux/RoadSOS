const mongoose = require('mongoose');

const emergencyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  servicesNotified: [{
    serviceType: String,
    serviceId: String,
    timestamp: Date
  }],
  incidentReport: { type: mongoose.Schema.Types.ObjectId, ref: 'IncidentReport' }
}, { timestamps: true });

emergencyLogSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyLog', emergencyLogSchema);
