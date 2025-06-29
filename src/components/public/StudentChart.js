import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicAPI } from '../../services/endpoints';
import { getPositionChange, generateColor } from '../../utils/helpers';
import Loading from '../common/Loading';

const StudentChart = ({ groupCode, module }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (module) {
      fetchStudents();
    }
  }, [module]);

  useEffect(() => {
    const studentId = searchParams.get('student');
    if (studentId && students.length > 0) {
      const student = students.find(s => s.student_id === parseInt(studentId));
      if (student) {
        setSelectedStudent(student);
        fetchStudentChart(student.student_id);
      }
    }
  }, [searchParams, students]);

  const fetchStudents = async () => {
    if (!module) return;

    try {
      const data = await publicAPI.getModuleLeaderboard(groupCode, module.id);
      setStudents(data);
    } catch (error) {
      console.error('O\'quvchilar ro\'yxatini olishda xatolik:', error);
    }
  };

  const fetchStudentChart = async (studentId) => {
    setLoading(true);
    try {
      const data = await publicAPI.getStudentChart(groupCode, studentId);
      setChartData(data);
    } catch (error) {
      console.error('O\'quvchi grafigini olishda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setSearchParams({ student: student.student_id });
    fetchStudentChart(student.student_id);
  };

  return (
    <div className="student-chart">
      <div className="chart-header">
        <h2>O'quvchi taraqqiyoti</h2>
        <div className="student-selector">
          <label>O'quvchini tanlang:</label>
          <select 
            value={selectedStudent?.student_id || ''} 
            onChange={(e) => {
              const student = students.find(s => s.student_id === parseInt(e.target.value));
              if (student) handleStudentSelect(student);
            }}
          >
            <option value="">O'quvchini tanlang...</option>
            {students.map(student => (
              <option key={student.student_id} value={student.student_id}>
                {student.name} ({student.total_points} ball)
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedStudent ? (
        <div className="student-selection">
          <h3>O'quvchini tanlang</h3>
          <div className="students-grid">
            {students.map((student) => (
              <div 
                key={student.student_id} 
                className="student-card"
                onClick={() => handleStudentSelect(student)}
              >
                <div 
                  className="student-avatar"
                  style={{ backgroundColor: generateColor(student.position - 1) }}
                >
                  {student.name.charAt(0)}
                </div>
                <div className="student-info">
                  <h4>{student.name}</h4>
                  <p>O'rin: {student.position}</p>
                  <p>Ball: {student.total_points}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="chart-content">
          <div className="student-header">
            <div className="student-info">
              <div 
                className="student-avatar large"
                style={{ backgroundColor: generateColor(selectedStudent.position - 1) }}
              >
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h3>{selectedStudent.name}</h3>
                <p>Hozirgi o'rin: <strong>{selectedStudent.position}</strong></p>
                <p>Jami ball: <strong>{selectedStudent.total_points}</strong></p>
              </div>
            </div>
          </div>

          {loading ? (
            <Loading text="Grafik yuklanmoqda..." />
          ) : chartData ? (
            <div className="progress-chart">
              <h4>O'rin o'zgarishi</h4>
              
              {/* Simple text-based chart for now */}
              <div className="chart-timeline">
                {chartData.positions.map((position, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-point">
                      <span className="lesson-name">{position.lesson}</span>
                      <span className="position-value">
                        O'rin: {position.position}
                      </span>
                      {position.change !== 0 && (
                        <span className={`position-change ${position.change > 0 ? 'up' : 'down'}`}>
                          {getPositionChange(position.change).icon} {Math.abs(position.change)}
                        </span>
                      )}
                    </div>
                    {index < chartData.positions.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="chart-summary">
                <h4>Xulosa</h4>
                <div className="summary-stats">
                  <div className="summary-item">
                    <span>Eng yuqori o'rin:</span>
                    <strong>{Math.min(...chartData.positions.map(p => p.position))}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Eng past o'rin:</span>
                    <strong>{Math.max(...chartData.positions.map(p => p.position))}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Umumiy o'zgarish:</span>
                    <strong className={
                      chartData.positions[0].position > chartData.positions[chartData.positions.length - 1].position 
                        ? 'positive' : 'negative'
                    }>
                      {chartData.positions[0].position > chartData.positions[chartData.positions.length - 1].position 
                        ? '↑ Yaxshilandi' : '↓ Yomonlashdi'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>Bu o'quvchi uchun ma'lumotlar yo'q</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentChart;