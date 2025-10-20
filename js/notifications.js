// Sistema de Notificações
class NotificationSystem {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        this.init();
    }

    init() {
        this.updateBadge();
        this.bindEvents();
        this.loadNotifications();
    }

    bindEvents() {
        const icon = document.getElementById('notificationIcon');
        const dropdown = document.getElementById('notificationDropdown');

        if (icon && dropdown) {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                dropdown.classList.remove('show');
            });

            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    addNotification(title, message, tableLink, tableTime, tableId = null) {
        const notification = {
            id: Date.now(),
            title,
            message,
            tableLink,
            tableTime,
            tableId,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        this.updateBadge();
        this.loadNotifications();
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateBadge();
            this.loadNotifications();
        }
    }

    updateBadge() {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            const unreadCount = this.notifications.filter(n => !n.read).length;
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    loadNotifications() {
        const list = document.getElementById('notificationList');
        if (!list) return;

        if (this.notifications.length === 0) {
            list.innerHTML = '<div class="notification-empty">Nenhuma notificação</div>';
            return;
        }

        list.innerHTML = this.notifications.map(notification => {
            const timeAgo = this.getTimeAgo(new Date(notification.timestamp));
            const showUncandidateBtn = notification.tableId && notification.title.includes('Candidatura Enviada');
            
            return `
                <div class="notification-item ${!notification.read ? 'unread' : ''}">
                    <div class="notification-content" onclick="window.notificationSystem.handleNotificationClick(${notification.id})">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${timeAgo}</div>
                    </div>
                    ${showUncandidateBtn ? `
                        <button class="uncandidate-btn" onclick="window.notificationSystem.uncandidateFromTable('${notification.tableId}', ${notification.id})">
                            Descandidatar
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    handleNotificationClick(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            this.markAsRead(id);
            if (notification.tableLink) {
                window.open(notification.tableLink, '_blank');
            }
        }
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Agora';
        if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h atrás`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d atrás`;
    }

    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    // Simular recebimento de notificação quando selecionado para mesa
    simulateTableSelection(tableName, tableTime, tableLink) {
        this.addNotification(
            'Selecionado para Mesa!',
            `Você foi selecionado para a mesa "${tableName}". Horário: ${tableTime}`,
            tableLink,
            tableTime
        );
    }

    // Descandidatar de mesa
    async uncandidateFromTable(tableId, notificationId) {
        if (!confirm('Tem certeza que deseja se descandidatar desta mesa?')) return;
        
        try {
            // Chamar função de sair da mesa existente (modo silencioso)
            if (window.sairMesa) {
                await window.sairMesa(tableId, true);
                alert('Você se descandidatou da mesa com sucesso!');
            }
            
            // Remover notificação
            this.notifications = this.notifications.filter(n => n.id !== notificationId);
            this.saveNotifications();
            this.updateBadge();
            this.loadNotifications();
            
        } catch (error) {
            console.error('Erro ao descandidatar:', error);
            alert('Erro ao se descandidatar da mesa.');
            return;
        }
    }
}

// Inicializar sistema de notificações
let notificationSystem;

// Função global para adicionar notificações (pode ser chamada de outras páginas)
window.addTableNotification = (tableName, tableTime, tableLink, tableId = null) => {
    if (notificationSystem) {
        notificationSystem.addNotification(
            'Candidatura Enviada!',
            `Você se candidatou para a mesa "${tableName}". Data: ${tableTime}`,
            tableLink,
            tableTime,
            tableId
        );
    }
};

// Expor sistema de notificações globalmente
window.notificationSystem = null;
document.addEventListener('DOMContentLoaded', () => {
    window.notificationSystem = new NotificationSystem();
});