const mongoose = require('mongoose');

// Attendance schema – tracks student attendance for each subject per day
const attendanceSchema = new mongoose.Schema({
  // Reference to the student
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },

  // Reference to the subject for which attendance is being marked
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },

  // Date of the attendance record (defaults to current date)
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },

  // Attendance status – Present, Absent, or Late
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    default: 'Present',
  },

  // Teacher who marked this attendance
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Attendance', attendanceSchema);