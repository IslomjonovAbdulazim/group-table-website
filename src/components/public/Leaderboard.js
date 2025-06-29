import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../../services/endpoints';
import { getPositionChange, generateColor } from '../../utils/helpers';
import Loading from '../common/Loading';

const Leaderboard = ({ groupCode, module }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (module) {
      fetchLeaderboard();
    }
  }, [module]);

  const fetchLeaderboard = async () => {
    if (!module) return;

    setLoading(true);
    try {
      const data = await publicAPI.getModuleLeaderboard(groupCode, module.id);
      setLeaderboard(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Liderlik jadvalini olishda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return position;
  };

  const getPositionClass = (position) => {
    if (position === 1) return 'first-place';
    if (position === 2) return 'second-place';
    if (position === 3) return 'third-place';
    return '';
  };

  if (loading) {
    return <Loading text="Liderlik jadvali yuklanmoqda..." />;
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>{module?.name} - Liderlik jadvali</h2>
        <div className="leaderboard-actions">
          <button onClick={fetchLeaderboard} className="btn btn-secondary">
            Yangilash
          </button>
          {lastUpdated && (
            <span className="last-updated">
              Oxirgi yangilanish: {lastUpdated.toLocaleTimeString('uz-UZ')}
            </span>
          )}
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="empty-state">
          <p>Hozircha natijalar yo'q</p>
          <small>O'qituvchi baholar qo'ygandan keyin bu yerda ko'rinadi</small>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          <div className="podium">
            {leaderboard.slice(0, 3).map((student, index) => (
              <div key={student.student_id} className={`podium-place ${getPositionClass(student.position)}`}>
                <div className="podium-student">
                  <div className="position-icon">
                    {getPositionIcon(student.position)}
                  </div>
                  <div className="student-info">
                    <h3>{student.name}</h3>
                    <p className="points">{student.total_points} ball</p>
                  </div>
                  <Link 
                    to={`/group/${groupCode}/chart?student=${student.student_id}`}
                    className="view-chart-btn"
                  >
                    Grafik ko'rish
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Full leaderboard table */}
          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th>O'rin</th>
                  <th>O'quvchi</th>
                  <th>Jami ball</th>
                  <th>Graf</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((student) => (
                  <tr 
                    key={student.student_id} 
                    className={getPositionClass(student.position)}
                  >
                    <td className="position-cell">
                      <span className="position-number">
                        {getPositionIcon(student.position)}
                      </span>
                    </td>
                    <td className="student-cell">
                      <div className="student-avatar" style={{ backgroundColor: generateColor(student.position - 1) }}>
                        {student.name.charAt(0)}
                      </div>
                      <span className="student-name">{student.name}</span>
                    </td>
                    <td className="points-cell">
                      <span className="points-value">{student.total_points}</span>
                      <small>ball</small>
                    </td>
                    <td className="actions-cell">
                      <Link 
                        to={`/group/${groupCode}/chart?student=${student.student_id}`}
                        className="btn btn-sm btn-primary"
                      >
                        Ko'rish
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistics */}
          <div className="leaderboard-stats">
            <div className="stats-grid">
              <div className="stat-item">
                <h4>Jami o'quvchilar</h4>
                <span>{leaderboard.length}</span>
              </div>
              <div className="stat-item">
                <h4>Eng yuqori ball</h4>
                <span>{Math.max(...leaderboard.map(s => s.total_points))}</span>
              </div>
              <div className="stat-item">
                <h4>O'rtacha ball</h4>
                <span>
                  {Math.round(
                    leaderboard.reduce((sum, s) => sum + s.total_points, 0) / leaderboard.length
                  )}
                </span>
              </div>
              <div className="stat-item">
                <h4>Eng kam ball</h4>
                <span>{Math.min(...leaderboard.map(s => s.total_points))}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;