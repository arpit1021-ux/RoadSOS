const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'] },
  medicalNotes: String,
  emergencyContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EmergencyContact' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
