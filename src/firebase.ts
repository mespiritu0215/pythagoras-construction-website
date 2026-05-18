/**
 * firebase.ts
 *
 * Add these 6 variables to your .env file (values from Firebase Console):
 *
 *   REACT_APP_FIREBASE_API_KEY=...
 *   REACT_APP_FIREBASE_AUTH_DOMAIN=...
 *   REACT_APP_FIREBASE_PROJECT_ID=...
 *   REACT_APP_FIREBASE_STORAGE_BUCKET=...
 *   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
 *   REACT_APP_FIREBASE_APP_ID=...
 *
 * Then run: npm install firebase
 */

import { initializeApp } from 'firebase/app';
import { getFirestore }  from 'firebase/firestore';
import { getStorage }    from 'firebase/storage';

const firebaseConfig = {
  apiKey:            "AIzaSyD2H-AoQapaapnjz0ApdTPBIBWSCY9kTeo",
  authDomain:        "pci-website-ffd0a.firebaseapp.com",
  projectId:         "pci-website-ffd0a",
  storageBucket:     "pci-website-ffd0a.firebasestorage.app",
  messagingSenderId: "456963084749",
  appId:             "1:456963084749:web:0adedcf546dec892f9b484",
  measurementId:     "G-NDR19V6EV8",
};

const app = initializeApp(firebaseConfig);

export const db      = getFirestore(app);
export const storage = getStorage(app);
