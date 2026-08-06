const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  parentName: {
    type: String
  },
  parentContact: {
    type: String
  },
  address: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate student ID before saving
studentSchema.pre('save', function(next) {
  if (!this.studentId) {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.studentId = `STU${year}${random}`;
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Student', studentSchema);