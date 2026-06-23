# 🩸 Real-Time Organ & Blood Donation System - Testing Guide

## Overview
This document provides step-by-step instructions to test all features of the complete 3-tier organ and blood donation system.

**Access URL:** `http://localhost:3002`

---

## System Architecture

### Three User Roles:
1. **👤 Patient** (Red #e74c3c) - Search blood/organs, raise requests
2. **🏥 Hospital** (Green #27ae60) - Manage inventory, process requests  
3. **👨‍💼 Admin** (Orange #f39c12) - Monitor system, view analytics

### Data Storage:
- **localStorage-based mock Firebase** for development/testing
- Collections: mockUsers, mockDonors, mockRequests, mockInventory
- **Demo Mode:** No real credentials needed, data persists across sessions

---

## Test Scenario 1: Patient Registration & Search

### Step 1: Register as Patient
1. Open http://localhost:3002
2. Click **"I'm a Patient"** on home page
3. Click **"Register"** tab
4. Fill in details:
   - **Name:** John Doe
   - **Phone:** 9876543210
   - **Password:** password123
   - **Confirm Password:** password123
   - **User Type:** Patient (default)
5. Click **"Register"**

**Expected Result:** 
- ✅ User registered successfully
- ✅ Redirected to Patient Dashboard
- ✅ Navbar shows "👤 Patient - John Doe"

---

### Step 2: Search for Blood
1. On Patient Dashboard, look for **Search Blood** section
2. Select blood type: **O+**
3. Click **"Search Blood"**

**Expected Result:**
- ✅ Available blood donors/inventory displayed
- ✅ Shows: Blood Type, Hospital/Donor Name, Quantity, Emergency Request button
- ✅ If no results, message shows "No donors found"

---

### Step 3: Raise Emergency Request
1. Click **"Emergency Request"** on any available blood entry
2. Confirm the request

**Expected Result:**
- ✅ Request created successfully
- ✅ Request appears in "Your Requests" section
- ✅ Status shows: **PENDING**
- ✅ Shows request date and blood type

---

### Step 4: Search for Organs
1. Go back to search section
2. Select organ type: **Kidney**
3. Click **"Search Organs"**

**Expected Result:**
- ✅ Available organs displayed with details
- ✅ Can raise emergency request for organs too

---

## Test Scenario 2: Hospital Operations

### Step 1: Register as Hospital
1. Open home page or logout from patient account
2. Click **"I'm a Hospital"** 
3. Click **"Register"** tab
4. Fill in details:
   - **Name:** City Hospital
   - **Phone:** 9988776655
   - **Password:** hospital123
   - **Confirm Password:** hospital123
   - **User Type:** Hospital (from dropdown)
5. Click **"Register"**

**Expected Result:**
- ✅ Hospital registered successfully
- ✅ Redirected to Hospital Dashboard
- ✅ Navbar shows "🏥 Hospital - City Hospital"

---

### Step 2: Add Blood Inventory
1. On Hospital Dashboard, find **"Add Blood Inventory"** section
2. Fill in details:
   - **Blood Type:** O+
   - **Quantity:** 50
   - **Expiry Date:** 2025-12-31
3. Click **"Add to Inventory"**

**Expected Result:**
- ✅ Blood added to inventory
- ✅ Appears in "Hospital Inventory" section
- ✅ Shows: Blood Type, Quantity, Expiry Date

---

### Step 3: Add Organ Inventory
1. Find **"Add Organ Inventory"** section
2. Fill in details:
   - **Organ Type:** Kidney
   - **Quantity:** 3
   - **Expiry Date:** 2025-12-15
3. Click **"Add to Inventory"**

**Expected Result:**
- ✅ Organ added to inventory
- ✅ Displays in inventory list

---

### Step 4: View Pending Requests
1. Scroll to **"Pending Patient Requests"** section
2. Look for patient requests (if patient from Step 1 raised a request)

**Expected Result:**
- ✅ Shows patient's request details
- ✅ Displays: Patient Name, Request Type, Blood/Organ Type, Status (PENDING)
- ✅ Has "Approve" and "Reject" buttons

---

### Step 5: Approve Patient Request
1. If a pending request exists, click **"Approve"**
2. Confirm action

**Expected Result:**
- ✅ Request status changes to **ACCEPTED**
- ✅ Request moves from "Pending" to "Approved" list
- ✅ Patient dashboard reflects this change (if refreshed)

---

## Test Scenario 3: Admin Dashboard

### Step 1: Register as Admin
1. Return to home page or logout
2. Look for admin login option (or manually navigate)
3. Click **"Admin Login"**
4. Click **"Register"** tab
5. Fill in details:
   - **Name:** Admin User
   - **Phone:** 9111111111
   - **Password:** admin123
   - **Confirm Password:** admin123
   - **User Type:** Admin (from dropdown)
6. Click **"Register"**

**Expected Result:**
- ✅ Admin account created
- ✅ Redirected to Admin Dashboard
- ✅ Navbar shows "👨‍💼 Admin - Admin User"

---

### Step 2: View System Statistics
1. On Admin Dashboard, look for **"System Statistics"** section
2. Observe displayed metrics:
   - **Total Requests:** Should show count of all requests
   - **Pending Requests:** Requests not yet approved/rejected
   - **Approved Requests:** Approved requests count
   - **Total Inventory:** Total items across all hospitals

**Expected Result:**
- ✅ All stats display correct numbers
- ✅ Stats update in real-time
- ✅ Dashboard refreshes every 30 seconds

---

### Step 3: Monitor All Requests
1. Look for **"All System Requests"** table
2. Observe columns: Patient, Type, Blood/Organ, Status, Date

**Expected Result:**
- ✅ Table shows all requests from all patients
- ✅ Displays correct status (PENDING, ACCEPTED, REJECTED)
- ✅ Shows all request details

---

### Step 4: View Inventory Across Hospitals
1. Find **"Hospital Inventory Levels"** section
2. See inventory from all registered hospitals

**Expected Result:**
- ✅ Shows all hospital inventories consolidated
- ✅ Displays: Hospital Name, Blood Type, Quantity, Expiry Date
- ✅ Organ inventory also shown

---

### Step 5: View Registered Hospitals
1. Look for **"Registered Hospitals"** section
2. See list of all hospital accounts

**Expected Result:**
- ✅ Lists all hospitals that registered
- ✅ Shows hospital names
- ✅ Count matches total hospitals registered

---

## Test Scenario 4: Real-time Synchronization

### Step 1: Multi-Browser Testing
1. **Browser 1:** Login as Patient
2. **Browser 2:** Login as Hospital
3. On Hospital: Add new blood inventory (O+, 100 units)

**Expected Result:**
- ✅ On Patient browser: New inventory immediately appears in search results
- ✅ No manual refresh needed
- ✅ Real-time sync via localStorage

---

### Step 2: Request Status Update
1. **Patient browser:** Raise new emergency request
2. **Hospital browser:** View pending requests - request appears immediately

**Expected Result:**
- ✅ Hospital sees new request in real-time
- ✅ Hospital can approve/reject
- ✅ Patient sees status update when approved

---

### Step 3: Admin Real-time Monitoring
1. **Admin browser:** Open Admin Dashboard
2. **Patient browser:** Raise new request
3. **Admin browser:** Stats should update (auto-refresh every 30s or manual refresh)

**Expected Result:**
- ✅ Admin sees new request in request table
- ✅ Total requests count increases
- ✅ All dashboards stay in sync

---

## Test Scenario 5: Authentication & Session Management

### Step 1: Login Test
1. Logout from any dashboard (click logout button in navbar)
2. Go back to home page
3. Enter credentials of registered user
4. Click **"Login"**

**Expected Result:**
- ✅ User logs in successfully
- ✅ Correct dashboard appears based on user type
- ✅ Session persists (even if page refreshes)

---

### Step 2: Data Persistence
1. Register and add some data (patient requests, hospital inventory)
2. Close browser completely
3. Reopen http://localhost:3002
4. Login again

**Expected Result:**
- ✅ All data persists
- ✅ Requests still visible
- ✅ Inventory still in localStorage

---

### Step 3: Logout & Login Different Role
1. Logout from one role (e.g., Patient)
2. Login as different role (e.g., Hospital)

**Expected Result:**
- ✅ Correct dashboard loads
- ✅ Role-specific features available
- ✅ No data mix-up between roles

---

## Test Scenario 6: Error Handling

### Step 1: Invalid Credentials
1. Logout
2. Click "Register" or "Login"
3. Try logging in with wrong password

**Expected Result:**
- ✅ Error message appears: "Phone number or password is incorrect"
- ✅ Login form clears
- ✅ User can retry

---

### Step 2: Validation Errors
1. On registration:
   - Try submitting with empty fields
   - Try password less than 6 characters
   - Try mismatched passwords

**Expected Result:**
- ✅ Appropriate error messages shown
- ✅ Form doesn't submit with invalid data

---

### Step 3: Phone Number Format
1. On registration phone field
2. Try entering non-numeric characters

**Expected Result:**
- ✅ Only numeric input allowed
- ✅ Phone number limited to 10 digits

---

## Feature Verification Checklist

### Patient Features
- [ ] Register as patient with phone authentication
- [ ] Search blood availability by type
- [ ] Search organ availability by type
- [ ] Raise emergency blood requests
- [ ] Raise emergency organ requests
- [ ] View request history with status
- [ ] See request dates and blood/organ types
- [ ] Logout and re-login without data loss

### Hospital Features
- [ ] Register as hospital with phone authentication
- [ ] Add blood inventory (type, quantity, expiry)
- [ ] Add organ inventory (type, quantity, expiry)
- [ ] View pending patient requests
- [ ] Approve patient requests
- [ ] Reject patient requests
- [ ] Request status updates to patient
- [ ] Inventory updates visible to patients

### Admin Features
- [ ] Register as admin with phone authentication
- [ ] View system-wide statistics
- [ ] Monitor all patient requests
- [ ] Monitor inventory across hospitals
- [ ] View hospital list
- [ ] See request status breakdown
- [ ] Dashboard auto-refreshes every 30 seconds
- [ ] Real-time updates without manual refresh

### Cross-cutting Features
- [ ] Phone-based authentication (not email)
- [ ] User type selection during registration
- [ ] Navbar displays user role with icon
- [ ] Logout functionality works
- [ ] Data persists in localStorage
- [ ] Multi-user sync via localStorage
- [ ] No sensitive data exposed in console
- [ ] Responsive design on different screen sizes

---

## Troubleshooting

### Issue: App not loading
- **Solution:** Clear browser cache, refresh at http://localhost:3002
- Check terminal: Should show "webpack compiled successfully"

### Issue: Data not persisting
- **Solution:** Check browser localStorage (F12 > Application > LocalStorage)
- Ensure mockUsers, mockDonors, mockRequests, mockInventory collections exist

### Issue: Request not appearing on other browser
- **Solution:** Refresh the page or wait for 30-second auto-refresh
- Check both users are logged in correctly

### Issue: Inventory not found in search
- **Solution:** Ensure hospital has added inventory first
- Search must match exact blood type (e.g., "O+" not "O plus")

---

## Performance Notes

- **Startup:** ~3-5 seconds for first load
- **Search:** Instant (localStorage is fast)
- **Request Creation:** < 1 second
- **Admin Refresh:** Every 30 seconds (auto)

---

## Production Deployment Notes

To transition from mock Firebase to real Firebase:

1. Get Firebase credentials from Firebase Console
2. Replace `mockFirebaseComplete.js` with real Firestore functions
3. Update imports in all dashboard components
4. Add Cloud Functions for auto-expiry tracking
5. Enable real-time listeners with Firestore
6. Implement proper security rules

---

## Test Data Summary

| User Type | Phone | Password | Name |
|-----------|-------|----------|------|
| Patient | 9876543210 | password123 | John Doe |
| Hospital | 9988776655 | hospital123 | City Hospital |
| Admin | 9111111111 | admin123 | Admin User |

---

**Last Updated:** November 21, 2025
**Status:** ✅ Ready for Testing
