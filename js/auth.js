import { auth } from './firebase-config.js';
import { 
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let usuarioAtual = null;

// Verificar estado de autenticação
onAuthStateChanged(auth, (usuario) => {
    usuarioAtual = usuario;
    atualizarInterfaceAuth();
});

function atualizarInterfaceAuth() {
    const menuNav = document.querySelector('.nav-menu');
    if (!menuNav) return;

    // Remover itens de auth existentes
    const itensAuthExistentes = menuNav.querySelectorAll('.auth-item');
    itensAuthExistentes.forEach(item => item.remove());

    if (usuarioAtual) {
        // Usuário logado
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
        // Usuário não logado
        const itemLogin = document.createElement('li');
        itemLogin.className = 'auth-item';
        itemLogin.innerHTML = `<a href="login.html">Entrar</a>`;
        menuNav.appendChild(itemLogin);
    }
}

// Redirecionar para login se não estiver autenticado
function redirecionarParaLogin() {
    if (!usuarioAtual && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Verificar autenticação ao carregar páginas
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para o Firebase carregar
    setTimeout(redirecionarParaLogin, 1000);
});

// Logout
window.sair = async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (erro) {
        console.error('Erro no logout:', erro);
    }
};

// Manter compatibilidade com código antigo
window.logout = window.sair;

// Verificar se usuário está logado (para páginas protegidas)
window.exigirAuth = () => {
    if (!usuarioAtual) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
};

// Exportar para uso em outros arquivos
window.obterUsuarioAtual = () => usuarioAtual;

// Manter compatibilidade com código antigo
window.requireAuth = window.exigirAuth;
window.getCurrentUser = window.obterUsuarioAtual;