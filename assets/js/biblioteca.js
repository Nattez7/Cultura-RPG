// Sistema de biblioteca
let ownedKnowledge = {};

// Carregar conhecimentos do sistema RPG
function loadOwnedKnowledge() {
    const playerData = JSON.parse(localStorage.getItem('cultura_rpg_player'));
    if (playerData && playerData.knowledge) {
        ownedKnowledge = playerData.knowledge;
    }
    return ownedKnowledge;
}

// Dados dos conhecimentos com descrições por nível
const knowledgeData = {
    'Samba': {
        icon: 'fas fa-music',
        category: 'Música',
        descriptions: {
            1: 'O samba nasceu no Rio de Janeiro entre 1916-1917, nas comunidades afro-brasileiras da Praça Onze e morros da Tijuca, Mangueira e Salgueiro. A primeira gravação foi "Pelo Telefone" de Donga e Mauro de Almeida em 1917.',
            2: 'O samba possui compasso 2/4 com síncope característica, criando o "balanco" único. Originou-se da fusão do lundu, maxixe e batuques africanos com a polca europeia. As "tias baianas" como Tia Ciata foram fundamentais, promovendo encontros musicais em suas casas.',
            3: 'Subgêneros principais: Samba-enredo (escolas de samba, narrativo), Samba de roda (Bahia, Patrimônio UNESCO 2005), Samba-canção (romântico, anos 1930), Pagode (anos 1980, Cacique de Ramos), Samba de breque (pausas dramáticas), Samba de gafieira (instrumental para dança).',
            4: 'Grandes mestres: Pixinguinha (harmonização), Cartola (poesia), Noel Rosa (crônica urbana), Ary Barroso ("Aquarela do Brasil"), Nelson Cavaquinho (melancolia), Clementina de Jesus (samba rural), Dona Ivone Lara (primeira mulher compositora de escola de samba), Paulinho da Viola (tradição).',
            5: 'O samba transcendeu fronteiras: influenciou jazz americano, música latina e world music. Instrumentação complexa: cavaquinho (harmonia), pandeiro (marcação), tan-tan (grave), cuíca (efeitos), surdo (base), tamborim (repique), reco-reco (percussão). Representa resistência, identidade nacional e democracia racial brasileira. Escola de samba é instituição social única no mundo.'
        }
    },
    'Bossa Nova': {
        icon: 'fas fa-music',
        category: 'Música',
        descriptions: {
            1: 'A Bossa Nova nasceu em 1958 com "Chega de Saudade" de Tom Jobim e Vinicius de Moraes, interpretada por João Gilberto. Surgiu nos apartamentos de Copacabana e Ipanema, refletindo o otimismo do Brasil dos anos JK (Juscelino Kubitschek).',
            2: 'Características musicais: harmonias jazzisticas (acordes com 7ª, 9ª, 11ª), batida de violão única (polegar no baixo, dedos na harmonia), canto sussurrado, andamento moderado. Influenciada pelo cool jazz de Miles Davis e Chet Baker, mas mantendo a base rítmica do samba.',
            3: 'Triângulo dourado: Tom Jobim (compositor/arranjador), Vinicius de Moraes (letrista/poeta), João Gilberto (intérprete/criador da batida). Clássicos: "Garota de Ipanema" (mais tocada no mundo), "Corcovado", "Desafinado", "Wave", "Insensatez". Outros nomes: Carlos Lyra, Roberto Menescal, Nara Leão, Sylvia Telles.',
            4: 'Marco internacional: concerto no Carnegie Hall (1962) com Stan Getz, Charlie Byrd, João Gilberto e Tom Jobim. Álbum "Getz/Gilberto" (1964) ganhou Grammy. Frank Sinatra gravou "Garota de Ipanema". Influenciou Beatles, Stevie Wonder, Diana Krall. Criou o "Brazilian Jazz" mundial.',
            5: 'Revolução estética: transformou música popular em arte erudita sem perder popularidade. Técnica do violão: uso de cordas soltas, harmonias abertas, economia de movimentos. Letras sofisticadas sobre amor, natureza e cotidiano urbano. Representa a modernidade brasileira, influenciando gêneros como MPB, jazz fusion e world music. Patrimonio cultural que projetou o Brasil como país de cultura refinada.'
        }
    },
    'Capoeira': {
        icon: 'fas fa-fist-raised',
        category: 'Artes Marciais',
        descriptions: {
            1: 'A capoeira originou-se no século XVI com escravos africanos (principalmente bantos de Angola) no Brasil colonial. Combina luta, dança, acrobacia e música numa arte única. O nome pode derivar de "capuêra" (vegetação rasteira) onde era praticada secretamente.',
            2: 'Desenvolvida como resistência cultural: escravos treinavam luta disfarçada de dança para enganar feitores. A "roda" simboliza o ciclo da vida e igualdade. Elementos essenciais: ginga (movimento base), esquivas (defesas), golpes (ataques), floreios (acrobacias). Proibida após abolição (1888), praticada clandestinamente.',
            3: 'Dois estilos principais: CAPOEIRA ANGOLA - tradicional, criada por Mestre Pastinha (1889-1981), movimentos baixos, jogo lento, filosofia ancestral, berimbau gunga marca ritmo. CAPOEIRA REGIONAL - moderna, criada por Mestre Bimba (1899-1974) em 1928, mais acrobática, sequências de ensino, primeira academia oficial (1937).',
            4: 'Instrumentos da orquestra: Berimbau (arco musical, 3 tipos: gunga-grave, médio-médio, viola-agudo), Pandeiro, Atabaque, Agogô, Reco-reco. Cantigas: ladainha (solo reflexivo), chula (coro), corridos (diálogo). Mestres lendários: Besouro Cordão de Ouro, Mestre Waldemar, Mestre João Grande, Mestre Acordeon.',
            5: 'Patrimônio Cultural Imaterial da Humanidade (UNESCO, 2014). Filosofia: malicia (esperteza), mandinga (magia/energia), axé (força vital). Movimentos icônicos: Ginga (base), Au (estrela), Meia-lua (chute circular), Martelo (chute frontal), Macaco (salto), Bananeira (parada de mão). Graduacão por cordas coloridas. Presente em 160 países, símbolo da resistência afro-brasileira e democracia racial.'
        }
    }
};

