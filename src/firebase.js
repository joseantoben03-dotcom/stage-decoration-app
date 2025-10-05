// /client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByOvAMkOjFvgmQ0R9Y3iIL8CasK90zebw",
  authDomain: "ethereal-blooms-reviews.firebaseapp.com",
  projectId: "ethereal-blooms-reviews",
  storageBucket: "ethereal-blooms-reviews.firebasestorage.app",
  messagingSenderId: "54832383041",
  appId: "1:54832383041:web:ad5d805ab80b6c652b72c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you need
export const auth = getAuth(app);
export const db = getFirestore(app);