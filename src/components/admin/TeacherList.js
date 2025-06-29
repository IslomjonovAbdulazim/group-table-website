import { useState } from 'react';
import { adminAPI } from '../../services/endpoints';
import { validateEmail, validatePassword, validateGroupName, formatError } from '../../utils/helpers';

const TeacherList = ({ teachers, onTeacherSelect, onTeachersUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateGroupName(formData.name)) {
      setError('Ism kamida 3 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Noto\'g\'ri email format');
      return;
    }

    if (!editingTeacher && !validatePassword(formData.password)) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    try {
      if (editingTeacher) {
        await adminAPI.updateTeacher(editingTeacher.id, formData.name, formData.email);
      } else {
        await adminAPI.createTeacher(formData.name, formData.email, formData.password);
      }
      
      resetForm();
      onTeachersUpdate();
    } catch (error) {
      setError(formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: ''
    });
    setShowForm(true);
  };

  const handleDelete = async (teacherId) => {
    if (!window.confirm('O\'qituvchini o\'chirmoqchimisiz? Bu amal qaytarilmaydi!')) return;

    try {
      await adminAPI.deleteTeacher(teacherId);
      onTeachersUpdate();
    } catch (error) {
      alert(formatError(error));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setShowForm(false);
    setEditingTeacher(null);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="teacher-list">
      <div className="section-header">
        <h2>O'qituvchilar boshqaruvi</h2>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          Yangi o'qituvchi
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingTeacher ? 'O\'qituvchi ma\'lumotlarini o\'zgartirish' : 'Yangi o\'qituvchi yaratish'}</h3>
            
            {error && (
              <div className="error-message">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>To'liq ismi</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="O'qituvchi ismi"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="teacher@school.com"
                  required
                />
              </div>

              {!editingTeacher && (
                <div className="form-group">
                  <label>Parol</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Kamida 6 ta belgi"
                    required
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Saqlanmoqda...' : (editingTeacher ? 'O\'zgartirish' : 'Yaratish')}
                </button>
                <button type="button" onClick={resetForm}>
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="teachers-table">
        {teachers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Ismi</th>
                <th>Email</th>
                <th>Yaratilgan</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={teacher.id}>
                  <td>{index + 1}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{new Date(teacher.created_at).toLocaleDateString('uz-UZ')}</td>
                  <td>
                    <button 
                      onClick={() => onTeacherSelect(teacher)}
                      className="btn btn-sm btn-secondary"
                    >
                      Statistika
                    </button>
                    <button 
                      onClick={() => handleEdit(teacher)}
                      className="btn btn-sm btn-primary"
                    >
                      Tahrirlash
                    </button>
                    <button 
                      onClick={() => handleDelete(teacher.id)}
                      className="btn btn-sm btn-danger"
                    >
                      O'chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>Hozircha o'qituvchilar yo'q</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Birinchi o'qituvchini yarating
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherList;