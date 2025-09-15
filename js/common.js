// Navegação comum
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeModals();
});

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Fechar menu mobile ao clicar em link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
}

function initializeModals() {
    // Fechar modal ao clicar no X ou fora do modal
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('close') || event.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Utilitários
function formatDate(dateString) {
    return new Date(dateString).toLocaleString('pt-BR');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}