// Estado do jogo
let gameState = {
    mesas: [],
    minhasMesas: [],
    currentUser: null
};

// Dados das missões
const missions = {
    carnaval: {
        name: 'As Origens do Carnaval',
        description: 'Explore as raízes culturais do Carnaval brasileiro',
        difficulty: 'iniciante',
        duration: '2-3 horas'
    },
    quilombo: {
        name: 'A Resistência de Palmares',
        description: 'Viva a épica resistência do Quilombo dos Palmares',
        difficulty: 'intermediario',
        duration: '3-4 horas'
    },
    amazonia: {
        name: 'Guardiões da Floresta',
        description: 'Proteja a Amazônia ao lado de Chico Mendes',
        difficulty: 'avancado',
        duration: '4-5 horas'
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeGameSystem();
    loadMesasExemplo();
});

// Navegação
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
}

// Sistema de jogo
function initializeGameSystem() {
    const criarMesaForm = document.getElementById('criar-mesa-form');
    if (criarMesaForm) {
        criarMesaForm.addEventListener('submit', criarMesa);
    }
    
    // Definir data mínima como agora
    const dataInput = document.getElementById('mesa-data');
    if (dataInput) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        dataInput.min = now.toISOString().slice(0, 16);
    }
}

// Mostrar abas
function showTab(tabName) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Ativar aba selecionada
    event.target.classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Carregar conteúdo específico da aba
    if (tabName === 'mesas') {
        loadMesas();
    } else if (tabName === 'minhas') {
        loadMinhasMesas();
    }
}

// Carregar mesas exemplo
function loadMesasExemplo() {
    const mesasExemplo = [
        {
            id: 1,
            nome: 'Descobrindo o Carnaval Carioca',
            missao: 'carnaval',
            mestre: 'Ana Silva',
            maxPlayers: 4,
            currentPlayers: 2,
            data: '2024-12-20T19:00',
            descricao: 'Uma aventura para iniciantes explorando as origens do Carnaval no Rio de Janeiro colonial. Venha descobrir como diferentes culturas se uniram para criar nossa maior festa!',
            status: 'aberta'
        },
        {
            id: 2,
            nome: 'Heróis de Palmares',
            missao: 'quilombo',
            mestre: 'Carlos Santos',
            maxPlayers: 5,
            currentPlayers: 5,
            data: '2024-12-21T14:00',
            descricao: 'Mesa para jogadores experientes. Vivenciem a resistência quilombola ao lado de Zumbi e Dandara. Estratégia e coragem serão essenciais!',
            status: 'cheia'
        },
        {
            id: 3,
            nome: 'Defensores da Amazônia',
            missao: 'amazonia',
            mestre: 'Maria Oliveira',
            maxPlayers: 6,
            currentPlayers: 3,
            data: '2024-12-22T16:30',
            descricao: 'Junte-se à luta pela preservação da floresta amazônica. Uma aventura que combina ação, diplomacia e consciência ambiental.',
            status: 'aberta'
        }
    ];
    
    gameState.mesas = mesasExemplo;
    loadMesas();
}

// Carregar mesas
function loadMesas() {
    const mesasList = document.getElementById('mesas-list');
    if (!mesasList) return;
    
    const filterDifficulty = document.getElementById('filter-difficulty')?.value || '';
    const filterMission = document.getElementById('filter-mission')?.value || '';
    
    let mesasFiltradas = gameState.mesas;
    
    if (filterDifficulty) {
        mesasFiltradas = mesasFiltradas.filter(mesa => 
            missions[mesa.missao]?.difficulty === filterDifficulty
        );
    }
    
    if (filterMission) {
        mesasFiltradas = mesasFiltradas.filter(mesa => mesa.missao === filterMission);
    }
    
    if (mesasFiltradas.length === 0) {
        mesasList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Nenhuma mesa encontrada com os filtros selecionados.</p>';
        return;
    }
    
    mesasList.innerHTML = mesasFiltradas.map(mesa => createMesaCard(mesa)).join('');
}

