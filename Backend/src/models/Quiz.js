const mongoose = require('mongoose');

// Quiz schema – stores quizzes created by teachers for a specific chapter
const quizSchema = new mongoose.Schema({
  // Title of the quiz (e.g., "Algebra Basics Quiz")
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // Optional description or instructions for the quiz
  description: String,

  // Time limit for the quiz in minutes (default 30)
  timeLimit: {
    type: Number,
    default: 30,
  },

  // Deadline by which students must submit the quiz
  deadline: {
    type: Date,
    required: true,
  },

  // Array of questions for the quiz
  questions: [{
    question: { type: String, required: true },          // The question text
    options: [{ type: String, required: true }],         // Array of answer choices
    correctAnswer: { type: Number, required: true },     // Index (0‑based) of the correct option
  }],

  // Reference to the chapter this quiz belongs to
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true,
  },

  // Teacher who created this quiz
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Whether the quiz is published (visible to students)
  published: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Quiz', quizSchema);