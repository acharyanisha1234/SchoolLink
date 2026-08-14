const mongoose = require('mongoose');

// Material schema for storing learning materials uploaded by teachers
const materialSchema = new mongoose.Schema({
  // Title of the learning material
  title: { type: String, required: true, trim: true },

  // Optional description of the material
  description: { type: String, default: '' },

  // URL/path of the uploaded file or resource
  fileUrl: { type: String, required: true },

  // Type of learning material
  type: {
    type: String,
    enum: ['PDF', 'PPT', 'Image', 'Video', 'Document', 'Note', 'Other'],
    default: 'PDF'
  },

  // Chapter where this material belongs
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },

  // Teacher who uploaded the material
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

// Export Material model
module.exports = mongoose.model('Material', materialSchema);