import api from './api';

// Public API (no auth required)
export const getGroupByCode = async (code) => {
  const response = await api.get(`/public/${code}`);
  return response.data;
};

export const getGroupModules = async (code) => {
  const response = await api.get(`/public/${code}/modules`);
  return response.data;
};

export const getModuleLeaderboard = async (code, moduleId) => {
  const response = await api.get(`/public/${code}/modules/${moduleId}`);
  return response.data;
};

export const getStudentChart = async (code, studentId) => {
  const response = await api.get(`/public/${code}/students/${studentId}/chart`);
  return response.data;
};

export const getModuleChart = async (code, moduleId) => {
  const response = await api.get(`/public/${code}/modules/${moduleId}/chart`);
  return response.data;
};

// Admin API
export const getTeachers = async () => {
  const response = await api.get('/admin/teachers');
  return response.data;
};

export const createTeacher = async (teacher) => {
  const response = await api.post('/admin/teachers', teacher);
  return response.data;
};

export const updateTeacher = async (teacherId, teacher) => {
  const response = await api.put(`/admin/teachers/${teacherId}`, teacher);
  return response.data;
};

export const deleteTeacher = async (teacherId) => {
  await api.delete(`/admin/teachers/${teacherId}`);
};

export const getTeacherStats = async (teacherId) => {
  const response = await api.get(`/admin/teachers/${teacherId}/stats`);
  return response.data;
};

// Teacher API - Groups
export const getGroups = async () => {
  const response = await api.get('/groups');
  return response.data;
};

export const createGroup = async (name) => {
  const response = await api.post('/groups', { name });
  return response.data;
};

export const updateGroup = async (groupId, name) => {
  const response = await api.put(`/groups/${groupId}`, { name });
  return response.data;
};

export const deleteGroup = async (groupId) => {
  await api.delete(`/groups/${groupId}`);
};

export const finishGroup = async (groupId) => {
  await api.post(`/groups/${groupId}/finish`);
};

// Teacher API - Students
export const getStudents = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/students`);
  return response.data;
};

export const createStudent = async (groupId, fullName) => {
  const response = await api.post(`/groups/${groupId}/students`, { full_name: fullName });
  return response.data;
};

export const updateStudent = async (studentId, fullName) => {
  const response = await api.put(`/students/${studentId}`, { full_name: fullName });
  return response.data;
};

export const deleteStudent = async (studentId) => {
  await api.delete(`/students/${studentId}`);
};

// Teacher API - Modules
export const getModules = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/modules`);
  return response.data;
};

export const createModule = async (groupId) => {
  const response = await api.post(`/groups/${groupId}/modules`);
  return response.data;
};

export const deleteModule = async (moduleId) => {
  await api.delete(`/modules/${moduleId}`);
};

export const finishModule = async (moduleId) => {
  await api.post(`/modules/${moduleId}/finish`);
};

// Teacher API - Lessons
export const getLessons = async (moduleId) => {
  const response = await api.get(`/modules/${moduleId}/lessons`);
  return response.data;
};

export const startLesson = async (moduleId) => {
  const response = await api.post(`/modules/${moduleId}/lessons/start`);
  return response.data;
};

export const finishLesson = async (lessonId) => {
  await api.post(`/lessons/${lessonId}/finish`);
};

export const deleteLesson = async (lessonId) => {
  await api.delete(`/lessons/${lessonId}`);
};

// Teacher API - Criteria
export const getCriteria = async (moduleId) => {
  const response = await api.get(`/modules/${moduleId}/criteria`);
  return response.data;
};

export const createCriteria = async (moduleId, criteria) => {
  const response = await api.post(`/modules/${moduleId}/criteria`, criteria);
  return response.data;
};

export const updateCriteria = async (criteriaId, criteria) => {
  const response = await api.put(`/criteria/${criteriaId}`, criteria);
  return response.data;
};

export const deleteCriteria = async (criteriaId) => {
  await api.delete(`/criteria/${criteriaId}`);
};

// Teacher API - Grades
export const createGrade = async (grade) => {
  const response = await api.post('/grades', grade);
  return response.data;
};

export const getLeaderboard = async (moduleId) => {
  const response = await api.get(`/modules/${moduleId}/leaderboard`);
  return response.data;
};