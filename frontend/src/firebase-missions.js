import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDKof5FxeXMnTm641x7ejmIrPJh4rvuK0",
  authDomain: "missions-fa3fd.firebaseapp.com",
  projectId: "missions-fa3fd",
  storageBucket: "missions-fa3fd.firebasestorage.app",
  messagingSenderId: "748085517172",
  appId: "1:748085517172:web:deefc4115d3f421243ea21",
  measurementId: "G-Y5RQ28HQDP"
};

const app = initializeApp(firebaseConfig, "missions");
export const missionsDb = getFirestore(app);