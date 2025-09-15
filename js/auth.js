import { auth } from './firebase-config.js';
import { 
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUser = null;

// Verificar estado de autenticação
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    updateAuthUI();
});

function updateAuthUI() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // Remover itens de auth existentes
    const existingAuthItems = navMenu.querySelectorAll('.auth-item');
    existingAuthItems.forEach(item => item.remove());

    if (currentUser) {
        // Usuário logado
        const userItem = document.createElement('li');
        userItem.className = 'auth-item';
        userItem.innerHTML = `<a href="perfil.html" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: inherit;">
            ${currentUser.photoURL ? `<img src="${currentUser.photoURL}" alt="${currentUser.displayName}" style="width: 24px; height: 24px; border-radius: 50%;">` : ''}
            ${currentUser.displayName || 'Usuário'}
        </a>`;
        
        const logoutItem = document.createElement('li');
        logoutItem.className = 'auth-item';
        logoutItem.innerHTML = `<a href="#" onclick="logout()">Sair</a>`;
        
        navMenu.appendChild(userItem);
        navMenu.appendChild(logoutItem);
    } else {
        // Usuário não logado
        const loginItem = document.createElement('li');
        loginItem.className = 'auth-item';
        loginItem.innerHTML = `<a href="login.html">Entrar</a>`;
        navMenu.appendChild(loginItem);
    }
}

// Redirecionar para login se não estiver autenticado
function redirectToLogin() {
    if (!currentUser && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Verificar autenticação ao carregar páginas
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para o Firebase carregar
    setTimeout(redirectToLogin, 1000);
});

// Logout
window.logout = async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro no logout:', error);
    }
};

// Verificar se usuário está logado (para páginas protegidas)
window.requireAuth = () => {
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
};

// Exportar para uso em outros arquivos
window.getCurrentUser = () => currentUser;