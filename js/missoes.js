import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let missions = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadMissions();
    setupModal();
});

// Carregar missões do Firestore
async function loadMissions() {
    const missionsList = document.getElementById('missions-list');
    
    // Mostrar loading
    missionsList.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Carregando missões...</p>
        </div>
    `;
    
    try {
        const querySnapshot = await getDocs(collection(db, 'missoes'));
        
        if (querySnapshot.empty) {
            missionsList.innerHTML = `
                <div class="loading">
                    <p>Nenhuma missão encontrada no banco de dados.</p>
                </div>
            `;
            return;
        }
        
        missions = {};
        querySnapshot.forEach((doc) => {
            missions[doc.id] = doc.data();
        });
        
        displayMissions();
        
    } catch (error) {
        console.error('Erro ao carregar missões:', error);
        missionsList.innerHTML = `
            <div class="loading">
                <p>Erro ao carregar missões. Tente recarregar a página.</p>
            </div>
        `;
    }
}

// Exibir missões
function displayMissions() {
    const missionsList = document.getElementById('missions-list');
    
    if (Object.keys(missions).length === 0) {
        missionsList.innerHTML = `
            <div class="loading">
                <p>Nenhuma missão disponível.</p>
            </div>
        `;
        return;
    }
    
    missionsList.innerHTML = Object.keys(missions).map(id => 
        createMissionCard(id, missions[id])
    ).join('');
}

// Criar card de missão
function createMissionCard(id, mission) {
    const difficultyClass = `difficulty-${mission.difficulty}`;
    
    return `
        <div class="mission-card" onclick="showMissionDetails('${id}')">
            <div class="mission-header">
                <div>
                    <h3 class="mission-title">${mission.name}</h3>
                </div>
                <span class="mission-difficulty ${difficultyClass}">${mission.difficulty}</span>
            </div>
            
            <div class="mission-info">
                <div class="info-item">
                    <span>⏱️</span>
                    <span><strong>Duração:</strong> ${mission.duration}</span>
                </div>
                <div class="info-item">
                    <span>📅</span>
                    <span><strong>Período:</strong> ${mission.period || 'Não informado'}</span>
                </div>
            </div>
            
            <div class="mission-description">
                ${mission.description}
            </div>
            

            
            ${mission.themes ? `
            <div class="mission-tags">
                ${mission.themes.map(theme => `<span class="mission-tag">${theme}</span>`).join('')}
            </div>
            ` : ''}
            
            <button class="view-details-btn">
                📖 Ver Guia Completo do Mestre
            </button>
        </div>
    `;
}

// Mostrar detalhes da missão
function showMissionDetails(missionId) {
    const mission = missions[missionId];
    if (!mission) return;
    
    const modalContent = document.getElementById('mission-details');
    
    modalContent.innerHTML = `
        <div class="mission-detail-header">
            <h2 class="mission-detail-title">${mission.name}</h2>
            <p class="mission-detail-subtitle">${mission.description}</p>
            
            <div class="mission-detail-meta">
                <div class="meta-item">
                    <div class="meta-label">Dificuldade</div>
                    <div class="meta-value">${mission.difficulty}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Duração</div>
                    <div class="meta-value">${mission.duration}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Período</div>
                    <div class="meta-value">${mission.period || 'Não informado'}</div>
                </div>
            </div>
        </div>
        
        <div class="mission-detail-content">
            ${mission.masterGuide ? createMasterGuideContent(mission.masterGuide) : createBasicContent(mission)}
        </div>
    `;
    
    document.getElementById('mission-modal').style.display = 'block';
}

// Criar conteúdo do guia do mestre
function createMasterGuideContent(guide) {
    return `
        <div class="detail-section">
            <h3>📖 Introdução</h3>
            <p>${guide.introduction}</p>
        </div>
        
        ${guide.historicalContext ? `
        <div class="detail-section">
            <h3>🏛️ Contexto Histórico</h3>
            <div class="context-grid">
                <div class="context-item">
                    <h4>📅 Período</h4>
                    <p>${guide.historicalContext.period}</p>
                </div>
                <div class="context-item">
                    <h4>📍 Local</h4>
                    <p>${guide.historicalContext.location}</p>
                </div>
                <div class="context-item">
                    <h4>🏛️ Contexto Social</h4>
                    <p>${guide.historicalContext.socialContext}</p>
                </div>
                <div class="context-item">
                    <h4>⚖️ Momento Político</h4>
                    <p>${guide.historicalContext.politicalMoment || guide.historicalContext.culturalMoment}</p>
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

// Criar conteúdo básico (para missões sem guia completo)
function createBasicContent(mission) {
    return `
        <div class="detail-section">
            <h3>📖 Sobre a Missão</h3>
            <p>${mission.description}</p>
        </div>
        
        ${mission.objectives ? `
        <div class="detail-section">
            <h3>🎯 Objetivos</h3>
            <ul class="lessons-list">
                ${mission.objectives.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        

        
        ${mission.themes ? `
        <div class="detail-section">
            <h3>🏷️ Temas Abordados</h3>
            <div class="mission-tags">
                ${mission.themes.map(theme => `<span class="mission-tag">${theme}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="detail-section">
            <p><em>Esta missão ainda não possui um guia completo do mestre. As informações detalhadas serão adicionadas em breve.</em></p>
        </div>
    `;
}

// Configurar modal
function setupModal() {
    const modal = document.getElementById('mission-modal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Exportar funções globais
window.showMissionDetails = showMissionDetails;