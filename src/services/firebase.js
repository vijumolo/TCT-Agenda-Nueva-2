import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGuLckWcL27m_q0pG53yTGsUkYLdn3wmo",
  authDomain: "agenda-eventos-tct.firebaseapp.com",
  projectId: "agenda-eventos-tct",
  storageBucket: "agenda-eventos-tct.firebasestorage.app",
  messagingSenderId: "319137974281",
  appId: "1:319137974281:web:584ebc5c896713b3f710d8",
  measurementId: "G-2ELGT90KL4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
