import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GroupSearch: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    navigate(`/group/${code.trim().toUpperCase()}`);
  };

  return (
    <div className="group-search card">
      <div className="card-header">
        <h2>Guruhni Qidirish</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Guruh kodi</label>
            <input
              type="text"
              className="form-control"
              placeholder="Masalan: A, B, AA, AB"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !code.trim()}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Qidirilmoqda...
              </>
            ) : (
              'Qidirish'
            )}
          </button>
        </form>
        <div className="search-help">
          <p><small>Guruh kodini kiritib, talabalar ro'yxati va natijalarni ko'ring</small></p>
        </div>
      </div>
    </div>
  );
};

export default GroupSearch;