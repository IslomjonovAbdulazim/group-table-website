import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserType, logout } from '../services/authService';
import GroupManager from '../components/GroupManager';
import '../styles/TeacherPage.css';

const TeacherPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = getUserType();
    if (userType !== 'teacher') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="teacher-page">
      <header className="teacher-header">
        <div className="container">
          <h1>O'qituvchi Paneli</h1>
          <button className="btn btn-secondary" onClick={logout}>
            Chiqish
          </button>
        </div>
      </header>
      
      <main className="teacher-main">
        <div className="container">
          <GroupManager />
        </div>
      </main>
    </div>
  );
};

export default TeacherPage;