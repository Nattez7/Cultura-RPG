import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let personagens = {
    zumbi: {
        name: 'Zumbi dos Palmares',
        description: 'Líder quilombola, símbolo da resistência contra a escravidão.',
        stats: { força: 3, sabedoria: 1, carisma: 1 },
        background: 'Nascido livre em Palmares, foi capturado ainda criança e educado por um padre português. Retornou ao quilombo aos 15 anos e se tornou um dos maiores líderes da resistência negra no Brasil colonial.',
        talents: [
            'Lideranca de Guerra: +1 dado extra em situacoes de combate e lideranca militar',
            'Resistencia Quilombola: Pode rolar novamente falhas em testes de resistencia fisica'
        ],
        image: 'images/personagens/Zumbi dos Palmares.jpg'
    },
    maria: {
        name: 'Maria Bonita',
        description: 'Cangaceira corajosa, companheira de Lampião no sertão nordestino.',
        stats: { força: 2, sabedoria: 1, carisma: 2 },
        background: 'Maria Déa, conhecida como Maria Bonita, foi a primeira mulher a integrar um grupo de cangaceiros. Corajosa e determinada, quebrou paradigmas sociais de sua época.',
        talents: [
            'Tiro Certeiro: +1 dado extra em acoes com armas de fogo',
            'Charme Sertanejo: Pode usar Carisma no lugar de Forca em situacoes de intimidacao'
        ],
        image: 'images/personagens/Maria Bonita.webp'
    },
    chico: {
        name: 'Chico Mendes',
        description: 'Seringueiro e ambientalista, defensor da Amazônia.',
        stats: { força: 1, sabedoria: 2, carisma: 2 },
        background: 'Francisco Alves Mendes Filho foi um seringueiro, sindicalista e ativista ambiental brasileiro. Lutou pela preservação da Amazônia e pelos direitos dos trabalhadores rurais.',
        talents: [
            'Conhecimento da Floresta: +1 dado extra em acoes relacionadas a natureza',
            'Mobilizacao Popular: Pode rolar novamente falhas em testes de convencimento para causas ambientais'
        ],
        image: 'images/personagens/Chico Mendes.jpg'
    },
    dandara: {
        name: 'Dandara',
        description: 'Guerreira quilombola, estrategista militar de Palmares.',
        stats: { força: 2, sabedoria: 2, carisma: 1 },
        background: 'Guerreira negra que lutou contra o sistema escravocrata. Companheira de Zumbi, foi uma das principais líderes militares do Quilombo dos Palmares.',
        talents: [
            'Mestre em Combate: +1 dado extra em lutas corpo a corpo',
            'Taticas de Guerra: Pode usar Sabedoria no lugar de Forca em combates estrategicos'
        ],
        image: 'images/personagens/Dandara.jpeg'
    },
    santos: {
        name: 'Santos Dumont',
        description: 'Pioneiro da aviação, inventor e visionário brasileiro.',
        stats: { força: 1, sabedoria: 3, carisma: 1 },
        background: 'Alberto Santos Dumont foi um inventor, aeronauta e pioneiro da aviação. Conhecido mundialmente por seus experimentos com balões dirigíveis e pelo primeiro voo público de um avião.',
        talents: [
            'Genialidade Inventiva: +1 dado extra ao criar ou consertar maquinas',
            'Visionario: Pode rolar novamente falhas em testes de inovacao tecnologica'
        ],
        image: 'images/personagens/Santos Dumont.jpg'
    },
    machado: {
        name: 'Machado de Assis',
        description: 'Maior escritor brasileiro, mestre da literatura nacional.',
        stats: { força: 1, sabedoria: 2, carisma: 2 },
        background: 'Joaquim Maria Machado de Assis foi um escritor brasileiro, considerado o maior nome da literatura nacional. Fundador da Academia Brasileira de Letras.',
        talents: [
            'Mestre das Palavras: +1 dado extra em persuasao atraves da eloquencia',
            'Analise Humana: Pode usar Sabedoria no lugar de Carisma para entender motivacoes'
        ],
        image: 'images/personagens/Machado de Assis.jpg'
    },
    pixinguinha: {
        name: 'Pixinguinha',
        description: 'Compositor e instrumentista, pai do choro brasileiro.',
        stats: { força: 1, sabedoria: 1, carisma: 3 },
        background: 'Alfredo da Rocha Viana Filho, conhecido como Pixinguinha, foi um compositor, arranjador e instrumentista brasileiro, considerado um dos maiores gênios da música popular brasileira.',
        talents: [
            'Maestria Musical: +1 dado extra em acoes envolvendo musica',
            'Alma do Choro: Pode rolar novamente falhas ao tentar conectar pessoas atraves da musica'
        ],
        image: 'images/personagens/Pixinguinha.jpg'
    },
    tarsila: {
        name: 'Tarsila do Amaral',
        description: 'Pintora modernista, ícone das artes plásticas brasileiras.',
        stats: { força: 1, sabedoria: 1, carisma: 3 },
        background: 'Tarsila de Aguiar do Amaral foi uma pintora e desenhista brasileira e uma das figuras centrais da primeira fase do movimento modernista no Brasil.',
        talents: [
            'Visao Artistica: +1 dado extra em acoes criativas e artisticas',
            'Inspiracao Modernista: Pode usar Carisma no lugar de Sabedoria para resolver problemas de forma inovadora'
        ],
        image: 'images/personagens/Tarsila do Amaral.jpg'
    },
    lampiao: {
        name: 'Lampião',
        description: 'Rei do Cangaço, lendário líder do sertão nordestino.',
        stats: { força: 2, sabedoria: 1, carisma: 2 },
        background: 'Virgulino Ferreira da Silva, conhecido como Lampião, foi o mais famoso líder cangaceiro do Nordeste brasileiro. Símbolo de resistência e justiça sertaneja.',
        talents: [
            'Rei do Sertao: +1 dado extra em acoes no ambiente da caatinga',
            'Lideranca Cangaceira: Pode usar Carisma no lugar de Forca para intimidar'
        ],
        image: 'images/personagens/Lampiao.jpg'
    }
};

