// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  username: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Make sure this is required
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
