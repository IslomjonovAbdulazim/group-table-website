import React from 'react';
import { useParams } from 'react-router-dom';
import GroupDetails from '../components/GroupDetails';
import '../styles/GroupPage.css';

const GroupPage = () => {
  const { code } = useParams();

  return (
    <div className="group-page">
      <header className="group-header">
        <div className="container">
          <h1>Guruh {code}</h1>
          <a href="/" className="back-link">← Bosh sahifaga qaytish</a>
        </div>
      </header>
      
      <main className="group-main">
        <div className="container">
          <GroupDetails code={code || ''} />
        </div>
      </main>
    </div>
  );
};

export default GroupPage;