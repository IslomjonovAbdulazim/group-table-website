import React, { useState, useEffect } from 'react';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher, getTeacherStats } from '../services/groupService';
import { changeTeacherPassword } from '../services/authService';

const TeacherManager = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [stats, setStats] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data);
      
      // Load stats for each teacher
      const statsData = {};
      for (const teacher of data) {
        try {
          statsData[teacher.id] = await getTeacherStats(teacher.id);
        } catch (error) {
          console.error(`Failed to load stats for teacher ${teacher.id}`);
        }
      }
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load teachers');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, { name: formData.name, email: formData.email });
      } else {
        await createTeacher(formData);
      }
      await loadTeachers();
      resetForm();
    } catch (error) {
      alert('Amaliyot bajarilmadi');
    }
    setFormLoading(false);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({ name: teacher.name, email: teacher.email, password: '' });
    setShowForm(true);
  };

  const handleDelete = async (teacher) => {
    if (window.confirm(`${teacher.name}ni o'chirmoqchimisiz?`)) {
      try {
        await deleteTeacher(teacher.id);
        await loadTeachers();
      } catch (error) {
        alert('O\'chirib bo\'lmadi');
      }
    }
  };

  const handlePasswordChange = async (teacherId) => {
    const newPassword = prompt('Yangi parol kiriting:');
    if (newPassword && newPassword.length >= 6) {
      try {
        await changeTeacherPassword(teacherId, { new_password: newPassword });
        alert('Parol muvaffaqiyatli o\'zgartirildi');
      } catch (error) {
        alert('Parol o\'zgartirilmadi');
      }
    } else if (newPassword) {
      alert('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setEditingTeacher(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="teacher-manager-loading">
        <div className="loading-card">
          <div className="loading-spinner-large"></div>
          <h3>Ma'lumotlar yuklanmoqda...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-manager-modern">
      <div className="manager-header">
        <div className="header-info">
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            O'qituvchilar
          </h2>
          <p>{teachers.length} ta o'qituvchi</p>
        </div>
        <button 
          className="add-teacher-btn" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Yangi o'qituvchi</span>
        </button>
      </div>

      {showForm && (
        <div className="teacher-form-card">
          <div className="form-header">
            <h3>{editingTeacher ? 'O\'qituvchini tahrirlash' : 'Yangi o\'qituvchi qo\'shish'}</h3>
            <button className="close-form-btn" onClick={resetForm}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="teacher-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ism</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="O'qituvchi ismi"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  disabled={formLoading}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="teacher@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  disabled={formLoading}
                />
              </div>
            </div>
            
            {!editingTeacher && (
              <div className="form-group">
                <label className="form-label">Parol</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Kamida 6 ta belgi"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={6}
                  disabled={formLoading}
                />
              </div>
            )}
            
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={formLoading}>
                {formLoading ? (
                  <div className="btn-loading">
                    <div className="loading-spinner"></div>
                    <span>{editingTeacher ? 'Yangilanmoqda...' : 'Yaratilmoqda...'}</span>
                  </div>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    <span>{editingTeacher ? 'Yangilash' : 'Yaratish'}</span>
                  </>
                )}
              </button>
              <button type="button" className="cancel-btn" onClick={resetForm} disabled={formLoading}>
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="teachers-grid">
        {teachers.length === 0 ? (
          <div className="empty-teachers">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>Hech qanday o'qituvchi yo'q</h3>
            <p>Birinchi o'qituvchini qo'shish uchun yuqoridagi tugmani bosing</p>
          </div>
        ) : (
          teachers.map((teacher) => (
            <div key={teacher.id} className="teacher-card">
              <div className="teacher-header">
                <div className="teacher-avatar">
                  <span>{teacher.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="teacher-info">
                  <h3>{teacher.name}</h3>
                  <p className="teacher-email">{teacher.email}</p>
                </div>
              </div>
              
              <div className="teacher-stats">
                {stats[teacher.id] ? (
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-number">{stats[teacher.id].groups}</span>
                      <span className="stat-label">Guruhlar</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{stats[teacher.id].students}</span>
                      <span className="stat-label">Talabalar</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{stats[teacher.id].modules}</span>
                      <span className="stat-label">Modullar</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{stats[teacher.id].total_grades}</span>
                      <span className="stat-label">Baholar</span>
                    </div>
                  </div>
                ) : (
                  <div className="stats-loading">
                    <div className="loading-spinner"></div>
                    <span>Statistika yuklanmoqda...</span>
                  </div>
                )}
              </div>
              
              <div className="teacher-actions">
                <button className="action-btn edit" onClick={() => handleEdit(teacher)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  <span>Tahrirlash</span>
                </button>
                
                <button className="action-btn password" onClick={() => handlePasswordChange(teacher.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>Parol</span>
                </button>
                
                <button className="action-btn delete" onClick={() => handleDelete(teacher)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  <span>O'chirish</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherManager;