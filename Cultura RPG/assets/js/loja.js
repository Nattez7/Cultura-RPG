// Sistema de loja
let currentPC = 15;
let ownedKnowledge = JSON.parse(localStorage.getItem('ownedKnowledge')) || {};

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

// Sistema de notificações
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#228B22' : '#A34A39'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const pcCountElement = document.querySelector('.pc-count');
    pcCountElement.textContent = currentPC;
    
    // Sistema de compra
    const buyButtons = document.querySelectorAll('.buy-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const shopItem = this.closest('.shop-item');
            const itemName = shopItem.querySelector('h4').textContent;
            const price = 1;
            
            if (currentPC >= price) {
                currentPC -= price;
                pcCountElement.textContent = currentPC;
                
                if (ownedKnowledge[itemName]) {
                    if (ownedKnowledge[itemName] < 5) {
                        ownedKnowledge[itemName]++;
                        showNotification(`${itemName} evoluiu para nível ${ownedKnowledge[itemName]}!`);
                    } else {
                        showNotification(`${itemName} já está no nível máximo!`, 'error');
                        currentPC += price;
                        pcCountElement.textContent = currentPC;
                        return;
                    }
                } else {
                    ownedKnowledge[itemName] = 1;
                    showNotification(`${itemName} adquirido com sucesso!`);
                }
                
                // Salva no localStorage
                localStorage.setItem('ownedKnowledge', JSON.stringify(ownedKnowledge));
                localStorage.setItem('currentPC', currentPC);
                
                const currentLevel = ownedKnowledge[itemName];
                if (currentLevel >= 5) {
                    this.textContent = 'Máximo';
                    this.style.background = '#666666';
                    this.disabled = true;
                } else {
                    this.textContent = `Evoluir (${currentLevel}/5)`;
                }
            } else {
                showNotification('Pontos de Conhecimento insuficientes!', 'error');
            }
        });
    });
    
    // Atualiza botões baseado no que já foi comprado
    buyButtons.forEach(button => {
        const shopItem = button.closest('.shop-item');
        const itemName = shopItem.querySelector('h4').textContent;
        
        if (ownedKnowledge[itemName]) {
            const level = ownedKnowledge[itemName];
            if (level >= 5) {
                button.textContent = 'Máximo';
                button.style.background = '#666666';
                button.disabled = true;
            } else {
                button.textContent = `Evoluir (${level}/5)`;
            }
        }
    });
});