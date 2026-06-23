import React, { useState, useEffect, useCallback } from 'react';
import {
  mockAddRequest,
  mockGetRequests,
  mockUpdateRequest,
  mockGetInventory,
  mockGetUsers,
  mockSearchInventory,
} from '../mockFirebaseComplete';
import './PatientDashboard.css';

function PatientDashboard({ user }) {
  const [bloodType, setBloodType] = useState('');
  const [organType, setOrganType] = useState('');
  const [searchLocation, setSearchLocation] = useState(''); // New location state
  const [availableDonors, setAvailableDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [verifiedHospitals, setVerifiedHospitals] = useState([]); // New state
  const [loading, setLoading] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const organTypes = [
    'Heart',
    'Liver',
    'Kidney',
    'Pancreas',
    'Lung',
    'Blood',
    'Multiple',
  ];

  const fetchRequests = useCallback(async () => {
    try {
      const userRequests = await mockGetRequests(user.uid);
      setRequests(userRequests);

      // Also fetch verified hospitals
      const allHospitals = await mockGetUsers('hospital');
      setVerifiedHospitals(allHospitals.filter(h => h.status === 'verified'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [user.uid]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchDone(false);
    try {
      // Use the new backend search with specific location logic
      const results = await mockSearchInventory({
        bloodType,
        organType,
        location: searchLocation
      });

      setAvailableDonors(results);
      setSearchDone(true);
    } catch (error) {
      console.error("Error searching inventory:", error);
      alert("Search failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseRequest = async (inventoryItemId) => {
    try {
      // Find the inventory item details to include in request
      const item = availableDonors.find(d => d.id === inventoryItemId);

      await mockAddRequest({
        patientId: user.uid,
        patientName: user.name,
        patientPhone: user.phone,
        patientLocation: user.location || searchLocation, // Add location to request
        donorId: inventoryItemId, // This is the inventory item ID
        hospitalId: item.hospitalId, // vital for hospital dashboard filter
        bloodType: item.bloodType,
        organType: item.organType,
        requestType: 'EMERGENCY',
        status: 'PENDING',
        createdAt: new Date(),
      });

      alert('Emergency request raised! Hospital will be notified.');
      fetchRequests();
    } catch (error) {
      console.error('Error raising request:', error);
      alert('Failed to raise request');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      setLoading(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      await mockUpdateRequest(selectedRequest.id, {
        status: 'PAID',
        paymentDetails: {
          method: paymentMethod,
          amount: 5000, // Dummy amount
          date: new Date()
        }
      });

      alert('Payment successful! Request forwarded to hospital.');
      setShowPaymentModal(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-dashboard">
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>💳 Secure Payment</h2>
            <p>Amount to Pay: <strong>₹5,000</strong></p>
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>Select Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI (GPay/PhonePe)</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="pay-btn" disabled={loading}>
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="container">
        <h1>👤 Patient Dashboard</h1>

        <div className="dashboard-grid">
          {/* Search Section */}
          <div className="search-section">
            <h2>Search Blood & Organ Availability</h2>
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-group">
                <label htmlFor="blood">Blood Type</label>
                <select
                  id="blood"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                >
                  <option value="">All Blood Types</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="organ">Organ Type</label>
                <select
                  id="organ"
                  value={organType}
                  onChange={(e) => setOrganType(e.target.value)}
                >
                  <option value="">All Organ Types</option>
                  {organTypes.map((organ) => (
                    <option key={organ} value={organ}>
                      {organ}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  placeholder="Enter City/Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search Availability'}
              </button>
            </form>

            {searchDone && (
              <div className="results">
                {availableDonors.length === 0 ? (
                  <p className="no-results">No hospitals found with available stock matching your criteria.</p>
                ) : (
                  <div className="donors-grid">
                    {availableDonors.map((item) => (
                      <div key={item.id} className="donor-item">
                        <h4>🏥 {item.hospitalName}</h4>
                        <p>
                          <strong>Available:</strong> {item.bloodType} {item.organType ? `(${item.organType})` : ''}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {item.quantity} units
                        </p>
                        <p>
                          <strong>Location:</strong> {item.location}
                        </p>
                        <button
                          onClick={() => handleRaiseRequest(item.id)}
                          className="request-btn"
                        >
                          📢 Request from Hospital
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Requests Section - Only show if there are requests */}
          {requests.length > 0 && (
            <div className="requests-section">
              <h2>My Requests</h2>
              <div className="requests-list">
                {requests.map((req) => (
                  <div key={req.id} className="request-card">
                    <div className="request-header">
                      <h4>{req.organType || 'Blood'}</h4>
                      <span className={`status status-${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </div>
                    <p>
                      <strong>Blood Type:</strong> {req.bloodType}
                    </p>
                    <p>
                      <strong>Request Type:</strong> {req.requestType}
                    </p>
                    <p className="date">
                      <strong>Requested:</strong>{' '}
                      {new Date(req.createdAt).toLocaleString()}
                    </p>
                    {req.status === 'APPROVED_PAYMENT' && (
                      <button
                        className="pay-now-btn"
                        onClick={() => {
                          setSelectedRequest(req);
                          setShowPaymentModal(true);
                        }}
                      >
                        💳 Pay Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partner Hospitals Section */}
          <div className="hospitals-section full-width" style={{ marginTop: '20px', gridColumn: '1 / -1' }}>
            <h2>🏥 Partner Hospitals</h2>
            {verifiedHospitals.length === 0 ? (
              <p className="no-results">No verified hospitals yet.</p>
            ) : (
              <div className="donors-grid">
                {verifiedHospitals.map(hospital => (
                  <div key={hospital.uid} className="donor-item hospital-card-view">
                    <h4>{hospital.name}</h4>
                    <p>📍 {hospital.location}</p>
                    <p>📞 {hospital.phone}</p>
                    <span className="badge verified">✓ Verified Partner</span>
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

export default PatientDashboard;
