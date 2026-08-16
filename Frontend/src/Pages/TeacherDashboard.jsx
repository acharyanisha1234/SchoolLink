import React, { useState } from 'react';
import {
  ArrowRightOnRectangleIcon,
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  MegaphoneIcon,
  BellIcon,
  UserPlusIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,   
  ChartBarIcon,    
} from '@heroicons/react/24/outline';
import TeacherSidebar from './TeacherSidebar';

// Stat Card 
const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

//  Placeholder View 
const PlaceholderView = ({ title, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
    <Icon className="h-16 w-16 text-gray-300 mb-4" />
    <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
    <p className="text-gray-400 text-sm mt-1">Content coming soon...</p>
  </div>
);

// ── Main Teacher Dashboard ──────────────────────────────
const TeacherDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // ── Mock Stats ──────────────────────────────────────────
  const stats = {
    todayTasks: 4,
    totalTasks: 23,
    assignedSubjects: 5,
    materialsUploaded: 12,
    recentSubmissions: 8,
    pendingReviews: 6,
    upcomingDeadlines: 3,
    attendanceSummary: '92%',
  };

  // ── Mock Recent Activities ─────────────────────────────
  const recentActivities = [
    { message: 'John Doe submitted homework for Mathematics', time: '2 min ago' },
    { message: 'New assignment created: Chapter 5 Quiz', time: '15 min ago' },
    { message: 'Sarah Lee reviewed 3 pending assignments', time: '1 hour ago' },
    { message: 'Attendance marked for Class 10-A', time: '3 hours ago' },
    { message: 'Learning material uploaded: PPT - Algebra', time: '5 hours ago' },
  ];

  // ── Render Content Based on Active Tab ──────────────────
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back! Here's your teaching summary.
                </p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={ClipboardDocumentIcon}
                label="Today's Tasks"
                value={stats.todayTasks}
                color="text-blue-600"
                bgColor="bg-blue-100"
              />
              <StatCard
                icon={CheckCircleIcon}
                label="Total Tasks Created"
                value={stats.totalTasks}
                color="text-green-600"
                bgColor="bg-green-100"
              />
              <StatCard
                icon={BookOpenIcon}
                label="Assigned Subjects"
                value={stats.assignedSubjects}
                color="text-purple-600"
                bgColor="bg-purple-100"
              />
              <StatCard
                icon={DocumentTextIcon}
                label="Materials Uploaded"
                value={stats.materialsUploaded}
                color="text-yellow-600"
                bgColor="bg-yellow-100"
              />
              <StatCard
                icon={UserGroupIcon}
                label="Recent Submissions"
                value={stats.recentSubmissions}
                color="text-pink-600"
                bgColor="bg-pink-100"
              />
              <StatCard
                icon={PencilSquareIcon}
                label="Pending Reviews"
                value={stats.pendingReviews}
                color="text-indigo-600"
                bgColor="bg-indigo-100"
              />
              <StatCard
                icon={ClockIcon}
                label="Upcoming Deadlines"
                value={stats.upcomingDeadlines}
                color="text-red-600"
                bgColor="bg-red-100"
              />
              <StatCard
                icon={UsersIcon}
                label="Attendance Summary"
                value={stats.attendanceSummary}
                color="text-orange-600"
                bgColor="bg-orange-100"
              />
            </div>

            {/* Bottom Row: Recent Activities + Quick Actions */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Activities
                  </h2>
                  <BellIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                    >
                      <p className="text-sm text-gray-800">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('subjects')}
                    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-700"
                  >
                    <BookOpenIcon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Create Subject</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-green-700"
                  >
                    <DocumentTextIcon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Upload Material</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-purple-700"
                  >
                    <ClipboardDocumentIcon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Create Task</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-orange-700"
                  >
                    <UserGroupIcon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Take Attendance</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        );

      // ── Placeholder views for other tabs ────────────────
      case 'subjects':
        return <PlaceholderView title="Subject Management" icon={BookOpenIcon} />;
      case 'materials':
        return <PlaceholderView title="Learning Materials" icon={DocumentTextIcon} />;
      case 'tasks':
        return <PlaceholderView title="Tasks & Assignments" icon={ClipboardDocumentIcon} />;
      case 'homework':
        return <PlaceholderView title="Homework Management" icon={CheckCircleIcon} />;
      case 'review':
        return <PlaceholderView title="Assignment Review & Feedback" icon={PencilSquareIcon} />;
      case 'quizzes':
        return <PlaceholderView title="Quiz Management" icon={QuestionMarkCircleIcon} />;
      case 'attendance':
        return <PlaceholderView title="Attendance Management" icon={UserGroupIcon} />;
      case 'grades':
        return <PlaceholderView title="Grades & Results" icon={ChartBarIcon} />;
      case 'announcements':
        return <PlaceholderView title="Announcements" icon={MegaphoneIcon} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <TeacherSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">{renderContent()}</div>
    </div>
  );
};

export default TeacherDashboard;