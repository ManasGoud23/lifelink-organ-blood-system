import React from 'react';
import { mockSignOut } from '../mockFirebaseComplete';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const handleLogout = async () => {
    try {
      await mockSignOut();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Error logging out:', error);
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
        return '👤 User';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">🩸 Real-Time Organ & Blood System</h1>
        <div className="navbar-right">
          <span className="user-info">
            {getUserTypeLabel(user?.userType)} - {user?.name}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
