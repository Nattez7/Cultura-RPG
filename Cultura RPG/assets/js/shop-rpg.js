// Sistema de Loja integrado com RPG
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar sistema RPG carregar
    setTimeout(() => {
        if (window.culturaRPG) {
            window.culturaRPG.updateDisplay();
            initializeShop();
        }
    }, 100);
});

function initializeShop() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    
    buyButtons.forEach(button => {
        const shopItem = button.closest('.shop-item');
        const itemName = shopItem.querySelector('h4').textContent.toLowerCase();
        
        // Verificar se já foi comprado e atualizar botão
        if (window.culturaRPG) {
            const level = window.culturaRPG.getKnowledgeLevel(itemName);
            if (level > 0) {
                button.textContent = `Nível ${level}${level < 5 ? ' - Melhorar' : ' - Máximo'}`;
                if (level >= 5) {
                    button.style.background = '#6b7280';
                    button.disabled = true;
                }
            }
        }
        
        button.addEventListener('click', function() {
            const price = 1;
            
            if (window.culturaRPG && window.culturaRPG.buyKnowledge(itemName, price)) {
                const newLevel = window.culturaRPG.getKnowledgeLevel(itemName);
                
                // Mostrar notificação
                showPurchaseNotification(itemName, newLevel);
                
                // Atualizar botão
                this.textContent = `Nível ${newLevel}${newLevel < 5 ? ' - Melhorar' : ' - Máximo'}`;
                if (newLevel >= 5) {
                    this.style.background = '#6b7280';
                    this.disabled = true;
                }
                
            } else {
                showInsufficientFundsModal();
            }
        });
    });
}

function showPurchaseNotification(itemName, level) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 2000;
        background: var(--bg-card); backdrop-filter: blur(20px);
        border: 1px solid var(--accent); border-radius: 12px;
        padding: 1rem; max-width: 300px; opacity: 0;
        transform: translateX(100px); transition: all 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <i class="fas fa-check-circle" style="color: #22c55e; font-size: 1.2rem;"></i>
            <span style="color: var(--accent); font-weight: bold;">Conhecimento ${level === 1 ? 'Adquirido' : 'Melhorado'}!</span>
        </div>
        <p style="color: var(--text); margin: 0; font-size: 0.9rem; text-transform: capitalize;">${itemName}</p>
        <p style="color: #22c55e; margin: 0.5rem 0 0; font-size: 0.8rem;">Nível ${level} - +${level}d6 de bônus!</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showInsufficientFundsModal() {
    const modal = document.createElement('div');
    modal.className = 'rpg-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 3000; opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--bg-card); backdrop-filter: blur(20px);
            border: 1px solid var(--border); border-radius: 16px;
            padding: 2rem; text-align: center; max-width: 400px; width: 90%;
            transform: translateY(30px); transition: transform 0.3s ease;
        ">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1rem;"></i>
            <h3 style="color: var(--accent); margin-bottom: 1rem;">Pontos Insuficientes</h3>
            <p style="color: var(--text); margin-bottom: 2rem; line-height: 1.5;">
                Você precisa de mais Pontos de Conhecimento! Complete missões diárias para ganhar PC.
            </p>
            <button onclick="this.closest('.rpg-modal').remove()" style="
                background: var(--gradient); border: none; color: var(--text);
                padding: 1rem 2rem; border-radius: 12px; cursor: pointer;
                font-weight: bold; transition: all 0.3s ease;
            ">Entendi</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('div').style.transform = 'translateY(0)';
    }, 10);
}