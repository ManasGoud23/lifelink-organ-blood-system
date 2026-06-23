import React, { useState, useEffect } from 'react';
import {
  mockGetRequests,
  mockUpdateRequest,
  mockAddInventory,
  mockGetInventory,
} from '../mockFirebaseComplete';
import './HospitalDashboard.css';

function HospitalDashboard({ user }) {
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inventoryForm, setInventoryForm] = useState({
    bloodType: 'O+',
    quantity: '',
    expiryDate: '',
    organType: '',
  });

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const organTypes = [
    'Heart',
    'Liver',
    'Kidney',
    'Pancreas',
    'Lung',
    'Blood',
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const inventoryData = await mockGetInventory(user.uid);
        setInventory(inventoryData);

        const requestsData = await mockGetRequests();
        // Show all requests for this hospital (not just PENDING) so they can "re-approve" or manage them
        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();

    // Poll every 5 seconds to keep data fresh
    const interval = setInterval(fetchDashboardData, 5000);

    return () => clearInterval(interval);
  }, [user.uid]);

  const handleInventoryChange = (e) => {
    const { name, value } = e.target;
    setInventoryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await mockAddInventory({
        hospitalId: user.uid,
        hospitalName: user.name,
        ...inventoryForm,
        quantity: parseInt(inventoryForm.quantity),
        addedAt: new Date(),
      });

      setInventoryForm({
        bloodType: 'O+',
        quantity: '',
        expiryDate: '',
        organType: '',
      });

      alert('Inventory updated successfully!');
      // fetchData(); // Removed as real-time listener handles update
    } catch (error) {
      console.error('Error adding inventory:', error);
      alert('Failed to update inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await mockUpdateRequest(requestId, { status: 'APPROVED' });
      alert('Request Approved! Patient will see this in their dashboard.');
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await mockUpdateRequest(requestId, { status: 'REJECTED' });
      alert('Request rejected.');
      // fetchData(); // Removed as real-time listener handles update
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <div className="hospital-dashboard">
      <div className="container">
        <h1>🏥 Hospital Dashboard</h1>

        <div className="dashboard-grid">
          {/* Inventory Section */}
          <div className="inventory-section">
            <h2>Manage Inventory</h2>
            <form onSubmit={handleAddInventory} className="inventory-form">
              <div className="form-group">
                <label htmlFor="bloodType">Blood Type</label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={inventoryForm.bloodType}
                  onChange={handleInventoryChange}
                >
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="organType">Organ Type (Optional)</label>
                <select
                  id="organType"
                  name="organType"
                  value={inventoryForm.organType}
                  onChange={handleInventoryChange}
                >
                  <option value="">None</option>
                  {organTypes.map((organ) => (
                    <option key={organ} value={organ}>
                      {organ}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  value={inventoryForm.quantity}
                  onChange={handleInventoryChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  id="expiryDate"
                  type="date"
                  name="expiryDate"
                  value={inventoryForm.expiryDate}
                  onChange={handleInventoryChange}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Inventory'}
              </button>
            </form>

            <div className="inventory-list">
              <h3>Current Inventory ({inventory.length})</h3>
              {inventory.length === 0 ? (
                <p className="empty">No inventory items</p>
              ) : (
                <div className="items">
                  {inventory.map((item) => (
                    <div key={item.id} className="inventory-item">
                      <div>
                        <h4>{item.bloodType} {item.organType ? `- ${item.organType}` : ''}</h4>
                        <p>
                          <strong>Qty:</strong> {item.quantity}
                        </p>
                        <p>
                          <strong>Expires:</strong> {item.expiryDate}
                        </p>
                      </div>
                      <div className="qty-badge">{item.quantity}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Requests Section */}
          <div className="requests-section">
            <h2>Patient Requests</h2>
            {requests.length === 0 ? (
              <p className="empty">No pending requests</p>
            ) : (
              <div className="requests-list">
                {requests.map((req) => (
                  <div key={req.id} className="request-card">
                    <div className="request-info">
                      <h4>
                        {req.organType ? `${req.organType} Needed` : 'Blood Needed'}
                      </h4>
                      <p>
                        <strong>Blood Type:</strong> {req.bloodType}
                      </p>
                      <p>
                        <strong>Patient:</strong> {req.patientName}
                      </p>
                      <p>
                        <strong>Patient Location:</strong> {req.patientLocation || 'Unknown'}
                      </p>
                      <p>
                        <strong>Phone:</strong> {req.patientPhone}
                      </p>
                      <p>
                        <strong>Type:</strong> {req.requestType}
                      </p>
                      <p className="date">
                        {new Date(req.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="request-actions">
                      <button
                        onClick={() => handleApproveRequest(req.id)}
                        className="btn-approve"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="btn-reject"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalDashboard;