async function carregarPersonagensDoFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, 'personagens'));
        const dadosFirestore = {};
        
        querySnapshot.forEach((doc) => {
            dadosFirestore[doc.id] = doc.data();
        });
        
        if (Object.keys(dadosFirestore).length > 0) {
            personagens = dadosFirestore;
            console.log('Personagens carregados do Firestore');
        }
        
        carregarPersonagens();
    } catch (error) {
        console.log('Usando dados locais - Firestore indisponivel:', error.message);
        carregarPersonagens();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Carregando personagens...');
    carregarPersonagens();
});

function carregarPersonagens() {
    const gradePersonagens = document.getElementById('character-grid');
    if (!gradePersonagens) return;
    
    if (Object.keys(personagens).length === 0) {
        gradePersonagens.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Carregando personagens...</p>';
        return;
    }
    
    gradePersonagens.innerHTML = Object.keys(personagens).map(id => 
        criarCardPersonagem(id, personagens[id])
    ).join('');
}

function criarCardPersonagem(id, personagem) {
    return `
        <div class="character-card" onclick="mostrarDetalhesPersonagem('${id}')">
            <div class="character-image-container">
                <img src="${personagem.image}" alt="${personagem.name}">
            </div>
            <div class="character-info">
                <h3>${personagem.name}</h3>
                <p>${personagem.description}</p>
                <div class="stats">
                    <div class="stat-item forca">Forca: ${personagem.stats.força}</div>
                    <div class="stat-item sabedoria">Sabedoria: ${personagem.stats.sabedoria}</div>
                    <div class="stat-item carisma">Carisma: ${personagem.stats.carisma}</div>
                </div>
            </div>
        </div>
    `;
}

function mostrarDetalhesPersonagem(idPersonagem) {
    const personagem = personagens[idPersonagem];
    if (!personagem) return;
    
    const conteudoModal = document.getElementById('modal-character-content');
    if (!conteudoModal) return;
    
    conteudoModal.innerHTML = `
        <div class="character-details">
            <h2>${personagem.name}</h2>
            <img src="${personagem.image}" alt="${personagem.name}">
            
            <div class="stats-modal">
                <div class="stat-item forca">Forca: ${personagem.stats.força} dados</div>
                <div class="stat-item sabedoria">Sabedoria: ${personagem.stats.sabedoria} dados</div>
                <div class="stat-item carisma">Carisma: ${personagem.stats.carisma} dados</div>
            </div>
            
            <div class="dice-system">
                <h4>Sistema de Dados</h4>
                <p>Role 1d6 + dados do atributo, use o maior resultado:</p>
                <ul>
                    <li><strong>1-2:</strong> Falha</li>
                    <li><strong>3-4:</strong> Sucesso Parcial</li>
                    <li><strong>5-6:</strong> Sucesso Total</li>
                </ul>
            </div>
            
            <div class="background">
                <h4>Historia</h4>
                <p>${personagem.background}</p>
            </div>
            
            <div class="talents">
                <h4>Talentos Especiais</h4>
                <ul>
                    ${personagem.talents.map(talent => `<li>${talent}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    abrirModal('character-modal');
}

// Exportar funcoes globais
window.mostrarDetalhesPersonagem = mostrarDetalhesPersonagem;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;

// Funcoes de modal para compatibilidade
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function fecharModal() {
    const modais = document.querySelectorAll('.modal');
    modais.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}