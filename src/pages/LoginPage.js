import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('userType', response.user_type);
      
      if (response.user_type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/teacher');
      }
    } catch (error) {
      setError('Email yoki parol noto\'g\'ri');
    }
    
    setLoading(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-page-modern">
      <div className="login-background">
        <div className="background-pattern"></div>
      </div>
      
      <div className="login-container">
        <div className="login-card-modern">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">
                <span>GT</span>
              </div>
              <h1>GroupTable</h1>
            </div>
            <h2>Tizimga Kirish</h2>
            <p>O'qituvchi yoki administrator sifatida kirish</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group-modern">
              <label className="form-label-modern">Email manzil</label>
              <div className="input-container">
                <input
                  type="email"
                  className={`form-input-modern ${error ? 'error' : ''}`}
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="form-group-modern">
              <label className="form-label-modern">Parol</label>
              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input-modern ${error ? 'error' : ''}`}
                  placeholder="Parolingizni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message-modern">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <button 
              type="submit" 
              className="login-btn-modern"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <div className="btn-loading">
                  <div className="loading-spinner"></div>
                  <span>Kirilmoqda...</span>
                </div>
              ) : (
                <>
                  <span>Kirish</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <button onClick={handleBackToHome} className="back-link-modern">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Bosh sahifaga qaytish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;