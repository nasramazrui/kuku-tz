import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAkJ5LZYYz1vvE_rYCwwgEBjzmD4bYISmk",
  authDomain: "misosi-pro.firebaseapp.com",
  databaseURL: "https://misosi-pro-default-rtdb.firebaseio.com",
  projectId: "misosi-pro",
  storageBucket: "misosi-pro.firebasestorage.app",
  messagingSenderId: "1050333533161",
  appId: "1:1050333533161:web:8b1b5aeea2424bee8db178",
  measurementId: "G-QMRTWDLEBJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export default app;
