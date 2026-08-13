const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

// ---- Protect all teacher routes ----
router.use(protect);               // verify token & attach user
router.use(authorize('teacher'));  // ensure role === 'teacher'

// ---- Your existing routes (unchanged) ----
router.get('/subjects', teacherController.getSubjects);
router.get('/subjects/:id', teacherController.getSubject);
router.post('/subjects', teacherController.createSubject);
router.put('/subjects/:id', teacherController.updateSubject);
router.delete('/subjects/:id', teacherController.deleteSubject);

router.get('/chapters/:subjectId', teacherController.getChapters);
router.post('/chapters', teacherController.createChapter);
router.put('/chapters/:id', teacherController.updateChapter);
router.delete('/chapters/:id', teacherController.deleteChapter);

router.get('/materials/:chapterId', teacherController.getMaterials);
router.post('/materials', teacherController.createMaterial);
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

router.get('/dashboard', teacherController.getDashboardStats);

module.exports = router;