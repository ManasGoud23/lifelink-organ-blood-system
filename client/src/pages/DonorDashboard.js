import React, { useState, useEffect } from 'react';
import { mockAddDonor, mockGetUsers, mockGetDonors } from '../mockFirebaseComplete';
import './LegacyDashboard.css'; // Reuse dashboard styles

function DonorDashboard({ user }) {
    const [bloodType, setBloodType] = useState('');
    const [organType, setOrganType] = useState('');
    const [selectedHospital, setSelectedHospital] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [myDonations, setMyDonations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch hospitals for dropdown
        const loadHospitals = async () => {
            const hospitalList = await mockGetUsers('hospital');
            setHospitals(hospitalList);
        };
        loadHospitals();

        // Fetch my existing donations
        const loadDonations = async () => {
            const donations = await mockGetDonors(user.uid);
            setMyDonations(donations);
        };
        loadDonations();
    }, [user.uid]);

    const handleRegisterDonor = async (e) => {
        e.preventDefault();
        if (!selectedHospital) {
            alert('Please select a hospital to donate to.');
            return;
        }

        setLoading(true);
        const hospitalObj = hospitals.find(h => h.id === selectedHospital);
        try {
            await mockAddDonor({
                userId: user.uid,
                name: user.name,
                phone: user.phone,
                bloodType,
                organType,
                hospitalId: selectedHospital,
                hospitalLocation: hospitalObj ? hospitalObj.location : '', // Save hospital location
                location: user.location, // User's location
                status: 'pending', // Pending verification
            });
            alert('Registered successfully! Waiting for hospital verification.');

            // Refresh list
            const donations = await mockGetDonors(user.uid);
            setMyDonations(donations);

            // Reset form
            setBloodType('');
            setOrganType('');
            setSelectedHospital('');
        } catch (error) {
            console.error('Error registering donor:', error);
            alert('Failed to register.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="container">
                <h1>❤️ Donor Dashboard</h1>

                <div className="dashboard-grid">
                    <div className="section">
                        <h2>Register as Donor</h2>
                        <form onSubmit={handleRegisterDonor}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" value={user.name} disabled />
                            </div>

                            <div className="form-group">
                                <label>Blood Type *</label>
                                <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} required>
                                    <option value="">Select Blood Type</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Organ Type</label>
                                <select value={organType} onChange={(e) => setOrganType(e.target.value)} required>
                                    <option value="">Select Organ Type</option>
                                    <option value="Blood">Blood</option>
                                    <option value="Kidney">Kidney</option>
                                    <option value="Liver">Liver</option>
                                    <option value="Heart">Heart</option>
                                    <option value="Lungs">Lungs</option>
                                    <option value="Eyes">Eyes</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Select Hospital to Donate *</label>
                                <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)} required>
                                    <option value="">Select Hospital</option>
                                    {hospitals.map(h => (
                                        <option key={h.id} value={h.id}>
                                            {h.name} ({h.location})
                                        </option>
                                    ))}
                                </select>
                                <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                                    You must visit this hospital for verification.
                                </small>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                                {loading ? 'Registering...' : 'Register Donor'}
                            </button>
                        </form>
                    </div>

                    <div className="section">
                        <h2>My Registrations</h2>
                        {myDonations.length === 0 ? (
                            <p>No registrations yet.</p>
                        ) : (
                            <div className="donations-list">
                                {myDonations.map(d => (
                                    <div key={d.id} className="card" style={{ padding: '15px', marginBottom: '10px', borderLeft: d.status === 'verified' ? '4px solid green' : '4px solid orange' }}>
                                        <h3>{d.organType} Donation</h3>
                                        <p><strong>Blood:</strong> {d.bloodType}</p>
                                        <p><strong>Hospital:</strong> {hospitals.find(h => h.id === d.hospitalId)?.name || 'Unknown'}</p>
                                        <p>
                                            <strong>Status: </strong>
                                            <span style={{
                                                padding: '3px 8px',
                                                borderRadius: '10px',
                                                background: d.status === 'verified' ? '#d4edda' : '#fff3cd',
                                                color: d.status === 'verified' ? '#155724' : '#856404',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {d.status ? d.status.toUpperCase() : 'PENDING'}
                                            </span>
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#999' }}>Registered: {new Date(d.createdAt).toLocaleDateString()}</p>
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

export default DonorDashboard;
