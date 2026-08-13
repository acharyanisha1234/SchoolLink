const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Teacher assigned to subject
  },
  // Admin fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdByRole: {
    type: String,
    enum: ['admin', 'teacher'],
    default: 'teacher'
  },
  code: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // Allows null values for backward compatibility
  },
  class: {
    type: Number,
    min: 1,
    max: 12
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);