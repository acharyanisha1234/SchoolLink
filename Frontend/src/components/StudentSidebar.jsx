import React from 'react';
import {
  HomeIcon,
  BookOpenIcon,
  ClipboardDocumentIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  PencilSquareIcon,
  UserGroupIcon,
  ChartBarIcon,
  MegaphoneIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const StudentSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'tasks', label: 'My Tasks', icon: ClipboardDocumentIcon },
    { id: 'materials', label: 'Learning Materials', icon: BookOpenIcon },
    { id: 'submissions', label: 'My Submissions', icon: DocumentArrowDownIcon },
    { id: 'deadlines', label: 'Deadlines', icon: CalendarIcon },
    { id: 'quizzes', label: 'Quizzes', icon: PencilSquareIcon },
    { id: 'attendance', label: 'Attendance', icon: UserGroupIcon },
    { id: 'results', label: 'Results', icon: ChartBarIcon },
    { id: 'announcements', label: 'Announcements', icon: MegaphoneIcon },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">🏫 SchoolLink</h1>
        <p className="text-sm text-gray-400 mt-1">Student Dashboard</p>
      </div>

      <nav className="mt-6 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center w-full px-4 py-3 my-1 text-sm rounded-lg transition-colors ${
              activeTab === item.id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400">Student User</p>
          <p className="text-sm text-white">student@school.com</p>
          <button
            onClick={onLogout}
            className="mt-2 flex items-center text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;