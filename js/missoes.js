import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let missoes = {};

document.addEventListener('DOMContentLoaded', function() {
    carregarMissoes();
    configurarModal();
});

async function carregarMissoes() {
    const listaMissoes = document.getElementById('missions-list');
    
    listaMissoes.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Carregando missoes...</p>
        </div>
    `;
    
    try {
        const querySnapshot = await getDocs(collection(db, 'missoes'));
        
        if (querySnapshot.empty) {
            listaMissoes.innerHTML = `
                <div class="loading">
                    <p>Nenhuma missao encontrada no banco de dados.</p>
                </div>
            `;
            return;
        }
        
        missoes = {};
        querySnapshot.forEach((doc) => {
            missoes[doc.id] = doc.data();
        });
        
        exibirMissoes();
        
    } catch (error) {
        console.error('Erro ao carregar missoes:', error);
        listaMissoes.innerHTML = `
            <div class="loading">
                <p>Erro ao carregar missoes. Tente recarregar a pagina.</p>
            </div>
        `;
    }
}

function exibirMissoes() {
    const listaMissoes = document.getElementById('missions-list');
    
    if (Object.keys(missoes).length === 0) {
        listaMissoes.innerHTML = `
            <div class="loading">
                <p>Nenhuma missao disponivel.</p>
            </div>
        `;
        return;
    }
    
    listaMissoes.innerHTML = Object.keys(missoes).map(id => 
        criarCardMissao(id, missoes[id])
    ).join('');
}

function criarCardMissao(id, missao) {
    const classDificuldade = `difficulty-${missao.difficulty}`;
    
    return `
        <div class="mission-card" onclick="mostrarDetalhesMissao('${id}')">
            <div class="mission-header">
                <div>
                    <h3 class="mission-title">${missao.name}</h3>
                </div>
                <span class="mission-difficulty ${classDificuldade}">${missao.difficulty}</span>
            </div>
            
            <div class="mission-info">
                <div class="info-item">
                    <span>Duracao:</span>
                    <span><strong>${missao.duration}</strong></span>
                </div>
                <div class="info-item">
                    <span>Periodo:</span>
                    <span><strong>${missao.period || 'Nao informado'}</strong></span>
                </div>
            </div>
            
            <div class="mission-description">
                ${missao.description}
            </div>
            
            ${missao.themes ? `
            <div class="mission-tags">
                ${missao.themes.map(theme => `<span class="mission-tag">${theme}</span>`).join('')}
            </div>
            ` : ''}
            
            <button class="view-details-btn">
                Ver Guia Completo do Mestre
            </button>
        </div>
    `;
}

function mostrarDetalhesMissao(idMissao) {
    const missao = missoes[idMissao];
    if (!missao) return;
    
    const conteudoModal = document.getElementById('mission-details');
    
    conteudoModal.innerHTML = `
        <div class="mission-detail-header">
            <h2 class="mission-detail-title">${missao.name}</h2>
            <p class="mission-detail-subtitle">${missao.description}</p>
            
            <div class="mission-detail-meta">
                <div class="meta-item">
                    <div class="meta-label">Dificuldade</div>
                    <div class="meta-value">${missao.difficulty}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Duracao</div>
                    <div class="meta-value">${missao.duration}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Periodo</div>
                    <div class="meta-value">${missao.period || 'Nao informado'}</div>
                </div>
            </div>
        </div>
        
        <div class="mission-detail-content">
            ${missao.masterGuide ? criarConteudoGuiaMestre(missao.masterGuide) : criarConteudoBasico(missao)}
        </div>
    `;
    
    document.getElementById('mission-modal').style.display = 'block';
}

function criarConteudoGuiaMestre(guia) {
    return `
        <div class="detail-section">
            <h3>Introducao</h3>
            <p>${guia.introduction}</p>
        </div>
        
        ${guia.historicalContext ? `
        <div class="detail-section">
            <h3>Contexto Historico</h3>
            <div class="context-grid">
                <div class="context-item">
                    <h4>Periodo</h4>
                    <p>${guia.historicalContext.period}</p>
                </div>
                <div class="context-item">
                    <h4>Local</h4>
                    <p>${guia.historicalContext.location}</p>
                </div>
                <div class="context-item">
                    <h4>Contexto Social</h4>
                    <p>${guia.historicalContext.socialContext}</p>
                </div>
                <div class="context-item">
                    <h4>Momento Politico</h4>
                    <p>${guia.historicalContext.politicalMoment || guia.historicalContext.culturalMoment}</p>
                </div>
            </div>
        </div>
        ` : ''}
        
        ${guide.keyLocations ? `
        <div class="detail-section">
            <h3>🗺️ Locais Importantes</h3>
            <div class="locations-grid">
                ${guide.keyLocations.map(location => `
                    <div class="location-card">
                        <h4 class="location-name">${location.name}</h4>
                        <p class="location-description">${location.description}</p>
                        <div class="location-atmosphere">
                            <strong>Atmosfera:</strong> ${location.atmosphere}
                        </div>
                        <div class="location-npcs">
                            <strong>NPCs:</strong> ${location.npcs.join(', ')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${guide.plotHooks ? `
        <div class="detail-section">
            <h3>🎣 Ganchos de Aventura</h3>
            <ul class="lessons-list">
                ${guide.plotHooks.map(hook => `<li>${hook}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        ${guide.encounters ? `
        <div class="detail-section">
            <h3>⚔️ Encontros Sugeridos</h3>
            <div class="encounters-grid">
                ${guide.encounters.map(encounter => `
                    <div class="encounter-card">
                        <h4 class="encounter-title">${encounter.title}</h4>
                        <p class="encounter-description">${encounter.description}</p>
                        <div class="encounter-details">
                            <div class="encounter-detail encounter-challenge">
                                <strong>🎯 Desafio:</strong><br>
                                ${encounter.challenge}
                            </div>
                            <div class="encounter-detail encounter-reward">
                                <strong>🏆 Recompensa:</strong><br>
                                ${encounter.reward}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${guide.culturalLessons ? `
        <div class="detail-section">
            <h3>📚 Lições Culturais</h3>
            <ul class="lessons-list">
                ${guide.culturalLessons.map(lesson => `<li>${lesson}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        ${guide.gameplayTips ? `
        <div class="detail-section">
            <h3>💡 Dicas de Gameplay</h3>
            <ul class="tips-list">
                ${guide.gameplayTips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    `;
}

function criarConteudoBasico(missao) {
    return `
        <div class="detail-section">
            <h3>Sobre a Missao</h3>
            <p>${missao.description}</p>
        </div>
        
        ${missao.objectives ? `
        <div class="detail-section">
            <h3>Objetivos</h3>
            <ul class="lessons-list">
                ${missao.objectives.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        ${missao.themes ? `
        <div class="detail-section">
            <h3>Temas Abordados</h3>
            <div class="mission-tags">
                ${missao.themes.map(theme => `<span class="mission-tag">${theme}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="detail-section">
            <p><em>Esta missao ainda nao possui um guia completo do mestre. As informacoes detalhadas serao adicionadas em breve.</em></p>
        </div>
    `;
}

function configurarModal() {
    const modal = document.getElementById('mission-modal');
    const botaoFechar = modal.querySelector('.close');
    
    botaoFechar.onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

window.mostrarDetalhesMissao = mostrarDetalhesMissao;