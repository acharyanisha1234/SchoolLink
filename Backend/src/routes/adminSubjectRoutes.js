const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Subject = require('../models/Subject');
const User = require('../models/User');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('ADMIN'));

// ============================================
// GET ALL SUBJECTS
// ============================================
router.get('/', async (req, res) => {
  try {
     console.log('Admin user:', req.user); // Debug log

    const subjects = await Subject.find()
      .populate('teacherId', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: subjects,
      count: subjects.length
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects'
    });
  }
});



// ============================================
// GET SINGLE SUBJECT
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('teacherId', 'name email')
      .populate('createdBy', 'name email');
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    res.json({
      success: true,
      data: subject
    });
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subject'
    });
  }
});

// ============================================
// CREATE SUBJECT
// ============================================
router.post('/', async (req, res) => {
  try {
    const { title, description, teacherId, code, class: className, status } = req.body;
    
    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Subject title is required'
      });
    }
    
    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Teacher assignment is required'
      });
    }
    
    if (!className) {
      return res.status(400).json({
        success: false,
        message: 'Class is required'
      });
    }
    
    // Check if subject code already exists (if provided)
    if (code) {
      const existingSubject = await Subject.findOne({ code });
      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: 'Subject code already exists'
        });
      }
    }
    
    // Accept either the linked User id or the Teacher profile id; this keeps the
    // existing dropdown values working without changing the admin UI.
    let resolvedTeacherId = teacherId;
    let teacherUser = await User.findById(teacherId);

    if (!teacherUser) {
      const teacherProfile = await require('../models/Teacher').findById(teacherId);
      if (teacherProfile && teacherProfile.userId) {
        resolvedTeacherId = teacherProfile.userId;
        teacherUser = await User.findById(resolvedTeacherId);
      }
    }

    if (!teacherUser || teacherUser.role !== 'teacher') {
    // Check if teacher exists and is a teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || String(teacher.role).toUpperCase() !== 'TEACHER') {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher selected'
      });
    }
    
    const subject = new Subject({
      title,
      description: description || '',
      teacherId: resolvedTeacherId,
      code: code || null,
      class: className,
      status: status || 'Active',
      createdBy: req.user._id,
      createdByRole: 'admin'
    });
    
    await subject.save();
    
    const populatedSubject = await Subject.findById(subject._id)
      .populate('teacherId', 'name email')
      .populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      data: populatedSubject,
      message: 'Subject created successfully'
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Subject code already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating subject'
    });
  }
});

// ============================================
// UPDATE SUBJECT
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const { title, description, teacherId, code, class: className, status } = req.body;
    
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    // Check if code is being changed and if it already exists
    if (code && code !== subject.code) {
      const existingSubject = await Subject.findOne({ code });
      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: 'Subject code already exists'
        });
      }
    }
    
    // Check if teacher exists (if teacherId is being updated)
    if (teacherId && teacherId !== subject.teacherId.toString()) {
      let resolvedTeacherId = teacherId;
      let teacherUser = await User.findById(teacherId);

      if (!teacherUser) {
        const teacherProfile = await require('../models/Teacher').findById(teacherId);
        if (teacherProfile && teacherProfile.userId) {
          resolvedTeacherId = teacherProfile.userId;
          teacherUser = await User.findById(resolvedTeacherId);
        }
      }

      if (!teacherUser || teacherUser.role !== 'teacher') {
      const teacher = await User.findById(teacherId);
      if (!teacher || String(teacher.role).toUpperCase() !== 'TEACHER') {
        return res.status(400).json({
          success: false,
          message: 'Invalid teacher selected'
        });
      }
      teacherId = resolvedTeacherId;
    }
    
    // Update fields
    if (title) subject.title = title;
    if (description !== undefined) subject.description = description;
    if (teacherId) subject.teacherId = teacherId;
    if (code !== undefined) subject.code = code;
    if (className) subject.class = className;
    if (status) subject.status = status;
    
    await subject.save();
    
    const populatedSubject = await Subject.findById(subject._id)
      .populate('teacherId', 'name email')
      .populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: populatedSubject,
      message: 'Subject updated successfully'
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Subject code already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating subject'
    });
  }
});

// ============================================
// DELETE SUBJECT
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subject'
    });
  }
});

// ============================================
// ASSIGN TEACHER TO SUBJECT
// ============================================
router.patch('/:id/assign-teacher', async (req, res) => {
  try {
    const { teacherId } = req.body;
    const subjectId = req.params.id;
    
    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Teacher ID is required'
      });
    }
    
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    const teacher = await User.findById(teacherId);
    if (!teacher || String(teacher.role).toUpperCase() !== 'TEACHER') {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher selected'
      });
    }
    
    subject.teacherId = teacherId;
    await subject.save();
    
    const populatedSubject = await Subject.findById(subjectId)
      .populate('teacherId', 'name email')
      .populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: populatedSubject,
      message: 'Teacher assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning teacher'
    });
  }
});

// ============================================
// GET SUBJECT STATISTICS
// ============================================
router.get('/stats', async (req, res) => {
  try {
    const totalSubjects = await Subject.countDocuments();
    const activeSubjects = await Subject.countDocuments({ status: 'Active' });
    const inactiveSubjects = await Subject.countDocuments({ status: 'Inactive' });
    
    const subjectsByTeacher = await Subject.aggregate([
      { $group: { _id: '$teacherId', count: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'teacher' } },
      { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } },
      { $project: { teacherName: '$teacher.name', teacherEmail: '$teacher.email', count: 1 } }
    ]);
    
    const subjectsByClass = await Subject.aggregate([
      { $group: { _id: '$class', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalSubjects,
        active: activeSubjects,
        inactive: inactiveSubjects,
        byTeacher: subjectsByTeacher,
        byClass: subjectsByClass
      }
    });
  } catch (error) {
    console.error('Error getting subject stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting subject statistics'
    });
  }
});

module.exports = router;