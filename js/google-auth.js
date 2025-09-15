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

// Configurar provedor Google
const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

// Estado do usuário
let currentUser = null;

// Variável para controlar se o modal está aberto
let modalOpen = false;

// Verificar se usuário já está logado (apenas para usuários existentes)
onAuthStateChanged(auth, (user) => {
    // Não redirecionar automaticamente - deixar o login manual controlar
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const googleLoginBtn = document.getElementById('google-login-btn');
    const emailLoginForm = document.getElementById('email-login-form');
    const registerForm = document.getElementById('register-form');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', signInWithGoogle);
    }
    
    if (emailLoginForm) {
        emailLoginForm.addEventListener('submit', signInWithEmail);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', registerWithEmail);
    }
});

// Login com Google
async function signInWithGoogle() {
    const loginBtn = document.getElementById('google-login-btn');
    
    try {
        // Mostrar estado de carregamento
        loginBtn.classList.add('loading');
        loginBtn.textContent = 'Entrando...';
        
        // Fazer login com Google
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        console.log('Login realizado com sucesso:', user.displayName);
        
        // Verificar se é novo usuário
        const canRedirect = await checkAndSaveUserData(user);
        
        if (canRedirect) {
            // Usuário existente - redirecionar
            window.location.href = 'mesas.html';
        }
        // Se for novo usuário, o modal será mostrado e não redireciona ainda
        
    } catch (error) {
        console.error('Erro no login:', error);
        
        // Remover estado de carregamento
        loginBtn.classList.remove('loading');
        loginBtn.innerHTML = `
            <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
        `;
        
        // Mostrar erro para o usuário
        showError(getErrorMessage(error.code));
    }
}

// Verificar se é novo usuário e salvar dados
async function checkAndSaveUserData(user) {
    try {
        console.log('Verificando se usuário existe:', user.uid);
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        console.log('Documento existe?', userDoc.exists());
        
        if (!userDoc.exists()) {
            console.log('Novo usuário detectado - mostrando modal');
            // Aguardar um pouco para garantir que a página carregou
            setTimeout(() => {
                showCompleteProfileModal(user);
            }, 500);
            return false; // Não redirecionar ainda
        } else {
            console.log('Usuário existente - atualizando lastLogin');
            // Usuário existente - apenas atualizar lastLogin
            await setDoc(userRef, {
                lastLogin: new Date().toISOString()
            }, { merge: true });
            
            return true; // Pode redirecionar
        }
        
    } catch (error) {
        console.error('Erro ao verificar dados do usuário:', error);
        return true; // Em caso de erro, permitir acesso
    }
}

// Mostrar modal de completar perfil
function showCompleteProfileModal(user) {
    console.log('Tentando mostrar modal de completar perfil');
    const modal = document.getElementById('complete-profile-modal');
    const form = document.getElementById('complete-profile-form');
    
    if (!modal) {
        console.error('Modal não encontrado!');
        return;
    }
    
    if (!form) {
        console.error('Formulário não encontrado!');
        return;
    }
    
    console.log('Modal e formulário encontrados, configurando...');
    
    // Definir data máxima (18 anos atrás)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 13); // Mínimo 13 anos
    const birthdateInput = document.getElementById('user-birthdate');
    if (birthdateInput) {
        birthdateInput.max = maxDate.toISOString().split('T')[0];
    }
    
    console.log('Mostrando modal...');
    modalOpen = true;
    modal.style.display = 'flex';
    
    // Event listener para o formulário
    form.onsubmit = async (e) => {
        e.preventDefault();
        console.log('Formulário submetido');
        await completeUserProfile(user);
    };
    
    console.log('Modal configurado e exibido');
}

