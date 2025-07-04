import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import TeacherPage from './pages/TeacherPage';
import GroupPage from './pages/GroupPage';
// Add this import
import GroupDetailPage from './pages/GroupDetailPage';

// Add this route inside <Routes>
function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/group/:code" element={<GroupPage />} />
          <Route path="/teacher/group/:id" element={<GroupDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;