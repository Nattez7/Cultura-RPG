let zoom = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let customTokens = [];
let mesaData = null;

const canvas = document.getElementById('canvas');
const mapLayer = document.getElementById('map-layer');

// Carregar mesa pela URL
async function loadMesaFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const codigo = urlParams.get('codigo');
    
    if (!codigo) {
        document.getElementById('mesa-title').textContent = 'Mesa Virtual - Código não fornecido';
        return;
    }
    
    try {
        // Simular busca da mesa (integrar com Firebase depois)
        mesaData = { codigo: codigo, nome: 'Mesa de Aventura' };
        document.getElementById('mesa-title').textContent = mesaData.nome;
        document.getElementById('mesa-code').textContent = `Código: ${codigo}`;
        
        loadCustomTokens();
    } catch (error) {
        console.error('Erro ao carregar mesa:', error);
        document.getElementById('mesa-title').textContent = 'Erro ao carregar mesa';
    }
}

// Pan do mapa
canvas.addEventListener('mousedown', (e) => {
    if (tempPanMode) {
        isDragging = true;
        dragStart.x = e.clientX - panX;
        dragStart.y = e.clientY - panY;
        canvas.classList.add('dragging');
        return;
    }
    if (rulerMode) {
        handleRulerClick(e);
        return;
    }
    if (drawMode) {
        startDrawing(e);
        return;
    }
    isDragging = true;
    dragStart.x = e.clientX - panX;
    dragStart.y = e.clientY - panY;
    canvas.classList.add('dragging');
});

// Event listeners globais para desenho
document.addEventListener('mousedown', (e) => {
    if (drawMode) {
        startDrawing(e);
    }
});

document.addEventListener('mousemove', (e) => {
    if (drawMode && isDrawing) {
        draw(e);
    }
});

document.addEventListener('mouseup', () => {
    if (drawMode) {
        stopDrawing();
    }
});

canvas.addEventListener('mousemove', (e) => {
    // Atualizar coordenadas - usar a mesma lógica para desenho
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - panX) / zoom);
    const y = Math.floor((e.clientY - rect.top - panY) / zoom);
    document.getElementById('coordinates').textContent = `X: ${x}, Y: ${y}`;
    
    if (drawMode && isDrawing && !tempPanMode) {
        draw(e);
    } else if (isDragging) {
        panX = e.clientX - dragStart.x;
        panY = e.clientY - dragStart.y;
        updateTransform();
    }
});

canvas.addEventListener('mouseup', () => {
    if (drawMode && !tempPanMode) {
        stopDrawing();
    }
    isDragging = false;
    canvas.classList.remove('dragging');
});

// Zoom
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoom *= delta;
    zoom = Math.max(0.1, Math.min(5, zoom));
    updateTransform();
});

function zoomIn() {
    zoom *= 1.2;
    zoom = Math.min(5, zoom);
    updateTransform();
}

function zoomOut() {
    zoom *= 0.8;
    zoom = Math.max(0.1, zoom);
    updateTransform();
}



function updateTransform() {
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
}

// Grid
function toggleGrid() {
    const gridLayer = document.getElementById('grid-layer');
    gridLayer.classList.toggle('hidden');
}

// Upload de mapa
document.getElementById('map-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            mapLayer.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});

// Upload de token personalizado
document.getElementById('token-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        addCustomToken(file);
    }
});

// Adicionar token personalizado
function addCustomToken(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const tokenId = Date.now() + Math.random();
        const customToken = {
            id: tokenId,
            image: e.target.result,
            name: file.name
        };
        
        customTokens.push(customToken);
        saveCustomTokens();
        renderCustomTokens();
    };
    reader.readAsDataURL(file);
}

// Renderizar tokens personalizados
function renderCustomTokens() {
    const container = document.getElementById('custom-tokens');
    container.innerHTML = customTokens.map(token => `
        <div class="custom-token" 
             data-token-id="${token.id}"
             onclick="createTokenFromCustom('${token.id}')"
             style="background-image: url('${token.image}')"
             title="${token.name}">
            <button class="remove-token" onclick="removeCustomToken('${token.id}', event)">×</button>
        </div>
    `).join('');
}

// Criar token a partir do personalizado
function createTokenFromCustom(tokenId) {
    const customToken = customTokens.find(t => t.id === tokenId);
    if (customToken) {
        const x = 200 + Math.random() * 100;
        const y = 200 + Math.random() * 100;
        createToken(customToken.image, x, y, customToken.name);
    }
}

// Remover token personalizado
function removeCustomToken(tokenId, event) {
    event.stopPropagation();
    customTokens = customTokens.filter(t => t.id !== tokenId);
    saveCustomTokens();
    renderCustomTokens();
}

// Salvar tokens personalizados no localStorage
function saveCustomTokens() {
    localStorage.setItem(`custom-tokens-${mesaData?.codigo || 'default'}`, JSON.stringify(customTokens));
}

// Carregar tokens personalizados do localStorage
function loadCustomTokens() {
    const saved = localStorage.getItem(`custom-tokens-${mesaData?.codigo || 'default'}`);
    if (saved) {
        customTokens = JSON.parse(saved);
        renderCustomTokens();
    }
}

// Dados personalizados
function rollCustomDice() {
    const input = document.getElementById('dice-input').value.trim();
    if (!input) return;
    
    if (processAdvancedCommand(input)) {
        document.getElementById('dice-result').textContent = 'Comando executado';
    } else {
        document.getElementById('dice-result').textContent = 'Formato inválido';
    }
}

function parseDiceRoll(input) {
    input = input.replace(/\s/g, '').toLowerCase();
    
    // Suporte a diferentes formatos de dados
    let match = input.match(/(\d+)d(\d+)([+-]\d+)?/);
    if (!match) {
        // Tentar formato simples: d20, d6, etc.
        match = input.match(/^d(\d+)([+-]\d+)?$/);
        if (match) {
            match = ['', '1', match[1], match[2]];
        }
    }
    
    if (!match) throw new Error('Formato inválido');
    
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    
    if (count > 100 || sides > 1000) throw new Error('Muitos dados');
    
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }
    
    total += modifier;
    
    let display = `${count}d${sides}`;
    if (modifier !== 0) {
        display += (modifier > 0 ? '+' : '') + modifier;
    }
    display += `: [${rolls.join(', ')}]`;
    if (modifier !== 0) {
        display += ` ${modifier > 0 ? '+' : ''}${modifier}`;
    }
    display += ` = ${total}`;
    
    return { display, total, rolls };
}

let playerToken = null;
let personagensDisponiveis = {};
let editingElement = null;
let selectedColor = '#ffffff';
let isDrawing = false;
let drawMode = false;
let selectMode = true;
let lastX = 0;
let lastY = 0;
let currentPath = null;
let currentColor = '#EBD677';
let currentSize = 3;
let rulerMode = false;
let rulerPoints = [];
let rulerLine = null;
let spacePressed = false;
let tempPanMode = false;

// Carregar personagens disponíveis
function carregarPersonagens() {
    personagensDisponiveis = {
        zumbi: {
            name: 'Zumbi dos Palmares',
            description: 'Líder quilombola, símbolo da resistência contra a escravidão.',
            stats: { força: 3, sabedoria: 1, carisma: 1 },
            background: 'Nascido livre em Palmares, foi capturado ainda criança e educado por um padre português.',
            talents: ['Liderança de Guerra: +1 dado extra em situações de combate', 'Resistência Quilombola: Pode rolar novamente falhas em testes de resistência física'],
            image: 'images/personagens/Zumbi dos Palmares.jpg'
        },
        maria: {
            name: 'Maria Bonita',
            description: 'Cangaceira corajosa, companheira de Lampião no sertão nordestino.',
            stats: { força: 2, sabedoria: 1, carisma: 2 },
            background: 'Maria Déa, conhecida como Maria Bonita, foi a primeira mulher a integrar um grupo de cangaceiros.',
            talents: ['Tiro Certeiro: +1 dado extra em ações com armas de fogo', 'Charme Sertanejo: Pode usar Carisma no lugar de Força em situações de intimidação'],
            image: 'images/personagens/Maria Bonita.webp'
        },
        chico: {
            name: 'Chico Mendes',
            description: 'Seringueiro e ambientalista, defensor da Amazônia.',
            stats: { força: 1, sabedoria: 2, carisma: 2 },
            background: 'Francisco Alves Mendes Filho foi um seringueiro, sindicalista e ativista ambiental brasileiro.',
            talents: ['Conhecimento da Floresta: +1 dado extra em ações relacionadas à natureza', 'Mobilização Popular: Pode rolar novamente falhas em testes de convencimento'],
            image: 'images/personagens/Chico Mendes.jpg'
        },
        dandara: {
            name: 'Dandara',
            description: 'Guerreira quilombola, estrategista militar de Palmares.',
            stats: { força: 2, sabedoria: 2, carisma: 1 },
            background: 'Guerreira negra que lutou contra o sistema escravocrata. Companheira de Zumbi.',
            talents: ['Mestre em Combate: +1 dado extra em lutas corpo a corpo', 'Táticas de Guerra: Pode usar Sabedoria no lugar de Força em combates estratégicos'],
            image: 'images/personagens/Dandara.jpeg'
        },
        santos: {
            name: 'Santos Dumont',
            description: 'Pioneiro da aviação, inventor e visionário brasileiro.',
            stats: { força: 1, sabedoria: 3, carisma: 1 },
            background: 'Alberto Santos Dumont foi um inventor, aeronauta e pioneiro da aviação.',
            talents: ['Genialidade Inventiva: +1 dado extra ao criar ou consertar máquinas', 'Visionário: Pode rolar novamente falhas em testes de inovação tecnológica'],
            image: 'images/personagens/Santos Dumont.jpg'
        },
        machado: {
            name: 'Machado de Assis',
            description: 'Maior escritor brasileiro, mestre da literatura nacional.',
            stats: { força: 1, sabedoria: 2, carisma: 2 },
            background: 'Joaquim Maria Machado de Assis foi um escritor brasileiro, considerado o maior nome da literatura nacional.',
            talents: ['Mestre das Palavras: +1 dado extra em persuasão através da eloquência', 'Análise Humana: Pode usar Sabedoria no lugar de Carisma para entender motivações'],
            image: 'images/personagens/Machado de Assis.jpg'
        },
        pixinguinha: {
            name: 'Pixinguinha',
            description: 'Compositor e instrumentista, pai do choro brasileiro.',
            stats: { força: 1, sabedoria: 1, carisma: 3 },
            background: 'Alfredo da Rocha Viana Filho, conhecido como Pixinguinha, foi um compositor brasileiro.',
            talents: ['Maestria Musical: +1 dado extra em ações envolvendo música', 'Alma do Choro: Pode rolar novamente falhas ao tentar conectar pessoas através da música'],
            image: 'images/personagens/Pixinguinha.jpg'
        },
        tarsila: {
            name: 'Tarsila do Amaral',
            description: 'Pintora modernista, ícone das artes plásticas brasileiras.',
            stats: { força: 1, sabedoria: 1, carisma: 3 },
            background: 'Tarsila de Aguiar do Amaral foi uma pintora e desenhista brasileira e uma das figuras centrais do movimento modernista.',
            talents: ['Visão Artística: +1 dado extra em ações criativas e artísticas', 'Inspiração Modernista: Pode usar Carisma no lugar de Sabedoria para resolver problemas'],
            image: 'images/personagens/Tarsila do Amaral.jpg'
        },
        lampiao: {
            name: 'Lampião',
            description: 'Rei do Cangaço, lendário líder do sertão nordestino.',
            stats: { força: 2, sabedoria: 1, carisma: 2 },
            background: 'Virgulino Ferreira da Silva, conhecido como Lampião, foi o mais famoso líder cangaceiro do Nordeste brasileiro.',
            talents: ['Rei do Sertão: +1 dado extra em ações no ambiente da caatinga', 'Liderança Cangaceira: Pode usar Carisma no lugar de Força para intimidar'],
            image: 'images/personagens/Lampiao.jpg'
        }
    };
}

// Mostrar modal de seleção de personagem
function mostrarSelecaoPersonagem() {
    const modal = document.getElementById('character-selection-modal');
    const grid = document.getElementById('characters-grid');
    
    // Carregar personagens se ainda não foram carregados
    if (Object.keys(personagensDisponiveis).length === 0) {
        carregarPersonagens();
    }
    
    // Criar cards dos personagens
    grid.innerHTML = Object.keys(personagensDisponiveis).map(id => 
        criarCardPersonagem(id, personagensDisponiveis[id])
    ).join('');
    
    modal.style.display = 'block';
}

// Criar card de personagem para seleção
function criarCardPersonagem(id, personagem) {
    const statIcons = { força: '💪', sabedoria: '🧠', carisma: '✨' };
    
    return `
        <div class="character-card-modal">
            <img src="${personagem.image}" alt="${personagem.name}" class="character-image-modal">
            <div class="character-name">${personagem.name}</div>
            <div class="character-description">${personagem.description}</div>
            
            <div class="character-stats">
                ${Object.entries(personagem.stats).map(([stat, value]) => `
                    <div class="stat-item-modal">
                        <span class="stat-value">${value}</span>
                        <div>${statIcons[stat]} ${stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="character-talents">
                <div class="talent-title">⭐ Talentos:</div>
                <div class="talent-list">
                    ${personagem.talents ? personagem.talents.map(talent => `• ${talent}`).join('<br>') : 'Talentos especiais'}
                </div>
            </div>
            
            <button class="select-character-btn" onclick="selecionarPersonagem('${id}')">
                🎭 Escolher ${personagem.name}
            </button>
        </div>
    `;
}

// Selecionar personagem
function selecionarPersonagem(personagemId) {
    const personagem = personagensDisponiveis[personagemId];
    if (!personagem) return;
    
    // Criar token do personagem no mapa
    const x = 200 + Math.random() * 100;
    const y = 200 + Math.random() * 100;
    
    playerToken = createToken(personagem.image, x, y, personagem.name);
    
    // Adicionar automaticamente como token personalizado
    adicionarTokenPersonagem(personagem);
    
    // Atualizar ficha do personagem
    updateCharacterSheet(personagem);
    
    // Ocultar botão e mostrar ficha
    document.getElementById('add-character-section').style.display = 'none';
    document.getElementById('character-sheet').style.display = 'block';
    
    // Fechar modal
    fecharSelecaoPersonagem();
    
    addChatMessage('Sistema', `${personagem.name} entrou na mesa!`);
}

// Adicionar token do personagem aos tokens personalizados
function adicionarTokenPersonagem(personagem) {
    const tokenId = 'char_' + Date.now();
    const customToken = {
        id: tokenId,
        image: personagem.image,
        name: personagem.name
    };
    
    // Verificar se já existe
    const exists = customTokens.find(t => t.name === personagem.name);
    if (!exists) {
        customTokens.push(customToken);
        saveCustomTokens();
        renderCustomTokens();
    }
}

// Fechar modal de seleção
function fecharSelecaoPersonagem() {
    document.getElementById('character-selection-modal').style.display = 'none';
}

// Atualizar ficha do personagem
function updateCharacterSheet(personagem) {
    // Avatar
    const avatar = document.getElementById('char-avatar');
    if (personagem.image) {
        avatar.innerHTML = `<img src="${personagem.image}" style="width: 100%; height: 100%; object-fit: cover;">`;
    }
    
    // Informações básicas
    document.getElementById('sheet-char-name').textContent = personagem.name;
    document.getElementById('sheet-char-level').textContent = 'Personagem Histórico';
    
    // Atributos
    const statsContainer = document.getElementById('sheet-stats');
    const statIcons = { força: 'fist-raised', sabedoria: 'brain', carisma: 'star' };
    
    statsContainer.innerHTML = Object.entries(personagem.stats).map(([stat, value]) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 4px;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${statIcons[stat]}" style="color: var(--accent); width: 16px;"></i>
                <span style="text-transform: capitalize; font-size: 0.9rem;">${stat}</span>
            </div>
            <span style="color: var(--accent); font-weight: bold;">${value} dados</span>
        </div>
    `).join('');
}

// Criar token
function createToken(imageSrc, x, y, name) {
    const token = document.createElement('div');
    token.className = 'token';
    token.style.left = x + 'px';
    token.style.top = y + 'px';
    token.style.backgroundImage = `url('${imageSrc}')`;
    token.style.backgroundSize = 'cover';
    token.style.backgroundPosition = 'center';
    token.style.backgroundRepeat = 'no-repeat';
    token.title = name || 'Token';
    
    // Eventos do token
    token.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        if (selectMode) {
            startTokenDrag(e, token);
        }
    });
    
    token.addEventListener('click', (e) => {
        if (selectMode) {
            e.stopPropagation();
            selectElement(token);
        }
    });
    
    canvas.appendChild(token);
    return token;
}

// Selecionar token
function selectToken(token) {
    document.querySelectorAll('.token').forEach(t => t.classList.remove('selected'));
    token.classList.add('selected');
}

// Arrastar token
function startTokenDrag(e, token) {
    const startX = e.clientX - token.offsetLeft;
    const startY = e.clientY - token.offsetTop;
    
    function onMouseMove(e) {
        token.style.left = (e.clientX - startX) + 'px';
        token.style.top = (e.clientY - startY) + 'px';
    }
    
    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

// Chat compartilhado
let chatMessages = [];
let lastChatUpdate = 0;
let chatSyncInterval;

function addChatMessage(sender, message) {
    const timestamp = Date.now();
    const messageObj = { sender, message, timestamp, id: timestamp + Math.random() };
    
    // Adicionar à lista local
    chatMessages.push(messageObj);
    
    // Salvar no localStorage compartilhado
    saveChatToStorage();
    
    // Renderizar mensagens
    renderChatMessages();
}

function saveChatToStorage() {
    const chatKey = `chat-${mesaData?.codigo || 'default'}`;
    localStorage.setItem(chatKey, JSON.stringify({
        messages: chatMessages,
        lastUpdate: Date.now()
    }));
}

function loadChatFromStorage() {
    const chatKey = `chat-${mesaData?.codigo || 'default'}`;
    const saved = localStorage.getItem(chatKey);
    
    if (saved) {
        const data = JSON.parse(saved);
        chatMessages = data.messages || [];
        lastChatUpdate = data.lastUpdate || 0;
        renderChatMessages();
    }
}

function syncChat() {
    const chatKey = `chat-${mesaData?.codigo || 'default'}`;
    const saved = localStorage.getItem(chatKey);
    
    if (saved) {
        const data = JSON.parse(saved);
        if (data.lastUpdate > lastChatUpdate) {
            chatMessages = data.messages || [];
            lastChatUpdate = data.lastUpdate;
            renderChatMessages();
        }
    }
}

function renderChatMessages() {
    const chatContainer = document.getElementById('chat-messages');
    chatContainer.innerHTML = '';
    
    // Limitar a 100 mensagens mais recentes
    const recentMessages = chatMessages.slice(-100);
    
    recentMessages.forEach(msgObj => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        
        const senderColor = msgObj.sender === 'Sistema' ? 'var(--accent)' : 
                           msgObj.sender === 'Mestre' ? '#FFD700' : '#4CAF50';
        
        if (msgObj.sender) {
            messageDiv.innerHTML = `<strong style="color: ${senderColor};">${msgObj.sender}:</strong> ${msgObj.message}`;
        } else {
            messageDiv.innerHTML = msgObj.message;
        }
        
        chatContainer.appendChild(messageDiv);
    });
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function startChatSync() {
    // Sincronizar a cada 2 segundos
    chatSyncInterval = setInterval(syncChat, 2000);
}

function stopChatSync() {
    if (chatSyncInterval) {
        clearInterval(chatSyncInterval);
    }
}



function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        if (processAdvancedCommand(message)) {
            // Comando processado
        } else {
            addChatMessage('Você', message);
        }
        input.value = '';
    }
}

function processAdvancedCommand(message) {
    // Comando de múltiplas rolagens: 2#d20
    const multiRollMatch = message.match(/^(\d+)#(.+)$/i);
    if (multiRollMatch) {
        const count = parseInt(multiRollMatch[1]);
        const rollCommand = multiRollMatch[2];
        
        if (count > 10) {
            addChatMessage('Sistema', 'Máximo de 10 rolagens múltiplas.');
            return true;
        }
        
        addChatMessage('Você', `🎲 Rolando ${count}x ${rollCommand}:`);
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const result = processSingleRoll(rollCommand);
                if (result) {
                    addChatMessage('', `&nbsp;&nbsp;${i + 1}. ${result}`);
                }
            }, i * 100);
        }
        return true;
    }
    
    // Calculadora: (33243+4323324) ou operações matemáticas
    const mathMatch = message.match(/^\((.+)\)$/);
    if (mathMatch) {
        try {
            const expression = mathMatch[1];
            // Validar expressão (apenas números e operadores básicos)
            if (/^[0-9+\-*/\s().]+$/.test(expression)) {
                const result = Function('"use strict"; return (' + expression + ')')();
                addChatMessage('Você', `🧮 ${expression} = ${result}`);
            } else {
                addChatMessage('Sistema', 'Expressão matemática inválida.');
            }
        } catch (error) {
            addChatMessage('Sistema', 'Erro no cálculo.');
        }
        return true;
    }
    
    // Rolagem de dados normal
    const result = processSingleRoll(message);
    if (result) {
        addChatMessage('Você', `🎲 ${result}`);
        return true;
    }
    
    return false;
}

function processSingleRoll(command) {
    try {
        const result = parseDiceRoll(command);
        return result.display;
    } catch (error) {
        return null;
    }
}

function rollDice(numDice, sides) {
    if (numDice > 100) {
        addChatMessage('Sistema', 'Máximo de 100 dados por rolagem.');
        return;
    }
    if (sides > 1000) {
        addChatMessage('Sistema', 'Máximo de 1000 lados por dado.');
        return;
    }
    
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }
    
    let resultMessage = `🎲 ${numDice}d${sides}: `;
    if (numDice <= 10) {
        resultMessage += `[${rolls.join(', ')}] = ${total}`;
    } else {
        resultMessage += `Total: ${total}`;
    }
    
    addChatMessage('Você', resultMessage);
}

document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

document.getElementById('dice-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        rollCustomDice();
    }
});



// Toggle modo seleção
function toggleSelectMode() {
    selectMode = !selectMode;
    drawMode = false;
    
    const selectBtn = document.getElementById('select-btn');
    const drawBtn = document.getElementById('draw-btn');
    
    if (selectMode) {
        selectBtn.classList.add('active');
        drawBtn.classList.remove('active');
        canvas.style.cursor = 'grab';
        if (drawCanvas) {
            drawCanvas.style.pointerEvents = 'none';
        }
    } else {
        selectBtn.classList.remove('active');
    }
}

// Toggle modo desenho
function toggleDrawMode() {
    document.getElementById('draw-modal').style.display = 'block';
}

function fecharModalDesenho() {
    document.getElementById('draw-modal').style.display = 'none';
}

function ativarDesenho() {
    const corSelecionada = document.querySelector('.draw-color-btn.selected')?.dataset.color || '#EBD677';
    const tamanho = document.getElementById('brush-size').value;
    
    currentColor = corSelecionada;
    currentSize = parseInt(tamanho);
    
    drawMode = true;
    selectMode = false;
    
    const drawBtn = document.getElementById('draw-btn');
    const selectBtn = document.getElementById('select-btn');
    
    drawBtn.classList.add('active');
    selectBtn.classList.remove('active');
    
    canvas.style.cursor = 'crosshair';
    
    fecharModalDesenho();
}

function desativarDesenho() {
    drawMode = false;
    selectMode = true;
    
    const drawBtn = document.getElementById('draw-btn');
    const selectBtn = document.getElementById('select-btn');
    
    drawBtn.classList.remove('active');
    selectBtn.classList.add('active');
    
    canvas.style.cursor = 'grab';
}

// Funções de desenho no canvas
function startDrawing(e) {
    if (!drawMode) return;
    e.preventDefault();
    e.stopPropagation();
    isDrawing = true;
    
    const coords = getCanvasCoordinates(e);
    lastX = coords.x;
    lastY = coords.y;
    
    // Criar elemento de desenho no canvas
    currentPath = document.createElement('div');
    currentPath.className = 'drawing-element';
    currentPath.style.position = 'absolute';
    currentPath.style.left = lastX + 'px';
    currentPath.style.top = lastY + 'px';
    currentPath.style.width = '1px';
    currentPath.style.height = '1px';
    currentPath.style.pointerEvents = 'none';
    currentPath.style.zIndex = '10';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.width = '2000px';
    svg.style.height = '2000px';
    svg.style.overflow = 'visible';
    
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('stroke', currentColor);
    pathElement.setAttribute('stroke-width', currentSize / zoom);
    pathElement.setAttribute('fill', 'none');
    pathElement.setAttribute('stroke-linecap', 'round');
    pathElement.setAttribute('stroke-linejoin', 'round');
    pathElement.setAttribute('d', `M 0 0`);
    
    svg.appendChild(pathElement);
    currentPath.appendChild(svg);
    canvas.appendChild(currentPath);
}

function draw(e) {
    if (!isDrawing || !drawMode || !currentPath) return;
    e.preventDefault();
    e.stopPropagation();
    
    const coords = getCanvasCoordinates(e);
    const currentX = coords.x;
    const currentY = coords.y;
    
    // Calcular coordenadas relativas ao ponto inicial
    const relativeX = (currentX - lastX);
    const relativeY = (currentY - lastY);
    
    // Atualizar o path SVG
    const pathElement = currentPath.querySelector('path');
    const currentD = pathElement.getAttribute('d');
    pathElement.setAttribute('d', currentD + ` L ${relativeX} ${relativeY}`);
}

// Função para obter coordenadas absolutas no canvas
function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    return { x, y };
}

function stopDrawing() {
    isDrawing = false;
    currentPath = null;
}

function createDrawingElement() {
    const minX = Math.min(...currentPath.map(p => p.x));
    const minY = Math.min(...currentPath.map(p => p.y));
    const maxX = Math.max(...currentPath.map(p => p.x));
    const maxY = Math.max(...currentPath.map(p => p.y));
    
    const width = maxX - minX + 20;
    const height = maxY - minY + 20;
    
    // Limpar a área do canvas onde o desenho foi feito
    const imageData = drawCtx.getImageData(minX - 10, minY - 10, width, height);
    drawCtx.clearRect(minX - 10, minY - 10, width, height);
    
    const drawElement = document.createElement('div');
    drawElement.className = 'drawing-element';
    drawElement.style.position = 'absolute';
    drawElement.style.left = (minX - 10) + 'px';
    drawElement.style.top = (minY - 10) + 'px';
    drawElement.style.width = width + 'px';
    drawElement.style.height = height + 'px';
    drawElement.style.pointerEvents = 'auto';
    drawElement.style.cursor = 'pointer';
    drawElement.style.zIndex = '12';
    drawElement.style.background = 'transparent';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.style.height = '100%';
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let pathString = `M ${currentPath[0].x - minX + 10} ${currentPath[0].y - minY + 10}`;
    for (let i = 1; i < currentPath.length; i++) {
        pathString += ` L ${currentPath[i].x - minX + 10} ${currentPath[i].y - minY + 10}`;
    }
    
    path.setAttribute('d', pathString);
    path.setAttribute('stroke', drawCtx.strokeStyle);
    path.setAttribute('stroke-width', drawCtx.lineWidth);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    
    svg.appendChild(path);
    drawElement.appendChild(svg);
    
    drawElement.addEventListener('click', (e) => {
        if (selectMode) {
            e.stopPropagation();
            selectElement(drawElement);
        }
    });
    
    drawElement.addEventListener('mousedown', (e) => {
        if (selectMode) {
            e.stopPropagation();
            startTokenDrag(e, drawElement);
        }
    });
    
    canvas.appendChild(drawElement);
}

// Clique direito para sair do modo desenho
canvas.addEventListener('contextmenu', (e) => {
    if (drawMode) {
        e.preventDefault();
        desativarDesenho();
    }
});

// Limpar desenhos
function clearDrawings() {
    if (confirm('Limpar todos os desenhos?')) {
        document.querySelectorAll('.drawing-element').forEach(el => el.remove());
    }
}

