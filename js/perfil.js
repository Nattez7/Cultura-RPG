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

// Configuração do EmailJS
const EMAILJS_CONFIG = {
    PUBLIC_KEY: '4OwzCX2KKYArb6n6k',
    SERVICE_ID: 'service_fwefkzd', 
    TEMPLATE_ID: 'template_t2va5a7'
};

// Inicializar EmailJS
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

let usuarioAtual = null;
let dadosUsuario = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        usuarioAtual = user;
        carregarPerfilUsuario();
    } else {
        window.location.href = 'login.html';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const formularioPerfil = document.getElementById('profile-form');
    if (formularioPerfil) {
        formularioPerfil.addEventListener('submit', salvarPerfil);
    }
    
    const uploadAvatar = document.getElementById('avatar-upload');
    if (uploadAvatar) {
        uploadAvatar.addEventListener('change', lidarComUploadAvatar);
    }
});

async function carregarPerfilUsuario() {
    try {
        const refUsuario = doc(db, 'users', usuarioAtual.uid);
        const docUsuario = await getDoc(refUsuario);
        
        if (docUsuario.exists()) {
            dadosUsuario = docUsuario.data();
            exibirPerfilUsuario();
            carregarHistoricoUsuario();
        } else {
            console.error('Dados do usuario nao encontrados');
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }
}

function exibirPerfilUsuario() {
    document.getElementById('user-avatar').src = dadosUsuario.photoURL || '';
    document.getElementById('user-display-name').textContent = dadosUsuario.name || 'Usuario';
    document.getElementById('user-email').textContent = dadosUsuario.email || '';
    
    document.getElementById('edit-nick').value = dadosUsuario.nick || '';
    document.getElementById('edit-birthdate').value = dadosUsuario.birthdate || '';
    document.getElementById('edit-experience').value = dadosUsuario.experience || 'iniciante';
    document.getElementById('edit-source').value = dadosUsuario.source || '';
    document.getElementById('edit-interests').value = dadosUsuario.interests || '';
    
    document.getElementById('mesas-criadas').textContent = dadosUsuario.mesasCriadas || 0;
    document.getElementById('mesas-participadas').textContent = dadosUsuario.mesasParticipadas || 0;
    
    if (dadosUsuario.createdAt) {
        const dataCriacao = new Date(dadosUsuario.createdAt);
        const hoje = new Date();
        const diferencaTempo = Math.abs(hoje - dataCriacao);
        const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
        document.getElementById('dias-cadastrado').textContent = diferencaDias;
    }
}

async function carregarHistoricoUsuario() {
    try {
        const listaHistorico = document.getElementById('history-list');
        
        const consultaMesas = query(
            collection(db, 'mesas'),
            where('jogadores', 'array-contains', { userId: usuarioAtual.uid })
        );
        
        const consultaMesasCriadas = query(
            collection(db, 'mesas'),
            where('mestreId', '==', usuarioAtual.uid)
        );
        
        const [snapshotMesas, snapshotMesasCriadas] = await Promise.all([
            getDocs(consultaMesas),
            getDocs(consultaMesasCriadas)
        ]);
        
        const todasMesas = [];
        const personagensJogados = new Set();
        
        snapshotMesas.forEach((doc) => {
            const mesa = { id: doc.id, ...doc.data(), tipo: 'jogador' };
            todasMesas.push(mesa);
            
            const jogador = mesa.jogadores?.find(j => j.userId === usuarioAtual.uid);
            if (jogador?.personagem) {
                personagensJogados.add(jogador.personagem);
            }
        });
        
        snapshotMesasCriadas.forEach((doc) => {
            const mesa = { id: doc.id, ...doc.data(), tipo: 'mestre' };
            todasMesas.push(mesa);
        });
        
        document.getElementById('personagens-jogados').textContent = personagensJogados.size;
        
        todasMesas.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        if (todasMesas.length === 0) {
            listaHistorico.innerHTML = '<div class="no-history">Voce ainda nao participou de nenhuma mesa. Que tal comecar uma aventura?</div>';
            return;
        }
        
        listaHistorico.innerHTML = todasMesas.map(mesa => criarItemHistorico(mesa)).join('');
        
    } catch (error) {
        console.error('Erro ao carregar historico:', error);
        document.getElementById('history-list').innerHTML = '<div class="no-history">Erro ao carregar historico de mesas.</div>';
    }
}

function criarItemHistorico(mesa) {
    const missao = obterInfoMissao(mesa);
    const dataFormatada = formatarData(mesa.data);
    const tipoTexto = mesa.tipo === 'mestre' ? 'Mestre' : 'Jogador';
    
    let personagemJogado = '';
    if (mesa.tipo === 'jogador' && mesa.jogadores) {
        const jogador = mesa.jogadores.find(j => j.userId === usuarioAtual.uid);
        if (jogador?.personagem) {
            personagemJogado = `<div class="character-played">Personagem: ${jogador.personagem}</div>`;
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
                    <span><strong>Papel:</strong> ${tipoTexto}</span>
                </div>
                <div class="history-detail">
                    <span><strong>Missao:</strong> ${missao.name}</span>
                </div>
                <div class="history-detail">
                    <span><strong>Jogadores:</strong> ${mesa.currentPlayers}/${mesa.maxPlayers}</span>
                </div>
                <div class="history-detail">
                    <span><strong>Status:</strong> ${obterTextoStatus(mesa.status)}</span>
                </div>
            </div>
            
            ${personagemJogado}
        </div>
    `;
}

function obterInfoMissao(mesa) {
    if (mesa.missao === 'custom' && mesa.customMission) {
        return mesa.customMission;
    }
    
    const missoes = {
        carnaval: { name: 'As Origens do Carnaval' },
        quilombo: { name: 'A Resistencia de Palmares' },
        amazonia: { name: 'Guardioes da Floresta' }
    };
    
    return missoes[mesa.missao] || { name: 'Missao Desconhecida' };
}

function obterTextoStatus(status) {
    const mapaStatus = {
        'aberta': 'Aberta',
        'cheia': 'Lotada',
        'iniciada': 'Em Andamento',
        'finalizada': 'Finalizada'
    };
    return mapaStatus[status] || status;
}

async function salvarPerfil(event) {
    event.preventDefault();
    
    const botaoSalvar = document.querySelector('.btn-save');
    const textoOriginal = botaoSalvar.textContent;
    
    try {
        botaoSalvar.disabled = true;
        botaoSalvar.textContent = 'Salvando...';
        
        const dataNascimento = new Date(document.getElementById('edit-birthdate').value);
        const idade = Math.floor((new Date() - dataNascimento) / (365.25 * 24 * 60 * 60 * 1000));
        
        const dadosAtualizados = {
            nick: document.getElementById('edit-nick').value,
            birthdate: document.getElementById('edit-birthdate').value,
            age: idade,
            experience: document.getElementById('edit-experience').value,
            source: document.getElementById('edit-source').value,
            interests: document.getElementById('edit-interests').value,
            updatedAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', usuarioAtual.uid), dadosAtualizados, { merge: true });
        
        Object.assign(dadosUsuario, dadosAtualizados);
        
        botaoSalvar.textContent = 'Salvo!';
        setTimeout(() => {
            botaoSalvar.textContent = textoOriginal;
            botaoSalvar.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        botaoSalvar.textContent = 'Erro ao salvar';
        setTimeout(() => {
            botaoSalvar.textContent = textoOriginal;
            botaoSalvar.disabled = false;
        }, 2000);
    }
}

function mostrarAbaPerfil(nomeAba) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(nomeAba + '-tab').classList.add('active');
}

function formatarData(dateString) {
    return new Date(dateString).toLocaleString('pt-BR');
}

async function lidarComUploadAvatar(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    
    if (!arquivo.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
    }
    
    if (arquivo.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no maximo 5MB.');
        return;
    }
    
    try {
        const leitor = new FileReader();
        leitor.onload = function(e) {
            document.getElementById('user-avatar').src = e.target.result;
        };
        leitor.readAsDataURL(arquivo);
        
        const urlFoto = await converterParaBase64(arquivo);
        
        await setDoc(doc(db, 'users', usuarioAtual.uid), {
            photoURL: urlFoto,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        
        dadosUsuario.photoURL = urlFoto;
        
    } catch (error) {
        console.error('Erro ao fazer upload da foto:', error);
        alert('Erro ao atualizar foto de perfil.');
    }
}

function converterParaBase64(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.readAsDataURL(arquivo);
        leitor.onload = () => resolve(leitor.result);
        leitor.onerror = error => reject(error);
    });
}

// Funções do modal de avaliação
function openEvaluationModal() {
    document.getElementById('evaluation-modal').style.display = 'block';
    setupRatingSliders();
}

function closeEvaluationModal() {
    document.getElementById('evaluation-modal').style.display = 'none';
    document.getElementById('evaluation-form').reset();
}

function setupRatingSliders() {
    const sliders = ['quality', 'fun', 'usability', 'recommendation', 'cultural-learning'];
    
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(sliderId === 'cultural-learning' ? 'cultural-value' : sliderId + '-value');
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', function() {
                valueDisplay.textContent = this.value;
            });
        }
    });
}

async function submitEvaluation(event) {
    event.preventDefault();
    
    const evaluation = {
        to_email: 'contato.culturarpg@gmail.com',
        user_email: usuarioAtual.email,
        user_name: dadosUsuario?.nick || usuarioAtual.displayName || 'Usuário',
        quality: document.getElementById('quality').value,
        fun: document.getElementById('fun').value,
        usability: document.getElementById('usability').value,
        recommendation: document.getElementById('recommendation').value,
        cultural_learning: document.getElementById('cultural-learning').value,
        feedback_text: document.getElementById('feedback-text').value,
        cultural_text: document.getElementById('cultural-text').value,
        submitted_at: new Date().toLocaleString('pt-BR')
    };
    
    try {
        // Enviar por email usando EmailJS
        if (typeof emailjs !== 'undefined') {
            await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, evaluation);
        }
        
        // Salvar no Firebase como backup
        await setDoc(doc(db, 'evaluations', usuarioAtual.uid + '_' + Date.now()), evaluation);
        
        alert('Avaliação enviada com sucesso! Obrigado pelo seu feedback.');
        closeEvaluationModal();
    } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        console.log('Detalhes do erro:', error.message || error);
        alert('Erro ao enviar avaliação. Tente novamente.');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const evaluationForm = document.getElementById('evaluation-form');
    if (evaluationForm) {
        evaluationForm.addEventListener('submit', submitEvaluation);
    }
    
    // Fechar modal clicando fora
    const modal = document.getElementById('evaluation-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeEvaluationModal();
            }
        });
    }
});

window.mostrarAbaPerfil = mostrarAbaPerfil;
window.openEvaluationModal = openEvaluationModal;
window.closeEvaluationModal = closeEvaluationModal;