// Criar card de mesa
function createMesaCard(mesa) {
    const mission = missions[mesa.missao];
    const dataFormatada = new Date(mesa.data).toLocaleString('pt-BR');
    const statusClass = `status-${mesa.status}`;
    const statusText = {
        'aberta': 'Aberta',
        'cheia': 'Lotada',
        'iniciada': 'Em Andamento'
    };
    
    return `
        <div class="mesa-card">
            <div class="mesa-header">
                <h4 class="mesa-title">${mesa.nome}</h4>
                <span class="mesa-status ${statusClass}">${statusText[mesa.status]}</span>
            </div>
            
            <div class="mesa-info">
                <div class="info-item">
                    <span>🎭</span>
                    <span><strong>Missão:</strong> ${mission.name}</span>
                </div>
                <div class="info-item">
                    <span>👑</span>
                    <span><strong>Mestre:</strong> ${mesa.mestre}</span>
                </div>
                <div class="info-item">
                    <span>📅</span>
                    <span><strong>Data:</strong> ${dataFormatada}</span>
                </div>
                <div class="info-item">
                    <span>⏱️</span>
                    <span><strong>Duração:</strong> ${mission.duration}</span>
                </div>
                <div class="info-item">
                    <span>📊</span>
                    <span><strong>Dificuldade:</strong> ${mission.difficulty}</span>
                </div>
            </div>
            
            <div class="mesa-description">
                ${mesa.descricao}
            </div>
            
            <div class="mesa-actions">
                <span class="players-count">
                    👥 ${mesa.currentPlayers}/${mesa.maxPlayers} jogadores
                </span>
                <button class="join-btn" 
                        onclick="joinMesa(${mesa.id})" 
                        ${mesa.status !== 'aberta' ? 'disabled' : ''}>
                    ${mesa.status === 'aberta' ? 'Inscrever-se' : 'Indisponível'}
                </button>
            </div>
        </div>
    `;
}

// Inscrever-se em mesa
function joinMesa(mesaId) {
    const mesa = gameState.mesas.find(m => m.id === mesaId);
    if (!mesa || mesa.status !== 'aberta') return;
    
    const nomeJogador = prompt('Digite seu nome para se inscrever na mesa:');
    if (!nomeJogador) return;
    
    // Verificar se já está inscrito
    if (!mesa.jogadores) mesa.jogadores = [];
    if (mesa.jogadores.some(j => j.nome === nomeJogador)) {
        alert('Você já está inscrito nesta mesa!');
        return;
    }
    
    // Adicionar jogador
    mesa.jogadores.push({
        nome: nomeJogador,
        dataInscricao: new Date()
    });
    
    mesa.currentPlayers++;
    
    // Verificar se mesa ficou cheia
    if (mesa.currentPlayers >= mesa.maxPlayers) {
        mesa.status = 'cheia';
    }
    
    // Adicionar às minhas mesas
    if (!gameState.minhasMesas.some(m => m.id === mesaId)) {
        gameState.minhasMesas.push({
            ...mesa,
            tipo: 'jogador',
            meuNome: nomeJogador
        });
    }
    
    alert(`Inscrição realizada com sucesso! O mestre ${mesa.mestre} entrará em contato.`);
    loadMesas();
}

// Criar mesa
function criarMesa(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const novaMesa = {
        id: Date.now(),
        nome: document.getElementById('mesa-nome').value,
        missao: document.getElementById('mesa-missao').value,
        mestre: document.getElementById('mestre-nome').value,
        maxPlayers: parseInt(document.getElementById('mesa-max-players').value),
        currentPlayers: 0,
        data: document.getElementById('mesa-data').value,
        descricao: document.getElementById('mesa-descricao').value,
        status: 'aberta',
        jogadores: []
    };
    
    // Adicionar à lista de mesas
    gameState.mesas.push(novaMesa);
    
    // Adicionar às minhas mesas como mestre
    gameState.minhasMesas.push({
        ...novaMesa,
        tipo: 'mestre'
    });
    
    alert('Mesa criada com sucesso!');
    
    // Limpar formulário
    event.target.reset();
    
    // Voltar para aba de mesas
    showTab('mesas');
    document.querySelector('[onclick="showTab(\'mesas\')"]').click();
}

// Carregar minhas mesas
function loadMinhasMesas() {
    const minhasMesasList = document.getElementById('minhas-mesas-list');
    if (!minhasMesasList) return;
    
    if (gameState.minhasMesas.length === 0) {
        minhasMesasList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Você ainda não criou nem se inscreveu em nenhuma mesa.</p>';
        return;
    }
    
    minhasMesasList.innerHTML = gameState.minhasMesas.map(mesa => createMinhaMesaCard(mesa)).join('');
}

