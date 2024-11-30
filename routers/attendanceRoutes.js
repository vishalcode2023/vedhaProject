const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Record attendance
router.post('/attendance', attendanceController.addAttendance);

module.exports = router;
