// Sistema Ultra-Simplificado de Quiz
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Perguntas diretas no código
const questions = {
    musica: [
        { q: 'Quem é considerado o "Rei do Samba"?', o: ['Cartola', 'Noel Rosa', 'Pixinguinha', 'Bezerra'], c: 2 },
        { q: 'Qual música marcou o início da Bossa Nova?', o: ['Garota de Ipanema', 'Chega de Saudade', 'Corcovado', 'Desafinado'], c: 1 },
        { q: 'Quem é o "Rei do Baião"?', o: ['Jackson do Pandeiro', 'Luiz Gonzaga', 'Dominguinhos', 'Sivuca'], c: 1 },
        { q: 'Qual instrumento é fundamental no samba?', o: ['Violão', 'Cavaquinho', 'Pandeiro', 'Flauta'], c: 2 },
        { q: 'Em que década surgiu a Bossa Nova?', o: ['1940', '1950', '1960', '1970'], c: 1 }
    ],
    literatura: [
        { q: 'Em que ano nasceu Machado de Assis?', o: ['1835', '1839', '1842', '1845'], c: 1 },
        { q: 'Qual romance tem narrador defunto?', o: ['Dom Casmurro', 'Memórias Póstumas de Brás Cubas', 'Quincas Borba', 'Esaú e Jacó'], c: 1 },
        { q: 'Quantas páginas tem um folheto de cordel?', o: ['6, 12 ou 24', '8, 16 ou 32', '10, 20 ou 40', '4, 8 ou 16'], c: 1 },
        { q: 'Qual arte ilustra capas de cordel?', o: ['Pintura', 'Fotografia', 'Xilogravura', 'Desenho'], c: 2 },
        { q: 'Quem é o "pai do cordel"?', o: ['Patativa do Assaré', 'Leandro Gomes de Barros', 'João Martins', 'Cuica de Santo Amaro'], c: 1 }
    ],
    folclore: [
        { q: 'Quantas pernas tem o Saci?', o: ['Duas', 'Uma', 'Três', 'Nenhuma'], c: 1 },
        { q: 'Qual cor do gorro do Saci?', o: ['Azul', 'Verde', 'Vermelho', 'Amarelo'], c: 2 },
        { q: 'Principal característica do Curupira?', o: ['Cabelo verde', 'Pés virados', 'Olhos vermelhos', 'Orelhas pontudas'], c: 1 },
        { q: 'Do que o Saci tem medo?', o: ['Fogo', 'Água', 'Vento', 'Terra'], c: 1 },
        { q: 'Função do Curupira?', o: ['Assustar crianças', 'Proteger natureza', 'Fazer travessuras', 'Ensinar caça'], c: 1 }
    ],
    culinaria: [
        { q: 'Qual é o prato nacional do Brasil?', o: ['Feijoada', 'Churrasco', 'Moqueca', 'Vatapá'], c: 0 },
        { q: 'De qual região é típico o açaí?', o: ['Nordeste', 'Sul', 'Norte/Amazônia', 'Sudeste'], c: 2 },
        { q: 'Brigadeiro foi criado em homenagem a quem?', o: ['Um general', 'Um brigadeiro político', 'Um chef', 'Um escritor'], c: 1 },
        { q: 'Ingrediente principal do acarajé?', o: ['Milho', 'Feijão-fradinho', 'Mandioca', 'Arroz'], c: 1 },
        { q: 'Feijoada é servida tradicionalmente quando?', o: ['Segunda e sexta', 'Quarta e sábado', 'Domingo e terça', 'Quinta e domingo'], c: 1 }
    ],
    'artes-marciais': [
        { q: 'Qual arte marcial combina luta, dança e música?', o: ['Jiu-Jitsu', 'Capoeira', 'Vale-Tudo', 'Luta Livre'], c: 1 },
        { q: 'Quem criou o Jiu-Jitsu Brasileiro?', o: ['Família Gracie', 'Hélio Gracie', 'Carlos Gracie', 'Todas anteriores'], c: 3 },
        { q: 'Instrumento fundamental na capoeira?', o: ['Violão', 'Berimbau', 'Pandeiro', 'Atabaque'], c: 1 },
        { q: 'Capoeira teve origem em qual período?', o: ['Brasil Império', 'Brasil Colonial', 'República', 'Era Vargas'], c: 1 },
        { q: 'Huka-Huka é praticada por qual povo?', o: ['Guarani', 'Xingu', 'Yanomami', 'Kayapó'], c: 1 }
    ],
    festas: [
        { q: 'Onde acontece o maior Carnaval do mundo?', o: ['Salvador', 'Rio de Janeiro', 'Recife', 'São Paulo'], c: 1 },
        { q: 'Festas Juninas celebram quais santos?', o: ['João, Pedro e Paulo', 'Antônio, João e Pedro', 'José, Maria e João', 'Pedro, Paulo e Tiago'], c: 1 },
        { q: 'Festival de Parintins acontece em qual estado?', o: ['Pará', 'Amazonas', 'Acre', 'Rondônia'], c: 1 },
        { q: 'Bumba Meu Boi é típico de qual região?', o: ['Sul', 'Sudeste', 'Nordeste', 'Centro-Oeste'], c: 2 },
        { q: 'Ritmo do Carnaval de Salvador?', o: ['Samba', 'Axé', 'Forró', 'Frevo'], c: 1 }
    ]
};

