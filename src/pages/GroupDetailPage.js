import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [loadingStates, setLoadingStates] = useState({
    students: false,
    modules: false,
    criteria: false,
    lessons: false,
    leaderboard: false,
    forms: false
  });
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
  const [gradingMode, setGradingMode] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedModuleForLessons, setSelectedModuleForLessons] = useState(null);
  const [selectedModuleForCriteria, setSelectedModuleForCriteria] = useState(null); // NEW: Module selector for criteria
  const [selectedModuleForLeaderboard, setSelectedModuleForLeaderboard] = useState(null); // NEW: Module selector for leaderboard
  const [bulkGrades, setBulkGrades] = useState({});

  // Form inputs
  const [studentName, setStudentName] = useState('');
  const [criteriaForm, setCriteriaForm] = useState({
    name: '',
    max_points: '',
    grading_method: 'one_by_one'
  });

  // Helper function to update loading states
  const setLoadingState = useCallback((key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  // Memoized computed values for performance
  const activeModule = useMemo(() => modules.find(m => m.is_active), [modules]);
  const activeLesson = useMemo(() => lessons.find(l => l.is_active), [lessons]);

  // Auto-refresh interval
  useEffect(() => {
    if (!loading && activeModule) {
      const interval = setInterval(() => {
        // Auto-refresh data every 30 seconds for active tab
        switch (activeTab) {
          case 'students':
            loadStudents();
            break;
          case 'criteria':
            if (selectedModuleForCriteria) {
              loadCriteria(selectedModuleForCriteria.id);
            }
            break;
          case 'lessons':
            if (selectedModuleForLessons) {
              loadLessons(selectedModuleForLessons.id);
            }
            break;
          case 'leaderboard':
            if (selectedModuleForLeaderboard) {
              loadLeaderboard(selectedModuleForLeaderboard.id);
            }
            break;
          case 'modules':
            loadModules();
            break;
        }
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [activeTab, activeModule, selectedModuleForCriteria, selectedModuleForLessons, selectedModuleForLeaderboard, loading]);
  
  useEffect(() => {
    const userType = getUserType();
    if (userType !== 'teacher') {
      navigate('/login');
      return;
    }
    loadGroupData();
  }, [id, navigate]);

  const loadGroupData = useCallback(async () => {
    setLoading(true);
    try {
      // Load basic data first
      const [groupData, studentsData, modulesData] = await Promise.all([
        loadGroup(),
        loadStudents(),
        loadModules()
      ]);

      // Set active module defaults
      const activeModuleFromData = modulesData?.find(m => m.is_active);
      if (activeModuleFromData) {
        setSelectedModuleForLessons(activeModuleFromData);
        setSelectedModuleForCriteria(activeModuleFromData);
        setSelectedModuleForLeaderboard(activeModuleFromData);
        
        // Load module-specific data
        await Promise.all([
          loadCriteria(activeModuleFromData.id),
          loadLessons(activeModuleFromData.id),
          loadLeaderboard(activeModuleFromData.id)
        ]);
      } else if (modulesData?.length > 0) {
        const firstModule = modulesData[0];
        setSelectedModuleForLessons(firstModule);
        setSelectedModuleForCriteria(firstModule);
        setSelectedModuleForLeaderboard(firstModule);
        await Promise.all([
          loadLessons(firstModule.id),
          loadCriteria(firstModule.id),
          loadLeaderboard(firstModule.id)
        ]);
      }
    } catch (error) {
      console.error('Failed to load group data:', error);
      alert('Ma\'lumotlar yuklanmadi. Qaytadan urinib ko\'ring.');
    }
    setLoading(false);
  }, [id]);

  const loadGroup = useCallback(async () => {
    const data = await getGroup(id);
    setGroup(data);
    return data;
  }, [id]);

  const loadStudents = useCallback(async () => {
    setLoadingState('students', true);
    try {
      const data = await getStudents(id);
      setStudents(data);
      return data;
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoadingState('students', false);
    }
  }, [id, setLoadingState]);

  const loadModules = useCallback(async () => {
    setLoadingState('modules', true);
    try {
      const data = await getModules(id);
      setModules(data);
      return data;
    } catch (error) {
      console.error('Failed to load modules:', error);
    } finally {
      setLoadingState('modules', false);
    }
  }, [id, setLoadingState]);

  const loadCriteria = useCallback(async (moduleId) => {
    setLoadingState('criteria', true);
    try {
      const data = await getCriteria(moduleId);
      setCriteria(data);
      return data;
    } catch (error) {
      console.error('Failed to load criteria:', error);
    } finally {
      setLoadingState('criteria', false);
    }
  }, [setLoadingState]);

  const loadLessons = useCallback(async (moduleId) => {
    setLoadingState('lessons', true);
    try {
      const data = await getLessons(moduleId);
      setLessons(data);
      return data;
    } catch (error) {
      console.error('Failed to load lessons:', error);
    } finally {
      setLoadingState('lessons', false);
    }
  }, [setLoadingState]);

  const loadLeaderboard = useCallback(async (moduleId) => {
    setLoadingState('leaderboard', true);
    try {
      const data = await getLeaderboard(moduleId);
      setLeaderboard(data);
      return data;
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoadingState('leaderboard', false);
    }
  }, [setLoadingState]);

  // Student Management
  const handleAddStudent = useCallback(async (e) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    
    setLoadingState('forms', true);
    try {
      await createStudent(id, studentName.trim());
      setStudentName('');
      setShowAddStudent(false);
      await loadStudents();
    } catch (error) {
      alert('O\'quvchi qo\'shilmadi. Qaytadan urinib ko\'ring.');
    } finally {
      setLoadingState('forms', false);
    }
  }, [id, studentName, loadStudents, setLoadingState]);

  const handleUpdateStudent = useCallback(async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !editingStudent) return;
    
    setLoadingState('forms', true);
    try {
      await updateStudent(editingStudent.id, studentName.trim());
      setEditingStudent(null);
      setStudentName('');
      await loadStudents();
    } catch (error) {
      alert('O\'quvchi ma\'lumotlari o\'zgartirilmadi');
    } finally {
      setLoadingState('forms', false);
    }
  }, [studentName, editingStudent, loadStudents, setLoadingState]);

  const handleDeleteStudent = useCallback(async (student) => {
    if (!window.confirm(`"${student.full_name}" ni o'chirmoqchimisiz?`)) return;
    
    try {
      await deleteStudent(student.id);
      await loadStudents();
    } catch (error) {
      alert('O\'quvchi o\'chirilmadi');
    }
  }, [loadStudents]);

  // Criteria Management - Updated to use selected module
  const handleAddCriteria = useCallback(async (e) => {
    e.preventDefault();
    if (!criteriaForm.name.trim() || !criteriaForm.max_points || !selectedModuleForCriteria) return;
    
    try {
      await createCriteria(selectedModuleForCriteria.id, {
        name: criteriaForm.name.trim(),
        max_points: parseInt(criteriaForm.max_points),
        grading_method: criteriaForm.grading_method
      });
      setCriteriaForm({ name: '', max_points: '', grading_method: 'one_by_one' });
      setShowAddCriteria(false);
      await loadCriteria(selectedModuleForCriteria.id);
    } catch (error) {
      alert('Mezon qo\'shilmadi. Maksimal 6 ta mezon qo\'shish mumkin.');
    }
  }, [criteriaForm, selectedModuleForCriteria, loadCriteria]);

  const handleUpdateCriteria = useCallback(async (e) => {
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
      if (selectedModuleForCriteria) {
        await loadCriteria(selectedModuleForCriteria.id);
      }
    } catch (error) {
      alert('Mezon o\'zgartirilmadi');
    }
  }, [criteriaForm, editingCriteria, selectedModuleForCriteria, loadCriteria]);

  const handleDeleteCriteria = useCallback(async (criteria) => {
    if (!window.confirm(`"${criteria.name}" mezonini o'chirmoqchimisiz?`)) return;
    
    try {
      await deleteCriteria(criteria.id);
      if (selectedModuleForCriteria) {
        await loadCriteria(selectedModuleForCriteria.id);
      }
    } catch (error) {
      alert('Mezon o\'chirilmadi');
    }
  }, [selectedModuleForCriteria, loadCriteria]);

  // Module Management - Simplified
  const handleCreateModule = useCallback(async () => {
    try {
      await createModule(id);
      await loadModules();
    } catch (error) {
      alert('Modul yaratilmadi. Faqat bitta faol modul bo\'lishi mumkin.');
    }
  }, [id, loadModules]);

  const handleFinishModule = useCallback(async (module) => {
    if (!window.confirm(`"${module.name}" modulini tugatmoqchimisiz?`)) return;
    
    try {
      await finishModule(module.id);
      await loadModules();
    } catch (error) {
      alert('Modul tugatirilmadi');
    }
  }, [loadModules]);

  const handleDeleteModule = useCallback(async (module) => {
    if (!window.confirm(`"${module.name}" modulini o'chirmoqchimisiz?`)) return;
    
    try {
      await deleteModule(module.id);
      await loadModules();
    } catch (error) {
      alert('Modul o\'chirilmadi. Faqat oxirgi modulni o\'chirish mumkin.');
    }
  }, [loadModules]);

  // Lesson Management
  const handleStartLesson = useCallback(async () => {
    const moduleToUse = selectedModuleForLessons || activeModule;
    if (!moduleToUse || !moduleToUse.is_active) {
      alert('Faqat faol modulda dars boshlash mumkin');
      return;
    }
    
    try {
      await startLesson(moduleToUse.id);
      await loadLessons(moduleToUse.id);
    } catch (error) {
      alert('Dars boshlanmadi. Joriy darsni tugatib, yangi dars boshlang.');
    }
  }, [selectedModuleForLessons, activeModule, loadLessons]);

  const handleFinishLesson = useCallback(async (lesson) => {
    if (!window.confirm(`"${lesson.name}" ni tugatmoqchimisiz?`)) return;
    
    try {
      await finishLesson(lesson.id);
      const moduleToUse = selectedModuleForLessons || activeModule;
      if (moduleToUse) {
        await loadLessons(moduleToUse.id);
      }
    } catch (error) {
      alert('Dars tugatirilmadi');
    }
  }, [selectedModuleForLessons, activeModule, loadLessons]);

  const handleDeleteLesson = useCallback(async (lesson) => {
    if (!window.confirm(`"${lesson.name}" ni o'chirmoqchimisiz?`)) return;
    
    try {
      await deleteLesson(lesson.id);
      const moduleToUse = selectedModuleForLessons || activeModule;
      if (moduleToUse) {
        await loadLessons(moduleToUse.id);
      }
    } catch (error) {
      alert('Dars o\'chirilmadi. Faqat oxirgi darsni o\'chirish mumkin.');
    }
  }, [selectedModuleForLessons, activeModule, loadLessons]);

  // Handle module selection for criteria
  const handleCriteriaModuleChange = useCallback(async (moduleId) => {
    const module = modules.find(m => m.id === parseInt(moduleId));
    setSelectedModuleForCriteria(module);
    if (module) {
      await loadCriteria(module.id);
    }
  }, [modules, loadCriteria]);

  // Handle module selection for lessons
  const handleLessonsModuleChange = useCallback(async (moduleId) => {
    const module = modules.find(m => m.id === parseInt(moduleId));
    setSelectedModuleForLessons(module);
    if (module) {
      await loadLessons(module.id);
    }
  }, [modules, loadLessons]);

  // Handle module selection for leaderboard
  const handleLeaderboardModuleChange = useCallback(async (moduleId) => {
    const module = modules.find(m => m.id === parseInt(moduleId));
    setSelectedModuleForLeaderboard(module);
    if (module) {
      await loadLeaderboard(module.id);
    }
  }, [modules, loadLeaderboard]);

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

  return (
    <div className="group-detail-page">
      {/* Simplified Header */}
      <div className="page-header">
        <div className="header-content">
          <button onClick={() => navigate('/teacher')} className="back-btn">
            ← Orqaga
          </button>
          
          <div className="group-info">
            <div className="group-icon">{group?.code}</div>
            <div className="group-details">
              <h1>{group?.name}</h1>
              <span className={`status ${group?.is_active ? 'active' : 'inactive'}`}>
                {group?.is_active ? 'Faol' : 'Nofaol'}
              </span>
            </div>
          </div>

          <div className="quick-stats">
            <div className="stat">{students.length} o'quvchi</div>
            <div className="stat">{modules.length} modul</div>
            <div className="stat">{criteria.length} mezon</div>
          </div>
        </div>
      </div>

      {/* Simplified Navigation */}
      <div className="tab-nav">
        {[
          { id: 'students', label: 'O\'quvchilar' },
          { id: 'criteria', label: 'Mezonlar' },
          { id: 'modules', label: 'Modullar' },
          { id: 'lessons', label: 'Darslar' },
          { id: 'leaderboard', label: 'Reyting' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className={`section ${loadingStates.students ? 'section-loading' : ''}`}>
            <div className="section-header">
              <h2>O'quvchilar ({students.length}/30)</h2>
              <button 
                onClick={() => setShowAddStudent(true)}
                className="btn-add"
                disabled={students.length >= 30 || loadingStates.forms}
              >
                {loadingStates.forms ? (
                  <div className="inline-loading">
                    <div className="small-spinner"></div>
                    Yuklanmoqda...
                  </div>
                ) : (
                  '+ O\'quvchi qo\'shish'
                )}
              </button>
            </div>

            {showAddStudent && (
              <div className="form-card">
                <h3>Yangi o'quvchi</h3>
                <form onSubmit={handleAddStudent} className="simple-form">
                  <input
                    type="text"
                    placeholder="O'quvchi ismi"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                  <div className="form-actions">
                    <button type="submit" disabled={loadingStates.forms}>
                      {loadingStates.forms ? (
                        <div className="inline-loading">
                          <div className="small-spinner"></div>
                          Qo'shilmoqda...
                        </div>
                      ) : (
                        'Qo\'shish'
                      )}
                    </button>
                    <button type="button" onClick={() => setShowAddStudent(false)} disabled={loadingStates.forms}>Bekor</button>
                  </div>
                </form>
              </div>
            )}

            <div className="items-grid">
              {students.map(student => (
                <div key={student.id} className="item-card">
                  {editingStudent?.id === student.id ? (
                    <form onSubmit={handleUpdateStudent} className="edit-form">
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                      />
                      <div className="form-actions">
                        <button type="submit">Saqlash</button>
                        <button type="button" onClick={() => setEditingStudent(null)}>Bekor</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="item-info">
                        <h4>{student.full_name}</h4>
                        <p>{new Date(student.added_at).toLocaleDateString()}</p>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => {
                          setEditingStudent(student);
                          setStudentName(student.full_name);
                        }}>✏️</button>
                        <button onClick={() => handleDeleteStudent(student)}>🗑️</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Criteria Tab - Now with Module Selector */}
        {activeTab === 'criteria' && (
          <div className={`section ${loadingStates.criteria ? 'section-loading' : ''}`}>
            <div className="section-header">
              <div>
                <h2>Baholash mezonlari ({criteria.length}/6)</h2>
                <div className="module-selector">
                  <label>Modul:</label>
                  <select 
                    value={selectedModuleForCriteria?.id || ''} 
                    onChange={(e) => handleCriteriaModuleChange(e.target.value)}
                    disabled={loadingStates.criteria}
                  >
                    <option value="">Modulni tanlang</option>
                    {modules.map(module => (
                      <option key={module.id} value={module.id}>
                        {module.name} {module.is_active ? '(Faol)' : module.is_finished ? '(Tugatilgan)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                onClick={() => setShowAddCriteria(true)}
                className="btn-add"
                disabled={criteria.length >= 6 || !selectedModuleForCriteria || loadingStates.forms}
              >
                {loadingStates.forms ? (
                  <div className="inline-loading">
                    <div className="small-spinner"></div>
                    Yuklanmoqda...
                  </div>
                ) : (
                  '+ Mezon qo\'shish'
                )}
              </button>
            </div>

            {!selectedModuleForCriteria ? (
              <div className="empty-state">
                <h4>Modulni tanlang</h4>
                <p>Mezonlarni ko'rish uchun yuqoridan modulni tanlang</p>
              </div>
            ) : (
              <>
                {showAddCriteria && (
                  <div className="form-card">
                    <h3>Yangi mezon</h3>
                    <form onSubmit={handleAddCriteria} className="simple-form">
                      <input
                        type="text"
                        placeholder="Mezon nomi"
                        value={criteriaForm.name}
                        onChange={(e) => setCriteriaForm({...criteriaForm, name: e.target.value})}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Maksimal ball"
                        value={criteriaForm.max_points}
                        onChange={(e) => setCriteriaForm({...criteriaForm, max_points: e.target.value})}
                        min="1"
                        required
                      />
                      <select
                        value={criteriaForm.grading_method}
                        onChange={(e) => setCriteriaForm({...criteriaForm, grading_method: e.target.value})}
                      >
                        <option value="one_by_one">Birma-bir</option>
                        <option value="bulk">Ommaviy</option>
                      </select>
                      <div className="form-actions">
                        <button type="submit">Qo'shish</button>
                        <button type="button" onClick={() => setShowAddCriteria(false)}>Bekor</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="items-grid">
                  {criteria.map(criterion => (
                    <div key={criterion.id} className="item-card">
                      {editingCriteria?.id === criterion.id ? (
                        <form onSubmit={handleUpdateCriteria} className="edit-form">
                          <input
                            type="text"
                            value={criteriaForm.name}
                            onChange={(e) => setCriteriaForm({...criteriaForm, name: e.target.value})}
                            required
                          />
                          <input
                            type="number"
                            value={criteriaForm.max_points}
                            onChange={(e) => setCriteriaForm({...criteriaForm, max_points: e.target.value})}
                            min="1"
                            required
                          />
                          <select
                            value={criteriaForm.grading_method}
                            onChange={(e) => setCriteriaForm({...criteriaForm, grading_method: e.target.value})}
                          >
                            <option value="one_by_one">Birma-bir</option>
                            <option value="bulk">Ommaviy</option>
                          </select>
                          <div className="form-actions">
                            <button type="submit">Saqlash</button>
                            <button type="button" onClick={() => setEditingCriteria(null)}>Bekor</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="item-info">
                            <h4>{criterion.name}</h4>
                            <p>{criterion.max_points} ball - {criterion.grading_method === 'one_by_one' ? 'Birma-bir' : 'Ommaviy'}</p>
                          </div>
                          <div className="item-actions">
                            <button onClick={() => {
                              setEditingCriteria(criterion);
                              setCriteriaForm({
                                name: criterion.name,
                                max_points: criterion.max_points.toString(),
                                grading_method: criterion.grading_method
                              });
                            }}>✏️</button>
                            <button onClick={() => handleDeleteCriteria(criterion)}>🗑️</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Simplified Modules Tab */}
        {activeTab === 'modules' && (
          <div className={`section ${loadingStates.modules ? 'section-loading' : ''}`}>
            <div className="section-header">
              <h2>Modullar</h2>
              <button 
                onClick={handleCreateModule}
                className="btn-add"
                disabled={!!activeModule || loadingStates.forms}
              >
                {loadingStates.forms ? (
                  <div className="inline-loading">
                    <div className="small-spinner"></div>
                    Yaratilmoqda...
                  </div>
                ) : (
                  '+ Yangi modul'
                )}
              </button>
            </div>

            <div className="modules-simple">
              {modules.map((module, index) => (
                <div key={module.id} className={`module-card-simple ${module.is_active ? 'active' : module.is_finished ? 'finished' : ''}`}>
                  <div className="module-info">
                    <div className="module-number">{index + 1}</div>
                    <div>
                      <h4>{module.name}</h4>
                      <span className={`status ${module.is_active ? 'active' : module.is_finished ? 'finished' : 'inactive'}`}>
                        {module.is_active ? 'Faol' : module.is_finished ? 'Tugatilgan' : 'Kutilmoqda'}
                      </span>
                    </div>
                  </div>
                  <div className="module-actions">
                    <button onClick={() => {
                      setActiveTab('lessons');
                      setSelectedModuleForLessons(module);
                      loadLessons(module.id);
                    }}>Boshqarish</button>
                    {module.is_active && (
                      <button onClick={() => handleFinishModule(module)}>Tugatish</button>
                    )}
                    {!module.is_finished && (
                      <button onClick={() => handleDeleteModule(module)}>O'chirish</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simplified Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className={`section ${loadingStates.lessons ? 'section-loading' : ''}`}>
            <div className="section-header">
              <div>
                <h2>Darslar</h2>
                <div className="module-selector">
                  <label>Modul:</label>
                  <select 
                    value={selectedModuleForLessons?.id || ''} 
                    onChange={(e) => handleLessonsModuleChange(e.target.value)}
                    disabled={loadingStates.lessons}
                  >
                    <option value="">Modulni tanlang</option>
                    {modules.map(module => (
                      <option key={module.id} value={module.id}>
                        {module.name} {module.is_active ? '(Faol)' : module.is_finished ? '(Tugatilgan)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                onClick={handleStartLesson} 
                className="btn-add"
                disabled={!selectedModuleForLessons?.is_active || !!activeLesson || loadingStates.forms}
              >
                {loadingStates.forms ? (
                  <div className="inline-loading">
                    <div className="small-spinner"></div>
                    Boshlanmoqda...
                  </div>
                ) : (
                  '+ Dars boshlash'
                )}
              </button>
            </div>

            {!selectedModuleForLessons ? (
              <div className="empty-state">
                <h4>Modulni tanlang</h4>
                <p>Darslarni ko'rish uchun yuqoridan modulni tanlang</p>
              </div>
            ) : lessons.length === 0 ? (
              <div className="empty-state">
                <h4>Hali darslar yo'q</h4>
                <p>{selectedModuleForLessons.name} uchun hali darslar boshlanmagan</p>
              </div>
            ) : (
              <div className="lessons-simple">
                {lessons.map(lesson => (
                  <div key={lesson.id} className={`lesson-card-simple ${lesson.is_active ? 'active' : ''}`}>
                    <div className="lesson-info">
                      <h4>{lesson.name}</h4>
                      <span className={`status ${lesson.is_active ? 'active' : 'finished'}`}>
                        {lesson.is_active ? 'Faol' : 'Tugatilgan'}
                      </span>
                    </div>
                    {lesson.is_active && (
                      <div className="lesson-actions">
                        <button onClick={() => handleFinishLesson(lesson)}>Tugatish</button>
                        <button onClick={() => handleDeleteLesson(lesson)}>O'chirish</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Simplified Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className={`section ${loadingStates.leaderboard ? 'section-loading' : ''}`}>
            <div className="section-header">
              <div>
                <h2>Reyting jadvali</h2>
                <div className="module-selector">
                  <label>Modul:</label>
                  <select 
                    value={selectedModuleForLeaderboard?.id || ''} 
                    onChange={(e) => handleLeaderboardModuleChange(e.target.value)}
                    disabled={loadingStates.leaderboard}
                  >
                    <option value="">Modulni tanlang</option>
                    {modules.map(module => (
                      <option key={module.id} value={module.id}>
                        {module.name} {module.is_active ? '(Faol)' : module.is_finished ? '(Tugatilgan)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {!selectedModuleForLeaderboard ? (
              <div className="empty-state">
                <h4>Modulni tanlang</h4>
                <p>Reyting jadvalini ko'rish uchun yuqoridan modulni tanlang</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="empty-state">
                <h4>Hali natijalar yo'q</h4>
                <p>{selectedModuleForLeaderboard.name} uchun hali baholar kiritilmagan</p>
              </div>
            ) : (
              <div className="leaderboard-simple">
                {leaderboard.map(student => (
                  <div key={student.student_id} className="leaderboard-item-simple">
                    <div className="rank">#{student.position}</div>
                    <div className="student-name">{student.name}</div>
                    <div className="points">{student.total_points} ball</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetailPage;