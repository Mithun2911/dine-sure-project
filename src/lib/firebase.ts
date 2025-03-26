
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration - updated for hakir6611@gmail.com account
const firebaseConfig = {
  apiKey: "AIzaSyBP86yxcIiSU7Rk5RxnQOpm8yLLqBpZ-h0",
  authDomain: "dinesure-app.firebaseapp.com",
  projectId: "dinesure-app",
  storageBucket: "dinesure-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Log connection status for debugging
console.log("Firebase initialized for: hakir6611@gmail.com");
console.log("Using project ID:", firebaseConfig.projectId);

export default app;
