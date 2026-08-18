const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/email');

const normalizeRole = (role = '') => String(role).trim().toUpperCase();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: normalizeRole(user.role) },
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
      role: 'STUDENT',
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: normalizeRole(user.role),
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
    const normalizedRole = normalizeRole(user.role);

    console.log('Login successful for:', user.email);
    res.json({
      message: 'Login successful.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: normalizedRole,
      },
      accessToken: token,
    });
  } catch (error) {
    console.error('Login error (catch):', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// ============ SEND RESET OTP (with email) ============
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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email with OTP
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 10px;">
        <h2 style="color: #2563eb;">SchoolLink Password Reset</h2>
        <p>You requested to reset your password. Use the 6-digit code below:</p>
        <div style="background: white; padding: 15px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; border-radius: 8px; border: 1px solid #ddd;">
          ${otp}
        </div>
        <p style="margin-top: 20px; color: #666;">This code expires in 10 minutes.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    const emailSent = await sendEmail(email, 'SchoolLink Password Reset OTP', html);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email.' });
    }

    console.log(`OTP for ${email}: ${otp}`); // keep for debugging
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error sending OTP.' });
  }
};

// ============ RESET PASSWORD WITH OTP ============
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

    // Verify OTP
    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (Date.now() > user.resetOTPExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP fields
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error resetting password.' });
  }
};