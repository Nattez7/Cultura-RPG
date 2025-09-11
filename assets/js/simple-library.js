// Sistema simples de biblioteca que funciona
function loadSimpleLibrary() {
    console.log('🔄 Carregando biblioteca simples...');
    
    const container = document.getElementById('owned-knowledge');
    const emptyMessage = document.getElementById('empty-library');
    
    if (!container) {
        console.error('Container da biblioteca não encontrado');
        return;
    }
    
    // Limpar conteúdo atual
    const existingCards = container.querySelectorAll('.knowledge-card');
    existingCards.forEach(card => card.remove());
    
    // Obter conhecimentos do localStorage
    const ownedKnowledge = JSON.parse(localStorage.getItem('ownedKnowledge') || '{}');
    console.log('📚 Conhecimentos no localStorage:', ownedKnowledge);
    
    if (Object.keys(ownedKnowledge).length === 0) {
        console.log('📭 Nenhum conhecimento encontrado');
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }
    
    if (emptyMessage) emptyMessage.style.display = 'none';
    
    // Criar cards para cada conhecimento
    Object.entries(ownedKnowledge).forEach(([name, level]) => {
        console.log(`➕ Adicionando: ${name} (Nível ${level})`);
        
        const card = document.createElement('div');
        card.className = 'knowledge-card';
        card.style.cssText = `
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(139, 92, 246, 0.2);
            transform: translateY(-2px);
            transition: transform 0.2s, box-shadow 0.2s;
        `;
        
        // Buscar dados do conhecimento no Firestore
        let knowledgeInfo = null;
        if (knowledgeLoader && knowledgeLoader.isLoaded()) {
            knowledgeInfo = knowledgeLoader.searchKnowledge(name);
        }
        
        // Descrição padrão ou do Firestore
        const getDescription = (lvl) => {
            if (knowledgeInfo && knowledgeInfo.descriptions && knowledgeInfo.descriptions[lvl]) {
                return knowledgeInfo.descriptions[lvl];
            }
            return `Conhecimento sobre ${name} - Nível ${lvl}. Você possui este conhecimento cultural brasileiro.`;
        };
        
        const currentDescription = getDescription(level);
        
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <i class="fas fa-book" style="font-size: 2rem; color: #ffd700;"></i>
                <div style="flex: 1;">
                    <h3 style="color: #ffffff; margin: 0; margin-bottom: 0.5rem;">${name.charAt(0).toUpperCase() + name.slice(1)}</h3>
                    <p style="color: #ffffff; opacity: 0.8; margin: 0;">Nível ${level}</p>
                </div>
                <button onclick="showLevelSelector('${name}', ${level})" style="background: #8b5cf6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; white-space: nowrap;">
                    <i class="fas fa-book-open" style="font-size: 0.8rem; margin-right: 0.5rem;"></i>Ver Níveis
                </button>
            </div>
            <div id="description-${name.replace(/\s+/g, '-')}" style="background: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 1rem;">
                <p style="color: #ffffff; margin: 0; line-height: 1.6;">
                    ${currentDescription}
                </p>
            </div>
            <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div style="background: #8b5cf6; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">
                    Nível ${level}/5
                </div>
                <div style="width: 100px; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${(level/5)*100}%; height: 100%; background: #8b5cf6;"></div>
                </div>
            </div>
        `;
        
        // Hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(139, 92, 246, 0.4)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(139, 92, 246, 0.2)';
        });
        
        container.insertBefore(card, emptyMessage);
    });
    
    console.log('✅ Biblioteca carregada com sucesso!');
}

// Função para atualizar após compra
function updateLibraryAfterPurchase() {
    console.log('🛒 Atualizando biblioteca após compra...');
    setTimeout(loadSimpleLibrary, 100);
}

// Event listeners
window.addEventListener('knowledgePurchased', () => {
    isViewingLevel = false;
    updateLibraryAfterPurchase();
});
window.addEventListener('knowledgeUpdated', () => {
    isViewingLevel = false;
    updateLibraryAfterPurchase();
});

// Carregar quando a página estiver pronta
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadSimpleLibrary, 1000);
});

// Variável para controlar se está em modo visualização
let isViewingLevel = false;

// Atualizar a cada 10 segundos, mas só se não estiver visualizando
setInterval(() => {
    if (!isViewingLevel) {
        loadSimpleLibrary();
    }
}, 10000);

// Função para mostrar seletor de níveis
function showLevelSelector(knowledgeName, maxLevel) {
    // Criar modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="color: #ffffff; margin: 0;">${knowledgeName.charAt(0).toUpperCase() + knowledgeName.slice(1)}</h3>
            <button id="close-modal-btn" style="background: #dc3545; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-times" style="font-size: 0.8rem;"></i>
            </button>
        </div>
        <div style="display: grid; gap: 0.5rem;">
            ${Array.from({length: maxLevel}, (_, i) => {
                const lvl = i + 1;
                return `
                    <button onclick="showLevelDescription('${knowledgeName}', ${lvl})" style="
                        background: ${lvl === maxLevel ? '#8b5cf6' : 'rgba(255,255,255,0.1)'};
                        color: white;
                        border: 1px solid ${lvl === maxLevel ? '#8b5cf6' : 'rgba(255,255,255,0.2)'};
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        text-align: left;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='#8b5cf6'" onmouseout="this.style.background='${lvl === maxLevel ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}'">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span><strong>Nível ${lvl}</strong></span>
                            ${lvl === maxLevel ? '<i class="fas fa-star" style="color: #ffd700;"></i>' : ''}
                        </div>
                    </button>
                `;
            }).join('')}
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Adicionar event listener para o botão X
    const closeBtn = modalContent.querySelector('#close-modal-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Fechar com ESC
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// Função para mostrar descrição de nível específico
function showLevelDescription(knowledgeName, selectedLevel) {
    console.log(`📖 Mostrando nível ${selectedLevel} de ${knowledgeName}`);
    
    // Ativar modo visualização
    isViewingLevel = true;
    
    // Buscar dados do conhecimento
    let knowledgeInfo = null;
    if (knowledgeLoader && knowledgeLoader.isLoaded()) {
        knowledgeInfo = knowledgeLoader.searchKnowledge(knowledgeName);
    }
    
    // Obter descrição do nível
    let description = `Conhecimento sobre ${knowledgeName} - Nível ${selectedLevel}.`;
    if (knowledgeInfo && knowledgeInfo.descriptions && knowledgeInfo.descriptions[selectedLevel]) {
        description = knowledgeInfo.descriptions[selectedLevel];
    }
    
    // Atualizar descrição no card
    const descriptionElement = document.getElementById(`description-${knowledgeName.replace(/\s+/g, '-')}`);
    if (descriptionElement) {
        const ownedKnowledge = JSON.parse(localStorage.getItem('ownedKnowledge') || '{}');
        const userLevel = ownedKnowledge[knowledgeName.toLowerCase()] || 1;
        
        descriptionElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="color: #8b5cf6; font-weight: bold; font-size: 0.85rem;">Visualizando Nível ${selectedLevel}</span>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    ${selectedLevel !== userLevel ? '<span style="color: #ffd700; font-size: 0.75rem;"><i class="fas fa-eye" style="font-size: 0.7rem;"></i> Visualização</span>' : ''}
                    <button onclick="resetToUserLevel('${knowledgeName}')" style="background: #28a745; color: white; border: none; padding: 0.2rem 0.4rem; border-radius: 3px; cursor: pointer; font-size: 0.7rem;">
                        <i class="fas fa-undo" style="font-size: 0.6rem;"></i> Voltar
                    </button>
                </div>
            </div>
            <p style="color: #ffffff; margin: 0; line-height: 1.6;">
                ${description}
            </p>
        `;
    }
    
    // Fechar modal
    const modal = document.querySelector('div[style*="position: fixed"]');
    if (modal) {
        modal.remove();
    }
}

// Função para voltar ao nível do usuário
function resetToUserLevel(knowledgeName) {
    console.log(`🔄 Voltando ao nível do usuário para ${knowledgeName}`);
    
    // Desativar modo visualização
    isViewingLevel = false;
    
    // Recarregar biblioteca para mostrar nível original
    loadSimpleLibrary();
}