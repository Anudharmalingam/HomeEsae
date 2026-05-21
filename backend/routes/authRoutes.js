const express = require('express');
const { registerUser, verifyOTP, loginUser } = require('../controllers/authController');
const { requestReset, resetPassword } = require('../controllers/forgotPasswordController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/forgot-password', requestReset);
router.post('/reset-password', resetPassword);

module.exports = router;
