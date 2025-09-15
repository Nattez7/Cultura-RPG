import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiIAsAdUCgEwTQ1ENNCmiIo5mrtxQC7cE",
  authDomain: "tcc-unifeso.firebaseapp.com",
  databaseURL: "https://tcc-unifeso-default-rtdb.firebaseio.com",
  projectId: "tcc-unifeso",
  storageBucket: "tcc-unifeso.firebasestorage.app",
  messagingSenderId: "662548306610",
  appId: "1:662548306610:web:295da12577cf2ff99887ab",
  measurementId: "G-20XRYXNTQQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);