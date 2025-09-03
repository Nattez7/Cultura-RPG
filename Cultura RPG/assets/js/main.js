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
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Validação temporária
    if (email === 'contato.oliveiradebrito@gmail.com' && password === '123456') {
        console.log("Login bem-sucedido!");
        window.location.href = 'dashboard.html';
        return;
    }

    // Tentativa com Firebase
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Login bem-sucedido:", user);
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                console.error("Erro no login:", error);
                alert("Email ou senha incorretos!");
            });
    } else {
        alert("Email ou senha incorretos!");
    }
});

// Registro com email/senha
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;
    const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        alert("As senhas não coincidem!");
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Registro bem-sucedido
            const user = userCredential.user;
            console.log("Registro bem-sucedido:", user);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error("Erro no registro:", error);
            alert("Erro no registro: " + error.message);
        });
});

// Login com Google
googleBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log("Login Google bem-sucedido:", user);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error("Erro no login Google:", error);
            alert("Erro no login Google: " + error.message);
        });
});

// Login com Facebook
facebookBtn.addEventListener('click', () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log("Login Facebook bem-sucedido:", user);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error("Erro no login Facebook:", error);
            alert("Erro no login Facebook: " + error.message);
        });
});

// Observador de estado de autenticação
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Usuário está logado
        console.log("Usuário logado:", user);
        // Redirecionar para página principal ou atualizar UI
    } else {
        // Usuário está deslogado
        console.log("Usuário deslogado");
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

// Validação do formulário
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const age = parseInt(document.getElementById('register-age').value);
    
    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }
    
    if (age < 13) {
        alert('Você precisa ter pelo menos 13 anos para se cadastrar.');
        return;
    }
    
    // Aqui você pode adicionar a lógica do Firebase para criar a conta
});
