import { db, auth } from './firebase-config.js';
import { doc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Estado da mesa
let currentUser = null;
let mesaData = null;
let selectedToken = 'red';
let canvas = null;
let ctx = null;
let gridEnabled = true;

// Estado do grid avançado
let gridSize = 40;
let zoom = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let lastPanX = 0;
let lastPanY = 0;
let tokens = [];
let selectedTokenId = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let measureMode = false;
let measureStart = null;
let measureEnd = null;
let backgroundImage = null;
let snapToGrid = true;
let currentTool = 'token'; // token, measure, pan

// Personagens disponíveis
const characters = {
    zumbi: { name: 'Zumbi dos Palmares', stats: { força: 3, sabedoria: 1, carisma: 1 }, image: 'images/personagens/Zumbi dos Palmares.jpg' },
    maria: { name: 'Maria Bonita', stats: { força: 2, sabedoria: 1, carisma: 2 }, image: 'images/personagens/Maria Bonita.webp' },
    chico: { name: 'Chico Mendes', stats: { força: 1, sabedoria: 2, carisma: 2 }, image: 'images/personagens/Chico Mendes.jpg' },
    dandara: { name: 'Dandara', stats: { força: 2, sabedoria: 2, carisma: 1 }, image: 'images/personagens/Dandara.jpeg' },
    santos: { name: 'Santos Dumont', stats: { força: 1, sabedoria: 3, carisma: 1 }, image: 'images/personagens/Santos Dumont.jpg' },
    machado: { name: 'Machado de Assis', stats: { força: 1, sabedoria: 2, carisma: 2 }, image: 'images/personagens/Machado de Assis.jpg' },
    pixinguinha: { name: 'Pixinguinha', stats: { força: 1, sabedoria: 1, carisma: 3 }, image: 'images/personagens/Pixinguinha.jpg' },
    tarsila: { name: 'Tarsila do Amaral', stats: { força: 1, sabedoria: 1, carisma: 3 }, image: 'images/personagens/Tarsila do Amaral.jpg' },
    lampiao: { name: 'Lampião', stats: { força: 2, sabedoria: 1, carisma: 2 }, image: 'images/personagens/Lampiao.jpg' }
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeTable();
    loadMesaFromURL();
    setupCanvas();
    setupEventListeners();
});

// Verificar autenticação
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        loadCharacterSelect();
        addChatMessage('Sistema', `${user.displayName || user.email} entrou na mesa`, 'system');
    }
});

// Inicializar mesa
function initializeTable() {
    canvas = document.getElementById('map-canvas');
    ctx = canvas.getContext('2d');
    drawGrid();
}

// Carregar mesa pela URL
async function loadMesaFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const codigo = urlParams.get('codigo');
    
    if (!codigo) {
        document.getElementById('mesa-title').textContent = 'Mesa Virtual - Código não fornecido';
        return;
    }
    
    try {
        const mesa = await findMesaByCodigo(codigo);
        if (mesa) {
            mesaData = mesa;
            document.getElementById('mesa-title').textContent = mesa.nome;
            document.getElementById('mesa-code').textContent = `Código: ${codigo}`;
            loadOnlinePlayers();
        } else {
            document.getElementById('mesa-title').textContent = 'Mesa não encontrada';
        }
    } catch (error) {
        console.error('Erro ao carregar mesa:', error);
        document.getElementById('mesa-title').textContent = 'Erro ao carregar mesa';
    }
}

// Buscar mesa por código
async function findMesaByCodigo(codigo) {
    try {
        const querySnapshot = await getDocs(collection(db, 'mesas'));
        const mesa = querySnapshot.docs.find(doc => doc.data().codigo === codigo);
        return mesa ? { id: mesa.id, ...mesa.data() } : null;
    } catch (error) {
        console.error('Erro ao buscar mesa:', error);
        return null;
    }
}

