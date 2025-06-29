import React, { useState, useEffect } from 'react';
import { Teacher, TeacherCreate, TeacherUpdate, TeacherStats } from '../types';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher, getTeacherStats } from '../services/groupService';
import { changeTeacherPassword } from '../services/authService';

const TeacherManager: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<TeacherCreate>({ name: '', email: '', password: '' });
  const [stats, setStats] = useState<{[key: number]: TeacherStats}>({});

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data);
      
      // Load stats for each teacher
      const statsData: {[key: number]: TeacherStats} = {};
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({ name: teacher.name, email: teacher.email, password: '' });
    setShowForm(true);
  };

  const handleDelete = async (teacher: Teacher) => {
    if (window.confirm(`${teacher.name}ni o'chirmoqchimisiz?`)) {
      try {
        await deleteTeacher(teacher.id);
        await loadTeachers();
      } catch (error) {
        alert('O\'chirib bo\'lmadi');
      }
    }
  };

  const handlePasswordChange = async (teacherId: number) => {
    const newPassword = prompt('Yangi parol kiriting:');
    if (newPassword) {
      try {
        await changeTeacherPassword(teacherId, { new_password: newPassword });
        alert('Parol muvaffaqiyatli o\'zgartirildi');
      } catch (error) {
        alert('Parol o\'zgartirilmadi');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setEditingTeacher(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="teacher-manager card">
      <div className="card-header">
        <h2>O'qituvchilar</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Yangi o'qituvchi
        </button>
      </div>
      
      <div className="card-body">
        {showForm && (
          <div className="teacher-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Ism</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              {!editingTeacher && (
                <div className="form-group">
                  <label className="form-label">Parol</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              )}
              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingTeacher ? 'Yangilash' : 'Yaratish'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="teachers-list">
          {teachers.length === 0 ? (
            <p>Hech qanday o'qituvchi yo'q</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Ism</th>
                  <th>Email</th>
                  <th>Statistika</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td>
                      {stats[teacher.id] ? (
                        <small>
                          {stats[teacher.id].groups} guruh, {stats[teacher.id].students} talaba
                        </small>
                      ) : (
                        <span className="loading-spinner"></span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-warning" onClick={() => handleEdit(teacher)}>
                        Tahrirlash
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => handlePasswordChange(teacher.id)}>
                        Parol
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(teacher)}>
                        O'chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherManager;