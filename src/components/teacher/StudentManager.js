import { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/endpoints';
import { validateStudentName, formatError } from '../../utils/helpers';

const StudentManager = ({ groupId }) => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (groupId) {
      fetchStudents();
    }
  }, [groupId]);

  const fetchStudents = async () => {
    try {
      const data = await teacherAPI.getStudents(groupId);
      setStudents(data);
    } catch (error) {
      console.error('O\'quvchilarni olishda xatolik:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStudentName(studentName)) {
      setError('O\'quvchi ismi kamida 2 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    try {
      if (editingStudent) {
        await teacherAPI.updateStudent(editingStudent.id, studentName);
      } else {
        await teacherAPI.createStudent(groupId, studentName);
      }
      
      setStudentName('');
      setShowForm(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      setError(formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setStudentName(student.full_name);
    setShowForm(true);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('O\'quvchini o\'chirmoqchimisiz?')) return;

    try {
      await teacherAPI.deleteStudent(studentId);
      fetchStudents();
    } catch (error) {
      alert(formatError(error));
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingStudent(null);
    setStudentName('');
    setError('');
  };

  return (
    <div className="student-manager">
      <div className="section-header">
        <h2>O'quvchilar boshqaruvi</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          disabled={students.length >= 30}
        >
          O'quvchi qo'shish
        </button>
      </div>

      {students.length >= 30 && (
        <div className="warning-message">
          Har bir guruhda maksimal 30 ta o'quvchi bo'lishi mumkin
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingStudent ? 'O\'quvchi ma\'lumotlarini o\'zgartirish' : 'Yangi o\'quvchi qo\'shish'}</h3>
            
            {error && (
              <div className="error-message">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>To'liq ismi</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Masalan: Ahmedov Olim"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Saqlanmoqda...' : (editingStudent ? 'O\'zgartirish' : 'Qo\'shish')}
                </button>
                <button type="button" onClick={closeForm}>
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="students-table">
        {students.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>To'liq ismi</th>
                <th>Qo'shilgan vaqti</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.full_name}</td>
                  <td>{new Date(student.added_at).toLocaleDateString('uz-UZ')}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(student)}
                      className="btn btn-sm btn-secondary"
                    >
                      Tahrirlash
                    </button>
                    <button 
                      onClick={() => handleDelete(student.id)}
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
            <p>Hozircha o'quvchilar yo'q</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Birinchi o'quvchini qo'shing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManager;