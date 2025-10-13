import { auth, db } from './firebase-config.js';
import { 
    signInWithPopup, 
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const provedorGoogle = new GoogleAuthProvider();
provedorGoogle.addScope('profile');
provedorGoogle.addScope('email');

let usuarioAtual = null;
let modalAberto = false;

onAuthStateChanged(auth, (user) => {
    // deixa o login manual controlar
});

document.addEventListener('DOMContentLoaded', function() {
    const botaoLoginGoogle = document.getElementById('google-login-btn');
    const formularioEmailLogin = document.getElementById('email-login-form');
    const formularioRegistro = document.getElementById('register-form');
    
    if (botaoLoginGoogle) {
        botaoLoginGoogle.addEventListener('click', entrarComGoogle);
    }
    
    if (formularioEmailLogin) {
        formularioEmailLogin.addEventListener('submit', entrarComEmail);
    }
    
    if (formularioRegistro) {
        formularioRegistro.addEventListener('submit', registrarComEmail);
    }
});

async function entrarComGoogle() {
    const botaoLogin = document.getElementById('google-login-btn');
    
    try {
        botaoLogin.classList.add('loading');
        botaoLogin.textContent = 'Entrando...';
        
        const resultado = await signInWithPopup(auth, provedorGoogle);
        const usuario = resultado.user;
        
        console.log('Login realizado com sucesso:', usuario.displayName);
        
        const podeRedirecionar = await verificarESalvarDadosUsuario(usuario);
        
        if (podeRedirecionar) {
            window.location.href = 'mesas.html';
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        
        botaoLogin.classList.remove('loading');
        botaoLogin.innerHTML = `
            <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
        `;
        
        mostrarErro(obterMensagemErro(error.code));
    }
}

async function verificarESalvarDadosUsuario(usuario) {
    try {
        console.log('Verificando se usuario existe:', usuario.uid);
        const refUsuario = doc(db, 'users', usuario.uid);
        const docUsuario = await getDoc(refUsuario);
        
        console.log('Documento existe?', docUsuario.exists());
        
        if (!docUsuario.exists()) {
            console.log('Novo usuario detectado - mostrando modal');
            setTimeout(() => {
                mostrarModalCompletarPerfil(usuario);
            }, 500);
            return false;
        } else {
            console.log('Usuario existente - atualizando lastLogin');
            await setDoc(refUsuario, {
                lastLogin: new Date().toISOString()
            }, { merge: true });
            
            return true;
        }
        
    } catch (error) {
        console.error('Erro ao verificar dados do usuario:', error);
        return true;
    }
}

function mostrarModalCompletarPerfil(usuario) {
    console.log('Tentando mostrar modal de completar perfil');
    const modal = document.getElementById('complete-profile-modal');
    const formulario = document.getElementById('complete-profile-form');
    
    if (!modal) {
        console.error('Modal nao encontrado!');
        return;
    }
    
    if (!formulario) {
        console.error('Formulario nao encontrado!');
        return;
    }
    
    console.log('Modal e formulario encontrados, configurando...');
    
    const dataMaxima = new Date();
    dataMaxima.setFullYear(dataMaxima.getFullYear() - 13);
    const inputDataNascimento = document.getElementById('user-birthdate');
    if (inputDataNascimento) {
        inputDataNascimento.max = dataMaxima.toISOString().split('T')[0];
    }
    
    console.log('Mostrando modal...');
    modalAberto = true;
    modal.style.display = 'flex';
    
    formulario.onsubmit = async (e) => {
        e.preventDefault();
        console.log('Formulario submetido');
        await completarPerfilUsuario(usuario);
    };
    
    console.log('Modal configurado e exibido');
}

async function completarPerfilUsuario(usuario) {
    const botaoSubmit = document.querySelector('.btn-complete-profile');
    
    try {
        botaoSubmit.disabled = true;
        botaoSubmit.textContent = 'Salvando...';
        
        const dataNascimento = new Date(document.getElementById('user-birthdate').value);
        const idade = Math.floor((new Date() - dataNascimento) / (365.25 * 24 * 60 * 60 * 1000));
        
        const dadosUsuario = {
            name: usuario.displayName,
            email: usuario.email,
            photoURL: usuario.photoURL,
            nick: document.getElementById('user-nick').value,
            birthdate: document.getElementById('user-birthdate').value,
            age: idade,
            experience: document.getElementById('user-experience').value,
            source: document.getElementById('user-source').value,
            interests: document.getElementById('user-interests').value,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            mesasCriadas: 0,
            mesasParticipadas: 0,
            profileCompleted: true
        };
        
        await setDoc(doc(db, 'users', usuario.uid), dadosUsuario);
        
        console.log('Perfil completado com sucesso');
        
        modalAberto = false;
        document.getElementById('complete-profile-modal').style.display = 'none';
        window.location.href = 'mesas.html';
        
    } catch (error) {
        console.error('Erro ao completar perfil:', error);
        mostrarErro('Erro ao salvar perfil. Tente novamente.');
        
        botaoSubmit.disabled = false;
        botaoSubmit.textContent = 'Finalizar Cadastro';
    }
}

function obterMensagemErro(codigoErro) {
    switch (codigoErro) {
        case 'auth/popup-closed-by-user':
            return 'Login cancelado. Tente novamente.';
        case 'auth/popup-blocked':
            return 'Pop-up bloqueado pelo navegador. Permita pop-ups e tente novamente.';
        case 'auth/network-request-failed':
            return 'Erro de conexao. Verifique sua internet e tente novamente.';
        case 'auth/too-many-requests':
            return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
        case 'auth/invalid-credential':
            return 'Credenciais invalidas. Verifique nick e senha.';
        case 'auth/user-not-found':
            return 'Usuario nao encontrado.';
        case 'auth/wrong-password':
            return 'Senha incorreta.';
        case 'auth/weak-password':
            return 'Senha muito fraca. Use pelo menos 6 caracteres.';
        case 'auth/email-already-in-use':
            return 'Este email ja esta em uso.';
        default:
            return 'Erro no login. Tente novamente.';
    }
}

async function entrarComEmail(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-password').value;
    
    if (!email || !senha) {
        mostrarErro('Preencha email e senha.');
        return;
    }
    
    try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = 'mesas.html';
        
    } catch (error) {
        console.error('Erro no login:', error);
        if (error.code === 'auth/invalid-credential') {
            mostrarErro('Email ou senha incorretos.');
        } else {
            mostrarErro(obterMensagemErro(error.code));
        }
    }
}

async function registrarComEmail(event) {
    event.preventDefault();
    
    const nick = document.getElementById('register-nick').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const senha = document.getElementById('register-password').value;
    const confirmarSenha = document.getElementById('register-confirm-password').value;
    const dataNascimento = document.getElementById('register-birthdate').value;
    const experiencia = document.getElementById('register-experience').value;
    const fonte = document.getElementById('register-source').value;
    const interesses = document.getElementById('register-interests').value;
    
    if (senha !== confirmarSenha) {
        mostrarErro('As senhas nao coincidem.');
        return;
    }
    
    try {
        const consultaNick = query(
            collection(db, 'users'),
            where('nick', '==', nick)
        );
        
        const snapshotNick = await getDocs(consultaNick);
        
        if (!snapshotNick.empty) {
            mostrarErro('Este nick ja esta em uso.');
            return;
        }
        
        const credencialUsuario = await createUserWithEmailAndPassword(auth, email, senha);
        const usuario = credencialUsuario.user;
        
        const objDataNascimento = new Date(dataNascimento);
        const idade = Math.floor((new Date() - objDataNascimento) / (365.25 * 24 * 60 * 60 * 1000));
        
        const dadosUsuario = {
            name: nick,
            email: email,
            nick: nick,
            birthdate: dataNascimento,
            age: idade,
            experience: experiencia,
            source: fonte || 'registro-direto',
            interests: interesses,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            mesasCriadas: 0,
            mesasParticipadas: 0,
            profileCompleted: true
        };
        
        await setDoc(doc(db, 'users', usuario.uid), dadosUsuario);
        
        window.location.href = 'mesas.html';
        
    } catch (error) {
        console.error('Erro no registro:', error);
        mostrarErro(obterMensagemErro(error.code));
    }
}

function mostrarFormularioRegistro() {
    document.getElementById('email-login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function mostrarFormularioLogin() {
    document.getElementById('email-login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function mostrarErro(mensagem) {
    let divErro = document.getElementById('login-error');
    if (!divErro) {
        divErro = document.createElement('div');
        divErro.id = 'login-error';
        divErro.style.cssText = `
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
            animation: slideInDown 0.3s ease-out;
        `;
        
        const conteudoLogin = document.querySelector('.login-content');
        conteudoLogin.appendChild(divErro);
    }
    
    divErro.textContent = mensagem;
    
    setTimeout(() => {
        if (divErro) {
            divErro.remove();
        }
    }, 5000);
}

window.mostrarFormularioRegistro = mostrarFormularioRegistro;
window.mostrarFormularioLogin = mostrarFormularioLogin;