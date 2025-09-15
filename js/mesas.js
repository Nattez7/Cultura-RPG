import { db, auth } from './firebase-config.js';
import { collection, doc, addDoc, setDoc, getDocs, deleteDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Estado do usuário
let currentUser = null;

// Monitorar estado de autenticação
onAuthStateChanged(auth, (user) => {
    currentUser = user;
});

// Estado do jogo
let gameState = {
    mesas: [],
    missions: {
        carnaval: {
            name: 'As Origens do Carnaval',
            description: 'Viaje ao Rio de Janeiro do século XIX e descubra como nasceu a maior festa popular do Brasil. Explore os bailes de máscaras da elite, os cordões dos bairros populares e as influências africanas que moldaram nossa cultura carnavalesca.',
            difficulty: 'iniciante',
            duration: '2-3 horas',
            period: 'Século XIX (1870-1890) - Rio de Janeiro',
            objectives: ['Investigar as origens dos blocos carnavalescos', 'Descobrir a influência africana no Carnaval', 'Participar dos primeiros desfiles organizados'],
            characters: ['Chiquinha Gonzaga', 'Hilário Jovino', 'Tia Ciata'],
            themes: ['Música Popular', 'Cultura Afro-brasileira', 'Tradições Populares'],
            
            // GUIA COMPLETO PARA O MESTRE
            masterGuide: {
                introduction: 'Esta aventura transporta os jogadores para o Rio de Janeiro do final do século XIX, quando o Carnaval estava se transformando de festa de elite em celebração popular. Os personagens investigarão as raízes culturais desta manifestação única.',
                
                historicalContext: {
                    period: '1870-1890',
                    location: 'Rio de Janeiro - Capital do Império',
                    socialContext: 'Período de transição entre Império e República, abolição da escravatura se aproximando, crescimento urbano acelerado',
                    culturalMoment: 'Fusão entre tradições europeias, africanas e indígenas criando uma identidade cultural brasileira única'
                },
                
                keyLocations: [
                    {
                        name: 'Casa da Tia Ciata - Saúde',
                        description: 'Centro da cultura afro-brasileira no Rio. Aqui nascem os primeiros sambas e se organizam as festas que influenciarão o Carnaval.',
                        atmosphere: 'Sons de atabaque, cheiro de comida baiana, rodas de samba improvisadas',
                        npcs: ['Tia Ciata', 'Donga', 'João da Baiana']
                    },
                    {
                        name: 'Salões da Rua do Ouvidor',
                        description: 'Bailes de máscaras da elite carioca. Ambiente elegante mas excludente.',
                        atmosphere: 'Música clássica, vestidos longos, máscaras elaboradas, conversações em francês',
                        npcs: ['Barão de Drummond', 'Condessa de Barral']
                    },
                    {
                        name: 'Ruas da Cidade Nova',
                        description: 'Onde os cordões populares ensaiam e desfilam. Berço do Carnaval de rua.',
                        atmosphere: 'Instrumentos improvisados, fantasias coloridas, alegria contagiante',
                        npcs: ['Hilário Jovino', 'Mestre Vitalino']
                    }
                ],
                
                plotHooks: [
                    'Um jornalista europeu quer documentar as "estranhas tradições carnavalescas" do Brasil',
                    'Conflito entre a elite que quer "civilizar" o Carnaval e os grupos populares',
                    'Mistério sobre o desaparecimento de uma música que poderia revolucionar o Carnaval',
                    'Tensão racial: autoridades tentam proibir as manifestações afro-brasileiras'
                ],
                
                encounters: [
                    {
                        title: 'O Ensaio Secreto',
                        description: 'Os personagens descobrem um ensaio clandestino de samba na casa da Tia Ciata',
                        challenge: 'Convencer os participantes a confiar nos forasteiros',
                        reward: 'Aprendem sobre as origens africanas do ritmo'
                    },
                    {
                        title: 'Confronto no Baile',
                        description: 'Tensão no baile da elite quando músicos negros são impedidos de tocar',
                        challenge: 'Mediar o conflito sem causar incêdente diplomático',
                        reward: 'Ganham respeito de ambos os lados'
                    },
                    {
                        title: 'A Primeira Escola',
                        description: 'Ajudam a organizar o primeiro desfile estruturado de Carnaval',
                        challenge: 'Coordenar diferentes grupos com visões distintas',
                        reward: 'Participam da criação de uma tradição histórica'
                    }
                ],
                
                culturalLessons: [
                    'O Carnaval brasileiro é resultado da fusão de três culturas distintas',
                    'A resistência cultural foi fundamental para preservar tradições africanas',
                    'A música popular brasileira nasceu da criatividade dos grupos marginalizados',
                    'Festas populares podem ser formas de expressão política e social'
                ],
                
                gameplayTips: [
                    'Enfatize a música: use trilha sonora de época',
                    'Descreva as diferenças sociais através de roupas, linguagem e comportamento',
                    'Permita que os jogadores criem suas próprias contribuições para o Carnaval',
                    'Use testes de Carisma para interações sociais complexas'
                ]
            }
        },
        
        quilombo: {
            name: 'A Resistência de Palmares',
            description: 'Adentre o maior quilombo das Américas e lute ao lado de Zumbi dos Palmares pela liberdade. Experimente a organização social, política e militar de Palmares enquanto enfrenta as expedições coloniais que tentam destruir este símbolo de resistência.',
            difficulty: 'intermediario',
            duration: '3-4 horas',
            period: 'Século XVII (1630-1695) - Serra da Barriga, Alagoas',
            objectives: ['Defender Palmares dos ataques coloniais', 'Organizar a sociedade quilombola', 'Estabelecer alianças com outros grupos de resistência'],
            characters: ['Zumbi dos Palmares', 'Ganga Zumba', 'Dandara'],
            themes: ['Resistência Escrava', 'Organização Social', 'Luta pela Liberdade'],
            
            masterGuide: {
                introduction: 'Esta é uma aventura de resistência e luta pela liberdade. Os jogadores vivenciarão a complexa organização social, política e militar do Quilombo dos Palmares, o maior símbolo de resistência escrava das Américas.',
                
                historicalContext: {
                    period: '1630-1695 (65 anos de resistência)',
                    location: 'Serra da Barriga, interior de Alagoas',
                    socialContext: 'Auge do sistema escravista colonial, Palmares como alternativa de sociedade livre',
                    politicalMoment: 'Conflito constante com autoridades coloniais portuguesas e holandesas'
                },
                
                keyLocations: [
                    {
                        name: 'Cerca Real do Macaco - Capital',
                        description: 'Centro político e militar de Palmares. Fortificações naturais e construídas.',
                        atmosphere: 'Atividade constante, soldados treinando, reuniões de liderança, som de ferreiros',
                        npcs: ['Zumbi dos Palmares', 'Ganga Zumba', 'Conselheiros militares']
                    },
                    {
                        name: 'Mocambo de Dandara',
                        description: 'Vila organizada por Dandara, focada na produção agrícola e artesanal.',
                        atmosphere: 'Plantações organizadas, oficinas de cerâmica, crianças brincando livremente',
                        npcs: ['Dandara', 'Artesãos quilombolas', 'Agricultores']
                    },
                    {
                        name: 'Posto Avançado da Fronteira',
                        description: 'Ponto de vigilância contra expedições punitivas. Local de primeiros confrontos.',
                        atmosphere: 'Tensão constante, vigias alertas, armadilhas na mata, sinais de fumaça',
                        npcs: ['Capitães quilombolas', 'Batedores', 'Refugiados recém-chegados']
                    }
                ],
                
                plotHooks: [
                    'Expedição punitiva de Domingos Jorge Velho se aproxima de Palmares',
                    'Conflito interno sobre negociações de paz com os portugueses',
                    'Missão de resgate de escravos de fazendas próximas',
                    'Descoberta de espão infiltrado entre os quilombolas'
                ],
                
                encounters: [
                    {
                        title: 'Emboscada na Mata',
                        description: 'Capitães-do-mato atacam um grupo de refugiados',
                        challenge: 'Combate tático usando conhecimento do terreno',
                        reward: 'Salvam famílias inteiras e ganham informações sobre movimentos inimigos'
                    },
                    {
                        title: 'O Conselho de Guerra',
                        description: 'Debate sobre estratégias de defesa entre as lideranças',
                        challenge: 'Convencer líderes com visões diferentes sobre a melhor estratégia',
                        reward: 'Influenciam decisões que afetam o destino de Palmares'
                    },
                    {
                        title: 'A Última Batalha',
                        description: 'Defesa heroica da Cerca Real contra forças superiores',
                        challenge: 'Combate épico com odds desiguais',
                        reward: 'Tornam-se lendas da resistência quilombola'
                    }
                ],
                
                culturalLessons: [
                    'Palmares foi uma sociedade complexa e organizada, não apenas um refúgio',
                    'A resistência escrava tomou formas diversas e sofisticadas',
                    'Lideranças femininas como Dandara foram fundamentais',
                    'O quilombo representava uma alternativa real ao sistema colonial'
                ],
                
                gameplayTips: [
                    'Enfatize a organização social: Palmares tinha leis, hierarquia e economia própria',
                    'Use combates táticos: guerrilha vs. formação militar europeia',
                    'Explore dilemas morais: quando negociar vs. quando lutar',
                    'Mostre a diversidade: africanos, indígenas, mestiços unidos pela liberdade'
                ]
            }
        },
        
        amazonia: {
            name: 'Guardiões da Floresta',
            description: 'Junte-se a Chico Mendes e aos seringueiros do Acre na luta pela preservação da Amazônia. Organize empates contra o desmatamento, negocie com fazendeiros e políticos, e trabalhe para criar as primeiras reservas extrativistas do Brasil.',
            difficulty: 'avancado',
            duration: '4-5 horas',
            period: 'Década de 1980 (1980-1988) - Acre',
            objectives: ['Organizar empates contra o desmatamento', 'Criar as primeiras reservas extrativistas', 'Mobilizar a opinião pública nacional e internacional'],
            characters: ['Chico Mendes', 'Marina Silva', 'Darly Alves'],
            themes: ['Ambientalismo', 'Desenvolvimento Sustentável', 'Movimentos Sociais'],
            
            masterGuide: {
                introduction: 'Uma aventura de ativismo ambiental e luta social. Os jogadores participarão do nascimento do movimento ambientalista brasileiro, enfrentando interesses econômicos poderosos para proteger a Amazônia e as comunidades tradicionais.',
                
                historicalContext: {
                    period: '1980-1988 (Era da redemocratização)',
                    location: 'Xapuri e região, Acre',
                    socialContext: 'Conflito entre desenvolvimento econômico e preservação ambiental',
                    politicalMoment: 'Transição democrática, pressão internacional sobre questões ambientais'
                },
                
                keyLocations: [
                    {
                        name: 'Seringal São Francisco do Iracema',
                        description: 'Casa de Chico Mendes e centro da resistência seringueira.',
                        atmosphere: 'Simplicidade rural, reuniões à luz de lampião, mapas da floresta nas paredes',
                        npcs: ['Chico Mendes', 'Ilzamar Mendes', 'Líderes seringueiros']
                    },
                    {
                        name: 'Fazenda Paranacre',
                        description: 'Propriedade dos Alves, símbolo do agronegócio predador.',
                        atmosphere: 'Maquinário pesado, áreas desmatadas, tensão entre trabalhadores',
                        npcs: ['Darly Alves', 'Darci Alves', 'Capatazes armados']
                    },
                    {
                        name: 'Assembleia Legislativa - Rio Branco',
                        description: 'Arena política onde se decidem políticas ambientais.',
                        atmosphere: 'Debates acalorados, lobby do agronegócio, pressão da mídia',
                        npcs: ['Marina Silva', 'Deputados ruralistas', 'Jornalistas']
                    }
                ],
                
                plotHooks: [
                    'Fazendeiros planejam desmatar área de castanhais centenários',
                    'Ameaças de morte contra líderes ambientalistas se intensificam',
                    'Oportunidade de criar a primeira reserva extrativista do Brasil',
                    'Jornalistas internacionais querem documentar o conflito ambiental'
                ],
                
                encounters: [
                    {
                        title: 'O Empate da Borracha',
                        description: 'Seringueiros se colocam na frente das motosserras para impedir derrubada',
                        challenge: 'Resistência pacífica sob pressão e ameaças',
                        reward: 'Salvam área florestal e ganham atenção da mídia'
                    },
                    {
                        title: 'Negociação em Brasília',
                        description: 'Reunião com autoridades federais sobre políticas ambientais',
                        challenge: 'Convencer políticos com interesses conflitantes',
                        reward: 'Conseguem apoio governamental para reservas extrativistas'
                    },
                    {
                        title: 'A Emboscada Fatal',
                        description: 'Confronto final com pistoleiros contratados pelos fazendeiros',
                        challenge: 'Sobreviver a atentado e expor os mandantes',
                        reward: 'Transformam tragédia em símbolo da luta ambiental'
                    }
                ],
                
                culturalLessons: [
                    'O ambientalismo brasileiro nasceu da luta de comunidades tradicionais',
                    'Desenvolvimento sustentável é possível quando comunidades controlam recursos',
                    'Conflitos ambientais envolvem questões de justiça social e direitos humanos',
                    'A Amazônia é fundamental para o equilíbrio climático global'
                ],
                
                gameplayTips: [
                    'Use mapas reais da região para mostrar áreas de conflito',
                    'Enfatize dilemas éticos: desenvolvimento vs. preservação',
                    'Inclua elementos de investigação: rastreando financiadores do desmatamento',
                    'Mostre o impacto global: como ações locais afetam o mundo'
                ]
            }
        }
    }
};

// Carregar missões do Firestore (com fallback)
async function loadMissionsFromFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, 'missoes'));
        
        if (!querySnapshot.empty) {
            const firestoreData = {};
            querySnapshot.forEach((doc) => {
                firestoreData[doc.id] = doc.data();
            });
            
            gameState.missions = firestoreData;
            console.log('Missões carregadas do Firestore:', Object.keys(firestoreData));
            return true;
        } else {
            console.log('Nenhuma missão encontrada no Firestore');
            return false;
        }
    } catch (error) {
        console.error('Erro ao carregar missões do Firestore:', error);
        return false;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    initializeMesasSystem();
    
    // Tentar carregar missões do Firestore primeiro
    const missionsLoaded = await loadMissionsFromFirebase();
    if (!missionsLoaded) {
        console.log('Usando missões locais como fallback');
    }
    
    loadMesasFromFirebase();
});