let currentQuiz = null;
let currentQ = 0;
let score = 0;
let quizQuestions = [];

document.addEventListener('DOMContentLoaded', function() {
    updateAllStatus();
    
    // Atualizar status a cada 5 segundos
    setInterval(updateAllStatus, 5000);
    
    document.querySelectorAll('.quest-btn').forEach(btn => {
        btn.onclick = function() {
            const category = this.closest('.quest-card').dataset.category;
            if (this.disabled) return;
            startQuiz(category);
        };
    });
});

function startQuiz(category) {
    const today = new Date().toDateString();
    const startedToday = localStorage.getItem('quest_started');
    const startedCategory = localStorage.getItem('quest_started_category');
    
    // Se já iniciou uma missão hoje
    if (startedToday === today) {
        // Se é a mesma categoria, pode continuar
        if (startedCategory === category) {
            // Continuar missão - carregar progresso salvo
            currentQuiz = category;
            currentQ = parseInt(localStorage.getItem('quest_current_question') || '0');
            score = parseInt(localStorage.getItem('quest_current_score') || '0');
            
            const seed = hashCode(today + category);
            quizQuestions = shuffleWithSeed([...questions[category]], seed).slice(0, 5);
            
            // Se já terminou todas as perguntas, finalizar
            if (currentQ >= quizQuestions.length) {
                finishQuiz();
            } else {
                showQuestion();
            }
            return;
        } else {
            // Categoria diferente - mostrar aviso
            showWarningModal(`Você já iniciou a missão de ${getCategoryName(startedCategory)}! Complete-a ou aguarde até amanhã.`);
            return;
        }
    }
    
    // Marcar como iniciado
    localStorage.setItem('quest_started', today);
    localStorage.setItem('quest_started_category', category);
    localStorage.setItem('quest_current_question', '0');
    localStorage.setItem('quest_current_score', '0');
    
    // Atualizar status imediatamente
    updateAllStatus();
    
    currentQuiz = category;
    currentQ = 0;
    score = 0;
    
    const seed = hashCode(today + category);
    quizQuestions = shuffleWithSeed([...questions[category]], seed).slice(0, 5);
    showQuestion();
}

function getCategoryName(category) {
    const names = {
        'musica': 'Música Brasileira',
        'literatura': 'Literatura Brasileira',
        'folclore': 'Folclore Brasileiro',
        'culinaria': 'Culinária Brasileira',
        'artes-marciais': 'Artes Marciais Brasileiras',
        'festas': 'Festas Populares Brasileiras'
    };
    return names[category] || category;
}

