// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, initializeAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW7sT4ZqvsIfl2mVpCT2FmPpF_NDjTXjk",
  authDomain: "automotive-tool-room.firebaseapp.com",
  projectId: "automotive-tool-room",
  storageBucket: "automotive-tool-room.appspot.com",
  messagingSenderId: "739664850711",
  appId: "1:739664850711:web:5875119ee1ae68384f9152",
  measurementId: "G-ZW4PR48621"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: browserLocalPersistence
});

export const FIRESTORE_DB = initializeFirestore(FIREBASE_APP, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({})
});
