const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const studentDashboard = require('../controllers/studentDashboardController');

// All routes require authentication and student role
router.use(auth);
router.use((req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ success: false, message: 'Access denied. Student only.' });
  }
  next();
});

// Dashboard
router.get('/dashboard', studentDashboard.getDashboardStats);

// Tasks & Deadlines
router.get('/tasks', studentDashboard.getTasks);
router.get('/deadlines', studentDashboard.getDeadlines);

// Materials
router.get('/materials', studentDashboard.getMaterials);

// Submissions
router.get('/submissions', studentDashboard.getSubmissions);
router.post('/submissions', studentDashboard.createSubmission);

// Quizzes
router.get('/quizzes', studentDashboard.getQuizzes);

// Attendance
router.get('/attendance', studentDashboard.getAttendance);

// Grades
router.get('/grades', studentDashboard.getGrades);

module.exports = router;