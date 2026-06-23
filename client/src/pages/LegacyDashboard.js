import React, { useState, useEffect, useCallback } from 'react';
import {
  mockAddDonor,
  mockGetDonors,
  mockDeleteDonor,
  mockUpdateDonor,
} from '../mockFirebase';
import './LegacyDashboard.css';

function Dashboard({ user }) {
  const [donors, setDonors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    bloodType: 'O+',
    organType: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    try {
      const donorsList = await mockGetDonors(user.uid);
      setDonors(donorsList);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    if (user) {
      fetchDonors();
    }
  }, [user, fetchDonors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update existing donor
        await mockUpdateDonor(editingId, formData);
        setEditingId(null);
      } else {
        // Add new donor
        await mockAddDonor({
          ...formData,
          userId: user.uid,
        });
      }

      setFormData({
        name: '',
        bloodType: 'O+',
        organType: '',
        phoneNumber: '',
      });

      fetchDonors();
    } catch (error) {
      console.error('Error saving donor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (donor) => {
    setFormData({
      name: donor.name,
      bloodType: donor.bloodType,
      organType: donor.organType,
      phoneNumber: donor.phoneNumber,
    });
    setEditingId(donor.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        await mockDeleteDonor(id);
        fetchDonors();
      } catch (error) {
        console.error('Error deleting donor:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      bloodType: 'O+',
      organType: '',
      phoneNumber: '',
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>Donor Registration & Management</h1>

        <div className="dashboard-content">
          {/* Form Section */}
          <div className="form-section">
            <h2>{editingId ? 'Edit Donor' : 'Register New Donor'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodType">Blood Type *</label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                  >
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="organType">Organ Type</label>
                  <select
                    id="organType"
                    name="organType"
                    value={formData.organType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Organ Type</option>
                    {organTypes.map((organ) => (
                      <option key={organ} value={organ}>
                        {organ}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="button-group">
                <button type="submit" disabled={loading}>
                  {loading
                    ? 'Processing...'
                    : editingId
                      ? 'Update Donor'
                      : 'Register Donor'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Donors List Section */}
          <div className="donors-section">
            <h2>Registered Donors ({donors.length})</h2>
            {loading && <p className="loading-text">Loading...</p>}
            {donors.length === 0 && !loading && (
              <p className="empty-state">No donors registered yet.</p>
            )}
            {donors.length > 0 && (
              <div className="donors-list">
                {donors.map((donor) => (
                  <div key={donor.id} className="donor-card">
                    <div className="donor-info">
                      <h3>{donor.name}</h3>
                      <p>
                        <strong>Blood Type:</strong> {donor.bloodType}
                      </p>
                      {donor.organType && (
                        <p>
                          <strong>Organ Type:</strong> {donor.organType}
                        </p>
                      )}
                      {donor.phoneNumber && (
                        <p>
                          <strong>Phone:</strong> {donor.phoneNumber}
                        </p>
                      )}
                      {donor.createdAt && (
                        <p className="date">
                          <strong>Registered:</strong>{' '}
                          {donor.createdAt instanceof Date
                            ? donor.createdAt.toLocaleDateString()
                            : new Date(donor.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="donor-actions">
                      <button
                        onClick={() => handleEdit(donor)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(donor.id)}
                        className="delete-btn"
                      >
                        Delete
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

export default Dashboard;
