import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  FolderIcon,
  PaperClipIcon,
  CalendarIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import TeacherSidebar from './TeacherSidebar';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      {...props}
    />
  </div>
);

const FileInput = ({ label, onFileChange, accept = ".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="file"
      accept={accept}
      onChange={onFileChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      rows="3"
      {...props}
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      {...props}
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const TeacherDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [userEmail, setUserEmail] = useState('teacher@school.com');
  const [userName, setUserName] = useState('Teacher');
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState('TEACHER');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.email) setUserEmail(user.email);
        if (user.name) setUserName(user.name);
        if (user.id) setUserId(user.id);
        if (user.role) setUserRole(user.role);
      } catch (e) {}
    }
  }, []);

  const STUDENTS = ['Binoj Acharya', 'Smita Poudel', 'Dilasha Thapa', 'Nisha Acharya'];

  const [subjects, setSubjects] = useState([
    { id: 1, title: 'Mathematics', code: 'MATH101', class: 10, teacher: 'Mr. Sharma', description: 'Algebra & Geometry', status: 'Active' },
    { id: 2, title: 'Science', code: 'SCI101', class: 10, teacher: 'Ms. Poudel', description: 'Physics, Chemistry, Biology', status: 'Active' },
  ]);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    title: '',
    code: '',
    class: '',
    teacher: '',
    description: '',
    status: 'Active'
  });

  const [materials, setMaterials] = useState([
    { id: 1, title: 'Algebra Notes', type: 'PDF', chapter: 'Algebra', subject: 'Mathematics', uploaded: '2026-08-15', fileName: 'algebra_notes.pdf', fileSize: '2.4 MB' },
    { id: 2, title: 'Physics PPT', type: 'PPT', chapter: 'Physics', subject: 'Science', uploaded: '2026-08-14', fileName: 'physics_ch1.pptx', fileSize: '5.1 MB' },
  ]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState({ title: '', type: 'PDF', chapter: '', subject: '', file: null, fileName: '' });
  const [materialFile, setMaterialFile] = useState(null);
  const [showMaterialPreviewModal, setShowMaterialPreviewModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Chapter 5 Homework', subject: 'Mathematics', deadline: '2026-08-20', description: 'Solve all odd problems', status: 'Active' },
    { id: 2, title: 'Lab Report', subject: 'Science', deadline: '2026-08-25', description: 'Write a report on the experiment', status: 'Active' },
  ]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', subject: '', deadline: '', description: '', status: 'Active' });

  const [submissions, setSubmissions] = useState([
    { id: 1, student: 'Binoj Acharya', task: 'Chapter 5 Homework', subject: 'Mathematics', submitted: '2026-08-18', status: 'Submitted', file: 'binoj_hw.pdf', feedback: '' },
    { id: 2, student: 'Smita Poudel', task: 'Lab Report', subject: 'Science', submitted: '2026-08-19', status: 'Submitted', file: 'smita_lab.pdf', feedback: '' },
    { id: 3, student: 'Dilasha Thapa', task: 'Chapter 5 Homework', subject: 'Mathematics', submitted: '2026-08-20', status: 'Late', file: 'dilasha_hw.pdf', feedback: '' },
    { id: 4, student: 'Nisha Acharya', task: 'Lab Report', subject: 'Science', submitted: '2026-08-21', status: 'Submitted', file: 'nisha_lab.pdf', feedback: '' },
  ]);
  const [showHomeworkDetailModal, setShowHomeworkDetailModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const [reviews, setReviews] = useState([
    { id: 1, student: 'Binoj Acharya', task: 'Chapter 5 Homework', feedback: 'Good work, but need more detail.', reviewed: true },
    { id: 2, student: 'Dilasha Thapa', task: 'Lab Report', feedback: '', reviewed: false },
    { id: 3, student: 'Smita Poudel', task: 'Chapter 5 Homework', feedback: 'Excellent!', reviewed: true },
  ]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ id: null, feedback: '' });

  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'Algebra Quiz', subject: 'Mathematics', deadline: '2026-08-22', timeLimit: 30, published: true, questions: [{ question: 'What is 2+2?', options: ['3', '4', '5', '6'], correctAnswer: '4' }] },
    { id: 2, title: 'Physics Quiz', subject: 'Science', deadline: '2026-08-28', timeLimit: 20, published: false, questions: [{ question: 'What is the speed of light?', options: ['3e8 m/s', '3e6 m/s', '3e10 m/s', '3e4 m/s'], correctAnswer: '3e8 m/s' }] },
  ]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: '',
    subject: '',
    deadline: '',
    timeLimit: 30,
    published: false,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }]
  });

  const [attendanceRecords, setAttendanceRecords] = useState([
    { 
      date: '2026-08-16', 
      class: '10-A', 
      students: [
        { name: 'Binoj Acharya', status: 'present' },
        { name: 'Smita Poudel', status: 'present' },
        { name: 'Dilasha Thapa', status: 'absent' },
        { name: 'Nisha Acharya', status: 'present' },
      ]
    },
    { 
      date: '2026-08-15', 
      class: '10-A', 
      students: [
        { name: 'Binoj Acharya', status: 'present' },
        { name: 'Smita Poudel', status: 'absent' },
        { name: 'Dilasha Thapa', status: 'present' },
        { name: 'Nisha Acharya', status: 'present' },
      ]
    },
  ]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceClass, setAttendanceClass] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [showAttendanceDetailModal, setShowAttendanceDetailModal] = useState(false);
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState(null);

  const [grades, setGrades] = useState([
    { id: 1, student: 'Binoj Acharya', subject: 'Mathematics', marks: 85, grade: 'A', remark: 'Excellent' },
    { id: 2, student: 'Smita Poudel', subject: 'Mathematics', marks: 72, grade: 'B', remark: '' },
    { id: 3, student: 'Dilasha Thapa', subject: 'Science', marks: 90, grade: 'A', remark: 'Outstanding' },
    { id: 4, student: 'Nisha Acharya', subject: 'Science', marks: 65, grade: 'C', remark: 'Needs improvement' },
  ]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeForm, setGradeForm] = useState({ student: '', subject: '', marks: '', grade: '', remark: '' });

  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', date: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/announcements`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch announcements', err);
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/announcements`,
        {
          title: announcementForm.title,
          content: announcementForm.content,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncements([res.data.data, ...announcements]);
      setShowAnnouncementModal(false);
      setAnnouncementForm({ title: '', content: '', date: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(announcements.filter(a => a._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  const handleAddSubject = () => {
    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, ...subjectForm } : s));
    } else {
      setSubjects([...subjects, { id: Date.now(), ...subjectForm }]);
    }
    setShowSubjectModal(false);
    setSubjectForm({ title: '', code: '', class: '', teacher: '', description: '', status: 'Active' });
    setEditingSubject(null);
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectForm({
      title: subject.title,
      code: subject.code || '',
      class: subject.class || '',
      teacher: subject.teacher || '',
      description: subject.description || '',
      status: subject.status || 'Active'
    });
    setShowSubjectModal(true);
  };

  const handleAddQuiz = () => {
    const hasEmpty = quizForm.questions.some(q => !q.question || q.options.some(o => !o) || !q.correctAnswer);
    if (hasEmpty) {
      alert('Please fill all question fields, options, and correct answer');
      return;
    }
    if (editingQuiz) {
      setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? { ...q, ...quizForm } : q));
    } else {
      setQuizzes([...quizzes, { id: Date.now(), ...quizForm }]);
    }
    setShowQuizModal(false);
    setQuizForm({
      title: '',
      subject: '',
      deadline: '',
      timeLimit: 30,
      published: false,
      questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }]
    });
    setEditingQuiz(null);
  };

  const handleDeleteQuiz = (id) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setQuizForm({
      title: quiz.title,
      subject: quiz.subject,
      deadline: quiz.deadline,
      timeLimit: quiz.timeLimit,
      published: quiz.published,
      questions: quiz.questions || [{ question: '', options: ['', '', '', ''], correctAnswer: '' }]
    });
    setShowQuizModal(true);
  };

  const addQuestionField = () => {
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
        { question: '', options: ['', '', '', ''], correctAnswer: '' }
      ]
    });
  };

  const removeQuestionField = (index) => {
    const newQuestions = quizForm.questions.filter((_, i) => i !== index);
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...quizForm.questions];
    if (field === 'question') {
      newQuestions[index].question = value;
    } else if (field === 'correctAnswer') {
      newQuestions[index].correctAnswer = value;
    } else if (field.startsWith('option')) {
      const optIdx = parseInt(field.split('-')[1]);
      newQuestions[index].options[optIdx] = value;
    }
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const handleAddAttendance = () => {
    const studentsList = STUDENTS.map((name, idx) => ({
      name,
      status: attendanceData[idx] || 'absent'
    }));
    setAttendanceRecords([
      ...attendanceRecords,
      {
        date: attendanceDate,
        class: attendanceClass,
        students: studentsList
      }
    ]);
    setShowAttendanceModal(false);
    setAttendanceDate(new Date().toISOString().split('T')[0]);
    setAttendanceClass('');
    setAttendanceData({});
  };

  const openAttendanceModal = () => {
    const initial = {};
    STUDENTS.forEach((_, idx) => {
      initial[idx] = 'present';
    });
    setAttendanceData(initial);
    setAttendanceDate(new Date().toISOString().split('T')[0]);
    setAttendanceClass('');
    setShowAttendanceModal(true);
  };

  const viewAttendanceDetails = (record) => {
    setSelectedAttendanceRecord(record);
    setShowAttendanceDetailModal(true);
  };

  const handleOpenHomeworkDetail = (submission) => {
    setSelectedSubmission(submission);
    setFeedbackText(submission.feedback || '');
    setShowHomeworkDetailModal(true);
  };

  const handleSaveFeedback = () => {
    setSubmissions(submissions.map(s =>
      s.id === selectedSubmission.id ? { ...s, feedback: feedbackText } : s
    ));
    setShowHomeworkDetailModal(false);
    setSelectedSubmission(null);
    setFeedbackText('');
    alert('Feedback saved!');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMaterialFile(file);
      setMaterialForm({
        ...materialForm,
        file: file,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      });
    }
  };

  const handleAddMaterial = () => {
    setMaterials([
      ...materials,
      {
        id: Date.now(),
        title: materialForm.title,
        type: materialForm.type,
        chapter: materialForm.chapter,
        subject: materialForm.subject,
        uploaded: new Date().toISOString().split('T')[0],
        fileName: materialForm.file ? materialForm.file.name : materialForm.fileName || 'No file',
        fileSize: materialForm.file ? (materialForm.file.size / (1024 * 1024)).toFixed(2) + ' MB' : 'N/A',
      },
    ]);
    setShowMaterialModal(false);
    setMaterialForm({ title: '', type: 'PDF', chapter: '', subject: '', file: null, fileName: '' });
    setMaterialFile(null);
  };

  const handleDeleteMaterial = (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleDownloadMaterial = (fileName) => {
    alert(`Downloading file: ${fileName} (simulated)`);
  };

  const handlePreviewMaterial = (material) => {
    setSelectedMaterial(material);
    setShowMaterialPreviewModal(true);
  };

  const handleAddTask = () => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskForm } : t));
    } else {
      setTasks([...tasks, { id: Date.now(), ...taskForm }]);
    }
    setShowTaskModal(false);
    setTaskForm({ title: '', subject: '', deadline: '', description: '', status: 'Active' });
    setEditingTask(null);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({ title: task.title, subject: task.subject, deadline: task.deadline, description: task.description, status: task.status });
    setShowTaskModal(true);
  };

  const handleDownloadFile = (filename) => {
    alert(`Downloading file: ${filename} (simulated)`);
  };

  const handleReviewSubmit = () => {
    setReviews(reviews.map(r => r.id === reviewForm.id ? { ...r, feedback: reviewForm.feedback, reviewed: true } : r));
    setShowReviewModal(false);
    setReviewForm({ id: null, feedback: '' });
  };

  const openReviewModal = (id) => {
    const review = reviews.find(r => r.id === id);
    setReviewForm({ id: review.id, feedback: review.feedback });
    setShowReviewModal(true);
  };

  const handleAddGrade = () => {
    setGrades([...grades, { id: Date.now(), ...gradeForm }]);
    setShowGradeModal(false);
    setGradeForm({ student: '', subject: '', marks: '', grade: '', remark: '' });
  };

  const handleDeleteGrade = (id) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  const renderDashboard = () => {
    const totalTasks = tasks.length;
    const totalSubjects = subjects.length;
    const totalMaterials = materials.length;
    const totalSubmissions = submissions.length;
    const upcomingDeadlines = tasks.filter(t => t.status === 'Active').length;
    
    let attendanceAvg = 92;
    if (attendanceRecords.length > 0) {
      const totalPresent = attendanceRecords.reduce((sum, rec) => {
        const present = rec.students ? rec.students.filter(s => s.status === 'present').length : 0;
        const total = rec.students ? rec.students.length : 0;
        return sum + (total > 0 ? (present / total) * 100 : 0);
      }, 0);
      attendanceAvg = Math.round(totalPresent / attendanceRecords.length);
    }

    return (
      <>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your teaching summary.</p>
          </div>
          <button
            onClick={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); if (onLogout) onLogout(); navigate('/'); }}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={ClipboardDocumentIcon} label="Today's Tasks" value={totalTasks} color="text-blue-600" bgColor="bg-blue-100" />
          <StatCard icon={CheckCircleIcon} label="Total Tasks Created" value={totalTasks} color="text-green-600" bgColor="bg-green-100" />
          <StatCard icon={BookOpenIcon} label="Assigned Subjects" value={totalSubjects} color="text-purple-600" bgColor="bg-purple-100" />
          <StatCard icon={DocumentTextIcon} label="Materials Uploaded" value={totalMaterials} color="text-yellow-600" bgColor="bg-yellow-100" />
          <StatCard icon={UserGroupIcon} label="Homework Submissions" value={totalSubmissions} color="text-pink-600" bgColor="bg-pink-100" />
          <StatCard icon={CheckCircleIcon} label="Total Submissions" value={totalSubmissions} color="text-indigo-600" bgColor="bg-indigo-100" />
          <StatCard icon={ClockIcon} label="Upcoming Deadlines" value={upcomingDeadlines} color="text-red-600" bgColor="bg-red-100" />
          <StatCard icon={UsersIcon} label="Attendance Summary" value={`${attendanceAvg}%`} color="text-orange-600" bgColor="bg-orange-100" />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setActiveTab('subjects')} className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-700">
                <BookOpenIcon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Create Subject</span>
              </button>
              <button onClick={() => setActiveTab('materials')} className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-700">
                <DocumentTextIcon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Upload Material</span>
              </button>
              <button onClick={() => setActiveTab('tasks')} className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-700">
                <ClipboardDocumentIcon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Create Task</span>
              </button>
              <button onClick={() => { setActiveTab('attendance'); openAttendanceModal(); }} className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-700">
                <UserGroupIcon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Take Attendance</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderSubjects = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Subject Management</h2>
        <button
          onClick={() => { setEditingSubject(null); setSubjectForm({ title: '', code: '', class: '', teacher: '', description: '', status: 'Active' }); setShowSubjectModal(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Subject</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id} className="border-t">
                <td className="px-6 py-4 text-sm">{subject.code || '—'}</td>
                <td className="px-6 py-4 text-sm font-medium">{subject.title}</td>
                <td className="px-6 py-4 text-sm">{subject.class ? `Class ${subject.class}` : '—'}</td>
                <td className="px-6 py-4 text-sm">{subject.teacher || 'Not Assigned'}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${subject.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {subject.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEditSubject(subject)} className="text-blue-500 hover:text-blue-700">
                    <PencilIcon className="h-5 w-5 inline" />
                  </button>
                  <button onClick={() => handleDeleteSubject(subject.id)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {subjects.length === 0 && (
              <tr><td colSpan="6" className="p-4 text-center text-gray-400">No subjects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showSubjectModal} onClose={() => setShowSubjectModal(false)} title={editingSubject ? 'Edit Subject' : 'Create New Subject'}>
        <form onSubmit={(e) => { e.preventDefault(); handleAddSubject(); }} className="space-y-4">
          <Input label="Subject Title *" value={subjectForm.title} onChange={(e) => setSubjectForm({ ...subjectForm, title: e.target.value })} required />
          <Input label="Subject Code" value={subjectForm.code} onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })} placeholder="e.g., MATH101" />
          <Select
            label="Class *"
            options={[1,2,3,4,5,6,7,8,9,10,11,12].map(n => ({ value: n, label: `Class ${n}` }))}
            value={subjectForm.class}
            onChange={(e) => setSubjectForm({ ...subjectForm, class: e.target.value })}
            required
          />
          <Input label="Assign Teacher" value={subjectForm.teacher} onChange={(e) => setSubjectForm({ ...subjectForm, teacher: e.target.value })} placeholder="Teacher name" />
          <Textarea label="Description" value={subjectForm.description} onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })} placeholder="Enter subject description" />
          <Select
            label="Status"
            options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
            value={subjectForm.status}
            onChange={(e) => setSubjectForm({ ...subjectForm, status: e.target.value })}
          />
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {editingSubject ? 'Update Subject' : 'Create Subject'}
          </button>
        </form>
      </Modal>
    </div>
  );

  const renderMaterials = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Learning Materials</h2>
        <button
          onClick={() => setShowMaterialModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowUpTrayIcon className="h-5 w-5" />
          <span>Upload Material</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chapter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {materials.map((material) => (
              <tr key={material.id}>
                <td className="px-6 py-4 text-sm text-gray-800">{material.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{material.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{material.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{material.chapter}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <PaperClipIcon className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="truncate max-w-[120px]">{material.fileName || 'No file'}</span>
                    {material.fileSize && <span className="text-xs text-gray-400 ml-1">({material.fileSize})</span>}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{material.uploaded}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handlePreviewMaterial(material)} className="text-blue-500 hover:text-blue-700">
                    <EyeIcon className="h-5 w-5 inline" />
                  </button>
                  {material.fileName && material.fileName !== 'No file' && (
                    <button onClick={() => handleDownloadMaterial(material.fileName)} className="text-indigo-500 hover:text-indigo-700">
                      <ArrowDownTrayIcon className="h-5 w-5 inline" />
                    </button>
                  )}
                  <button onClick={() => handleDeleteMaterial(material.id)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {materials.length === 0 && (
              <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-400">No materials uploaded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showMaterialModal} onClose={() => setShowMaterialModal(false)} title="Upload Learning Material">
        <Input label="Title" value={materialForm.title} onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })} />
        <Select
          label="Type"
          options={[{ value: 'PDF', label: 'PDF' }, { value: 'PPT', label: 'PPT' }, { value: 'Notes', label: 'Notes' }, { value: 'Image', label: 'Image' }, { value: 'Video Link', label: 'Video Link' }]}
          value={materialForm.type}
          onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
        />
        <Select
          label="Subject"
          options={subjects.map(s => ({ value: s.title, label: s.title }))}
          value={materialForm.subject}
          onChange={(e) => setMaterialForm({ ...materialForm, subject: e.target.value })}
        />
        <Input label="Chapter" value={materialForm.chapter} onChange={(e) => setMaterialForm({ ...materialForm, chapter: e.target.value })} />
        <FileInput label="Upload File (PDF, PPT, DOC, Image)" onFileChange={handleFileChange} />
        {materialFile && (
          <div className="text-sm text-gray-600 mb-4 flex items-center">
            <PaperClipIcon className="h-4 w-4 mr-1" />
            <span>{materialFile.name} ({(materialFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
          </div>
        )}
        <button onClick={handleAddMaterial} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Upload</button>
      </Modal>

      <Modal isOpen={showMaterialPreviewModal} onClose={() => setShowMaterialPreviewModal(false)} title="Material Preview">
        {selectedMaterial && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Title:</span> {selectedMaterial.title}</div>
              <div><span className="font-medium">Type:</span> {selectedMaterial.type}</div>
              <div><span className="font-medium">Subject:</span> {selectedMaterial.subject}</div>
              <div><span className="font-medium">Chapter:</span> {selectedMaterial.chapter}</div>
              <div><span className="font-medium">Uploaded:</span> {selectedMaterial.uploaded}</div>
              <div><span className="font-medium">File:</span> {selectedMaterial.fileName}</div>
              {selectedMaterial.fileSize && <div><span className="font-medium">Size:</span> {selectedMaterial.fileSize}</div>}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowMaterialPreviewModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );

  const renderTasks = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tasks & Assignments</h2>
        <button
          onClick={() => { setEditingTask(null); setTaskForm({ title: '', subject: '', deadline: '', description: '', status: 'Active' }); setShowTaskModal(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.subject}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${task.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {task.status}
              </span>
            </div>
            <p className="mt-2 text-gray-600 text-sm">{task.description}</p>
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Deadline: {task.deadline}
            </div>
            <div className="mt-4 flex space-x-2">
              <button onClick={() => handleEditTask(task)} className="text-blue-500 hover:text-blue-700">
                <PencilIcon className="h-5 w-5" />
              </button>
              <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <div className="col-span-2 text-center py-12 text-gray-400">No tasks created yet.</div>}
      </div>

      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title={editingTask ? 'Edit Task' : 'Create New Task'}>
        <Input label="Task Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
        <Select
          label="Subject"
          options={subjects.map(s => ({ value: s.title, label: s.title }))}
          value={taskForm.subject}
          onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
        />
        <Input label="Deadline" type="date" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} />
        <Textarea label="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
        <button onClick={handleAddTask} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
      </Modal>
    </div>
  );

  const renderHomework = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Homework Submissions</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map((sub) => (
              <tr key={sub.id}>
                <td className="px-6 py-4 text-sm text-gray-800">{sub.student}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{sub.task}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{sub.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{sub.submitted}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    sub.status === 'Submitted' ? 'bg-green-100 text-green-800' :
                    sub.status === 'Late' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleOpenHomeworkDetail(sub)} className="text-blue-500 hover:text-blue-700">
                    <EyeIcon className="h-5 w-5 inline" />
                  </button>
                  <button onClick={() => handleDownloadFile(sub.file)} className="text-indigo-500 hover:text-indigo-700">
                    <ArrowDownTrayIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-400">No submissions.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showHomeworkDetailModal} onClose={() => setShowHomeworkDetailModal(false)} title={`Submission: ${selectedSubmission?.student} - ${selectedSubmission?.task}`}>
        {selectedSubmission && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Student:</span> {selectedSubmission.student}</div>
              <div><span className="font-medium">Task:</span> {selectedSubmission.task}</div>
              <div><span className="font-medium">Subject:</span> {selectedSubmission.subject}</div>
              <div><span className="font-medium">Submitted:</span> {selectedSubmission.submitted}</div>
              <div><span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedSubmission.status === 'Submitted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {selectedSubmission.status}
                </span>
              </div>
              <div><span className="font-medium">File:</span>
                <button onClick={() => handleDownloadFile(selectedSubmission.file)} className="text-indigo-600 hover:text-indigo-800 underline ml-1">
                  {selectedSubmission.file}
                </button>
              </div>
            </div>
            <Textarea
              label="Feedback"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write your feedback here..."
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowHomeworkDetailModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSaveFeedback} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Feedback
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );

  const renderReviews = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Assignment Review & Feedback</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviewed</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 text-sm text-gray-800">{review.student}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{review.task}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{review.feedback || '—'}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${review.reviewed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {review.reviewed ? 'Reviewed' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openReviewModal(review.id)} className="text-blue-500 hover:text-blue-700">
                    <PencilIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-400">No reviews pending.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Provide Feedback">
        <Textarea label="Feedback" value={reviewForm.feedback} onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })} />
        <button onClick={handleReviewSubmit} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Review</button>
      </Modal>
    </div>
  );

  const renderQuizzes = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quizzes</h2>
        <button
          onClick={() => { setEditingQuiz(null); setQuizForm({ title: '', subject: '', deadline: '', timeLimit: 30, published: false, questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }] }); setShowQuizModal(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Quiz</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
                <p className="text-sm text-gray-500">{quiz.subject}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${quiz.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {quiz.published ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">Deadline: {quiz.deadline} | Time Limit: {quiz.timeLimit} min</p>
            <p className="text-sm text-gray-500">Questions: {quiz.questions ? quiz.questions.length : 0}</p>
            <div className="mt-4 flex space-x-2">
              <button onClick={() => handleEditQuiz(quiz)} className="text-blue-500 hover:text-blue-700">
                <PencilIcon className="h-5 w-5" />
              </button>
              <button onClick={() => handleDeleteQuiz(quiz.id)} className="text-red-500 hover:text-red-700">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && <div className="col-span-2 text-center py-12 text-gray-400">No quizzes created yet.</div>}
      </div>

      <Modal isOpen={showQuizModal} onClose={() => setShowQuizModal(false)} title={editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}>
        <form onSubmit={(e) => { e.preventDefault(); handleAddQuiz(); }} className="space-y-4">
          <Input label="Quiz Title" value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} required />
          <Select
            label="Subject"
            options={subjects.map(s => ({ value: s.title, label: s.title }))}
            value={quizForm.subject}
            onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })}
            required
          />
          <Input label="Deadline" type="date" value={quizForm.deadline} onChange={(e) => setQuizForm({ ...quizForm, deadline: e.target.value })} />
          <Input label="Time Limit (minutes)" type="number" value={quizForm.timeLimit} onChange={(e) => setQuizForm({ ...quizForm, timeLimit: parseInt(e.target.value) })} />
          <div className="mb-4 flex items-center">
            <input type="checkbox" checked={quizForm.published} onChange={(e) => setQuizForm({ ...quizForm, published: e.target.checked })} className="mr-2" />
            <label className="text-sm text-gray-700">Publish immediately</label>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Questions</h4>
            {quizForm.questions.map((q, idx) => (
              <div key={idx} className="border p-3 rounded mb-3 bg-gray-50">
                <div className="flex justify-between">
                  <span className="font-medium">Q{idx+1}</span>
                  {quizForm.questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestionField(idx)} className="text-red-500">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <Input label="Question" value={q.question} onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)} required />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {q.options.map((opt, oi) => (
                    <Input key={oi} label={`Option ${oi+1}`} value={opt} onChange={(e) => handleQuestionChange(idx, `option-${oi}`, e.target.value)} required />
                  ))}
                </div>
                <Select
                  label="Correct Answer"
                  options={q.options.map((opt, oi) => ({ value: opt, label: opt || `Option ${oi+1}` }))}
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={addQuestionField} className="text-blue-600 hover:underline">+ Add Question</button>
          </div>

          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
          </button>
        </form>
      </Modal>
    </div>
  );

  const renderAttendance = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance Management</h2>
        <button
          onClick={openAttendanceModal}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Take Attendance</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendanceRecords.map((record, idx) => {
              const presentCount = record.students.filter(s => s.status === 'present').length;
              const absentCount = record.students.filter(s => s.status === 'absent').length;
              const total = record.students.length;
              return (
                <tr key={idx}>
                  <td className="px-6 py-4 text-sm text-gray-800">{record.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.class}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">{presentCount}</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-medium">{absentCount}</td>
                  <td className="px-6 py-4 text-sm">{total}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => viewAttendanceDetails(record)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <EyeIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {attendanceRecords.length === 0 && <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-400">No attendance records.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showAttendanceModal} onClose={() => setShowAttendanceModal(false)} title="Take Attendance">
        <form onSubmit={(e) => { e.preventDefault(); handleAddAttendance(); }} className="space-y-4">
          <Input label="Date" type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} required />
          <Input label="Class" value={attendanceClass} onChange={(e) => setAttendanceClass(e.target.value)} required />

          {STUDENTS.length === 0 ? (
            <div>No students found</div>
          ) : (
            <div className="max-h-60 overflow-y-auto border rounded p-2">
              {STUDENTS.map((name, idx) => (
                <div key={idx} className="flex items-center space-x-2 border-b py-1">
                  <input
                    type="checkbox"
                    checked={attendanceData[idx] === 'present'}
                    onChange={(e) => setAttendanceData({ ...attendanceData, [idx]: e.target.checked ? 'present' : 'absent' })}
                  />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          )}
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Attendance</button>
        </form>
      </Modal>

      <Modal
        isOpen={showAttendanceDetailModal}
        onClose={() => setShowAttendanceDetailModal(false)}
        title={`Attendance Details - ${selectedAttendanceRecord?.date} (${selectedAttendanceRecord?.class})`}
      >
        {selectedAttendanceRecord && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><strong>Date:</strong> {selectedAttendanceRecord.date}</p>
              <p><strong>Class:</strong> {selectedAttendanceRecord.class}</p>
            </div>
            <div className="border-t pt-3">
              <p className="font-medium mb-2">Students</p>
              <div className="max-h-60 overflow-y-auto">
                {selectedAttendanceRecord.students.map((student, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b py-1">
                    <span>{student.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      student.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );

  const renderGrades = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Grades & Results</h2>
        <button
          onClick={() => setShowGradeModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Grade</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remark</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {grades.map((grade) => (
              <tr key={grade.id}>
                <td className="px-6 py-4 text-sm text-gray-800">{grade.student}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{grade.subject}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{grade.marks}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${grade.grade === 'A' ? 'bg-green-100 text-green-800' : grade.grade === 'B' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {grade.grade}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{grade.remark || '—'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDeleteGrade(grade.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5 inline" /></button>
                </td>
              </tr>
            ))}
            {grades.length === 0 && <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-400">No grades entered.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showGradeModal} onClose={() => setShowGradeModal(false)} title="Add Grade">
        <Select
          label="Student"
          options={STUDENTS.map(s => ({ value: s, label: s }))}
          value={gradeForm.student}
          onChange={(e) => setGradeForm({ ...gradeForm, student: e.target.value })}
        />
        <Select
          label="Subject"
          options={subjects.map(s => ({ value: s.title, label: s.title }))}
          value={gradeForm.subject}
          onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })}
        />
        <Input label="Marks" type="number" value={gradeForm.marks} onChange={(e) => setGradeForm({ ...gradeForm, marks: e.target.value })} />
        <Input label="Grade" value={gradeForm.grade} onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })} />
        <Input label="Remark" value={gradeForm.remark} onChange={(e) => setGradeForm({ ...gradeForm, remark: e.target.value })} />
        <button onClick={handleAddGrade} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Grade</button>
      </Modal>
    </div>
  );

  const renderAnnouncements = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <button
          onClick={() => setShowAnnouncementModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <MegaphoneIcon className="h-5 w-5" />
          <span>Post Announcement</span>
        </button>
      </div>

      {loadingAnnouncements ? (
        <div className="text-center py-8 text-gray-500">Loading announcements...</div>
      ) : (
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No announcements.</div>
          ) : (
            announcements.map((ann) => (
              <div key={ann._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{ann.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                        ann.createdByRole === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ann.createdByRole === 'ADMIN' ? '📢 Admin' : '👩‍🏫 Teacher'}
                    </span>
                  </div>
                  {(userRole === 'ADMIN' || ann.createdBy === userId) && (
                    <button
                      onClick={() => handleDeleteAnnouncement(ann._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-gray-700">{ann.content}</p>
              </div>
            ))
          )}
        </div>
      )}

      <Modal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} title="Post Announcement">
        <Input
          label="Title"
          value={announcementForm.title}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
        />
        <Textarea
          label="Content"
          value={announcementForm.content}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
        />
        <button
          onClick={handleAddAnnouncement}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Post
        </button>
      </Modal>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userEmail={userEmail}
        userName={userName}
      />
      <div className="ml-64 flex-1 p-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'subjects' && renderSubjects()}
        {activeTab === 'materials' && renderMaterials()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'homework' && renderHomework()}
        {activeTab === 'review' && renderReviews()}
        {activeTab === 'quizzes' && renderQuizzes()}
        {activeTab === 'attendance' && renderAttendance()}
        {activeTab === 'grades' && renderGrades()}
        {activeTab === 'announcements' && renderAnnouncements()}
      </div>
    </div>
  );
};

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

const recentActivities = [
  { message: 'Binoj Acharya submitted homework for Mathematics', time: '2 min ago' },
  { message: 'New assignment created: Chapter 5 Quiz', time: '15 min ago' },
  { message: 'Smita Poudel reviewed 3 pending assignments', time: '1 hour ago' },
  { message: 'Attendance marked for Class 10-A', time: '3 hours ago' },
  { message: 'Learning material uploaded: PPT - Algebra by Dilasha Thapa', time: '5 hours ago' },
];

export default TeacherDashboard;