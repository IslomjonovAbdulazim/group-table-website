import React, { useState, useEffect } from 'react';
import { getGroupByCode, getGroupModules, getModuleLeaderboard } from '../services/groupService';
import { saveGroup, isGroupSaved, removeSavedGroup } from '../utils/localStorage';
import StudentChart from './StudentChart';

const GroupDetails = ({ code }) => {
  const [group, setGroup] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChart, setShowChart] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadGroupData();
    setSaved(isGroupSaved(code));
  }, [code]);

  useEffect(() => {
    if (selectedModule) {
      loadLeaderboard();
    }
  }, [selectedModule]);

  const loadGroupData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const groupData = await getGroupByCode(code);
      setGroup(groupData);
      
      const modulesData = await getGroupModules(code);
      setModules(modulesData);
      
      if (modulesData.length > 0) {
        setSelectedModule(modulesData[modulesData.length - 1]);
      }
    } catch (error) {
      setError('Guruh topilmadi yoki mavjud emas');
    }
    setLoading(false);
  };

  const loadLeaderboard = async () => {
    if (!selectedModule) return;
    
    try {
      const data = await getModuleLeaderboard(code, selectedModule.id);
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard');
    }
  };

  const handleSaveGroup = () => {
    if (group) {
      if (saved) {
        removeSavedGroup(code);
        setSaved(false);
      } else {
        saveGroup(code, group.name);
        setSaved(true);
      }
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowChart(true);
  };

  const getPositionBadge = (position) => {
    if (position === 1) return 'gold';
    if (position === 2) return 'silver';
    if (position === 3) return 'bronze';
    return 'default';
  };

  if (loading) {
    return (
      <div className="group-loading">
        <div className="loading-card">
          <div className="loading-spinner-large"></div>
          <h3>Guruh ma'lumotlari yuklanmoqda...</h3>
          <p>Iltimos kuting</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="group-error">
        <div className="error-card">
          <div className="error-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h3>Xatolik yuz berdi</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadGroupData}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="23,4 23,10 17,10"/>
              <polyline points="1,20 1,14 7,14"/>
              <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4a9,9,0,0,1-14.85,4.36L23,14"/>
            </svg>
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="group-details-modern">
      {/* Group Info Card */}
      <div className="group-info-card">
        <div className="group-card-header">
          <div className="group-main-info">
            <div className="group-avatar">
              <span>{code}</span>
            </div>
            <div className="group-details-text">
              <h2>{group.name}</h2>
              <p className="group-code">Guruh kodi: <span>{group.code}</span></p>
              <div className="group-stats">
                <div className="stat-item">
                  <span className="stat-number">{modules.length}</span>
                  <span className="stat-label">Modullar</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{leaderboard.length}</span>
                  <span className="stat-label">Talabalar</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            className={`save-btn-modern ${saved ? 'saved' : ''}`}
            onClick={handleSaveGroup}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {saved ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </>
              )}
            </svg>
            <span>{saved ? 'Saqlangan' : 'Saqlash'}</span>
          </button>
        </div>
      </div>



      {/* Leaderboard Section */}
      {modules.length > 0 && (
        <div className="leaderboard-card">
          <div className="card-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              Reyting
            </h3>
            <div className="header-controls">
              <div className="module-selector">
                <label>Modul:</label>
                <select 
                  value={selectedModule?.id || ''} 
                  onChange={(e) => {
                    const module = modules.find(m => m.id === parseInt(e.target.value));
                    setSelectedModule(module);
                  }}
                  className="module-dropdown"
                >
                  <option value="">Modulni tanlang</option>
                  {modules.map(module => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedModule && (
                <div className="leaderboard-info">
                  <span>{leaderboard.length} talaba</span>
                </div>
              )}
            </div>
          </div>
          
          {!selectedModule ? (
            <div className="no-module-selected">
              <div className="select-module-prompt">
                <div className="prompt-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <h4>Modulni tanlang</h4>
                <p>Reyting va natijalarni ko'rish uchun yuqoridagi ro'yxatdan modulni tanlang</p>
              </div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="empty-leaderboard">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9,9h.01M15,9h.01M8,13a4,4,0,0,0,8,0"/>
                </svg>
              </div>
              <h4>Hali natijalar yo'q</h4>
              <p>Bu modul uchun hali baholar kiritilmagan</p>
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map((entry, index) => (
                <div 
                  key={entry.student_id} 
                  className={`leaderboard-entry ${getPositionBadge(entry.position)} ${index < 3 ? 'podium' : ''}`}
                  onClick={() => handleStudentClick(entry)}
                >
                  <div className="entry-left">
                    <div className={`position-badge ${getPositionBadge(entry.position)}`}>
                      {entry.position === 1 && (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      )}
                      <span>#{entry.position}</span>
                    </div>
                    <div className="student-avatar">
                      <span>{entry.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="student-info">
                      <h4>{entry.name}</h4>
                      <p>Talaba</p>
                    </div>
                  </div>
                  
                  <div className="entry-right">
                    <div className="points-info">
                      <span className="points">{entry.total_points}</span>
                      <span className="points-label">ball</span>
                    </div>
                    <button className="chart-btn-modern">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="18" y1="20" x2="18" y2="10"/>
                        <line x1="12" y1="20" x2="12" y2="4"/>
                        <line x1="6" y1="20" x2="6" y2="14"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Student Chart Modal */}
      {showChart && selectedStudent && (
        <div className="modal-overlay-modern" onClick={() => setShowChart(false)}>
          <div className="modal-content-modern" onClick={e => e.stopPropagation()}>
            <div className="modal-header-modern">
              <div className="modal-title">
                <div className="student-avatar-modal">
                  <span>{selectedStudent.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3>{selectedStudent.name}</h3>
                  <p>Rivojlanish grafigi</p>
                </div>
              </div>
              <button className="close-btn-modern" onClick={() => setShowChart(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body-modern">
              <StudentChart 
                groupCode={code} 
                studentId={selectedStudent.student_id} 
                studentName={selectedStudent.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;