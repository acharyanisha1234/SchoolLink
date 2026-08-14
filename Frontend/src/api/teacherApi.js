const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No token found in localStorage');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Helper to handle response and extract error message
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    // If unauthorized, clear localStorage and redirect to login
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

export const teacherApi = {
  getDashboard: () =>
    fetch(`${API_URL}/api/teacher/dashboard`, { headers: getHeaders() })
      .then(handleResponse),

  getSubjects: () =>
    fetch(`${API_URL}/api/teacher/subjects`, { headers: getHeaders() })
      .then(handleResponse),

  createSubject: (data) =>
    fetch(`${API_URL}/api/teacher/subjects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateSubject: (id, data) =>
    fetch(`${API_URL}/api/teacher/subjects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteSubject: (id) =>
    fetch(`${API_URL}/api/teacher/subjects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  getChapters: (subjectId) =>
    fetch(`${API_URL}/api/teacher/chapters/${subjectId}`, { headers: getHeaders() })
      .then(handleResponse),

  createChapter: (data) =>
    fetch(`${API_URL}/api/teacher/chapters`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateChapter: (id, data) =>
    fetch(`${API_URL}/api/teacher/chapters/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteChapter: (id) =>
    fetch(`${API_URL}/api/teacher/chapters/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  getMaterials: (chapterId) =>
    fetch(`${API_URL}/api/teacher/materials/${chapterId}`, { headers: getHeaders() })
      .then(handleResponse),

  createMaterial: (formData) => {
    const token = localStorage.getItem('token');
    return fetch(`${API_URL}/api/teacher/materials`, {
      method: 'POST',
      headers: { 'Authorization': token ? `Bearer ${token}` : '' },
      body: formData,
    }).then(handleResponse);
  },

  deleteMaterial: (id) =>
    fetch(`${API_URL}/api/teacher/materials/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  getAssignments: () =>
    fetch(`${API_URL}/api/teacher/assignments`, { headers: getHeaders() })
      .then(handleResponse),

  createAssignment: (data) =>
    fetch(`${API_URL}/api/teacher/assignments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateAssignment: (id, data) =>
    fetch(`${API_URL}/api/teacher/assignments/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteAssignment: (id) =>
    fetch(`${API_URL}/api/teacher/assignments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  getQuizzes: () =>
    fetch(`${API_URL}/api/teacher/quizzes`, { headers: getHeaders() })
      .then(handleResponse),

  createQuiz: (data) =>
    fetch(`${API_URL}/api/teacher/quizzes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateQuiz: (id, data) =>
    fetch(`${API_URL}/api/teacher/quizzes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteQuiz: (id) =>
    fetch(`${API_URL}/api/teacher/quizzes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  publishQuiz: (id) =>
    fetch(`${API_URL}/api/teacher/quizzes/${id}/publish`, {
      method: 'PUT',
      headers: getHeaders(),
    }).then(handleResponse),

  getAttendance: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/api/teacher/attendance?${query}`, { headers: getHeaders() })
      .then(handleResponse);
  },

  markAttendance: (data) =>
    fetch(`${API_URL}/api/teacher/attendance`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  getAttendanceStats: (subjectId) =>
    fetch(`${API_URL}/api/teacher/attendance/stats/${subjectId}`, { headers: getHeaders() })
      .then(handleResponse),
};