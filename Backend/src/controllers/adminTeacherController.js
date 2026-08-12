const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const bcrypt = require('bcryptjs');

// CREATE TEACHER (Admin) 
exports.createTeacher = async (req, res) => {
  try {
    console.log('Creating teacher with data:', req.body);

    const {
      name,           //  Use 'name' from frontend
      email,
      password,
      qualification,
      experience,
      specializations,
      phone,
      address,
      joinDate,
    } = req.body;

    // Validate required fields -  Check 'name' not 'fullname'
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
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

    // Check if teacher exists with same email
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user -  Use 'fullName' (capital N) to match User model
    const user = await User.create({
      fullName: name,  //  Map 'name' to 'fullName'
      email,
      password: hashedPassword,
      role: 'teacher',
      isActive: true,
    });

    // Generate employee ID
    const employeeId = `TCH${Date.now().toString().slice(-6)}`;

    // Create teacher profile -  Use 'name' field
    const teacher = await Teacher.create({
      userId: user._id,
      employeeId,
      name,            //  Use 'name' field
      email,
      qualification: qualification || '',
      experience: experience || 0,
      specializations: specializations || [],
      phone: phone || '',
      address: address || '',
      joinDate: joinDate || new Date(),
      status: 'Active',
    });

    console.log('Teacher created:', teacher._id);

    res.status(201).json({
      success: true,
      message: 'Teacher added successfully!',
      data: {
        teacher: {
          id: teacher._id,
          employeeId: teacher.employeeId,
          name: teacher.name,
          email: teacher.email,
          qualification: teacher.qualification,
          experience: teacher.experience,
          specializations: teacher.specializations,
          phone: teacher.phone,
          address: teacher.address,
          joinDate: teacher.joinDate,
          status: teacher.status,
        },
      },
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    
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

// ============ GET ALL TEACHERS (Admin) ============
exports.getAllTeachers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } },
      ];
    }

    // Get teachers with pagination
    const teachers = await Teacher.find(query)
      .populate('userId', 'fullName email profilePicture isActive')
      .populate('assignedSubjects.subjectId', 'name code')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Teacher.countDocuments(query);

    res.status(200).json({
      success: true,
      count: teachers.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: teachers,
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET SINGLE TEACHER (Admin) ============
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('userId', 'fullName email profilePicture isActive')
      .populate('assignedSubjects.subjectId', 'name code description');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE TEACHER (Admin) ============
exports.updateTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      qualification,
      experience,
      specializations,
      phone,
      address,
      joinDate,
      status,
      password,
    } = req.body;

    // Find teacher
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== teacher.email) {
      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another teacher',
        });
      }
    }

    // Update user
    const user = await User.findById(teacher.userId);
    if (user) {
      if (name) user.fullName = name;
      if (email) user.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      await user.save();
    }

    // Update teacher
    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (qualification) teacher.qualification = qualification;
    if (experience !== undefined) teacher.experience = experience;
    if (specializations) teacher.specializations = specializations;
    if (phone) teacher.phone = phone;
    if (address) teacher.address = address;
    if (joinDate) teacher.joinDate = joinDate;
    if (status) teacher.status = status;
    
    await teacher.save();

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully!',
      data: {
        teacher: {
          id: teacher._id,
          employeeId: teacher.employeeId,
          name: teacher.name,
          email: teacher.email,
          qualification: teacher.qualification,
          experience: teacher.experience,
          specializations: teacher.specializations,
          phone: teacher.phone,
          address: teacher.address,
          joinDate: teacher.joinDate,
          status: teacher.status,
        },
      },
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE TEACHER (Admin) ============
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Delete user and teacher
    await User.findByIdAndDelete(teacher.userId);
    await Teacher.findByIdAndDelete(req.params.id);

    // Remove teacher reference from subjects
    await Subject.updateMany(
      { teacherId: req.params.id },
      { $unset: { teacherId: 1 } }
    );

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully!',
    });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ TOGGLE TEACHER STATUS (Admin) ============
exports.toggleTeacherStatus = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Toggle status
    teacher.status = teacher.status === 'Active' ? 'Inactive' : 'Active';
    await teacher.save();

    // Update user status
    await User.findByIdAndUpdate(teacher.userId, {
      isActive: teacher.status === 'Active',
    });

    res.status(200).json({
      success: true,
      message: `Teacher ${teacher.status === 'Active' ? 'activated' : 'deactivated'} successfully!`,
      data: {
        status: teacher.status,
      },
    });
  } catch (error) {
    console.error('Toggle teacher status error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ ASSIGN SUBJECT TO TEACHER (Admin) ============
exports.assignSubjectToTeacher = async (req, res) => {
  try {
    const { subjectId, className, section } = req.body;
    const teacherId = req.params.id;

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: 'Subject ID is required',
      });
    }

    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Check if already assigned
    const alreadyAssigned = teacher.assignedSubjects.some(
      (assigned) => assigned.subjectId.toString() === subjectId
    );

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Subject already assigned to this teacher',
      });
    }

    // Assign subject
    teacher.assignedSubjects.push({
      subjectId,
      className: className || subject.class,
      section: section || subject.section,
    });
    await teacher.save();

    // Update subject with teacher
    subject.teacherId = teacherId;
    await subject.save();

    res.status(200).json({
      success: true,
      message: 'Subject assigned successfully!',
      data: {
        teacher: {
          id: teacher._id,
          employeeId: teacher.employeeId,
          name: teacher.name,
          assignedSubjects: teacher.assignedSubjects,
        },
      },
    });
  } catch (error) {
    console.error('Assign subject error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ REMOVE SUBJECT FROM TEACHER (Admin) ============
exports.removeSubjectFromTeacher = async (req, res) => {
  try {
    const { teacherId, subjectId } = req.params;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Check if subject is assigned
    const isAssigned = teacher.assignedSubjects.some(
      (assigned) => assigned.subjectId.toString() === subjectId
    );

    if (!isAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Subject is not assigned to this teacher',
      });
    }

    // Remove subject from assigned list
    teacher.assignedSubjects = teacher.assignedSubjects.filter(
      (assigned) => assigned.subjectId.toString() !== subjectId
    );
    await teacher.save();

    // Remove teacher from subject
    const subject = await Subject.findById(subjectId);
    if (subject) {
      subject.teacherId = null;
      await subject.save();
    }

    res.status(200).json({
      success: true,
      message: 'Subject removed from teacher successfully!',
    });
  } catch (error) {
    console.error('Remove subject error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET TEACHER STATISTICS (Admin) ============
exports.getTeacherStats = async (req, res) => {
  try {
    const totalTeachers = await Teacher.countDocuments();
    const activeTeachers = await Teacher.countDocuments({ status: 'Active' });
    const inactiveTeachers = await Teacher.countDocuments({ status: 'Inactive' });

    // Get teachers with most subjects
    const teachersWithSubjects = await Teacher.aggregate([
      {
        $project: {
          name: 1,
          employeeId: 1,
          subjectCount: { $size: '$assignedSubjects' },
        },
      },
      { $sort: { subjectCount: -1 } },
      { $limit: 5 },
    ]);

    // Get recent teachers
    const recentTeachers = await Teacher.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        total: totalTeachers,
        active: activeTeachers,
        inactive: inactiveTeachers,
        topTeachers: teachersWithSubjects,
        recentTeachers: recentTeachers,
      },
    });
  } catch (error) {
    console.error('Get teacher stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET ALL SUBJECTS FOR DROPDOWN ============
exports.getAllSubjectsForDropdown = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .select('_id name code class section')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};