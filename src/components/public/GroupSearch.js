import { useState, useEffect } from 'react';
import { useParams, Routes, Route, Link, useLocation } from 'react-router-dom';
import { publicAPI } from '../../services/endpoints';
import Leaderboard from './Leaderboard';
import StudentChart from './StudentChart';
import Loading from '../common/Loading';

const GroupSearch = () => {
  const { code } = useParams();
  const location = useLocation();
  const [group, setGroup] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroupData();
  }, [code]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const [groupData, modulesData] = await Promise.all([
        publicAPI.getGroupByCode(code),
        publicAPI.getGroupModules(code)
      ]);
      
      setGroup(groupData);
      setModules(modulesData);
      
      if (modulesData.length > 0) {
        setSelectedModule(modulesData[0]);
      }
    } catch (error) {
      setError('Guruh topilmadi yoki mavjud emas');
    } finally {
      setLoading(false);
    }
  };

  const isLeaderboardPath = () => {
    return location.pathname.includes('/leaderboard') || location.pathname === `/group/${code}`;
  };

  const isChartPath = () => {
    return location.pathname.includes('/chart');
  };

  if (loading) {
    return <Loading text="Guruh ma'lumotlari yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Xatolik</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="group-search">
      <div className="group-header">
        <div className="container">
          <h1>{group.name}</h1>
          <p className="group-code">Guruh kodi: <strong>{group.code}</strong></p>
          
          {modules.length > 0 && (
            <div className="module-selector">
              <label>Modulni tanlang:</label>
              <select 
                value={selectedModule?.id || ''} 
                onChange={(e) => {
                  const module = modules.find(m => m.id === parseInt(e.target.value));
                  setSelectedModule(module);
                }}
              >
                {modules.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="group-nav">
        <div className="container">
          <nav className="tab-nav">
            <Link 
              to={`/group/${code}`}
              className={`tab ${isLeaderboardPath() ? 'active' : ''}`}
            >
              Liderlik jadvali
            </Link>
            <Link 
              to={`/group/${code}/chart`}
              className={`tab ${isChartPath() ? 'active' : ''}`}
            >
              O'quvchi grafigi
            </Link>
          </nav>
        </div>
      </div>

      <div className="group-content">
        <div className="container">
          {modules.length === 0 ? (
            <div className="empty-state">
              <p>Bu guruhda hozircha modullar yo'q</p>
            </div>
          ) : (
            <Routes>
              <Route 
                path="/" 
                element={
                  <Leaderboard 
                    groupCode={code} 
                    module={selectedModule} 
                  />
                } 
              />
              <Route 
                path="/leaderboard" 
                element={
                  <Leaderboard 
                    groupCode={code} 
                    module={selectedModule} 
                  />
                } 
              />
              <Route 
                path="/chart" 
                element={
                  <StudentChart 
                    groupCode={code} 
                    module={selectedModule} 
                  />
                } 
              />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSearch;