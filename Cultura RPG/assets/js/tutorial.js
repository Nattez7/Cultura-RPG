// Sempre mostrar os dois botões como padrão
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.getElementById('cta-buttons');
    
    ctaButtons.innerHTML = `
        <button class="btn-primary" onclick="window.location.href='index.html'">
            <i class="fas fa-play"></i>
            Começar Agora
        </button>
        <button class="btn-secondary" onclick="window.location.href='dashboard.html'">
            <i class="fas fa-home"></i>
            Ir para Dashboard
        </button>
    `;
    
    // Forçar cor verde nos círculos de evolução - múltiplas tentativas
    function forceCircleColors() {
        const activeCircles = document.querySelectorAll('.evolution-level.active');
        activeCircles.forEach(circle => {
            circle.style.setProperty('background-color', '#22c55e', 'important');
            circle.style.setProperty('border-color', '#22c55e', 'important');
            circle.style.setProperty('color', 'white', 'important');
            circle.style.setProperty('background', '#22c55e', 'important');
        });
    }
    
    // Tentar múltiplas vezes
    forceCircleColors();
    setTimeout(forceCircleColors, 100);
    setTimeout(forceCircleColors, 500);
    setTimeout(forceCircleColors, 1000);
    
    // Forçar especificamente o círculo 1
    function forceFirstCircle() {
        const firstCircle = document.querySelector('.evolution-level.active');
        if (firstCircle) {
            firstCircle.style.setProperty('background-color', '#7c3aed', 'important');
            firstCircle.style.setProperty('border-color', '#7c3aed', 'important');
            firstCircle.style.setProperty('color', 'white', 'important');
            firstCircle.style.setProperty('background', '#7c3aed', 'important');
        }
    }
    
    forceFirstCircle();
    setTimeout(forceFirstCircle, 100);
    setTimeout(forceFirstCircle, 500);
    setTimeout(forceFirstCircle, 1000);
    setTimeout(forceFirstCircle, 2000);
});