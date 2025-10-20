import { auth, db } from './firebase-config.js';
import { 
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let usuarioAtual = null;

// Verificar estado de autenticação
onAuthStateChanged(auth, async (usuario) => {
    usuarioAtual = usuario;
    await atualizarInterfaceAuth();
});

async function atualizarInterfaceAuth(photoURLAtualizada = null) {
    const menuNav = document.querySelector('.nav-menu');
    if (!menuNav) return;

    // Remover itens de auth existentes
    const itensAuthExistentes = menuNav.querySelectorAll('.auth-item');
    itensAuthExistentes.forEach(item => item.remove());

    if (usuarioAtual) {
        // Buscar foto atualizada do Firestore se não fornecida
        let photoURL = photoURLAtualizada || usuarioAtual.photoURL;
        if (!photoURLAtualizada) {
            try {
                const userDoc = await getDoc(doc(db, 'users', usuarioAtual.uid));
                if (userDoc.exists() && userDoc.data().photoURL) {
                    photoURL = userDoc.data().photoURL;
                }
            } catch (error) {
                console.log('Erro ao buscar foto:', error);
            }
        }
        
        // Usuário logado
        const itemUsuario = document.createElement('li');
        itemUsuario.className = 'auth-item';
        itemUsuario.innerHTML = `<a href="perfil.html" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: inherit;">
            ${photoURL ? `<img src="${photoURL}" alt="${usuarioAtual.displayName}" style="width: 24px; height: 24px; border-radius: 50%;">` : ''}
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

// Exportar função para uso em outros arquivos
window.atualizarInterfaceAuth = atualizarInterfaceAuth;



// Redirecionar para login se não estiver autenticado
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (!user && !window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    });
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
window.logout = window.sair;
window.requireAuth = window.exigirAuth;
window.getCurrentUser = window.obterUsuarioAtual;
