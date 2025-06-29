import api from './api';

// Authentication
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  window.location.href = '/';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get user type
export const getUserType = () => {
  return localStorage.getItem('userType');
};

// Admin password change
export const changeAdminPassword = async (passwordData) => {
  await api.post('/admin/change-password', passwordData);
};

// Teacher password change (by admin)
export const changeTeacherPassword = async (teacherId, passwordData) => {
  await api.post(`/admin/teachers/${teacherId}/change-password`, passwordData);
};

// Teacher self password change
export const changeTeacherSelfPassword = async (passwordData) => {
  await api.post('/change-password', passwordData);
};