// Carregar seletor de personagens
function loadCharacterSelect() {
    const select = document.getElementById('character-select');
    select.innerHTML = '<option value="">Selecionar Personagem</option>';
    
    Object.keys(characters).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = characters[id].name;
        select.appendChild(option);
    });
    
    select.addEventListener('change', function() {
        if (this.value) {
            loadCharacterDetails(this.value);
        } else {
            document.getElementById('character-details').style.display = 'none';
        }
    });
}

// Carregar detalhes do personagem
function loadCharacterDetails(characterId) {
    const character = characters[characterId];
    if (!character) return;
    
    document.getElementById('char-image').src = character.image;
    document.getElementById('char-name').textContent = character.name;
    document.getElementById('char-forca').textContent = character.stats.força;
    document.getElementById('char-sabedoria').textContent = character.stats.sabedoria;
    document.getElementById('char-carisma').textContent = character.stats.carisma;
    
    document.getElementById('character-details').style.display = 'block';
}

// Carregar jogadores online
function loadOnlinePlayers() {
    const playersDiv = document.getElementById('online-players');
    
    if (mesaData && mesaData.jogadores) {
        playersDiv.innerHTML = mesaData.jogadores.map(jogador => `
            <div class="player-item">
                <strong>${jogador.nome}</strong>
                ${jogador.personagem ? `<br><small>🎭 ${jogador.personagem}</small>` : ''}
            </div>
        `).join('');
    } else {
        playersDiv.innerHTML = '<div class="player-item">Nenhum jogador online</div>';
    }
}

// Configurar canvas avançado
function setupCanvas() {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    
    // Redimensionar canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    render();
}

// Redimensionar canvas
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    render();
}

// Renderizar tudo
function render() {
    ctx.save();
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Aplicar transformações
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);
    
    // Desenhar imagem de fundo
    if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width / zoom, canvas.height / zoom);
    }
    
    // Desenhar grid
    if (gridEnabled) {
        drawGrid();
    }
    
    // Desenhar tokens
    drawTokens();
    
    // Desenhar medição
    if (measureMode && measureStart && measureEnd) {
        drawMeasurement();
    }
    
    ctx.restore();
}

// Desenhar grid avançado
function drawGrid() {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1 / zoom;
    
    const startX = Math.floor(-panX / zoom / gridSize) * gridSize;
    const startY = Math.floor(-panY / zoom / gridSize) * gridSize;
    const endX = startX + (canvas.width / zoom) + gridSize;
    const endY = startY + (canvas.height / zoom) + gridSize;
    
    // Linhas verticais
    for (let x = startX; x <= endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
    }
    
    // Linhas horizontais
    for (let y = startY; y <= endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
    }
}

// Manipular eventos do mouse
function handleMouseDown(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Converter para coordenadas do mundo
    const worldX = (mouseX - panX) / zoom;
    const worldY = (mouseY - panY) / zoom;
    
    if (event.button === 1 || (event.button === 0 && currentTool === 'pan')) {
        // Pan com botão do meio ou ferramenta pan
        isPanning = true;
        lastPanX = mouseX;
        lastPanY = mouseY;
        canvas.style.cursor = 'grabbing';
    } else if (event.button === 0) {
        if (currentTool === 'measure') {
            // Modo medição
            if (!measureStart) {
                measureStart = { x: worldX, y: worldY };
            } else {
                measureEnd = { x: worldX, y: worldY };
                measureMode = true;
                render();
            }
        } else if (currentTool === 'token') {
            // Verificar se clicou em um token
            const clickedToken = getTokenAt(worldX, worldY);
            
            if (clickedToken) {
                selectedTokenId = clickedToken.id;
                isDragging = true;
                dragOffset.x = worldX - clickedToken.x;
                dragOffset.y = worldY - clickedToken.y;
            } else {
                // Criar novo token
                placeToken(worldX, worldY, selectedToken);
            }
        }
    }
}

