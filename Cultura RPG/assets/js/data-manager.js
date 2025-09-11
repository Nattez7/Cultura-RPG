// Data Manager - Gerencia sincronização entre localStorage e Firestore
class DataManager {
    constructor() {
        this.currentUser = null;
        this.userData = null;
    }

    // Inicializar dados do usuário
    async initializeUserData(user) {
        this.currentUser = user;
        
        try {
            // Tentar carregar dados do Firestore
            const doc = await db.collection('users').doc(user.uid).get();
            
            if (doc.exists) {
                this.userData = doc.data();
                this.syncToLocalStorage();
            } else {
                // Criar dados iniciais se não existir
                await this.createInitialUserData(user);
            }
        } catch (error) {
            console.error('Erro ao inicializar dados:', error);
            this.loadFromLocalStorage();
        }
    }

    // Criar dados iniciais do usuário
    async createInitialUserData(user) {
        const initialData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            
            // Dados pessoais
            profile: {
                fullName: user.displayName || '',
                username: '',
                bio: 'Explorador da rica cultura brasileira, em busca de conhecimento e sabedoria ancestral.',
                age: null,
                state: '',
                instagram: '',
                twitter: '',
                publicProfile: true,
                emailNotifications: true
            },

            // Dados do jogo
            gameData: {
                level: 1,
                experience: 0,
                coins: 100,
                ownedKnowledge: {},
                completedQuests: [],
                dailyQuests: [],
                lastQuestDate: null,
                streak: 0,
                totalQuests: 0,
                
                // Dados do personagem RPG
                character: null,
                characterCreated: false,
                
                // Estatísticas
                stats: {
                    questsCompleted: 0,
                    knowledgeAcquired: 0,
                    achievementsUnlocked: 0,
                    daysActive: 0
                }
            }
        };

        this.userData = initialData;
        await this.saveToFirestore();
        this.syncToLocalStorage();
    }

    // Salvar dados no Firestore
    async saveToFirestore() {
        if (!this.currentUser || !this.userData) return;

        try {
            await db.collection('users').doc(this.currentUser.uid).set({
                ...this.userData,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log('Dados salvos no Firestore com sucesso');
        } catch (error) {
            console.error('Erro ao salvar no Firestore:', error);
            throw error;
        }
    }

    // Sincronizar dados do Firestore para localStorage
    syncToLocalStorage() {
        if (!this.userData) return;

        const gameData = this.userData.gameData;
        
        console.log('🔄 Sincronizando para localStorage:', gameData.ownedKnowledge);
        
        // Dados do jogo
        localStorage.setItem('playerLevel', gameData.level || 1);
        localStorage.setItem('playerExperience', gameData.experience || 0);
        localStorage.setItem('playerCoins', gameData.coins || 100);
        localStorage.setItem('pc_count', gameData.coins || 100);
        localStorage.setItem('ownedKnowledge', JSON.stringify(gameData.ownedKnowledge || {}));
        localStorage.setItem('completedQuests', JSON.stringify(gameData.completedQuests || []));
        localStorage.setItem('dailyQuests', JSON.stringify(gameData.dailyQuests || []));
        
        // Dados do personagem
        if (gameData.character) {
            localStorage.setItem('playerCharacter', JSON.stringify(gameData.character));
            localStorage.setItem('cultura_rpg_player', JSON.stringify(gameData.character));
            localStorage.setItem('character_created', 'true');
        }
        
        console.log('✅ localStorage atualizado com conhecimentos:', JSON.parse(localStorage.getItem('ownedKnowledge') || '{}'));
    }

    // Carregar dados do localStorage
    loadFromLocalStorage() {
        if (!this.userData) {
            this.userData = { gameData: {} };
        }

        this.userData.gameData = {
            level: parseInt(localStorage.getItem('playerLevel')) || 1,
            experience: parseInt(localStorage.getItem('playerExperience')) || 0,
            coins: parseInt(localStorage.getItem('playerCoins')) || 100,
            ownedKnowledge: JSON.parse(localStorage.getItem('ownedKnowledge') || '{}'),
            completedQuests: JSON.parse(localStorage.getItem('completedQuests') || '[]'),
            dailyQuests: JSON.parse(localStorage.getItem('dailyQuests') || '[]'),
            character: JSON.parse(localStorage.getItem('playerCharacter') || 'null'),
            characterCreated: localStorage.getItem('character_created') === 'true'
        };
    }

    // Atualizar dados específicos
    async updateGameData(updates) {
        if (!this.userData) return;

        // Atualizar dados locais
        Object.assign(this.userData.gameData, updates);
        
        // Sincronizar com localStorage
        this.syncToLocalStorage();
        
        // Salvar no Firestore
        await this.saveToFirestore();
    }

    async updateProfile(updates) {
        if (!this.userData) return;

        // Atualizar dados locais
        Object.assign(this.userData.profile, updates);
        
        // Salvar no Firestore
        await this.saveToFirestore();
    }

    // Criar personagem
    async createCharacter(characterData) {
        // Obter conhecimentos já adquiridos
        const existingKnowledge = this.userData?.gameData?.ownedKnowledge || {};
        
        const character = {
            ...characterData,
            level: 1,
            xp: 0,
            xpToNext: 100,
            pc: 15,
            stats: characterData.stats || {
                intelecto: 0,
                fisico: 0,
                criativo: 0,
                social: 0
            },
            knowledge: { ...existingKnowledge }, // Incluir conhecimentos já comprados
            pointsToDistribute: 0,
            titles: [],
            achievements: [],
            streak: 0,
            totalQuests: 0,
            characterCreated: true
        };

        await this.updateGameData({
            character: character,
            characterCreated: true,
            coins: 15
        });

        console.log('Personagem criado com conhecimentos:', character.knowledge);
        return character;
    }

    // Comprar conhecimento
    async buyKnowledge(knowledgeName, cost = 1) {
        if (!this.userData || this.userData.gameData.coins < cost) {
            throw new Error('Pontos de Conhecimento insuficientes');
        }

        const ownedKnowledge = { ...this.userData.gameData.ownedKnowledge };
        const key = knowledgeName.toLowerCase();
        ownedKnowledge[key] = (ownedKnowledge[key] || 0) + 1;

        // Atualizar dados locais
        this.userData.gameData.coins -= cost;
        this.userData.gameData.ownedKnowledge = ownedKnowledge;
        
        // Atualizar conhecimentos do personagem se existir
        if (this.userData.gameData.character) {
            if (!this.userData.gameData.character.knowledge) {
                this.userData.gameData.character.knowledge = {};
            }
            this.userData.gameData.character.knowledge = { ...ownedKnowledge };
            console.log('Conhecimentos sincronizados com personagem:', this.userData.gameData.character.knowledge);
        }
        
        // Sincronizar com localStorage
        this.syncToLocalStorage();
        
        // Salvar no Firestore
        await this.saveToFirestore();
        
        console.log('Conhecimento comprado:', knowledgeName, 'Nível:', ownedKnowledge[key]);
        console.log('Conhecimentos atuais:', ownedKnowledge);
        
        // Disparar evento para atualizar biblioteca
        window.dispatchEvent(new CustomEvent('knowledgeUpdated', {
            detail: { knowledgeName, level: ownedKnowledge[key], allKnowledge: ownedKnowledge }
        }));
        
        return ownedKnowledge;
    }

    // Completar missão
    async completeQuest(questData) {
        if (!this.userData) return;

        const completedQuests = [...this.userData.gameData.completedQuests, {
            ...questData,
            completedAt: new Date().toISOString(),
            reward: 1
        }];

        const newStats = { ...this.userData.gameData.stats };
        newStats.questsCompleted = (newStats.questsCompleted || 0) + 1;

        await this.updateGameData({
            coins: this.userData.gameData.coins + 1,
            experience: this.userData.gameData.experience + 10,
            completedQuests: completedQuests,
            stats: newStats,
            lastQuestDate: new Date().toISOString()
        });
    }

    // Obter dados do usuário
    getUserData() {
        return this.userData;
    }

    // Obter dados do jogo
    getGameData() {
        return this.userData?.gameData || {};
    }

    // Obter dados do perfil
    getProfile() {
        return this.userData?.profile || {};
    }
}

// Instância global do gerenciador de dados
const dataManager = new DataManager();

// Inicializar quando o usuário fizer login
auth.onAuthStateChanged(async (user) => {
    if (user) {
        await dataManager.initializeUserData(user);
        
        // Disparar evento personalizado para outras partes do código
        window.dispatchEvent(new CustomEvent('userDataLoaded', { 
            detail: dataManager.getUserData() 
        }));
    }
});

// Auto-save a cada 30 segundos
setInterval(async () => {
    if (dataManager.currentUser) {
        dataManager.loadFromLocalStorage();
        await dataManager.saveToFirestore();
    }
}, 30000);