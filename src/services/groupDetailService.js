import api from './api';

// Group
export const getGroup = async (groupId) => {
  const response = await api.get(`/groups/${groupId}`);
  return response.data;
};

// Students
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

// Modules
export const getModules = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/modules`);
  return response.data;
};

export const createModule = async (groupId) => {
  const response = await api.post(`/groups/${groupId}/modules`);
  return response.data;
};

export const finishModule = async (moduleId) => {
  await api.post(`/modules/${moduleId}/finish`);
};

export const deleteModule = async (moduleId) => {
  await api.delete(`/modules/${moduleId}`);
};

// Lessons
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

// Criteria
export const getCriteria = async (moduleId) => {
  const response = await api.get(`/modules/${moduleId}/criteria`);
  return response.data;
};

export const createCriteria = async (moduleId, criteriaData) => {
  const response = await api.post(`/modules/${moduleId}/criteria`, criteriaData);
  return response.data;
};

export const updateCriteria = async (criteriaId, criteriaData) => {
  const response = await api.put(`/criteria/${criteriaId}`, criteriaData);
  return response.data;
};

export const deleteCriteria = async (criteriaId) => {
  await api.delete(`/criteria/${criteriaId}`);
};

// Grading
export const createGrade = async (gradeData) => {
  const response = await api.post('/grades', gradeData);
  return response.data;
};

export const getLeaderboard = async (moduleId) => {
  const response = await api.get(`/modules/${moduleId}/leaderboard`);
  return response.data;
};