function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const worldX = (mouseX - panX) / zoom;
    const worldY = (mouseY - panY) / zoom;
    
    if (isPanning) {
        panX += mouseX - lastPanX;
        panY += mouseY - lastPanY;
        lastPanX = mouseX;
        lastPanY = mouseY;
        render();
    } else if (isDragging && selectedTokenId) {
        const token = tokens.find(t => t.id === selectedTokenId);
        if (token) {
            let newX = worldX - dragOffset.x;
            let newY = worldY - dragOffset.y;
            
            // Snap to grid
            if (snapToGrid) {
                newX = Math.round(newX / gridSize) * gridSize;
                newY = Math.round(newY / gridSize) * gridSize;
            }
            
            token.x = newX;
            token.y = newY;
            render();
        }
    } else if (measureMode && measureStart) {
        measureEnd = { x: worldX, y: worldY };
        render();
    }
    
    // Atualizar cursor
    updateCursor(worldX, worldY);
}

function handleMouseUp(event) {
    isPanning = false;
    isDragging = false;
    selectedTokenId = null;
    canvas.style.cursor = 'default';
}

// Zoom com scroll
function handleWheel(event) {
    event.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));
    
    // Zoom para o ponto do mouse
    const worldX = (mouseX - panX) / zoom;
    const worldY = (mouseY - panY) / zoom;
    
    zoom = newZoom;
    panX = mouseX - worldX * zoom;
    panY = mouseY - worldY * zoom;
    
    render();
}

// Colocar token avançado
function placeToken(x, y, color) {
    let finalX = x;
    let finalY = y;
    
    // Snap to grid
    if (snapToGrid) {
        finalX = Math.round(x / gridSize) * gridSize;
        finalY = Math.round(y / gridSize) * gridSize;
    }
    
    const token = {
        id: Date.now() + Math.random(),
        x: finalX,
        y: finalY,
        color: color,
        size: gridSize * 0.8
    };
    
    tokens.push(token);
    render();
}

