import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUserType } from '../services/authService';
import { getGroups, createGroup, updateGroup, deleteGroup, finishGroup } from '../services/groupService';
import '../styles/TeacherPage.css';

const TeacherPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState('');
  const [updating, setUpdating] = useState(false);

  const userType = getUserType();
  const navigate = useNavigate();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || creating) return;

    try {
      setCreating(true);
      await createGroup(newGroupName.trim());
      setNewGroupName('');
      setShowCreateForm(false);
      await loadGroups();
    } catch (error) {
      alert('Guruh yaratilmadi. Qaytadan urinib ko\'ring.');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    if (!editName.trim() || updating || !editingGroup) return;

    try {
      setUpdating(true);
      await updateGroup(editingGroup.id, editName.trim());
      setEditingGroup(null);
      setEditName('');
      await loadGroups();
    } catch (error) {
      alert('Guruh nomi o\'zgartirilmadi. Qaytadan urinib ko\'ring.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteGroup = async (group) => {
    if (!window.confirm(`"${group.name}" guruhini o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.`)) {
      return;
    }

    try {
      await deleteGroup(group.id);
      await loadGroups();
    } catch (error) {
      alert('Guruh o\'chirilmadi. Qaytadan urinib ko\'ring.');
    }
  };

  const handleFinishGroup = async (group) => {
    if (!window.confirm(`"${group.name}" guruhini tugatmoqchimisiz? Bu amal guruhni nofaol holatga o'tkazadi.`)) {
      return;
    }

    try {
      await finishGroup(group.id);
      await loadGroups();
    } catch (error) {
      alert('Guruh holati o\'zgartirilmadi. Qaytadan urinib ko\'ring.');
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

  // Calculate statistics
  const activeGroups = groups.filter(g => g.is_active);
  const totalGroups = groups.length;
  const canCreateMore = activeGroups.length < 6;

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
      {/* Enhanced Header */}
      <header className="teacher-header-modern">
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
                <p>Guruhlaringizni boshqaring</p>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn-modern">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Chiqish
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="teacher-main-modern">
        <div className="main-container">
          <div className="groups-overview">
            {/* Enhanced Header with Statistics */}
            <div className="overview-header">
              <div className="header-content-overview">
                <div className="header-info">
                  <h2>Mening Guruhlarim</h2>
                  <p>Guruhlaringizni boshqaring va o'quvchilar jadvalini kuzatib boring</p>
                  <div className="groups-stats">
                    <div className="stat-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                        <path d="M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                      {activeGroups.length} faol guruh
                    </div>
                    <div className="stat-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                      </svg>
                      {totalGroups} jami guruh
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="create-group-btn"
                  disabled={!canCreateMore}
                  title={!canCreateMore ? 'Maksimal 6 ta faol guruh yaratishingiz mumkin' : ''}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  Yangi guruh
                  {!canCreateMore && <span style={{ fontSize: '0.8rem', opacity: 0.8 }}> (6/6)</span>}
                </button>
              </div>
            </div>

            {/* Enhanced Create Form */}
            {showCreateForm && (
              <div className="create-form-card">
                <div className="form-header">
                  <h3>Yangi guruh yaratish</h3>
                  <button onClick={() => setShowCreateForm(false)} className="close-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleCreateGroup} className="create-form">
                  <div className="form-group">
                    <label htmlFor="groupName">Guruh nomi</label>
                    <input
                      id="groupName"
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Masalan: 7-A sinf Matematika"
                      className="form-control"
                      required
                      disabled={creating}
                    />
                  </div>
                  <button type="submit" disabled={creating || !newGroupName.trim()} className="submit-btn">
                    {creating ? (
                      <>
                        <div className="loading-spinner-small"></div>
                        Yaratilmoqda...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                        Yaratish
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Enhanced Groups Grid */}
            {groups.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                    <path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
                <h3>Hali guruhlar yo'q</h3>
                <p>Birinchi guruhingizni yaratib, o'quvchilarni qo'shishni boshlang</p>
              </div>
            ) : (
              <div className="groups-grid-modern">
                {groups.map((group) => (
                  <div 
                    key={group.id} 
                    className={`group-card-modern ${editingGroup?.id === group.id ? 'editing' : ''}`}
                    onClick={() => handleGroupClick(group.id)}
                  >
                    <div className="group-header">
                      <div className="group-icon">{group.code}</div>
                      <span className={`status-badge ${group.is_active ? 'active' : 'inactive'}`}>
                        {group.is_active ? 'Faol' : 'Tugatilgan'}
                      </span>
                    </div>

                    <div className="group-content">
                      {editingGroup?.id === group.id ? (
                        <form onSubmit={handleUpdateGroup} className="edit-form">
                          <div className="form-group">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="form-control"
                              required
                              disabled={updating}
                              autoFocus
                            />
                          </div>
                          <div className="form-actions">
                            <button type="submit" disabled={updating || !editName.trim()} className="submit-btn">
                              {updating ? 'Saqlanmoqda...' : 'Saqlash'}
                            </button>
                            <button type="button" onClick={cancelEdit} className="cancel-btn">
                              Bekor qilish
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <h3>{group.name}</h3>
                          <p className="group-code-text">Kod: {group.code}</p>
                        </>
                      )}
                    </div>

                    {!editingGroup && (
                      <div className="group-actions">
                        <div className="action-buttons">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGroupClick(group.id);
                            }}
                            className="action-btn manage"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                              <path d="M2 17l10 5 10-5"/>
                              <path d="M2 12l10 5 10-5"/>
                            </svg>
                            Boshqarish
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(group);
                            }}
                            className="action-btn edit"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Tahrirlash
                          </button>

                          {group.is_active && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFinishGroup(group);
                              }}
                              className="action-btn finish"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="20,6 9,17 4,12"/>
                              </svg>
                              Tugatish
                            </button>
                          )}

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGroup(group);
                            }}
                            className="action-btn delete"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <polyline points="3,6 5,6 21,6"/>
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                            O'chirish
                          </button>
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