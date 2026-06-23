import React, { useState } from 'react';
import { mockCreateUser, mockSignInUser } from '../mockFirebaseComplete';
import './AuthPages.css';

function AuthPages({ userType = 'patient', initialMode = 'login', onLoginSuccess, onBackToHome }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedUserType, setSelectedUserType] = useState(userType || 'patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAutofill = () => {
    if (selectedUserType === 'patient') {
      setPhone('9876543210');
      setPassword('password123');
    } else if (selectedUserType === 'hospital') {
      setPhone('9988776655');
      setPassword('hospital123');
    } else if (selectedUserType === 'admin') {
      setPhone('9111111111');
      setPassword('admin123');
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in with phone and password
        await mockSignInUser(phone, password);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        // Register new user
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }

        // Create new user with userType and location
        await mockCreateUser(phone, password, name, selectedUserType, location);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const getUserTypeLabel = (type) => {
    switch (type) {
      case 'patient':
        return '👤 Patient';
      case 'hospital':
        return '🏥 Hospital';
      case 'admin':
        return '👨‍💼 Admin';
      default:
        return 'User';
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {onBackToHome && (
          <button type="button" onClick={onBackToHome} className="back-btn">
            ← Back to Home
          </button>
        )}

        <h2>{isLogin ? 'Login as ' + getUserTypeLabel(selectedUserType) : 'Register as ' + getUserTypeLabel(selectedUserType)}</h2>

        {/* User Type Tabs */}
        <div className="auth-tabs" style={{ display: 'flex', gap: '5px', marginBottom: '20px', backgroundColor: '#f1f3f5', padding: '5px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => {
              setSelectedUserType('patient');
              setError('');
            }}
            className={`auth-tab ${selectedUserType === 'patient' ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: selectedUserType === 'patient' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              backgroundColor: selectedUserType === 'patient' ? 'white' : 'transparent',
              color: selectedUserType === 'patient' ? '#5c7cfa' : '#666',
              transition: 'all 0.2s'
            }}
          >
            👤 Patient
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedUserType('hospital');
              setError('');
            }}
            className={`auth-tab ${selectedUserType === 'hospital' ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: selectedUserType === 'hospital' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              backgroundColor: selectedUserType === 'hospital' ? 'white' : 'transparent',
              color: selectedUserType === 'hospital' ? '#e74c3c' : '#666',
              transition: 'all 0.2s'
            }}
          >
            🏥 Hospital
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedUserType('admin');
              setError('');
            }}
            className={`auth-tab ${selectedUserType === 'admin' ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: selectedUserType === 'admin' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              backgroundColor: selectedUserType === 'admin' ? 'white' : 'transparent',
              color: selectedUserType === 'admin' ? '#2c3e50' : '#666',
              transition: 'all 0.2s'
            }}
          >
            👨‍💼 Admin
          </button>
        </div>

        {/* Demo Credentials Box */}
        {isLogin && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px dashed #ced4da', 
            backgroundColor: '#f8f9fa',
            textAlign: 'left'
          }}>
            <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#495057', fontWeight: '600' }}>
              💡 Demo Credentials:
            </p>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#868e96', fontFamily: 'monospace' }}>
              {selectedUserType === 'patient' && 'Phone: 9876543210 | Pass: password123'}
              {selectedUserType === 'hospital' && 'Phone: 9988776655 | Pass: hospital123'}
              {selectedUserType === 'admin' && 'Phone: 9111111111 | Pass: admin123'}
            </p>
            <button
              type="button"
              onClick={handleAutofill}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '12px',
                backgroundColor: '#e9ecef',
                color: '#495057',
                border: '1px solid #ced4da',
                boxShadow: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'block'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#dee2e6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#e9ecef'}
            >
              ⚡ Auto-fill {getUserTypeLabel(selectedUserType).split(' ')[1]} Credentials
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleAuth}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          {!isLogin && (
            <input
              type="text"
              placeholder="City/Location (e.g., New York)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          )}
          <input
            type="tel"
            placeholder="Mobile Number (e.g., 9876543210)"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            maxLength="10"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <button 
            type="submit" 
            disabled={
              loading || 
              (isLogin ? (!phone || !password) : (!phone || !password || !name || !location || !confirmPassword))
            }
            className={`auth-submit-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? <span className="spinner"></span> : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: '20px' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="toggle-btn"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPages;
