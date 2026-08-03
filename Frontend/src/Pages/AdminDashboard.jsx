import React, { useState } from 'react';
import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  MegaphoneIcon,
  UserCircleIcon,
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
  PhotoIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  // State for different sections
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Mock Data
  const stats = {
    totalStudents: 1247,
    totalTeachers: 48,
    totalSubjects: 32,
    totalMaterials: 156,
    totalAssignments: 89,
    totalSubmissions: 234,
    totalTasks: 67,
    recentNotices: 5,
  };

  const students = [
    { id: 1, name: 'John Doe', class: '10', section: 'A', studentId: 'STU-2024-001', status: 'Active' },
    { id: 2, name: 'Jane Smith', class: '9', section: 'B', studentId: 'STU-2024-002', status: 'Active' },
    { id: 3, name: 'Mike Johnson', class: '8', section: 'A', studentId: 'STU-2024-003', status: 'Inactive' },
    { id: 4, name: 'Sarah Williams', class: '10', section: 'C', studentId: 'STU-2024-004', status: 'Active' },
    { id: 5, name: 'David Brown', class: '7', section: 'B', studentId: 'STU-2024-005', status: 'Active' },
  ];

  const teachers = [
    { id: 1, name: 'Mr. Robert Wilson', email: 'robert@school.com', subjects: ['Mathematics', 'Physics'], classes: ['10', '9'] },
    { id: 2, name: 'Ms. Emily Davis', email: 'emily@school.com', subjects: ['English', 'Literature'], classes: ['8', '7'] },
    { id: 3, name: 'Dr. James Miller', email: 'james@school.com', subjects: ['Chemistry', 'Biology'], classes: ['10', '9'] },
  ];

  const subjects = [
    { 
      id: 1, 
      name: 'Computer Science', 
      teacher: 'Mr. Robert Wilson',
      chapters: ['Introduction to Programming', 'Data Structures', 'Algorithms', 'Database Management']
    },
    { 
      id: 2, 
      name: 'Mathematics', 
      teacher: 'Ms. Emily Davis',
      chapters: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus']
    },
    { 
      id: 3, 
      name: 'English', 
      teacher: 'Dr. James Miller',
      chapters: ['Grammar', 'Literature', 'Writing Skills', 'Communication']
    },
  ];

  const announcements = [
    { id: 1, title: 'School Holiday - May 1st', date: '2024-04-28', content: 'School will remain closed on May 1st due to Labor Day.' },
    { id: 2, title: 'Parent-Teacher Meeting', date: '2024-04-25', content: 'Parent-Teacher meeting scheduled for May 15th.' },
    { id: 3, title: 'Annual Sports Day', date: '2024-04-20', content: 'Annual Sports Day will be held on June 1st.' },
  ];

  const recentActivities = [
    { message: 'John Doe submitted Math homework', time: '2 hours ago' },
    { message: 'New teacher Mrs. Sarah joined', time: '5 hours ago' },
    { message: 'Computer Science exam scheduled', time: '1 day ago' },
    { message: '5 new students enrolled', time: '2 days ago' },
  ];

  // Helper Functions
  const toggleSubject = (id) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  const openModal = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setModalType('');
  };

  // Sidebar Navigation
  const Sidebar = () => (
    <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">🏫 SchoolLink</h1>
        <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
      </div>
      
      <nav className="mt-6 px-3">
        {[
          { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
          { id: 'students', icon: UsersIcon, label: 'Students' },
          { id: 'teachers', icon: AcademicCapIcon, label: 'Teachers' },
          { id: 'subjects', icon: BookOpenIcon, label: 'Subjects' },
          { id: 'announcements', icon: MegaphoneIcon, label: 'Announcements' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center w-full px-4 py-3 my-1 text-sm rounded-lg transition-colors ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400">Admin User</p>
          <p className="text-sm text-white">admin@school.com</p>
        </div>
      </div>
    </div>
  );

  // Stat Card Component
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
  const DashboardView = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your school.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={UsersIcon} label="Total Students" value={stats.totalStudents} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard icon={AcademicCapIcon} label="Total Teachers" value={stats.totalTeachers} color="text-green-600" bgColor="bg-green-100" />
        <StatCard icon={BookOpenIcon} label="Total Subjects" value={stats.totalSubjects} color="text-purple-600" bgColor="bg-purple-100" />
        <StatCard icon={DocumentTextIcon} label="Learning Materials" value={stats.totalMaterials} color="text-yellow-600" bgColor="bg-yellow-100" />
        <StatCard icon={ClipboardDocumentIcon} label="Total Assignments" value={stats.totalAssignments} color="text-pink-600" bgColor="bg-pink-100" />
        <StatCard icon={CheckCircleIcon} label="Homework Submissions" value={stats.totalSubmissions} color="text-indigo-600" bgColor="bg-indigo-100" />
        <StatCard icon={ClockIcon} label="Total Tasks" value={stats.totalTasks} color="text-red-600" bgColor="bg-red-100" />
        <StatCard icon={MegaphoneIcon} label="Recent Notices" value={stats.recentNotices} color="text-orange-600" bgColor="bg-orange-100" />
      </div>

      {/* Recent Activities & Quick Actions */}
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
  const StudentsView = () => (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage all students in your school</p>
        </div>
        <button onClick={() => openModal('student')} className="btn-primary inline-flex items-center">
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
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
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

  // Teachers View
  const TeachersView = () => (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">Manage all teachers in your school</p>
        </div>
        <button onClick={() => openModal('teacher')} className="btn-primary inline-flex items-center">
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
  const SubjectsView = () => (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-600 mt-1">Manage subjects and their chapters</p>
        </div>
        <button onClick={() => openModal('subject')} className="btn-primary inline-flex items-center">
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
  const AnnouncementsView = () => (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Manage school announcements</p>
        </div>
        <button onClick={() => openModal('announcement')} className="btn-primary inline-flex items-center">
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

  // Modal Component
  const Modal = () => {
    if (!showAddModal) return null;

    const getModalTitle = () => {
      switch(modalType) {
        case 'student': return 'Add New Student';
        case 'teacher': return 'Add New Teacher';
        case 'subject': return 'Create New Subject';
        case 'announcement': return 'Post New Announcement';
        default: return '';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{getModalTitle()}</h2>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter email" />
            </div>
            {modalType === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select Class</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select Section</option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>
              </>
            )}
            {modalType === 'subject' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter subject name" />
              </div>
            )}
            {modalType === 'announcement' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Write announcement content..."></textarea>
              </div>
            )}
            <button type="submit" className="w-full btn-primary">
              {modalType === 'student' ? 'Add Student' : 
               modalType === 'teacher' ? 'Add Teacher' : 
               modalType === 'subject' ? 'Create Subject' : 'Post Announcement'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'students' && <StudentsView />}
        {activeTab === 'teachers' && <TeachersView />}
        {activeTab === 'subjects' && <SubjectsView />}
        {activeTab === 'announcements' && <AnnouncementsView />}
      </div>
      <Modal />
    </div>
  );
};

export default AdminDashboard;