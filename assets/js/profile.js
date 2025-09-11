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

// Editar campos
function toggleEdit(fieldId) {
    const field = document.getElementById(fieldId);
    const isReadonly = field.hasAttribute('readonly') || field.hasAttribute('disabled');
    
    if (isReadonly) {
        // Habilitar edição
        field.removeAttribute('readonly');
        field.removeAttribute('disabled');
        field.focus();
        field.style.background = 'rgba(255, 215, 0, 0.1)';
        field.style.borderColor = 'var(--accent)';
    } else {
        // Salvar e desabilitar edição
        field.setAttribute('readonly', true);
        if (field.tagName === 'SELECT') {
            field.setAttribute('disabled', true);
        }
        field.style.background = 'rgba(255, 255, 255, 0.1)';
        field.style.borderColor = 'var(--border)';
        
        // Simular salvamento
        showNotification('Informações atualizadas com sucesso!', 'success');
    }
}

// Alterar senha
function changePassword() {
    const newPassword = prompt('Digite sua nova senha:');
    if (newPassword && newPassword.length >= 6) {
        showNotification('Senha alterada com sucesso!', 'success');
    } else if (newPassword) {
        showNotification('A senha deve ter pelo menos 6 caracteres!', 'error');
    }
}

// Upload de avatar
document.addEventListener('DOMContentLoaded', function() {
    const avatarInput = document.getElementById('avatar-input');
    const avatarImg = document.getElementById('avatar-img');
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    
    changeAvatarBtn.addEventListener('click', () => {
        avatarInput.click();
    });
    
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarImg.src = e.target.result;
                showNotification('Avatar atualizado com sucesso!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
});

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adiciona estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    // Adiciona ao DOM
    document.body.appendChild(notification);
    
    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Adiciona animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        margin-left: 0.5rem;
    }
    
    .notification button:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);