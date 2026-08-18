const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Submitted', 'Late', 'Pending'],
    default: 'Submitted',
  },
  feedback: {
    type: String,
    default: '',
  },
  feedbackGivenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  marks: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);