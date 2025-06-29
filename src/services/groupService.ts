import api from './api';
import {
  Group, GroupInfo, Student, StudentResponse, Module, ModuleInfo,
  Lesson, Criteria, CriteriaCreate, Grade, GradeCreate,
  LeaderboardEntry, ChartData, Teacher, TeacherCreate,
  TeacherUpdate, TeacherStats
} from '../types';

// Public API (no auth required)
export const getGroupByCode = async (code: string): Promise<GroupInfo> => {
  const response = await api.get(`/public/${code}`);
  return response.data;
};

export const getGroupModules = async (code: string): Promise<ModuleInfo[]> => {
  const response = await api.get(`/public/${code}/modules`);
  return response.data;
};

export const getModuleLeaderboard = async (code: string, moduleId: number): Promise<LeaderboardEntry[]> => {
  const response = await api.get(`/public/${code}/modules/${moduleId}`);
  return response.data;
};

export const getStudentChart = async (code: string, studentId: number): Promise<ChartData> => {
  const response = await api.get(`/public/${code}/students/${studentId}/chart`);
  return response.data;
};

export const getModuleChart = async (code: string, moduleId: number): Promise<any> => {
  const response = await api.get(`/public/${code}/modules/${moduleId}/chart`);
  return response.data;
};

// Admin API
export const getTeachers = async (): Promise<Teacher[]> => {
  const response = await api.get('/admin/teachers');
  return response.data;
};

export const createTeacher = async (teacher: TeacherCreate): Promise<Teacher> => {
  const response = await api.post('/admin/teachers', teacher);
  return response.data;
};

export const updateTeacher = async (teacherId: number, teacher: TeacherUpdate): Promise<Teacher> => {
  const response = await api.put(`/admin/teachers/${teacherId}`, teacher);
  return response.data;
};

export const deleteTeacher = async (teacherId: number): Promise<void> => {
  await api.delete(`/admin/teachers/${teacherId}`);
};

export const getTeacherStats = async (teacherId: number): Promise<TeacherStats> => {
  const response = await api.get(`/admin/teachers/${teacherId}/stats`);
  return response.data;
};

// Teacher API - Groups
export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get('/groups');
  return response.data;
};

export const createGroup = async (name: string): Promise<Group> => {
  const response = await api.post('/groups', { name });
  return response.data;
};

export const updateGroup = async (groupId: number, name: string): Promise<Group> => {
  const response = await api.put(`/groups/${groupId}`, { name });
  return response.data;
};

export const deleteGroup = async (groupId: number): Promise<void> => {
  await api.delete(`/groups/${groupId}`);
};

export const finishGroup = async (groupId: number): Promise<void> => {
  await api.post(`/groups/${groupId}/finish`);
};

// Teacher API - Students
export const getStudents = async (groupId: number): Promise<StudentResponse[]> => {
  const response = await api.get(`/groups/${groupId}/students`);
  return response.data;
};

export const createStudent = async (groupId: number, fullName: string): Promise<StudentResponse> => {
  const response = await api.post(`/groups/${groupId}/students`, { full_name: fullName });
  return response.data;
};

export const updateStudent = async (studentId: number, fullName: string): Promise<StudentResponse> => {
  const response = await api.put(`/students/${studentId}`, { full_name: fullName });
  return response.data;
};

export const deleteStudent = async (studentId: number): Promise<void> => {
  await api.delete(`/students/${studentId}`);
};

// Teacher API - Modules
export const getModules = async (groupId: number): Promise<Module[]> => {
  const response = await api.get(`/groups/${groupId}/modules`);
  return response.data;
};

export const createModule = async (groupId: number): Promise<Module> => {
  const response = await api.post(`/groups/${groupId}/modules`);
  return response.data;
};

export const deleteModule = async (moduleId: number): Promise<void> => {
  await api.delete(`/modules/${moduleId}`);
};

export const finishModule = async (moduleId: number): Promise<void> => {
  await api.post(`/modules/${moduleId}/finish`);
};

// Teacher API - Lessons
export const getLessons = async (moduleId: number): Promise<Lesson[]> => {
  const response = await api.get(`/modules/${moduleId}/lessons`);
  return response.data;
};

export const startLesson = async (moduleId: number): Promise<Lesson> => {
  const response = await api.post(`/modules/${moduleId}/lessons/start`);
  return response.data;
};

export const finishLesson = async (lessonId: number): Promise<void> => {
  await api.post(`/lessons/${lessonId}/finish`);
};

export const deleteLesson = async (lessonId: number): Promise<void> => {
  await api.delete(`/lessons/${lessonId}`);
};

// Teacher API - Criteria
export const getCriteria = async (moduleId: number): Promise<Criteria[]> => {
  const response = await api.get(`/modules/${moduleId}/criteria`);
  return response.data;
};

export const createCriteria = async (moduleId: number, criteria: CriteriaCreate): Promise<Criteria> => {
  const response = await api.post(`/modules/${moduleId}/criteria`, criteria);
  return response.data;
};

export const updateCriteria = async (criteriaId: number, criteria: CriteriaCreate): Promise<Criteria> => {
  const response = await api.put(`/criteria/${criteriaId}`, criteria);
  return response.data;
};

export const deleteCriteria = async (criteriaId: number): Promise<void> => {
  await api.delete(`/criteria/${criteriaId}`);
};

// Teacher API - Grades
export const createGrade = async (grade: GradeCreate): Promise<Grade> => {
  const response = await api.post('/grades', grade);
  return response.data;
};

export const getLeaderboard = async (moduleId: number): Promise<LeaderboardEntry[]> => {
  const response = await api.get(`/modules/${moduleId}/leaderboard`);
  return response.data;
};