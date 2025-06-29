import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import { validateEmail, validatePassword } from '../utils/helpers';
import Loading from '../components/common/Loading';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError('Noto\'g\'ri email format');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);
      login(response.access_token, response.user_type);
      
      if (response.user_type === 'teacher') {
        navigate('/teacher');
      } else if (response.user_type === 'admin') {
        navigate('/admin');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <Loading text="Tizimga kirish..." />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form">
          <h1>Tizimga kirish</h1>
          <p>O'qituvchi yoki Admin sifatida kirish</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email manzilingizni kiriting"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Parol</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Parolingizni kiriting"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Kirish
            </button>
          </form>

          <div className="login-info">
            <p><strong>O'qituvchilar:</strong> Admin tomonidan berilgan email va parolingiz bilan kiring</p>
            <p><strong>Adminlar:</strong> Tizim email va parolingiz bilan kiring</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;