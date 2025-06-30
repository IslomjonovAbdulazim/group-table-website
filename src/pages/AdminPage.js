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

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-page-modern">
      {/* Header */}
      <header className="admin-header-modern">
        <div className="header-background">
          <div className="header-pattern"></div>
        </div>
        <div className="header-container">
          <div className="header-content">
            <div className="header-left">
              <div className="admin-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="header-title">
                <h1>Administrator Paneli</h1>
                <p>O'qituvchilar va tizim sozlamalarini boshqarish</p>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn-modern">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="admin-main-modern">
        <div className="main-container">
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