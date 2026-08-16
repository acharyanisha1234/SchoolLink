const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

// Protect all teacher routes
router.use(protect);
router.use(authorize('TEACHER'));

// Teacher-only subject access: Admin assigns subjects to teachers.
router.get('/subjects', teacherController.getSubjects);
router.get('/subjects/:id', teacherController.getSubject);
router.get('/students', teacherController.getStudentsForSubject);

router.get('/materials/:subjectId', teacherController.getMaterials);
router.post('/materials', (req, res, next) => {
  req.upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: 'File upload error: ' + err.message });
    }
    next();
  });
}, teacherController.createMaterial);
router.delete('/materials/:id', teacherController.deleteMaterial);

router.get('/assignments', teacherController.getAssignments);
router.post('/assignments', teacherController.createAssignment);
router.put('/assignments/:id', teacherController.updateAssignment);
router.delete('/assignments/:id', teacherController.deleteAssignment);

router.get('/attendance', teacherController.getAttendance);
router.post('/attendance', teacherController.markAttendance);
router.get('/attendance/stats/:subjectId', teacherController.getAttendanceStats);

router.get('/quizzes', teacherController.getQuizzes);
router.post('/quizzes', teacherController.createQuiz);
router.put('/quizzes/:id', teacherController.updateQuiz);
router.delete('/quizzes/:id', teacherController.deleteQuiz);
router.put('/quizzes/:id/publish', teacherController.publishQuiz);

// ---- Announcement routes ----
router.get('/announcements', teacherController.getAnnouncements);
router.post('/announcements', teacherController.createAnnouncement);
router.put('/announcements/:id', teacherController.updateAnnouncement);
router.delete('/announcements/:id', teacherController.deleteAnnouncement);

router.get('/dashboard', teacherController.getDashboardStats);

module.exports = router;