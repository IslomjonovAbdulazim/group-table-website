import React, { useState } from 'react';
import { changeAdminPassword } from '../services/authService';
import { PasswordChange } from '../types';

const AccountSettings: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    current_password: '',
    new_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await changeAdminPassword(passwordData);
      setMessage('Parol muvaffaqiyatli o\'zgartirildi');
      setPasswordData({ current_password: '', new_password: '' });
      setShowPasswordForm(false);
    } catch (error) {
      setMessage('Parol o\'zgartirilmadi. Joriy parolni tekshiring.');
    }
    
    setLoading(false);
  };

  return (
    <div className="account-settings card">
      <div className="card-header">
        <h2>Hisob Sozlamalari</h2>
      </div>
      
      <div className="card-body">
        {message && (
          <div className={`alert ${message.includes('muvaffaqiyatli') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="setting-item">
          <h3>Parolni o'zgartirish</h3>
          {!showPasswordForm ? (
            <button 
              className="btn btn-primary"
              onClick={() => setShowPasswordForm(true)}
            >
              Parolni o'zgartirish
            </button>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Joriy parol</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    current_password: e.target.value
                  })}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Yangi parol</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    new_password: e.target.value
                  })}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'O\'zgartirilmoqda...' : 'O\'zgartirish'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ current_password: '', new_password: '' });
                    setMessage('');
                  }}
                  disabled={loading}
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;