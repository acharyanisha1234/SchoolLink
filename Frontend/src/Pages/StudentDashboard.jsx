import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  MegaphoneIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import StudentSidebar from '../components/StudentSidebar';

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`${bgColor} p-3 rounded-lg`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data - replace with actual API data later
  const [studentData] = useState({
    totalTasks: 5,
    pendingTasks: 3,
    submittedHomework: 2,
    learningMaterials: 12,
    upcomingDeadlines: 4,
    attendancePercentage: 92,
    quizSummary: 3,
    recentNotices: 2
  });

  const recentActivities = [
    { message: 'Mathematics Assignment submitted successfully', time: '2 hours ago' },
    { message: 'New learning material added: Physics Chapter 5', time: '5 hours ago' },
    { message: 'Quiz: Computer Science MCQ scheduled for tomorrow', time: '1 day ago' },
    { message: 'Attendance marked for today - Present', time: '1 day ago' },
  ];

  const upcomingDeadlines = [
    { title: 'Mathematics Assignment', subject: 'Math', dueDate: '2026-08-18', status: 'Pending' },
    { title: 'Physics Lab Report', subject: 'Physics', dueDate: '2026-08-20', status: 'Pending' },
    { title: 'English Essay', subject: 'English', dueDate: '2026-08-22', status: 'Upcoming' },
  ];

  const handleLogout = () => {
    // Clear any authentication tokens/storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login
    navigate('/login');
  };

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Dashboard Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">Welcome back! Track your academic progress here.</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <BellIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                icon={ClipboardDocumentIcon} 
                label="Pending Tasks" 
                value={studentData.pendingTasks} 
                color="text-blue-600" 
                bgColor="bg-blue-100" 
              />
              <StatCard 
                icon={CheckCircleIcon} 
                label="Submitted Homework" 
                value={studentData.submittedHomework} 
                color="text-green-600" 
                bgColor="bg-green-100" 
              />
              <StatCard 
                icon={BookOpenIcon} 
                label="Learning Materials" 
                value={studentData.learningMaterials} 
                color="text-purple-600" 
                bgColor="bg-purple-100" 
              />
              <StatCard 
                icon={CalendarIcon} 
                label="Upcoming Deadlines" 
                value={studentData.upcomingDeadlines} 
                color="text-red-600" 
                bgColor="bg-red-100" 
              />
              <StatCard 
                icon={UsersIcon} 
                label="Attendance %" 
                value={`${studentData.attendancePercentage}%`} 
                color="text-indigo-600" 
                bgColor="bg-indigo-100" 
              />
              <StatCard 
                icon={PencilSquareIcon} 
                label="Quiz Summary" 
                value={studentData.quizSummary} 
                color="text-pink-600" 
                bgColor="bg-pink-100" 
              />
              <StatCard 
                icon={MegaphoneIcon} 
                label="Recent Notices" 
                value={studentData.recentNotices} 
                color="text-orange-600" 
                bgColor="bg-orange-100" 
              />
              <StatCard 
                icon={DocumentArrowDownIcon} 
                label="Total Submissions" 
                value={studentData.submittedHomework + 2} 
                color="text-teal-600" 
                bgColor="bg-teal-100" 
              />
            </div>

            {/* Recent Activities and Deadlines */}
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                          <p className="text-xs text-gray-500">{deadline.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{deadline.dueDate}</p>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            deadline.status === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {deadline.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-blue-700">
                <BookOpenIcon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium block">View Materials</span>
              </button>
              <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-green-700">
                <ClipboardDocumentIcon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium block">Submit Homework</span>
              </button>
              <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-purple-700">
                <PencilSquareIcon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium block">Attempt Quiz</span>
              </button>
              <button className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-orange-700">
                <ChartBarIcon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium block">View Results</span>
              </button>
            </div>
          </>
        );
      case 'tasks':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600 mt-1">View and manage all your assigned tasks</p>
            {/* Add tasks content here */}
          </div>
        );
      case 'materials':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Materials</h1>
            <p className="text-gray-600 mt-1">Access all your course materials</p>
            {/* Add materials content here */}
          </div>
        );
      case 'submissions':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
            <p className="text-gray-600 mt-1">Track all your homework and assignment submissions</p>
            {/* Add submissions content here */}
          </div>
        );
      case 'deadlines':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deadlines</h1>
            <p className="text-gray-600 mt-1">View upcoming and overdue deadlines</p>
            {/* Add deadlines content here */}
          </div>
        );
      case 'quizzes':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
            <p className="text-gray-600 mt-1">Attempt quizzes and view your results</p>
            {/* Add quizzes content here */}
          </div>
        );
      case 'attendance':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-600 mt-1">View your attendance records and percentage</p>
            {/* Add attendance content here */}
          </div>
        );
      case 'results':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Results</h1>
            <p className="text-gray-600 mt-1">View your marks, grades, and teacher remarks</p>
            {/* Add results content here */}
          </div>
        );
      case 'announcements':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600 mt-1">View school and class announcements</p>
            {/* Add announcements content here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <div className="flex-1 ml-64 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;