// Desenhar tokens
function drawTokens() {
    tokens.forEach(token => {
        ctx.fillStyle = getTokenColor(token.color);
        ctx.strokeStyle = selectedTokenId === token.id ? '#fff' : '#000';
        ctx.lineWidth = 2 / zoom;
        
        ctx.beginPath();
        ctx.arc(token.x, token.y, token.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    });
}

// Obter token na posição
function getTokenAt(x, y) {
    for (let i = tokens.length - 1; i >= 0; i--) {
        const token = tokens[i];
        const distance = Math.sqrt((x - token.x) ** 2 + (y - token.y) ** 2);
        if (distance <= token.size / 2) {
            return token;
        }
    }
    return null;
}

// Desenhar medição
function drawMeasurement() {
    if (!measureStart || !measureEnd) return;
    
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2 / zoom;
    ctx.setLineDash([5 / zoom, 5 / zoom]);
    
    ctx.beginPath();
    ctx.moveTo(measureStart.x, measureStart.y);
    ctx.lineTo(measureEnd.x, measureEnd.y);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Calcular distância
    const distance = Math.sqrt(
        (measureEnd.x - measureStart.x) ** 2 + 
        (measureEnd.y - measureStart.y) ** 2
    );
    const gridDistance = Math.round(distance / gridSize * 10) / 10;
    
    // Mostrar distância
    ctx.fillStyle = '#ff0000';
    ctx.font = `${12 / zoom}px Arial`;
    ctx.textAlign = 'center';
    const midX = (measureStart.x + measureEnd.x) / 2;
    const midY = (measureStart.y + measureEnd.y) / 2;
    ctx.fillText(`${gridDistance} sq`, midX, midY - 10 / zoom);
}

// Atualizar cursor
function updateCursor(worldX, worldY) {
    if (currentTool === 'pan') {
        canvas.style.cursor = 'grab';
    } else if (currentTool === 'measure') {
        canvas.style.cursor = 'crosshair';
    } else if (getTokenAt(worldX, worldY)) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
}

// Obter cor do token
function getTokenColor(color) {
    const colors = {
        red: '#e53e3e',
        blue: '#3182ce',
        green: '#38a169',
        yellow: '#d69e2e',
        purple: '#805ad5',
        black: '#2d3748'
    };
    return colors[color] || colors.red;
}

// Selecionar token
function selectToken(color) {
    selectedToken = color;
    
    // Atualizar visual
    document.querySelectorAll('.token').forEach(token => {
        token.classList.remove('selected');
    });
    document.querySelector(`.token.${color}`).classList.add('selected');
}

// Limpar mapa
function clearMap() {
    backgroundImage = null;
    render();
}

// Alternar grid
function toggleGrid() {
    gridEnabled = !gridEnabled;
    render();
}

// Limpar tokens
function clearTokens() {
    tokens = [];
    render();
}

// Ferramentas
function setTool(tool) {
    currentTool = tool;
    measureMode = false;
    measureStart = null;
    measureEnd = null;
    
    // Atualizar UI
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tool="${tool}"]`)?.classList.add('active');
    
    render();
}

// Alternar snap to grid
function toggleSnapToGrid() {
    snapToGrid = !snapToGrid;
    const btn = document.querySelector('[data-action="snap"]');
    if (btn) {
        btn.classList.toggle('active', snapToGrid);
    }
}

// Resetar zoom e pan
function resetView() {
    zoom = 1;
    panX = 0;
    panY = 0;
    render();
}

// Ajustar tamanho do grid
function adjustGridSize(delta) {
    gridSize = Math.max(10, Math.min(100, gridSize + delta));
    render();
}

// Deletar token selecionado
function deleteSelectedToken() {
    if (selectedTokenId) {
        tokens = tokens.filter(t => t.id !== selectedTokenId);
        selectedTokenId = null;
        render();
    }
}

// Atalhos de teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
        
        switch (event.key) {
            case 't':
                setTool('token');
                break;
            case 'm':
                setTool('measure');
                break;
            case 'p':
                setTool('pan');
                break;
            case 'g':
                toggleGrid();
                break;
            case 's':
                toggleSnapToGrid();
                break;
            case 'r':
                resetView();
                break;
            case 'Delete':
            case 'Backspace':
                deleteSelectedToken();
                break;
            case 'Escape':
                measureMode = false;
                measureStart = null;
                measureEnd = null;
                selectedTokenId = null;
                render();
                break;
        }
    });
}

// Rolar dados
function rollDice() {
    const diceType = parseInt(document.getElementById('dice-type').value);
    const diceCount = parseInt(document.getElementById('dice-count').value);
    
    const results = [];
    let total = 0;
    
    for (let i = 0; i < diceCount; i++) {
        const result = Math.floor(Math.random() * diceType) + 1;
        results.push(result);
        total += result;
    }
    
    const resultText = `${diceCount}d${diceType}: [${results.join(', ')}] = ${total}`;
    
    // Mostrar no painel
    const resultsDiv = document.getElementById('dice-results');
    const resultElement = document.createElement('div');
    resultElement.className = 'dice-result';
    resultElement.textContent = resultText;
    resultsDiv.appendChild(resultElement);
    resultsDiv.scrollTop = resultsDiv.scrollHeight;
    
    // Enviar para o chat
    if (currentUser) {
        addChatMessage(currentUser.displayName || currentUser.email, `🎲 ${resultText}`, 'dice-roll');
    }
}

// Rolagem rápida
function quickRoll(attribute) {
    const character = getCurrentCharacter();
    if (!character) {
        alert('Selecione um personagem primeiro!');
        return;
    }
    
    const attributeValue = character.stats[attribute];
    const results = [];
    let total = 0;
    
    // Rolar 1d6 + dados do atributo
    for (let i = 0; i <= attributeValue; i++) {
        const result = Math.floor(Math.random() * 6) + 1;
        results.push(result);
        total = Math.max(total, result);
    }
    
    const resultText = `${attribute.toUpperCase()}: [${results.join(', ')}] = ${total}`;
    
    // Mostrar resultado
    const modalResults = document.getElementById('modal-dice-results');
    const resultElement = document.createElement('div');
    resultElement.className = 'dice-result';
    resultElement.textContent = resultText;
    modalResults.appendChild(resultElement);
    
    // Enviar para o chat
    if (currentUser) {
        addChatMessage(currentUser.displayName || currentUser.email, `🎲 ${resultText}`, 'dice-roll');
    }
}

// Obter personagem atual
function getCurrentCharacter() {
    const selectedId = document.getElementById('character-select').value;
    return selectedId ? characters[selectedId] : null;
}

// Rolagem customizada
function customRoll() {
    const diceCount = parseInt(document.getElementById('custom-dice').value);
    const diceSides = parseInt(document.getElementById('custom-sides').value);
    
    const results = [];
    let total = 0;
    
    for (let i = 0; i < diceCount; i++) {
        const result = Math.floor(Math.random() * diceSides) + 1;
        results.push(result);
        total += result;
    }
    
    const resultText = `${diceCount}d${diceSides}: [${results.join(', ')}] = ${total}`;
    
    const modalResults = document.getElementById('modal-dice-results');
    const resultElement = document.createElement('div');
    resultElement.className = 'dice-result';
    resultElement.textContent = resultText;
    modalResults.appendChild(resultElement);
    
    if (currentUser) {
        addChatMessage(currentUser.displayName || currentUser.email, `🎲 ${resultText}`, 'dice-roll');
    }
}

// Chat
function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (message && currentUser) {
        addChatMessage(currentUser.displayName || currentUser.email, message);
        input.value = '';
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addChatMessage(sender, message, type = 'normal') {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    
    const timestamp = new Date().toLocaleTimeString();
    
    messageElement.innerHTML = `
        <span class="sender">${sender}</span>
        <span class="timestamp">[${timestamp}]</span>
        <div class="message ${type}">${message}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Salvar notas
function saveNotes() {
    const notes = document.getElementById('game-notes').value;
    localStorage.setItem(`mesa-notes-${mesaData?.codigo || 'default'}`, notes);
    alert('Notas salvas localmente!');
}

// Carregar notas
function loadNotes() {
    const notes = localStorage.getItem(`mesa-notes-${mesaData?.codigo || 'default'}`);
    if (notes) {
        document.getElementById('game-notes').value = notes;
    }
}

// Upload de mapa avançado
function setupEventListeners() {
    document.getElementById('map-upload').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                backgroundImage = new Image();
                backgroundImage.onload = function() {
                    render();
                };
                backgroundImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Modal de dados
    document.getElementById('dice-roller-btn').addEventListener('click', function() {
        document.getElementById('dice-modal').style.display = 'block';
    });
    
    // Configurar atalhos de teclado
    setupKeyboardShortcuts();
    
    loadNotes();
}

// Fechar modal de dados
function closeDiceModal() {
    document.getElementById('dice-modal').style.display = 'none';
}

// Exportar funções globais
window.selectToken = selectToken;
window.clearMap = clearMap;
window.toggleGrid = toggleGrid;
window.clearTokens = clearTokens;
window.rollDice = rollDice;
window.quickRoll = quickRoll;
window.customRoll = customRoll;
window.sendMessage = sendMessage;
window.handleChatKeyPress = handleChatKeyPress;
window.saveNotes = saveNotes;
window.closeDiceModal = closeDiceModal;
window.setTool = setTool;
window.toggleSnapToGrid = toggleSnapToGrid;
window.resetView = resetView;
window.adjustGridSize = adjustGridSize;
window.deleteSelectedToken = deleteSelectedToken;