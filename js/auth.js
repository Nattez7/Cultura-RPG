import { auth } from './firebase-config.js';
import { 
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let usuarioAtual = null;

onAuthStateChanged(auth, (user) => {
    usuarioAtual = user;
    atualizarMenuAuth();
});

function atualizarMenuAuth() {
    const menuNav = document.querySelector('.nav-menu');
    if (!menuNav) return;

    const itensAuthExistentes = menuNav.querySelectorAll('.auth-item');
    itensAuthExistentes.forEach(item => item.remove());

    if (usuarioAtual) {
        const itemUsuario = document.createElement('li');
        itemUsuario.className = 'auth-item';
        itemUsuario.innerHTML = `<a href="perfil.html" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: inherit;">
            ${usuarioAtual.photoURL ? `<img src="${usuarioAtual.photoURL}" alt="${usuarioAtual.displayName}" style="width: 24px; height: 24px; border-radius: 50%;">` : ''}
            ${usuarioAtual.displayName || 'Usuário'}
        </a>`;
        
        const itemSair = document.createElement('li');
        itemSair.className = 'auth-item';
        itemSair.innerHTML = `<a href="#" onclick="sair()">Sair</a>`;
        
        menuNav.appendChild(itemUsuario);
        menuNav.appendChild(itemSair);
    } else {
        const itemLogin = document.createElement('li');
        itemLogin.className = 'auth-item';
        itemLogin.innerHTML = `<a href="login.html">Entrar</a>`;
        menuNav.appendChild(itemLogin);
    }
}

function redirecionarParaLogin() {
    if (!usuarioAtual && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// só roda quando o firebase já carregou
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (!user && !window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    });
});

window.sair = async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro no logout:', error);
    }
};

window.verificarAuth = () => {
    if (!usuarioAtual) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
};

window.obterUsuarioAtual = () => usuarioAtual;