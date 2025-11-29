// 通知管理器 - 独立的通知组件
class NotificationManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.addStyles();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.container);
    }

    addStyles() {
        // 使用HTMLBuilder中的统一通知样式
        htmlBuilder.ensureNotificationStyles();
        
        // 添加额外的动画样式
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }
            
            .notification.visible {
                opacity: 1;
                transform: translateX(0);
            }
            
            .notification.hiding {
                opacity: 0;
                transform: translateX(100%);
            }
        `;
        document.head.appendChild(style);
    }

    show(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        this.container.appendChild(notification);
        
        // 触发动画
        setTimeout(() => {
            notification.classList.add('visible');
        }, 10);
        
        // 自动移除
        setTimeout(() => {
            this.hide(notification);
        }, duration);
        
        return notification;
    }

    hide(notification) {
        if (!notification || !notification.parentNode) return;
        
        notification.classList.remove('visible');
        notification.classList.add('hiding');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    hideAll() {
        const notifications = this.container.querySelectorAll('.notification');
        notifications.forEach(notification => {
            this.hide(notification);
        });
    }
}

// 导出单例
const notificationManager = new NotificationManager();
