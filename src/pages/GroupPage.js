import React from 'react';
import { useParams } from 'react-router-dom';
import GroupDetails from '../components/GroupDetails';
import '../styles/GroupPage.css';

const GroupPage = () => {
  const { code } = useParams();

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="group-page-modern">
      {/* Header */}
      <header className="group-header-modern">
        <div className="header-background">
          <div className="header-pattern"></div>
        </div>
        <div className="header-container">
          <div className="header-content">
            <div className="header-left">
              <div className="group-code-badge">
                <span>{code}</span>
              </div>
              <div className="group-title-section">
                <h1>Guruh {code}</h1>
                <p>Talabalar reytingi va rivojlanish ma'lumotlari</p>
              </div>
            </div>
            <button onClick={handleBackToHome} className="back-btn-modern">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Bosh sahifaga qaytish</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="group-main-modern">
        <div className="main-container">
          <GroupDetails code={code || ''} />
        </div>
      </main>
    </div>
  );
};

export default GroupPage;