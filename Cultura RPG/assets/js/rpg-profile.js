// Sistema de Perfil RPG
function showRPGProfile() {
    if (!window.culturaRPG) return;
    
    const player = window.culturaRPG.getPlayerInfo();
    
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
            border: 1px solid var(--border); border-radius: 16px;
            padding: 2rem; max-width: 500px; width: 90%; max-height: 80vh;
            overflow-y: auto; transform: translateY(30px); transition: transform 0.3s ease;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                <h2 style="color: var(--accent); margin: 0;">Perfil do Aventureiro</h2>
                <button onclick="this.closest('.rpg-modal').remove()" style="
                    background: none; border: none; color: var(--text); font-size: 1.5rem;
                    cursor: pointer; padding: 0.5rem; border-radius: 50%;
                ">×</button>
            </div>
            
            <!-- Informações Básicas -->
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="
                    width: 80px; height: 80px; border-radius: 50%; background: var(--gradient);
                    display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;
                ">
                    <i class="fas fa-user" style="font-size: 2rem; color: var(--text);"></i>
                </div>
                <h3 style="color: var(--text); margin: 0 0 0.5rem;">${player.name}</h3>
                <p style="color: var(--accent); margin: 0; font-weight: bold;">Nível ${player.level}</p>
                ${player.titles.length > 0 ? `<p style="color: var(--text); opacity: 0.8; margin: 0.5rem 0 0; font-style: italic;">${player.titles[player.titles.length - 1]}</p>` : ''}
            </div>
            
            <!-- Barra de XP -->
            <div style="margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--text); font-size: 0.9rem;">Experiência</span>
                    <span style="color: var(--text); font-size: 0.9rem;">${player.xp}/${player.xpToNext} XP</span>
                </div>
                <div style="width: 100%; height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden;">
                    <div style="height: 100%; background: var(--gradient); width: ${player.progressPercent}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
            
            <!-- Atributos -->
            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--accent); margin-bottom: 1rem;">Atributos (Sistema d6)</h4>
                <div style="display: grid; gap: 1rem;">
                    ${Object.entries(player.stats).map(([stat, value]) => `
                        <div style="
                            display: flex; justify-content: space-between; align-items: center;
                            padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;
                        ">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-${getStatIcon(stat)}" style="color: var(--accent); width: 20px;"></i>
                                <span style="color: var(--text); text-transform: capitalize;">${stat}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="display: flex; gap: 2px;">
                                    ${Array.from({length: 5}, (_, i) => `
                                        <div style="
                                            width: 12px; height: 12px; border-radius: 2px;
                                            background: ${i < value ? 'var(--accent)' : 'rgba(255,255,255,0.2)'};
                                        "></div>
                                    `).join('')}
                                </div>
                                <span style="color: var(--accent); font-weight: bold; min-width: 30px;">${value}d6</span>
                                <button onclick="testWithTopic('${stat}')" style="
                                    background: var(--accent); border: none; color: var(--primary);
                                    padding: 0.3rem 0.8rem; border-radius: 6px; cursor: pointer;
                                    font-size: 0.8rem; font-weight: bold;
                                    ${value === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}
                                " ${value === 0 ? 'disabled' : ''}>Testar</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${player.pointsToDistribute > 0 ? `
                    <div style="text-align: center; margin-top: 1rem; padding: 1rem; background: rgba(235,214,119,0.2); border: 1px solid var(--accent); border-radius: 8px;">
                        <span style="color: var(--accent); font-weight: bold;">Pontos Disponíveis: ${player.pointsToDistribute}</span>
                        <button onclick="window.culturaRPG.showAttributeDistribution(); this.closest('.rpg-modal').remove();" style="
                            background: var(--accent); border: none; color: var(--primary);
                            padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;
                            font-weight: bold; margin-left: 1rem;
                        ">Distribuir</button>
                    </div>
                ` : `
                    <div style="text-align: center; margin-top: 1rem; padding: 1rem; background: rgba(235,214,119,0.1); border-radius: 8px;">
                        <span style="color: var(--text); opacity: 0.8; font-size: 0.9rem;">Cada ponto = 1d6 • Sucesso em 5+</span>
                    </div>
                `}
            </div>
            
            <!-- Conhecimentos -->
            ${Object.keys(player.knowledge || {}).length > 0 ? `
                <div style="margin-bottom: 2rem;">
                    <h4 style="color: var(--accent); margin-bottom: 1rem;">Conhecimentos Especializados</h4>
                    <div style="display: grid; gap: 0.5rem; max-height: 150px; overflow-y: auto;">
                        ${Object.entries(player.knowledge || {}).filter(([_, level]) => level > 0).map(([item, level]) => `
                            <div style="
                                display: flex; justify-content: space-between; align-items: center;
                                padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px;
                            ">
                                <span style="color: var(--text); text-transform: capitalize;">${item}</span>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div style="display: flex; gap: 2px;">
                                        ${Array.from({length: 5}, (_, i) => `
                                            <div style="
                                                width: 8px; height: 8px; border-radius: 2px;
                                                background: ${i < level ? '#FFD700' : 'rgba(255,255,255,0.2)'};
                                            "></div>
                                        `).join('')}
                                    </div>
                                    <span style="color: #FFD700; font-weight: bold; font-size: 0.9rem;">+${level}d6</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Estatísticas -->
            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--accent); margin-bottom: 1rem;">Estatísticas</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <i class="fas fa-scroll" style="color: var(--accent); font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                        <div style="color: var(--text); font-size: 0.9rem;">Missões</div>
                        <div style="color: var(--accent); font-weight: bold; font-size: 1.2rem;">${player.totalQuests}</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <i class="fas fa-gem" style="color: var(--accent); font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                        <div style="color: var(--text); font-size: 0.9rem;">PC Atual</div>
                        <div style="color: var(--accent); font-weight: bold; font-size: 1.2rem;">${player.pc}</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <i class="fas fa-book" style="color: var(--accent); font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                        <div style="color: var(--text); font-size: 0.9rem;">Conhecimentos</div>
                        <div style="color: var(--accent); font-weight: bold; font-size: 1.2rem;">${player.totalKnowledge || 0}</div>
                    </div>
                </div>
            </div>
            
            <!-- Conquistas -->
            ${player.achievements.length > 0 ? `
                <div>
                    <h4 style="color: var(--accent); margin-bottom: 1rem;">Conquistas (${player.achievements.length})</h4>
                    <div style="display: grid; gap: 0.5rem; max-height: 150px; overflow-y: auto;">
                        ${player.achievements.map(id => `
                            <div style="
                                display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem;
                                background: rgba(255,255,255,0.05); border-radius: 6px;
                            ">
                                <i class="fas fa-trophy" style="color: var(--accent); font-size: 0.9rem;"></i>
                                <span style="color: var(--text); font-size: 0.9rem;">${getAchievementName(id)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : `
                <div style="text-align: center; padding: 2rem; opacity: 0.7;">
                    <i class="fas fa-trophy" style="color: var(--accent); font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p style="color: var(--text); margin: 0;">Complete missões para desbloquear conquistas!</p>
                </div>
            `}
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('div').style.transform = 'translateY(0)';
    }, 10);
}

function getStatIcon(stat) {
    const icons = {
        intelecto: 'brain',
        fisico: 'fist-raised',
        criativo: 'palette',
        social: 'users'
    };
    return icons[stat] || 'star';
}

function getAchievementName(id) {
    const names = {
        first_quest: 'Primeiro Passo',
        perfect_score: 'Perfeição Cultural',
        level_5: 'Conhecedor',
        all_categories: 'Explorador Cultural'
    };
    return names[id] || id;
}

// Testar atributo com dados e bônus
function testAttribute(stat, topic = null) {
    if (!window.culturaRPG) return;
    
    const result = window.culturaRPG.rollDice(stat, topic);
    if (result.total === 0) return;
    
    const modal = document.createElement('div');
    modal.className = 'rpg-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 3001;
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--bg-card); backdrop-filter: blur(20px);
            border: 1px solid var(--accent); border-radius: 16px;
            padding: 2rem; text-align: center; max-width: 450px; width: 90%;
        ">
            <h3 style="color: var(--accent); margin-bottom: 1rem; text-transform: capitalize;">
                Teste de ${stat}${topic ? ` (${topic})` : ''}
            </h3>
            <div style="margin-bottom: 1.5rem;">
                <p style="color: var(--text); margin-bottom: 1rem;">
                    Rolando ${result.total}d6${result.bonus > 0 ? ` + ${result.bonus}d6 bônus` : ''}...
                </p>
                
                <!-- Dados base -->
                <div style="margin-bottom: 1rem;">
                    ${result.total > 0 ? `<p style="color: var(--text); font-size: 0.9rem; margin-bottom: 0.5rem;">Dados Base:</p>` : ''}
                    <div style="display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">
                        ${result.rolls.map(roll => `
                            <div style="
                                width: 40px; height: 40px; border-radius: 8px;
                                background: ${roll >= 5 ? 'var(--accent)' : 'rgba(255,255,255,0.2)'};
                                color: ${roll >= 5 ? 'var(--primary)' : 'var(--text)'};
                                display: flex; align-items: center; justify-content: center;
                                font-weight: bold; font-size: 1.2rem;
                            ">${roll}</div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Dados bônus -->
                ${result.bonus > 0 ? `
                    <div style="margin-bottom: 1rem;">
                        <p style="color: var(--accent); font-size: 0.9rem; margin-bottom: 0.5rem;">Bônus (${topic}):</p>
                        <div style="display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">
                            ${result.bonusRolls.map(roll => `
                                <div style="
                                    width: 40px; height: 40px; border-radius: 8px;
                                    background: ${roll >= 5 ? '#FFD700' : 'rgba(255,215,0,0.3)'};
                                    color: ${roll >= 5 ? 'var(--primary)' : 'var(--text)'};
                                    display: flex; align-items: center; justify-content: center;
                                    font-weight: bold; font-size: 1.2rem;
                                    border: 2px solid #FFD700;
                                ">${roll}</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div style="
                    padding: 1rem; border-radius: 8px;
                    background: ${result.successes > 0 ? 'rgba(34, 139, 34, 0.2)' : 'rgba(220, 20, 60, 0.2)'};
                    border: 1px solid ${result.successes > 0 ? '#228B22' : '#DC143C'};
                ">
                    <p style="color: var(--text); margin: 0; font-size: 1.1rem;">
                        <strong>${result.successes} Sucesso${result.successes !== 1 ? 's' : ''}</strong>
                        ${result.successes > 0 ? ' 🎉' : ' 😔'}
                    </p>
                </div>
            </div>
            <button onclick="this.closest('.rpg-modal').remove()" style="
                background: var(--gradient); border: none; color: var(--text);
                padding: 1rem 2rem; border-radius: 12px; cursor: pointer;
                font-weight: bold;
            ">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Testar com tópico específico
function testWithTopic(stat) {
    if (!window.culturaRPG) return;
    
    const player = window.culturaRPG.getPlayerInfo();
    const knowledgeItems = Object.keys(player.knowledge || {}).filter(k => player.knowledge[k] > 0);
    
    if (knowledgeItems.length === 0) {
        testAttribute(stat);
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'rpg-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 3001;
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--bg-card); backdrop-filter: blur(20px);
            border: 1px solid var(--accent); border-radius: 16px;
            padding: 2rem; max-width: 400px; width: 90%;
        ">
            <h3 style="color: var(--accent); margin-bottom: 1rem; text-align: center; text-transform: capitalize;">
                Teste de ${stat}
            </h3>
            <p style="color: var(--text); text-align: center; margin-bottom: 1.5rem; opacity: 0.8;">
                Escolha um conhecimento para bônus:
            </p>
            <div style="display: grid; gap: 0.5rem; margin-bottom: 1.5rem;">
                <button onclick="testAttribute('${stat}'); this.closest('.rpg-modal').remove();" style="
                    background: rgba(255,255,255,0.1); border: 1px solid var(--border);
                    color: var(--text); padding: 0.8rem; border-radius: 8px; cursor: pointer;
                    text-align: left; transition: all 0.3s ease;
                ">Sem bônus</button>
                ${knowledgeItems.map(item => `
                    <button onclick="testAttribute('${stat}', '${item}'); this.closest('.rpg-modal').remove();" style="
                        background: rgba(235,214,119,0.1); border: 1px solid var(--accent);
                        color: var(--text); padding: 0.8rem; border-radius: 8px; cursor: pointer;
                        text-align: left; transition: all 0.3s ease;
                    ">
                        <span style="text-transform: capitalize;">${item}</span>
                        <span style="color: var(--accent); float: right; font-weight: bold;">+${player.knowledge[item]}d6</span>
                    </button>
                `).join('')}
            </div>
            <button onclick="this.closest('.rpg-modal').remove()" style="
                background: var(--gradient); border: none; color: var(--text);
                padding: 1rem 2rem; border-radius: 12px; cursor: pointer;
                font-weight: bold; width: 100%;
            ">Cancelar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}