// Verificar se já tem personagem criado ao carregar
window.addEventListener('load', () => {
    loadMesaFromURL();
    carregarPersonagens();
    
    // Ativar modo seleção por padrão
    toggleSelectMode();
    
    // Posição inicial do canvas
    panX = -1000;
    panY = -1000;
    updateTransform();
    
    // Event listener para parar desenho ao sair do canvas
    canvas.addEventListener('mouseleave', stopDrawing);
    
    // Inicializar chat compartilhado
    loadChatFromStorage();
    startChatSync();
});

// Parar sincronização ao sair da página
window.addEventListener('beforeunload', () => {
    stopChatSync();
});

// Adicionar texto no grid
function adicionarTexto() {
    editingElement = null;
    document.getElementById('text-modal-title').textContent = 'Adicionar Texto';
    document.getElementById('text-input').value = '';
    document.getElementById('font-size').value = '14px';
    selectedColor = '#ffffff';
    document.getElementById('delete-text-btn').style.display = 'none';
    atualizarCoresModal();
    document.getElementById('text-modal').style.display = 'block';
}

function criarElementoTexto(texto, x, y, fontSize = '14px', color = '#ffffff') {
    const textElement = document.createElement('div');
    textElement.className = 'text-element';
    textElement.style.left = x + 'px';
    textElement.style.top = y + 'px';
    textElement.style.fontSize = fontSize;
    textElement.style.color = color;
    textElement.textContent = texto;
    textElement.dataset.originalText = texto;
    
    // Duplo clique para editar
    textElement.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        editarTexto(textElement);
    });
    
    // Arrastar
    textElement.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        if (selectMode) {
            startTokenDrag(e, textElement);
        }
    });
    
    textElement.addEventListener('click', (e) => {
        if (selectMode) {
            e.stopPropagation();
            selectElement(textElement);
        }
    });
    
    // Clique direito para remover
    textElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (confirm('Remover este texto?')) {
            textElement.remove();
        }
    });
    
    canvas.appendChild(textElement);
}

function editarTexto(element) {
    editingElement = element;
    document.getElementById('text-modal-title').textContent = 'Editar Texto';
    document.getElementById('text-input').value = element.dataset.originalText || element.textContent;
    document.getElementById('font-size').value = element.style.fontSize || '14px';
    selectedColor = element.style.color || '#ffffff';
    document.getElementById('delete-text-btn').style.display = 'inline-block';
    atualizarCoresModal();
    document.getElementById('text-modal').style.display = 'block';
}

function excluirTexto() {
    if (editingElement) {
        document.getElementById('confirm-modal').style.display = 'block';
    }
}

function fecharConfirmModal() {
    document.getElementById('confirm-modal').style.display = 'none';
}

function confirmarExclusao() {
    if (editingElement) {
        editingElement.remove();
        fecharConfirmModal();
        fecharModalTexto();
    }
}

function fecharModalTexto() {
    document.getElementById('text-modal').style.display = 'none';
    editingElement = null;
}

function confirmarTexto() {
    const texto = document.getElementById('text-input').value.trim();
    if (!texto) return;
    
    const fontSize = document.getElementById('font-size').value;
    
    if (editingElement) {
        // Editando texto existente
        editingElement.textContent = texto;
        editingElement.dataset.originalText = texto;
        editingElement.style.fontSize = fontSize;
        editingElement.style.color = selectedColor;
    } else {
        // Criando novo texto
        const x = 300 + Math.random() * 200;
        const y = 300 + Math.random() * 200;
        criarElementoTexto(texto, x, y, fontSize, selectedColor);
    }
    
    fecharModalTexto();
}

function atualizarCoresModal() {
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.color === selectedColor) {
            btn.classList.add('selected');
        }
    });
}

// Event listeners para cores
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedColor = this.dataset.color;
            atualizarCoresModal();
        });
    });
    
    // Event listeners para cores de desenho
    document.querySelectorAll('.draw-color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.draw-color-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Selecionar primeira cor por padrão
    const firstDrawColor = document.querySelector('.draw-color-btn');
    if (firstDrawColor) {
        firstDrawColor.classList.add('selected');
    }
});

let selectedElement = null;

// Selecionar elemento
function selectElement(element) {
    // Remover seleção anterior
    if (selectedElement) {
        selectedElement.classList.remove('selected');
        removeResizeHandles();
    }
    
    selectedElement = element;
    element.classList.add('selected');
    addResizeHandles(element);
}

