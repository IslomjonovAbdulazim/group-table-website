import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserType } from '../services/authService';
import {
  getGroup, getStudents, getModules, getCriteria, getLessons, getLeaderboard,
  createStudent, updateStudent, deleteStudent,
  createModule, finishModule, deleteModule,
  startLesson, finishLesson, deleteLesson,
  createCriteria, updateCriteria, deleteCriteria,
  createGrade
} from '../services/groupDetailService';
import '../styles/GroupDetailPage.css';

const GroupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Form states
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddCriteria, setShowAddCriteria] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [gradingMode, setGradingMode] = useState(null); // 'bulk' or 'individual'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [bulkGrades, setBulkGrades] = useState({});

  // Form inputs
  const [studentName, setStudentName] = useState('');
  const [criteriaForm, setCriteriaForm] = useState({
    name: '',
    max_points: '',
    grading_method: 'one_by_one'
  });

  useEffect(() => {
    const userType = getUserType();
    if (userType !== 'teacher') {
      navigate('/login');
      return;
    }
    loadGroupData();
  }, [id, navigate]);

  const loadGroupData = async () => {
    setLoading(true);
    try {
      // Load basic group info, students, and modules in parallel
      const [groupData, studentsData, modulesData] = await Promise.all([
        loadGroup(),
        loadStudents(),
        loadModules()
      ]);

      // If there's an active module, load its criteria and lessons
      const activeModule = modulesData?.find(m => m.is_active);
      if (activeModule) {
        await Promise.all([
          loadCriteria(activeModule.id),
          loadLessons(activeModule.id),
          loadLeaderboard(activeModule.id)
        ]);
      }
    } catch (error) {
      console.error('Failed to load group data:', error);
      alert('Ma\'lumotlar yuklanmadi. Qaytadan urinib ko\'ring.');
    }
    setLoading(false);
  };

  const loadGroup = async () => {
    try {
      const data = await getGroup(id);
      setGroup(data);
      return data;
    } catch (error) {
      console.error('Failed to load group:', error);
      throw error;
    }
  };

  const loadStudents = async () => {
    try {
      const data = await getStudents(id);
      setStudents(data);
      return data;
    } catch (error) {
      console.error('Failed to load students:', error);
      throw error;
    }
  };

  const loadModules = async () => {
    try {
      const data = await getModules(id);
      setModules(data);
      return data;
    } catch (error) {
      console.error('Failed to load modules:', error);
      throw error;
    }
  };

  const loadCriteria = async (moduleId) => {
    try {
      const data = await getCriteria(moduleId);
      setCriteria(data);
      return data;
    } catch (error) {
      console.error('Failed to load criteria:', error);
      throw error;
    }
  };

  const loadLessons = async (moduleId) => {
    try {
      const data = await getLessons(moduleId);
      setLessons(data);
      return data;
    } catch (error) {
      console.error('Failed to load lessons:', error);
      throw error;
    }
  };

  const loadLeaderboard = async (moduleId) => {
    try {
      const data = await getLeaderboard(moduleId);
      setLeaderboard(data);
      return data;
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      throw error;
    }
  };

  // Student Management
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    
    try {
      await createStudent(id, studentName.trim());
      setStudentName('');
      setShowAddStudent(false);
      await loadStudents();
    } catch (error) {
      alert('O\'quvchi qo\'shilmadi. Qaytadan urinib ko\'ring.');
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !editingStudent) return;
    
    try {
      await updateStudent(editingStudent.id, studentName.trim());
      setEditingStudent(null);
      setStudentName('');
      await loadStudents();
    } catch (error) {
      alert('O\'quvchi ma\'lumotlari o\'zgartirilmadi');
    }
  };

  const handleDeleteStudent = async (student) => {
    if (!window.confirm(`"${student.full_name}" ni o'chirmoqchimisiz?`)) return;
    
    try {
      await deleteStudent(student.id);
      await loadStudents();
    } catch (error) {
      alert('O\'quvchi o\'chirilmadi');
    }
  };

  // Criteria Management
  const handleAddCriteria = async (e) => {
    e.preventDefault();
    if (!criteriaForm.name.trim() || !criteriaForm.max_points) return;
    
    const activeModule = modules.find(m => m.is_active);
    if (!activeModule) {
      alert('Faol modul topilmadi');
      return;
    }
    
    try {
      await createCriteria(activeModule.id, {
        name: criteriaForm.name.trim(),
        max_points: parseInt(criteriaForm.max_points),
        grading_method: criteriaForm.grading_method
      });
      setCriteriaForm({ name: '', max_points: '', grading_method: 'one_by_one' });
      setShowAddCriteria(false);
      await loadCriteria(activeModule.id);
    } catch (error) {
      alert('Mezon qo\'shilmadi. Maksimal 6 ta mezon qo\'shish mumkin.');
    }
  };

  const handleUpdateCriteria = async (e) => {
    e.preventDefault();
    if (!criteriaForm.name.trim() || !criteriaForm.max_points || !editingCriteria) return;
    
    try {
      await updateCriteria(editingCriteria.id, {
        name: criteriaForm.name.trim(),
        max_points: parseInt(criteriaForm.max_points),
        grading_method: criteriaForm.grading_method
      });
      setEditingCriteria(null);
      setCriteriaForm({ name: '', max_points: '', grading_method: 'one_by_one' });
      const activeModule = modules.find(m => m.is_active);
      if (activeModule) {
        await loadCriteria(activeModule.id);
      }
    } catch (error) {
      alert('Mezon o\'zgartirilmadi');
    }
  };

  const handleDeleteCriteria = async (criteria) => {
    if (!window.confirm(`"${criteria.name}" mezonini o'chirmoqchimisiz?`)) return;
    
    try {
      await deleteCriteria(criteria.id);
      const activeModule = modules.find(m => m.is_active);
      if (activeModule) {
        await loadCriteria(activeModule.id);
      }
    } catch (error) {
      alert('Mezon o\'chirilmadi');
    }
  };

  // Module Management
  const handleCreateModule = async () => {
    try {
      await createModule(id);
      await loadModules();
    } catch (error) {
      alert('Modul yaratilmadi. Faqat bitta faol modul bo\'lishi mumkin.');
    }
  };

  const handleFinishModule = async (module) => {
    if (!window.confirm(`"${module.name}" modulini tugatmoqchimisiz?`)) return;
    
    try {
      await finishModule(module.id);
      await loadModules();
    } catch (error) {
      alert('Modul tugatirilmadi');
    }
  };

  const handleDeleteModule = async (module) => {
    if (!window.confirm(`"${module.name}" modulini o'chirmoqchimisiz?`)) return;
    
    try {
      await deleteModule(module.id);
      await loadModules();
    } catch (error) {
      alert('Modul o\'chirilmadi. Faqat oxirgi modulni o\'chirish mumkin.');
    }
  };

  // Lesson Management
  const handleStartLesson = async () => {
    const activeModule = modules.find(m => m.is_active);
    if (!activeModule) {
      alert('Faol modul topilmadi');
      return;
    }
    
    try {
      await startLesson(activeModule.id);
      await loadLessons(activeModule.id);
    } catch (error) {
      alert('Dars boshlanmadi. Joriy darsni tugatib, yangi dars boshlang.');
    }
  };

  const handleFinishLesson = async (lesson) => {
    if (!window.confirm(`"${lesson.name}" ni tugatmoqchimisiz?`)) return;
    
    try {
      await finishLesson(lesson.id);
      const activeModule = modules.find(m => m.is_active);
      if (activeModule) {
        await loadLessons(activeModule.id);
      }
    } catch (error) {
      alert('Dars tugatirilmadi');
    }
  };

  const handleDeleteLesson = async (lesson) => {
    if (!window.confirm(`"${lesson.name}" ni o'chirmoqchimisiz?`)) return;
    
    try {
      await deleteLesson(lesson.id);
      const activeModule = modules.find(m => m.is_active);
      if (activeModule) {
        await loadLessons(activeModule.id);
      }
    } catch (error) {
      alert('Dars o\'chirilmadi. Faqat oxirgi darsni o\'chirish mumkin.');
    }
  };

  // Grading
  const startBulkGrading = () => {
    setGradingMode('bulk');
    setBulkGrades({});
  };

  const startIndividualGrading = (student) => {
    setGradingMode('individual');
    setSelectedStudent(student);
  };

  const handleBulkGradeChange = (studentId, criteriaId, value) => {
    setBulkGrades(prev => ({
      ...prev,
      [`${studentId}-${criteriaId}`]: value
    }));
  };

  const submitBulkGrades = async () => {
    const activeModule = modules.find(m => m.is_active);
    const activeLesson = lessons.find(l => l.is_active);
    
    if (!activeModule || !activeLesson) {
      alert('Faol modul yoki dars topilmadi');
      return;
    }
    
    try {
      const gradePromises = Object.entries(bulkGrades)
        .filter(([_, points]) => points && points > 0)
        .map(([key, points]) => {
          const [studentId, criteriaId] = key.split('-');
          return createGrade({
            student_id: parseInt(studentId),
            criteria_id: parseInt(criteriaId),
            lesson_id: activeLesson.id,
            points_earned: parseInt(points)
          });
        });
      
      await Promise.all(gradePromises);
      setGradingMode(null);
      setBulkGrades({});
      await loadLeaderboard(activeModule.id);
    } catch (error) {
      alert('Baholar saqlanmadi');
    }
  };

  const submitIndividualGrade = async (criteriaId, points) => {
    const activeModule = modules.find(m => m.is_active);
    const activeLesson = lessons.find(l => l.is_active);
    
    if (!activeModule || !activeLesson || !selectedStudent) {
      alert('Faol modul, dars yoki o\'quvchi topilmadi');
      return;
    }
    
    try {
      await createGrade({
        student_id: selectedStudent.student_id,
        criteria_id: criteriaId,
        lesson_id: activeLesson.id,
        points_earned: points
      });
      setGradingMode(null);
      setSelectedStudent(null);
      await loadLeaderboard(activeModule.id);
    } catch (error) {
      alert('Baho saqlanmadi');
    }
  };

  const handleManageModule = async (module) => {
    setActiveTab('lessons');
    await loadLessons(module.id);
    await loadLeaderboard(module.id);
  };

  const startEdit = (type, item) => {
    if (type === 'student') {
      setEditingStudent(item);
      setStudentName(item.full_name);
    } else if (type === 'criteria') {
      setEditingCriteria(item);
      setCriteriaForm({
        name: item.name,
        max_points: item.max_points.toString(),
        grading_method: item.grading_method
      });
    }
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setEditingCriteria(null);
    setStudentName('');
    setCriteriaForm({ name: '', max_points: '', grading_method: 'one_by_one' });
  };
    if (type === 'student') {
      setEditingStudent(item);
      setStudentName(item.full_name);
    } else if (type === 'criteria') {
      setEditingCriteria(item);
      setCriteriaForm({
        name: item.name,
        max_points: item.max_points.toString(),
        grading_method: item.grading_method
      });
    }
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setEditingCriteria(null);
    setStudentName('');
    setCriteriaForm({ name: '', max_points: '', grading_method: 'one_by_one' });
  };

  if (loading) {
    return (
      <div className="group-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Ma'lumotlar yuklanmoqda...</h3>
        </div>
      </div>
    );
  }

  const activeModule = modules.find(m => m.is_active);

  return (
    <div className="group-detail-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <button onClick={() => navigate('/teacher')} className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
            Orqaga
          </button>
          
          <div className="group-info">
            <div className="group-icon">{group?.code}</div>
            <div className="group-details">
              <h1>{group?.name}</h1>
              <div className="group-meta">
                <span className="group-code">Kod: {group?.code}</span>
                <span className={`status-badge ${group?.is_active ? 'active' : 'inactive'}`}>
                  {group?.is_active ? 'Faol' : 'Nofaol'}
                </span>
              </div>
            </div>
          </div>

          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-number">{students.length}</div>
              <div className="stat-label">O'quvchilar</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{modules.length}</div>
              <div className="stat-label">Modullar</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{criteria.length}</div>
              <div className="stat-label">Mezonlar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <div className="tab-container">
          {[
            { id: 'students', label: 'O\'quvchilar', icon: 'users' },
            { id: 'criteria', label: 'Mezonlar', icon: 'target' },
            { id: 'modules', label: 'Modullar', icon: 'layers' },
            { id: 'lessons', label: 'Darslar', icon: 'book' },
            { id: 'leaderboard', label: 'Reyting', icon: 'trophy' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <TabIcon type={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="students-section">
            <div className="section-header">
              <h2>O'quvchilar ({students.length}/30)</h2>
              <button 
                onClick={() => setShowAddStudent(true)}
                className="add-btn"
                disabled={students.length >= 30}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                O'quvchi qo'shish
              </button>
            </div>

            {showAddStudent && (
              <div className="form-card">
                <div className="form-header">
                  <h3>Yangi o'quvchi qo'shish</h3>
                  <button onClick={() => setShowAddStudent(false)} className="close-btn">×</button>
                </div>
                <form onSubmit={handleAddStudent} className="add-form">
                  <input
                    type="text"
                    placeholder="O'quvchi ismi"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="form-input"
                    required
                  />
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Qo'shish</button>
                    <button type="button" onClick={() => setShowAddStudent(false)} className="cancel-btn">Bekor qilish</button>
                  </div>
                </form>
              </div>
            )}

            <div className="students-grid">
              {students.map(student => (
                <div key={student.id} className="student-card">
                  {editingStudent?.id === student.id ? (
                    <form onSubmit={handleUpdateStudent} className="edit-form">
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="form-input"
                        required
                      />
                      <div className="form-actions">
                        <button type="submit" className="save-btn">Saqlash</button>
                        <button type="button" onClick={cancelEdit} className="cancel-btn">Bekor qilish</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="student-info">
                        <div className="student-avatar">{student.full_name.charAt(0)}</div>
                        <div className="student-details">
                          <h4>{student.full_name}</h4>
                          <p>Qo'shilgan: {new Date(student.added_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="student-actions">
                        <button onClick={() => startEdit('student', student)} className="edit-btn">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteStudent(student)} className="delete-btn">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Criteria Tab */}
        {activeTab === 'criteria' && (
          <div className="criteria-section">
            <div className="section-header">
              <h2>Baholash mezonlari ({criteria.length}/6)</h2>
              <button 
                onClick={() => setShowAddCriteria(true)}
                className="add-btn"
                disabled={criteria.length >= 6}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Mezon qo'shish
              </button>
            </div>

            {showAddCriteria && (
              <div className="form-card">
                <div className="form-header">
                  <h3>Yangi mezon qo'shish</h3>
                  <button onClick={() => setShowAddCriteria(false)} className="close-btn">×</button>
                </div>
                <form onSubmit={handleAddCriteria} className="add-form">
                  <input
                    type="text"
                    placeholder="Mezon nomi"
                    value={criteriaForm.name}
                    onChange={(e) => setCriteriaForm({...criteriaForm, name: e.target.value})}
                    className="form-input"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Maksimal ball"
                    value={criteriaForm.max_points}
                    onChange={(e) => setCriteriaForm({...criteriaForm, max_points: e.target.value})}
                    className="form-input"
                    min="1"
                    required
                  />
                  <select
                    value={criteriaForm.grading_method}
                    onChange={(e) => setCriteriaForm({...criteriaForm, grading_method: e.target.value})}
                    className="form-select"
                  >
                    <option value="one_by_one">Birma-bir</option>
                    <option value="bulk">Ommaviy</option>
                  </select>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Qo'shish</button>
                    <button type="button" onClick={() => setShowAddCriteria(false)} className="cancel-btn">Bekor qilish</button>
                  </div>
                </form>
              </div>
            )}

            <div className="criteria-grid">
              {criteria.map(criterion => (
                <div key={criterion.id} className="criteria-card">
                  {editingCriteria?.id === criterion.id ? (
                    <form onSubmit={handleUpdateCriteria} className="edit-form">
                      <input
                        type="text"
                        value={criteriaForm.name}
                        onChange={(e) => setCriteriaForm({...criteriaForm, name: e.target.value})}
                        className="form-input"
                        required
                      />
                      <input
                        type="number"
                        value={criteriaForm.max_points}
                        onChange={(e) => setCriteriaForm({...criteriaForm, max_points: e.target.value})}
                        className="form-input"
                        min="1"
                        required
                      />
                      <select
                        value={criteriaForm.grading_method}
                        onChange={(e) => setCriteriaForm({...criteriaForm, grading_method: e.target.value})}
                        className="form-select"
                      >
                        <option value="one_by_one">Birma-bir</option>
                        <option value="bulk">Ommaviy</option>
                      </select>
                      <div className="form-actions">
                        <button type="submit" className="save-btn">Saqlash</button>
                        <button type="button" onClick={cancelEdit} className="cancel-btn">Bekor qilish</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="criteria-info">
                        <h4>{criterion.name}</h4>
                        <div className="criteria-details">
                          <span className="max-points">{criterion.max_points} ball</span>
                          <span className={`method-badge ${criterion.grading_method}`}>
                            {criterion.grading_method === 'one_by_one' ? 'Birma-bir' : 'Ommaviy'}
                          </span>
                        </div>
                      </div>
                      <div className="criteria-actions">
                        <button onClick={() => startEdit('criteria', criterion)} className="edit-btn">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteCriteria(criterion)} className="delete-btn">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className="modules-section">
            <div className="section-header">
              <h2>Modullar</h2>
              <button 
                onClick={handleCreateModule}
                className="add-btn"
                disabled={!!activeModule}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Yangi modul
              </button>
            </div>

            <div className="modules-grid">
              {modules.map(module => (
                <div key={module.id} className={`module-card ${module.is_active ? 'active' : ''}`}>
                  <div className="module-header">
                    <h4>{module.name}</h4>
                    <span className={`status-badge ${module.is_active ? 'active' : module.is_finished ? 'finished' : 'inactive'}`}>
                      {module.is_active ? 'Faol' : module.is_finished ? 'Tugatilgan' : 'Nofaol'}
                    </span>
                  </div>
                  <div className="module-actions">
                    <button 
                      onClick={() => handleManageModule(module)}
                      className="manage-btn"
                    >
                      Darslarni boshqarish
                    </button>
                    {module.is_active && (
                      <button onClick={() => handleFinishModule(module)} className="finish-btn">
                        Modulni tugatish
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className="lessons-section">
            <div className="section-header">
              <h2>Darslar</h2>
              <button onClick={handleStartLesson} className="add-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Dars boshlash
              </button>
            </div>

            <div className="lessons-list">
              {lessons.map(lesson => (
                <div key={lesson.id} className={`lesson-card ${lesson.is_active ? 'active' : ''}`}>
                  <div className="lesson-info">
                    <h4>{lesson.name}</h4>
                    <span className={`status-badge ${lesson.is_active ? 'active' : 'finished'}`}>
                      {lesson.is_active ? 'Faol' : 'Tugatilgan'}
                    </span>
                  </div>
                  <div className="lesson-actions">
                    {lesson.is_active && (
                      <>
                        <button onClick={() => handleFinishLesson(lesson)} className="finish-btn">
                          Darsni tugatish
                        </button>
                        <button onClick={() => handleDeleteLesson(lesson)} className="delete-btn">
                          O'chirish
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="leaderboard-section">
            <div className="section-header">
              <h2>Reyting jadvali</h2>
              <div className="grading-controls">
                <button onClick={startBulkGrading} className="grade-btn bulk">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  </svg>
                  Ommaviy baholash
                </button>
              </div>
            </div>

            {gradingMode === 'bulk' && (
              <div className="bulk-grading-panel">
                <h3>Ommaviy baholash</h3>
                <div className="grading-table">
                  <div className="table-header">
                    <div>O'quvchi</div>
                    {criteria.map(criterion => (
                      <div key={criterion.id}>{criterion.name}</div>
                    ))}
                  </div>
                  {students.map(student => (
                    <div key={student.id} className="table-row">
                      <div className="student-name">{student.full_name}</div>
                      {criteria.map(criterion => (
                        <div key={criterion.id}>
                          <input
                            type="number"
                            min="0"
                            max={criterion.max_points}
                            placeholder="0"
                            onChange={(e) => handleBulkGradeChange(student.id, criterion.id, e.target.value)}
                            className="grade-input"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="bulk-actions">
                  <button onClick={submitBulkGrades} className="submit-btn">Bahoларni saqlash</button>
                  <button onClick={() => setGradingMode(null)} className="cancel-btn">Bekor qilish</button>
                </div>
              </div>
            )}

            {gradingMode === 'individual' && selectedStudent && (
              <div className="individual-grading-panel">
                <h3>{selectedStudent.name} - Birma-bir baholash</h3>
                <div className="criteria-list">
                  {criteria.map(criterion => (
                    <div key={criterion.id} className="criteria-grading">
                      <h4>{criterion.name} (Maksimal: {criterion.max_points})</h4>
                      <div className="points-selector">
                        {Array.from({length: criterion.max_points + 1}, (_, i) => (
                          <button
                            key={i}
                            onClick={() => submitIndividualGrade(criterion.id, i)}
                            className="point-btn"
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setGradingMode(null)} className="cancel-btn">Bekor qilish</button>
              </div>
            )}

            <div className="leaderboard-table">
              {leaderboard.map(student => (
                <div key={student.student_id} className="leaderboard-row">
                  <div className="rank">#{student.position}</div>
                  <div className="student-info">
                    <div className="student-avatar">{student.name.charAt(0)}</div>
                    <div className="student-name">{student.name}</div>
                  </div>
                  <div className="points">{student.total_points} ball</div>
                  <button 
                    onClick={() => startIndividualGrading(student)}
                    className="grade-individual-btn"
                  >
                    Baholash
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for tab icons
const TabIcon = ({ type }) => {
  const iconPaths = {
    users: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </>
    ),
    layers: (
      <>
        <polygon points="12,2 2,7 12,12 22,7 12,2"/>
        <polyline points="2,17 12,22 22,17"/>
        <polyline points="2,12 12,17 22,12"/>
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </>
    ),
    trophy: (
      <>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 14 20 14 20s1.96-1.25 3.03-1.79c.5-.23.97-.66.97-1.21v-2.34c0-1.17-.53-2.26-1.44-2.99L14 10l-2.56 1.67c-.91.73-1.44 1.82-1.44 2.99z"/>
      </>
    )
  };
  
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {iconPaths[type]}
    </svg>
  );
};

export default GroupDetailPage;