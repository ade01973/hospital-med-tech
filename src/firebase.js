import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA6q0wMT-f751LgiDoyaXKkmiRWme7OHiQ",
  authDomain: "gestion-de-enfermeria-cfb69.firebaseapp.com",
  projectId: "gestion-de-enfermeria-cfb69",
  storageBucket: "gestion-de-enfermeria-cfb69.firebasestorage.app",
  messagingSenderId: "948557859012",
  appId: "1:948557859012:web:7e285c33636a6368cee191",
  measurementId: "G-94J7Y88VL5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = 'gestion-enfermeria-v1';
