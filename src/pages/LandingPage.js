import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatGroupCode } from '../utils/helpers';

const LandingPage = () => {
  const [groupCode, setGroupCode] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const formattedCode = formatGroupCode(groupCode);
    if (formattedCode && formattedCode.length === 8) {
      navigate(`/group/${formattedCode}`);
    }
  };

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">GroupTable</h1>
          <p className="hero-subtitle">
            O'quvchilar taraqqiyotini kuzatish tizimi
          </p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container">
              <input
                type="text"
                placeholder="Guruh kodini kiriting (masalan: ABC123XY)"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                maxLength="8"
                className="search-input"
              />
              <button type="submit" className="search-btn">
                Qidirish
              </button>
            </div>
          </form>

          <div className="instructions">
            <h3>Qanday ishlatish kerak?</h3>
            <ol>
              <li>O'qituvchingizdan guruh kodini so'rang</li>
              <li>Yuqoridagi maydoncha kodini kiriting</li>
              <li>Guruh natijalarini ko'ring</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Imkoniyatlar</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Liderlik jadvali</h3>
              <p>O'quvchilar o'rtasidagi reyting va ballarni ko'ring</p>
            </div>
            <div className="feature-card">
              <h3>Taraqqiyot grafigi</h3>
              <p>Har bir o'quvchining vaqt davomidagi o'sishini kuzating</p>
            </div>
            <div className="feature-card">
              <h3>Real vaqt yangilanishi</h3>
              <p>Natijalar darhol yangilanadi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;