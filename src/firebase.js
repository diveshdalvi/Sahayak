// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sahayak-3c049.firebaseapp.com",
  databaseURL: "https://sahayak-3c049-default-rtdb.firebaseio.com",
  projectId: "sahayak-3c049",
  storageBucket: "sahayak-3c049.firebasestorage.app",
  messagingSenderId: "661129071139",
  appId: "1:661129071139:web:b9d1afc88553c867a43f96",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, RecaptchaVerifier, signInWithPhoneNumber };
