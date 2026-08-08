const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Material = require('../models/Material');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

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
    res.status(200).json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting subject', error: error.message });
  }
};

//  CHAPTER CRUD

exports.getChapters = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const chapters = await Chapter.find({ subjectId }).sort('order');
    res.status(200).json({ success: true, data: chapters });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching chapters', error: error.message });
  }
};

exports.createChapter = async (req, res) => {
  try {
    const { title, content, order, subjectId } = req.body;
    const teacherId = req.user.id;
    const subject = await Subject.findOne({ _id: subjectId, teacherId });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found or unauthorized' });
    const chapter = await Chapter.create({ title, content, order, subjectId });
    res.status(201).json({ success: true, message: 'Chapter created successfully', data: chapter });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating chapter', error: error.message });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, order } = req.body;
    const chapter = await Chapter.findById(id).populate('subjectId');
    if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' });
    if (chapter.subjectId.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const updated = await Chapter.findByIdAndUpdate(id, { title, content, order }, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Chapter updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating chapter', error: error.message });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.findById(id).populate('subjectId');
    if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' });
    if (chapter.subjectId.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    await Chapter.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Chapter deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting chapter', error: error.message });
  }
};