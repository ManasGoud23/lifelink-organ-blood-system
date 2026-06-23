# 🏥 LifeLink: Real-Time Organ & Blood Availability System 🩸

[![Production-Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg?style=for-the-badge)]()
[![React Version](https://img.shields.io/badge/React-18.2.0-blue.svg?logo=react&style=for-the-badge)]()
[![Node.js Version](https://img.shields.io/badge/Node.js-18+-green.svg?logo=node.js&style=for-the-badge)]()
[![Database](https://img.shields.io/badge/Database-SQLite%20%2F%20Sequelize-orange.svg?logo=sqlite&style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)]()

> **LifeLink** is a comprehensive, modern, real-time healthcare coordinator bridging the gap between Patients in urgent need, registered Hospitals with active inventory, and System Administrators ensuring smooth operations. 

---

## 🎯 Quick Navigation
- [✨ Key Features](#-key-features)
- [💻 Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [🔐 Test Credentials](#-test-credentials)
- [🔄 Architecture & Real-Time Sync](#-architecture--real-time-sync)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

### 👤 Patient Module
- **Secure Authentication:** Quick signup and secure phone/password login.
- **Real-Time Inventory Search:** Query available blood types or organ types instantly.
- **Emergency Requests:** Raise urgent requests with location and specifications.
- **Request Tracking:** Real-time progress monitoring of request statuses (Pending, Approved, Rejected).

### 🏥 Hospital Module
- **Inventory Management:** Live dashboards to add, modify, or delete blood stocks and organ availability.
- **Request Resolution:** View and process incoming patient requests with single-click approval or rejection.
- **Stats Dashboard:** Instantly track active listings, total pending requests, and inventory ratios.

### 👨‍💼 Admin Module
- **System Overview:** Visual telemetry on total users, hospitals, pending requests, and matches.
- **Hospital Registry:** Manage, approve, or review registered hospitals.
- **Global Inventory Control:** Full visibility and tracking across all institutions.
- **Audit Logs:** Monitor real-time logs of system operations.

---

## 💻 Tech Stack

### Frontend (Client)
*   **React.js 18.2.0** — Single Page Application structure.
*   **Vanilla CSS3** — Fully customized, responsive CSS with glassmorphism, modern typography (Outfit/Inter), and smooth micro-animations.
*   **React Hooks** — Local/global state coordination.

### Backend (Server)
*   **Node.js & Express** — High-performance RESTful API endpoints.
*   **Sequelize ORM** — Modern SQL coordination and migrations.
*   **SQLite** — Lightweight, zero-config relational database for rapid staging.

---

## 📂 Project Structure

```text
lifelink-organ-blood-system/
├── client/
│   ├── public/
│   └── src/
│       ├── components/        # Reusable navbar and cards
│       ├── pages/             # HomePage, AuthPages, and role Dashboards
│       ├── App.js             # Main routing & state controller
│       ├── index.js           # Client entry point
│       └── mockFirebaseComplete.js # Local persistence middleware
├── server/
│   ├── config/                # Database configurations
│   ├── models/                # Sequelize SQL models (User, Inventory, Request)
│   ├── routes/                # Auth, inventory, and request router files
│   ├── server.js              # Express app launcher
│   └── database.sqlite        # Relational database file
├── .gitignore                 # Root level git ignore settings
└── README.md                  # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ManasGoud23/lifelink-organ-blood-system.git
   cd lifelink-organ-blood-system
   ```

2. **Start the Backend Server**
   ```bash
   cd server
   npm install
   npm start
   ```
   *The server runs on **`http://localhost:5000`**.*

3. **Start the React Frontend**
   ```bash
   cd ../client
   npm install
   npm start
   ```
   *The client opens automatically on **`http://localhost:3000`**.*

---

## 🔐 Test Credentials

To ease local evaluation, use the interactive **⚡ Auto-fill** feature on the login screen or type the following accounts:

| Role | Mobile Number | Password |
| :--- | :--- | :--- |
| **👤 Patient** | `9876543210` | `password123` |
| **🏥 Hospital** | `9988776655` | `hospital123` |
| **👨‍💼 Admin** | `9111111111` | `admin123` |

---

## 🔄 Architecture & Real-Time Sync
The system utilizes a dual-layer synchronization pipeline:
1. **Relational Database Staging:** The Node.js Express server persists users, inventories, and requests locally within SQLite tables using Sequelize.
2. **Local Session Persistence:** To deliver < 100ms sync updates across multiple concurrent browser tabs, the client integrates a mock database sync adapter utilizing `localStorage` change event listeners.

---

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create.
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <h3>🩸 Connecting Donors, Patients, and Hospitals to Save Lives 🏥</h3>
  Built with ❤️ for the Healthcare & Tech Community.
</div>
