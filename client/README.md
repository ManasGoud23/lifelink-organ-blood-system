# Organ & Blood Donation Client

A Firebase-based React frontend for managing organ and blood donations.

## Features

- **User Authentication**: Firebase Auth with Email/Password
- **Donor Management**: Create, Read, Update, Delete donor profiles
- **Firestore Database**: Real-time cloud database for donor records
- **Blood Type Tracking**: Support for all blood types
- **Organ Type Selection**: Multiple organ donation options
- **Responsive Design**: Mobile-friendly interface

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── AuthPages.js
│   │   ├── AuthPages.css
│   │   ├── Dashboard.js
│   │   └── Dashboard.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── firebase.js
├── package.json
├── .env.example
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Firestore and Authentication enabled

## Setup Instructions

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [https://firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Get your Firebase configuration

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 4. Firestore Rules

Set up your Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /donors/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId || 
                            (request.auth.uid == request.resource.data.userId && request.method == 'create');
    }
  }
}
```

## Running the Application

### Development Mode

```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm build
```

## Technology Stack

- **React 18**: UI framework
- **Firebase 10**: Authentication, Firestore, Storage
- **CSS**: Styling
- **Axios**: HTTP client (for backend communication)
- **React Router**: Navigation (prepared for future routes)

## Features

### Authentication
- Sign up with email and password
- Login to existing account
- Automatic user session management

### Dashboard
- View all registered donors
- Create new donor records
- Edit existing donor information
- Delete donor records
- Filter by blood type and organ type

### Firestore Integration
- Real-time data synchronization
- User-specific donor records
- Timestamps for tracking

## Future Enhancements

- Blood request system
- Organ request matching
- Donor search/filtering
- User profile management
- Notification system
- Integration with backend API

## Troubleshooting

### Firebase Configuration Issues

- Ensure all environment variables are set correctly
- Check Firebase project settings
- Verify Firestore Database is created and active
- Check Authentication methods are enabled

### Common Errors

- `Cannot find module 'firebase'`: Run `npm install firebase`
- `CORS errors`: Update backend CORS configuration
- `Authentication failed`: Verify Firebase project credentials

## License

MIT
