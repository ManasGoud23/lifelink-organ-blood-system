// Mock Firebase for testing - replace with real Firebase credentials later
// This allows us to test the UI without needing real Firebase

let mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
let mockDonors = JSON.parse(localStorage.getItem('mockDonors')) || [];
let currentUser = null;

// Mock auth
export const mockAuth = {
  currentUser: null,
};

// Mock user functions
export const mockCreateUser = async (phone, password, name) => {
  const user = {
    uid: Math.random().toString(36).substr(2, 9),
    phone,
    password,
    name,
    email: `${phone}@organ-donation.app`,
  };
  mockUsers.push(user);
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  currentUser = user;
  mockAuth.currentUser = user;
  return user;
};

export const mockSignInUser = async (phone, password) => {
  const user = mockUsers.find(
    (u) => u.phone === phone && u.password === password
  );
  if (!user) {
    throw new Error('Phone number or password is incorrect');
  }
  currentUser = user;
  mockAuth.currentUser = user;
  return user;
};

export const mockSignOut = async () => {
  currentUser = null;
  mockAuth.currentUser = null;
};

export const mockGetCurrentUser = () => currentUser;

// Mock Firestore functions
export const mockAddDonor = async (donorData) => {
  const donor = {
    id: Math.random().toString(36).substr(2, 9),
    ...donorData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockDonors.push(donor);
  localStorage.setItem('mockDonors', JSON.stringify(mockDonors));
  return donor;
};

export const mockGetDonors = async (userId) => {
  return mockDonors.filter((d) => d.userId === userId);
};

export const mockUpdateDonor = async (donorId, donorData) => {
  const index = mockDonors.findIndex((d) => d.id === donorId);
  if (index >= 0) {
    mockDonors[index] = {
      ...mockDonors[index],
      ...donorData,
      updatedAt: new Date(),
    };
    localStorage.setItem('mockDonors', JSON.stringify(mockDonors));
  }
  return mockDonors[index];
};

export const mockDeleteDonor = async (donorId) => {
  mockDonors = mockDonors.filter((d) => d.id !== donorId);
  localStorage.setItem('mockDonors', JSON.stringify(mockDonors));
};
