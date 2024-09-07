
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "ramenchat-28f43.firebaseapp.com",
  projectId: "ramenchat-28f43",
  storageBucket: "ramenchat-28f43.appspot.com",
  messagingSenderId: "1043641523608",
  appId: "1:1043641523608:web:957f7a172bbf9e1f23dfed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
