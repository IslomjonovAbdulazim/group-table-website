import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Public components
import GroupSearch from './components/public/GroupSearch';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Ommaviy sahifalar */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/group/:code/*" element={<GroupSearch />} />
              
              {/* O'qituvchi sahifalari */}
              <Route 
                path="/teacher/*" 
                element={
                  <ProtectedRoute userType="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin sahifalari */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute userType="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 sahifa */}
              <Route path="*" element={
                <div className="not-found">
                  <h2>Sahifa topilmadi</h2>
                  <p>Siz qidirayotgan sahifa mavjud emas.</p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;