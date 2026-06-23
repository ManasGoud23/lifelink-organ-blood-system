import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7_nSAIyzctUku--0Au4FXzVxcQ7Z28_g",
  authDomain: "instant-stone-452905-d8.firebaseapp.com",
  projectId: "instant-stone-452905-d8",
  storageBucket: "instant-stone-452905-d8.firebasestorage.app",
  messagingSenderId: "843716707043",
  appId: "1:843716707043:web:7e95893564e7bda6957bd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
