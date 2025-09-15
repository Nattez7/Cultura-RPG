import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Estado dos personagens
let characters = {
    zumbi: {
        name: 'Zumbi dos Palmares',
        description: 'Líder quilombola, símbolo da resistência contra a escravidão.',
        stats: { força: 3, sabedoria: 1, carisma: 1 },
        background: 'Nascido livre em Palmares, foi capturado ainda criança e educado por um padre português. Retornou ao quilombo aos 15 anos e se tornou um dos maiores líderes da resistência negra no Brasil colonial.',
        talents: [
            'Liderança de Guerra: +1 dado extra em situações de combate e liderança militar',
            'Resistência Quilombola: Pode rolar novamente falhas em testes de resistência física'
        ],
        image: 'images/personagens/Zumbi dos Palmares.jpg'
    },
    maria: {
        name: 'Maria Bonita',
        description: 'Cangaceira corajosa, companheira de Lampião no sertão nordestino.',
        stats: { força: 2, sabedoria: 1, carisma: 2 },
        background: 'Maria Déa, conhecida como Maria Bonita, foi a primeira mulher a integrar um grupo de cangaceiros. Corajosa e determinada, quebrou paradigmas sociais de sua época.',
        talents: [
            'Tiro Certeiro: +1 dado extra em ações com armas de fogo',
            'Charme Sertanejo: Pode usar Carisma no lugar de Força em situações de intimidação'
        ],
        image: 'images/personagens/Maria Bonita.webp'
    },
    chico: {
        name: 'Chico Mendes',
        description: 'Seringueiro e ambientalista, defensor da Amazônia.',
        stats: { força: 1, sabedoria: 2, carisma: 2 },
        background: 'Francisco Alves Mendes Filho foi um seringueiro, sindicalista e ativista ambiental brasileiro. Lutou pela preservação da Amazônia e pelos direitos dos trabalhadores rurais.',
        talents: [
            'Conhecimento da Floresta: +1 dado extra em ações relacionadas à natureza',
            'Mobilização Popular: Pode rolar novamente falhas em testes de convencimento para causas ambientais'
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
            'Táticas de Guerra: Pode usar Sabedoria no lugar de Força em combates estratégicos'
        ],
        image: 'images/personagens/Dandara.jpeg'
    },
    santos: {
        name: 'Santos Dumont',
        description: 'Pioneiro da aviação, inventor e visionário brasileiro.',
        stats: { força: 1, sabedoria: 3, carisma: 1 },
        background: 'Alberto Santos Dumont foi um inventor, aeronauta e pioneiro da aviação. Conhecido mundialmente por seus experimentos com balões dirigíveis e pelo primeiro voo público de um avião.',
        talents: [
            'Genialidade Inventiva: +1 dado extra ao criar ou consertar máquinas',
            'Visionário: Pode rolar novamente falhas em testes de inovação tecnológica'
        ],
        image: 'images/personagens/Santos Dumont.jpg'
    },
    machado: {
        name: 'Machado de Assis',
        description: 'Maior escritor brasileiro, mestre da literatura nacional.',
        stats: { força: 1, sabedoria: 2, carisma: 2 },
        background: 'Joaquim Maria Machado de Assis foi um escritor brasileiro, considerado o maior nome da literatura nacional. Fundador da Academia Brasileira de Letras.',
        talents: [
            'Mestre das Palavras: +1 dado extra em persuasão através da eloquência',
            'Análise Humana: Pode usar Sabedoria no lugar de Carisma para entender motivações'
        ],
        image: 'images/personagens/Machado de Assis.jpg'
    },
    pixinguinha: {
        name: 'Pixinguinha',
        description: 'Compositor e instrumentista, pai do choro brasileiro.',
        stats: { força: 1, sabedoria: 1, carisma: 3 },
        background: 'Alfredo da Rocha Viana Filho, conhecido como Pixinguinha, foi um compositor, arranjador e instrumentista brasileiro, considerado um dos maiores gênios da música popular brasileira.',
        talents: [
            'Maestria Musical: +1 dado extra em ações envolvendo música',
            'Alma do Choro: Pode rolar novamente falhas ao tentar conectar pessoas através da música'
        ],
        image: 'images/personagens/Pixinguinha.jpg'
    },
    tarsila: {
        name: 'Tarsila do Amaral',
        description: 'Pintora modernista, ícone das artes plásticas brasileiras.',
        stats: { força: 1, sabedoria: 1, carisma: 3 },
        background: 'Tarsila de Aguiar do Amaral foi uma pintora e desenhista brasileira e uma das figuras centrais da primeira fase do movimento modernista no Brasil.',
        talents: [
            'Visão Artística: +1 dado extra em ações criativas e artísticas',
            'Inspiração Modernista: Pode usar Carisma no lugar de Sabedoria para resolver problemas de forma inovadora'
        ],
        image: 'images/personagens/Tarsila do Amaral.jpg'
    },
    lampiao: {
        name: 'Lampião',
        description: 'Rei do Cangaço, lendário líder do sertão nordestino.',
        stats: { força: 2, sabedoria: 1, carisma: 2 },
        background: 'Virgulino Ferreira da Silva, conhecido como Lampião, foi o mais famoso líder cangaceiro do Nordeste brasileiro. Símbolo de resistência e justiça sertaneja.',
        talents: [
            'Rei do Sertão: +1 dado extra em ações no ambiente da caatinga',
            'Liderança Cangaceira: Pode usar Carisma no lugar de Força para intimidar'
        ],
        image: 'images/personagens/Lampiao.jpg'
    }
};