function initializeMesasSystem() {
    console.log('Inicializando sistema de mesas...');
    
    const criarMesaForm = document.getElementById('criar-mesa-form');
    console.log('Formulário encontrado:', criarMesaForm);
    
    if (criarMesaForm) {
        criarMesaForm.addEventListener('submit', criarMesa);
        console.log('Event listener adicionado ao formulário');
    } else {
        console.error('Formulário criar-mesa-form não encontrado!');
    }
    
    // Definir data mínima como agora
    const dataInput = document.getElementById('mesa-data');
    if (dataInput) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        dataInput.min = now.toISOString().slice(0, 16);
    }
    
    // Event listeners para filtros
    const filterDifficulty = document.getElementById('filter-difficulty');
    const filterMission = document.getElementById('filter-mission');
    
    if (filterDifficulty) {
        filterDifficulty.addEventListener('change', loadMesas);
    }
    
    if (filterMission) {
        filterMission.addEventListener('change', loadMesas);
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

// Carregar mesas do Firestore
function loadMesasFromFirebase() {
    try {
        onSnapshot(collection(db, 'mesas'), (snapshot) => {
            gameState.mesas = [];
            snapshot.forEach((doc) => {
                gameState.mesas.push({ id: doc.id, ...doc.data() });
            });
            loadMesas();
            loadMinhasMesas();
        });
    } catch (error) {
        console.log('Erro ao carregar mesas:', error);
        loadMesas();
        loadMinhasMesas();
    }
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
            gameState.missions[mesa.missao]?.difficulty === filterDifficulty
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
    const mission = getMissionInfo(mesa);
    const dataFormatada = formatDate(mesa.data);
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
                ${mission.period ? `
                <div class="info-item">
                    <span>📆</span>
                    <span><strong>Período:</strong> ${mission.period}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="mesa-description">
                <p><strong>Descrição da Mesa:</strong> ${mesa.descricao}</p>
                <p><strong>Sobre a Missão:</strong> ${mission.description}</p>
                ${mission.characters ? `
                <div class="mission-characters">
                    <strong>Personagens Principais:</strong> ${mission.characters.join(', ')}
                </div>
                ` : ''}
                ${mission.themes ? `
                <div class="mission-themes">
                    <strong>Temas:</strong> ${mission.themes.join(' • ')}
                </div>
                ` : ''}
                ${mission.masterGuide ? `
                <div class="master-guide-preview">
                    <strong>Para Mestres:</strong> Inclui guia completo com contexto histórico, locais detalhados, encontros pré-definidos e dicas de gameplay.
                    <button class="view-guide-btn" onclick="showMasterGuide('${mesa.missao}')">
                        📜 Ver Guia do Mestre
                    </button>
                </div>
                ` : ''}
            </div>
            
            <div class="mesa-actions">
                <span class="players-count">
                    👥 ${mesa.currentPlayers}/${mesa.maxPlayers} jogadores
                </span>
                <button class="join-btn" 
                        onclick="joinMesa('${mesa.id}')" 
                        ${mesa.status !== 'aberta' ? 'disabled' : ''}>
                    ${mesa.status === 'aberta' ? 'Inscrever-se' : 'Indisponível'}
                </button>
            </div>
        </div>
    `;
}

// Inscrever-se em mesa
async function joinMesa(mesaId) {
    if (!currentUser) {
        alert('Você precisa estar logado para se inscrever em uma mesa.');
        window.location.href = 'login.html';
        return;
    }
    
    const mesa = gameState.mesas.find(m => m.id === mesaId);
    if (!mesa || mesa.status !== 'aberta') return;
    
    // Verificar se já está inscrito
    if (!mesa.jogadores) mesa.jogadores = [];
    if (mesa.jogadores.some(j => j.userId === currentUser.uid)) {
        alert('Você já está inscrito nesta mesa!');
        return;
    }
    
    // Adicionar jogador
    const novoJogador = {
        userId: currentUser.uid,
        nome: currentUser.displayName || currentUser.email,
        dataInscricao: new Date().toISOString()
    };
    
    mesa.jogadores.push(novoJogador);
    mesa.currentPlayers++;
    
    // Verificar se mesa ficou cheia
    if (mesa.currentPlayers >= mesa.maxPlayers) {
        mesa.status = 'cheia';
    }
    
    try {
        await updateDoc(doc(db, 'mesas', mesaId), {
            jogadores: mesa.jogadores,
            currentPlayers: mesa.currentPlayers,
            status: mesa.status
        });
        
        alert(`Inscrição realizada com sucesso! O mestre ${mesa.mestre} entrará em contato.`);
    } catch (error) {
        alert('Erro ao se inscrever na mesa: ' + error.message);
    }
}

// Gerar código único para mesa
function generateMesaCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Verificar se código já existe
async function isCodeUnique(code) {
    try {
        const querySnapshot = await getDocs(collection(db, 'mesas'));
        return !querySnapshot.docs.some(doc => doc.data().codigo === code);
    } catch (error) {
        return true; // Se não conseguir verificar, assume que é único
    }
}

// Criar mesa
async function criarMesa(event) {
    console.log('Função criarMesa chamada');
    event.preventDefault();
    
    console.log('Usuário atual:', currentUser);
    
    if (!currentUser) {
        alert('Você precisa estar logado para criar uma mesa.');
        return;
    }
    
    console.log('Gerando código único...');
    // Gerar código único
    let codigo;
    do {
        codigo = generateMesaCode();
    } while (!(await isCodeUnique(codigo)));
    
    console.log('Código gerado:', codigo);
    
    const missaoSelecionada = document.getElementById('mesa-missao').value;
    let missaoData = {};
    
    if (missaoSelecionada === 'custom') {
        // Missão personalizada
        missaoData = {
            missao: 'custom',
            customMission: {
                name: document.getElementById('custom-mission-name').value,
                description: document.getElementById('custom-mission-description').value,
                difficulty: document.getElementById('custom-mission-difficulty').value,
                duration: document.getElementById('custom-mission-duration').value
            }
        };
    } else {
        // Missão padrão
        missaoData = {
            missao: missaoSelecionada
        };
    }
    
    const novaMesa = {
        nome: document.getElementById('mesa-nome').value,
        ...missaoData,
        mestre: document.getElementById('mestre-nome').value,
        mestreId: currentUser.uid,
        maxPlayers: parseInt(document.getElementById('mesa-max-players').value),
        currentPlayers: 0,
        data: document.getElementById('mesa-data').value,
        descricao: document.getElementById('mesa-descricao').value,
        status: 'aberta',
        jogadores: [],
        codigo: codigo,
        criadaEm: new Date().toISOString()
    };
    
    console.log('Dados da nova mesa:', novaMesa);
    
    try {
        console.log('Tentando salvar no Firestore...');
        await addDoc(collection(db, 'mesas'), novaMesa);
        console.log('Mesa salva com sucesso!');
        
        // Mostrar modal com link de convite
        const mesaUrl = `${window.location.origin}/mesa.html?codigo=${codigo}`;
        showInviteModal(codigo, mesaUrl);
        
        // Limpar formulário
        event.target.reset();
        
        // Voltar para aba de mesas
        document.querySelector('[onclick="showTab(\'mesas\')"]').click();
    } catch (error) {
        console.error('Erro ao criar mesa:', error);
        alert('Erro ao criar mesa: ' + error.message);
    }
}

// Carregar minhas mesas
function loadMinhasMesas() {
    const minhasMesasList = document.getElementById('minhas-mesas-list');
    if (!minhasMesasList) return;
    
    if (!currentUser) {
        minhasMesasList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Faça login para ver suas mesas.</p>';
        return;
    }
    
    const minhasMesas = gameState.mesas.filter(mesa => 
        mesa.mestreId === currentUser.uid || 
        (mesa.jogadores && mesa.jogadores.some(j => j.userId === currentUser.uid))
    );
    
    if (minhasMesas.length === 0) {
        minhasMesasList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Você ainda não criou nem se inscreveu em nenhuma mesa.</p>';
        return;
    }
    
    minhasMesasList.innerHTML = minhasMesas.map(mesa => {
        const isMestre = mesa.mestreId === currentUser.uid;
        return createMinhaMesaCard({...mesa, tipo: isMestre ? 'mestre' : 'jogador'});
    }).join('');
}

// Criar card de minha mesa
function createMinhaMesaCard(mesa) {
    const mission = gameState.missions[mesa.missao] || { name: 'Missão não encontrada' };
    const dataFormatada = formatDate(mesa.data);
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
    const mesaUrl = `${window.location.origin}/mesa.html?codigo=${mesa.codigo}`;
    return `
        <div class="mesa-actions">
            <div class="mesa-code">
                <strong>Código:</strong> ${mesa.codigo}
                <button class="copy-btn" onclick="copyMesaLink('${mesa.codigo}')" title="Copiar link">
                    📋
                </button>
            </div>
            <button class="join-btn" onclick="gerenciarMesa('${mesa.id}')">
                Gerenciar Mesa
            </button>
            <button class="join-btn" onclick="cancelarMesa('${mesa.id}')" 
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
            <div class="mesa-code">
                <strong>Código:</strong> ${mesa.codigo}
                <button class="copy-btn" onclick="copyMesaLink('${mesa.codigo}')" title="Copiar link">
                    📋
                </button>
            </div>
            <span style="color: #666;">
                Inscrito
            </span>
            <button class="join-btn" onclick="sairMesa('${mesa.id}')"
                    style="background: linear-gradient(45deg, #dc3545, #c82333);">
                Sair da Mesa
            </button>
        </div>
    `;
}

// Variável global para mesa sendo gerenciada
let currentManagedMesa = null;

// Gerenciar mesa (mestre)
function gerenciarMesa(mesaId) {
    const mesa = gameState.mesas.find(m => m.id === mesaId);
    if (!mesa) return;
    
    currentManagedMesa = mesa;
    showManageModal(mesa);
}

// Mostrar modal de gerenciamento
function showManageModal(mesa) {
    const currentPlayersDiv = document.getElementById('current-players');
    
    if (mesa.jogadores && mesa.jogadores.length > 0) {
        currentPlayersDiv.innerHTML = mesa.jogadores.map((jogador, index) => `
            <div class="player-item-manage">
                <span class="player-name">${jogador.nome}</span>
                <button class="remove-player-btn" onclick="removePlayer('${jogador.userId}')">
                    ❌ Remover
                </button>
            </div>
        `).join('');
    } else {
        currentPlayersDiv.innerHTML = '<p class="no-players">Nenhum jogador inscrito ainda</p>';
    }
    
    document.getElementById('manage-modal').style.display = 'block';
}

// Fechar modal de gerenciamento
function closeManageModal() {
    document.getElementById('manage-modal').style.display = 'none';
    currentManagedMesa = null;
}

// Editar mesa
function editMesa() {
    if (!currentManagedMesa) return;
    
    // Preencher formulário com dados atuais
    document.getElementById('edit-mesa-nome').value = currentManagedMesa.nome;
    document.getElementById('edit-mesa-missao').value = currentManagedMesa.missao;
    document.getElementById('edit-mesa-max-players').value = currentManagedMesa.maxPlayers;
    document.getElementById('edit-mesa-data').value = currentManagedMesa.data;
    document.getElementById('edit-mesa-descricao').value = currentManagedMesa.descricao;
    
    // Se for missão personalizada, preencher campos extras
    if (currentManagedMesa.missao === 'custom' && currentManagedMesa.customMission) {
        document.getElementById('edit-custom-mission-name').value = currentManagedMesa.customMission.name;
        document.getElementById('edit-custom-mission-description').value = currentManagedMesa.customMission.description;
        document.getElementById('edit-custom-mission-difficulty').value = currentManagedMesa.customMission.difficulty;
        document.getElementById('edit-custom-mission-duration').value = currentManagedMesa.customMission.duration;
        document.getElementById('edit-custom-mission-fields').style.display = 'block';
    }
    
    // Mostrar modal
    document.getElementById('edit-mesa-modal').style.display = 'block';
    closeManageModal();
}

// Fechar modal de edição
function closeEditModal() {
    document.getElementById('edit-mesa-modal').style.display = 'none';
}

// Salvar edição da mesa
async function saveEditMesa(event) {
    event.preventDefault();
    
    if (!currentManagedMesa) return;
    
    const missaoSelecionada = document.getElementById('edit-mesa-missao').value;
    let updatedData = {
        nome: document.getElementById('edit-mesa-nome').value,
        maxPlayers: parseInt(document.getElementById('edit-mesa-max-players').value),
        data: document.getElementById('edit-mesa-data').value,
        descricao: document.getElementById('edit-mesa-descricao').value
    };
    
    if (missaoSelecionada === 'custom') {
        updatedData.missao = 'custom';
        updatedData.customMission = {
            name: document.getElementById('edit-custom-mission-name').value,
            description: document.getElementById('edit-custom-mission-description').value,
            difficulty: document.getElementById('edit-custom-mission-difficulty').value,
            duration: document.getElementById('edit-custom-mission-duration').value
        };
    } else {
        updatedData.missao = missaoSelecionada;
        // Remover customMission se existir
        updatedData.customMission = null;
    }
    
    // Verificar se mesa ficou cheia ou aberta com nova capacidade
    if (currentManagedMesa.currentPlayers >= updatedData.maxPlayers) {
        updatedData.status = 'cheia';
    } else if (currentManagedMesa.status === 'cheia' && currentManagedMesa.currentPlayers < updatedData.maxPlayers) {
        updatedData.status = 'aberta';
    }
    
    try {
        await updateDoc(doc(db, 'mesas', currentManagedMesa.id), updatedData);
        alert('Mesa atualizada com sucesso!');
        closeEditModal();
        
        // Atualizar dados locais
        Object.assign(currentManagedMesa, updatedData);
    } catch (error) {
        alert('Erro ao atualizar mesa: ' + error.message);
    }
}

// Excluir mesa
function deleteMesa() {
    if (!currentManagedMesa) return;
    
    if (confirm(`Tem certeza que deseja excluir a mesa "${currentManagedMesa.nome}"?`)) {
        cancelarMesa(currentManagedMesa.id);
        closeManageModal();
    }
}

// Adicionar jogador - mostrar candidatos
function addPlayer() {
    if (!currentManagedMesa) return;
    
    showCandidatesModal();
}

// Mostrar modal de candidatos
function showCandidatesModal() {
    const candidatesList = document.getElementById('candidates-list');
    
    // Simular candidatos (em um sistema real, viria do banco de dados)
    const candidatos = [
        {
            id: 'cand1',
            nick: 'HistoriaFan',
            idade: 25,
            personagem: 'Zumbi dos Palmares',
            experiencia: 'Iniciante'
        },
        {
            id: 'cand2', 
            nick: 'RPGMaster',
            idade: 30,
            personagem: 'Santos Dumont',
            experiencia: 'Experiente'
        },
        {
            id: 'cand3',
            nick: 'CulturaGamer',
            idade: 22,
            personagem: 'Tarsila do Amaral',
            experiencia: 'Intermediário'
        },
        {
            id: 'cand4',
            nick: 'SertanejoRPG',
            idade: 28,
            personagem: 'Maria Bonita',
            experiencia: 'Avançado'
        },
        {
            id: 'cand5',
            nick: 'EcoGamer',
            idade: 24,
            personagem: 'Chico Mendes',
            experiencia: 'Intermediário'
        }
    ];
    
    if (candidatos.length === 0) {
        candidatesList.innerHTML = '<p class="no-candidates">Nenhum candidato disponível no momento.</p>';
    } else {
        candidatesList.innerHTML = candidatos.map(candidato => `
            <div class="candidate-item">
                <div class="candidate-info">
                    <div class="candidate-header">
                        <span class="candidate-nick">👤 ${candidato.nick}</span>
                        <span class="candidate-age">🎂 ${candidato.idade} anos</span>
                    </div>
                    <div class="candidate-details">
                        <span class="candidate-character">🎭 ${candidato.personagem}</span>
                        <span class="candidate-exp">🎯 ${candidato.experiencia}</span>
                    </div>
                </div>
                <button class="accept-candidate-btn" onclick="acceptCandidate('${candidato.id}', '${candidato.nick}', '${candidato.personagem}')">
                    ✓ Aceitar
                </button>
            </div>
        `).join('');
    }
    
    document.getElementById('candidates-modal').style.display = 'block';
    closeManageModal();
}

// Fechar modal de candidatos
function closeCandidatesModal() {
    document.getElementById('candidates-modal').style.display = 'none';
}

// Aceitar candidato
function acceptCandidate(candidateId, nick, personagem) {
    if (!currentManagedMesa) return;
    
    const novoJogador = {
        userId: candidateId,
        nome: nick,
        personagem: personagem,
        dataInscricao: new Date().toISOString()
    };
    
    if (!currentManagedMesa.jogadores) currentManagedMesa.jogadores = [];
    currentManagedMesa.jogadores.push(novoJogador);
    currentManagedMesa.currentPlayers++;
    
    if (currentManagedMesa.currentPlayers >= currentManagedMesa.maxPlayers) {
        currentManagedMesa.status = 'cheia';
    }
    
    updateMesaData(currentManagedMesa.id, {
        jogadores: currentManagedMesa.jogadores,
        currentPlayers: currentManagedMesa.currentPlayers,
        status: currentManagedMesa.status
    });
    
    alert(`${nick} foi adicionado à mesa!`);
    closeCandidatesModal();
}

// Remover jogador
function removePlayer(userId) {
    if (!currentManagedMesa) return;
    
    const jogador = currentManagedMesa.jogadores.find(j => j.userId === userId);
    if (!jogador) return;
    
    if (confirm(`Remover ${jogador.nome} da mesa?`)) {
        currentManagedMesa.jogadores = currentManagedMesa.jogadores.filter(j => j.userId !== userId);
        currentManagedMesa.currentPlayers = currentManagedMesa.jogadores.length;
        
        if (currentManagedMesa.status === 'cheia' && currentManagedMesa.currentPlayers < currentManagedMesa.maxPlayers) {
            currentManagedMesa.status = 'aberta';
        }
        
        updateMesaData(currentManagedMesa.id, {
            jogadores: currentManagedMesa.jogadores,
            currentPlayers: currentManagedMesa.currentPlayers,
            status: currentManagedMesa.status
        });
        
        showManageModal(currentManagedMesa);
    }
}

// Atualizar dados da mesa
async function updateMesaData(mesaId, data) {
    try {
        await updateDoc(doc(db, 'mesas', mesaId), data);
        console.log('Mesa atualizada com sucesso');
    } catch (error) {
        alert('Erro ao atualizar mesa: ' + error.message);
    }
}

// Cancelar mesa (mestre)
async function cancelarMesa(mesaId) {
    if (!confirm('Tem certeza que deseja cancelar esta mesa?')) return;
    
    try {
        await deleteDoc(doc(db, 'mesas', mesaId));
        alert('Mesa cancelada com sucesso!');
    } catch (error) {
        alert('Erro ao cancelar mesa: ' + error.message);
    }
}

// Sair da mesa (jogador)
async function sairMesa(mesaId) {
    if (!confirm('Tem certeza que deseja sair desta mesa?')) return;
    
    const mesa = gameState.mesas.find(m => m.id === mesaId);
    
    if (mesa && mesa.jogadores) {
        mesa.jogadores = mesa.jogadores.filter(j => j.userId !== currentUser.uid);
        mesa.currentPlayers = mesa.jogadores.length;
        
        if (mesa.status === 'cheia' && mesa.currentPlayers < mesa.maxPlayers) {
            mesa.status = 'aberta';
        }
        
        try {
            await updateDoc(doc(db, 'mesas', mesaId), {
                jogadores: mesa.jogadores,
                currentPlayers: mesa.currentPlayers,
                status: mesa.status
            });
            
            alert('Você saiu da mesa com sucesso!');
        } catch (error) {
            alert('Erro ao sair da mesa: ' + error.message);
        }
    }
}

// Copiar link da mesa
function copyMesaLink(codigo) {
    const mesaUrl = `${window.location.origin}/mesa.html?codigo=${codigo}`;
    navigator.clipboard.writeText(mesaUrl).then(() => {
        alert('Link da mesa copiado para a área de transferência!');
    }).catch(() => {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = mesaUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link da mesa copiado para a área de transferência!');
    });
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

// Mostrar modal de convite
function showInviteModal(codigo, mesaUrl) {
    document.getElementById('mesa-codigo').textContent = codigo;
    document.getElementById('invite-link').value = mesaUrl;
    document.getElementById('invite-modal').style.display = 'block';
    
    // Event listener para copiar link
    document.getElementById('copy-invite-btn').onclick = function() {
        const linkInput = document.getElementById('invite-link');
        linkInput.select();
        navigator.clipboard.writeText(linkInput.value).then(() => {
            this.textContent = '✓ Copiado!';
            this.style.background = '#4caf50';
            setTimeout(() => {
                this.textContent = '📋 Copiar';
                this.style.background = '';
            }, 2000);
        });
    };
}

// Fechar modal de convite
function closeInviteModal() {
    document.getElementById('invite-modal').style.display = 'none';
}

// Event listener para fechar modals clicando no X ou fora
document.addEventListener('DOMContentLoaded', function() {
    // Modal de convite
    const inviteModal = document.getElementById('invite-modal');
    const inviteCloseBtn = inviteModal?.querySelector('.close');
    
    if (inviteCloseBtn) {
        inviteCloseBtn.onclick = closeInviteModal;
    }
    
    if (inviteModal) {
        inviteModal.onclick = function(event) {
            if (event.target === inviteModal) {
                closeInviteModal();
            }
        };
    }
    
    // Modal de gerenciamento
    const manageModal = document.getElementById('manage-modal');
    const manageCloseBtn = manageModal?.querySelector('.close');
    
    if (manageCloseBtn) {
        manageCloseBtn.onclick = closeManageModal;
    }
    
    if (manageModal) {
        manageModal.onclick = function(event) {
            if (event.target === manageModal) {
                closeManageModal();
            }
        };
    }
    
    // Modal de edição
    const editModal = document.getElementById('edit-mesa-modal');
    const editCloseBtn = editModal?.querySelector('.close');
    
    if (editCloseBtn) {
        editCloseBtn.onclick = closeEditModal;
    }
    
    if (editModal) {
        editModal.onclick = function(event) {
            if (event.target === editModal) {
                closeEditModal();
            }
        };
    }
    
    // Modal de candidatos
    const candidatesModal = document.getElementById('candidates-modal');
    const candidatesCloseBtn = candidatesModal?.querySelector('.close');
    
    if (candidatesCloseBtn) {
        candidatesCloseBtn.onclick = closeCandidatesModal;
    }
    
    if (candidatesModal) {
        candidatesModal.onclick = function(event) {
            if (event.target === candidatesModal) {
                closeCandidatesModal();
            }
        };
    }
    
    // Event listener para formulário de edição
    const editForm = document.getElementById('edit-mesa-form');
    if (editForm) {
        editForm.addEventListener('submit', saveEditMesa);
    }
});

// Mostrar/ocultar campos de missão personalizada
function toggleCustomMission() {
    const select = document.getElementById('mesa-missao');
    const customFields = document.getElementById('custom-mission-fields');
    
    if (select.value === 'custom') {
        customFields.style.display = 'block';
        // Tornar campos obrigatórios
        document.getElementById('custom-mission-name').required = true;
        document.getElementById('custom-mission-description').required = true;
    } else {
        customFields.style.display = 'none';
        // Remover obrigatoriedade
        document.getElementById('custom-mission-name').required = false;
        document.getElementById('custom-mission-description').required = false;
    }
}

// Mostrar/ocultar campos de missão personalizada na edição
function toggleEditCustomMission() {
    const select = document.getElementById('edit-mesa-missao');
    const customFields = document.getElementById('edit-custom-mission-fields');
    
    if (select.value === 'custom') {
        customFields.style.display = 'block';
    } else {
        customFields.style.display = 'none';
    }
}

// Atualizar função de criar card para suportar missões personalizadas
function getMissionInfo(mesa) {
    if (mesa.missao === 'custom' && mesa.customMission) {
        return {
            name: mesa.customMission.name,
            description: mesa.customMission.description,
            difficulty: mesa.customMission.difficulty,
            duration: mesa.customMission.duration
        };
    }
    
    return gameState.missions[mesa.missao] || { 
        name: 'Missão não encontrada', 
        description: 'Informações não disponíveis',
        duration: 'N/A', 
        difficulty: 'N/A' 
    };
}

// Mostrar guia do mestre
function showMasterGuide(missionId) {
    const mission = gameState.missions[missionId];
    if (!mission || !mission.masterGuide) return;
    
    const guide = mission.masterGuide;
    const modal = document.getElementById('master-guide-modal') || createMasterGuideModal();
    
    document.getElementById('guide-mission-title').textContent = mission.name;
    document.getElementById('guide-introduction').textContent = guide.introduction;
    
    // Contexto histórico
    const contextDiv = document.getElementById('guide-context');
    const context = guide.historicalContext;
    contextDiv.innerHTML = `
        <p><strong>Período:</strong> ${context?.period || 'Não informado'}</p>
        <p><strong>Local:</strong> ${context?.location || 'Não informado'}</p>
        <p><strong>Contexto Social:</strong> ${context?.socialContext || 'Não informado'}</p>
        <p><strong>Momento Político:</strong> ${context?.politicalMoment || context?.culturalMoment || 'Não informado'}</p>
    `;
    
    // Locais importantes
    const locationsDiv = document.getElementById('guide-locations');
    locationsDiv.innerHTML = guide.keyLocations.map(loc => `
        <div class="guide-location">
            <h4>${loc.name}</h4>
            <p>${loc.description}</p>
            <p><em>Atmosfera:</em> ${loc.atmosphere}</p>
            <p><strong>NPCs:</strong> ${loc.npcs.join(', ')}</p>
        </div>
    `).join('');
    
    // Encontros
    const encountersDiv = document.getElementById('guide-encounters');
    encountersDiv.innerHTML = guide.encounters.map(enc => `
        <div class="guide-encounter">
            <h4>${enc.title}</h4>
            <p>${enc.description}</p>
            <p><strong>Desafio:</strong> ${enc.challenge}</p>
            <p><strong>Recompensa:</strong> ${enc.reward}</p>
        </div>
    `).join('');
    
    // Lições culturais
    const lessonsDiv = document.getElementById('guide-lessons');
    lessonsDiv.innerHTML = guide.culturalLessons.map(lesson => `<li>${lesson}</li>`).join('');
    
    // Dicas de gameplay
    const tipsDiv = document.getElementById('guide-tips');
    tipsDiv.innerHTML = guide.gameplayTips.map(tip => `<li>${tip}</li>`).join('');
    
    modal.style.display = 'block';
}

// Criar modal do guia do mestre
function createMasterGuideModal() {
    const modal = document.createElement('div');
    modal.id = 'master-guide-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content master-guide-content">
            <span class="close" onclick="closeMasterGuideModal()">&times;</span>
            <h2 id="guide-mission-title"></h2>
            
            <div class="guide-section">
                <h3>Introdução</h3>
                <p id="guide-introduction"></p>
            </div>
            
            <div class="guide-section">
                <h3>Contexto Histórico</h3>
                <div id="guide-context"></div>
            </div>
            
            <div class="guide-section">
                <h3>Locais Importantes</h3>
                <div id="guide-locations"></div>
            </div>
            
            <div class="guide-section">
                <h3>Encontros Sugeridos</h3>
                <div id="guide-encounters"></div>
            </div>
            
            <div class="guide-section">
                <h3>Lições Culturais</h3>
                <ul id="guide-lessons"></ul>
            </div>
            
            <div class="guide-section">
                <h3>Dicas de Gameplay</h3>
                <ul id="guide-tips"></ul>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

// Fechar modal do guia do mestre
function closeMasterGuideModal() {
    const modal = document.getElementById('master-guide-modal');
    if (modal) modal.style.display = 'none';
}

// Exportar funções globais
window.showTab = showTab;
window.joinMesa = joinMesa;
window.gerenciarMesa = gerenciarMesa;
window.cancelarMesa = cancelarMesa;
window.sairMesa = sairMesa;
window.copyMesaLink = copyMesaLink;
window.findMesaByCodigo = findMesaByCodigo;
window.closeInviteModal = closeInviteModal;
window.closeManageModal = closeManageModal;
window.editMesa = editMesa;
window.deleteMesa = deleteMesa;
window.addPlayer = addPlayer;
window.removePlayer = removePlayer;
window.closeEditModal = closeEditModal;
window.closeCandidatesModal = closeCandidatesModal;
window.acceptCandidate = acceptCandidate;
window.toggleCustomMission = toggleCustomMission;
window.toggleEditCustomMission = toggleEditCustomMission;
window.showMasterGuide = showMasterGuide;
window.closeMasterGuideModal = closeMasterGuideModal;