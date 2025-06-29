import { useState } from 'react';
import { teacherAPI } from '../../services/endpoints';
import { validateGroupName, formatError } from '../../utils/helpers';

const GroupList = ({ groups, onGroupSelect, onGroupsUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateGroupName(newGroupName)) {
      setError('Guruh nomi kamida 3 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    try {
      await teacherAPI.createGroup(newGroupName);
      setNewGroupName('');
      setShowForm(false);
      onGroupsUpdate();
    } catch (error) {
      setError(formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Guruhni o\'chirmoqchimisiz?')) return;

    try {
      await teacherAPI.deleteGroup(groupId);
      onGroupsUpdate();
    } catch (error) {
      alert(formatError(error));
    }
  };

  const handleFinishGroup = async (groupId) => {
    if (!window.confirm('Guruhni yakunlamoqchimisiz?')) return;

    try {
      await teacherAPI.finishGroup(groupId);
      onGroupsUpdate();
    } catch (error) {
      alert(formatError(error));
    }
  };

  return (
    <div className="group-list">
      <div className="section-header">
        <h2>Guruhlarim</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          disabled={groups.filter(g => g.is_active).length >= 6}
        >
          Yangi guruh
        </button>
      </div>

      {groups.filter(g => g.is_active).length >= 6 && (
        <div className="warning-message">
          Maksimal 6 ta faol guruh bo'lishi mumkin
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Yangi guruh yaratish</h3>
            
            {error && (
              <div className="error-message">{error}</div>
            )}

            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label>Guruh nomi</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Masalan: 7-A sinf Matematika"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Yaratilmoqda...' : 'Yaratish'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                    setNewGroupName('');
                  }}
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="groups-grid">
        {groups.map(group => (
          <div key={group.id} className={`group-card ${!group.is_active ? 'inactive' : ''}`}>
            <div className="group-header">
              <h3>{group.name}</h3>
              <span className={`status ${group.is_active ? 'active' : 'finished'}`}>
                {group.is_active ? 'Faol' : 'Yakunlangan'}
              </span>
            </div>

            <div className="group-info">
              <p><strong>Kod:</strong> {group.code}</p>
              <p><strong>Yaratilgan:</strong> {new Date(group.created_at).toLocaleDateString('uz-UZ')}</p>
            </div>

            <div className="group-actions">
              <button 
                onClick={() => onGroupSelect(group)}
                className="btn btn-primary"
              >
                Boshqarish
              </button>

              {group.is_active && (
                <>
                  <button 
                    onClick={() => handleFinishGroup(group.id)}
                    className="btn btn-warning"
                  >
                    Yakunlash
                  </button>
                  <button 
                    onClick={() => handleDeleteGroup(group.id)}
                    className="btn btn-danger"
                  >
                    O'chirish
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="empty-state">
          <p>Hozircha guruhlar yo'q</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Birinchi guruhni yarating
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupList;