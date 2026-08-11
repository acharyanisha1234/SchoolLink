const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user (role defaults to STUDENT)
router.post('/register', authController.register);

// Login – returns JWT token and user data
router.post('/login', authController.login);

// Request password reset OTP (OTP is logged to console)
router.post('/send-reset-otp', authController.sendResetOTP);

// Reset password using OTP and new password
router.post('/reset-password', authController.resetPassword);

module.exports = router;