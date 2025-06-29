import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { teacherAPI } from '../services/endpoints';
import GroupList from '../components/teacher/GroupList';
import StudentManager from '../components/teacher/StudentManager';
import ModuleManager from '../components/teacher/ModuleManager';
import GradingPanel from '../components/teacher/GradingPanel';
import Loading from '../components/common/Loading';

const TeacherDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const data = await teacherAPI.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Guruhlarni olishda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/students')) return 'students';
    if (path.includes('/modules')) return 'modules';
    if (path.includes('/grading')) return 'grading';
    return 'groups';
  };

  if (loading) {
    return <Loading text="O'qituvchi paneli yuklanmoqda..." />;
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>O'qituvchi paneli</h1>
        <p>Guruhlar va o'quvchilarni boshqaring</p>
      </div>

      <div className="dashboard-nav">
        <nav className="tab-nav">
          <Link 
            to="/teacher" 
            className={`tab ${getActiveTab() === 'groups' ? 'active' : ''}`}
          >
            Guruhlar ({groups.length})
          </Link>
          
          {selectedGroup && (
            <>
              <Link 
                to={`/teacher/students/${selectedGroup.id}`}
                className={`tab ${getActiveTab() === 'students' ? 'active' : ''}`}
              >
                O'quvchilar
              </Link>
              
              <Link 
                to={`/teacher/modules/${selectedGroup.id}`}
                className={`tab ${getActiveTab() === 'modules' ? 'active' : ''}`}
              >
                Modullar
              </Link>
              
              <Link 
                to={`/teacher/grading/${selectedGroup.id}`}
                className={`tab ${getActiveTab() === 'grading' ? 'active' : ''}`}
              >
                Baholash
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="dashboard-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <GroupList 
                groups={groups} 
                onGroupSelect={setSelectedGroup}
                onGroupsUpdate={fetchGroups}
              />
            } 
          />
          
          <Route 
            path="/students/:groupId" 
            element={
              <StudentManager 
                groupId={selectedGroup?.id}
                onGroupSelect={setSelectedGroup}
              />
            } 
          />
          
          <Route 
            path="/modules/:groupId" 
            element={
              <ModuleManager 
                groupId={selectedGroup?.id}
                onGroupSelect={setSelectedGroup}
              />
            } 
          />
          
          <Route 
            path="/grading/:groupId" 
            element={
              <GradingPanel 
                groupId={selectedGroup?.id}
                onGroupSelect={setSelectedGroup}
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherDashboard;