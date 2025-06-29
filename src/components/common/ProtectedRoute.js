import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, userType }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (userType && user.userType !== userType) {
    return (
      <div className="access-denied">
        <h2>Ruxsat berilmagan</h2>
        <p>Ushbu sahifaga kirish huquqingiz yo'q.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;