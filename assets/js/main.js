// Referências aos elementos do DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const googleBtn = document.querySelector('.google');
const facebookBtn = document.querySelector('.facebook');
const dragonLogo = document.querySelector('.logo');

// Função para alternar entre formulários
function toggleForm() {
    const currentActive = document.querySelector('.form.active');
    const nextForm = currentActive === loginForm ? registerForm : loginForm;
    
    currentActive.classList.add('fade-out');
    
    setTimeout(() => {
        currentActive.classList.remove('active', 'fade-out');
        nextForm.classList.add('active');
    }, 200);
}

// Função para alternar modo escuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Evento do dragão
dragonLogo.addEventListener('click', () => {
    dragonLogo.classList.add('wing-flap');
    
    setTimeout(() => {
        toggleDarkMode();
    }, 400);
    
    setTimeout(() => {
        dragonLogo.classList.remove('wing-flap');
    }, 800);
});

// Login com email/senha
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    showLoading(true);
    
    try {
        await authManager.loginWithEmail(email, password);
        // Redirect handled by auth state observer
    } catch (error) {
        showLoading(false);
        alert(error);
    }
});

// Registro com email/senha
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        fullName: document.getElementById('register-fullname').value,
        username: document.getElementById('register-username').value,
        email: document.getElementById('register-email').value,
        birthdate: document.getElementById('register-birthdate').value,
        age: parseInt(document.getElementById('register-age').value),
        phone: document.getElementById('register-phone').value,
        password: document.getElementById('register-password').value
    };
    
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (userData.password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }
    
    if (userData.age < 13) {
        alert('Você precisa ter pelo menos 13 anos para se cadastrar.');
        return;
    }
    
    showLoading(true);
    
    try {
        await authManager.registerWithEmail(userData);
        // Redirect handled by auth state observer
    } catch (error) {
        showLoading(false);
        alert(error);
    }
});

// Login com Google
googleBtn.addEventListener('click', async () => {
    showLoading(true);
    
    try {
        await authManager.loginWithGoogle();
        // Redirect handled by auth state observer
    } catch (error) {
        showLoading(false);
        if (error !== 'Login cancelado pelo usuário') {
            alert(error);
        }
    }
});

// Remove Facebook login (not requested)
facebookBtn.style.display = 'none';

// Loading spinner
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'flex' : 'none';
    }
}

// Forgot password
document.querySelector('.forgot-password').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    
    if (!email) {
        alert('Digite seu email primeiro');
        return;
    }
    
    try {
        await authManager.resetPassword(email);
        alert('Email de recuperação enviado!');
    } catch (error) {
        alert(error);
    }
});

// Calcular idade automaticamente
document.getElementById('register-birthdate').addEventListener('change', function() {
    const birthDate = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    document.getElementById('register-age').value = age;
    
    // Garantir que as labels permaneçam fixas
    setTimeout(() => {
        const dateLabel = document.querySelector('.date-label');
        const staticLabel = document.querySelector('.static-label');
        
        if (dateLabel) {
            dateLabel.style.cssText = 'position: absolute !important; top: 0 !important; left: 1rem !important; transform: translateY(-50%) !important; font-size: 0.8rem !important; background: #8b5cf6 !important; padding: 0 0.5rem !important; border-radius: 4px !important; color: white !important; pointer-events: none !important;';
        }
        
        if (staticLabel) {
            staticLabel.style.cssText = 'position: absolute !important; top: 0 !important; left: 1rem !important; transform: translateY(-50%) !important; font-size: 0.8rem !important; background: #8b5cf6 !important; padding: 0 0.5rem !important; border-radius: 4px !important; color: white !important; pointer-events: none !important;';
        }
    }, 10);
});

// Máscara para telefone
document.getElementById('register-phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
        value = `${value.slice(0, 9)}-${value.slice(9)}`;
    }
    
    e.target.value = value;
});


// Função para resetar todos os dados
// Corrigir labels especiais no carregamento
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const dateLabel = document.querySelector('.date-label');
        const staticLabel = document.querySelector('.static-label');
        
        if (dateLabel) {
            dateLabel.style.cssText = 'position: absolute !important; top: 0 !important; left: 1rem !important; transform: translateY(-50%) !important; font-size: 0.8rem !important; background: #8b5cf6 !important; padding: 0 0.5rem !important; border-radius: 4px !important; color: white !important; pointer-events: none !important;';
        }
        
        if (staticLabel) {
            staticLabel.style.cssText = 'position: absolute !important; top: 0 !important; left: 1rem !important; transform: translateY(-50%) !important; font-size: 0.8rem !important; background: #8b5cf6 !important; padding: 0 0.5rem !important; border-radius: 4px !important; color: white !important; pointer-events: none !important;';
        }
    }, 100);
});

function resetAllData() {
    if (confirm('Tem certeza que deseja resetar TODOS os dados? Esta ação não pode ser desfeita!')) {
        // Limpar localStorage
        localStorage.clear();
        
        // Limpar sessionStorage
        sessionStorage.clear();
        
        // Limpar cookies (se houver)
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        alert('✅ Todos os dados foram resetados! A página será recarregada.');
        
        // Recarregar página
        window.location.reload();
    }
}