const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');

// CREATE TEACHER (Admin) – No manual hashing
exports.createTeacher = async (req, res) => {
  try {
    console.log('Creating teacher with data:', req.body);

    const {
      name,
      email,
      password,
      qualification,
      experience,
      specializations,
      phone,
      address,
      joinDate,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ success: false, message: 'Teacher with this email already exists' });
    }

    
    const user = await User.create({
      fullName: name,
      email,
      password: password,
      role: 'TEACHER',
      isActive: true,
    });

    const employeeId = `TCH${Date.now().toString().slice(-6)}`;

    const teacher = await Teacher.create({
      userId: user._id,
      employeeId,
      name,
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
      data: { teacher },
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ GET ALL TEACHERS ============
exports.getAllTeachers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

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
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ GET SINGLE TEACHER ============
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('userId', 'fullName email profilePicture isActive')
      .populate('assignedSubjects.subjectId', 'name code description');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//  UPDATE TEACHER 
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

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    if (email && email !== teacher.email) {
      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
        return res.status(400).json({ success: false, message: 'Email already in use by another teacher' });
      }
    }

    const user = await User.findById(teacher.userId);
    if (user) {
      if (name) user.fullName = name;
      if (email) user.email = email;
      if (password) {
        // FIX: Set plain password – model's pre('save') will hash it
        user.password = password;
      }
      await user.save();
    }

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
      data: { teacher },
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//  DELETE TEACHER 
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    await User.findByIdAndDelete(teacher.userId);
    await Teacher.findByIdAndDelete(req.params.id);

    await Subject.updateMany(
      { teacherId: req.params.id },
      { $unset: { teacherId: 1 } }
    );

    res.status(200).json({ success: true, message: 'Teacher deleted successfully!' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//  TOGGLE TEACHER STATUS 
exports.toggleTeacherStatus = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    teacher.status = teacher.status === 'Active' ? 'Inactive' : 'Active';
    await teacher.save();

    await User.findByIdAndUpdate(teacher.userId, {
      isActive: teacher.status === 'Active',
    });

    res.status(200).json({
      success: true,
      message: `Teacher ${teacher.status === 'Active' ? 'activated' : 'deactivated'} successfully!`,
      data: { status: teacher.status },
    });
  } catch (error) {
    console.error('Toggle teacher status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ASSIGN SUBJECT TO TEACHER 
exports.assignSubjectToTeacher = async (req, res) => {
  try {
    const { subjectId, className, section } = req.body;
    const teacherId = req.params.id;

    if (!subjectId) {
      return res.status(400).json({ success: false, message: 'Subject ID is required' });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const alreadyAssigned = teacher.assignedSubjects.some(
      (assigned) => assigned.subjectId.toString() === subjectId
    );
    if (alreadyAssigned) {
      return res.status(400).json({ success: false, message: 'Subject already assigned to this teacher' });
    }

    teacher.assignedSubjects.push({
      subjectId,
      className: className || subject.class,
      section: section || subject.section,
    });
    await teacher.save();

    subject.teacherId = teacherId;
    await subject.save();

    res.status(200).json({
      success: true,
      message: 'Subject assigned successfully!',
      data: { teacher },
    });
  } catch (error) {
    console.error('Assign subject error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//  REMOVE SUBJECT FROM TEACHER 
exports.removeSubjectFromTeacher = async (req, res) => {
  try {
    const { teacherId, subjectId } = req.params;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const isAssigned = teacher.assignedSubjects.some(
      (assigned) => assigned.subjectId.toString() === subjectId
    );
    if (!isAssigned) {
      return res.status(400).json({ success: false, message: 'Subject is not assigned to this teacher' });
    }

    teacher.assignedSubjects = teacher.assignedSubjects.filter(
      (assigned) => assigned.subjectId.toString() !== subjectId
    );
    await teacher.save();

    const subject = await Subject.findById(subjectId);
    if (subject) {
      subject.teacherId = null;
      await subject.save();
    }

    res.status(200).json({ success: true, message: 'Subject removed from teacher successfully!' });
  } catch (error) {
    console.error('Remove subject error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//  GET TEACHER STATISTICS 
exports.getTeacherStats = async (req, res) => {
  try {
    const totalTeachers = await Teacher.countDocuments();
    const activeTeachers = await Teacher.countDocuments({ status: 'Active' });
    const inactiveTeachers = await Teacher.countDocuments({ status: 'Inactive' });

    const teachersWithSubjects = await Teacher.aggregate([
      { $project: { name: 1, employeeId: 1, subjectCount: { $size: '$assignedSubjects' } } },
      { $sort: { subjectCount: -1 } },
      { $limit: 5 },
    ]);

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
        recentTeachers,
      },
    });
  } catch (error) {
    console.error('Get teacher stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL SUBJECTS FOR DROPDOWN
exports.getAllSubjectsForDropdown = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .select('_id name code class section')
      .sort({ name: 1 });

    res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};