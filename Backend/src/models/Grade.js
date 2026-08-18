const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['Assignment', 'Quiz', 'Exam', 'Project', 'Class Test'],
    default: 'Assignment',
  },
  marks: {
    type: Number,
    default: 0,
  },
  totalMarks: {
    type: Number,
    default: 100,
  },
  grade: {
    type: String,
    default: '',
  },
  remarks: {
    type: String,
    default: '',
  },
  published: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);