// Toggle modo escuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Função para obter nome do nível
function getLevelName(level) {
    const levels = ['', 'Iniciante', 'Aprendiz', 'Conhecedor', 'Especialista', 'Mestre'];
    return levels[level] || 'Iniciante';
}

// Função para atualizar biblioteca
function updateLibrary() {
    console.log('🔄 Atualizando biblioteca...');
    
    // Forçar reload dos dados do dataManager
    if (dataManager.currentUser) {
        dataManager.loadFromLocalStorage();
    }
    
    const gameData = dataManager.getGameData();
    const ownedKnowledge = gameData.ownedKnowledge || {};
    
    console.log('📚 Conhecimentos encontrados:', ownedKnowledge);
    console.log('📊 Total de conhecimentos:', Object.keys(ownedKnowledge).length);
    
    const ownedKnowledgeContainer = document.getElementById('owned-knowledge');
    const emptyLibrary = document.getElementById('empty-library');
    
    if (!ownedKnowledgeContainer || !emptyLibrary) {
        console.error('❌ Elementos da biblioteca não encontrados');
        return;
    }
    
    // Limpa conteúdo atual (exceto mensagem vazia)
    const knowledgeCards = ownedKnowledgeContainer.querySelectorAll('.knowledge-card');
    knowledgeCards.forEach(card => card.remove());
    
    if (Object.keys(ownedKnowledge).length === 0) {
        console.log('📭 Nenhum conhecimento encontrado - mostrando biblioteca vazia');
        emptyLibrary.style.display = 'block';
        return;
    }
    
    console.log('✅ Conhecimentos encontrados - ocultando biblioteca vazia');
    emptyLibrary.style.display = 'none';
    
    // Adiciona cada conhecimento adquirido
    Object.entries(ownedKnowledge).forEach(([name, level]) => {
        console.log('Processando conhecimento:', name, 'Nível:', level);
        
        // Tentar encontrar o conhecimento nos dados do Firestore
        let data = null;
        const searchName = name.charAt(0).toUpperCase() + name.slice(1);
        
        // Primeiro, tentar buscar nos dados carregados do Firestore
        if (knowledgeLoader && knowledgeLoader.isLoaded()) {
            data = knowledgeLoader.searchKnowledge(name);
            if (data) {
                console.log('Conhecimento encontrado no Firestore:', data.name);
            }
        }
        
        // Se não encontrou no Firestore, procurar nos dados locais
        if (!data) {
            for (const [key, value] of Object.entries(knowledgeData)) {
                if (key.toLowerCase() === name.toLowerCase() || 
                    key.toLowerCase().includes(name.toLowerCase()) ||
                    name.toLowerCase().includes(key.toLowerCase())) {
                    data = value;
                    console.log('Conhecimento encontrado localmente:', key);
                    break;
                }
            }
        }
        
        // Se ainda não encontrou, criar dados genéricos
        if (!data) {
            console.log('Criando dados genéricos para:', searchName);
            data = {
                name: searchName,
                icon: 'fas fa-book',
                category: 'Cultura Brasileira',
                descriptions: {
                    1: `Conhecimento básico sobre ${searchName}`,
                    2: `Conhecimento intermediário sobre ${searchName}`,
                    3: `Conhecimento avançado sobre ${searchName}`,
                    4: `Conhecimento especializado sobre ${searchName}`,
                    5: `Conhecimento completo sobre ${searchName}`
                }
            };
        }
        
        // Obtém a descrição do nível atual
        const description = data.descriptions[level] || data.descriptions[1] || 'Conhecimento adquirido na loja.';
        
        const knowledgeCard = document.createElement('div');
        knowledgeCard.className = 'knowledge-card';
        knowledgeCard.innerHTML = `
            <i class="${data.icon}"></i>
            <h3>${searchName} - Nível ${level}</h3>
            <p class="knowledge-description">${description}</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${(level / 5) * 100}%"></div>
            </div>
            <div class="knowledge-controls">
                <span class="level-info">${level}/5 - ${getLevelName(level)}</span>
                <button class="level-selector-btn" onclick="openLevelSelector('${searchName}', ${level}, '${name}')">
                    <i class="fas fa-book-open"></i> Ver Níveis
                </button>
            </div>
        `;
        
        ownedKnowledgeContainer.insertBefore(knowledgeCard, emptyLibrary);
    });
}