function showWarningModal(message) {
    const modal = document.createElement('div');
    modal.className = 'quiz-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 2000; opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="warning-content" style="
            background: var(--bg-card); backdrop-filter: blur(20px);
            border: 1px solid var(--border); border-radius: 16px;
            padding: 2rem; text-align: center; max-width: 400px; width: 90%;
            transform: translateY(30px); transition: transform 0.3s ease;
        ">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1rem;"></i>
            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.5rem;">Missão em Andamento</h3>
            <p style="color: var(--text); margin-bottom: 2rem; line-height: 1.5;">${message}</p>
            <button onclick="closeWarningModal()" style="
                background: var(--gradient); border: none; color: var(--text);
                padding: 1rem 2rem; border-radius: 12px; cursor: pointer;
                font-weight: bold; transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'"
               onmouseout="this.style.transform='translateY(0)'">Entendi</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentWarningModal = modal;
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.warning-content').style.transform = 'translateY(0)';
    }, 10);
}

function closeWarningModal() {
    if (window.currentWarningModal) {
        window.currentWarningModal.style.opacity = '0';
        const content = window.currentWarningModal.querySelector('.warning-content');
        if (content) content.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            if (window.currentWarningModal) {
                window.currentWarningModal.remove();
                window.currentWarningModal = null;
            }
        }, 300);
    }
}

