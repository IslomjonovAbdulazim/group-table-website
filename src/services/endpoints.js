import api from './api';

// Ommaviy API'lar (avtorizatsiya kerak emas)
export const publicAPI = {
  // Guruhni kod bo'yicha topish
  async getGroupByCode(code) {
    const response = await api.get(`/public/${code}`);
    return response.data;
  },

  // Guruh modullarini olish
  async getGroupModules(code) {
    const response = await api.get(`/public/${code}/modules`);
    return response.data;
  },

  // Modul liderlik jadvalini olish
  async getModuleLeaderboard(code, moduleId) {
    const response = await api.get(`/public/${code}/modules/${moduleId}`);
    return response.data;
  },

  // O'quvchi grafigini olish
  async getStudentChart(code, studentId) {
    const response = await api.get(`/public/${code}/students/${studentId}/chart`);
    return response.data;
  }
};

// O'qituvchi API'lari
export const teacherAPI = {
  // Guruhlar
  async getGroups() {
    const response = await api.get('/groups');
    return response.data;
  },

  async createGroup(name) {
    const response = await api.post('/groups', { name });
    return response.data;
  },

  async updateGroup(groupId, name) {
    const response = await api.put(`/groups/${groupId}`, { name });
    return response.data;
  },

  async deleteGroup(groupId) {
    const response = await api.delete(`/groups/${groupId}`);
    return response.data;
  },

  async finishGroup(groupId) {
    const response = await api.post(`/groups/${groupId}/finish`);
    return response.data;
  },

  // O'quvchilar
  async getStudents(groupId) {
    const response = await api.get(`/groups/${groupId}/students`);
    return response.data;
  },

  async createStudent(groupId, fullName) {
    const response = await api.post(`/groups/${groupId}/students`, { full_name: fullName });
    return response.data;
  },

  async updateStudent(studentId, fullName) {
    const response = await api.put(`/students/${studentId}`, { full_name: fullName });
    return response.data;
  },

  async deleteStudent(studentId) {
    const response = await api.delete(`/students/${studentId}`);
    return response.data;
  },

  // Modullar
  async getModules(groupId) {
    const response = await api.get(`/groups/${groupId}/modules`);
    return response.data;
  },

  async createModule(groupId) {
    const response = await api.post(`/groups/${groupId}/modules`);
    return response.data;
  },

  async deleteModule(moduleId) {
    const response = await api.delete(`/modules/${moduleId}`);
    return response.data;
  },

  async finishModule(moduleId) {
    const response = await api.post(`/modules/${moduleId}/finish`);
    return response.data;
  },

  // Darslar
  async getLessons(moduleId) {
    const response = await api.get(`/modules/${moduleId}/lessons`);
    return response.data;
  },

  async startLesson(moduleId) {
    const response = await api.post(`/modules/${moduleId}/lessons/start`);
    return response.data;
  },

  async finishLesson(lessonId) {
    const response = await api.post(`/lessons/${lessonId}/finish`);
    return response.data;
  },

  async deleteLesson(lessonId) {
    const response = await api.delete(`/lessons/${lessonId}`);
    return response.data;
  },

  // Mezonlar
  async getCriteria(moduleId) {
    const response = await api.get(`/modules/${moduleId}/criteria`);
    return response.data;
  },

  async createCriteria(moduleId, name, maxPoints, gradingMethod) {
    const response = await api.post(`/modules/${moduleId}/criteria`, {
      name,
      max_points: maxPoints,
      grading_method: gradingMethod
    });
    return response.data;
  },

  async updateCriteria(criteriaId, name, maxPoints, gradingMethod) {
    const response = await api.put(`/criteria/${criteriaId}`, {
      name,
      max_points: maxPoints,
      grading_method: gradingMethod
    });
    return response.data;
  },

  async deleteCriteria(criteriaId) {
    const response = await api.delete(`/criteria/${criteriaId}`);
    return response.data;
  },

  // Baholar
  async createGrade(pointsEarned, studentId, criteriaId, lessonId) {
    const response = await api.post('/grades', {
      points_earned: pointsEarned,
      student_id: studentId,
      criteria_id: criteriaId,
      lesson_id: lessonId
    });
    return response.data;
  },

  async getLeaderboard(moduleId) {
    const response = await api.get(`/modules/${moduleId}/leaderboard`);
    return response.data;
  }
};

// Admin API'lari
export const adminAPI = {
  // O'qituvchilar
  async getTeachers() {
    const response = await api.get('/admin/teachers');
    return response.data;
  },

  async createTeacher(name, email, password) {
    const response = await api.post('/admin/teachers', { name, email, password });
    return response.data;
  },

  async updateTeacher(teacherId, name, email) {
    const response = await api.put(`/admin/teachers/${teacherId}`, { name, email });
    return response.data;
  },

  async deleteTeacher(teacherId) {
    const response = await api.delete(`/admin/teachers/${teacherId}`);
    return response.data;
  },

  async getTeacherStats(teacherId) {
    const response = await api.get(`/admin/teachers/${teacherId}/stats`);
    return response.data;
  },

  async changeTeacherPassword(teacherId, newPassword) {
    const response = await api.post(`/admin/teachers/${teacherId}/change-password`, {
      new_password: newPassword
    });
    return response.data;
  }
};