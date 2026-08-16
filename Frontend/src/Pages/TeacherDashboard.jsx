// src/Pages/TeacherDashboard.jsx
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
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  FolderIcon,
  PaperClipIcon,
  CalendarIcon,
  EyeIcon,
  ArrowDownTrayIcon,      // ✅ Fixed: was DownloadIcon
  ArrowUpTrayIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import TeacherSidebar from './TeacherSidebar';

// ─── Helper Components ──────────────────────────────────────
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

// ─── Main TeacherDashboard ──────────────────────────────────
const TeacherDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // ─── STATE FOR EACH MODULE ──────────────────────────────
  // Subjects & Chapters
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics', chapters: ['Algebra', 'Geometry', 'Trigonometry'] },
    { id: 2, name: 'Science', chapters: ['Physics', 'Chemistry', 'Biology'] },
  ]);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({ name: '', chapters: [] });
  const [newChapter, setNewChapter] = useState('');

  // Learning Materials
  const [materials, setMaterials] = useState([
    { id: 1, title: 'Algebra Notes', type: 'PDF', chapter: 'Algebra', subject: 'Mathematics', uploaded: '2026-08-15' },
    { id: 2, title: 'Physics PPT', type: 'PPT', chapter: 'Physics', subject: 'Science', uploaded: '2026-08-14' },
  ]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState({ title: '', type: 'PDF', chapter: '', subject: '', file: '' });

  // Tasks & Assignments
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Chapter 5 Homework', subject: 'Mathematics', deadline: '2026-08-20', description: 'Solve all odd problems', status: 'Active' },
    { id: 2, title: 'Lab Report', subject: 'Science', deadline: '2026-08-25', description: 'Write a report on the experiment', status: 'Active' },
  ]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', subject: '', deadline: '', description: '', status: 'Active' });

  // Homework Submissions (for teacher view)
  const [submissions, setSubmissions] = useState([
    { id: 1, student: 'John Doe', task: 'Chapter 5 Homework', subject: 'Mathematics', submitted: '2026-08-18', status: 'Pending' },
    { id: 2, student: 'Jane Smith', task: 'Lab Report', subject: 'Science', submitted: '2026-08-19', status: 'Submitted' },
  ]);

  // Assignment Reviews
  const [reviews, setReviews] = useState([
    { id: 1, student: 'John Doe', task: 'Chapter 5 Homework', feedback: 'Good work, but need more detail.', reviewed: true },
    { id: 2, student: 'Alice Brown', task: 'Lab Report', feedback: '', reviewed: false },
  ]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ id: null, feedback: '' });

  // Quizzes
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'Algebra Quiz', subject: 'Mathematics', deadline: '2026-08-22', timeLimit: 30, published: true },
    { id: 2, title: 'Physics Quiz', subject: 'Science', deadline: '2026-08-28', timeLimit: 20, published: false },
  ]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: '', subject: '', deadline: '', timeLimit: 30, published: false, questions: [] });

  // Attendance
  const [attendanceRecords, setAttendanceRecords] = useState([
    { date: '2026-08-16', class: '10-A', present: 28, absent: 2, late: 1 },
    { date: '2026-08-15', class: '10-A', present: 26, absent: 3, late: 2 },
  ]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({ date: '', class: '', present: 0, absent: 0, late: 0 });

  // Grades
  const [grades, setGrades] = useState([
    { id: 1, student: 'John Doe', subject: 'Mathematics', marks: 85, grade: 'A', remark: 'Excellent' },
    { id: 2, student: 'Jane Smith', subject: 'Mathematics', marks: 72, grade: 'B', remark: '' },
  ]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeForm, setGradeForm] = useState({ student: '', subject: '', marks: '', grade: '', remark: '' });

  // Announcements
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Mid-term exams', content: 'Exams start from 1st September.', date: '2026-08-16' },
    { id: 2, title: 'Science fair', content: 'Submit projects by 25th August.', date: '2026-08-15' },
  ]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', date: '' });

  // ─── HANDLERS ──────────────────────────────────────────────
  // Subjects
  const handleAddSubject = () => {
    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, name: subjectForm.name, chapters: subjectForm.chapters } : s));
    } else {
      setSubjects([...subjects, { id: Date.now(), name: subjectForm.name, chapters: subjectForm.chapters }]);
    }
    setShowSubjectModal(false);
    setSubjectForm({ name: '', chapters: [] });
    setEditingSubject(null);
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectForm({ name: subject.name, chapters: [...subject.chapters] });
    setShowSubjectModal(true);
  };

  const addChapter = () => {
    if (newChapter.trim()) {
      setSubjectForm({ ...subjectForm, chapters: [...subjectForm.chapters, newChapter.trim()] });
      setNewChapter('');
    }
  };
  const removeChapter = (index) => {
    const updated = [...subjectForm.chapters];
    updated.splice(index, 1);
    setSubjectForm({ ...subjectForm, chapters: updated });
  };

  // Materials
  const handleAddMaterial = () => {
    setMaterials([...materials, { id: Date.now(), ...materialForm, uploaded: new Date().toISOString().split('T')[0] }]);
    setShowMaterialModal(false);
    setMaterialForm({ title: '', type: 'PDF', chapter: '', subject: '', file: '' });
  };

  const handleDeleteMaterial = (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  // Tasks
  const handleAddTask = () => {
    setTasks([...tasks, { id: Date.now(), ...taskForm }]);
    setShowTaskModal(false);
    setTaskForm({ title: '', subject: '', deadline: '', description: '', status: 'Active' });
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Reviews
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

  // Quizzes
  const handleAddQuiz = () => {
    setQuizzes([...quizzes, { id: Date.now(), ...quizForm }]);
    setShowQuizModal(false);
    setQuizForm({ title: '', subject: '', deadline: '', timeLimit: 30, published: false, questions: [] });
  };

  const handleDeleteQuiz = (id) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
  };

  // Attendance
  const handleAddAttendance = () => {
    setAttendanceRecords([...attendanceRecords, { ...attendanceForm }]);
    setShowAttendanceModal(false);
    setAttendanceForm({ date: '', class: '', present: 0, absent: 0, late: 0 });
  };

  // Grades
  const handleAddGrade = () => {
    setGrades([...grades, { id: Date.now(), ...gradeForm }]);
    setShowGradeModal(false);
    setGradeForm({ student: '', subject: '', marks: '', grade: '', remark: '' });
  };

  const handleDeleteGrade = (id) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  // Announcements
  const handleAddAnnouncement = () => {
    if (announcementForm.title && announcementForm.content) {
      setAnnouncements([...announcements, { id: Date.now(), ...announcementForm, date: new Date().toISOString().split('T')[0] }]);
      setShowAnnouncementModal(false);
      setAnnouncementForm({ title: '', content: '', date: '' });
    }
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  // ─── RENDER FUNCTIONS FOR EACH TAB ─────────────────────

  const renderDashboard = () => (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your teaching summary.</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={ClipboardDocumentIcon} label="Today's Tasks" value="4" color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard icon={CheckCircleIcon} label="Total Tasks Created" value={tasks.length} color="text-green-600" bgColor="bg-green-100" />
        <StatCard icon={BookOpenIcon} label="Assigned Subjects" value={subjects.length} color="text-purple-600" bgColor="bg-purple-100" />
        <StatCard icon={DocumentTextIcon} label="Materials Uploaded" value={materials.length} color="text-yellow-600" bgColor="bg-yellow-100" />
        <StatCard icon={UserGroupIcon} label="Recent Submissions" value={submissions.filter(s => s.status === 'Submitted').length} color="text-pink-600" bgColor="bg-pink-100" />
        <StatCard icon={PencilSquareIcon} label="Pending Reviews" value={reviews.filter(r => !r.reviewed).length} color="text-indigo-600" bgColor="bg-indigo-100" />
        <StatCard icon={ClockIcon} label="Upcoming Deadlines" value="3" color="text-red-600" bgColor="bg-red-100" />
        <StatCard icon={UsersIcon} label="Attendance Summary" value="92%" color="text-orange-600" bgColor="bg-orange-100" />
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
            <button onClick={() => setActiveTab('materials')} className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-green-700">
              <DocumentTextIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Upload Material</span>
            </button>
            <button onClick={() => setActiveTab('tasks')} className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-purple-700">
              <ClipboardDocumentIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Create Task</span>
            </button>
            <button onClick={() => setActiveTab('attendance')} className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-orange-700">
              <UserGroupIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Take Attendance</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const renderSubjects = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Subject Management</h2>
        <button
          onClick={() => { setEditingSubject(null); setSubjectForm({ name: '', chapters: [] }); setShowSubjectModal(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Subject</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-800">{subject.name}</h3>
              <div className="flex space-x-2">
                <button onClick={() => handleEditSubject(subject)} className="text-blue-500 hover:text-blue-700">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={() => handleDeleteSubject(subject.id)} className="text-red-500 hover:text-red-700">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-1">Chapters:</p>
              <ul className="list-disc list-inside space-y-1">
                {subject.chapters.map((ch, idx) => (
                  <li key={idx} className="text-gray-700">{ch}</li>
                ))}
                {subject.chapters.length === 0 && <li className="text-gray-400 italic">No chapters added</li>}
              </ul>
            </div>
          </div>
        ))}
        {subjects.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">No subjects yet. Click "Add Subject" to create one.</div>
        )}
      </div>

      <Modal isOpen={showSubjectModal} onClose={() => setShowSubjectModal(false)} title={editingSubject ? 'Edit Subject' : 'Add Subject'}>
        <Input label="Subject Name" value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Chapters</label>
          <div className="flex space-x-2">
            <input
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              value={newChapter}
              onChange={(e) => setNewChapter(e.target.value)}
              placeholder="Chapter name"
            />
            <button onClick={addChapter} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Add</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {subjectForm.chapters.map((ch, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm">
                {ch}
                <button onClick={() => removeChapter(idx)} className="ml-2 text-red-500 hover:text-red-700">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <button onClick={handleAddSubject} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {editingSubject ? 'Update Subject' : 'Create Subject'}
        </button>
      </Modal>
    </div>
  );

  const renderMaterials = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Learning Materials</h2>
        <button
          onClick={() => setShowMaterialModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                <td className="px-6 py-4 text-sm text-gray-600">{material.uploaded}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-blue-500 hover:text-blue-700"><EyeIcon className="h-5 w-5 inline" /></button>
                  <button onClick={() => handleDeleteMaterial(material.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5 inline" /></button>
                </td>
              </tr>
            ))}
            {materials.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-400">No materials uploaded yet.</td></tr>
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
          options={subjects.map(s => ({ value: s.name, label: s.name }))}
          value={materialForm.subject}
          onChange={(e) => setMaterialForm({ ...materialForm, subject: e.target.value })}
        />
        <Input label="Chapter" value={materialForm.chapter} onChange={(e) => setMaterialForm({ ...materialForm, chapter: e.target.value })} />
        <Input label="File (mock)" value={materialForm.file} onChange={(e) => setMaterialForm({ ...materialForm, file: e.target.value })} placeholder="File name or link" />
        <button onClick={handleAddMaterial} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Upload</button>
      </Modal>
    </div>
  );

  const renderTasks = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tasks & Assignments</h2>
        <button
          onClick={() => setShowTaskModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
              <button className="text-blue-500 hover:text-blue-700"><PencilIcon className="h-5 w-5" /></button>
              <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <div className="col-span-2 text-center py-12 text-gray-400">No tasks created yet.</div>}
      </div>

      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Create New Task">
        <Input label="Task Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
        <Select
          label="Subject"
          options={subjects.map(s => ({ value: s.name, label: s.name }))}
          value={taskForm.subject}
          onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
        />
        <Input label="Deadline" type="date" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} />
        <Textarea label="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
        <button onClick={handleAddTask} className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Create Task</button>
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
                  <span className={`px-2 py-1 rounded-full text-xs ${sub.status === 'Submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-500 hover:text-blue-700">
                    <ArrowDownTrayIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-400">No submissions.</td></tr>}
          </tbody>
        </table>
      </div>
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
        <button onClick={handleReviewSubmit} className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit Review</button>
      </Modal>
    </div>
  );

  const renderQuizzes = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quizzes</h2>
        <button
          onClick={() => setShowQuizModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
            <div className="mt-4 flex space-x-2">
              <button className="text-blue-500 hover:text-blue-700"><PencilIcon className="h-5 w-5" /></button>
              <button onClick={() => handleDeleteQuiz(quiz.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && <div className="col-span-2 text-center py-12 text-gray-400">No quizzes created yet.</div>}
      </div>

      <Modal isOpen={showQuizModal} onClose={() => setShowQuizModal(false)} title="Create New Quiz">
        <Input label="Quiz Title" value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} />
        <Select
          label="Subject"
          options={subjects.map(s => ({ value: s.name, label: s.name }))}
          value={quizForm.subject}
          onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })}
        />
        <Input label="Deadline" type="date" value={quizForm.deadline} onChange={(e) => setQuizForm({ ...quizForm, deadline: e.target.value })} />
        <Input label="Time Limit (minutes)" type="number" value={quizForm.timeLimit} onChange={(e) => setQuizForm({ ...quizForm, timeLimit: parseInt(e.target.value) })} />
        <div className="mb-4 flex items-center">
          <input type="checkbox" checked={quizForm.published} onChange={(e) => setQuizForm({ ...quizForm, published: e.target.checked })} className="mr-2" />
          <label className="text-sm text-gray-700">Publish immediately</label>
        </div>
        <button onClick={handleAddQuiz} className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Quiz</button>
      </Modal>
    </div>
  );

  const renderAttendance = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance Management</h2>
        <button
          onClick={() => setShowAttendanceModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendanceRecords.map((record, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 text-sm text-gray-800">{record.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.class}</td>
                <td className="px-6 py-4 text-sm text-green-600 font-medium">{record.present}</td>
                <td className="px-6 py-4 text-sm text-red-600 font-medium">{record.absent}</td>
                <td className="px-6 py-4 text-sm text-yellow-600 font-medium">{record.late}</td>
              </tr>
            ))}
            {attendanceRecords.length === 0 && <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-400">No attendance records.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showAttendanceModal} onClose={() => setShowAttendanceModal(false)} title="Take Attendance">
        <Input label="Date" type="date" value={attendanceForm.date} onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })} />
        <Input label="Class" value={attendanceForm.class} onChange={(e) => setAttendanceForm({ ...attendanceForm, class: e.target.value })} />
        <Input label="Present" type="number" value={attendanceForm.present} onChange={(e) => setAttendanceForm({ ...attendanceForm, present: parseInt(e.target.value) })} />
        <Input label="Absent" type="number" value={attendanceForm.absent} onChange={(e) => setAttendanceForm({ ...attendanceForm, absent: parseInt(e.target.value) })} />
        <Input label="Late" type="number" value={attendanceForm.late} onChange={(e) => setAttendanceForm({ ...attendanceForm, late: parseInt(e.target.value) })} />
        <button onClick={handleAddAttendance} className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Save Attendance</button>
      </Modal>
    </div>
  );

  const renderGrades = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Grades & Results</h2>
        <button
          onClick={() => setShowGradeModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
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
        <Input label="Student" value={gradeForm.student} onChange={(e) => setGradeForm({ ...gradeForm, student: e.target.value })} />
        <Select
          label="Subject"
          options={subjects.map(s => ({ value: s.name, label: s.name }))}
          value={gradeForm.subject}
          onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })}
        />
        <Input label="Marks" type="number" value={gradeForm.marks} onChange={(e) => setGradeForm({ ...gradeForm, marks: e.target.value })} />
        <Input label="Grade" value={gradeForm.grade} onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })} />
        <Input label="Remark" value={gradeForm.remark} onChange={(e) => setGradeForm({ ...gradeForm, remark: e.target.value })} />
        <button onClick={handleAddGrade} className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Add Grade</button>
      </Modal>
    </div>
  );

  const renderAnnouncements = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <button
          onClick={() => setShowAnnouncementModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          <MegaphoneIcon className="h-5 w-5" />
          <span>Post Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{ann.title}</h3>
                <p className="text-sm text-gray-500">{ann.date}</p>
              </div>
              <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-red-500 hover:text-red-700">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-gray-700">{ann.content}</p>
          </div>
        ))}
        {announcements.length === 0 && <div className="text-center py-12 text-gray-400">No announcements.</div>}
      </div>

      <Modal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} title="Post Announcement">
        <Input label="Title" value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} />
        <Textarea label="Content" value={announcementForm.content} onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })} />
        <button onClick={handleAddAnnouncement} className="w-full py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Post</button>
      </Modal>
    </div>
  );

  // ─── MAIN RENDER ──────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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

// ─── Stat Card (reusable) ──────────────────────────────────
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

// ─── Mock Recent Activities ───────────────────────────────
const recentActivities = [
  { message: 'John Doe submitted homework for Mathematics', time: '2 min ago' },
  { message: 'New assignment created: Chapter 5 Quiz', time: '15 min ago' },
  { message: 'Sarah Lee reviewed 3 pending assignments', time: '1 hour ago' },
  { message: 'Attendance marked for Class 10-A', time: '3 hours ago' },
  { message: 'Learning material uploaded: PPT - Algebra', time: '5 hours ago' },
];

export default TeacherDashboard;