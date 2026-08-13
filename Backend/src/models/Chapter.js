const mongoose = require('mongoose');

// Chapter schema – represents a chapter/unit within a subject
const chapterSchema = new mongoose.Schema({
  // Title of the chapter (e.g., "Introduction to Algebra")
  title: {
    type: String,
    required: true,
    trim: true,  // Removes leading/trailing whitespace
  },

  // Main content/description of the chapter (optional)
  content: {
    type: String,
    default: '',
  },

  // Order/index to sort chapters within a subject
  order: {
    type: Number,
    default: 0,
  },

  // Reference to the subject this chapter belongs to
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },

}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Chapter', chapterSchema);