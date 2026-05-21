const User = require('../models/User');
const Worker = require('../models/Worker');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

const sendOTP = async (email, otp) => {
  // Setup Nodemailer (Assuming Mailtrap or similar for dev)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Ease Home" <noreply@easehome.com>',
    to: email,
    subject: 'Your OTP for Ease Home',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, workerDetails } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'user',
      otp,
      otpExpires,
      isVerified: false
    });

    if (role === 'worker' && workerDetails) {
      await Worker.create({
        userId: user._id,
        category: workerDetails.category,
        experience: workerDetails.experience,
        pricing: workerDetails.pricing,
      });
    }

    // Try sending OTP, catch error if SMTP not configured properly
    try {
      await sendOTP(email, otp);
    } catch (emailError) {
      console.log('Error sending email:', emailError);
      // For development, we might just return the OTP in response if email fails
      // return res.status(201).json({ message: 'User registered, but email failed. Dev OTP:', otp });
    }

    res.status(201).json({
      message: 'User registered. Please verify OTP sent to email.',
      userId: user._id,
      // For testing, sending back OTP
      devOtp: otp
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
