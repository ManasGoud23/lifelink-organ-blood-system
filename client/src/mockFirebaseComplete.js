import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// --- Auth State ---
let currentUser = null;
try {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    if (storedUser === 'undefined') {
      localStorage.removeItem('currentUser');
    } else {
      currentUser = JSON.parse(storedUser);
    }
  }
} catch (e) {
  console.error("Error parsing currentUser", e);
  localStorage.removeItem('currentUser');
}

export const mockAuth = {
  get currentUser() { return currentUser; },
  set currentUser(val) {
    currentUser = val;
    if (val) {
      localStorage.setItem('currentUser', JSON.stringify(val));
    } else {
      localStorage.removeItem('currentUser');
    }
  }
};

// --- API Implementation ---

export const mockCreateUser = async (phone, password, name, userType = 'patient', location = '') => {
  const response = await axios.post(`${API_URL}/register`, { phone, password, name, userType, location });
  const user = response.data;
  mockAuth.currentUser = user;
  return user;
};

export const mockUpdateUser = async (uid, updateData) => {
  const response = await axios.put(`${API_URL}/users/${uid}`, updateData);
  return response.data;
};

export const mockSignInUser = async (phone, password) => {
  const response = await axios.post(`${API_URL}/login`, { phone, password });
  const user = response.data;
  mockAuth.currentUser = user;
  return user;
};

export const mockSignOut = async () => {
  mockAuth.currentUser = null;
};

export const mockGetCurrentUser = () => mockAuth.currentUser;

export const mockGetUsers = async (userType) => {
  const response = await axios.get(`${API_URL}/users`, { params: { userType } });
  return response.data;
};

export const mockAddInventory = async (inventoryData) => {
  const response = await axios.post(`${API_URL}/inventory`, inventoryData);
  return response.data;
};

export const mockGetInventory = async (hospitalId) => {
  // If hospitalId is null, it might be a search. But we now have a search API!
  // However, PatientDashboard calls mockGetInventory(null) for search.
  // We'll keep this for simple inventory listing.
  const response = await axios.get(`${API_URL}/inventory`, { params: { hospitalId } });
  return response.data;
};

// SPECIAL SEARCH FUNCTION (Used by PatientDashboard)
// We'll hijack mockGetInventory when it's called with filters if we want, 
// but it's better to add a new function or update PatientDashboard.
// For now, let's add a bridge for the search logic.

export const mockSearchInventory = async (filters) => {
  const response = await axios.get(`${API_URL}/search`, { params: filters });
  return response.data;
};

export const mockAddRequest = async (requestData) => {
  const response = await axios.post(`${API_URL}/requests`, requestData);
  return response.data;
};

export const mockGetRequests = async (userId) => {
  // Determine if it's hospital or patient based on current user or param
  const params = {};
  if (currentUser) {
    if (currentUser.userType === 'hospital') params.hospitalId = currentUser.uid;
    else params.patientId = currentUser.uid;
  }
  const response = await axios.get(`${API_URL}/requests`, { params });
  return response.data;
};

export const mockGetAllRequests = async () => {
  const response = await axios.get(`${API_URL}/requests`);
  return response.data;
};

export const mockUpdateRequest = async (requestId, updateData) => {
  const response = await axios.put(`${API_URL}/requests/${requestId}`, updateData);
  return response.data;
};

// Keep empty stubs for donor functions if needed
export const mockAddDonor = async () => { };
export const mockGetDonors = async () => [];
export const mockGetDonorsByHospital = async () => [];
export const mockUpdateDonor = async () => { };
export const mockDeleteDonor = async () => { };
export const seedHospitals = async () => { }; // Seeded by backend now
