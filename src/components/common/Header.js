import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isTeacher, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>GroupTable</h1>
        </Link>

        <nav className="nav">
          {!user ? (
            <div className="nav-links">
              <Link to="/" className="nav-link">Bosh sahifa</Link>
              <Link to="/login" className="nav-link login-btn">Kirish</Link>
            </div>
          ) : (
            <div className="nav-links">
              {isTeacher() && (
                <Link to="/teacher" className="nav-link">
                  O'qituvchi paneli
                </Link>
              )}
              
              {isAdmin() && (
                <Link to="/admin" className="nav-link">
                  Admin paneli
                </Link>
              )}
              
              <span className="user-info">
                {isTeacher() ? 'O\'qituvchi' : 'Admin'}
              </span>
              
              <button onClick={handleLogout} className="logout-btn">
                Chiqish
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;