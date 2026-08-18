const mongoose = require('mongoose');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Assignment = require('../models/Assignment');
const Material = require('../models/Material');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Announcement = require('../models/Announcement');

const getStudentRecord = async (userId) => {
  const student = await Student.findOne({ userId }).select('_id className fullName email rollNumber section status userId');
  if (!student) throw new Error('Student not found');
  return student;
};

const getStudentClassAndSubjects = async (userId) => {
  const student = await getStudentRecord(userId);
  const subjects = await Subject.find({ class: student.className }).select('_id title');
  return {
    className: student.className,
    subjectIds: subjects.map((s) => s._id),
    student,
  };
};

exports.getProfile = async (req, res) => {
  try {
    const student = await getStudentRecord(req.user.id);
    const populated = await Student.findById(student._id).populate('userId', 'email fullName role profilePicture isActive');

    if (!populated) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isPublished: true })
      .populate('createdBy', 'fullName email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: announcements.length, data: announcements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjectIds, student } = await getStudentClassAndSubjects(userId);
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const [
      pendingTasks,
      submittedHomework,
      materials,
      upcomingDeadlines,
      quizSummary,
      attendanceAgg,
      totalAnnouncements,
      todayTasks
    ] = await Promise.all([
      Assignment.countDocuments({ subjectId: { $in: subjectIds }, deadline: { $gt: new Date() } }),
      Submission.countDocuments({ studentId: student._id, status: { $in: ['Submitted', 'Late'] } }),
      Material.countDocuments({ subjectId: { $in: subjectIds } }),
      Assignment.countDocuments({ subjectId: { $in: subjectIds }, deadline: { $gt: new Date() } }),
      Quiz.countDocuments({ subjectId: { $in: subjectIds }, published: true }),
      Attendance.aggregate([
        { $match: { studentId: new mongoose.Types.ObjectId(student._id) } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
            late: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } },
            absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } }
          }
        }
      ]),
      Announcement.countDocuments({ isPublished: true }),
      Assignment.countDocuments({
        subjectId: { $in: subjectIds },
        deadline: { $gte: startOfToday, $lt: endOfToday },
      })
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
        recentAnnouncements: totalAnnouncements,
        todayTasks,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const student = await getStudentRecord(req.user.id);
    const { subjectIds } = await getStudentClassAndSubjects(req.user.id);
    const tasks = await Assignment.find({ subjectId: { $in: subjectIds } })
      .populate('subjectId', 'title')
      .sort({ deadline: 1 });

    const taskList = await Promise.all(tasks.map(async (task) => {
      const submission = await Submission.findOne({ studentId: student._id, assignmentId: task._id }).sort({ submittedAt: -1 });
      const status = !submission ? (new Date(task.deadline) < new Date() ? 'Late' : 'Pending') : submission.status || 'Submitted';
      return {
        ...task.toObject(),
        status,
        submission,
      };
    }));

    res.json({ success: true, data: taskList });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDeadlines = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjectIds } = await getStudentClassAndSubjects(userId);
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

exports.getMaterials = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjectIds } = await getStudentClassAndSubjects(userId);
    const materials = await Material.find({ subjectId: { $in: subjectIds } })
      .populate('subjectId', 'title')
      .populate('teacherId', 'fullName')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: materials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const student = await getStudentRecord(req.user.id);
    const submissions = await Submission.find({ studentId: student._id })
      .populate({ path: 'assignmentId', populate: { path: 'subjectId', select: 'title' } })
      .sort({ submittedAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSubmission = async (req, res) => {
  try {
    const student = await getStudentRecord(req.user.id);
    const { assignmentId, fileUrl, notes } = req.body;

    if (!assignmentId || !fileUrl) {
      return res.status(400).json({ success: false, message: 'Missing assignmentId or fileUrl' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const existing = await Submission.findOne({ studentId: student._id, assignmentId });
    if (existing) {
      existing.fileUrl = fileUrl;
      existing.notes = notes || existing.notes || '';
      existing.status = new Date(assignment.deadline) < new Date() ? 'Late' : 'Submitted';
      existing.submittedAt = new Date();
      await existing.save();

      return res.status(200).json({ success: true, message: 'Submission updated successfully', data: existing });
    }

    const submission = new Submission({
      studentId: student._id,
      assignmentId,
      fileUrl,
      notes: notes || '',
      status: new Date(assignment.deadline) < new Date() ? 'Late' : 'Submitted',
    });

    await submission.save();

    res.status(201).json({ success: true, message: 'Homework submitted successfully', data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjectIds } = await getStudentClassAndSubjects(userId);
    const quizzes = await Quiz.find({ subjectId: { $in: subjectIds }, published: true })
      .populate('subjectId', 'title')
      .sort({ deadline: 1 });

    res.json({ success: true, data: quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const student = await getStudentRecord(req.user.id);
    const { quizId } = req.params;
    const { answers = {} } = req.body;

    const quiz = await Quiz.findById(quizId).populate('subjectId', 'title');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const correctAnswers = quiz.questions.reduce((acc, question, index) => {
      acc[index] = question.correctAnswer;
      return acc;
    }, {});

    let score = 0;
    const review = quiz.questions.map((question, index) => {
      const selected = Number(answers[index] ?? -1);
      const isCorrect = selected === question.correctAnswer;
      if (isCorrect) score += 1;
      return {
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: selected,
        isCorrect,
      };
    });

    const percent = quiz.questions.length ? Math.round((score / quiz.questions.length) * 100) : 0;

    res.json({
      success: true,
      data: {
        quizId: quiz._id,
        score,
        totalQuestions: quiz.questions.length,
        percentage: percent,
        review,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const student = await getStudentRecord(req.user.id);
    const records = await Attendance.find({ studentId: student._id }).populate('subjectId', 'title').sort({ date: -1 });

    const summary = records.reduce((acc, record) => {
      acc.total += 1;
      if (record.status === 'Present') acc.present += 1;
      if (record.status === 'Absent') acc.absent += 1;
      if (record.status === 'Late') acc.late += 1;
      return acc;
    }, { total: 0, present: 0, absent: 0, late: 0 });

    const attendancePercentage = summary.total ? Math.round((summary.present / summary.total) * 100) : 0;

    res.json({
      success: true,
      data: {
        records,
        summary,
        attendancePercentage,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getGrades = async (req, res) => {
  try {
    const student = await getStudentRecord(req.user.id);
    const grades = await Grade.find({ studentId: student._id, published: true })
      .populate('subjectId', 'title')
      .sort({ createdAt: -1 });

    const total = grades.reduce((sum, item) => sum + (typeof item.marks === 'number' ? item.marks : 0), 0);
    const gpa = grades.length ? (total / grades.length / 25).toFixed(2) : '0.00';

    res.json({
      success: true,
      data: {
        grades,
        gpa,
        totalMarks: total,
        count: grades.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};