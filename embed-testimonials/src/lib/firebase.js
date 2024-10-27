// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpG3SrHiIz901rA1q0GNi_U2PRsEB_9gs",
  authDomain: "testimonials-07.firebaseapp.com",
  projectId: "testimonials-07",
  storageBucket: "testimonials-07.appspot.com",
  messagingSenderId: "691638807228",
  appId: "1:691638807228:web:f8ad4c15d35405eefbfeb9",
  measurementId: "G-4X7XJNYSM0",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
