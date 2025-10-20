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

// Verificar autenticação
onAuthStateChanged(auth, (usuario) => {
    if (usuario) {
        usuarioAtual = usuario;
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

// Carregar perfil do usuário
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
    } catch (erro) {
        console.error('Erro ao carregar perfil:', erro);
    }
}

// Exibir dados do perfil
function exibirPerfilUsuario() {
    // Avatar e informações básicas
    document.getElementById('user-avatar').src = dadosUsuario.photoURL || '';
    document.getElementById('user-display-name').textContent = dadosUsuario.name || 'Usuário';
    document.getElementById('user-email').textContent = dadosUsuario.email || '';
    
    // Formulário
    document.getElementById('edit-nick').value = dadosUsuario.nick || '';
    document.getElementById('edit-birthdate').value = dadosUsuario.birthdate || '';
    document.getElementById('edit-experience').value = dadosUsuario.experience || 'iniciante';
    document.getElementById('edit-source').value = dadosUsuario.source || '';
    document.getElementById('edit-interests').value = dadosUsuario.interests || '';
    
    // Estatísticas
    document.getElementById('mesas-criadas').textContent = dadosUsuario.mesasCriadas || 0;
    document.getElementById('mesas-participadas').textContent = dadosUsuario.mesasParticipadas || 0;
    
    // Calcular dias no site
    if (dadosUsuario.createdAt) {
        const dataCriacao = new Date(dadosUsuario.createdAt);
        const hoje = new Date();
        const diferencaTempo = Math.abs(hoje - dataCriacao);
        const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
        document.getElementById('dias-cadastrado').textContent = diferencaDias;
    }
}


// Carregar histórico de mesas
async function carregarHistoricoUsuario() {
    try {
        const listaHistorico = document.getElementById('history-list');
        
        // Buscar mesas onde o usuário participou
        const consultaMesas = query(
            collection(db, 'mesas'),
            where('jogadores', 'array-contains', { userId: usuarioAtual.uid })
        );
        
        // Buscar mesas criadas pelo usuário
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
        

        // Processar mesas participadas
        snapshotMesas.forEach((documento) => {
            const mesa = { id: documento.id, ...documento.data(), tipo: 'jogador' };
            todasMesas.push(mesa);
            
            // Encontrar personagem jogado
            const jogador = mesa.jogadores?.find(j => j.userId === usuarioAtual.uid);
            if (jogador?.personagem) {
                personagensJogados.add(jogador.personagem);
            }
        });
        
        // Processar mesas criadas
        snapshotMesasCriadas.forEach((documento) => {
            const mesa = { id: documento.id, ...documento.data(), tipo: 'mestre' };
            todasMesas.push(mesa);
        });
        
        document.getElementById('personagens-jogados').textContent = personagensJogados.size;
        
        // Ordenar por data
        todasMesas.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        if (todasMesas.length === 0) {
            listaHistorico.innerHTML = '<div class="no-history">Você ainda não participou de nenhuma mesa. Que tal começar uma aventura?</div>';
            return;
        }
        
        listaHistorico.innerHTML = todasMesas.map(mesa => criarItemHistorico(mesa)).join('');
        

    } catch (erro) {
        console.error('Erro ao carregar histórico:', erro);
        document.getElementById('history-list').innerHTML = '<div class="no-history">Erro ao carregar histórico de mesas.</div>';
    }
}

// Criar item do histórico
function criarItemHistorico(mesa) {
    const missao = obterInfoMissao(mesa);
    const dataFormatada = formatarData(mesa.data);
    const textoRole = mesa.tipo === 'mestre' ? 'Mestre' : 'Jogador';

    
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
                    <span><strong>Papel:</strong> ${textoRole}</span>
                </div>
                <div class="history-detail">
                    <span><strong>Missão:</strong> ${missao.name}</span>
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



// Obter informações da missão
function obterInfoMissao(mesa) {
    if (mesa.missao === 'custom' && mesa.customMission) {
        return mesa.customMission;
    }
    
    const missoes = {
        carnaval: { name: 'As Origens do Carnaval' },
        quilombo: { name: 'A Resistência de Palmares' },
        amazonia: { name: 'Guardiões da Floresta' }
    };
    
    return missoes[mesa.missao] || { name: 'Missão Desconhecida' };
}

// Obter texto do status
function obterTextoStatus(status) {
    const mapaStatus = {
        'aberta': 'Aberta',
        'cheia': 'Lotada',
        'iniciada': 'Em Andamento',
        'finalizada': 'Finalizada'
    };
    return mapaStatus[status] || status;
}

// Salvar perfil
async function salvarPerfil(evento) {
    evento.preventDefault();
    
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
        
        // Atualizar dados locais
        Object.assign(dadosUsuario, dadosAtualizados);
        
        botaoSalvar.textContent = '✅ Salvo!';

        setTimeout(() => {
            botaoSalvar.textContent = textoOriginal;
            botaoSalvar.disabled = false;
        }, 2000);
        
    } catch (erro) {
        console.error('Erro ao salvar perfil:', erro);
        botaoSalvar.textContent = '❌ Erro ao salvar';

        setTimeout(() => {
            botaoSalvar.textContent = textoOriginal;
            botaoSalvar.disabled = false;
        }, 2000);
    }
}


// Mostrar aba do perfil
function mostrarAbaPerfil(nomeAba, elemento) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(botao => botao.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(conteudo => conteudo.classList.remove('active'));
    
    if (elemento) {
        elemento.classList.add('active');
    }
    const tabContent = document.getElementById(nomeAba + '-tab');
    if (tabContent) {
        tabContent.classList.add('active');
    }
}


// Função para formatar data
function formatarData(stringData) {
    return new Date(stringData).toLocaleString('pt-BR');
}

// Upload de avatar
async function lidarComUploadAvatar(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;
    
    // Validar tipo de arquivo
    if (!arquivo.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
    }
    
    // Validar tamanho (máximo 2MB)
    if (arquivo.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB.');
        return;
    }
    
    try {
        // Comprimir e redimensionar imagem
        const urlFoto = await comprimirImagem(arquivo, 150, 150, 0.8);
        
        // Preview da imagem
        document.getElementById('user-avatar').src = urlFoto;
        
        await setDoc(doc(db, 'users', usuarioAtual.uid), {
            photoURL: urlFoto,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        
        dadosUsuario.photoURL = urlFoto;
        
        // Atualizar header com nova foto
        if (window.atualizarInterfaceAuth) {
            window.atualizarInterfaceAuth(urlFoto);
        }
        
    } catch (erro) {
        console.error('Erro ao fazer upload do avatar:', erro);
        alert('Erro ao fazer upload da imagem.');
    }
}

// Comprimir imagem
function comprimirImagem(arquivo, maxWidth, maxHeight, qualidade) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Calcular dimensões mantendo proporção
            let { width, height } = img;
            
            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Desenhar imagem redimensionada
            ctx.drawImage(img, 0, 0, width, height);
            
            // Converter para base64 comprimido
            const imagemComprimida = canvas.toDataURL('image/jpeg', qualidade);
            resolve(imagemComprimida);
        };
        
        img.src = URL.createObjectURL(arquivo);
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
    // Não há mais sliders no novo formulário
}

async function submitEvaluation(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userName = formData.get('name-option') === 'provide-name' ? document.getElementById('user-name').value : 'Anônimo';
    
    const evaluation = {
        to_email: 'contato.culturarpg@gmail.com',
        user_email: usuarioAtual.email,
        user_name: userName,
        feedback_text: `FORMULÁRIO DE AVALIAÇÃO - CULTURA RPG\n\n1. INFORMAÇÕES GERAIS:\n- Nome: ${userName}\n- Idade: ${formData.get('age') || 'Não informado'}\n- Familiaridade com RPG: ${formData.get('rpg-familiarity') || 'Não informado'}\n- Acessa sites de RPG: ${formData.get('rpg-sites') || 'Não informado'}\n\n2. EXPERIÊNCIA DE USO:\n- Dispositivo usado: ${formData.get('device') || 'Não informado'}\n- Site carregou corretamente: ${formData.get('loading') || 'Não informado'}\n- Navegação: ${formData.get('navigation') || 'Não informado'}\n- Informações organizadas: ${formData.get('organization') || 'Não informado'}\n- Tempo de carregamento: ${formData.get('load-time') || 'Não informado'}\n\n3. ASPECTOS VISUAIS:\n- Visual do site: ${formData.get('visual') || 'Não informado'}\n- Cores/fontes/imagens: ${formData.get('design-harmony') || 'Não informado'}\n- Responsividade: ${formData.get('responsive') || 'Não informado'}\n\n4. FUNCIONALIDADES:\n- Funcionalidades funcionaram: ${formData.get('functionality') || 'Não informado'}\n- Conteúdo relevante: ${formData.get('content-relevance') || 'Não informado'}\n- Encontrou bugs: ${formData.get('bugs') || 'Não informado'}\n- Descrição dos bugs: ${document.getElementById('bugs-description').value || 'Nenhum'}\n\n5. AVALIAÇÃO GERAL:\n- Experiência geral: ${formData.get('overall-experience') || 'Não informado'}\n- Aspectos positivos: ${document.getElementById('positive-aspects').value || 'Não informado'}\n- Melhorias sugeridas: ${document.getElementById('improvements').value || 'Não informado'}\n- Recomendaria: ${formData.get('recommendation') || 'Não informado'}\n\n6. COMENTÁRIOS FINAIS:\n${document.getElementById('final-comments').value || 'Nenhum comentário adicional'}\n\nData/Hora: ${new Date().toLocaleString('pt-BR')}`,
        cultural_text: 'Formulário de Avaliação TCC',
        submitted_at: new Date().toLocaleString('pt-BR')
    };
    
    try {
        // Salvar no Firebase primeiro
        await setDoc(doc(db, 'evaluations', usuarioAtual.uid + '_' + Date.now()), evaluation);
        
        // Tentar enviar por email (não bloquear se falhar)
        try {
            if (typeof emailjs !== 'undefined') {
                await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, evaluation);
            }
        } catch (emailError) {
            console.log('Aviso: Email não enviado, mas dados salvos:', emailError);
        }
        
        alert('Avaliação enviada com sucesso! Obrigado pelo seu feedback.');
        closeEvaluationModal();
    } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
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

// Exportar funções para uso global
window.mostrarAbaPerfil = mostrarAbaPerfil;
window.openEvaluationModal = openEvaluationModal;
window.closeEvaluationModal = closeEvaluationModal;
window.lidarComUploadAvatar = lidarComUploadAvatar;
window.salvarPerfil = salvarPerfil;
window.showProfileTab = mostrarAbaPerfil;

