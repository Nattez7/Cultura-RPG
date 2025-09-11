// Toggle modo escuro
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
let currentTopic = null;
let currentQuestion = 0;
let score = 0;
let usedQuestions = [];
let questionsPool = [];

// Inicializar quando página carregar
document.addEventListener('DOMContentLoaded', function() {
    const questButtons = document.querySelectorAll('.quest-btn');
    
    questButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.quest-card');
            const category = card.dataset.category;
            const topic = card.dataset.topic;
            startQuiz(category, topic);
        });
    });
});

function startQuiz(category, topic) {
    currentCategory = category;
    currentTopic = topic;
    currentQuestion = 0;
    score = 0;
    
    // Selecionar 5 perguntas aleatórias do tópico
    const allQuestions = quizDatabase[category][topic];
    questionsPool = getRandomQuestions(allQuestions, 5);
    
    showQuestion();
}

function getRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function showQuestion() {
    const question = questionsPool[currentQuestion];
    const topicName = currentTopic.charAt(0).toUpperCase() + currentTopic.slice(1);
    
    const modal = document.createElement('div');
    modal.className = 'quiz-modal';
    modal.innerHTML = `
        <div class="quiz-modal-content">
            <div class="quiz-header">
                <h3>${topicName}</h3>
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
    const percentage = (score / questionsPool.length) * 100;
    
    // Atualizar progresso visual
    const card = document.querySelector(`[data-category="${currentCategory}"][data-topic="${currentTopic}"]`);
    const progressFill = card.querySelector('.progress-fill');
    const progressText = card.querySelector('.quest-progress span');
    const btn = card.querySelector('.quest-btn');
    
    progressFill.style.width = percentage + '%';
    progressText.textContent = `${score}/${questionsPool.length} completo`;
    
    if (score === questionsPool.length) {
        btn.textContent = 'Concluído!';
        btn.style.background = '#22c55e';
        btn.disabled = true;
    } else {
        btn.textContent = 'Tentar Novamente';
    }
    
    // Atualizar estatísticas
    const xpElement = document.querySelectorAll('.stat-value')[1];
    const missionsElement = document.querySelectorAll('.stat-value')[2];
    
    xpElement.textContent = parseInt(xpElement.textContent) + (score * 10);
    missionsElement.textContent = parseInt(missionsElement.textContent) + 1;
    
    // Mostrar resultado
    const modal = document.createElement('div');
    modal.className = 'quiz-modal';
    modal.innerHTML = `
        <div class="quiz-modal-content">
            <div class="quiz-complete">
                <h3>🏆 Missão Concluída!</h3>
                <p>Você acertou ${score} de ${questionsPool.length} perguntas</p>
                <p>+${score * 10} XP ganhos!</p>
                <button class="continue-btn" onclick="closeQuiz()">Continuar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeQuiz() {
    const modals = document.querySelectorAll('.quiz-modal');
    modals.forEach(modal => modal.remove());
}