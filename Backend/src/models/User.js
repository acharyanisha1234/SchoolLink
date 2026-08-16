const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema for storing Admin, Teacher, and Student account information
const userSchema = new mongoose.Schema({
  // Full name of the user
  fullName: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },

  // Unique email address used for login
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },

  // User password (hidden by default when querying)
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },

  // Defines the user's access level in the system
  role: {
    type: String,
    enum: ['ADMIN', 'TEACHER', 'STUDENT'],
    default: 'STUDENT',
  },

  // Profile picture URL
  profilePicture: {
    type: String,
    default: '',
  },

  // Controls whether the user account is active
  isActive: {
    type: Boolean,
    default: true,
  },

  // OTP used for password reset
  resetOTP: {
    type: String,
  },

  // Expiry time for the password reset OTP
  resetOTPExpiry: {
    type: Date,
  },

  // User's date of birth
  birthday: {
    type: String,
  },

  // User's gender
  gender: {
    type: String,
  },
}, {
  // Automatically adds createdAt and updatedAt fields
  timestamps: true,
});


// Pre-save middleware to securely hash the password before saving
userSchema.pre('save', async function() {
  // Only hash the password if it has been changed
  if (!this.isModified('password')) return;

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Method to compare a login password with the stored hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


// Export the User model
module.exports = mongoose.model('User', userSchema);