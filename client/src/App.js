import React, { useState, useEffect } from 'react';
import { mockGetCurrentUser } from './mockFirebaseComplete';
import './App.css';
import HomePage from './pages/HomePage';
import AuthPages from './pages/AuthPages';
// import Dashboard from './pages/Dashboard'; // Removed legacy dashboard import
import Navbar from './components/Navbar';
import PatientDashboard from './pages/PatientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [authUserType, setAuthUserType] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    // Check if user is logged in
    const checkUser = () => {
      const currentUser = mockGetCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setCurrentPage('dashboard');
      }
      setLoading(false);
    };

    // Check immediately and also on storage change
    checkUser();
    window.addEventListener('storage', checkUser);

    return () => window.removeEventListener('storage', checkUser);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setAuthUserType(null);
  };

  const handleNavigateToAuth = (userType, mode = 'login') => {
    setAuthUserType(userType);
    setAuthMode(mode);
    setCurrentPage('auth');
  };

  const handleLoginSuccess = () => {
    const currentUser = mockGetCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentPage('dashboard');
    }
  };

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.userType) {
      case 'patient':
        return <PatientDashboard user={user} />;
      case 'hospital':
        return <HospitalDashboard user={user} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      default:
        return (
          <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Unknown User Type</h2>
            <p>User type: {user.userType || 'None'}</p>
            <p>Please contact support or try registering again.</p>
          </div>
        );
    }
  };

  return (
    <div className="app">
      {user && <Navbar user={user} onLogout={handleLogout} />}
      {user ? (
        renderDashboard()
      ) : currentPage === 'home' ? (
        <HomePage onNavigate={handleNavigateToAuth} />
      ) : (
        <AuthPages 
          key={`${authUserType}-${authMode}`}
          userType={authUserType} 
          initialMode={authMode} 
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={() => setCurrentPage('home')}
        />
      )}
    </div>
  );
}

export default App;
