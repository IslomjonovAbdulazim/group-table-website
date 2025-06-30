import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedGroups, removeSavedGroup } from '../utils/localStorage';
import '../styles/HomePage.css';

const HomePage = () => {
  const [searchCode, setSearchCode] = useState('');
  const [savedGroups, setSavedGroups] = useState(getSavedGroups());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchCode.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/group/${searchCode.trim().toUpperCase()}`);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGroupClick = (code) => {
    navigate(`/group/${code}`);
  };

  const handleRemoveGroup = (code, e) => {
    e.stopPropagation();
    removeSavedGroup(code);
    setSavedGroups(getSavedGroups());
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-page-new">
      {/* Header */}
      <header className="home-header-new">
        <div className="header-container">
          <div className="header-content">
            {/* Logo */}
            <div className="logo-section">
              <div className="logo-icon">
                <span>GT</span>
              </div>
              <h1 className="logo-text">GroupTable</h1>
            </div>

            {/* Login Button */}
            <button onClick={handleLogin} className="login-btn-header">
              Kirish
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main-new">
        <div className="container">

          {/* Quick Search Section */}
          <div className="quick-search-section">
            <div className="search-card">
              <div className="search-card-header">
                <h3>Tezkor Qidiruv</h3>
                <p>Guruh kodini kiritib, natijalarni darhol ko'ring</p>
              </div>
              
              <div className="search-form">
                <div className="form-group">
                  <input
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Masalan: A, B, AA, AB..."
                    className="search-input-main"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading || !searchCode.trim()}
                  className="search-btn-main"
                >
                  {loading ? (
                    <div className="btn-loading">
                      <div className="loading-spinner"></div>
                      <span>Qidirilmoqda...</span>
                    </div>
                  ) : (
                    'Guruhni Qidirish'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Saved Groups Section */}
          {savedGroups.length > 0 && (
            <div className="saved-groups-section">
              <div className="section-header">
                <h3>Saqlangan Guruhlar</h3>
                <p>Oxirgi ko'rilgan guruhlaringiz</p>
              </div>

              <div className="groups-grid">
                {savedGroups.map((group) => (
                  <div
                    key={group.code}
                    onClick={() => handleGroupClick(group.code)}
                    className="group-card-new"
                  >
                    <div className="group-card-header">
                      <div className="group-icon">
                        <span>{group.code}</span>
                      </div>
                      <button
                        onClick={(e) => handleRemoveGroup(group.code, e)}
                        className="remove-btn"
                        title="Olib tashlash"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    
                    <h4 className="group-name">{group.name}</h4>
                    
                    <div className="group-date">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      {new Date(group.savedAt).toLocaleDateString('uz-UZ')}
                    </div>
                    
                    <div className="group-action">
                      <span>Ko'rish</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9,18 15,12 9,6"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


        </div>
      </main>
    </div>
  );
};

export default HomePage;