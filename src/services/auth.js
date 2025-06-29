import api from './api';

export const authService = {
  // Login qilish
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Tizimga kirish xatoligi');
    }
  },

  // O'qituvchi parolini o'zgartirish
  async changeTeacherPassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Parol o\'zgartirish xatoligi');
    }
  },

  // Admin parolini o'zgartirish
  async changeAdminPassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/admin/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Admin parol o\'zgartirish xatoligi');
    }
  },

  // Token ni tekshirish
  isValidToken() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
};