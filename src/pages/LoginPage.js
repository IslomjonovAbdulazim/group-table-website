import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card card">
          <div className="card-header">
            <h2>Tizimga Kirish</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email manzilingiz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Parol</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Parolingiz"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-primary login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Kirilmoqda...
                  </>
                ) : (
                  'Kirish'
                )}
              </button>
            </form>
          </div>
          <div className="card-footer">
            <a href="/" className="back-link">← Bosh sahifaga qaytish</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;