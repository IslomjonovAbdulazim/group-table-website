import api from './api';
import { LoginRequest, LoginResponse, PasswordChange, TeacherPasswordChange } from '../types';

// Authentication
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  window.location.href = '/';
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Get user type
export const getUserType = (): string | null => {
  return localStorage.getItem('userType');
};

// Admin password change
export const changeAdminPassword = async (passwordData: PasswordChange): Promise<void> => {
  await api.post('/admin/change-password', passwordData);
};

// Teacher password change (by admin)
export const changeTeacherPassword = async (teacherId: number, passwordData: TeacherPasswordChange): Promise<void> => {
  await api.post(`/admin/teachers/${teacherId}/change-password`, passwordData);
};

// Teacher self password change
export const changeTeacherSelfPassword = async (passwordData: PasswordChange): Promise<void> => {
  await api.post('/change-password', passwordData);
};