// Adicionar alças de redimensionamento
function addResizeHandles(element) {
    const handles = ['nw', 'ne', 'sw', 'se'];
    
    handles.forEach(position => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-${position}`;
        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            startResize(e, element, position);
        });
        element.appendChild(handle);
    });
}

// Remover alças de redimensionamento
function removeResizeHandles() {
    document.querySelectorAll('.resize-handle').forEach(handle => {
        handle.remove();
    });
}

// Iniciar redimensionamento
function startResize(e, element, position) {
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = parseInt(getComputedStyle(element).width);
    const startHeight = parseInt(getComputedStyle(element).height);
    const startLeft = parseInt(element.style.left);
    const startTop = parseInt(element.style.top);
    
    function onMouseMove(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;
        
        if (position.includes('e')) {
            newWidth = Math.max(20, startWidth + deltaX);
        }
        if (position.includes('w')) {
            newWidth = Math.max(20, startWidth - deltaX);
            newLeft = startLeft + deltaX;
        }
        if (position.includes('s')) {
            newHeight = Math.max(20, startHeight + deltaY);
        }
        if (position.includes('n')) {
            newHeight = Math.max(20, startHeight - deltaY);
            newTop = startTop + deltaY;
        }
        
        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
    }
    
    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

// Clique no canvas para desselecionar
canvas.addEventListener('click', (e) => {
    if (selectMode && e.target === canvas) {
        if (selectedElement) {
            selectedElement.classList.remove('selected');
            removeResizeHandles();
            selectedElement = null;
        }
    }
});

// Modo régua
function toggleRulerMode() {
    rulerMode = !rulerMode;
    drawMode = false;
    selectMode = false;
    
    const rulerBtn = document.getElementById('ruler-btn');
    const selectBtn = document.getElementById('select-btn');
    const drawBtn = document.getElementById('draw-btn');
    
    if (rulerMode) {
        rulerBtn.classList.add('active');
        selectBtn.classList.remove('active');
        drawBtn.classList.remove('active');
        canvas.style.cursor = 'crosshair';
        rulerPoints = [];
        if (rulerLine) {
            rulerLine.remove();
            rulerLine = null;
        }
        addChatMessage('Sistema', '📏 Modo régua ativado. Clique em dois pontos para medir a distância.');
    } else {
        rulerBtn.classList.remove('active');
        selectBtn.classList.add('active');
        selectMode = true;
        canvas.style.cursor = 'grab';
        if (rulerLine) {
            rulerLine.remove();
            rulerLine = null;
        }
        rulerPoints = [];
    }
}

function handleRulerClick(e) {
    if (!rulerMode) return;
    
    const coords = getCanvasCoordinates(e);
    rulerPoints.push({ x: coords.x, y: coords.y });
    
    if (rulerPoints.length === 1) {
        addChatMessage('Sistema', '📍 Primeiro ponto marcado. Clique no segundo ponto.');
    } else if (rulerPoints.length === 2) {
        const distance = calculateDistance(rulerPoints[0], rulerPoints[1]);
        drawRulerLine(rulerPoints[0], rulerPoints[1]);
        addChatMessage('Sistema', `📏 Distância: ${distance.toFixed(1)} pixels (${(distance / 40).toFixed(1)} metros)`);
        
        // Reset para nova medição
        setTimeout(() => {
            rulerPoints = [];
            if (rulerLine) {
                rulerLine.remove();
                rulerLine = null;
            }
        }, 3000);
    }
}

function calculateDistance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function drawRulerLine(point1, point2) {
    if (rulerLine) {
        rulerLine.remove();
    }
    
    rulerLine = document.createElement('div');
    rulerLine.className = 'ruler-line';
    rulerLine.style.position = 'absolute';
    rulerLine.style.background = '#EBD677';
    rulerLine.style.height = '2px';
    rulerLine.style.transformOrigin = 'left center';
    rulerLine.style.pointerEvents = 'none';
    rulerLine.style.zIndex = '15';
    
    const distance = calculateDistance(point1, point2);
    const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
    
    rulerLine.style.left = point1.x + 'px';
    rulerLine.style.top = point1.y + 'px';
    rulerLine.style.width = distance + 'px';
    rulerLine.style.transform = `rotate(${angle}deg)`;
    
    canvas.appendChild(rulerLine);
}

// Controle de teclas
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !spacePressed) {
        e.preventDefault();
        spacePressed = true;
        tempPanMode = true;
        canvas.style.cursor = 'grab';
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        spacePressed = false;
        tempPanMode = false;
        
        // Restaurar cursor baseado no modo atual
        if (rulerMode) {
            canvas.style.cursor = 'crosshair';
        } else if (drawMode) {
            canvas.style.cursor = 'crosshair';
        } else {
            canvas.style.cursor = 'grab';
        }
    }
});

// Suporte a touch para dispositivos móveis
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

// Fechar modal clicando fora
window.onclick = function(event) {
    const characterModal = document.getElementById('character-selection-modal');
    const textModal = document.getElementById('text-modal');
    const drawModal = document.getElementById('draw-modal');
    
    if (event.target === characterModal) {
        fecharSelecaoPersonagem();
    }
    if (event.target === textModal) {
        fecharModalTexto();
    }
    if (event.target === drawModal) {
        fecharModalDesenho();
    }
    
    const confirmModal = document.getElementById('confirm-modal');
    if (event.target === confirmModal) {
        fecharConfirmModal();
    }
}