// Função para abrir seletor de níveis
function openLevelSelector(knowledgeName, maxLevel, originalKey) {
    const modal = document.createElement('div');
    modal.className = 'level-modal';
    modal.innerHTML = `
        <div class="level-modal-content">
            <div class="level-modal-header">
                <h3>${knowledgeName}</h3>
                <button class="close-modal" onclick="this.closest('.level-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="level-list">
                ${Array.from({length: maxLevel}, (_, i) => {
                    const level = i + 1;
                    const levelName = getLevelName(level);
                    return `
                        <button class="level-item" onclick="showLevelDescription('${knowledgeName}', ${level}, '${originalKey || knowledgeName}')">
                            <span class="level-number">${level}</span>
                            <span class="level-name">${levelName}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Função para mostrar descrição de nível específico
function showLevelDescription(knowledgeName, level, originalKey) {
    // Buscar dados do conhecimento
    let data = null;
    for (const [key, value] of Object.entries(knowledgeData)) {
        if (key.toLowerCase() === knowledgeName.toLowerCase() || 
            key.toLowerCase().includes(knowledgeName.toLowerCase()) ||
            knowledgeName.toLowerCase().includes(key.toLowerCase())) {
            data = value;
            break;
        }
    }
    
    if (!data) {
        data = {
            descriptions: {
                1: `Conhecimento básico sobre ${knowledgeName}`,
                2: `Conhecimento intermediário sobre ${knowledgeName}`,
                3: `Conhecimento avançado sobre ${knowledgeName}`,
                4: `Conhecimento especializado sobre ${knowledgeName}`,
                5: `Conhecimento completo sobre ${knowledgeName}`
            }
        };
    }
    
    const description = data.descriptions[level] || `Nível ${level} de ${knowledgeName}`;
    const levelName = getLevelName(level);
    
    // Atualizar descrição na biblioteca
    const knowledgeCards = document.querySelectorAll('.knowledge-card');
    knowledgeCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        if (title.includes(knowledgeName)) {
            const descriptionElement = card.querySelector('.knowledge-description');
            descriptionElement.textContent = description;
            
            // Obter nível atual do usuário
            const gameData = dataManager.getGameData();
            const ownedKnowledge = gameData.ownedKnowledge || {};
            const currentLevel = ownedKnowledge[originalKey || knowledgeName.toLowerCase()];
            
            // Atualizar o título para mostrar o nível selecionado
            card.querySelector('h3').textContent = `${knowledgeName} - Nível ${level} (${levelName})`;
            
            // Se não for o nível atual, adiciona indicação
            if (level !== currentLevel) {
                card.querySelector('h3').innerHTML += ` <small style="opacity: 0.7">(Visualizando)</small>`;
            }
        }
    });
    
    // Fecha o modal
    document.querySelector('.level-modal').remove();
}

// Inicializar biblioteca quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    updateLibrary();
});

// Atualizar quando dados do usuário carregarem
window.addEventListener('userDataLoaded', () => {
    updateLibrary();
});

// Atualizar quando comprar conhecimento
window.addEventListener('knowledgePurchased', () => {
    console.log('Evento knowledgePurchased recebido');
    setTimeout(updateLibrary, 500);
});

// Novo evento mais direto
window.addEventListener('knowledgeUpdated', (event) => {
    console.log('Evento knowledgeUpdated recebido:', event.detail);
    setTimeout(updateLibrary, 100);
});

// Atualizar biblioteca a cada 5 segundos para pegar compras da loja
setInterval(updateLibrary, 5000);

// Função para forçar atualização manual
function forceUpdateLibrary() {
    console.log('🔄 Forçando atualização da biblioteca...');
    
    // Recarregar dados do localStorage
    if (dataManager.currentUser) {
        dataManager.loadFromLocalStorage();
    }
    
    // Atualizar biblioteca
    updateLibrary();
    
    // Feedback visual
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Atualizado!';
    btn.style.background = '#28a745';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '#8b5cf6';
    }, 2000);
}