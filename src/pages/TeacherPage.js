import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserType, logout } from '../services/authService';
import { getGroups, createGroup, updateGroup, deleteGroup, finishGroup } from '../services/groupService';
import '../styles/TeacherPage.css';

const TeacherPage = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const userType = getUserType();
    if (userType !== 'teacher') {
      navigate('/login');
      return;
    }
    loadGroups();
  }, [navigate]);

  const loadGroups = async () => {
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups');
    }
    setLoading(false);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    
    setCreating(true);
    try {
      await createGroup(groupName);
      await loadGroups();
      setGroupName('');
      setShowCreateForm(false);
    } catch (error) {
      alert('Guruh yaratilmadi. Maksimal 6 ta faol guruh bo\'lishi mumkin.');
    }
    setCreating(false);
  };

  const handleEditGroup = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editingGroup) return;
    
    try {
      await updateGroup(editingGroup.id, editName);
      await loadGroups();
      setEditingGroup(null);
      setEditName('');
    } catch (error) {
      alert('Guruh nomi o\'zgartirilmadi');
    }
  };

  const handleDeleteGroup = async (group) => {
    if (window.confirm(`"${group.name}" guruhini o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.`)) {
      try {
        await deleteGroup(group.id);
        await loadGroups();
      } catch (error) {
        alert('Guruh o\'chirilmadi');
      }
    }
  };

  const handleFinishGroup = async (group) => {
    if (window.confirm(`"${group.name}" guruhini tugatmoqchimisiz? Bu amal guruhni nofaol holatga o'tkazadi.`)) {
      try {
        await finishGroup(group.id);
        await loadGroups();
      } catch (error) {
        alert('Guruh holati o\'zgartirilmadi');
      }
    }
  };

  const startEdit = (group) => {
    setEditingGroup(group);
    setEditName(group.name);
  };

  const cancelEdit = () => {
    setEditingGroup(null);
    setEditName('');
  };

  const handleGroupClick = (groupId) => {
    if (!editingGroup) {
      navigate(`/teacher/group/${groupId}`);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="teacher-page-modern">
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <h3>Ma'lumotlar yuklanmoqda...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-page-modern">
      {/* Header */}
      <header className="teacher-header-modern">
        <div className="header-background">
          <div className="header-pattern"></div>
        </div>
        <div className="header-container">
          <div className="header-content">
            <div className="header-left">
              <div className="teacher-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
              </div>
              <div className="header-title">
                <h1>O'qituvchi Paneli</h1>
                <p>Guruhlaringizni tanlang va boshqaring</p>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn-modern">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="teacher-main-modern">
        <div className="main-container">
          <div className="groups-overview">
            <div className="overview-header">
              <div className="header-content-overview">
                <div>
                  <h2>Mening Guruhlarim</h2>
                  <p>{groups.length} ta guruh (maksimal 6 ta)</p>
                </div>
                <button 
                  className="create-group-btn"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  disabled={groups.filter(g => g.is_active).length >= 6}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Yangi guruh</span>
                </button>
              </div>
            </div>

            {showCreateForm && (
              <div className="create-form-card">
                <div className="form-header">
                  <h3>Yangi guruh yaratish</h3>
                  <button 
                    className="close-btn"
                    onClick={() => {
                      setShowCreateForm(false);
                      setGroupName('');
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleCreateGroup} className="create-form">
                  <div className="form-group">
                    <label className="form-label">Guruh nomi</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Masalan: Matematika 10-A"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      required
                      disabled={creating}
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={creating || !groupName.trim()}>
                      {creating ? (
                        <div className="btn-loading">
                          <div className="loading-spinner"></div>
                          <span>Yaratilmoqda...</span>
                        </div>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                          <span>Guruh yaratish</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {groups.length === 0 ? (
              <div className="empty-groups">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3>Hali guruhlar yo'q</h3>
                <p>Administrator sizga guruh tayinlaganidan so'ng bu yerda ko'rinadi</p>
              </div>
            ) : (
              <div className="groups-grid-modern">
                {groups.map((group) => (
                  <div 
                    key={group.id}
                    className={`group-card-modern ${group.is_active ? 'active' : 'inactive'} ${editingGroup?.id === group.id ? 'editing' : ''}`}
                    onClick={() => handleGroupClick(group.id)}
                  >
                    <div className="group-header">
                      <div className="group-icon">
                        <span>{group.code}</span>
                      </div>
                      <div className="group-status">
                        <span className={`status-badge ${group.is_active ? 'active' : 'inactive'}`}>
                          {group.is_active ? 'Faol' : 'Tugatilgan'}
                        </span>
                      </div>
                    </div>
                    
                    {editingGroup?.id === group.id ? (
                      <div className="edit-form">
                        <form onSubmit={handleEditGroup} onClick={(e) => e.stopPropagation()}>
                          <div className="form-group">
                            <label className="form-label">Guruh nomi</label>
                            <input
                              type="text"
                              className="form-input"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              required
                              autoFocus
                            />
                          </div>
                          <div className="edit-actions">
                            <button type="submit" className="save-btn" disabled={!editName.trim()}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="20,6 9,17 4,12"/>
                              </svg>
                            </button>
                            <button type="button" className="cancel-btn" onClick={cancelEdit}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="group-content">
                        <h3>{group.name}</h3>
                        <p className="group-code-text">Kod: {group.code}</p>
                        
                        <div className="group-actions">
                          <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                            <button 
                              className="action-btn manage"
                              onClick={() => handleGroupClick(group.id)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5"/>
                                <path d="M2 12l10 5 10-5"/>
                              </svg>
                              <span>Boshqarish</span>
                            </button>
                            
                            <button 
                              className="action-btn edit"
                              onClick={() => startEdit(group)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 20h9"/>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                              </svg>
                              <span>Tahrirlash</span>
                            </button>
                            
                            {group.is_active ? (
                              <button 
                                className="action-btn finish"
                                onClick={() => handleFinishGroup(group)}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <circle cx="12" cy="12" r="10"/>
                                  <polyline points="16,12 12,8 8,12"/>
                                  <line x1="12" y1="16" x2="12" y2="8"/>
                                </svg>
                                <span>Tugatish</span>
                              </button>
                            ) : (
                              <button 
                                className="action-btn delete"
                                onClick={() => handleDeleteGroup(group)}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <polyline points="3,6 5,6 21,6"/>
                                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                                  <line x1="10" y1="11" x2="10" y2="17"/>
                                  <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                                <span>O'chirish</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherPage;