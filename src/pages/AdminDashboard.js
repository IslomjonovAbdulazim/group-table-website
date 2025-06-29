import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { adminAPI } from '../services/endpoints';
import TeacherList from '../components/admin/TeacherList';
import TeacherStats from '../components/admin/TeacherStats';
import Loading from '../components/common/Loading';

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await adminAPI.getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('O\'qituvchilarni olishda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/stats')) return 'stats';
    return 'teachers';
  };

  if (loading) {
    return <Loading text="Admin paneli yuklanmoqda..." />;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin paneli</h1>
        <p>O'qituvchilar va tizimni boshqaring</p>
      </div>

      <div className="dashboard-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Jami o'qituvchilar</h3>
            <span className="stat-number">{teachers.length}</span>
          </div>
          <div className="stat-card">
            <h3>Faol o'qituvchilar</h3>
            <span className="stat-number">{teachers.length}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-nav">
        <nav className="tab-nav">
          <Link 
            to="/admin" 
            className={`tab ${getActiveTab() === 'teachers' ? 'active' : ''}`}
          >
            O'qituvchilar
          </Link>
          
          {selectedTeacher && (
            <Link 
              to={`/admin/stats/${selectedTeacher.id}`}
              className={`tab ${getActiveTab() === 'stats' ? 'active' : ''}`}
            >
              Statistika
            </Link>
          )}
        </nav>
      </div>

      <div className="dashboard-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <TeacherList 
                teachers={teachers}
                onTeacherSelect={setSelectedTeacher}
                onTeachersUpdate={fetchTeachers}
              />
            } 
          />
          
          <Route 
            path="/stats/:teacherId" 
            element={
              <TeacherStats 
                teacher={selectedTeacher}
                onTeacherSelect={setSelectedTeacher}
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;