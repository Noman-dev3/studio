
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableMultiTabIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

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

// Initialize Firestore with persistence
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a a time.
    console.warn('Firebase persistence failed: multiple tabs open.');
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
     console.warn('Firebase persistence failed: browser does not support it.');
  }
});


export { db, app };
