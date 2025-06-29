import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserType, logout } from '../services/authService';
import TeacherManager from '../components/TeacherManager';
import AccountSettings from '../components/AccountSettings';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = getUserType();
    if (userType !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="container">
          <h1>Administrator Paneli</h1>
          <button className="btn btn-secondary" onClick={logout}>
            Chiqish
          </button>
        </div>
      </header>
      
      <main className="admin-main">
        <div className="container">
          <div className="admin-content">
            <TeacherManager />
            <AccountSettings />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;