// Authentication functions
class AuthManager {
    constructor() {
        this.user = null;
    }

    // Email/Password Login
    async loginWithEmail(email, password) {
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            await this.saveUserData(result.user);
            return result.user;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    // Google Login
    async loginWithGoogle() {
        try {
            const result = await auth.signInWithPopup(googleProvider);
            const isNewUser = result.additionalUserInfo?.isNewUser;
            
            await this.saveUserData(result.user);
            
            // Se for novo usuário, redirecionar para completar perfil
            if (isNewUser) {
                this.redirectToCompleteProfile(result.user);
            } else {
                // Verificar se tem dados completos
                const userData = await this.loadUserData(result.user.uid);
                if (!userData || !userData.fullName || !userData.gameData?.character) {
                    this.redirectToCompleteProfile(result.user);
                } else {
                    window.location.href = 'dashboard.html';
                }
            }
            
            return result.user;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    // Email/Password Register
    async registerWithEmail(userData) {
        try {
            const result = await auth.createUserWithEmailAndPassword(userData.email, userData.password);
            
            // Update profile
            await result.user.updateProfile({
                displayName: userData.fullName
            });

            // Save additional user data
            await this.saveUserData(result.user, userData);
            return result.user;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    // Save user data to Firestore
    async saveUserData(user, additionalData = {}) {
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || additionalData.fullName || '',
            photoURL: user.photoURL || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            // Game data
            gameData: {
                level: 1,
                experience: 0,
                coins: 100,
                ownedKnowledge: {},
                completedQuests: [],
                dailyQuests: [],
                character: null,
                characterCreated: false
            },
            // Profile data
            profile: {
                fullName: additionalData.fullName || user.displayName || '',
                username: additionalData.username || '',
                bio: 'Explorador da rica cultura brasileira, em busca de conhecimento e sabedoria ancestral.',
                age: additionalData.age || null,
                phone: additionalData.phone || '',
                birthdate: additionalData.birthdate || '',
                profileComplete: !!additionalData.fullName
            },
            // Additional registration data
            ...additionalData
        };

        await db.collection('users').doc(user.uid).set(userData, { merge: true });
    }

    // Load user game data
    async loadUserData(uid) {
        try {
            const doc = await db.collection('users').doc(uid).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return null;
        }
    }

    // Update user game data
    async updateGameData(uid, gameData) {
        try {
            await db.collection('users').doc(uid).update({
                'gameData': gameData,
                'lastUpdated': firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    // Logout
    async logout() {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }

    // Password reset
    async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    // Error handler
    handleAuthError(error) {
        const errorMessages = {
            'auth/user-not-found': 'Usuário não encontrado',
            'auth/wrong-password': 'Senha incorreta',
            'auth/email-already-in-use': 'Email já está em uso',
            'auth/weak-password': 'Senha muito fraca',
            'auth/invalid-email': 'Email inválido',
            'auth/popup-closed-by-user': 'Login cancelado pelo usuário',
            'auth/network-request-failed': 'Erro de conexão'
        };
        
        return errorMessages[error.code] || error.message;
    }
    
    // Redirect to complete profile
    redirectToCompleteProfile(user) {
        // Salvar dados do usuário no sessionStorage para usar no formulário
        sessionStorage.setItem('pendingUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }));
        
        window.location.href = 'complete-profile.html';
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Sync localStorage with Firestore
async function syncGameData() {
    if (!currentUser) return;

    try {
        // Load from Firestore
        const userData = await authManager.loadUserData(currentUser.uid);
        
        if (userData && userData.gameData) {
            // Update localStorage with Firestore data
            localStorage.setItem('playerLevel', userData.gameData.level || 1);
            localStorage.setItem('playerExperience', userData.gameData.experience || 0);
            localStorage.setItem('playerCoins', userData.gameData.coins || 100);
            localStorage.setItem('ownedKnowledge', JSON.stringify(userData.gameData.ownedKnowledge || {}));
            localStorage.setItem('completedQuests', JSON.stringify(userData.gameData.completedQuests || []));
            localStorage.setItem('dailyQuests', JSON.stringify(userData.gameData.dailyQuests || []));
            
            if (userData.gameData.character) {
                localStorage.setItem('playerCharacter', JSON.stringify(userData.gameData.character));
            }
        }
    } catch (error) {
        console.error('Erro ao sincronizar dados:', error);
    }
}

// Save localStorage to Firestore
async function saveGameData() {
    if (!currentUser) return;

    try {
        const gameData = {
            level: parseInt(localStorage.getItem('playerLevel')) || 1,
            experience: parseInt(localStorage.getItem('playerExperience')) || 0,
            coins: parseInt(localStorage.getItem('playerCoins')) || 100,
            ownedKnowledge: JSON.parse(localStorage.getItem('ownedKnowledge') || '{}'),
            completedQuests: JSON.parse(localStorage.getItem('completedQuests') || '[]'),
            dailyQuests: JSON.parse(localStorage.getItem('dailyQuests') || '[]'),
            character: JSON.parse(localStorage.getItem('playerCharacter') || 'null')
        };

        await authManager.updateGameData(currentUser.uid, gameData);
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
}

// Auto-sync every 30 seconds
setInterval(() => {
    if (currentUser) {
        saveGameData();
    }
}, 30000);

// Sync on page load
auth.onAuthStateChanged((user) => {
    if (user) {
        setTimeout(syncGameData, 1000);
    }
});