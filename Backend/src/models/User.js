const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'teacher', 'student'],
    default: 'student',
  },
  profilePicture: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  resetOTP: {
    type: String,
  },
  resetOTPExpiry: {
    type: Date,
  },
  birthday: {
    type: String,
  },
  gender: {
    type: String,
  },
}, {
  timestamps: true,
});

// Pre-save middleware - async/await version (without next)
userSchema.pre('save', async function() {
  // Only hash if password is modified
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);