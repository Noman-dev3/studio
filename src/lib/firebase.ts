
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "piiss-bfh06",
  appId: "1:296152062569:web:6eef58e97de07ecfe3e0f8",
  storageBucket: "piiss-bfh06.firebasestorage.app",
  apiKey: "AIzaSyBb6b4afUUGdTdzPAfQCVKhiESy-pnBpeE",
  authDomain: "piiss-bfh06.firebaseapp.com",
  messagingSenderId: "296152062569"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db, app };
