// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, enableMultiTabIndexedDbPersistence, initializeFirestore, Firestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "piiss-bfh06",
  appId: "1:296152062569:web:6eef58e97de07ecfe3e0f8",
  storageBucket: "piiss-bfh06.firebasestorage.app",
  apiKey: "AIzaSyBb6b4afUUGdTdzPAfQCVKhiESy-pnBpeE",
  authDomain: "piiss-bfh06.firebaseapp.com",
  messagingSenderId: "296152062569"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore but don't export it directly
const db: Firestore = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

// Create a promise that resolves when persistence is enabled
const persistencePromise = enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Firebase persistence failed: multiple tabs open.');
  } else if (err.code == 'unimplemented') {
    console.warn('Firebase persistence failed: browser does not support it.');
  }
  return err; // Resolve with the error if it fails, so the app doesn't hang
});

// Export the app, the db instance, and the promise
export { db, app, persistencePromise };
