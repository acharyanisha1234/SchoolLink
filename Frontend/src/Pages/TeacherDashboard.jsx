import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon, BookOpenIcon, UsersIcon, ClipboardDocumentListIcon,
  ChartBarIcon, ArrowPathIcon,
} from '@heroicons/react/24/outline';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = { fullName: 'Dr. Kavita Rao', role: 'TEACHER' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Simple placeholder content for each tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-600 mt-2">Welcome back, {user.fullName}!</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow">Subjects: 3</div>
              <div className="bg-white p-4 rounded-xl shadow">Assignments: 12</div>
              <div className="bg-white p-4 rounded-xl shadow">Quizzes: 8</div>
              <div className="bg-white p-4 rounded-xl shadow">Attendance: 94%</div>
            </div>
          </div>
        );
      case 'subjects':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Subjects</h2>
            <p className="text-gray-600 mt-2">List of subjects will appear here.</p>
            <ul className="mt-4 space-y-2">
              <li className="bg-white p-3 rounded-xl shadow">Mathematics</li>
              <li className="bg-white p-3 rounded-xl shadow">Physics</li>
              <li className="bg-white p-3 rounded-xl shadow">Computer Science</li>
            </ul>
          </div>
        );
      case 'assignments':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
            <p className="text-gray-600 mt-2">Manage assignments here.</p>
          </div>
        );
      case 'quizzes':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quizzes</h2>
            <p className="text-gray-600 mt-2">Quiz management coming soon.</p>
          </div>
        );
      case 'attendance':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
            <p className="text-gray-600 mt-2">Attendance records will be shown here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'subjects', label: 'Subjects', icon: BookOpenIcon },
    { id: 'assignments', label: 'Assignments', icon: ClipboardDocumentListIcon },
    { id: 'quizzes', label: 'Quizzes', icon: ChartBarIcon },
    { id: 'attendance', label: 'Attendance', icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col fixed h-full z-30 border-r border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-700">SchoolLink</h1>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Teacher Portal</p>
        </div>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-400">Mathematics Teacher</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <ArrowPathIcon className="h-5 w-5 rotate-45" />
              Logout
            </button>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">v2.4.1 © 2024</div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        {renderContent()}
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;