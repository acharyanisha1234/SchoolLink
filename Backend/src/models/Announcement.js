const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByRole: { type: String, enum: ['ADMIN', 'TEACHER', 'STUDENT'], default: 'ADMIN' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isPublished: { type: Boolean, default: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);