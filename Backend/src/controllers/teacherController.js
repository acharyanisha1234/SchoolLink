const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Material = require('../models/Material');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

//  SUBJECT CRUD
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ teacherId: req.user.id });
    res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subjects', error: error.message });
  }
};

exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, teacherId: req.user.id });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subject', error: error.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const teacherId = req.user.id;
    const subject = await Subject.create({ title, description, teacherId });
    res.status(201).json({ success: true, message: 'Subject created successfully', data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating subject', error: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const subject = await Subject.findOneAndUpdate(
      { _id: id, teacherId: req.user.id },
      { title, description },
      { new: true, runValidators: true }
    );
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.status(200).json({ success: true, message: 'Subject updated successfully', data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating subject', error: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findOneAndDelete({ _id: id, teacherId: req.user.id });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    // Delete related chapters and materials
    await Chapter.deleteMany({ subjectId: id });
    const chapters = await Chapter.find({ subjectId: id });
    await Material.deleteMany({ chapterId: { $in: chapters.map(c => c._id) } });
    res.status(200).json({ success: true, message: 'Subject and related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting subject', error: error.message });
  }
};