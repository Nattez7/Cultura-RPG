// Detecta de onde o usuário veio e mostra botões apropriados
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.getElementById('cta-buttons');
    const referrer = document.referrer;
    
    // Se veio do dashboard (já logado)
    if (referrer.includes('dashboard.html')) {
        ctaButtons.innerHTML = `
            <button class="btn-primary" onclick="window.location.href='dashboard.html'">
                <i class="fas fa-arrow-left"></i>
                Voltar ao Dashboard
            </button>
        `;
    } 
    // Se veio do index ou acesso direto (não logado)
    else {
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
    }
});