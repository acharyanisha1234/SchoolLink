import React, { useState } from 'react';
import {
  HomeIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  MegaphoneIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { id: 'subjects', label: 'Subjects', icon: BookOpenIcon },
  { id: 'materials', label: 'Learning Materials', icon: DocumentTextIcon },
  { id: 'tasks', label: 'Tasks & Assignments', icon: ClipboardDocumentIcon },
  { id: 'homework', label: 'Homework', icon: CheckCircleIcon },
  { id: 'review', label: 'Assignment Review', icon: PencilSquareIcon },
  { id: 'quizzes', label: 'Quizzes', icon: QuestionMarkCircleIcon },
  { id: 'attendance', label: 'Attendance', icon: UserGroupIcon },
  { id: 'grades', label: 'Grades & Results', icon: ChartBarIcon },
  { id: 'announcements', label: 'Announcements', icon: MegaphoneIcon },
];

const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Settings</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user?.name || 'Teacher'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user?.email || 'teacher@school.com'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">Teacher</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherSidebar = ({ activeTab, setActiveTab, userEmail, userName }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const user = { name: userName || 'Teacher', email: userEmail || 'teacher@school.com' };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 overflow-y-auto flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">🏫 SchoolLink</h1>
        <p className="text-sm text-gray-400 mt-1">Teacher Dashboard</p>
      </div>

      <nav className="mt-6 px-3 flex-1">
        {menuItems.map((item) => (
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

      <div className="w-full p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-3">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            {dropdownOpen ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {dropdownOpen && (
            <div className="mt-3 pt-3 border-t border-gray-700 space-y-2">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setProfileModalOpen(true);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <UserCircleIcon className="h-5 w-5 mr-2" />
                Profile Settings
              </button>
            </div>
          )}
        </div>
      </div>

      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} user={user} />
    </div>
  );
};

export default TeacherSidebar;