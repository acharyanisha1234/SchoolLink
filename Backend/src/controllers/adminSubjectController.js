const Subject = require('../models/Subject');
const User = require('../models/User');

// Get all subjects (admin can see all)
exports.getAllSubjects = async (req, res) => {
  try {
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
};

// Get single subject
exports.getSubjectById = async (req, res) => {
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
};

// Create subject (admin)
exports.createSubject = async (req, res) => {
  try {
    const { title, description, teacherId, code, class: className, status } = req.body;
    
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
    
    // Check if teacher exists
    if (teacherId) {
      const teacher = await User.findById(teacherId);
      if (!teacher || String(teacher.role).toUpperCase() !== 'TEACHER') {
        return res.status(400).json({
          success: false,
          message: 'Invalid teacher selected'
        });
      }
    }
    
    const subject = new Subject({
      title,
      description: description || '',
      teacherId: teacherId || null,
      code: code || null,
      class: className || null,
      status: status || 'Active',
      createdBy: req.user._id,
      createdByRole: 'admin'
    });
    
    await subject.save();
    
    // Populate the saved subject
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
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating subject'
    });
  }
};

// Update subject (admin)
exports.updateSubject = async (req, res) => {
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
    
    // Check if teacher exists
    if (teacherId) {
      const teacher = await User.findById(teacherId);
      if (!teacher || String(teacher.role).toUpperCase() !== 'TEACHER') {
        return res.status(400).json({
          success: false,
          message: 'Invalid teacher selected'
        });
      }
    }
    
    // Update fields
    subject.title = title || subject.title;
    subject.description = description !== undefined ? description : subject.description;
    subject.teacherId = teacherId !== undefined ? teacherId : subject.teacherId;
    subject.code = code !== undefined ? code : subject.code;
    subject.class = className !== undefined ? className : subject.class;
    subject.status = status || subject.status;
    
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
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating subject'
    });
  }
};

// Delete subject (admin)
exports.deleteSubject = async (req, res) => {
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
      message: 'Subject deleted successfully',
      data: subject
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subject'
    });
  }
};

// Get subject statistics
exports.getSubjectStats = async (req, res) => {
  try {
    const totalSubjects = await Subject.countDocuments();
    const activeSubjects = await Subject.countDocuments({ status: 'Active' });
    const subjectsByTeacher = await Subject.aggregate([
      { $group: { _id: '$teacherId', count: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'teacher' } },
      { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } },
      { $project: { teacherName: '$teacher.name', count: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalSubjects,
        active: activeSubjects,
        byTeacher: subjectsByTeacher
      }
    });
  } catch (error) {
    console.error('Error getting subject stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting subject statistics'
    });
  }
};

// Assign teacher to subject
exports.assignTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const subjectId = req.params.id;
    
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
};