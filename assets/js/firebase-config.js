// Firebase configuration
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Current user state
let currentUser = null;

// Auth state observer
auth.onAuthStateChanged((user) => {
    currentUser = user;
    if (user) {
        // User is signed in
        console.log('Usuário logado:', user.email);
        // Redirect to dashboard if on login page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            window.location.href = 'dashboard.html';
        }
    } else {
        // User is signed out
        console.log('Usuário deslogado');
        // Redirect to login if not on login page
        if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    }
});
