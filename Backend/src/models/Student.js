const mongoose = require('mongoose');

const generateStudentId = () => `STU-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true,
    default: generateStudentId,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    default: '',
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Not Specified'],
    default: 'Not Specified',
  },
  phone: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  parentName: {
    type: String,
    default: '',
  },
  parentPhone: {
    type: String,
    default: '',
  },
  parentEmail: {
    type: String,
    default: '',
  },
  admissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

studentSchema.pre('save', async function() {
  if (!this.studentId) {
    let candidate = generateStudentId();
    while (await mongoose.models.Student.exists({ studentId: candidate })) {
      candidate = generateStudentId();
    }
    this.studentId = candidate;
  }
});

// Compound index for unique roll number
studentSchema.index({ rollNumber: 1, className: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);