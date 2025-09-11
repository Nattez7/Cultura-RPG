// Sistema de Tema Global
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('dark-mode', 'true');
    } else {
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('dark-mode', 'false');
    }
}

// Carregar tema salvo
document.addEventListener('DOMContentLoaded', function() {
    const darkMode = localStorage.getItem('dark-mode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-mode');
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
});