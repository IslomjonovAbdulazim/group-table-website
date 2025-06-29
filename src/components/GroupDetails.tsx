import React, { useState, useEffect } from 'react';
import { GroupInfo, ModuleInfo, LeaderboardEntry } from '../types';
import { getGroupByCode, getGroupModules, getModuleLeaderboard } from '../services/groupService';
import { saveGroup, isGroupSaved, removeSavedGroup } from '../utils/localStorage';
import StudentChart from './StudentChart';

interface GroupDetailsProps {
  code: string;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ code }) => {
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<LeaderboardEntry | null>(null);
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

  const handleStudentClick = (student: LeaderboardEntry) => {
    setSelectedStudent(student);
    setShowChart(true);
  };

  if (loading) {
    return (
      <div className="group-details-loading">
        <div className="loading-spinner"></div>
        <p>Guruh ma'lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="group-details-error card">
        <div className="card-body">
          <h3>Xatolik yuz berdi</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadGroupData}>
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="group-details">
      {/* Group Info */}
      <div className="group-info card">
        <div className="card-header">
          <div className="group-title">
            <h2>{group.name}</h2>
            <span className="group-code">Kod: {group.code}</span>
          </div>
          <button 
            className={`btn ${saved ? 'btn-warning' : 'btn-success'}`}
            onClick={handleSaveGroup}
          >
            {saved ? 'Saqlangandan chiqarish' : 'Saqlash'}
          </button>
        </div>
      </div>

      {/* Modules */}
      {modules.length > 0 && (
        <div className="modules-section card">
          <div className="card-header">
            <h3>Modullar</h3>
          </div>
          <div className="card-body">
            <div className="modules-tabs">
              {modules.map(module => (
                <button
                  key={module.id}
                  className={`module-tab ${selectedModule?.id === module.id ? 'active' : ''}`}
                  onClick={() => setSelectedModule(module)}
                >
                  {module.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {selectedModule && (
        <div className="leaderboard-section card">
          <div className="card-header">
            <h3>{selectedModule.name} - Reyting</h3>
          </div>
          <div className="card-body">
            {leaderboard.length === 0 ? (
              <p>Hali natijalar yo'q</p>
            ) : (
              <div className="leaderboard">
                {leaderboard.map(entry => (
                  <div 
                    key={entry.student_id} 
                    className={`leaderboard-item ${entry.position === 1 ? 'rank-first' : ''} clickable`}
                    onClick={() => handleStudentClick(entry)}
                  >
                    <span className="position">#{entry.position}</span>
                    <span className="name">{entry.name}</span>
                    <span className="points">{entry.total_points} ball</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Student Chart Modal */}
      {showChart && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowChart(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedStudent.name} - Rivojlanish grafigi</h3>
              <button className="btn btn-secondary" onClick={() => setShowChart(false)}>
                Yopish
              </button>
            </div>
            <div className="modal-body">
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