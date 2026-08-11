const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');  //  Only this line
const adminTeacherController = require('../controllers/adminTeacherController');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('ADMIN'));

// Teacher Statistics
router.get('/stats', adminTeacherController.getTeacherStats);

// Get all subjects for dropdown
router.get('/subjects', adminTeacherController.getAllSubjectsForDropdown);

// Teacher CRUD Operations
router.post('/', adminTeacherController.createTeacher);
router.get('/', adminTeacherController.getAllTeachers);
router.get('/:id', adminTeacherController.getTeacherById);
router.put('/:id', adminTeacherController.updateTeacher);
router.delete('/:id', adminTeacherController.deleteTeacher);

// Teacher Status
router.put('/:id/toggle-status', adminTeacherController.toggleTeacherStatus);

// Teacher Subject Assignment
router.post('/:id/assign-subject', adminTeacherController.assignSubjectToTeacher);
router.delete('/:teacherId/subjects/:subjectId', adminTeacherController.removeSubjectFromTeacher);

module.exports = router;