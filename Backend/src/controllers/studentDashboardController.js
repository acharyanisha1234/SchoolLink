const mongoose = require('mongoose');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Assignment = require('../models/Assignment');
const Material = require('../models/Material');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');


const getStudentClassAndSubjects = async (studentId) => {
  const student = await Student.findById(studentId).select('className');
  if (!student) throw new Error('Student not found');
  const subjects = await Subject.find({ class: student.className }).select('_id');
  return {
    className: student.className,
    subjectIds: subjects.map(s => s._id),
  };
};

// Dashboard Stats 
exports.getDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subjectIds } = await getStudentClassAndSubjects(studentId);

    const [
      pendingTasks,
      submittedHomework,
      materials,
      upcomingDeadlines,
      quizSummary,
      attendanceAgg
    ] = await Promise.all([
      Assignment.countDocuments({ subjectId: { $in: subjectIds }, deadline: { $gt: new Date() } }),
      Submission.countDocuments({ studentId, status: { $in: ['Submitted', 'Late'] } }),
      Material.countDocuments({ subjectId: { $in: subjectIds } }),
      Assignment.countDocuments({ subjectId: { $in: subjectIds }, deadline: { $gt: new Date() } }),
      Quiz.countDocuments({ subjectId: { $in: subjectIds }, published: true }),
      Attendance.aggregate([
        { $unwind: '$students' },
        { $match: { 'students.studentId': mongoose.Types.ObjectId(studentId) } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            present: { $sum: { $cond: [{ $eq: ['$students.status', 'present'] }, 1, 0] } }
          }
        }
      ])
    ]);

    let attendancePercent = 0;
    if (attendanceAgg.length > 0 && attendanceAgg[0].total > 0) {
      attendancePercent = Math.round((attendanceAgg[0].present / attendanceAgg[0].total) * 100);
    }

    res.json({
      success: true,
      data: {
        pendingTasks,
        submittedHomework,
        learningMaterials: materials,
        upcomingDeadlines,
        attendancePercentage: attendancePercent,
        quizSummary,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Tasks (Assignments) 
exports.getTasks = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subjectIds } = await getStudentClassAndSubjects(studentId);
    const tasks = await Assignment.find({ subjectId: { $in: subjectIds } })
      .populate('subjectId', 'title')
      .sort({ deadline: 1 });
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Deadlines (upcoming tasks)
exports.getDeadlines = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subjectIds } = await getStudentClassAndSubjects(studentId);
    const deadlines = await Assignment.find({
      subjectId: { $in: subjectIds },
      deadline: { $gt: new Date() },
    })
      .populate('subjectId', 'title')
      .sort({ deadline: 1 });
    res.json({ success: true, data: deadlines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Learning Materials
exports.getMaterials = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subjectIds } = await getStudentClassAndSubjects(studentId);
    const materials = await Material.find({ subjectId: { $in: subjectIds } })
      .populate('subjectId', 'title')
      .populate('teacherId', 'fullName')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: materials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Student's own submissions
exports.getSubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const submissions = await Submission.find({ studentId })
      .populate('assignmentId', 'title subjectId')
      .sort({ submittedAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Submit homework 
exports.createSubmission = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { assignmentId, fileUrl } = req.body;

    if (!assignmentId || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing assignmentId or fileUrl',
      });
    }

    // Check if already submitted
    const existing = await Submission.findOne({ studentId, assignmentId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already submitted this assignment',
      });
    }

    const submission = new Submission({ studentId, assignmentId, fileUrl });
    await submission.save();

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- Quizzes (published, for student's class) ----
exports.getQuizzes = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subjectIds } = await getStudentClassAndSubjects(studentId);
    const quizzes = await Quiz.find({
      subjectId: { $in: subjectIds },
      published: true,
    })
      .populate('subjectId', 'title');
    res.json({ success: true, data: quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Attendance (student's own)
exports.getAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const records = await Attendance.aggregate([
      { $unwind: '$students' },
      { $match: { 'students.studentId': mongoose.Types.ObjectId(studentId) } },
      { $project: { date: 1, class: 1, status: '$students.status' } },
      { $sort: { date: -1 } }
    ]);
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Grades / Results (student's own)
exports.getGrades = async (req, res) => {
  try {
    const studentId = req.user.id;
    const grades = await Grade.find({ studentId })
      .populate('subjectId', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: grades });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};