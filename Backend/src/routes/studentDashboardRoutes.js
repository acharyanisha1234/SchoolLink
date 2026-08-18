const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const studentDashboard = require('../controllers/studentDashboardController');

router.use(protect);
router.use(authorize('STUDENT'));

router.get('/profile', studentDashboard.getProfile);
router.get('/dashboard', studentDashboard.getDashboardStats);
router.get('/announcements', studentDashboard.getAnnouncements);

router.get('/tasks', studentDashboard.getTasks);
router.get('/deadlines', studentDashboard.getDeadlines);

router.get('/materials', studentDashboard.getMaterials);

router.get('/submissions', studentDashboard.getSubmissions);
router.post('/submissions/upload', (req, res) => {
  if (!req.upload) {
    return res.status(400).json({ success: false, message: 'File upload not configured' });
  }

  req.upload(req, res, async () => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload' });
    }

    return res.status(200).json({
      success: true,
      data: {
        fileUrl: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
      },
    });
  });
});
router.post('/submissions', studentDashboard.createSubmission);

router.get('/quizzes', studentDashboard.getQuizzes);
router.post('/quizzes/:quizId/submit', studentDashboard.submitQuiz);

router.get('/attendance', studentDashboard.getAttendance);

router.get('/grades', studentDashboard.getGrades);

module.exports = router;