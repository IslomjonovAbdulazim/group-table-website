import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/endpoints';
import { validatePassword, formatError } from '../../utils/helpers';

const TeacherStats = ({ teacher }) => {
  const [stats, setStats] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (teacher) {
      fetchStats();
    }
  }, [teacher]);

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getTeacherStats(teacher.id);
      setStats(data);
    } catch (error) {
      console.error('Statistikani olishda xatolik:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(newPassword)) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    try {
      await adminAPI.changeTeacherPassword(teacher.id, newPassword);
      setNewPassword('');
      setShowPasswordForm(false);
      alert('Parol muvaffaqiyatli o\'zgartirildi');
    } catch (error) {
      setError(formatError(error));
    } finally {
      setLoading(false);
    }
  };

  if (!teacher) {
    return (
      <div className="teacher-stats">
        <div className="empty-state">
          <p>O'qituvchini tanlang</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-stats">
      <div className="teacher-header">
        <h2>{teacher.name} statistikasi</h2>
        <div className="teacher-info">
          <p><strong>Email:</strong> {teacher.email}</p>
          <p><strong>Ro'yxatdan o'tgan:</strong> {new Date(teacher.created_at).toLocaleDateString('uz-UZ')}</p>
        </div>
      </div>

      <div className="password-section">
        <h3>Parol boshqaruvi</h3>
        <button 
          onClick={() => setShowPasswordForm(true)}
          className="btn btn-warning"
        >
          Parolni o'zgartirish
        </button>

        {showPasswordForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>O'qituvchi parolini o'zgartirish</h3>
              
              {error && (
                <div className="error-message">{error}</div>
              )}

              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Yangi parol</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Kamida 6 ta belgi"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? 'O\'zgartirilmoqda...' : 'O\'zgartirish'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowPasswordForm(false);
                      setError('');
                      setNewPassword('');
                    }}
                  >
                    Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {stats && (
        <div className="stats-section">
          <h3>Umumiy statistika</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Guruhlar</h4>
              <span className="stat-number">{stats.groups}</span>
              <small>Jami yaratilgan</small>
            </div>

            <div className="stat-card">
              <h4>O'quvchilar</h4>
              <span className="stat-number">{stats.students}</span>
              <small>Jami qo'shilgan</small>
            </div>

            <div className="stat-card">
              <h4>Modullar</h4>
              <span className="stat-number">{stats.modules}</span>
              <small>Jami yaratilgan</small>
            </div>

            <div className="stat-card">
              <h4>Darslar</h4>
              <span className="stat-number">{stats.lessons}</span>
              <small>Jami o'tkazilgan</small>
            </div>

            <div className="stat-card">
              <h4>Baholar</h4>
              <span className="stat-number">{stats.total_grades}</span>
              <small>Jami qo'yilgan</small>
            </div>

            <div className="stat-card">
              <h4>O'rtacha</h4>
              <span className="stat-number">
                {stats.students > 0 ? Math.round(stats.total_grades / stats.students) : 0}
              </span>
              <small>Baho/O'quvchi</small>
            </div>
          </div>

          <div className="performance-indicators">
            <h4>Faollik ko'rsatkichlari</h4>
            <div className="indicators-list">
              <div className="indicator">
                <span>Darslar/Modul:</span>
                <strong>
                  {stats.modules > 0 ? Math.round(stats.lessons / stats.modules * 10) / 10 : 0}
                </strong>
              </div>
              <div className="indicator">
                <span>O'quvchi/Guruh:</span>
                <strong>
                  {stats.groups > 0 ? Math.round(stats.students / stats.groups * 10) / 10 : 0}
                </strong>
              </div>
              <div className="indicator">
                <span>Faollik darajasi:</span>
                <strong className={stats.total_grades > 100 ? 'high' : stats.total_grades > 50 ? 'medium' : 'low'}>
                  {stats.total_grades > 100 ? 'Yuqori' : stats.total_grades > 50 ? 'O\'rtacha' : 'Past'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStats;