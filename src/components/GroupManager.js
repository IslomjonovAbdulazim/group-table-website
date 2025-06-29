import React, { useState, useEffect } from 'react';
import { 
  getGroups, createGroup, updateGroup, deleteGroup, finishGroup,
  getStudents, createStudent, updateStudent, deleteStudent,
  getModules, createModule, deleteModule, finishModule,
  getLessons, startLesson, finishLesson, deleteLesson,
  getCriteria, createCriteria, updateCriteria, deleteCriteria,
  createGrade, getLeaderboard
} from '../services/groupService';

const GroupManager = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showCriteriaForm, setShowCriteriaForm] = useState(false);
  const [showGradingPanel, setShowGradingPanel] = useState(false);
  const [selectedGradingType, setSelectedGradingType] = useState('bulk');
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [groupName, setGroupName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [criteriaData, setCriteriaData] = useState({ name: '', max_points: 10, grading_method: 'bulk' });
  const [bulkGrades, setBulkGrades] = useState([]);
  const [oneByOnePoints, setOneByOnePoints] = useState(0);

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadGroupData();
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedModule) {
      loadModuleData();
    }
  }, [selectedModule]);

  const loadGroups = async () => {
    try {
      const data = await getGroups();
      setGroups(data);
      if (data.length > 0 && !selectedGroup) {
        setSelectedGroup(data[0]);
      }
    } catch (error) {
      console.error('Failed to load groups');
    }
    setLoading(false);
  };

  const loadGroupData = async () => {
    if (!selectedGroup) return;
    
    try {
      const [studentsData, modulesData] = await Promise.all([
        getStudents(selectedGroup.id),
        getModules(selectedGroup.id)
      ]);
      
      setStudents(studentsData);
      setModules(modulesData);
      
      const activeModule = modulesData.find(m => m.is_active);
      if (activeModule) {
        setSelectedModule(activeModule);
      } else if (modulesData.length > 0) {
        setSelectedModule(modulesData[modulesData.length - 1]);
      }
    } catch (error) {
      console.error('Failed to load group data');
    }
  };

  const loadModuleData = async () => {
    if (!selectedModule) return;
    
    try {
      const [lessonsData, criteriaData, leaderboardData] = await Promise.all([
        getLessons(selectedModule.id),
        getCriteria(selectedModule.id),
        getLeaderboard(selectedModule.id)
      ]);
      
      setLessons(lessonsData);
      setCriteria(criteriaData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Failed to load module data');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await createGroup(groupName);
      await loadGroups();
      setGroupName('');
      setShowGroupForm(false);
    } catch (error) {
      alert('Guruh yaratilmadi');
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!selectedGroup) return;
    
    try {
      await createStudent(selectedGroup.id, studentName);
      await loadGroupData();
      setStudentName('');
      setShowStudentForm(false);
    } catch (error) {
      alert('Talaba qo\'shilmadi');
    }
  };

  const handleCreateModule = async () => {
    if (!selectedGroup) return;
    
    try {
      await createModule(selectedGroup.id);
      await loadGroupData();
    } catch (error) {
      alert('Modul yaratilmadi');
    }
  };

  const handleStartLesson = async () => {
    if (!selectedModule) return;
    
    try {
      await startLesson(selectedModule.id);
      await loadModuleData();
    } catch (error) {
      alert('Dars boshlanmadi');
    }
  };

  const handleCreateCriteria = async (e) => {
    e.preventDefault();
    if (!selectedModule) return;
    
    try {
      await createCriteria(selectedModule.id, criteriaData);
      await loadModuleData();
      setCriteriaData({ name: '', max_points: 10, grading_method: 'bulk' });
      setShowCriteriaForm(false);
    } catch (error) {
      alert('Criteria yaratilmadi');
    }
  };

  const handleBulkGrading = async () => {
    if (!selectedCriteria || !lessons.find(l => l.is_active)) return;
    
    const activeLesson = lessons.find(l => l.is_active);
    if (!activeLesson) return;
    
    try {
      for (const grade of bulkGrades) {
        if (grade.points >= 0) {
          await createGrade({
            points_earned: grade.points,
            student_id: grade.studentId,
            criteria_id: selectedCriteria.id,
            lesson_id: activeLesson.id
          });
        }
      }
      await loadModuleData();
      setBulkGrades([]);
      setShowGradingPanel(false);
    } catch (error) {
      alert('Baholar saqlanmadi');
    }
  };

  const handleOneByOneGrading = async () => {
    if (!selectedCriteria || !selectedStudent || !lessons.find(l => l.is_active)) return;
    
    const activeLesson = lessons.find(l => l.is_active);
    if (!activeLesson) return;
    
    try {
      await createGrade({
        points_earned: oneByOnePoints,
        student_id: selectedStudent.id,
        criteria_id: selectedCriteria.id,
        lesson_id: activeLesson.id
      });
      await loadModuleData();
      setOneByOnePoints(0);
      setShowGradingPanel(false);
    } catch (error) {
      alert('Baho saqlanmadi');
    }
  };

  const openGradingPanel = (criteria, type) => {
    setSelectedCriteria(criteria);
    setSelectedGradingType(type);
    setShowGradingPanel(true);
    
    if (type === 'bulk') {
      setBulkGrades(students.map(s => ({ studentId: s.id, points: 0 })));
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  const activeLesson = lessons.find(l => l.is_active);

  return (
    <div className="group-manager">
      {/* Groups Section */}
      <div className="section card">
        <div className="card-header">
          <h2>Guruhlar</h2>
          <button className="btn btn-primary" onClick={() => setShowGroupForm(true)}>
            Yangi guruh
          </button>
        </div>
        <div className="card-body">
          {showGroupForm && (
            <form onSubmit={handleCreateGroup} className="inline-form">
              <input
                type="text"
                className="form-control"
                placeholder="Guruh nomi"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-success">Yaratish</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowGroupForm(false)}>
                Bekor qilish
              </button>
            </form>
          )}
          
          <div className="groups-grid">
            {groups.map(group => (
              <div 
                key={group.id}
                className={`group-card ${selectedGroup?.id === group.id ? 'active' : ''}`}
                onClick={() => setSelectedGroup(group)}
              >
                <h3>{group.name}</h3>
                <p>Kod: {group.code}</p>
                <span className={`status ${group.is_active ? 'active' : 'inactive'}`}>
                  {group.is_active ? 'Faol' : 'Tugatilgan'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedGroup && (
        <>
          {/* Students Section */}
          <div className="section card">
            <div className="card-header">
              <h2>Talabalar ({selectedGroup.name})</h2>
              <button className="btn btn-primary" onClick={() => setShowStudentForm(true)}>
                Talaba qo'shish
              </button>
            </div>
            <div className="card-body">
              {showStudentForm && (
                <form onSubmit={handleCreateStudent} className="inline-form">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Talaba ismi"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-success">Qo'shish</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowStudentForm(false)}>
                    Bekor qilish
                  </button>
                </form>
              )}
              
              <div className="students-list">
                {students.map(student => (
                  <div key={student.id} className="student-item">
                    {student.full_name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modules Section */}
          <div className="section card">
            <div className="card-header">
              <h2>Modullar</h2>
              <button className="btn btn-primary" onClick={handleCreateModule}>
                Yangi modul
              </button>
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
                    {module.is_active && <span className="active-badge">Faol</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedModule && (
            <>
              {/* Lessons Section */}
              <div className="section card">
                <div className="card-header">
                  <h2>Darslar ({selectedModule.name})</h2>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleStartLesson}
                    disabled={!!activeLesson || !selectedModule.is_active}
                  >
                    Dars boshlash
                  </button>
                </div>
                <div className="card-body">
                  <div className="lessons-list">
                    {lessons.map(lesson => (
                      <div key={lesson.id} className={`lesson-item ${lesson.is_active ? 'active' : ''}`}>
                        {lesson.name}
                        {lesson.is_active && <span className="active-badge">Faol</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Criteria Section */}
              <div className="section card">
                <div className="card-header">
                  <h2>Baholash mezonlari</h2>
                  <button className="btn btn-primary" onClick={() => setShowCriteriaForm(true)}>
                    Yangi mezon
                  </button>
                </div>
                <div className="card-body">
                  {showCriteriaForm && (
                    <form onSubmit={handleCreateCriteria} className="criteria-form">
                      <div className="form-group">
                        <label>Nomi</label>
                        <input
                          type="text"
                          className="form-control"
                          value={criteriaData.name}
                          onChange={(e) => setCriteriaData({...criteriaData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Maksimal ball</label>
                        <input
                          type="number"
                          className="form-control"
                          value={criteriaData.max_points}
                          onChange={(e) => setCriteriaData({...criteriaData, max_points: parseInt(e.target.value)})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Baholash turi</label>
                        <select
                          className="form-control"
                          value={criteriaData.grading_method}
                          onChange={(e) => setCriteriaData({...criteriaData, grading_method: e.target.value})}
                        >
                          <option value="bulk">Ommaviy</option>
                          <option value="one_by_one">Birma-bir</option>
                        </select>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn btn-success">Yaratish</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowCriteriaForm(false)}>
                          Bekor qilish
                        </button>
                      </div>
                    </form>
                  )}
                  
                  <div className="criteria-list">
                    {criteria.map(crit => (
                      <div key={crit.id} className="criteria-item">
                        <div className="criteria-info">
                          <h4>{crit.name}</h4>
                          <p>Maksimal: {crit.max_points} ball</p>
                          <span className="grading-type">
                            {crit.grading_method === 'bulk' ? 'Ommaviy' : 'Birma-bir'}
                          </span>
                        </div>
                        {activeLesson && (
                          <div className="criteria-actions">
                            <button 
                              className="btn btn-success"
                              onClick={() => openGradingPanel(crit, crit.grading_method)}
                            >
                              Baholash
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leaderboard Section */}
              <div className="section card">
                <div className="card-header">
                  <h2>Reyting ({selectedModule.name})</h2>
                </div>
                <div className="card-body">
                  <div className="leaderboard">
                    {leaderboard.map(entry => (
                      <div key={entry.student_id} className={`leaderboard-item ${entry.position === 1 ? 'rank-first' : ''}`}>
                        <span className="position">#{entry.position}</span>
                        <span className="name">{entry.name}</span>
                        <span className="points">{entry.total_points} ball</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Grading Panel Modal */}
      {showGradingPanel && selectedCriteria && (
        <div className="modal-overlay" onClick={() => setShowGradingPanel(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCriteria.name} - Baholash</h3>
            </div>
            <div className="modal-body">
              {selectedGradingType === 'bulk' ? (
                <div className="bulk-grading">
                  <h4>Barcha talabalarni baholash</h4>
                  {students.map((student, index) => (
                    <div key={student.id} className="grade-input">
                      <label>{student.full_name}</label>
                      <input
                        type="number"
                        min="0"
                        max={selectedCriteria.max_points}
                        value={bulkGrades[index]?.points || 0}
                        onChange={(e) => {
                          const newGrades = [...bulkGrades];
                          newGrades[index] = { studentId: student.id, points: parseInt(e.target.value) || 0 };
                          setBulkGrades(newGrades);
                        }}
                      />
                    </div>
                  ))}
                  <button className="btn btn-success" onClick={handleBulkGrading}>
                    Barcha baholarni saqlash
                  </button>
                </div>
              ) : (
                <div className="one-by-one-grading">
                  <h4>Talabani tanlang</h4>
                  <select 
                    className="form-control"
                    value={selectedStudent?.id || ''}
                    onChange={(e) => setSelectedStudent(students.find(s => s.id === parseInt(e.target.value)) || null)}
                  >
                    <option value="">Talabani tanlang</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.full_name}</option>
                    ))}
                  </select>
                  
                  {selectedStudent && (
                    <div className="grade-input">
                      <label>Ball (0-{selectedCriteria.max_points})</label>
                      <input
                        type="number"
                        min="0"
                        max={selectedCriteria.max_points}
                        value={oneByOnePoints}
                        onChange={(e) => setOneByOnePoints(parseInt(e.target.value) || 0)}
                      />
                      <button className="btn btn-success" onClick={handleOneByOneGrading}>
                        Saqlash
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowGradingPanel(false)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManager;