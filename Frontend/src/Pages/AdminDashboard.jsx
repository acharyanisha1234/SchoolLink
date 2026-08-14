import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  MegaphoneIcon,
  ChartBarIcon,
  UserPlusIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BellIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import {
  stats,
  students,
  subjects,
  announcements,
  recentActivities,
} from "../data/AdminMockData.js";

const Modal = ({
  showAddModal,
  modalType,
  closeModal,
  handleAddStudent,
  handleAddTeacher,
  handleAddSubject,
  handleAddAnnouncement,
  studentFormData,
  teacherFormData,
  subjectFormData,
  announcementFormData,
  handleInputChange,
  loading,
}) => {
  if (!showAddModal) return null;

  const getModalTitle = () => {
    switch (modalType) {
      case 'student':
        return 'Add New Student';
      case 'teacher':
        return 'Add New Teacher';
      case 'subject':
        return 'Create New Subject';
      case 'announcement':
        return 'Post New Announcement';
      default:
        return '';
    }
  };

  const getSubmitHandler = () => {
    switch (modalType) {
      case 'student':
        return handleAddStudent;
      case 'teacher':
        return handleAddTeacher;
      case 'subject':
        return handleAddSubject;
      case 'announcement':
        return handleAddAnnouncement;
      default:
        return handleAddStudent;
    }
  };

  const getFormData = () => {
    switch (modalType) {
      case 'student':
        return studentFormData;
      case 'teacher':
        return teacherFormData;
      case 'subject':
        return subjectFormData;
      case 'announcement':
        return announcementFormData;
      default:
        return studentFormData;
    }
  };

  const formData = getFormData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {getModalTitle()}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={getSubmitHandler()} className="space-y-4">
          {/* Student Form */}
          {modalType === 'student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Number *
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter roll number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class *
                </label>
                <select
                  name="className"
                  value={formData.className || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <option key={num} value={num}>
                      Class {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section *
                </label>
                <select
                  name="section"
                  value={formData.section || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Name
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter parent name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Contact
                </label>
                <input
                  type="text"
                  name="parentPhone"
                  value={formData.parentPhone || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter parent contact number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                />
              </div>
            </>
          )}

          {/* Teacher Form */}
          {modalType === 'teacher' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter qualification"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter years of experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                />
              </div>
            </>
          )}

          {/* Subject Form */}
          {modalType === 'subject' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MATH101 (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class *
                </label>
                <select
                  name="class"
                  value={formData.class || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <option key={num} value={num}>
                      Class {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Teacher *
                </label>
                <select
                  name="teacherId"
                  value={formData.teacherId || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Teacher</option>
                  {teachersList.length > 0 ? (
                    teachersList.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name} ({teacher.email})
                      </option>
                    ))
                  ) : (
                    <option value="">No teachers available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject description (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status || 'Active'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </>
          )}

          {/* Announcement Form */}
          {modalType === 'announcement' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                rows="4"
                name="announcementContent"
                value={formData.announcementContent || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write announcement content..."
              />
            </div>
          )}

          <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {modalType === 'student'
            ? loading ? 'Adding...' : 'Add Student'
            : modalType === 'teacher'
            ? loading ? 'Adding...' : 'Add Teacher'
            : modalType === 'subject'
            ? loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Subject' : 'Create Subject')
            : loading ? 'Posting...' : 'Post Announcement'}
        </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Student states
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);

  // Teacher states
  const [teachersList, setTeachersList] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [teacherLoading, setTeacherLoading] = useState(false);

  // Subject states
  const [subjectsList, setSubjectsList] = useState([]);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState(null);

  // Separate form data for each modal type
  const [studentFormData, setStudentFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    rollNumber: '',
    className: '',
    section: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    address: ''
  });

  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    email: '',
    password: '',
    qualification: '',
    experience: '',
    phone: '',
    address: ''
  });

  const [subjectFormData, setSubjectFormData] = useState({
  title: '',
  code: '',
  description: '',
  teacherId: '',
  class: '',
  status: 'Active'
});

  const [announcementFormData, setAnnouncementFormData] = useState({
    announcementContent: ''
  });


  const API_URL = 'http://localhost:5000/api';

  // ============ LOGOUT HANDLER ============
  const handleLogout = () => {
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login
    navigate('/login');
  };

  // ============ CONFIRM LOGOUT ============
  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Fetch students and teachers on component mount
  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    }
    if (activeTab === 'dashboard') {
      fetchTotalStudents();
      fetchTotalTeachers();
      fetchTotalSubjects();
    }
    if (activeTab === 'teachers') {
      fetchTeachers();
    }
    if (activeTab === 'subjects') {
    fetchSubjects();
    fetchTeachers(); 
  }
  }, [activeTab]);

  // ============ STUDENT API CALLS ============
  const fetchTotalStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTotalStudents(data.data.length);
      }
    } catch (error) {
      console.error('Error fetching total students:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStudentsList(data.data);
        setTotalStudents(data.data.length);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching students');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============ TEACHER API CALLS ============
  const fetchTotalTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/teachers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTotalTeachers(data.data.length);
      }
    } catch (error) {
      console.error('Error fetching total teachers:', error);
    }
  };

  const fetchTeachers = async () => {
    setTeacherLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/teachers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Teachers data:', data); // Debug log
      if (data.success) {
        setTeachersList(data.data);
        setTotalTeachers(data.data.length);
      } else {
        console.error('Error fetching teachers:', data.message);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setTeacherLoading(false);
    }
  };

  // ============ SUBJECT API CALLS ============