// Criar card de minha mesa
function createMinhaMesaCard(mesa) {
    const mission = missions[mesa.missao];
    const dataFormatada = new Date(mesa.data).toLocaleString('pt-BR');
    const tipoIcon = mesa.tipo === 'mestre' ? '👑' : '🎭';
    const tipoText = mesa.tipo === 'mestre' ? 'Mestre' : 'Jogador';
    
    return `
        <div class="mesa-card">
            <div class="mesa-header">
                <h4 class="mesa-title">${mesa.nome}</h4>
                <span class="mesa-status status-${mesa.status}">${tipoIcon} ${tipoText}</span>
            </div>
            
            <div class="mesa-info">
                <div class="info-item">
                    <span>🎭</span>
                    <span><strong>Missão:</strong> ${mission.name}</span>
                </div>
                <div class="info-item">
                    <span>📅</span>
                    <span><strong>Data:</strong> ${dataFormatada}</span>
                </div>
                <div class="info-item">
                    <span>👥</span>
                    <span><strong>Jogadores:</strong> ${mesa.currentPlayers}/${mesa.maxPlayers}</span>
                </div>
            </div>
            
            <div class="mesa-description">
                ${mesa.descricao}
            </div>
            
            ${mesa.tipo === 'mestre' ? createMestreActions(mesa) : createJogadorActions(mesa)}
        </div>
    `;
}

// Ações do mestre
function createMestreActions(mesa) {
    return `
        <div class="mesa-actions">
            <button class="join-btn" onclick="gerenciarMesa(${mesa.id})">
                Gerenciar Mesa
            </button>
            <button class="join-btn" onclick="cancelarMesa(${mesa.id})" 
                    style="background: linear-gradient(45deg, #dc3545, #c82333);">
                Cancelar Mesa
            </button>
        </div>
    `;
}

// Ações do jogador
function createJogadorActions(mesa) {
    return `
        <div class="mesa-actions">
            <span style="color: #666;">
                Inscrito como: <strong>${mesa.meuNome}</strong>
            </span>
            <button class="join-btn" onclick="sairMesa(${mesa.id})"
                    style="background: linear-gradient(45deg, #dc3545, #c82333);">
                Sair da Mesa
            </button>
        </div>
    `;
}

// Gerenciar mesa (mestre)
function gerenciarMesa(mesaId) {
    const mesa = gameState.mesas.find(m => m.id === mesaId);
    if (!mesa) return;
    
    let jogadoresText = 'Jogadores inscritos:\n';
    if (mesa.jogadores && mesa.jogadores.length > 0) {
        mesa.jogadores.forEach((jogador, index) => {
            jogadoresText += `${index + 1}. ${jogador.nome}\n`;
        });
    } else {
        jogadoresText += 'Nenhum jogador inscrito ainda.';
    }
    
    alert(jogadoresText);
}

// Cancelar mesa (mestre)
function cancelarMesa(mesaId) {
    if (!confirm('Tem certeza que deseja cancelar esta mesa?')) return;
    
    // Remover das mesas gerais
    gameState.mesas = gameState.mesas.filter(m => m.id !== mesaId);
    
    // Remover das minhas mesas
    gameState.minhasMesas = gameState.minhasMesas.filter(m => m.id !== mesaId);
    
    alert('Mesa cancelada com sucesso!');
    loadMinhasMesas();
    loadMesas();
}

// Sair da mesa (jogador)
function sairMesa(mesaId) {
    if (!confirm('Tem certeza que deseja sair desta mesa?')) return;
    
    const mesa = gameState.mesas.find(m => m.id === mesaId);
    if (mesa) {
        mesa.currentPlayers--;
        if (mesa.status === 'cheia') {
            mesa.status = 'aberta';
        }
    }
    
    // Remover das minhas mesas
    gameState.minhasMesas = gameState.minhasMesas.filter(m => m.id !== mesaId);
    
    alert('Você saiu da mesa com sucesso!');
    loadMinhasMesas();
    loadMesas();
}

// Utilitários
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Adicionar event listeners para filtros
document.addEventListener('DOMContentLoaded', function() {
    const filterDifficulty = document.getElementById('filter-difficulty');
    const filterMission = document.getElementById('filter-mission');
    
    if (filterDifficulty) {
        filterDifficulty.addEventListener('change', loadMesas);
    }
    
    if (filterMission) {
        filterMission.addEventListener('change', loadMesas);
    }
});

// Funções dos personagens (mantidas para compatibilidade)
function selectCharacter(characterId) {
    // Remover seleção anterior
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Adicionar seleção atual
    event.target.closest('.character-card').classList.add('selected');
}

function selectMission(missionId) {
    // Remover seleção anterior
    document.querySelectorAll('.mission-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Adicionar seleção atual
    event.target.closest('.mission-card').classList.add('selected');
}