import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './components/shared/Login';
import Layout from './components/shared/Layout';
import AdminPage from './pages/AdminPage';
import TeacherPage from './pages/TeacherPage';
import PublicPage from './pages/PublicPage';
import Loading from './components/shared/Loading';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/public/:code" element={<PublicPage />} />
      
      {/* Auth routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to={user.user_type === 'admin' ? '/admin' : '/teacher'} /> : <Login />} 
      />
      
      {/* Protected routes */}
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route 
          index 
          element={<Navigate to={user?.user_type === 'admin' ? '/admin' : '/teacher'} />} 
        />
        <Route 
          path="admin/*" 
          element={user?.user_type === 'admin' ? <AdminPage /> : <Navigate to="/teacher" />} 
        />
        <Route 
          path="teacher/*" 
          element={user?.user_type === 'teacher' ? <TeacherPage /> : <Navigate to="/admin" />} 
        />
      </Route>
      
      {/* Fallback */}
      <Route 
        path="*" 
        element={<Navigate to={user ? (user.user_type === 'admin' ? '/admin' : '/teacher') : '/login'} />} 
      />
    </Routes>
  );
}

export default App;