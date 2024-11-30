const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: {
    type: String,
    required: true,
    min:10
  },
  faceDescriptor: { type: [Number], required: true },
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
