const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
// For email - using nodemailer (optional). If not configured, we'll just log the URL.
const nodemailer = require('nodemailer');

// Helper to send email (fallback to console if SMTP not configured)
const sendResetEmail = async (email, token) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: '"Ease Home" <noreply@easehome.com>',
      to: email,
      subject: 'Password Reset for Ease Home',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 10 minutes.</p>`,
    });
  } else {
    console.log('Password reset URL (no email config):', resetUrl);
  }
};

// 1. Request password reset – generate token, store, email/link
exports.requestReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal whether email exists – always return success message
      return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
    }
    const token = crypto.randomBytes(3).toString('hex'); // 6‑char token (12 hex chars)
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await PasswordResetToken.create({ userId: user._id, token, expiresAt });
    await sendResetEmail(email, token);
    return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password request error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 2. Reset password using token
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const record = await PasswordResetToken.findOne({ token });
    if (!record || record.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(record.userId, { password: hashed });
    // Clean up token(s) for this user
    await PasswordResetToken.deleteMany({ userId: record.userId });
    return res.json({ message: 'Password reset successful. You may now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
