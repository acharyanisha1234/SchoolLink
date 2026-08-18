import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  BookOpenIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  CalendarIcon,
  PencilSquareIcon,
  MegaphoneIcon,
  BellIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  EyeIcon,
  PaperClipIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import StudentSidebar from '../components/StudentSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
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

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatShortDate = (value) => {
  if (!value) return 'No deadline';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const getStatusBadge = (status) => {
  const stylings = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Submitted: 'bg-green-100 text-green-700',
    Late: 'bg-red-100 text-red-700',
    Present: 'bg-emerald-100 text-emerald-700',
    Absent: 'bg-red-100 text-red-700',
    LateAttendance: 'bg-amber-100 text-amber-700',
  };

  return `px-2 py-1 rounded-full text-xs font-medium ${stylings[status] || 'bg-gray-100 text-gray-700'}`;
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [tasks, setTasks] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [attendance, setAttendance] = useState({ records: [], summary: {}, attendancePercentage: 0 });
  const [grades, setGrades] = useState({ grades: [], gpa: '0.00', count: 0 });
  const [announcements, setAnnouncements] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [submissionForm, setSubmissionForm] = useState({ assignmentId: '', fileUrl: '', notes: '' });
  const [filterType, setFilterType] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 2500);
  };

  const fetchJson = async (url, options = {}) => {
    const response = await fetch(url, { ...options, headers: { ...getAuthHeaders(), ...(options.headers || {}) } });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  };

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, tasksRes, materialsRes, deadlinesRes, quizzesRes, attendanceRes, gradesRes, announcementsRes, profileRes, submissionsRes] = await Promise.all([
        fetchJson(`${API_URL}/api/student-dashboard/dashboard`),
        fetchJson(`${API_URL}/api/student-dashboard/tasks`),
        fetchJson(`${API_URL}/api/student-dashboard/materials`),
        fetchJson(`${API_URL}/api/student-dashboard/deadlines`),
        fetchJson(`${API_URL}/api/student-dashboard/quizzes`),
        fetchJson(`${API_URL}/api/student-dashboard/attendance`),
        fetchJson(`${API_URL}/api/student-dashboard/grades`),
        fetchJson(`${API_URL}/api/student-dashboard/announcements`),
        fetchJson(`${API_URL}/api/student-dashboard/profile`),
        fetchJson(`${API_URL}/api/student-dashboard/submissions`),
      ]);

      setDashboardData(dashboardRes.data || {});
      setTasks(tasksRes.data || []);
      setMaterials(materialsRes.data || []);
      setDeadlines(deadlinesRes.data || []);
      setQuizzes(quizzesRes.data || []);
      setAttendance(attendanceRes.data || { records: [], summary: {}, attendancePercentage: 0 });
      setGrades(gradesRes.data || { grades: [], gpa: '0.00', count: 0 });
      setAnnouncements(announcementsRes.data || []);
      setProfile(profileRes.data || null);
      setSubmissions(submissionsRes.data || []);
    } catch (error) {
      console.error('Load student dashboard error:', error);
      showToast(error.message || 'Unable to load student dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const tasksByStatus = useMemo(() => ({
    pending: tasks.filter(task => task.status === 'Pending').length,
    submitted: tasks.filter(task => task.status === 'Submitted').length,
    late: tasks.filter(task => task.status === 'Late').length,
  }), [tasks]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/student-dashboard/submissions/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }
      setSubmissionForm(prev => ({ ...prev, fileUrl: data.data.fileUrl, assignmentId: prev.assignmentId || '' }));
      showToast('File uploaded successfully.', 'success');
    } catch (error) {
      console.error('Upload file error:', error);
      showToast(error.message || 'File upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitHomework = async () => {
    if (!submissionForm.assignmentId || !submissionForm.fileUrl) {
      showToast('Select an assignment and upload a file first.', 'error');
      return;
    }

    try {
      const response = await fetchJson(`${API_URL}/api/student-dashboard/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: submissionForm.assignmentId,
          fileUrl: submissionForm.fileUrl,
          notes: submissionForm.notes,
        }),
      });

      if (response.success) {
        showToast('Homework submitted successfully.', 'success');
        setSubmissionForm({ assignmentId: '', fileUrl: '', notes: '' });
        fetchStudentData();
      }
    } catch (error) {
      showToast(error.message || 'Submission failed', 'error');
    }
  };

  const handleQuizSubmit = async (quizId) => {
    try {
      const response = await fetchJson(`${API_URL}/api/student-dashboard/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: questionAnswers[quizId] || {} }),
      });

      if (response.success) {
        showToast(`Quiz submitted. Score: ${response.data.score}/${response.data.totalQuestions}`, 'success');
        setSelectedQuiz(null);
        setQuestionAnswers(prev => ({ ...prev, [quizId]: {} }));
        fetchStudentData();
      }
    } catch (error) {
      showToast(error.message || 'Quiz submission failed', 'error');
    }
  };

  const renderDashboard = () => (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back{profile?.fullName ? `, ${profile.fullName}` : ''}! Track your academic progress here.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <BellIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={ClipboardDocumentIcon} label="Pending Tasks" value={dashboardData.pendingTasks ?? tasksByStatus.pending} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard icon={CheckCircleIcon} label="Submitted Homework" value={dashboardData.submittedHomework ?? submissions.length} color="text-green-600" bgColor="bg-green-100" />
        <StatCard icon={BookOpenIcon} label="Learning Materials" value={dashboardData.learningMaterials ?? materials.length} color="text-purple-600" bgColor="bg-purple-100" />
        <StatCard icon={CalendarIcon} label="Upcoming Deadlines" value={dashboardData.upcomingDeadlines ?? deadlines.length} color="text-red-600" bgColor="bg-red-100" />
        <StatCard icon={UsersIcon} label="Attendance %" value={`${dashboardData.attendancePercentage ?? attendance.attendancePercentage ?? 0}%`} color="text-indigo-600" bgColor="bg-indigo-100" />
        <StatCard icon={PencilSquareIcon} label="Quiz Summary" value={dashboardData.quizSummary ?? quizzes.length} color="text-pink-600" bgColor="bg-pink-100" />
        <StatCard icon={MegaphoneIcon} label="Recent Announcements" value={dashboardData.recentAnnouncements ?? announcements.length} color="text-orange-600" bgColor="bg-orange-100" />
        <StatCard icon={DocumentArrowDownIcon} label="Today Tasks" value={dashboardData.todayTasks ?? 0} color="text-teal-600" bgColor="bg-teal-100" />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
            <BellIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {announcements.slice(0, 4).map((announcement) => (
              <div key={announcement._id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-gray-900">{announcement.title}</p>
                <p className="text-xs text-gray-500 mt-1">{announcement.createdBy?.fullName || 'School'} • {formatDate(announcement.createdAt)}</p>
              </div>
            ))}
            {!announcements.length && <p className="text-sm text-gray-500">No announcements yet.</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
          <div className="space-y-4">
            {deadlines.slice(0, 4).map((deadline) => (
              <div key={deadline._id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                    <p className="text-xs text-gray-500">{deadline.subjectId?.title || 'Subject'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(deadline.deadline)}</p>
                    <span className={getStatusBadge('Pending')}>{deadline.status || 'Pending'}</span>
                  </div>
                </div>
              </div>
            ))}
            {!deadlines.length && <p className="text-sm text-gray-500">No upcoming deadlines.</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'View Materials', tab: 'materials', colorClass: 'bg-blue-50 text-blue-700 hover:bg-blue-100', icon: BookOpenIcon },
          { label: 'Submit Homework', tab: 'submissions', colorClass: 'bg-green-50 text-green-700 hover:bg-green-100', icon: ClipboardDocumentIcon },
          { label: 'Attempt Quiz', tab: 'quizzes', colorClass: 'bg-purple-50 text-purple-700 hover:bg-purple-100', icon: PencilSquareIcon },
          { label: 'View Results', tab: 'results', colorClass: 'bg-orange-50 text-orange-700 hover:bg-orange-100', icon: ChartBarIcon },
        ].map(({ label, tab, colorClass, icon: Icon }) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`p-4 rounded-xl transition-colors ${colorClass}`}>
            <Icon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium block">{label}</span>
          </button>
        ))}
      </div>
    </>
  );

  const renderTasks = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-1">View and manage all assigned work.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading tasks...</div>
      ) : !tasks.length ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-500">No tasks assigned.</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{task.subjectId?.title || 'Subject'} • {task.type || 'Assignment'}</p>
                </div>
                <span className={getStatusBadge(task.status)}>{task.status}</span>
              </div>
              <p className="text-sm text-gray-600 mt-4 whitespace-pre-line">{task.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Deadline: {formatShortDate(task.deadline)}</span>
                <button onClick={() => setSelectedTask(task)} className="text-blue-600 hover:underline font-medium">View details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{selectedTask.title}</h3>
              <button onClick={() => setSelectedTask(null)} className="text-gray-500">Close</button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <p><strong>Subject:</strong> {selectedTask.subjectId?.title || 'General'}</p>
              <p><strong>Deadline:</strong> {formatShortDate(selectedTask.deadline)}</p>
              <p><strong>Status:</strong> <span className={getStatusBadge(selectedTask.status)}>{selectedTask.status}</span></p>
              <div><strong>Instructions:</strong><p className="mt-2 whitespace-pre-line">{selectedTask.description || 'No instructions provided.'}</p></div>
              {selectedTask.referenceFiles?.length ? (
                <div>
                  <strong>Resources:</strong>
                  <ul className="mt-2 list-disc list-inside text-blue-600">
                    {selectedTask.referenceFiles.map((file, index) => (
                      <li key={index}><a href={file} target="_blank" rel="noreferrer">Resource {index + 1}</a></li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMaterials = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Learning Materials</h1>
      <p className="text-gray-600 mt-1">Browse subject notes, slides, and videos.</p>

      {loading ? (
        <div className="mt-6 text-gray-600">Loading materials...</div>
      ) : !materials.length ? (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-500">No learning materials available.</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5">
          {materials.map((material) => (
            <div key={material._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{material.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{material.subjectId?.title || 'Subject'} • {material.type}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{material.type}</span>
              </div>
              <p className="text-sm text-gray-600 mt-3">{material.description || 'No description available.'}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={`${API_URL}${material.fileUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <DocumentTextIcon className="h-4 w-4" /> Open resource
                </a>
                {material.fileUrl && (
                  <a href={`${API_URL}${material.fileUrl}`} download className="inline-flex items-center gap-2 text-sm text-green-600 hover:underline">
                    <DocumentArrowDownIcon className="h-4 w-4" /> Download
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSubmissions = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
          <p className="text-gray-600 mt-1">Upload, replace, and track your homework.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit homework</h3>
          <div className="space-y-4">
            <select value={submissionForm.assignmentId} onChange={(e) => setSubmissionForm({ ...submissionForm, assignmentId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Choose an assignment</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>{task.title}</option>
              ))}
            </select>

            <div className="border border-dashed border-gray-300 rounded-xl p-4">
              <input type="file" onChange={handleUploadFile} className="block w-full text-sm text-gray-500" />
              {uploading && <p className="text-xs text-blue-600 mt-2">Uploading file...</p>}
              {submissionForm.fileUrl && <p className="text-xs text-green-600 mt-2">File ready: {submissionForm.fileUrl}</p>}
            </div>

            <textarea value={submissionForm.notes} onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })} placeholder="Optional notes for the teacher" rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2" />

            <button onClick={handleSubmitHomework} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Submit homework</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission history</h3>
          <div className="space-y-3">
            {submissions.length ? submissions.map((submission) => (
              <div key={submission._id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900">{submission.assignmentId?.title || 'Assignment'}</p>
                  <span className={getStatusBadge(submission.status)}>{submission.status}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{formatShortDate(submission.submittedAt)}</p>
                {submission.fileUrl && <a href={`${API_URL}${submission.fileUrl}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline mt-2 inline-block">View file</a>}
              </div>
            )) : <p className="text-sm text-gray-500">No submissions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeadlines = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Deadlines</h1>
      <p className="text-gray-600 mt-1">Track upcoming assignments, quizzes, and overdue work.</p>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {['Today', 'Upcoming', 'Overdue'].map((group) => {
          const filtered = group === 'Today'
            ? deadlines.filter(item => new Date(item.deadline).toDateString() === new Date().toDateString())
            : group === 'Upcoming'
              ? deadlines.filter(item => new Date(item.deadline) > new Date())
              : tasks.filter(task => task.status === 'Late' || new Date(task.deadline) < new Date());

          return (
            <div key={group} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{group}</h3>
              <div className="space-y-3">
                {filtered.length ? filtered.map((item) => (
                  <div key={item._id || item.title} className="border rounded-lg p-3">
                    <p className="font-medium text-gray-900">{item.title || item.subjectId?.title || 'Item'}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatShortDate(item.deadline || item.date)}</p>
                  </div>
                )) : <p className="text-sm text-gray-500">No {group.toLowerCase()} items.</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderQuizzes = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
      <p className="text-gray-600 mt-1">Attempt quizzes and review your score after submission.</p>
      {!quizzes.length ? (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-500">No published quizzes available.</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{quiz.subjectId?.title || 'Subject'} • {quiz.questions?.length || 0} questions</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-1">{quiz.timeLimit} min</span>
              </div>
              <p className="text-sm text-gray-600 mt-4">Deadline: {formatShortDate(quiz.deadline)}</p>
              <button onClick={() => setSelectedQuiz(quiz)} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Attempt quiz</button>
            </div>
          ))}
        </div>
      )}

      {selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedQuiz.title}</h3>
                <p className="text-sm text-gray-500">Time limit: {selectedQuiz.timeLimit} minutes</p>
              </div>
              <button onClick={() => setSelectedQuiz(null)} className="text-gray-500">Close</button>
            </div>
            <div className="space-y-5">
              {selectedQuiz.questions.map((question, index) => (
                <div key={index} className="border rounded-xl p-4">
                  <p className="font-medium text-gray-900">{index + 1}. {question.question}</p>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="radio" name={`q-${index}`} checked={Number(questionAnswers[selectedQuiz._id]?.[index] ?? -1) === optionIndex} onChange={() => setQuestionAnswers(prev => ({ ...prev, [selectedQuiz._id]: { ...(prev[selectedQuiz._id] || {}), [index]: optionIndex } }))} className="text-blue-600" />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => handleQuizSubmit(selectedQuiz._id)} className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700">Submit quiz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAttendance = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
      <p className="text-gray-600 mt-1">Track monthly attendance and percentage.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={CheckCircleIcon} label="Present" value={attendance.summary.present ?? 0} color="text-emerald-600" bgColor="bg-emerald-100" />
        <StatCard icon={ExclamationTriangleIcon} label="Absent" value={attendance.summary.absent ?? 0} color="text-red-600" bgColor="bg-red-100" />
        <StatCard icon={ClockIcon} label="Late" value={attendance.summary.late ?? 0} color="text-amber-600" bgColor="bg-amber-100" />
        <StatCard icon={UsersIcon} label="Attendance %" value={`${attendance.attendancePercentage ?? 0}%`} color="text-indigo-600" bgColor="bg-indigo-100" />
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance history</h3>
        <div className="space-y-3">
          {attendance.records?.length ? attendance.records.map((record) => (
            <div key={record._id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div>
                <p className="font-medium text-gray-900">{record.subjectId?.title || 'Subject'}</p>
                <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
              </div>
              <span className={getStatusBadge(record.status)}>{record.status}</span>
            </div>
          )) : <p className="text-sm text-gray-500">No attendance records available.</p>}
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Results</h1>
      <p className="text-gray-600 mt-1">Published subject marks and teacher remarks.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={AcademicCapIcon} label="Published Results" value={grades.count ?? 0} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard icon={ChartBarIcon} label="GPA" value={grades.gpa ?? '0.00'} color="text-purple-600" bgColor="bg-purple-100" />
        <StatCard icon={CheckCircleIcon} label="Total Marks" value={grades.totalMarks ?? 0} color="text-green-600" bgColor="bg-green-100" />
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise performance</h3>
        <div className="space-y-3">
          {grades.grades?.length ? grades.grades.map((grade) => (
            <div key={grade._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{grade.subjectId?.title || 'Subject'}</p>
                  <p className="text-xs text-gray-500">{grade.type}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">{grade.marks}/{grade.totalMarks}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span>Grade: {grade.grade || '—'}</span>
                <span>{grade.published ? 'Published' : 'Draft'}</span>
              </div>
              {grade.remarks && <p className="mt-2 text-sm text-gray-600">Remark: {grade.remarks}</p>}
            </div>
          )) : <p className="text-sm text-gray-500">No published results available.</p>}
        </div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
      <p className="text-gray-600 mt-1">School and class updates.</p>

      <div className="mt-6 flex gap-2 flex-wrap">
        {['school', 'class'].map((type) => (
          <button key={type} onClick={() => setFilterType(type)} className={`px-4 py-2 rounded-full text-sm font-medium ${filterType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            {type === 'school' ? 'School Announcements' : 'Class Announcements'}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {announcements.filter((item) => filterType === 'school' ? !item.subjectId : !!item.subjectId).length ? announcements.filter((item) => filterType === 'school' ? !item.subjectId : !!item.subjectId).map((announcement) => (
          <div key={announcement._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{announcement.title}</h2>
                <p className="text-xs text-gray-500 mt-1">Posted by: {announcement.createdBy?.fullName || 'School'} • {formatDate(announcement.createdAt)}</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{filterType === 'school' ? 'School' : 'Class'}</span>
            </div>
            <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">{announcement.content || announcement.message || 'No content available.'}</p>
          </div>
        )) : <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-500">No announcements in this category.</div>}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'tasks': return renderTasks();
      case 'materials': return renderMaterials();
      case 'submissions': return renderSubmissions();
      case 'deadlines': return renderDeadlines();
      case 'quizzes': return renderQuizzes();
      case 'attendance': return renderAttendance();
      case 'results': return renderResults();
      case 'announcements': return renderAnnouncements();
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div className="flex-1 ml-64 p-8">
        {toast.message && (
          <div className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;