// Completar perfil do usuário
async function completeUserProfile(user) {
    const submitBtn = document.querySelector('.btn-complete-profile');
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Salvando...';
        
        const birthdate = new Date(document.getElementById('user-birthdate').value);
        const age = Math.floor((new Date() - birthdate) / (365.25 * 24 * 60 * 60 * 1000));
        
        const userData = {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            nick: document.getElementById('user-nick').value,
            birthdate: document.getElementById('user-birthdate').value,
            age: age,
            experience: document.getElementById('user-experience').value,
            source: document.getElementById('user-source').value,
            interests: document.getElementById('user-interests').value,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            mesasCriadas: 0,
            mesasParticipadas: 0,
            profileCompleted: true
        };
        
        await setDoc(doc(db, 'users', user.uid), userData);
        
        console.log('Perfil completado com sucesso');
        
        // Fechar modal e redirecionar
        modalOpen = false;
        document.getElementById('complete-profile-modal').style.display = 'none';
        window.location.href = 'mesas.html';
        
    } catch (error) {
        console.error('Erro ao completar perfil:', error);
        showError('Erro ao salvar perfil. Tente novamente.');
        
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Finalizar Cadastro';
    }
}

// Obter mensagem de erro amigável
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/popup-closed-by-user':
            return 'Login cancelado. Tente novamente.';
        case 'auth/popup-blocked':
            return 'Pop-up bloqueado pelo navegador. Permita pop-ups e tente novamente.';
        case 'auth/network-request-failed':
            return 'Erro de conexão. Verifique sua internet e tente novamente.';
        case 'auth/too-many-requests':
            return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
        case 'auth/invalid-credential':
            return 'Credenciais inválidas. Verifique nick e senha.';
        case 'auth/user-not-found':
            return 'Usuário não encontrado.';
        case 'auth/wrong-password':
            return 'Senha incorreta.';
        case 'auth/weak-password':
            return 'Senha muito fraca. Use pelo menos 6 caracteres.';
        case 'auth/email-already-in-use':
            return 'Este email já está em uso.';
        default:
            return 'Erro no login. Tente novamente.';
    }
}

// Login com email e senha
async function signInWithEmail(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showError('Preencha email e senha.');
        return;
    }
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'mesas.html';
        
    } catch (error) {
        console.error('Erro no login:', error);
        if (error.code === 'auth/invalid-credential') {
            showError('Email ou senha incorretos.');
        } else {
            showError(getErrorMessage(error.code));
        }
    }
}

// Registrar com email e senha
async function registerWithEmail(event) {
    event.preventDefault();
    
    const nick = document.getElementById('register-nick').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const birthdate = document.getElementById('register-birthdate').value;
    const experience = document.getElementById('register-experience').value;
    const source = document.getElementById('register-source').value;
    const interests = document.getElementById('register-interests').value;
    
    if (password !== confirmPassword) {
        showError('As senhas não coincidem.');
        return;
    }
    
    try {
        // Verificar se nick já existe
        const nickQuery = query(
            collection(db, 'users'),
            where('nick', '==', nick)
        );
        
        const nickSnapshot = await getDocs(nickQuery);
        
        if (!nickSnapshot.empty) {
            showError('Este nick já está em uso.');
            return;
        }
        
        // Criar conta no Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Calcular idade
        const birthdateObj = new Date(birthdate);
        const age = Math.floor((new Date() - birthdateObj) / (365.25 * 24 * 60 * 60 * 1000));
        
        // Salvar dados no Firestore
        const userData = {
            name: nick,
            email: email,
            nick: nick,
            birthdate: birthdate,
            age: age,
            experience: experience,
            source: source || 'registro-direto',
            interests: interests,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            mesasCriadas: 0,
            mesasParticipadas: 0,
            profileCompleted: true
        };
        
        await setDoc(doc(db, 'users', user.uid), userData);
        
        window.location.href = 'mesas.html';
        
    } catch (error) {
        console.error('Erro no registro:', error);
        showError(getErrorMessage(error.code));
    }
}



// Mostrar formulário de registro
function showRegisterForm() {
    document.getElementById('email-login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// Mostrar formulário de login
function showLoginForm() {
    document.getElementById('email-login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

// Mostrar erro na tela
function showError(message) {
    // Criar elemento de erro se não existir
    let errorDiv = document.getElementById('login-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'login-error';
        errorDiv.style.cssText = `
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
            animation: slideInDown 0.3s ease-out;
        `;
        
        const loginContent = document.querySelector('.login-content');
        loginContent.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    
    // Remover erro após 5 segundos
    setTimeout(() => {
        if (errorDiv) {
            errorDiv.remove();
        }
    }, 5000);
}

// Exportar funções globais
window.showRegisterForm = showRegisterForm;
window.showLoginForm = showLoginForm;