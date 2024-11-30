const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Add attendance
exports.addAttendance = async (req, res) => {
  const { username } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check for existing attendance for the current date
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    let attendance = await Attendance.findOne({
      user: user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!attendance) {
      // Create a new attendance record if none exists for today
      attendance = new Attendance({
        user: user._id,
        attended: true,
      });
    } else {
      // Update existing attendance record
      attendance.attended = true;
    }

    await attendance.save();

    res.json({ success: true, message: 'Attendance recorded', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error recording attendance');
  }
};
