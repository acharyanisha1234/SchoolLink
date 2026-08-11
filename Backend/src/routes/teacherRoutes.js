const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const teacherController = require('../controllers/teacherController');
const { protect } = require('../middleware/auth');   //  JWT authentication middleware

// 1. FILE UPLOAD CONFIGURATION (for materials)
// Configure where and how uploaded files are stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // All files go into the 'uploads/' folder
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: timestamp + random number + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer middleware with 10MB file size limit
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});


// 2. GLOBAL MIDDLEWARE – protect all routes below

// Every route in this file requires a valid JWT (logged‑in user)
router.use(protect);

// 3. TEACHER DASHBOARD

// GET /dashboard – fetch teacher's stats (e.g., number of subjects, students, etc.)
router.get('/dashboard', teacherController.getDashboardStats);

// 4. SUBJECT MANAGEMENT

router.get('/subjects', teacherController.getSubjects);          // Get all subjects
router.get('/subjects/:id', teacherController.getSubject);       // Get one subject by ID
router.post('/subjects', teacherController.createSubject);       // Create a new subject
router.put('/subjects/:id', teacherController.updateSubject);    // Update an existing subject
router.delete('/subjects/:id', teacherController.deleteSubject); // Delete a subject

// 5. CHAPTER MANAGEMENT (each chapter belongs to a subject)
router.get('/chapters/:subjectId', teacherController.getChapters);   // Get all chapters of a subject
router.post('/chapters', teacherController.createChapter);           // Create a new chapter
router.put('/chapters/:id', teacherController.updateChapter);        // Update a chapter
router.delete('/chapters/:id', teacherController.deleteChapter);     // Delete a chapter

// 6. LEARNING MATERIALS (files – with upload)
// GET materials for a specific chapter
router.get('/materials/:chapterId', teacherController.getMaterials);

// POST – upload a file (single) and create a material entry
router.post('/materials', upload.single('file'), teacherController.createMaterial);

// DELETE a material by ID
router.delete('/materials/:id', teacherController.deleteMaterial);


// 7. ASSIGNMENTS
router.get('/assignments', teacherController.getAssignments);       // Get all assignments
router.post('/assignments', teacherController.createAssignment);    // Create a new assignment
router.put('/assignments/:id', teacherController.updateAssignment); // Update an assignment
router.delete('/assignments/:id', teacherController.deleteAssignment); // Delete an assignment

// 8. QUIZZES
router.get('/quizzes', teacherController.getQuizzes);              // Get all quizzes
router.post('/quizzes', teacherController.createQuiz);             // Create a new quiz
router.put('/quizzes/:id', teacherController.updateQuiz);          // Update a quiz
router.delete('/quizzes/:id', teacherController.deleteQuiz);       // Delete a quiz
router.patch('/quizzes/:id/publish', teacherController.publishQuiz); // Publish (make active) a quiz


// 9. ATTENDANCE
router.get('/attendance', teacherController.getAttendance);                // Get all attendance records
router.post('/attendance', teacherController.markAttendance);              // Mark attendance for a student
router.get('/attendance/stats/:subjectId', teacherController.getAttendanceStats); // Stats per subject

// 10. EXPORT THE ROUTER
module.exports = router;