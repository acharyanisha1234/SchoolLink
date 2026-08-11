const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin access
router.use(protect);
router.use(authorize('ADMIN'));

router.route('/')
  .get(studentController.getAllStudents)
  .post(studentController.createStudent);   

router.route('/:id')
  .get(studentController.getStudent)
  .put(studentController.updateStudent)
  .delete(studentController.deleteStudent);

module.exports = router;