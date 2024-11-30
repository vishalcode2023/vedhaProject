const User = require('../models/User');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcrypt');


// Register user
exports.registerUser = async (req, res) => {
  const { username, faceDescriptor, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).send('All fields are required!');
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const user = new User({ 
      username, 
      faceDescriptor, 
      email, 
      password: hashedPassword  // Save the hashed password
    });

    await user.save();
    res.redirect('/authlogin');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error registering user');
  }
};



// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid credentials');
    }

    // Log attendance and associate with the user
    const attendance = new Attendance({
      username: user.username,  // Assuming 'username' is stored on the User model
      user: user._id,  // Make sure to provide the user ID here
    });

    // Save the attendance
    await attendance.save();

    // Redirect to profile on successful login
    return res.redirect('/profile');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error logging in');
  }
};


