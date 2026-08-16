const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// ============ CREATE STUDENT ============
exports.createStudent = async (req, res) => {
  try {
    console.log('Creating student with data:', req.body);

    const {
      fullName,
      email,
      password,
      rollNumber,
      className,
      section,
      dateOfBirth,
      gender,
      phone,
      address,
      parentName,
      parentPhone,
      parentEmail,
      studentId,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !rollNumber || !className) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, password, roll number, and class',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Check if student exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists',
      });
    }

    // Check roll number uniqueness
    const existingRollNumber = await Student.findOne({ 
      rollNumber, 
      className, 
      section 
    });
    if (existingRollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number already exists for this class and section',
      });
    }

    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: 'student',
      isActive: true,
    });

    await user.save();
    console.log('User created:', user._id);

    // Create student
    const student = new Student({
      userId: user._id,
      studentId: studentId || undefined,
      fullName,
      email,
      rollNumber,
      className,
      section: section || '',
      dateOfBirth: dateOfBirth || null,
      gender: gender || 'Not Specified',
      phone: phone || '',
      address: address || '',
      parentName: parentName || '',
      parentPhone: parentPhone || '',
      parentEmail: parentEmail || '',
      admissionDate: new Date(),
      status: 'Active',
    });

    await student.save();
    console.log('Student created:', student._id);

    res.status(201).json({
      success: true,
      message: 'Student added successfully!',
      data: {
        student: {
          id: student._id,
          studentId: student.studentId,
          fullName: student.fullName,
          email: student.email,
          rollNumber: student.rollNumber,
          className: student.className,
          section: student.section,
          dateOfBirth: student.dateOfBirth,
          gender: student.gender,
          phone: student.phone,
          address: student.address,
          parentName: student.parentName,
          parentPhone: student.parentPhone,
          parentEmail: student.parentEmail,
          admissionDate: student.admissionDate,
          status: student.status,
        },
      },
    });
  } catch (error) {
    console.error('Create student error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET ALL STUDENTS ============
exports.getAllStudents = async (req, res) => {
  try {
    const { search, className, section, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (className) query.className = className;
    if (section) query.section = section;
    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { parentName: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query)
      .populate('userId', 'fullName email profilePicture isActive')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: students,
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET SINGLE STUDENT ============
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'fullName email profilePicture isActive');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE STUDENT ============
exports.updateStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      rollNumber,
      className,
      section,
      dateOfBirth,
      gender,
      phone,
      address,
      parentName,
      parentPhone,
      parentEmail,
      admissionDate,
      status,
      password,
    } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    if (email && email !== student.email) {
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another student',
        });
      }
    }

    if (rollNumber && rollNumber !== student.rollNumber) {
      const existingRollNumber = await Student.findOne({
        rollNumber,
        className: className || student.className,
        section: section || student.section,
      });
      if (existingRollNumber) {
        return res.status(400).json({
          success: false,
          message: 'Roll number already exists for this class and section',
        });
      }
    }

    const user = await User.findById(student.userId);
    if (user) {
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      await user.save();
    }

    if (fullName) student.fullName = fullName;
    if (email) student.email = email;
    if (rollNumber) student.rollNumber = rollNumber;
    if (className) student.className = className;
    if (section !== undefined) student.section = section;
    if (dateOfBirth) student.dateOfBirth = dateOfBirth;
    if (gender) student.gender = gender;
    if (phone) student.phone = phone;
    if (address) student.address = address;
    if (parentName) student.parentName = parentName;
    if (parentPhone) student.parentPhone = parentPhone;
    if (parentEmail) student.parentEmail = parentEmail;
    if (admissionDate) student.admissionDate = admissionDate;
    if (status) student.status = status;
    
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student updated successfully!',
      data: { student },
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE STUDENT ============
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully!',
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ TOGGLE STUDENT STATUS ============
exports.toggleStudentStatus = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    student.status = student.status === 'Active' ? 'Inactive' : 'Active';
    await student.save();

    await User.findByIdAndUpdate(student.userId, {
      isActive: student.status === 'Active',
    });

    res.status(200).json({
      success: true,
      message: `Student ${student.status === 'Active' ? 'activated' : 'deactivated'} successfully!`,
      data: { status: student.status },
    });
  } catch (error) {
    console.error('Toggle student status error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET STUDENT STATISTICS ============
exports.getStudentStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const inactiveStudents = await Student.countDocuments({ status: 'Inactive' });

    const classDistribution = await Student.aggregate([
      {
        $group: {
          _id: '$className',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalStudents,
        active: activeStudents,
        inactive: inactiveStudents,
        classDistribution,
      },
    });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};