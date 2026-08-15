const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Material = require('../models/Material');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const Attendance = require('../models/Attendance');
const Announcement = require('../models/Announcement');
const User = require('../models/User');

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ teacherId: req.user._id });
    res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subjects', error: error.message });
  }
};

exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, teacherId: req.user._id });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subject', error: error.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const teacherId = req.user._id;
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
      { _id: id, teacherId: req.user._id },
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
    const subject = await Subject.findOneAndDelete({ _id: id, teacherId: req.user._id });
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
    const teacherId = req.user._id;
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
    if (chapter.subjectId.teacherId.toString() !== req.user._id.toString()) {
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
    if (chapter.subjectId.teacherId.toString() !== req.user._id.toString()) {
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
    const teacherId = req.user._id;
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
    const material = await Material.findOneAndDelete({ _id: id, teacherId: req.user._id });
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.status(200).json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting material', error: error.message });
  }
};


//  ASSIGNMENT CRUD
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacherId: req.user._id }).populate('chapterId', 'title');
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assignments', error: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, type, deadline, chapterId, referenceFiles } = req.body;
    const teacherId = req.user._id;
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
      { _id: id, teacherId: req.user._id },
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
    const assignment = await Assignment.findOneAndDelete({ _id: id, teacherId: req.user._id });
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    res.status(200).json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting assignment', error: error.message });
  }
};

//  ATTENDANCE CRUD
exports.getAttendance = async (req, res) => {
  try {
    const { subjectId, date } = req.query;
    const query = { teacherId: req.user._id };
    if (subjectId) query.subjectId = subjectId;
    if (date) query.date = new Date(date);
    const attendance = await Attendance.find(query)
      .populate('studentId', 'fullName email')
      .populate('subjectId', 'title');
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching attendance', error: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, status, date } = req.body;
    const teacherId = req.user._id;
    const subject = await Subject.findOne({ _id: subjectId, teacherId });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found or unauthorized' });

    const attendanceDate = date ? new Date(date) : new Date();
    const start = new Date(attendanceDate);
    start.setHours(0,0,0,0);
    const end = new Date(attendanceDate);
    end.setHours(23,59,59,999);

    const existing = await Attendance.findOne({ studentId, subjectId, date: { $gte: start, $lt: end } });
    if (existing) {
      existing.status = status || 'Present';
      await existing.save();
      return res.status(200).json({ success: true, message: 'Attendance updated', data: existing });
    }
    const attendance = await Attendance.create({ studentId, subjectId, date: attendanceDate, status: status || 'Present', teacherId });
    res.status(201).json({ success: true, message: 'Attendance marked', data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking attendance', error: error.message });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const present = await Attendance.countDocuments({ subjectId, status: 'Present' });
    const absent = await Attendance.countDocuments({ subjectId, status: 'Absent' });
    const late = await Attendance.countDocuments({ subjectId, status: 'Late' });
    const total = present + absent + late;
    res.status(200).json({
      success: true,
      data: {
        total,
        present,
        absent,
        late,
        presentPercentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching attendance stats', error: error.message });
  }
};

//  DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const totalSubjects = await Subject.countDocuments({ teacherId });
    const totalAssignments = await Assignment.countDocuments({ teacherId });
    const totalQuizzes = await Quiz.countDocuments({ teacherId });
    const totalMaterials = await Material.countDocuments({ teacherId });
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });

    const recentAssignments = await Assignment.find({ teacherId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('chapterId', 'title');

    const recentQuizzes = await Quiz.find({ teacherId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('chapterId', 'title');

    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayAttendance = await Attendance.find({ teacherId, date: { $gte: today, $lt: tomorrow } });
    const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
    const totalToday = todayAttendance.length;

    res.status(200).json({
      success: true,
      data: {
        totalSubjects,
        totalAssignments,
        totalQuizzes,
        totalMaterials,
        totalStudents,
        attendanceToday: totalToday > 0 ? ((presentToday / totalToday) * 100).toFixed(2) : 0,
        recentAssignments,
        recentQuizzes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching dashboard stats', error: error.message });
  }
};
//  QUIZ CRUD 
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacherId: req.user._id }).populate('chapterId', 'title');
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching quizzes', error: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, timeLimit, deadline, questions, chapterId } = req.body;
    const teacherId = req.user._id;
    const chapter = await Chapter.findById(chapterId).populate('subjectId');
    if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' });
    if (chapter.subjectId.teacherId.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const quiz = await Quiz.create({
      title, description, timeLimit: timeLimit || 30, deadline,
      questions, chapterId, teacherId, published: false
    });
    res.status(201).json({ success: true, message: 'Quiz created', data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating quiz', error: error.message });
  }
};

exports.publishQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findOneAndUpdate(
      { _id: id, teacherId: req.user._id },
      { published: true },
      { new: true }
    );
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.status(200).json({ success: true, message: 'Quiz published', data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error publishing quiz', error: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, timeLimit, deadline, questions } = req.body;
    const quiz = await Quiz.findOneAndUpdate(
      { _id: id, teacherId: req.user._id },
      { title, description, timeLimit, deadline, questions },
      { new: true, runValidators: true }
    );
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.status(200).json({ success: true, message: 'Quiz updated', data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating quiz', error: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findOneAndDelete({ _id: id, teacherId: req.user._id });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.status(200).json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting quiz', error: error.message });
  }
};

//  ANNOUNCEMENT CRUD
exports.getAnnouncements = async (req, res) => {
  try {
    const { subjectId } = req.query;
    const query = { teacherId: req.user._id };
    if (subjectId) query.subjectId = subjectId;
    const announcements = await Announcement.find(query)
      .populate('subjectId', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching announcements', error: error.message });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, subjectId, priority, published } = req.body;
    const teacherId = req.user._id;
    
    const subject = await Subject.findOne({ _id: subjectId, teacherId });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found or unauthorized' });
    
    const announcement = await Announcement.create({
      title,
      content,
      subjectId,
      teacherId,
      priority: priority || 'Medium',
      published: published !== undefined ? published : true,
    });
    
    res.status(201).json({ success: true, message: 'Announcement created successfully', data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating announcement', error: error.message });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, priority, published } = req.body;
    
    const announcement = await Announcement.findOneAndUpdate(
      { _id: id, teacherId: req.user._id },
      { title, content, priority, published },
      { new: true, runValidators: true }
    );
    
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, message: 'Announcement updated successfully', data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating announcement', error: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findOneAndDelete({ _id: id, teacherId: req.user._id });
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting announcement', error: error.message });
  }
};