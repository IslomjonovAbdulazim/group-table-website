import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth AuthProvider ichida ishlatilishi kerak');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Local storage dan token va user type ni olish
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token && userType) {
      setUser({ token, userType });
    }
    setLoading(false);
  }, []);

  const login = (token, userType) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    setUser({ token, userType });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUser(null);
  };

  const isTeacher = () => user?.userType === 'teacher';
  const isAdmin = () => user?.userType === 'admin';
  const isAuthenticated = () => !!user?.token;

  const value = {
    user,
    login,
    logout,
    isTeacher,
    isAdmin,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};