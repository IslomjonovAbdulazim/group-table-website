import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Admin APIs
export const adminAPI = {
  getTeachers: () => api.get('/admin/teachers'),
  createTeacher: (data) => api.post('/admin/teachers', data),
  updateTeacher: (id, data) => api.put(`/admin/teachers/${id}`, data),
  deleteTeacher: (id) => api.delete(`/admin/teachers/${id}`),
  getTeacherStats: (id) => api.get(`/admin/teachers/${id}/stats`),
};

// Teacher APIs
export const teacherAPI = {
  // Groups
  getGroups: () => api.get('/groups'),
  createGroup: (data) => api.post('/groups', data),
  deleteGroup: (id) => api.delete(`/groups/${id}`),
  finishGroup: (id) => api.post(`/groups/${id}/finish`),
  
  // Students
  getStudents: (groupId) => api.get(`/groups/${groupId}/students`),
  createStudent: (groupId, data) => api.post(`/groups/${groupId}/students`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  
  // Modules
  getModules: (groupId) => api.get(`/groups/${groupId}/modules`),
  createModule: (groupId, data) => api.post(`/groups/${groupId}/modules`, data),
  finishModule: (id) => api.post(`/modules/${id}/finish`),
  
  // Lessons
  getLessons: (moduleId) => api.get(`/modules/${moduleId}/lessons`),
  createLesson: (moduleId, data) => api.post(`/modules/${moduleId}/lessons`, data),
  
  // Criteria
  getCriteria: (moduleId) => api.get(`/modules/${moduleId}/criteria`),
  createCriteria: (moduleId, data) => api.post(`/modules/${moduleId}/criteria`, data),
  
  // Grades
  createGrade: (data) => api.post('/grades', data),
  getLeaderboard: (moduleId) => api.get(`/modules/${moduleId}/leaderboard`),
};

// Public APIs
export const publicAPI = {
  getGroupByCode: (code) => api.get(`/${code}`),
  getGroupModules: (code) => api.get(`/${code}/modules`),
  getModuleLeaderboard: (code, moduleId) => api.get(`/${code}/modules/${moduleId}`),
  getStudentChart: (code, studentId) => api.get(`/${code}/students/${studentId}/chart`),
  getModuleChart: (code, moduleId) => api.get(`/${code}/modules/${moduleId}/chart`),
};

export default api;