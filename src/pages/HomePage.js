import React from 'react';
import GroupSearch from '../components/GroupSearch';
import SavedGroups from '../components/SavedGroups';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="container">
          <h1 className="home-title">GroupTable</h1>
          <p className="home-subtitle">Guruh ma'lumotlarini qidiring va rivojlanishni kuzating</p>
          <a href="/login" className="login-btn">Kirish</a>
        </div>
      </header>
      
      <main className="home-main">
        <div className="container">
          <div className="home-content">
            <GroupSearch />
            <SavedGroups />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;