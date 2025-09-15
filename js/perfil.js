import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    query, 
    where, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;
let userData = null;

// Verificar autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadUserProfile();
    } else {
        window.location.href = 'login.html';
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', saveProfile);
    }
    
    const avatarUpload = document.getElementById('avatar-upload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', handleAvatarUpload);
    }
});

// Carregar perfil do usuário
async function loadUserProfile() {
    try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            userData = userDoc.data();
            displayUserProfile();
            loadUserHistory();
        } else {
            console.error('Dados do usuário não encontrados');
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }
}

// Exibir dados do perfil
function displayUserProfile() {
    // Avatar e informações básicas
    document.getElementById('user-avatar').src = userData.photoURL || '';
    document.getElementById('user-display-name').textContent = userData.name || 'Usuário';
    document.getElementById('user-email').textContent = userData.email || '';
    
    // Formulário
    document.getElementById('edit-nick').value = userData.nick || '';
    document.getElementById('edit-birthdate').value = userData.birthdate || '';
    document.getElementById('edit-experience').value = userData.experience || 'iniciante';
    document.getElementById('edit-source').value = userData.source || '';
    document.getElementById('edit-interests').value = userData.interests || '';
    
    // Estatísticas
    document.getElementById('mesas-criadas').textContent = userData.mesasCriadas || 0;
    document.getElementById('mesas-participadas').textContent = userData.mesasParticipadas || 0;
    
    // Calcular dias no site
    if (userData.createdAt) {
        const createdDate = new Date(userData.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        document.getElementById('dias-cadastrado').textContent = diffDays;
    }
}

// Carregar histórico de mesas
async function loadUserHistory() {
    try {
        const historyList = document.getElementById('history-list');
        
        // Buscar mesas onde o usuário participou
        const mesasQuery = query(
            collection(db, 'mesas'),
            where('jogadores', 'array-contains', { userId: currentUser.uid })
        );
        
        // Buscar mesas criadas pelo usuário
        const mesasCriadasQuery = query(
            collection(db, 'mesas'),
            where('mestreId', '==', currentUser.uid)
        );
        
        const [mesasSnapshot, mesasCriadasSnapshot] = await Promise.all([
            getDocs(mesasQuery),
            getDocs(mesasCriadasQuery)
        ]);
        
        const allMesas = [];
        const personagensJogados = new Set();
        
        // Processar mesas participadas
        mesasSnapshot.forEach((doc) => {
            const mesa = { id: doc.id, ...doc.data(), tipo: 'jogador' };
            allMesas.push(mesa);
            
            // Encontrar personagem jogado
            const jogador = mesa.jogadores?.find(j => j.userId === currentUser.uid);
            if (jogador?.personagem) {
                personagensJogados.add(jogador.personagem);
            }
        });
        
        // Processar mesas criadas
        mesasCriadasSnapshot.forEach((doc) => {
            const mesa = { id: doc.id, ...doc.data(), tipo: 'mestre' };
            allMesas.push(mesa);
        });
        
        // Atualizar contador de personagens jogados
        document.getElementById('personagens-jogados').textContent = personagensJogados.size;
        
        // Ordenar por data
        allMesas.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        if (allMesas.length === 0) {
            historyList.innerHTML = '<div class="no-history">Você ainda não participou de nenhuma mesa. Que tal começar uma aventura?</div>';
            return;
        }
        
        historyList.innerHTML = allMesas.map(mesa => createHistoryItem(mesa)).join('');
        
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        document.getElementById('history-list').innerHTML = '<div class="no-history">Erro ao carregar histórico de mesas.</div>';
    }
}

// Criar item do histórico
function createHistoryItem(mesa) {
    const mission = getMissionInfo(mesa);
    const dataFormatada = formatDate(mesa.data);
    const tipoIcon = mesa.tipo === 'mestre' ? '👑' : '🎭';
    const tipoText = mesa.tipo === 'mestre' ? 'Mestre' : 'Jogador';
    
    // Encontrar personagem jogado (se for jogador)
    let personagemJogado = '';
    if (mesa.tipo === 'jogador' && mesa.jogadores) {
        const jogador = mesa.jogadores.find(j => j.userId === currentUser.uid);
        if (jogador?.personagem) {
            personagemJogado = `<div class="character-played">🎭 ${jogador.personagem}</div>`;
        }
    }
    
    return `
        <div class="history-item">
            <div class="history-header">
                <div>
                    <div class="history-title">${mesa.nome}</div>
                    <div class="history-date">${dataFormatada}</div>
                </div>
            </div>
            
            <div class="history-details">
                <div class="history-detail">
                    <span>${tipoIcon}</span>
                    <span><strong>Papel:</strong> ${tipoText}</span>
                </div>
                <div class="history-detail">
                    <span>🎭</span>
                    <span><strong>Missão:</strong> ${mission.name}</span>
                </div>
                <div class="history-detail">
                    <span>👥</span>
                    <span><strong>Jogadores:</strong> ${mesa.currentPlayers}/${mesa.maxPlayers}</span>
                </div>
                <div class="history-detail">
                    <span>📊</span>
                    <span><strong>Status:</strong> ${getStatusText(mesa.status)}</span>
                </div>
            </div>
            
            ${personagemJogado}
        </div>
    `;
}

// Obter informações da missão
function getMissionInfo(mesa) {
    if (mesa.missao === 'custom' && mesa.customMission) {
        return mesa.customMission;
    }
    
    const missions = {
        carnaval: { name: 'As Origens do Carnaval' },
        quilombo: { name: 'A Resistência de Palmares' },
        amazonia: { name: 'Guardiões da Floresta' }
    };
    
    return missions[mesa.missao] || { name: 'Missão Desconhecida' };
}

// Obter texto do status
function getStatusText(status) {
    const statusMap = {
        'aberta': 'Aberta',
        'cheia': 'Lotada',
        'iniciada': 'Em Andamento',
        'finalizada': 'Finalizada'
    };
    return statusMap[status] || status;
}

// Salvar perfil
async function saveProfile(event) {
    event.preventDefault();
    
    const saveBtn = document.querySelector('.btn-save');
    const originalText = saveBtn.textContent;
    
    try {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Salvando...';
        
        const birthdate = new Date(document.getElementById('edit-birthdate').value);
        const age = Math.floor((new Date() - birthdate) / (365.25 * 24 * 60 * 60 * 1000));
        
        const updatedData = {
            nick: document.getElementById('edit-nick').value,
            birthdate: document.getElementById('edit-birthdate').value,
            age: age,
            experience: document.getElementById('edit-experience').value,
            source: document.getElementById('edit-source').value,
            interests: document.getElementById('edit-interests').value,
            updatedAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', currentUser.uid), updatedData, { merge: true });
        
        // Atualizar dados locais
        Object.assign(userData, updatedData);
        
        saveBtn.textContent = '✅ Salvo!';
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        saveBtn.textContent = '❌ Erro ao salvar';
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 2000);
    }
}

// Mostrar aba do perfil
function showProfileTab(tabName) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Ativar aba selecionada
    event.target.classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Função para formatar data
function formatDate(dateString) {
    return new Date(dateString).toLocaleString('pt-BR');
}

// Upload de avatar
async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
    }
    
    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
    }
    
    try {
        // Converter para base64 para preview
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('user-avatar').src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Salvar URL da imagem no perfil
        const photoURL = await convertToBase64(file);
        
        await setDoc(doc(db, 'users', currentUser.uid), {
            photoURL: photoURL,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        
        userData.photoURL = photoURL;
        
    } catch (error) {
        console.error('Erro ao fazer upload da foto:', error);
        alert('Erro ao atualizar foto de perfil.');
    }
}

// Converter arquivo para base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Exportar funções globais
window.showProfileTab = showProfileTab;