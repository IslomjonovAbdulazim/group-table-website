import React, { useState } from 'react';
import { changeAdminPassword } from '../services/authService';

const AccountSettings = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await changeAdminPassword(passwordData);
      setMessage('Parol muvaffaqiyatli o\'zgartirildi');
      setPasswordData({ current_password: '', new_password: '' });
      setShowPasswordForm(false);
    } catch (error) {
      setMessage('Parol o\'zgartirilmadi. Joriy parolni tekshiring.');
    }
    
    setLoading(false);
  };

  const resetPasswordForm = () => {
    setShowPasswordForm(false);
    setPasswordData({ current_password: '', new_password: '' });
    setMessage('');
  };

  return (
    <div className="account-settings-modern">
      <div className="settings-header">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Hisob Sozlamalari
        </h2>
        <p>Administrator hisob ma'lumotlarini boshqarish</p>
      </div>

      {message && (
        <div className={`message-alert ${message.includes('muvaffaqiyatli') ? 'success' : 'error'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {message.includes('muvaffaqiyatli') ? (
              <polyline points="20,6 9,17 4,12"/>
            ) : (
              <>
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </>
            )}
          </svg>
          <span>{message}</span>
        </div>
      )}

      <div className="settings-section">
        <div className="section-header">
          <div className="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h3>Parolni o'zgartirish</h3>
          </div>
          <p>Hisobingiz xavfsizligini ta'minlash uchun parolni muntazam o'zgartiring</p>
        </div>

        {!showPasswordForm ? (
          <div className="section-content">
            <button 
              className="change-password-btn"
              onClick={() => setShowPasswordForm(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              <span>Parolni o'zgartirish</span>
            </button>
          </div>
        ) : (
          <div className="password-form-card">
            <div className="form-header">
              <h4>Yangi parol kiriting</h4>
              <button className="close-form-btn" onClick={resetPasswordForm}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label className="form-label">Joriy parol</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Joriy parolingizni kiriting"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    current_password: e.target.value
                  })}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Yangi parol</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Yangi parolingizni kiriting"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    new_password: e.target.value
                  })}
                  required
                  disabled={loading}
                  minLength={6}
                />
                <small className="form-hint">Kamida 6 ta belgidan iborat bo'lishi kerak</small>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <div className="btn-loading">
                      <div className="loading-spinner"></div>
                      <span>O'zgartirilmoqda...</span>
                    </div>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                      <span>O'zgartirish</span>
                    </>
                  )}
                </button>
                
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={resetPasswordForm}
                  disabled={loading}
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div className="section-header">
          <div className="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12,2a15.3,15.3,0,0,1,4,10,15.3,15.3,0,0,1-4,10,15.3,15.3,0,0,1-4-10,15.3,15.3,0,0,1,4-10z"/>
            </svg>
            <h3>Tizim ma'lumotlari</h3>
          </div>
          <p>GroupTable administrator paneli versiya 1.0.0</p>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Administrator huquqi</span>
            <span className="info-value">To'liq kirish</span>
          </div>
          <div className="info-item">
            <span className="info-label">Oxirgi kirish</span>
            <span className="info-value">Bugun</span>
          </div>
          <div className="info-item">
            <span className="info-label">Sessiya holati</span>
            <span className="info-value active">Faol</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;