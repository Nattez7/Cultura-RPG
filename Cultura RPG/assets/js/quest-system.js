// Sistema de Missões Diárias Simplificado
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

let currentCategory = null;
let currentQuestion = 0;
let score = 0;
let questionsPool = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeQuests();
    
    const questButtons = document.querySelectorAll('.quest-btn');
    questButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.quest-card');
            const category = card.dataset.category;
            
            if (btn.disabled) return;
            
            startQuiz(category);
        });
    });
});

function initializeQuests() {
    const categories = ['musica', 'literatura', 'folclore', 'culinaria', 'artes-marciais', 'festas'];
    
    categories.forEach(category => {
        updateQuestStatus(category);
    });
}

function isQuestAvailable(category) {
    const lastCompleted = localStorage.getItem(`quest_${category}`);
    if (!lastCompleted) return true;
    
    const now = new Date().getTime();
    const timeDiff = now - parseInt(lastCompleted);
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff >= 24;
}

function startQuiz(category) {
    currentCategory = category;
    currentQuestion = 0;
    score = 0;
    
    const allQuestions = quizDatabase[category];
    if (!allQuestions || allQuestions.length === 0) {
        alert('Perguntas não encontradas para esta categoria');
        return;
    }
    
    questionsPool = getRandomQuestions(allQuestions, 5);
    showQuestion();
}

function getRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
}

function showQuestion() {
    const question = questionsPool[currentQuestion];
    const categoryNames = {
        'musica': 'Música Brasileira',
        'literatura': 'Literatura Brasileira', 
        'folclore': 'Folclore Brasileiro',
        'culinaria': 'Culinária Brasileira',
        'artes-marciais': 'Artes Marciais Brasileiras',
        'festas': 'Festas Populares Brasileiras'
    };
    
    const modal = document.createElement('div');
    modal.className = 'quiz-modal';
    modal.innerHTML = `
        <div class="quiz-modal-content">
            <div class="quiz-header">
                <h3>${categoryNames[currentCategory]}</h3>
                <span>Pergunta ${currentQuestion + 1}/${questionsPool.length}</span>
                <button class="close-quiz" onclick="closeQuiz()">×</button>
            </div>
            <div class="quiz-content">
                <h4>${question.question}</h4>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" onclick="selectAnswer(${index})">${option}</button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function selectAnswer(selectedIndex) {
    const question = questionsPool[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach(option => option.disabled = true);
    
    if (selectedIndex === question.correct) {
        options[selectedIndex].style.background = 'rgba(34, 197, 94, 0.3)';
        options[selectedIndex].style.borderColor = '#22c55e';
        score++;
    } else {
        options[selectedIndex].style.background = 'rgba(239, 68, 68, 0.3)';
        options[selectedIndex].style.borderColor = '#ef4444';
        options[question.correct].style.background = 'rgba(34, 197, 94, 0.3)';
        options[question.correct].style.borderColor = '#22c55e';
    }
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questionsPool.length) {
            closeQuiz();
            showQuestion();
        } else {
            finishQuiz();
        }
    }, 2000);
}

function finishQuiz() {
    const perfectScore = score === questionsPool.length;
    
    // Sempre marcar como completado (independente do resultado)
    const now = new Date().getTime();
    localStorage.setItem(`quest_${currentCategory}`, now.toString());
    
    // Dar PC apenas se pontuação perfeita
    if (perfectScore) {
        const pcElement = document.querySelector('.pc-count');
        if (pcElement) {
            const currentPC = parseInt(pcElement.textContent) || 0;
            pcElement.textContent = currentPC + 1;
        }
    }
    
    // Atualizar status
    updateQuestStatus(currentCategory);
    
    const modal = document.createElement('div');
    modal.className = 'quiz-modal';
    modal.innerHTML = `
        <div class="quiz-modal-content">
            <div class="quiz-complete">
                <h3>${perfectScore ? '🏆 Perfeito!' : '📚 Missão Concluída'}</h3>
                <p>Você acertou ${score} de ${questionsPool.length} perguntas</p>
                ${perfectScore ? '<p style="color: #22c55e;">+1 Ponto de Conhecimento!</p>' : '<p>Você precisa acertar todas para ganhar PC</p>'}
                <p style="opacity: 0.7;">Próxima missão disponível em 24 horas</p>
                <button class="continue-btn" onclick="closeQuiz()">Continuar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function updateQuestStatus(category) {
    const card = document.querySelector(`[data-category="${category}"]`);
    if (!card) return;
    
    const statusText = card.querySelector('.status-text');
    const timer = card.querySelector('.timer');
    const btn = card.querySelector('.quest-btn');
    
    if (isQuestAvailable(category)) {
        statusText.textContent = 'Disponível';
        statusText.style.color = '#22c55e';
        timer.style.display = 'none';
        btn.disabled = false;
        btn.textContent = 'Iniciar Missão';
        btn.style.background = '';
        btn.style.opacity = '';
    } else {
        statusText.textContent = 'Concluída';
        statusText.style.color = '#666';
        timer.style.display = 'block';
        btn.disabled = true;
        btn.textContent = 'Aguarde';
        btn.style.background = '#666';
        btn.style.opacity = '0.5';
        
        updateTimer(category);
    }
}

function updateTimer(category) {
    const card = document.querySelector(`[data-category="${category}"]`);
    const timer = card.querySelector('.timer');
    
    const lastCompleted = localStorage.getItem(`quest_${category}`);
    if (!lastCompleted) return;
    
    const updateTime = () => {
        const now = new Date().getTime();
        const timeDiff = now - parseInt(lastCompleted);
        const timeLeft = (24 * 60 * 60 * 1000) - timeDiff;
        
        if (timeLeft <= 0) {
            updateQuestStatus(category);
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        timer.textContent = `${hours}h ${minutes}m restantes`;
    };
    
    updateTime();
    setInterval(updateTime, 60000);
}

function closeQuiz() {
    const modals = document.querySelectorAll('.quiz-modal');
    modals.forEach(modal => modal.remove());
}

// Função para resetar todas as missões (para teste)
function resetAllQuests() {
    const categories = ['musica', 'literatura', 'folclore', 'culinaria', 'artes-marciais', 'festas'];
    categories.forEach(category => {
        localStorage.removeItem(`quest_${category}`);
    });
    location.reload();
}