import React, { useState, useEffect } from "react";
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
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import {
  stats,
  students,
  teachers,
  subjects,
  announcements,
  recentActivities,
} from "../data/AdminMockData.js";

const Modal = ({
  showAddModal,
  modalType,
  closeModal,
  handleAddStudent,
  formData,
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

        <form onSubmit={handleAddStudent} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>

          {/* Student Fields */}
          {modalType === 'student' && (
            <>
              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class *
                </label>

                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>

                  {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section *
                </label>

                <select
                  name="section"
                  value={formData.section}
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

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Parent Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Name
                </label>

                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter parent name"
                />
              </div>

              {/* Parent Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Contact
                </label>

                <input
                  type="text"
                  name="parentContact"
                  value={formData.parentContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter parent contact number"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                />
              </div>
            </>
          )}

          {/* Subject */}
          {modalType === 'subject' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>

              <input
                type="text"
                name="subjectName"
                value={formData.subjectName || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subject name"
              />
            </div>
          )}

          {/* Announcement */}
          {modalType === 'announcement' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>

              <textarea
                rows="4"
                name="announcementContent"
                value={formData.announcementContent || ''}
                onChange={handleInputChange}
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
              ? loading ? 'Creating...' : 'Create Subject'
              : loading ? 'Posting...' : 'Post Announcement'}
          </button>

        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  // State for managing which tab is currently active in the dashboard
  const [activeTab, setActiveTab] = useState('dashboard');
  // State for storing the search input value when filtering items
  const [searchTerm, setSearchTerm] = useState('');
  // State to track which subject is expanded to show its chapters
  const [expandedSubject, setExpandedSubject] = useState(null);
  // State to control the visibility of the add modal
  const [showAddModal, setShowAddModal] = useState(false);
  // State to store the type of item being added (student, teacher, subject, announcement)
  const [modalType, setModalType] = useState('');

  // Student management states
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    class: '',
    section: '',
    dateOfBirth: '',
    parentName: '',
    parentContact: '',
    address: ''
  });

  // API base URL
  const API_URL = 'http://localhost:5000/api';

  // Fetch students on component mount
  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    }
    // Fetch total students for dashboard
    if (activeTab === 'dashboard') {
      fetchTotalStudents();
    }
  }, [activeTab]);

  // Fetch total students count
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

  // Fetch students
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

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle student creation
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Student added successfully!`);
        closeModal();
        setFormData({
          name: '',
          email: '',
          class: '',
          section: '',
          dateOfBirth: '',
          parentName: '',
          parentContact: '',
          address: ''
        });
        // Refresh students list
        fetchStudents();
        // Update total students
        setTotalStudents(prev => prev + 1);
      } else {
        alert(data.message || 'Error adding student');
      }
    } catch (error) {
      alert('Error adding student');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle student deletion
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

  // Helper Functions
  // Toggles the expansion of a subject to show/hide its chapters
  const toggleSubject = (id) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  // Opens the modal and sets the type of item to be added
  const openModal = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  // Closes the modal and resets the modal type
  const closeModal = () => {
    setShowAddModal(false);
    setModalType('');
  };

  // Stat Card Component
  // Reusable card component for displaying statistics with an icon, label, and value
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

  // Dashboard View
  // Renders the main dashboard overview with stats, recent activities, and quick actions
  const DashboardView = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your school.</p>
      </div>

      {/* Stats Grid */}
      {/* Grid layout displaying all statistical cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={UsersIcon} label="Total Students" value={totalStudents || stats.totalStudents} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard icon={AcademicCapIcon} label="Total Teachers" value={stats.totalTeachers} color="text-green-600" bgColor="bg-green-100" />
        <StatCard icon={BookOpenIcon} label="Total Subjects" value={stats.totalSubjects} color="text-purple-600" bgColor="bg-purple-100" />
        <StatCard icon={DocumentTextIcon} label="Learning Materials" value={stats.totalMaterials} color="text-yellow-600" bgColor="bg-yellow-100" />
        <StatCard icon={ClipboardDocumentIcon} label="Total Assignments" value={stats.totalAssignments} color="text-pink-600" bgColor="bg-pink-100" />
        <StatCard icon={CheckCircleIcon} label="Homework Submissions" value={stats.totalSubmissions} color="text-indigo-600" bgColor="bg-indigo-100" />
        <StatCard icon={ClockIcon} label="Total Tasks" value={stats.totalTasks} color="text-red-600" bgColor="bg-red-100" />
        <StatCard icon={MegaphoneIcon} label="Recent Notices" value={stats.recentNotices} color="text-orange-600" bgColor="bg-orange-100" />
      </div>

      {/* Recent Activities & Quick Actions */}
      {/* Two-column layout for recent activities and quick action buttons */}
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

  // Students View
  // Renders the student management interface with search and table display
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.section}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
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
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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

  // Teachers View
  // Renders the teacher management interface with table display
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {teacher.subjects.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {teacher.classes.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Subjects View
  // Renders the subject management interface with expandable chapters
  const SubjectsView = () => (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-600 mt-1">Manage subjects and their chapters</p>
        </div>
        <button onClick={() => openModal('subject')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium inline-flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Subject
        </button>
      </div>

      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSubject(subject.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {expandedSubject === subject.id ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                  <span className="text-sm text-gray-500">({subject.chapters.length} chapters)</span>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="ml-9 mt-1 text-sm text-gray-600">Teacher: {subject.teacher}</p>
            </div>
            {expandedSubject === subject.id && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Chapters:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {subject.chapters.map((chapter, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-800">{chapter}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Announcements View
  // Renders the announcement management interface
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

  
  // Main Render
  // Renders the complete admin dashboard with sidebar, content area, and modal
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="ml-64 flex-1 p-8">
        {/* Conditionally render the appropriate view based on the active tab */}
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "students" && <StudentsView />}
        {activeTab === "teachers" && <TeachersView />}
        {activeTab === "subjects" && <SubjectsView />}
        {activeTab === "announcements" && <AnnouncementsView />}
      </div>

      <Modal
      showAddModal={showAddModal}
      modalType={modalType}
      closeModal={closeModal}
      handleAddStudent={handleAddStudent}
      formData={formData}
      handleInputChange={handleInputChange}
      loading={loading}
    />
    </div>
  );
};

export default AdminDashboard;