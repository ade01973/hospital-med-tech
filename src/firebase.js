import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfZ9Xjvvvvvvvv",
  authDomain: "nursing-sim-game.firebaseapp.com",
  projectId: "nursing-sim-game",
  storageBucket: "nursing-sim-game.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = 'nursing-sim-game';
