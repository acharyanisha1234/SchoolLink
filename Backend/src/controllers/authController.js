const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, birthday, gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const user = new User({
      fullName,
      email,
      password,
      birthday: birthday || '',
      gender: gender || '',
      role: 'student',   // <-- FIXED: lowercase to match enum ['ADMIN','teacher','student']
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken: token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('\n📨 Login request body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Email or password missing!');
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    console.log('User found:', user.email);
    console.log('Stored hash:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match?', isMatch);

    if (!isMatch) {
      console.log('Password does NOT match');
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);

    console.log('Login successful for:', user.email);
    res.json({
      message: 'Login successful.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken: token,
    });
  } catch (error) {
    console.error('Login error (catch):', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

exports.sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log(`OTP for ${email}: ${otp}`);
    res.json({ message: 'OTP sent. Check server console for the OTP.' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error sending OTP.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (Date.now() > user.resetOTPExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    user.password = newPassword;
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error resetting password.' });
  }
};