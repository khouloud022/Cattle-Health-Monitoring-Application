// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBlmA-_HhlBKMzg4oL5huJD3cN23ksCUgk",
    authDomain: "login-df84b.firebaseapp.com",
    projectId: "login-df84b",
    storageBucket: "login-df84b.firebasestorage.app",
    messagingSenderId: "740381063441",
    appId: "1:740381063441:web:e062bb77de07eab2c834b0",
    measurementId: "G-F8M09C3TPQ"
    };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
