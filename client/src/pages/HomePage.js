import React from 'react';
import './HomePage.css';

function HomePage({ onNavigate }) {
  const handleNavigate = (userType, mode = 'login') => {
    if (onNavigate) {
      onNavigate(userType, mode);
    }
  };

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-logo">🩸 Real-Time Organ & Blood System</h1>
          <div className="nav-buttons">
            <button className="nav-btn login-btn" onClick={() => handleNavigate('patient', 'login')}>Login</button>
            <button className="nav-btn register-btn" onClick={() => handleNavigate('patient', 'register')}>Register</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>A Real-Time Organ & Blood Availability System</h1>
          <p>Connecting donors, patients, and hospitals to save lives</p>
          <div className="hero-buttons">
            <button onClick={() => handleNavigate('patient', 'login')} className="btn btn-primary">I'm a Patient</button>
            <button onClick={() => handleNavigate('hospital', 'login')} className="btn btn-secondary">I'm a Hospital</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <h2>How It Works</h2>
          <div className="features">
            <div className="feature-card patient-card">
              <div className="feature-icon">👤</div>
              <h3>For Patients</h3>
              <ul>
                <li>Search available blood & organs</li>
                <li>Raise emergency requests</li>
                <li>Get real-time notifications</li>
                <li>Track request status</li>
              </ul>
            </div>

            <div className="feature-card hospital-card">
              <div className="feature-icon">🏥</div>
              <h3>For Hospitals</h3>
              <ul>
                <li>Manage blood & organ inventory</li>
                <li>Update stock levels</li>
                <li>Auto-expiry tracking</li>
                <li>Respond to patient requests</li>
              </ul>
            </div>

            <div className="feature-card admin-card">
              <div className="feature-icon">👨‍💼</div>
              <h3>For Admins</h3>
              <ul>
                <li>Verify hospitals</li>
                <li>Monitor system requests</li>
                <li>View analytics & reports</li>
                <li>Manage platform</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stat">
            <h3>1000+</h3>
            <p>Lives Saved</p>
          </div>
          <div className="stat">
            <h3>500+</h3>
            <p>Hospitals</p>
          </div>
          <div className="stat">
            <h3>50K+</h3>
            <p>Donors</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Save Lives?</h2>
          <div className="cta-buttons">
            <button onClick={() => handleNavigate('patient', 'login')} className="btn btn-primary">Patient Login</button>
            <button onClick={() => handleNavigate('hospital', 'login')} className="btn btn-secondary">Hospital Login</button>
            <button onClick={() => handleNavigate('admin', 'login')} className="btn btn-tertiary">Admin Login</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Real-Time Organ & Blood System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
