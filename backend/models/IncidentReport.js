const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: ['major_collision', 'vehicle_breakdown', 'fire', 'hit_and_run', 'road_blockage'],
    required: true 
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  address: String,
  description: String,
  status: { type: String, enum: ['reported', 'dispatched', 'resolved'], default: 'reported' },
  reportedBy: { type: String, enum: ['victim', 'witness'], required: true }
}, { timestamps: true });

incidentReportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('IncidentReport', incidentReportSchema);
