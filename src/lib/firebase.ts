
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  projectId: "piiss-bfh06",
  appId: "1:296152062569:web:6eef58e97de07ecfe3e0f8",
  storageBucket: "piiss-bfh06.firebasestorage.app",
  apiKey: "AIzaSyBb6b4afUUGdTdzPAfQCVKhiESy-pnBpeE",
  authDomain: "piiss-bfh06.firebaseapp.com",
  messagingSenderId: "296152062569",
  databaseURL: "https://piiss-bfh06-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Realtime Database
const rtdb: Database = getDatabase(app);

// For client-side usage, we don't need a special persistence promise
// like we did for Firestore's multi-tab support.
const persistencePromise = Promise.resolve();

// Export the app, the db instance, and the promise
export { rtdb, app, persistencePromise };
