document.addEventListener('DOMContentLoaded', function() {
    inicializarNavegacao();
    inicializarModais();
});

function inicializarNavegacao() {
    const botaoHamburguer = document.querySelector('.hamburger');
    const menuNav = document.querySelector('.nav-menu');
    
    if (botaoHamburguer && menuNav) {
        botaoHamburguer.addEventListener('click', () => {
            botaoHamburguer.classList.toggle('active');
            menuNav.classList.toggle('active');
        });
    }
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (menuNav) menuNav.classList.remove('active');
            if (botaoHamburguer) botaoHamburguer.classList.remove('active');
        });
    });
}

function inicializarModais() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('close') || event.target.classList.contains('modal')) {
            fecharModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            fecharModal();
        }
    });
}

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

function formatarData(dateString) {
    return new Date(dateString).toLocaleString('pt-BR');
}

function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Exportar funcoes globalmente
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.formatarData = formatarData;
window.voltarAoTopo = voltarAoTopo;