// Carregar personagens do Firestore (com fallback)
async function loadCharactersFromFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, 'personagens'));
        const firestoreData = {};
        
        querySnapshot.forEach((doc) => {
            firestoreData[doc.id] = doc.data();
        });
        
        if (Object.keys(firestoreData).length > 0) {
            characters = firestoreData;
            console.log('Personagens carregados do Firestore');
        }
        
        loadCharacters();
    } catch (error) {
        console.log('Usando dados locais - Firestore indisponível:', error.message);
        loadCharacters();
    }
}



// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carregando personagens...');
    loadCharacters(); // Carregar dados locais primeiro
    // loadCharactersFromFirebase(); // Comentado temporariamente para teste
});

function loadCharacters() {
    const characterGrid = document.getElementById('character-grid');
    if (!characterGrid) return;
    
    if (Object.keys(characters).length === 0) {
        characterGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Carregando personagens...</p>';
        return;
    }
    
    characterGrid.innerHTML = Object.keys(characters).map(id => 
        createCharacterCard(id, characters[id])
    ).join('');
}

function createCharacterCard(id, character) {
    return `
        <div class="character-card" onclick="showCharacterDetails('${id}')">
            <div class="character-image-container">
                <img src="${character.image}" alt="${character.name}">
            </div>
            <div class="character-info">
                <h3>${character.name}</h3>
                <p>${character.description}</p>
                <div class="stats">
                    <div class="stat-item forca">💪 ${character.stats.força}</div>
                    <div class="stat-item sabedoria">🧠 ${character.stats.sabedoria}</div>
                    <div class="stat-item carisma">✨ ${character.stats.carisma}</div>
                </div>
            </div>
        </div>
    `;
}

function showCharacterDetails(characterId) {
    const character = characters[characterId];
    if (!character) return;
    
    const modalContent = document.getElementById('modal-character-content');
    if (!modalContent) return;
    
    modalContent.innerHTML = `
        <div class="character-details">
            <h2>${character.name}</h2>
            <img src="${character.image}" alt="${character.name}">
            
            <div class="stats-modal">
                <div class="stat-item forca">💪 Força: ${character.stats.força} dados</div>
                <div class="stat-item sabedoria">🧠 Sabedoria: ${character.stats.sabedoria} dados</div>
                <div class="stat-item carisma">✨ Carisma: ${character.stats.carisma} dados</div>
            </div>
            
            <div class="dice-system">
                <h4>🎲 Sistema de Dados</h4>
                <p>Role 1d6 + dados do atributo, use o maior resultado:</p>
                <ul>
                    <li><strong>1-2:</strong> Falha</li>
                    <li><strong>3-4:</strong> Sucesso Parcial</li>
                    <li><strong>5-6:</strong> Sucesso Total</li>
                </ul>
            </div>
            
            <div class="background">
                <h4>📚 História</h4>
                <p>${character.background}</p>
            </div>
            
            <div class="talents">
                <h4>⭐ Talentos Especiais</h4>
                <ul>
                    ${character.talents.map(talent => `<li>${talent}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    openModal('character-modal');
}

// Exportar função globalmente
window.showCharacterDetails = showCharacterDetails;