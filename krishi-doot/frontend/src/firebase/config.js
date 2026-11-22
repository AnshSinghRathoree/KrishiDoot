import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmeY3KPVbqaHjfjuHKzUR6wFQd4bQoHuA",
  authDomain: "krishidoot-v2.firebaseapp.com",
  projectId: "krishidoot-v2",
  storageBucket: "krishidoot-v2.firebasestorage.app",
  messagingSenderId: "753868322970",
  appId: "1:753868322970:web:cc124e182290c184da4723",
  measurementId: "G-ZZFRSL0Z96"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;