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

    addNotification(title, message, tableLink, tableTime) {
        const notification = {
            id: Date.now(),
            title,
            message,
            tableLink,
            tableTime,
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
            return `
                <div class="notification-item ${!notification.read ? 'unread' : ''}" 
                     onclick="notificationSystem.handleNotificationClick(${notification.id})">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${timeAgo}</div>
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
}

// Inicializar sistema de notificações
let notificationSystem;
document.addEventListener('DOMContentLoaded', () => {
    notificationSystem = new NotificationSystem();
});

// Função global para adicionar notificações (pode ser chamada de outras páginas)
window.addTableNotification = (tableName, tableTime, tableLink) => {
    if (notificationSystem) {
        notificationSystem.simulateTableSelection(tableName, tableTime, tableLink);
    }
};