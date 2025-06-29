import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedGroups, removeSavedGroup } from '../utils/localStorage';

const SavedGroups = () => {
  const [savedGroups, setSavedGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSavedGroups(getSavedGroups());
  }, []);

  const handleGroupClick = (code) => {
    navigate(`/group/${code}`);
  };

  const handleRemoveGroup = (code, e) => {
    e.stopPropagation();
    removeSavedGroup(code);
    setSavedGroups(getSavedGroups());
  };

  if (savedGroups.length === 0) {
    return (
      <div className="saved-groups card">
        <div className="card-header">
          <h2>Saqlangan Guruhlar</h2>
        </div>
        <div className="card-body">
          <div className="empty-state">
            <p>Hali hech qanday guruh saqlanmagan</p>
            <small>Guruhni ko'rgandan so'ng "Saqlash" tugmasini bosing</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-groups card">
      <div className="card-header">
        <h2>Saqlangan Guruhlar</h2>
      </div>
      <div className="card-body">
        <div className="groups-list">
          {savedGroups.map((group) => (
            <div 
              key={group.code}
              className="group-item"
              onClick={() => handleGroupClick(group.code)}
            >
              <div className="group-info">
                <span className="group-code">{group.code}</span>
                <span className="group-name">{group.name}</span>
              </div>
              <button
                className="btn-remove"
                onClick={(e) => handleRemoveGroup(group.code, e)}
                title="Olib tashlash"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedGroups;