const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// Register route
router.post('/register', userController.registerUser);

// Login route
router.post('/authlogin', userController.loginUser);



module.exports = router;
