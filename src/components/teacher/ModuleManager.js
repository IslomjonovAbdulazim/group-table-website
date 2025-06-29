import { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/endpoints';
import { formatError } from '../../utils/helpers';

const ModuleManager = ({ groupId }) => {
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showCriteriaForm, setShowCriteriaForm] = useState(false);
  const [criteriaForm, setCriteriaForm] = useState({
    name: '',
    max_points: 10,
    grading_method: 'one_by_one'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (groupId) {
      fetchModules();
    }
  }, [groupId]);

  useEffect(() => {
    if (selectedModule) {
      fetchLessons();
      fetchCriteria();
    }
  }, [selectedModule]);

  const fetchModules = async () => {
    try {
      const data = await teacherAPI.getModules(groupId);
      setModules(data);
      if (data.length > 0 && data.find(m => m.is_active)) {
        setSelectedModule(data.find(m => m.is_active));
      }
    } catch (error) {
      console.error('Modullarni olishda xatolik:', error);
    }
  };

  const fetchLessons = async () => {
    try {
      const data = await teacherAPI.getLessons(selectedModule.id);
      setLessons(data);
    } catch (error) {
      console.error('Darslarni olishda xatolik:', error);
    }
  };

  const fetchCriteria = async () => {
    try {
      const data = await teacherAPI.getCriteria(selectedModule.id);
      setCriteria(data);
    } catch (error) {
      console.error('Mezonlarni olishda xatolik:', error);
    }
  };

  const handleCreateModule = async () => {
    if (!window.confirm('Yangi modul yaratmoqchimisiz?')) return;

    try {
      await teacherAPI.createModule(groupId);
      fetchModules();
    } catch (error) {
      alert(formatError(error));
    }
  };

  const handleStartLesson = async () => {
    if (!window.confirm('Yangi dars boshlamoqchimisiz?')) return;

    try {
      await teacherAPI.startLesson(selectedModule.id);
      fetchLessons();
    } catch (error) {
      alert(formatError(error));
    }
  };

  const handleFinishLesson = async (lessonId) => {
    if (!window.confirm('Darsni yakunlamoqchimisiz?')) return;

    try {
      await teacherAPI.finishLesson(lessonId);
      fetchLessons();
    } catch (error) {
      alert(formatError(error));
    }
  };

  const handleCreateCriteria = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await teacherAPI.createCriteria(
        selectedModule.id,
        criteriaForm.name,
        criteriaForm.max_points,
        criteriaForm.grading_method
      );
      setCriteriaForm({ name: '', max_points: 10, grading_method: 'one_by_one' });
      setShowCriteriaForm(false);
      fetchCriteria();
    } catch (error) {
      alert(formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const activeModule = modules.find(m => m.is_active);

  return (
    <div className="module-manager">
      <div className="section-header">
        <h2>Modullar va darslar</h2>
        {!activeModule && (
          <button onClick={handleCreateModule} className="btn btn-primary">
            Yangi modul yaratish
          </button>
        )}
      </div>

      {modules.length === 0 && (
        <div className="empty-state">
          <p>Hozircha modullar yo'q</p>
          <button onClick={handleCreateModule} className="btn btn-primary">
            Birinchi modulni yarating
          </button>
        </div>
      )}

      {activeModule && (
        <div className="active-module">
          <h3>{activeModule.name}</h3>
          
          <div className="module-actions">
            <button onClick={handleStartLesson} className="btn btn-primary">
              Yangi dars boshlash
            </button>
            <button 
              onClick={() => setShowCriteriaForm(true)} 
              className="btn btn-secondary"
              disabled={criteria.length >= 6}
            >
              Mezon qo'shish
            </button>
          </div>

          {criteria.length >= 6 && (
            <div className="warning-message">
              Har bir modulda maksimal 6 ta mezon bo'lishi mumkin
            </div>
          )}

          <div className="module-content">
            <div className="lessons-section">
              <h4>Darslar ({lessons.length}/15)</h4>
              {lessons.length > 0 ? (
                <div className="lessons-list">
                  {lessons.map(lesson => (
                    <div key={lesson.id} className={`lesson-item ${lesson.is_active ? 'active' : ''}`}>
                      <span>{lesson.name}</span>
                      <span className={`status ${lesson.is_active ? 'active' : 'finished'}`}>
                        {lesson.is_active ? 'Faol' : 'Yakunlangan'}
                      </span>
                      {lesson.is_active && (
                        <button 
                          onClick={() => handleFinishLesson(lesson.id)}
                          className="btn btn-sm btn-warning"
                        >
                          Yakunlash
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>Hozircha darslar yo'q</p>
              )}
            </div>

            <div className="criteria-section">
              <h4>Baholash mezonlari ({criteria.length}/6)</h4>
              {criteria.length > 0 ? (
                <div className="criteria-list">
                  {criteria.map(criterion => (
                    <div key={criterion.id} className="criterion-item">
                      <div>
                        <strong>{criterion.name}</strong>
                        <span className="max-points">Maksimal: {criterion.max_points} ball</span>
                      </div>
                      <span className="grading-method">
                        {criterion.grading_method === 'one_by_one' ? 'Alohida' : 'Guruhli'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Hozircha mezonlar yo'q</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showCriteriaForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Yangi mezon qo'shish</h3>
            
            <form onSubmit={handleCreateCriteria}>
              <div className="form-group">
                <label>Mezon nomi</label>
                <input
                  type="text"
                  value={criteriaForm.name}
                  onChange={(e) => setCriteriaForm({...criteriaForm, name: e.target.value})}
                  placeholder="Masalan: Uy vazifa"
                  required
                />
              </div>

              <div className="form-group">
                <label>Maksimal ball</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={criteriaForm.max_points}
                  onChange={(e) => setCriteriaForm({...criteriaForm, max_points: parseInt(e.target.value)})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Baholash usuli</label>
                <select
                  value={criteriaForm.grading_method}
                  onChange={(e) => setCriteriaForm({...criteriaForm, grading_method: e.target.value})}
                >
                  <option value="one_by_one">Alohida (har bir o'quvchi uchun)</option>
                  <option value="bulk">Guruhli (bir vaqtda hammasi)</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Qo\'shilyapti...' : 'Qo\'shish'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCriteriaForm(false)}
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleManager;