// Sistema RPG Simples - Cultura Brasileira
class CulturaRPG {
    constructor() {
        this.player = this.loadPlayer();
        this.initializeSystem();
    }

    // Carregar dados do jogador
    loadPlayer() {
        const saved = localStorage.getItem('cultura_rpg_player');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Jogador inicial - precisa distribuir pontos
        const newPlayer = {
            name: 'Aventureiro Cultural',
            level: 1,
            xp: 0,
            xpToNext: 100,
            pc: parseInt(localStorage.getItem('pc_count') || '15'),
            stats: {
                intelecto: 0,    // Conhecimento e sabedoria
                fisico: 0,       // Artes marciais e atividades físicas
                criativo: 0,     // Arte, música e expressão
                social: 0        // Festas, culinária e tradições
            },
            knowledge: {}, // Conhecimentos comprados na loja
            pointsToDistribute: 4, // Pontos iniciais para distribuir
            titles: [],
            achievements: [],
            streak: 0,
            totalQuests: 0
        };
        
        // Mostrar modal de distribuição se for novo jogador
        setTimeout(() => this.showAttributeDistribution(), 100);
        return newPlayer;
    }

    // Salvar dados do jogador
    savePlayer() {
        localStorage.setItem('cultura_rpg_player', JSON.stringify(this.player));
        localStorage.setItem('pc_count', this.player.pc.toString());
    }

    // Inicializar sistema
    initializeSystem() {
        this.updateDisplay();
        this.checkAchievements();
    }

    // Ganhar XP por completar quiz
    gainXP(category, score, perfect) {
        let xpGained = score * 10; // 10 XP por acerto
        if (perfect) xpGained += 20; // Bônus por perfeição
        
        this.player.xp += xpGained;
        this.player.totalQuests++;
        
        // Ganhar stat específico da categoria
        this.gainStat(category, perfect ? 2 : 1);
        
        // Verificar level up
        this.checkLevelUp();
        
        // Verificar conquistas
        this.checkAchievements();
        
        this.savePlayer();
        return xpGained;
    }

    // Ganhar stat específico (máximo 5)
    gainStat(category, amount) {
        const statMap = {
            'musica': 'criativo',
            'literatura': 'intelecto',
            'folclore': 'social',
            'culinaria': 'social',
            'artes-marciais': 'fisico',
            'festas': 'social'
        };
        
        const stat = statMap[category] || 'intelecto';
        if (this.player.stats[stat] < 5) {
            this.player.stats[stat] += amount;
        }
    }

    // Verificar level up
    checkLevelUp() {
        while (this.player.xp >= this.player.xpToNext) {
            this.player.xp -= this.player.xpToNext;
            this.player.level++;
            this.player.xpToNext = Math.floor(this.player.xpToNext * 1.2);
            
            // Ganhar 1 ponto para distribuir a cada 2 níveis
            if (this.player.level % 2 === 0) {
                this.player.pointsToDistribute = (this.player.pointsToDistribute || 0) + 1;
            }
            
            this.showLevelUpModal();
        }
    }

    // Verificar conquistas
    checkAchievements() {
        const achievements = [
            {
                id: 'first_quest',
                name: 'Primeiro Passo',
                desc: 'Complete sua primeira missão',
                condition: () => this.player.totalQuests >= 1,
                reward: { pc: 5, title: 'Iniciante' }
            },
            {
                id: 'perfect_score',
                name: 'Perfeição Cultural',
                desc: 'Acerte todas as perguntas de uma missão',
                condition: () => this.player.achievements.includes('perfect_score'),
                reward: { pc: 10, title: 'Perfeccionista' }
            },
            {
                id: 'level_5',
                name: 'Conhecedor',
                desc: 'Alcance o nível 5',
                condition: () => this.player.level >= 5,
                reward: { pc: 25, title: 'Conhecedor Cultural' }
            },
            {
                id: 'all_categories',
                name: 'Explorador Cultural',
                desc: 'Complete missões de todas as categorias',
                condition: () => this.hasCompletedAllCategories(),
                reward: { pc: 50, title: 'Explorador Cultural' }
            }
        ];

        achievements.forEach(achievement => {
            if (!this.player.achievements.includes(achievement.id) && achievement.condition()) {
                this.unlockAchievement(achievement);
            }
        });
    }

    // Desbloquear conquista
    unlockAchievement(achievement) {
        this.player.achievements.push(achievement.id);
        this.player.pc += achievement.reward.pc;
        
        if (achievement.reward.title) {
            this.player.titles.push(achievement.reward.title);
        }
        
        this.showAchievementModal(achievement);
        this.savePlayer();
    }

    // Verificar se completou todas as categorias
    hasCompletedAllCategories() {
        const categories = ['musica', 'literatura', 'folclore', 'culinaria', 'artes-marciais', 'festas'];
        return categories.every(cat => localStorage.getItem(`quest_${cat}`));
    }

    // Atualizar display
    updateDisplay() {
        // Atualizar PC na interface
        const pcElements = document.querySelectorAll('.pc-count');
        pcElements.forEach(el => el.textContent = this.player.pc);
        
        // Atualizar avatar do usuário com nível
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.title = `${this.player.name} - Nível ${this.player.level}`;
        }
    }

    // Modal de level up
    showLevelUpModal() {
        const modal = document.createElement('div');
        modal.className = 'rpg-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; align-items: center;
            justify-content: center; z-index: 3000; opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const hasPoints = this.player.pointsToDistribute > 0;
        
        modal.innerHTML = `
            <div style="
                background: var(--bg-card); backdrop-filter: blur(20px);
                border: 1px solid var(--accent); border-radius: 16px;
                padding: 2rem; text-align: center; max-width: 400px; width: 90%;
                transform: translateY(30px); transition: transform 0.3s ease;
            ">
                <i class="fas fa-star" style="font-size: 4rem; color: #FFD700; margin-bottom: 1rem;"></i>
                <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 2rem;">Level Up!</h3>
                <p style="color: var(--text); margin-bottom: 1rem;">Você alcançou o nível ${this.player.level}!</p>
                ${hasPoints ? `
                    <p style="color: var(--accent); margin-bottom: 2rem; font-weight: bold;">+1 Ponto de Atributo disponível!</p>
                    <button onclick="this.closest('.rpg-modal').remove(); window.culturaRPG.showAttributeDistribution();" style="
                        background: var(--gradient); border: none; color: var(--text);
                        padding: 1rem 2rem; border-radius: 12px; cursor: pointer;
                        font-weight: bold; transition: all 0.3s ease;
                    ">Distribuir Pontos</button>
                ` : `
                    <p style="color: var(--text); margin-bottom: 2rem; opacity: 0.8;">Continue sua jornada cultural!</p>
                    <button onclick="this.closest('.rpg-modal').remove()" style="
                        background: var(--gradient); border: none; color: var(--text);
                        padding: 1rem 2rem; border-radius: 12px; cursor: pointer;
                        font-weight: bold; transition: all 0.3s ease;
                    ">Continuar</button>
                `}
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('div').style.transform = 'translateY(0)';
        }, 10);
    }

    // Modal de conquista
    showAchievementModal(achievement) {
        const modal = document.createElement('div');
        modal.className = 'rpg-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; align-items: center;
            justify-content: center; z-index: 3000; opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--bg-card); backdrop-filter: blur(20px);
                border: 1px solid var(--accent); border-radius: 16px;
                padding: 2rem; text-align: center; max-width: 400px; width: 90%;
                transform: translateY(30px); transition: transform 0.3s ease;
            ">
                <i class="fas fa-trophy" style="font-size: 4rem; color: var(--accent); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.8rem;">Conquista Desbloqueada!</h3>
                <h4 style="color: var(--text); margin-bottom: 0.5rem;">${achievement.name}</h4>
                <p style="color: var(--text); margin-bottom: 1rem; opacity: 0.8;">${achievement.desc}</p>
                <div style="
                    background: rgba(235, 214, 119, 0.1); border: 1px solid var(--accent);
                    border-radius: 8px; padding: 1rem; margin-bottom: 2rem;
                ">
                    <p style="color: var(--accent); margin: 0; font-weight: bold;">
                        +${achievement.reward.pc} PC
                        ${achievement.reward.title ? ` • Título: ${achievement.reward.title}` : ''}
                    </p>
                </div>
                <button onclick="this.closest('.rpg-modal').remove()" style="
                    background: var(--gradient); border: none; color: var(--text);
                    padding: 1rem 2rem; border-radius: 12px; cursor: pointer;
                    font-weight: bold; transition: all 0.3s ease;
                ">Incrível!</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('div').style.transform = 'translateY(0)';
        }, 10);
    }

    // Distribuir pontos de atributo
    distributePoint(stat) {
        if (this.player.pointsToDistribute > 0 && this.player.stats[stat] < 5) {
            // Limite de 2 pontos por atributo na criação inicial
            const isInitialDistribution = this.player.pointsToDistribute === 4 || 
                                        (this.player.pointsToDistribute <= 4 && this.player.level === 1);
            
            if (!isInitialDistribution || this.player.stats[stat] < 2) {
                this.player.stats[stat]++;
                this.player.pointsToDistribute--;
                this.savePlayer();
                return true;
            }
        }
        return false;
    }

    // Rolar dados para teste com bônus de conhecimento
    rollDice(stat, topic = null) {
        const diceCount = this.player.stats[stat];
        if (diceCount === 0) return { rolls: [], successes: 0, total: 0, bonus: 0 };
        
        const rolls = [];
        let successes = 0;
        let bonus = 0;
        
        // Calcular bônus baseado no conhecimento do tópico
        if (topic && this.player.knowledge[topic]) {
            bonus = this.player.knowledge[topic];
        }
        
        // Rolar dados base
        for (let i = 0; i < diceCount; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            rolls.push(roll);
            if (roll >= 5) successes++;
        }
        
        // Rolar dados de bônus
        const bonusRolls = [];
        for (let i = 0; i < bonus; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            bonusRolls.push(roll);
            if (roll >= 5) successes++;
        }
        
        return { 
            rolls, 
            bonusRolls, 
            successes, 
            total: diceCount, 
            bonus,
            topic 
        };
    }

    // Comprar conhecimento
    buyKnowledge(item, cost) {
        if (this.player.pc >= cost) {
            this.player.pc -= cost;
            this.player.knowledge[item] = (this.player.knowledge[item] || 0) + 1;
            
            // Limitar a 5 níveis
            if (this.player.knowledge[item] > 5) {
                this.player.knowledge[item] = 5;
            }
            
            this.savePlayer();
            this.updateDisplay();
            return true;
        }
        return false;
    }

    // Obter nível de conhecimento
    getKnowledgeLevel(item) {
        return this.player.knowledge[item] || 0;
    }

    // Modal de distribuição de atributos
    showAttributeDistribution() {
        if (this.player.pointsToDistribute === 0) return;
        
        const modal = document.createElement('div');
        modal.className = 'rpg-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); display: flex; align-items: center;
            justify-content: center; z-index: 3000;
        `;
        
        this.updateAttributeModal(modal);
        document.body.appendChild(modal);
    }

    // Atualizar modal de atributos
    updateAttributeModal(modal) {
        const isInitial = this.player.level === 1;
        const maxPoints = isInitial ? 2 : 5;
        
        modal.innerHTML = `
            <div style="
                background: var(--bg-card); backdrop-filter: blur(20px);
                border: 1px solid var(--accent); border-radius: 16px;
                padding: 2rem; max-width: 500px; width: 90%;
            ">
                <h3 style="color: var(--accent); margin-bottom: 1rem; text-align: center;">
                    ${isInitial ? 'Distribua seus Atributos Iniciais' : 'Pontos de Atributo Disponíveis'}
                </h3>
                <p style="color: var(--text); text-align: center; margin-bottom: 2rem; opacity: 0.8;">
                    Pontos restantes: <strong>${this.player.pointsToDistribute}</strong>
                    ${isInitial ? '<br>Máximo 2 pontos por atributo' : ''}
                </p>
                
                <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                    ${Object.entries(this.player.stats).map(([stat, value]) => `
                        <div style="
                            display: flex; justify-content: space-between; align-items: center;
                            padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;
                        ">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-${this.getStatIcon(stat)}" style="color: var(--accent);"></i>
                                <span style="color: var(--text); text-transform: capitalize;">${stat}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <span style="color: var(--accent); font-weight: bold; min-width: 20px;">${value}</span>
                                <button onclick="window.culturaRPG.addPoint('${stat}')" 
                                    ${this.player.pointsToDistribute === 0 || value >= maxPoints ? 'disabled' : ''}
                                    style="
                                        background: var(--accent); border: none; color: var(--primary);
                                        width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
                                        font-weight: bold; ${this.player.pointsToDistribute === 0 || value >= maxPoints ? 'opacity: 0.5;' : ''}
                                    ">+</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="text-align: center; padding: 1rem; background: rgba(235,214,119,0.1); border-radius: 8px; margin-bottom: 2rem;">
                    <p style="color: var(--text); margin: 0; font-size: 0.9rem;">
                        <strong>Como funciona:</strong> Cada ponto = 1 dado d6. Resultado 5+ = sucesso!
                    </p>
                </div>
                
                ${this.player.pointsToDistribute === 0 ? `
                    <button onclick="this.closest('.rpg-modal').remove()" style="
                        background: var(--gradient); border: none; color: var(--text);
                        padding: 1rem 2rem; border-radius: 12px; cursor: pointer;
                        font-weight: bold; width: 100%;
                    ">Continuar Aventura</button>
                ` : ''}
            </div>
        `;
    }

    // Adicionar ponto (chamado pelo botão)
    addPoint(stat) {
        if (this.distributePoint(stat)) {
            const modal = document.querySelector('.rpg-modal');
            if (modal) this.updateAttributeModal(modal);
        }
    }

    // Obter ícone do atributo
    getStatIcon(stat) {
        const icons = {
            intelecto: 'brain',
            fisico: 'fist-raised',
            criativo: 'palette',
            social: 'users'
        };
        return icons[stat] || 'star';
    }

    // Obter informações do jogador
    getPlayerInfo() {
        return {
            ...this.player,
            powerLevel: Object.values(this.player.stats).reduce((a, b) => a + b, 0),
            progressPercent: (this.player.xp / this.player.xpToNext) * 100,
            totalKnowledge: Object.values(this.player.knowledge || {}).reduce((a, b) => a + b, 0)
        };
    }
}

// Instância global do sistema RPG
window.culturaRPG = new CulturaRPG();