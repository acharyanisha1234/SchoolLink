import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon, BookOpenIcon, UsersIcon, ClipboardDocumentListIcon,
  DocumentTextIcon, ChartBarIcon, PlusIcon, PencilIcon, TrashIcon,
  ChevronDownIcon, ChevronRightIcon, CalendarIcon,
  ArrowPathIcon, SparklesIcon, ArrowTrendingUpIcon,
  ArrowTrendingDownIcon, XMarkIcon, ClockIcon,
} from '@heroicons/react/24/outline';
import { teacherApi } from '../api/teacherApi';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Data states
  const [dashboardData, setDashboardData] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Load user
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const parsed = JSON.parse(userString);
        setUser(parsed);
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    setLoading(false);
  }, []);

  // Redirect if not TEACHER
  useEffect(() => {
    if (!user) return;
    if (String(user.role || '').toUpperCase() !== 'TEACHER') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch data
  useEffect(() => {
    if (user && String(user.role || '').toUpperCase() === 'TEACHER') {
      fetchDashboard();
      fetchSubjects();
      fetchAssignments();
      fetchQuizzes();
      fetchAttendance();
    }
  }, [user]);

  // Fetch chapters when subject expanded
  useEffect(() => {
    if (expandedSubject && !chapters[expandedSubject]) {
      fetchChapters(expandedSubject);
    }
  }, [expandedSubject]);

  // --- API Functions ---
  const fetchDashboard = async () => {
    try {
      const res = await teacherApi.getDashboard();
      if (res.success) setDashboardData(res.data);
    } catch (error) { showToast('Failed to load dashboard', 'error'); }
  };

  const fetchSubjects = async () => {
    try {
      const res = await teacherApi.getSubjects();
      if (res.success) setSubjects(res.data);
    } catch (error) { showToast('Failed to load subjects', 'error'); }
  };

  const fetchChapters = async (subjectId) => {
    try {
      const res = await teacherApi.getChapters(subjectId);
      if (res.success) setChapters(prev => ({ ...prev, [subjectId]: res.data }));
    } catch (error) { showToast('Failed to load chapters', 'error'); }
  };

  const fetchAssignments = async () => {
    try {
      const res = await teacherApi.getAssignments();
      if (res.success) setAssignments(res.data);
    } catch (error) { showToast('Failed to load assignments', 'error'); }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await teacherApi.getQuizzes();
      if (res.success) setQuizzes(res.data);
    } catch (error) { showToast('Failed to load quizzes', 'error'); }
  };

  const fetchAttendance = async () => {
    try {
      const res = await teacherApi.getAttendance({});
      if (res.success) setAttendanceData(res.data);
    } catch (error) { showToast('Failed to load attendance', 'error'); }
  };

  // --- Toast helper ---
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  // --- Modal helpers ---
  const openModal = (type, data = {}, id = null) => {
    setModalType(type);
    setModalData(data);
    setEditingId(id);
    setFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData({});
    setEditingId(null);
    setFile(null);
    setFormLoading(false);
  };

  // --- CRUD Handlers ---
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = { title: formData.get('title'), description: formData.get('description') };
    setFormLoading(true);
    try {
      let res;
      if (editingId) {
        res = await teacherApi.updateSubject(editingId, payload);
      } else {
        res = await teacherApi.createSubject(payload);
      }
      if (res.success) {
        showToast(editingId ? 'Subject updated!' : 'Subject created!', 'success');
        fetchSubjects();
        closeModal();
      } else {
        showToast(res.message || 'Error', 'error');
      }
    } catch (err) { showToast('Server error', 'error'); }
    setFormLoading(false);
  };

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      title: formData.get('title'),
      content: formData.get('content') || '',
      order: parseInt(formData.get('order')) || 0,
      subjectId: formData.get('subjectId'),
    };
    setFormLoading(true);
    try {
      let res;
      if (editingId) {
        res = await teacherApi.updateChapter(editingId, payload);
      } else {
        res = await teacherApi.createChapter(payload);
      }
      if (res.success) {
        showToast(editingId ? 'Chapter updated!' : 'Chapter created!', 'success');
        fetchChapters(payload.subjectId);
        closeModal();
      } else {
        showToast(res.message || 'Error', 'error');
      }
    } catch (err) { showToast('Server error', 'error'); }
    setFormLoading(false);
  };

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const chapterId = formData.get('chapterId');
    if (!file) {
      showToast('Please select a file', 'error');
      return;
    }
    formData.append('file', file);
    setFormLoading(true);
    try {
      const res = await teacherApi.createMaterial(formData);
      if (res.success) {
        showToast('Material uploaded!', 'success');
        fetchMaterials(chapterId);
        closeModal();
      } else {
        showToast(res.message || 'Error uploading', 'error');
      }
    } catch (err) { showToast('Server error', 'error'); }
    setFormLoading(false);
  };

  const fetchMaterials = async (chapterId) => {
    try {
      const res = await teacherApi.getMaterials(chapterId);
      if (res.success) setMaterials(prev => ({ ...prev, [chapterId]: res.data }));
    } catch (error) { showToast('Failed to load materials', 'error'); }
  };

  const [materials, setMaterials] = useState({});

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      type: formData.get('type') || 'Assignment',
      deadline: formData.get('deadline'),
      chapterId: formData.get('chapterId'),
      referenceFiles: formData.get('referenceFiles') ? [formData.get('referenceFiles')] : [],
    };
    setFormLoading(true);
    try {
      let res;
      if (editingId) {
        res = await teacherApi.updateAssignment(editingId, payload);
      } else {
        res = await teacherApi.createAssignment(payload);
      }
      if (res.success) {
        showToast(editingId ? 'Assignment updated!' : 'Assignment created!', 'success');
        fetchAssignments();
        closeModal();
      } else {
        showToast(res.message || 'Error', 'error');
      }
    } catch (err) { showToast('Server error', 'error'); }
    setFormLoading(false);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let questions = [];
    try {
      questions = JSON.parse(formData.get('questions') || '[]');
    } catch { questions = []; }
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      timeLimit: parseInt(formData.get('timeLimit')) || 30,
      deadline: formData.get('deadline'),
      chapterId: formData.get('chapterId'),
      questions,
    };
    setFormLoading(true);
    try {
      let res;
      if (editingId) {
        res = await teacherApi.updateQuiz(editingId, payload);
      } else {
        res = await teacherApi.createQuiz(payload);
      }
      if (res.success) {
        showToast(editingId ? 'Quiz updated!' : 'Quiz created!', 'success');
        fetchQuizzes();
        closeModal();
      } else {
        showToast(res.message || 'Error', 'error');
      }
    } catch (err) { showToast('Server error', 'error'); }
    setFormLoading(false);
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      studentId: formData.get('studentId'),
      subjectId: formData.get('subjectId'),
      status: formData.get('status'),
      date: formData.get('date') || undefined,
    };
    setFormLoading(true);
    try {
      const res = await teacherApi.markAttendance(payload);
      if (res.success) {
        showToast('Attendance marked!', 'success');
        fetchAttendance();
        closeModal();
      } else {
        showToast(res.message || 'Error', 'error');
      }
    } catch (err) { showToast('Server error', 'error'); }
    setFormLoading(false);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      let res;
      if (type === 'subject') res = await teacherApi.deleteSubject(id);
      else if (type === 'chapter') res = await teacherApi.deleteChapter(id);
      else if (type === 'material') res = await teacherApi.deleteMaterial(id);
      else if (type === 'assignment') res = await teacherApi.deleteAssignment(id);
      else if (type === 'quiz') res = await teacherApi.deleteQuiz(id);
      if (res.success) {
        showToast('Deleted successfully!', 'success');
        if (type === 'subject') fetchSubjects();
        else if (type === 'chapter') fetchChapters(expandedSubject);
        else if (type === 'material') { /* refresh materials */ }
        else if (type === 'assignment') fetchAssignments();
        else if (type === 'quiz') fetchQuizzes();
      } else {
        showToast(res.message || 'Error deleting', 'error');
      }
    } catch (err) { showToast('Server error', 'error'); }
  };

  const handlePublishQuiz = async (id) => {
    try {
      const res = await teacherApi.publishQuiz(id);
      if (res.success) {
        showToast('Quiz published!', 'success');
        fetchQuizzes();
      } else {
        showToast(res.message || 'Error publishing', 'error');
      }
    } catch (err) { showToast('Server error', 'error'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // --- Mock data for charts (can be replaced with real API data later) ---
  const weeklyData = [
    { day: 'Mon', assignments: 12, materials: 8, quizzes: 4 },
    { day: 'Tue', assignments: 10, materials: 12, quizzes: 6 },
    { day: 'Wed', assignments: 14, materials: 6, quizzes: 8 },
    { day: 'Thu', assignments: 8, materials: 10, quizzes: 10 },
    { day: 'Fri', assignments: 16, materials: 14, quizzes: 12 },
  ];

  const scheduleData = [
    { time: '8:00 AM', subject: 'Mathematics', room: 'Room 201', classInfo: 'X-A', status: 'completed' },
    { time: '10:30 AM', subject: 'Mathematics', room: 'Room 202', classInfo: 'X-B', status: 'ongoing' },
    { time: '1:30 PM', subject: 'Physics', room: 'Room 103', classInfo: 'IX-A', status: 'upcoming' },
    { time: '2:30 PM', subject: 'Computer Science', room: 'Room 105', classInfo: 'X-A', status: 'upcoming' },
  ];

  const pendingReviews = [
    { title: 'Quadratic Equations...', classInfo: 'X-A · Mathematics', count: 5 },
    { title: "Newton's Laws of M...", classInfo: 'X-A · Physics', count: 15 },
    { title: 'Essay: The Great G...', classInfo: 'IX-A · English', count: 34 },
    { title: 'Python Data Structu...', classInfo: 'IX-B · Computer Science', count: 12 },
  ];

  const subjectSubmissionData = [
    { subject: 'Physics', pending: 8, submitted: 24 },
    { subject: 'Biology', pending: 12, submitted: 18 },
    { subject: 'CS', pending: 4, submitted: 28 },
  ];

  // ======================== STAT CARD COMPONENT ========================
  const StatCard = ({ title, value, subtitle, icon, color, trend, trendUp }) => (
    <div className={`bg-linear-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-white/70 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">{icon}</div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trendUp ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
          <span className="font-medium">{trend}</span>
          <span className="opacity-80">vs last week</span>
        </div>
      )}
    </div>
  );

  // ======================== QUICK ACTION CARD ========================
  const ActionCard = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-200 hover:border-blue-300 hover:-translate-y-1"
    >
      <div className="text-4xl mb-1">{icon}</div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
    </button>
  );

  // ======================== SCHEDULE ITEM ========================
  const ScheduleItem = ({ time, subject, room, classInfo, status }) => {
    const statusColors = {
      completed: 'bg-green-100 text-green-700',
      ongoing: 'bg-yellow-100 text-yellow-700',
      upcoming: 'bg-gray-100 text-gray-500',
    };
    const statusIcons = {
      completed: '✅',
      ongoing: '🔄',
      upcoming: '⏳',
    };
    return (
      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
        <div className="w-20 text-sm font-medium text-gray-700">{time}</div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{subject}</p>
          <p className="text-xs text-gray-500">{classInfo} · {room}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[status]}`}>
          {statusIcons[status]} {status}
        </span>
      </div>
    );
  };

  // ======================== GOAL ITEM ========================
  const GoalItem = ({ label, current, total }) => {
    const percentage = Math.min(Math.round((current / total) * 100), 100);
    const isComplete = percentage >= 100;
    return (
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-600">{label}</span>
          <span className="text-gray-800 font-medium">{current}/{total}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`rounded-full h-2.5 transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-blue-600'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  // ======================== REVIEW CARD ========================
  const ReviewCard = ({ title, classInfo, count, onClick }) => (
    <div
      className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-blue-300 transition-all duration-200 cursor-pointer hover:shadow-md"
      onClick={onClick}
    >
      <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
      <p className="text-xs text-gray-500 mt-1">{classInfo}</p>
      <div className="flex items-center gap-3 mt-3">
        <span className="text-sm font-bold text-orange-600">{count} new</span>
        <button className="text-xs text-blue-600 font-medium hover:underline">Review →</button>
      </div>
    </div>
  );

  // ======================== DASHBOARD VIEW ========================
  const DashboardView = () => (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Dashboard <SparklesIcon className="h-6 w-6 text-yellow-500" />
          </h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.fullName?.split(' ')[0] || 'Teacher'}!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {user?.fullName?.charAt(0) || 'T'}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="158"
          subtitle="+12 this month"
          color="from-blue-500 to-blue-700"
          icon={<UsersIcon className="h-6 w-6" />}
          trend="5%"
          trendUp
        />
        <StatCard
          title="My Subjects"
          value={dashboardData.totalSubjects || 0}
          subtitle="3 active"
          color="from-purple-500 to-purple-700"
          icon={<BookOpenIcon className="h-6 w-6" />}
          trend="1 new"
          trendUp
        />
        <StatCard
          title="Learning Materials"
          value={dashboardData.totalMaterials || 0}
          subtitle="1,056 total views"
          color="from-emerald-500 to-emerald-700"
          icon={<DocumentTextIcon className="h-6 w-6" />}
          trend="12%"
          trendUp
        />
        <StatCard
          title="Pending Reviews"
          value="5"
          subtitle="5 new submissions"
          color="from-rose-500 to-rose-700"
          icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
          trend="2 less"
          trendUp={false}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ActionCard icon="📋" label="Take Attendance" onClick={() => openModal('attendance')} />
          <ActionCard icon="📤" label="Upload Material" onClick={() => openModal('material')} />
          <ActionCard icon="📝" label="New Assignment" onClick={() => openModal('assignment')} />
          <ActionCard icon="📊" label="Create Quiz" onClick={() => openModal('quiz')} />
          <ActionCard icon="📈" label="Publish Result" onClick={() => showToast('Publish Result feature coming soon!', 'info')} />
          <ActionCard icon="💬" label="Start Discussion" onClick={() => showToast('Start Discussion feature coming soon!', 'info')} />
          <ActionCard icon="📅" label="Schedule Event" onClick={() => showToast('Schedule Event feature coming soon!', 'info')} />
          <ActionCard icon="📊" label="View Analytics" onClick={() => showToast('View Analytics feature coming soon!', 'info')} />
        </div>
      </div>

      {/* Activity Overview */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Activity Overview</h3>
          <p className="text-sm text-gray-400">Teaching performance insights</p>
        </div>
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full font-medium">Weekly</button>
          <button className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition">Attendance</button>
          <button className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition">Performance</button>
        </div>
        <div className="flex items-end justify-between h-40 gap-3 px-2">
          {weeklyData.map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-0.5">
                <div className="w-6 bg-blue-500 rounded-t-sm" style={{ height: `${item.assignments * 2}px` }}></div>
                <div className="w-6 bg-emerald-500 rounded-t-sm" style={{ height: `${item.materials * 2}px` }}></div>
                <div className="w-6 bg-purple-500 rounded-t-sm" style={{ height: `${item.quizzes * 2}px` }}></div>
              </div>
              <span className="text-xs text-gray-400 mt-1 font-medium">{item.day}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
          <span><span className="inline-block w-3 h-3 bg-blue-500 rounded mr-1"></span> Assignments</span>
          <span><span className="inline-block w-3 h-3 bg-emerald-500 rounded mr-1"></span> Materials</span>
          <span><span className="inline-block w-3 h-3 bg-purple-500 rounded mr-1"></span> Quizzes</span>
        </div>
      </div>

      {/* Schedule + Goals */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline" onClick={() => setActiveTab('attendance')}>View All →</button>
          </div>
          <div className="space-y-2">
            {scheduleData.map((item, idx) => (
              <ScheduleItem key={idx} {...item} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goals</h3>
          <div className="space-y-3">
            <GoalItem label="Assignments Reviewed" current={28} total={34} />
            <GoalItem label="Quizzes Created" current={2} total={3} />
            <GoalItem label="Materials Uploaded" current={5} total={5} />
            <GoalItem label="Classes Attended" current={18} total={20} />
          </div>
          <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <p className="text-sm text-emerald-700 font-medium">Great progress this week! ✨</p>
            <p className="text-xs text-emerald-600">You've completed 3 of 4 weekly targets.</p>
          </div>
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Pending Reviews</h3>
          <button className="text-sm text-blue-600 font-medium hover:underline" onClick={() => setActiveTab('assignments')}>View All →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pendingReviews.map((item, idx) => (
            <ReviewCard key={idx} {...item} onClick={() => showToast(`Reviewing ${item.title}`, 'info')} />
          ))}
        </div>
      </div>

      {/* Assignment Submission Rate */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Assignment Submission Rate by Subject</h3>
          <p className="text-sm text-gray-400">Current semester progress</p>
        </div>
        <div className="space-y-4">
          {subjectSubmissionData.map((item) => {
            const total = item.pending + item.submitted;
            const pendingPct = (item.pending / total) * 100;
            const submittedPct = (item.submitted / total) * 100;
            return (
              <div key={item.subject}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{item.subject}</span>
                  <span className="text-gray-500">{item.submitted} / {total} submitted</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden flex">
                  <div
                    className="bg-amber-400 h-full flex items-center justify-center text-xs text-amber-800 font-medium transition-all duration-500"
                    style={{ width: `${pendingPct}%` }}
                  >
                    {pendingPct > 0 && `${Math.round(pendingPct)}% Pending`}
                  </div>
                  <div
                    className="bg-emerald-500 h-full flex items-center justify-center text-xs text-white font-medium transition-all duration-500"
                    style={{ width: `${submittedPct}%` }}
                  >
                    {submittedPct > 0 && `${Math.round(submittedPct)}% Submitted`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
          <span><span className="inline-block w-3 h-3 bg-amber-400 rounded mr-1"></span> Pending</span>
          <span><span className="inline-block w-3 h-3 bg-emerald-500 rounded mr-1"></span> Submitted</span>
        </div>
        <div className="mt-4 text-center">
          <button
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition shadow-sm hover:shadow-md"
            onClick={() => openModal('assignment')}
          >
            + Create Assignment
          </button>
        </div>
      </div>
    </div>
  );

  // ======================== SUBJECTS VIEW ========================
  const SubjectsView = () => (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Subjects</h1>
          <p className="text-gray-500 mt-1">Manage subjects and chapters</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2" onClick={() => openModal('subject')}>
          <PlusIcon className="h-5 w-5" /> Create Subject
        </button>
      </div>
      <div className="space-y-4">
        {subjects.map(subject => (
          <div key={subject._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedSubject(expandedSubject === subject._id ? null : subject._id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {expandedSubject === subject._id ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{subject.title}</h3>
                    <p className="text-sm text-gray-500">{subject.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={(e) => { e.stopPropagation(); openModal('subject', subject, subject._id); }}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleDelete('subject', subject._id); }}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="ml-9 mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><DocumentTextIcon className="h-4 w-4" /> {subject.materials || 0} materials</span>
                <span className="flex items-center gap-1"><ClipboardDocumentListIcon className="h-4 w-4" /> {subject.tasks || 0} tasks</span>
              </div>
            </div>
            {expandedSubject === subject._id && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Chapters</h4>
                  <button
                    className="text-sm text-blue-600 hover:underline font-medium"
                    onClick={() => openModal('chapter', { subjectId: subject._id })}
                  >
                    + Add Chapter
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(chapters[subject._id] || []).map((ch, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-800">{ch.title}</span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          onClick={() => openModal('chapter', { ...ch, subjectId: subject._id }, ch._id)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          onClick={() => handleDelete('chapter', ch._id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
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

  // ======================== SIMPLE VIEWS ========================
  const SimpleView = ({ title, description, addButton, addAction }) => (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-1">{description}</p>
        </div>
        {addButton && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
            onClick={addAction}
          >
            <PlusIcon className="h-5 w-5" /> {addButton}
          </button>
        )}
      </div>
      <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
        <p className="text-gray-400">No {title.toLowerCase()} yet. Click the button above to create one.</p>
      </div>
    </div>
  );

  // ======================== SIDEBAR ========================
  const Sidebar = () => {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
      { id: 'subjects', label: 'My Subjects', icon: BookOpenIcon },
      { id: 'assignments', label: 'Assignments', icon: ClipboardDocumentListIcon },
      { id: 'quizzes', label: 'Quizzes', icon: ChartBarIcon },
      { id: 'attendance', label: 'Attendance', icon: UsersIcon },
    ];
    return (
      <aside className="w-64 bg-white shadow-lg flex flex-col fixed h-full z-30 border-r border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-700">SchoolLink</h1>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Teacher Portal</p>
        </div>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.fullName?.charAt(0) || 'T'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.fullName || 'Teacher'}</p>
              <p className="text-xs text-gray-400">Mathematics Teacher</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <ArrowPathIcon className="h-5 w-5 rotate-45" />
              Logout
            </button>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">v2.4.1 © 2024 SchoolLink</div>
      </aside>
    );
  };

  // ======================== MODAL COMPONENT ========================
  const Modal = () => {
    if (!showModal) return null;

    const getTitle = () => {
      switch (modalType) {
        case 'subject': return editingId ? 'Edit Subject' : 'Create Subject';
        case 'chapter': return editingId ? 'Edit Chapter' : 'Add Chapter';
        case 'material': return 'Upload Material';
        case 'assignment': return editingId ? 'Edit Assignment' : 'Create Assignment';
        case 'quiz': return editingId ? 'Edit Quiz' : 'Create Quiz';
        case 'attendance': return 'Mark Attendance';
        default: return '';
      }
    };

    const renderForm = () => {
      switch (modalType) {
        case 'subject':
          return (
            <form onSubmit={handleSubjectSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Subject Title" defaultValue={modalData.title || ''} className="w-full border rounded-xl px-4 py-2" required />
              <textarea name="description" placeholder="Description" defaultValue={modalData.description || ''} className="w-full border rounded-xl px-4 py-2" rows="3" />
              <button type="submit" disabled={formLoading} className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                {formLoading ? 'Saving...' : (editingId ? 'Update Subject' : 'Create Subject')}
              </button>
            </form>
          );
        case 'chapter':
          return (
            <form onSubmit={handleChapterSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Chapter Title" defaultValue={modalData.title || ''} className="w-full border rounded-xl px-4 py-2" required />
              <textarea name="content" placeholder="Content (optional)" defaultValue={modalData.content || ''} className="w-full border rounded-xl px-4 py-2" rows="3" />
              <input type="number" name="order" placeholder="Order" defaultValue={modalData.order || 0} className="w-full border rounded-xl px-4 py-2" />
              <input type="hidden" name="subjectId" value={modalData.subjectId || ''} />
              <button type="submit" disabled={formLoading} className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                {formLoading ? 'Saving...' : (editingId ? 'Update Chapter' : 'Add Chapter')}
              </button>
            </form>
          );
        case 'material':
          return (
            <form onSubmit={handleMaterialSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Material Title" defaultValue={modalData.title || ''} className="w-full border rounded-xl px-4 py-2" required />
              <textarea name="description" placeholder="Description" defaultValue={modalData.description || ''} className="w-full border rounded-xl px-4 py-2" rows="3" />
              <select name="type" className="w-full border rounded-xl px-4 py-2">
                <option value="PDF">PDF</option>
                <option value="PPT">PPT</option>
                <option value="Video">Video</option>
                <option value="Image">Image</option>
                <option value="Document">Document</option>
                <option value="Other">Other</option>
              </select>
              <select name="chapterId" className="w-full border rounded-xl px-4 py-2" required>
                <option value="">Select Chapter</option>
                {Object.values(chapters).flat().map(ch => <option key={ch._id} value={ch._id}>{ch.title}</option>)}
              </select>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full border rounded-xl px-4 py-2" required />
              <button type="submit" disabled={formLoading} className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                {formLoading ? 'Uploading...' : 'Upload Material'}
              </button>
            </form>
          );
        case 'assignment':
          return (
            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Assignment Title" defaultValue={modalData.title || ''} className="w-full border rounded-xl px-4 py-2" required />
              <textarea name="description" placeholder="Description" defaultValue={modalData.description || ''} className="w-full border rounded-xl px-4 py-2" rows="3" required />
              <select name="type" className="w-full border rounded-xl px-4 py-2">
                <option value="Homework">Homework</option>
                <option value="Assignment">Assignment</option>
                <option value="Task">Task</option>
              </select>
              <input type="date" name="deadline" defaultValue={modalData.deadline ? modalData.deadline.split('T')[0] : ''} className="w-full border rounded-xl px-4 py-2" required />
              <select name="chapterId" className="w-full border rounded-xl px-4 py-2" required>
                <option value="">Select Chapter</option>
                {Object.values(chapters).flat().map(ch => <option key={ch._id} value={ch._id}>{ch.title}</option>)}
              </select>
              <button type="submit" disabled={formLoading} className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                {formLoading ? 'Saving...' : (editingId ? 'Update Assignment' : 'Create Assignment')}
              </button>
            </form>
          );
        case 'quiz':
          return (
            <form onSubmit={handleQuizSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Quiz Title" defaultValue={modalData.title || ''} className="w-full border rounded-xl px-4 py-2" required />
              <textarea name="description" placeholder="Description" defaultValue={modalData.description || ''} className="w-full border rounded-xl px-4 py-2" rows="3" />
              <input type="number" name="timeLimit" placeholder="Time Limit (minutes)" defaultValue={modalData.timeLimit || 30} className="w-full border rounded-xl px-4 py-2" />
              <input type="date" name="deadline" defaultValue={modalData.deadline ? modalData.deadline.split('T')[0] : ''} className="w-full border rounded-xl px-4 py-2" required />
              <select name="chapterId" className="w-full border rounded-xl px-4 py-2" required>
                <option value="">Select Chapter</option>
                {Object.values(chapters).flat().map(ch => <option key={ch._id} value={ch._id}>{ch.title}</option>)}
              </select>
              <textarea name="questions" placeholder='Questions as JSON: [{"question":"...","options":["a","b","c"],"correctAnswer":0}]' defaultValue={JSON.stringify(modalData.questions || [])} className="w-full border rounded-xl px-4 py-2" rows="4" />
              <button type="submit" disabled={formLoading} className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                {formLoading ? 'Saving...' : (editingId ? 'Update Quiz' : 'Create Quiz')}
              </button>
            </form>
          );
        case 'attendance':
          return (
            <form onSubmit={handleAttendanceSubmit} className="space-y-4">
              <input type="text" name="studentId" placeholder="Student ID" className="w-full border rounded-xl px-4 py-2" required />
              <select name="subjectId" className="w-full border rounded-xl px-4 py-2" required>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
              </select>
              <select name="status" className="w-full border rounded-xl px-4 py-2" required>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
              <input type="date" name="date" className="w-full border rounded-xl px-4 py-2" />
              <button type="submit" disabled={formLoading} className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                {formLoading ? 'Saving...' : 'Mark Attendance'}
              </button>
            </form>
          );
        default: return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
            <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-full">
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          {renderForm()}
        </div>
      </div>
    );
  };

  // ======================== MAIN RENDER ========================
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        {toast.message && (
          <div className={`fixed top-6 right-6 p-4 rounded-xl shadow-2xl text-white z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'subjects' && <SubjectsView />}
        {activeTab === 'assignments' && <SimpleView title="Assignments" description="Create and manage assignments" addButton="New Assignment" addAction={() => openModal('assignment')} />}
        {activeTab === 'quizzes' && <SimpleView title="Quizzes" description="Create and manage quizzes" addButton="Create Quiz" addAction={() => openModal('quiz')} />}
        {activeTab === 'attendance' && <SimpleView title="Attendance" description="Manage attendance records" addButton="Mark Attendance" addAction={() => openModal('attendance')} />}
        <Modal />
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition shadow-sm">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;