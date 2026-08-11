const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    console.log('GET /api/students called');

    const students = await Student.find().select('-password');

    console.log('Students found:', students.length);

    res.status(200).json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('GET STUDENTS ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};


// Get single student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// Create new student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, class: studentClass, section, dateOfBirth, parentName, parentContact, address } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    // Generate password (you can modify this logic)
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create student
    const student = await Student.create({
      name,
      email,
      class: studentClass,
      section,
      dateOfBirth,
      parentName,
      parentContact,
      address,
      password: hashedPassword,
      status: 'Active'
    });

    // Remove password from response
    const studentData = student.toObject();
    delete studentData.password;

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: studentData,
      tempPassword: tempPassword // Send temporary password (in production, send via email)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove password from updates if present
    delete updates.password;
    
    const student = await Student.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

// Search students
exports.searchStudents = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i');
    
    const students = await Student.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { studentId: searchRegex }
      ]
    }).select('-password');

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching students',
      error: error.message
    });
  }
};