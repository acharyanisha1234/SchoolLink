const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const teacherController = require('../controllers/teacherController');
const { protect } = require('../middleware/auth'); 

// FILE UPLOAD CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ALL ROUTES REQUIRE AUTH
router.use(protect);  

// DASHBOARD
router.get('/dashboard', teacherController.getDashboardStats);

// SUBJECTS
router.get('/subjects', teacherController.getSubjects);
router.get('/subjects/:id', teacherController.getSubject);
router.post('/subjects', teacherController.createSubject);
router.put('/subjects/:id', teacherController.updateSubject);
router.delete('/subjects/:id', teacherController.deleteSubject);

// CHAPTERS 
router.get('/chapters/:subjectId', teacherController.getChapters);
router.post('/chapters', teacherController.createChapter);
router.put('/chapters/:id', teacherController.updateChapter);
router.delete('/chapters/:id', teacherController.deleteChapter);

// MATERIALS (with file upload) 
router.get('/materials/:chapterId', teacherController.getMaterials);
router.post('/materials', upload.single('file'), teacherController.createMaterial);
router.delete('/materials/:id', teacherController.deleteMaterial);

// ASSIGNMENTS 
router.get('/assignments', teacherController.getAssignments);
router.post('/assignments', teacherController.createAssignment);
router.put('/assignments/:id', teacherController.updateAssignment);
router.delete('/assignments/:id', teacherController.deleteAssignment);

// QUIZZES 
router.get('/quizzes', teacherController.getQuizzes);
router.post('/quizzes', teacherController.createQuiz);
router.put('/quizzes/:id', teacherController.updateQuiz);
router.delete('/quizzes/:id', teacherController.deleteQuiz);
router.patch('/quizzes/:id/publish', teacherController.publishQuiz);

// ATTENDANCE 
router.get('/attendance', teacherController.getAttendance);
router.post('/attendance', teacherController.markAttendance);
router.get('/attendance/stats/:subjectId', teacherController.getAttendanceStats);

module.exports = router;