const fetchTotalSubjects = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/subjects`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.success) {
      setTotalSubjects(data.count || data.data.length);
    }
  } catch (error) {
    console.error('Error fetching total subjects:', error);
  }
};

const fetchSubjects = async () => {
  setSubjectLoading(true);
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/subjects`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log('Subjects data:', data);
    if (data.success) {
      setSubjectsList(data.data);
      setTotalSubjects(data.count || data.data.length);
    } else {
      setError(data.message);
    }
  } catch (error) {
    console.error('Error fetching subjects:', error);
    setError('Error fetching subjects');
  } finally {
    setSubjectLoading(false);
  }
};

  // ============ HANDLE INPUT CHANGE ============
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (modalType === 'student') {
      setStudentFormData({
        ...studentFormData,
        [name]: value
      });
    } else if (modalType === 'teacher') {
      setTeacherFormData({
        ...teacherFormData,
        [name]: value
      });
    } else if (modalType === 'subject') {
      setSubjectFormData({
        ...subjectFormData,
        [name]: value
      });
    } else if (modalType === 'announcement') {
      setAnnouncementFormData({
        ...announcementFormData,
        [name]: value
      });
    }
  };

  // ============ HANDLE ADD STUDENT ============
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!studentFormData.fullName || !studentFormData.email || !studentFormData.password || 
          !studentFormData.rollNumber || !studentFormData.className) {
        alert('Please fill all required fields: Full Name, Email, Password, Roll Number, and Class');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(studentFormData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Student added successfully!');
        closeModal();
        setStudentFormData({
          fullName: '',
          email: '',
          password: '',
          rollNumber: '',
          className: '',
          section: '',
          dateOfBirth: '',
          gender: '',
          phone: '',
          parentName: '',
          parentPhone: '',
          address: ''
        });
        fetchStudents();
        setTotalStudents(prev => prev + 1);
      } else {
        alert(data.message || 'Error adding student');
      }
    } catch (error) {
      console.error('Error details:', error);
      alert('Error adding student: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // ============ HANDLE ADD TEACHER ============
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!teacherFormData.name || !teacherFormData.email || !teacherFormData.password) {
        alert('Please fill all required fields: Name, Email, and Password');
        setLoading(false);
        return;
      }

      console.log('Sending teacher data:', teacherFormData); // Debug log

      const response = await fetch(`${API_URL}/admin/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teacherFormData)
      });

      const data = await response.json();
      console.log('Teacher creation response:', data); // Debug log
      
      if (data.success) {
        alert('Teacher added successfully!');
        closeModal();
        setTeacherFormData({
          name: '',
          email: '',
          password: '',
          qualification: '',
          experience: '',
          phone: '',
          address: ''
        });

        //Refresh teacher list
        await fetchTeachers();
        setTotalTeachers(prev => prev + 1);
      } else {
        alert(data.message || 'Error adding teacher');
      }
    } catch (error) {
      console.error('Error details:', error);
      alert('Error adding teacher: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // ============ HANDLE ADD SUBJECT ============
  const handleAddSubject = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const token = localStorage.getItem('token');
    
    // Validation
    if (!subjectFormData.title) {
      alert('Please enter a subject title');
      setLoading(false);
      return;
    }
    
    if (!subjectFormData.teacherId) {
      alert('Please select a teacher');
      setLoading(false);
      return;
    }
    
    if (!subjectFormData.class) {
      alert('Please select a class');
      setLoading(false);
      return;
    }

    const subjectData = {
      title: subjectFormData.title,
      code: subjectFormData.code || undefined,
      description: subjectFormData.description || '',
      teacherId: subjectFormData.teacherId,
      class: parseInt(subjectFormData.class),
      status: subjectFormData.status || 'Active'
    };

    console.log('Sending subject data:', subjectData);

    const url = isEditMode 
      ? `${API_URL}/admin/subjects/${editingSubjectId}`
      : `${API_URL}/admin/subjects`;
    
    const method = isEditMode ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subjectData)
    });

    const data = await response.json();
    console.log('Subject response:', data);
    
    if (data.success) {
      alert(isEditMode ? 'Subject updated successfully!' : 'Subject created successfully!');
      closeModal();
      resetSubjectForm();
      await fetchSubjects();
      await fetchTotalSubjects();
    } else {
      alert(data.message || 'Error processing subject');
    }
  } catch (error) {
    console.error('Error details:', error);
    alert('Error processing subject: ' + (error.message || 'Unknown error'));
  } finally {
    setLoading(false);
  }
};

// ============ HANDLE DELETE SUBJECT ============
const handleDeleteSubject = async (subjectId) => {
  if (!window.confirm('Are you sure you want to delete this subject?')) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/subjects/${subjectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      alert('Subject deleted successfully');
      await fetchSubjects();
      await fetchTotalSubjects();
    } else {
      alert(data.message || 'Error deleting subject');
    }
  } catch (error) {
    alert('Error deleting subject');
    console.error('Error:', error);
  }
};

// ============ HANDLE EDIT SUBJECT ============
  const handleEditSubject = (subjectId) => {
  const subject = subjectsList.find(s => s._id === subjectId);
  if (subject) {
    setIsEditMode(true);
    setEditingSubjectId(subjectId);
    setSubjectFormData({
      title: subject.title || '',
      code: subject.code || '',
      description: subject.description || '',
      teacherId: subject.teacherId?._id || subject.teacherId || '',
      class: subject.class || '',
      status: subject.status || 'Active'
    });
    setModalType('subject');
    setShowAddModal(true);
  }
};

// ============ RESET SUBJECT FORM ============
  const resetSubjectForm = () => {
  setSubjectFormData({
    title: '',
    code: '',
    description: '',
    teacherId: '',
    class: '',
    status: 'Active'
  });
  setIsEditMode(false);
  setEditingSubjectId(null);
};

  // ============ HANDLE ADD ANNOUNCEMENT ============
    const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!announcementFormData.announcementContent) {
        alert('Please enter announcement content');
        setLoading(false);
        return;
      }

      alert('Announcement feature coming soon!');
      closeModal();
      setAnnouncementFormData({ announcementContent: '' });
    } catch (error) {
      console.error('Error:', error);
      alert('Error posting announcement');
    } finally {
      setLoading(false);
    }
  };

  // ============ HANDLE DELETE STUDENT ============
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Student deleted successfully');
        fetchStudents();
        setTotalStudents(prev => prev - 1);
      } else {
        alert(data.message || 'Error deleting student');
      }
    } catch (error) {
      alert('Error deleting student');
      console.error('Error:', error);
    }
  };

  // ============ HANDLE DELETE TEACHER ============
  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/teachers/${teacherId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Teacher deleted successfully');
        fetchTeachers();
        setTotalTeachers(prev => prev - 1);
      } else {
        alert(data.message || 'Error deleting teacher');
      }
    } catch (error) {
      alert('Error deleting teacher');
      console.error('Error:', error);
    }
  };

  const toggleSubject = (id) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  const openModal = (type) => {
    if (type === 'subject') {
      resetSubjectForm();
    }
    setModalType(type);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setModalType('');
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${bgColor} mr-4`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  //Dashboard View
  const DashboardView = ({ onLogout }) => (
  <div>
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your school.</p>
      </div>
      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={UsersIcon} label="Total Students" value={totalStudents} color="text-blue-600" bgColor="bg-blue-100" />
      <StatCard icon={AcademicCapIcon} label="Total Teachers" value={totalTeachers} color="text-green-600" bgColor="bg-green-100" />
      <StatCard icon={BookOpenIcon} label="Total Subjects" value={totalSubjects} color="text-purple-600" bgColor="bg-purple-100" />
      <StatCard icon={DocumentTextIcon} label="Learning Materials" value={0} color="text-yellow-600" bgColor="bg-yellow-100" />
      <StatCard icon={ClipboardDocumentIcon} label="Total Assignments" value={0} color="text-pink-600" bgColor="bg-pink-100" />
      <StatCard icon={CheckCircleIcon} label="Homework Submissions" value={0} color="text-indigo-600" bgColor="bg-indigo-100" />
      <StatCard icon={ClockIcon} label="Total Tasks" value={0} color="text-red-600" bgColor="bg-red-100" />
      <StatCard icon={MegaphoneIcon} label="Recent Notices" value={0} color="text-orange-600" bgColor="bg-orange-100" />
    </div>

    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          <BellIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <p className="text-sm text-gray-800">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => openModal('student')} className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-700">
            <UserPlusIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Add Student</span>
          </button>
          <button onClick={() => openModal('teacher')} className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-green-700">
            <AcademicCapIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Add Teacher</span>
          </button>
          <button onClick={() => openModal('subject')} className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-purple-700">
            <BookOpenIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Create Subject</span>
          </button>
          <button onClick={() => openModal('announcement')} className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-orange-700">
            <MegaphoneIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Post Announcement</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

  //Student View
  const StudentsView = () => (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage all students in your school</p>
        </div>
        <button 
          onClick={() => openModal('student')} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading students...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentsList.length > 0 ? (
                  studentsList.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.fullName || student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.className}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.section}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  // TeachersView 
  const TeachersView = () => (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">Manage all teachers in your school</p>
        </div>
        <button onClick={() => openModal('teacher')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium inline-flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Teacher
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {teacherLoading ? (
            <div className="p-8 text-center text-gray-500">Loading teachers...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachersList.length > 0 ? (
                  teachersList.map((teacher) => (
                    <tr key={teacher._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.employeeId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.qualification || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {teacher.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTeacher(teacher._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No teachers found. Click "Add Teacher" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  //Subject View
  const SubjectsView = () => {
  const filteredSubjects = subjectsList.filter(subject =>
    subject.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.teacherId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-600 mt-1">
            Manage all subjects ({totalSubjects} total)
          </p>
        </div>
        <button 
          onClick={() => {
            resetSubjectForm();
            openModal('subject');
          }} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Subject
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search subjects by title, code, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {subjectLoading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Loading subjects...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <tr key={subject._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subject.code || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subject.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subject.class ? `Class ${subject.class}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subject.teacherId?.name || 'Not Assigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          subject.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subject.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleEditSubject(subject._id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSubject(subject._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      {searchTerm ? 'No subjects match your search' : 'No subjects found. Click "Create Subject" to add one.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

//Announcement View
  const AnnouncementsView = () => (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Manage school announcements</p>
        </div>
        <button onClick={() => openModal('announcement')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium inline-flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Post Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <MegaphoneIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">{announcement.content}</p>
                <p className="mt-2 text-xs text-gray-500">Posted on: {announcement.date}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
    <div className="ml-64 flex-1">
      {/* Main Content */}
      <div className="p-8">
        {activeTab === "dashboard" && <DashboardView onLogout={confirmLogout} />}
        {activeTab === "students" && <StudentsView />}
        {activeTab === "teachers" && <TeachersView />}
        {activeTab === "subjects" && <SubjectsView />}
        {activeTab === "announcements" && <AnnouncementsView />}
      </div>
    </div>

    {/* Logout Confirmation Modal */}
    {showLogoutConfirm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to logout? You will need to login again to access your dashboard.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    <Modal
      showAddModal={showAddModal}
      modalType={modalType}
      closeModal={closeModal}
      handleAddStudent={handleAddStudent}
      handleAddTeacher={handleAddTeacher}
      handleAddSubject={handleAddSubject}
      handleAddAnnouncement={handleAddAnnouncement}
      studentFormData={studentFormData}
      teacherFormData={teacherFormData}
      subjectFormData={subjectFormData}
      announcementFormData={announcementFormData}
      handleInputChange={handleInputChange}
      loading={loading}
    />
  </div>
);
};

export default AdminDashboard;