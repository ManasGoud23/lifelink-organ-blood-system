import React, { useState, useEffect, useCallback } from 'react';
import {
  mockGetRequests,
  mockGetInventory,
  mockGetUsers,
  mockUpdateRequest, // Import update function
  mockUpdateUser, // New import
} from '../mockFirebaseComplete';
import './AdminDashboard.css';

function AdminDashboard({ user }) {
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    totalInventory: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const [reqData, invData, usersData] = await Promise.all([
        mockGetRequests(),
        mockGetInventory(),
        mockGetUsers('hospital'),
      ]);

      setRequests(reqData);
      setInventory(invData);
      setHospitals(usersData);

      setStats({
        totalRequests: reqData.length,
        pendingRequests: reqData.filter((r) => r.status === 'PENDING').length,
        approvedRequests: reqData.filter((r) => r.status === 'ACCEPTED').length,
        totalInventory: invData.reduce((sum, item) => sum + item.quantity, 0),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await mockUpdateRequest(requestId, { status: newStatus });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleApproveHospital = async (hospitalId) => {
    try {
      await mockUpdateUser(hospitalId, { status: 'verified' });
      alert('Hospital approved successfully!');
      fetchData();
    } catch (error) {
      console.error('Error approving hospital:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>👨‍💼 Admin Dashboard</h1>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {/* Demo Data Initialization Button */}
          <button
            onClick={async () => {
              const { seedHospitals } = await import('../mockFirebaseComplete');
              await seedHospitals();
              alert('Demo data initialized! 20 verified hospitals added.');
              fetchData();
            }}
            style={{ padding: '10px 20px', background: '#9b59b6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            🌱 Initialize Demo Data
          </button>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <h3>{stats.totalRequests}</h3>
            <p>Total Requests</p>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <h3>{stats.pendingRequests}</h3>
            <p>Pending Requests</p>
          </div>
          <div className="stat-card approved">
            <div className="stat-icon">✓</div>
            <h3>{stats.approvedRequests}</h3>
            <p>Approved Requests</p>
          </div>
          <div className="stat-card inventory">
            <div className="stat-icon">📦</div>
            <h3>{stats.totalInventory}</h3>
            <p>Total Inventory</p>
          </div>
        </div>

        <div className="content-grid">
          {/* Requests Monitor */}
          <div className="section">
            <h2>All Requests Monitor</h2>
            <div className="table-wrapper">
              {requests.length === 0 ? (
                <p className="empty">No requests</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Type</th>
                      <th>Blood</th>
                      <th>Status</th>
                      <th>Action</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.patientName}</td>
                        <td>{req.organType || 'Blood'}</td>
                        <td>{req.bloodType}</td>
                        <td>
                          <span className={`status status-${req.status.toLowerCase()}`}>
                            {req.status}
                          </span>
                        </td>
                        <td>
                          {req.status === 'pending_admin' && (
                            <div className="action-buttons">
                              <button
                                className="approve-btn"
                                onClick={() => handleUpdateStatus(req.id, 'APPROVED_PAYMENT')}
                                style={{ marginRight: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Approve
                              </button>
                              <button
                                className="reject-btn"
                                onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                                style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                        <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Inventory Monitor */}
          <div className="section">
            <h2>Inventory Levels</h2>
            <div className="table-wrapper">
              {inventory.length === 0 ? (
                <p className="empty">No inventory</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Hospital</th>
                      <th>Type</th>
                      <th>Qty</th>
                      <th>Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id}>
                        <td>{item.hospitalName}</td>
                        <td>{item.bloodType} {item.organType ? `- ${item.organType}` : ''}</td>
                        <td>
                          <span className="qty">{item.quantity}</span>
                        </td>
                        <td>{item.expiryDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Hospitals Management */}
          <div className="section full-width">
            <h2>Registered Hospitals ({hospitals.length})</h2>
            <div className="hospitals-grid">
              {hospitals.length === 0 ? (
                <p className="empty">No hospitals registered</p>
              ) : (
                hospitals.map((hospital) => (
                  <div key={hospital.id} className="hospital-card">
                    <h4>{hospital.name}</h4>
                    <p>
                      <strong>Phone:</strong> {hospital.phone}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      {hospital.status === 'verified' ? (
                        <span className="badge verified">✓ Verified</span>
                      ) : (
                        <span className="badge pending">⏳ Pending</span>
                      )}
                    </p>
                    {hospital.status !== 'verified' && (
                      <button
                        onClick={() => handleApproveHospital(hospital.uid)}
                        className="approve-btn"
                        style={{ marginTop: '10px', width: '100%', padding: '8px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        ✅ Approve Hospital
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
