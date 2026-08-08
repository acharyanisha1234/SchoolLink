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

//  MATERIAL CRUD
exports.getMaterials = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const materials = await Material.find({ chapterId });
    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching materials', error: error.message });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    const { title, description, type, chapterId } = req.body;
    const teacherId = req.user.id;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const chapter = await Chapter.findById(chapterId).populate('subjectId');
    if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' });
    if (chapter.subjectId.teacherId.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const material = await Material.create({ title, description, fileUrl, type, chapterId, teacherId });
    res.status(201).json({ success: true, message: 'Material uploaded successfully', data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading material', error: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findOneAndDelete({ _id: id, teacherId: req.user.id });
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.status(200).json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting material', error: error.message });
  }
};


//  ASSIGNMENT CRUD
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacherId: req.user.id }).populate('chapterId', 'title');
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assignments', error: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, type, deadline, chapterId, referenceFiles } = req.body;
    const teacherId = req.user.id;
    const chapter = await Chapter.findById(chapterId).populate('subjectId');
    if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' });
    if (chapter.subjectId.teacherId.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const assignment = await Assignment.create({
      title, description, type: type || 'Assignment', deadline,
      referenceFiles: referenceFiles || [], chapterId, teacherId
    });
    res.status(201).json({ success: true, message: 'Assignment created successfully', data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating assignment', error: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, deadline, referenceFiles } = req.body;
    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, teacherId: req.user.id },
      { title, description, type, deadline, referenceFiles },
      { new: true, runValidators: true }
    );
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    res.status(200).json({ success: true, message: 'Assignment updated successfully', data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating assignment', error: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findOneAndDelete({ _id: id, teacherId: req.user.id });
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    res.status(200).json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting assignment', error: error.message });
  }
};