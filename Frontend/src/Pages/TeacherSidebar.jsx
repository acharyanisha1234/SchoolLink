import React from 'react';
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

const TeacherSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 overflow-y-auto flex flex-col">
      {/* Branding */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">🏫 SchoolLink</h1>
        <p className="text-sm text-gray-400 mt-1">Teacher Dashboard</p>
      </div>

      {/* Navigation */}
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

      {/* User Info */}
      <div className="w-full p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400">Teacher User</p>
          <p className="text-sm text-white">teacher@school.com</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSidebar;