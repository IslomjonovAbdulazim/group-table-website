import { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/endpoints';
import { formatError } from '../../utils/helpers';

const GradingPanel = ({ groupId }) => {
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [grades, setGrades] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (groupId) {
      fetchInitialData();
    }
  }, [groupId]);

  useEffect(() => {
    if (selectedModule) {
      fetchModuleData();
    }
  }, [selectedModule]);

  const fetchInitialData = async () => {
    try {
      const [studentsData, modulesData] = await Promise.all([
        teacherAPI.getStudents(groupId),
        teacherAPI.getModules(groupId)
      ]);
      
      setStudents(studentsData);
      setModules(modulesData);
      
      const activeModule = modulesData.find(m => m.is_active);
      if (activeModule) {
        setSelectedModule(activeModule);
      }
    } catch (error) {
      console.error('Ma\'lumotlarni olishda xatolik:', error);
    }
  };

  const fetchModuleData = async () => {
    try {
      const [lessonsData, criteriaData] = await Promise.all([
        teacherAPI.getLessons(selectedModule.id),
        teacherAPI.getCriteria(selectedModule.id)
      ]);
      
      setLessons(lessonsData);
      setCriteria(criteriaData);
      
      const activeLesson = lessonsData.find(l => l.is_active);
      if (activeLesson) {
        setSelectedLesson(activeLesson);
      }
    } catch (error) {
      console.error('Modul ma\'lumotlarini olishda xatolik:', error);
    }
  };

  const fetchLeaderboard = async () => {
    if (!selectedModule) return;
    
    try {
      const data = await teacherAPI.getLeaderboard(selectedModule.id);
      setLeaderboard(data);
    } catch (error) {
      console.error('Liderlik jadvalini olishda xatolik:', error);
    }
  };

  const handleGradeChange = (studentId, criteriaId, points) => {
    const key = `${studentId}-${criteriaId}`;
    setGrades(prev => ({
      ...prev,
      [key]: points
    }));
  };

  const handleSubmitGrade = async (studentId, criteriaId) => {
    const key = `${studentId}-${criteriaId}`;
    const points = grades[key];
    
    if (points === undefined || points === '') return;
    
    setLoading(true);
    try {
      await teacherAPI.createGrade(
        parseInt(points),
        studentId,
        criteriaId,
        selectedLesson.id
      );
      
      // Bahoni saqlashdan keyin inputni tozalash
      setGrades(prev => {
        const newGrades = { ...prev };
        delete newGrades[key];
        return newGrades;
      });
      
      fetchLeaderboard();
    } catch (error) {
      alert(formatError(error));
    } finally {
      setLoading(false);
    }
  };

  if (!selectedModule) {
    return (
      <div className="grading-panel">
        <div className="empty-state">
          <p>Baholash uchun avval modul yarating</p>
        </div>
      </div>
    );
  }

  if (!selectedLesson) {
    return (
      <div className="grading-panel">
        <div className="empty-state">
          <p>Baholash uchun dars boshlanishi kerak</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grading-panel">
      <div className="grading-header">
        <h2>Baholash paneli</h2>
        <div className="current-info">
          <span><strong>Modul:</strong> {selectedModule.name}</span>
          <span><strong>Dars:</strong> {selectedLesson.name}</span>
        </div>
      </div>

      {criteria.length === 0 && (
        <div className="warning-message">
          Baholash uchun avval mezonlar yarating
        </div>
      )}

      {students.length === 0 && (
        <div className="warning-message">
          Baholash uchun guruhga o'quvchilar qo'shing
        </div>
      )}

      {criteria.length > 0 && students.length > 0 && (
        <div className="grading-table">
          <table>
            <thead>
              <tr>
                <th>O'quvchi</th>
                {criteria.map(criterion => (
                  <th key={criterion.id}>
                    {criterion.name}
                    <small>({criterion.max_points} ball)</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td className="student-name">{student.full_name}</td>
                  {criteria.map(criterion => {
                    const key = `${student.id}-${criterion.id}`;
                    return (
                      <td key={criterion.id} className="grade-cell">
                        <div className="grade-input-group">
                          <input
                            type="number"
                            min="0"
                            max={criterion.max_points}
                            value={grades[key] || ''}
                            onChange={(e) => handleGradeChange(student.id, criterion.id, e.target.value)}
                            placeholder="0"
                            className="grade-input"
                          />
                          <button
                            onClick={() => handleSubmitGrade(student.id, criterion.id)}
                            disabled={loading || !grades[key]}
                            className="btn btn-sm btn-primary"
                          >
                            Saqlash
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="leaderboard-section">
        <div className="section-header">
          <h3>Liderlik jadvali</h3>
          <button onClick={fetchLeaderboard} className="btn btn-secondary">
            Yangilash
          </button>
        </div>

        {leaderboard.length > 0 ? (
          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th>O'rin</th>
                  <th>O'quvchi</th>
                  <th>Jami ball</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(entry => (
                  <tr key={entry.student_id}>
                    <td className="position">{entry.position}</td>
                    <td>{entry.name}</td>
                    <td className="total-points">{entry.total_points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Hozircha baholar yo'q</p>
        )}
      </div>
    </div>
  );
};

export default GradingPanel;