// Função para gerar hash da string (seed)
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Embaralhar array com seed determinístico
function shuffleWithSeed(array, seed) {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    
    // Usar seed para gerar números "aleatórios" determinísticos
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
    
    while (currentIndex !== 0) {
        const randomIndex = Math.floor(random() * currentIndex);
        currentIndex--;
        [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }
    
    return shuffled;
}

function showQuestion() {
    const q = quizQuestions[currentQ];
    const names = {
        musica: 'Música Brasileira',
        literatura: 'Literatura Brasileira',
        folclore: 'Folclore Brasileiro',
        culinaria: 'Culinária Brasileira',
        'artes-marciais': 'Artes Marciais Brasileiras',
        festas: 'Festas Populares Brasileiras'
    };
    
    const modal = document.createElement('div');
    modal.className = 'quiz-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 2000; opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="quiz-content" style="
            background: var(--bg-card); backdrop-filter: blur(20px);
            border: 1px solid var(--border); border-radius: 16px;
            padding: 2rem; max-width: 600px; width: 90%;
            transform: translateY(30px); transition: transform 0.3s ease;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                <h3 style="color: var(--accent); margin: 0; font-size: 1.5rem;">${names[currentQuiz]}</h3>
                <div style="text-align: center; flex: 1; margin: 0 2rem;">
                    <span style="color: var(--text); opacity: 0.8; font-size: 0.9rem;">Pergunta ${currentQ + 1}/${quizQuestions.length}</span>
                    <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 0.5rem; overflow: hidden;">
                        <div style="height: 100%; background: var(--gradient); width: ${((currentQ) / quizQuestions.length) * 100}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>
                <button onclick="closeModal()" style="
                    background: none; border: none; color: var(--text); font-size: 1.2rem;
                    cursor: pointer; padding: 0.5rem; border-radius: 50%;
                    transition: all 0.3s ease; width: 40px; height: 40px;
                " onmouseover="this.style.background='var(--accent)'; this.style.color='var(--primary)'" 
                   onmouseout="this.style.background='none'; this.style.color='var(--text)'">×</button>
            </div>
            <h4 style="color: var(--text); margin-bottom: 2rem; text-align: center; font-size: 1.3rem; line-height: 1.4;">${q.q}</h4>
            <div style="display: grid; gap: 1rem;">
                ${q.o.map((opt, i) => `
                    <button onclick="selectAnswer(${i})" class="quiz-option" style="
                        background: rgba(255,255,255,0.05); border: 2px solid var(--border);
                        color: var(--text); padding: 1rem 1.5rem; border-radius: 12px;
                        cursor: pointer; transition: all 0.3s ease; font-size: 1rem;
                        text-align: left;
                    " onmouseover="this.style.background='rgba(235,214,119,0.1)'; this.style.borderColor='var(--accent)'; this.style.transform='translateX(5px)'"
                       onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='var(--border)'; this.style.transform='translateX(0)'">${opt}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentModal = modal;
    
    // Animação de entrada
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.quiz-content').style.transform = 'translateY(0)';
    }, 10);
}

function selectAnswer(selected) {
    const q = quizQuestions[currentQ];
    const options = window.currentModal.querySelectorAll('.quiz-option');
    
    options.forEach((btn, i) => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.7';
        btn.onmouseover = null;
        btn.onmouseout = null;
        
        if (i === q.c) {
            btn.style.background = 'rgba(34, 197, 94, 0.2)';
            btn.style.borderColor = '#22c55e';
            btn.style.color = '#22c55e';
            btn.style.opacity = '1';
        } else if (i === selected && selected !== q.c) {
            btn.style.background = 'rgba(239, 68, 68, 0.2)';
            btn.style.borderColor = '#ef4444';
            btn.style.color = '#ef4444';
            btn.style.opacity = '1';
        }
    });
    
    if (selected === q.c) score++;
    
    // Salvar progresso
    currentQ++;
    localStorage.setItem('quest_current_question', currentQ.toString());
    localStorage.setItem('quest_current_score', score.toString());
    
    setTimeout(() => {
        if (currentQ < quizQuestions.length) {
            closeModal();
            setTimeout(showQuestion, 300);
        } else {
            closeModal();
            setTimeout(finishQuiz, 300);
        }
    }, 2000);
}

function finishQuiz() {
    const perfect = score === quizQuestions.length;
    
    // Limpar flags de missão iniciada e progresso
    localStorage.removeItem('quest_started');
    localStorage.removeItem('quest_started_category');
    localStorage.removeItem('quest_current_question');
    localStorage.removeItem('quest_current_score');
    
    // Marcar TODAS as missões como completadas simultaneamente
    const now = Date.now();
    ['musica', 'literatura', 'folclore', 'culinaria', 'artes-marciais', 'festas'].forEach(cat => {
        localStorage.setItem(`quest_${cat}`, now);
    });
    
    // Dar PC se perfeito
    if (perfect) {
        const pcEl = document.querySelector('.pc-count');
        if (pcEl) pcEl.textContent = parseInt(pcEl.textContent) + 1;
    }
    
    // Forçar atualização imediata
    setTimeout(updateAllStatus, 100);
    
    const modal = document.createElement('div');
    modal.className = 'quiz-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 2000; opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="quiz-complete" style="
            background: var(--bg-card); backdrop-filter: blur(20px);
            border: 1px solid var(--border); border-radius: 16px;
            padding: 2rem; text-align: center; max-width: 400px; width: 90%;
            transform: translateY(30px); transition: transform 0.3s ease;
        ">
            <i class="fas fa-trophy" style="font-size: 4rem; color: var(--accent); margin-bottom: 1rem;"></i>
            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 2rem;">${perfect ? 'Perfeito!' : 'Missão Concluída!'}</h3>
            <p style="color: var(--text); margin-bottom: 2rem; font-size: 1.1rem; opacity: 0.9;">Você acertou ${score} de ${quizQuestions.length} perguntas</p>
            ${perfect ? `
                <div style="
                    background: rgba(235, 214, 119, 0.1); border: 1px solid var(--accent);
                    border-radius: 12px; padding: 1rem; margin-bottom: 1rem;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    color: var(--accent); font-weight: bold;
                ">
                    <i class="fas fa-gem" style="font-size: 1.5rem;"></i>
                    <span>+1 Ponto de Conhecimento!</span>
                </div>
                <div style="
                    background: rgba(34, 197, 94, 0.1); border: 1px solid #22c55e;
                    border-radius: 12px; padding: 1rem; margin-bottom: 2rem;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    color: #22c55e; font-weight: bold;
                ">
                    <i class="fas fa-star" style="font-size: 1.5rem;"></i>
                    <span>+${xpGained} XP Ganhos!</span>
                </div>
            ` : `
                <p style="color: var(--text); margin-bottom: 1rem;">Você precisa acertar todas para ganhar PC</p>
                <div style="
                    background: rgba(34, 197, 94, 0.1); border: 1px solid #22c55e;
                    border-radius: 12px; padding: 1rem; margin-bottom: 2rem;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    color: #22c55e; font-weight: bold;
                ">
                    <i class="fas fa-star" style="font-size: 1.5rem;"></i>
                    <span>+${xpGained} XP Ganhos!</span>
                </div>
            `}
            <p style="color: var(--text); opacity: 0.7; margin-bottom: 2rem;">Todas as missões disponíveis novamente em 24 horas</p>
            <button onclick="closeModal()" style="
                background: var(--gradient); border: none; color: var(--text);
                padding: 1rem 2rem; border-radius: 12px; cursor: pointer;
                font-weight: bold; font-size: 1.1rem; transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.3)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">Continuar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentModal = modal;
    
    // Animação de entrada
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.quiz-complete').style.transform = 'translateY(0)';
    }, 10);
}

function closeModal() {
    if (window.currentModal) {
        // Animação de saída
        window.currentModal.style.opacity = '0';
        const content = window.currentModal.querySelector('.quiz-content, .quiz-complete');
        if (content) content.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            if (window.currentModal) {
                window.currentModal.remove();
                window.currentModal = null;
            }
        }, 300);
    }
}

function updateAllStatus() {
    // Verificar se qualquer missão foi completada (usar a primeira como referência)
    const lastCompleted = localStorage.getItem('quest_musica');
    const available = !lastCompleted || (Date.now() - parseInt(lastCompleted)) >= 24 * 60 * 60 * 1000;
    
    // Verificar se há missão em andamento
    const today = new Date().toDateString();
    const startedToday = localStorage.getItem('quest_started');
    const startedCategory = localStorage.getItem('quest_started_category');
    const hasActiveQuest = startedToday === today;
    
    ['musica', 'literatura', 'folclore', 'culinaria', 'artes-marciais', 'festas'].forEach(cat => {
        const card = document.querySelector(`[data-category="${cat}"]`);
        if (!card) return;
        
        const status = card.querySelector('.status-text');
        const timer = card.querySelector('.timer');
        const btn = card.querySelector('.quest-btn');
        
        if (available && !hasActiveQuest) {
            status.textContent = 'Disponível';
            status.style.color = '#22c55e';
            timer.style.display = 'none';
            btn.disabled = false;
            btn.textContent = 'Iniciar Missão';
        } else if (hasActiveQuest && cat === startedCategory) {
            status.textContent = 'Em Andamento';
            status.style.color = '#EBD677';
            timer.style.display = 'block';
            const currentQuestion = parseInt(localStorage.getItem('quest_current_question') || '0');
            const currentScore = parseInt(localStorage.getItem('quest_current_score') || '0');
            timer.textContent = `Progresso: ${currentQuestion}/5 perguntas - ${currentScore} acertos`;
            btn.disabled = false;
            btn.textContent = 'Continuar Missão';
        } else if (hasActiveQuest) {
            status.textContent = 'Bloqueada';
            status.style.color = '#666';
            timer.style.display = 'block';
            timer.textContent = 'Outra missão em andamento';
            btn.disabled = true;
            btn.textContent = 'Bloqueada';
        } else {
            status.textContent = 'Concluída';
            status.style.color = '#666';
            timer.style.display = 'block';
            btn.disabled = true;
            btn.textContent = 'Aguarde';
            
            const timeLeft = 24 * 60 * 60 * 1000 - (Date.now() - parseInt(lastCompleted));
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            timer.textContent = `${hours}h ${minutes}m restantes`;
        }
    });
}

function resetAllQuests() {
    ['musica', 'literatura', 'folclore', 'culinaria', 'artes-marciais', 'festas'].forEach(cat => {
        localStorage.removeItem(`quest_${cat}`);
    });
    localStorage.removeItem('quest_started');
    localStorage.removeItem('quest_started_category');
    localStorage.removeItem('quest_current_question');
    localStorage.removeItem('quest_current_score');
    updateAllStatus();
    alert('Todas as missões foram resetadas!');
}