const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const teacherApi = {
  // Dashboard
  getDashboard: () => fetch(`${API_URL}/api/teacher/dashboard`, { headers: getHeaders() }).then(r => r.json()),

  // Subjects
  getSubjects: () => fetch(`${API_URL}/api/teacher/subjects`, { headers: getHeaders() }).then(r => r.json()),
  createSubject: (data) => fetch(`${API_URL}/api/teacher/subjects`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  updateSubject: (id, data) => fetch(`${API_URL}/api/teacher/subjects/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  deleteSubject: (id) => fetch(`${API_URL}/api/teacher/subjects/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()),

  // Chapters
  getChapters: (subjectId) => fetch(`${API_URL}/api/teacher/chapters/${subjectId}`, { headers: getHeaders() }).then(r => r.json()),
  createChapter: (data) => fetch(`${API_URL}/api/teacher/chapters`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  updateChapter: (id, data) => fetch(`${API_URL}/api/teacher/chapters/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  deleteChapter: (id) => fetch(`${API_URL}/api/teacher/chapters/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()),

  // Materials
  getMaterials: (chapterId) => fetch(`${API_URL}/api/teacher/materials/${chapterId}`, { headers: getHeaders() }).then(r => r.json()),
  createMaterial: (formData) => {
    const token = localStorage.getItem('token');
    return fetch(`${API_URL}/api/teacher/materials`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    }).then(r => r.json());
  },
  deleteMaterial: (id) => fetch(`${API_URL}/api/teacher/materials/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()),

  // Assignments
  getAssignments: () => fetch(`${API_URL}/api/teacher/assignments`, { headers: getHeaders() }).then(r => r.json()),
  createAssignment: (data) => fetch(`${API_URL}/api/teacher/assignments`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  updateAssignment: (id, data) => fetch(`${API_URL}/api/teacher/assignments/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  deleteAssignment: (id) => fetch(`${API_URL}/api/teacher/assignments/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()),

  // Quizzes
  getQuizzes: () => fetch(`${API_URL}/api/teacher/quizzes`, { headers: getHeaders() }).then(r => r.json()),
  createQuiz: (data) => fetch(`${API_URL}/api/teacher/quizzes`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  updateQuiz: (id, data) => fetch(`${API_URL}/api/teacher/quizzes/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  deleteQuiz: (id) => fetch(`${API_URL}/api/teacher/quizzes/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()),
  publishQuiz: (id) => fetch(`${API_URL}/api/teacher/quizzes/${id}/publish`, { method: 'PATCH', headers: getHeaders() }).then(r => r.json()),

  // Attendance
  getAttendance: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/api/teacher/attendance?${query}`, { headers: getHeaders() }).then(r => r.json());
  },
  markAttendance: (data) => fetch(`${API_URL}/api/teacher/attendance`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  getAttendanceStats: (subjectId) => fetch(`${API_URL}/api/teacher/attendance/stats/${subjectId}`, { headers: getHeaders() }).then(r => r.json()),
};