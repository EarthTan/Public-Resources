// HTML 构建工具类 - 重构优化版本
class HTMLBuilder {
    constructor() {
        this.themes = {
            light: this.generateLightTheme(),
            modern: this.generateModernTheme(),
            classic: this.generateClassicTheme()
        };
    }

    // ===================== 模板函数 =====================
    
    // 渲染单个项目模板
    renderItem({ imgSrc, imgAlt, title, desc }) {
        return `
            <div class="item">
                ${imgSrc ? `<img src="${imgSrc}" alt="${imgAlt}" class="item-img">` : ''}
                <div class="item-content">
                    <div class="item-title">${title}</div>
                    <div class="item-desc">${desc}</div>
                </div>
            </div>
        `;
    }

    // 生成侧边栏信息模板
    renderSidebarInfo({ profileImg, name, contact, github }) {
        return `
            <div class="sidebar-info">
                <div class="profile-header">
                    ${profileImg ? `<img src="${profileImg}" alt="Profile Photo" class="profile-img">` : ''}
                    <div class="profile-name">${name}</div>
                </div>
                <div class="contact-info">
                    ${contact}
                </div>
                ${github ? `<div class="github-link">${github}</div>` : ''}
            </div>
        `;
    }

    // 生成选中内容的 HTML - 优化版本
    generateSelectedContent(selectedItems) {
        const blocks = Array.from(selectedItems).map(item => {
            const titleEl = item.querySelector('.item-title');
            const descEl = item.querySelector('.item-desc');
            const img = item.querySelector('img');
            
            const title = titleEl?.textContent ?? '';
            const desc = descEl?.innerHTML ?? '';
            const imgSrc = img?.src ?? '';
            const imgAlt = img?.alt ?? '';

            return this.renderItem({ imgSrc, imgAlt, title, desc });
        });
        
        return blocks.join('');
    }

    // 生成完整简历内容（包含侧边栏信息）
    generateCompleteContent(selectedItems) {
        const sidebarHTML = this.generateSidebarInfo();
        const selectedContent = this.generateSelectedContent(selectedItems);
        return sidebarHTML + selectedContent;
    }

    // 生成侧边栏信息
    generateSidebarInfo() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return '';

        // 提取头像
        const profileImgEl = sidebar.querySelector('img');
        const profileImg = profileImgEl?.src ?? '';
        const profileAlt = profileImgEl?.alt ?? '';

        // 提取姓名
        const nameEl = sidebar.querySelector('h1');
        const name = nameEl?.textContent ?? '';

        // 提取联系方式
        const contactEl = sidebar.querySelector('.contact');
        const contact = contactEl?.innerHTML ?? '';

        // 提取GitHub信息
        const githubEl = sidebar.querySelector('.profiles a');
        const github = githubEl ? githubEl.outerHTML : '';

        return this.renderSidebarInfo({
            profileImg,
            name,
            contact,
            github
        });
    }

    // ===================== 基础HTML生成 =====================

    // 生成基础HTML结构
    generateBaseHTML({ title, content, extraScript = '', theme = 'light' }) {
        const styles = this.generateStyles(theme);
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${styles}
            </head>
            <body>
                <h1>${title}</h1>
                ${content}
                ${extraScript}
            </body>
            </html>
        `;
    }

    // ===================== 样式生成 =====================

    // 生成样式 - 支持主题系统
    generateStyles(theme = 'light') {
        const themeStyles = this.themes[theme] || this.themes.light;
        return `<style>${themeStyles}</style>`;
    }

    // 浅色主题
    generateLightTheme() {
        return `
            body { 
                font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
                margin: 20px;
                color: #333;
                line-height: 1.6;
            }
            
            h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 30px;
                color: #2c3e50;
                border-bottom: 2px solid #3498db;
                padding-bottom: 10px;
            }
            
            /* 侧边栏信息样式 */
            .sidebar-info {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e2e2e2;
                border-radius: 8px;
                background: #f8f9fa;
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 16px;
            }
            
            .profile-img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid #3498db;
            }
            
            .profile-name {
                font-size: 24px;
                font-weight: 700;
                color: #2c3e50;
                margin: 0;
            }
            
            .contact-info {
                margin-bottom: 12px;
                font-size: 14px;
                line-height: 1.5;
                color: #555;
            }
            
            .github-link a {
                color: #3498db;
                text-decoration: none;
                font-weight: 500;
            }
            
            .github-link a:hover {
                text-decoration: underline;
            }
            
            .item {
                display: flex;
                gap: 16px;
                margin-bottom: 20px;
                padding: 18px;
                border: 1px solid #e2e2e2;
                border-radius: 8px;
                background: #fafafa;
                transition: all 0.2s ease;
            }
            
            .item:hover {
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                transform: translateY(-1px);
            }
            
            .item-img {
                max-width: 160px;
                height: auto;
                border-radius: 6px;
                object-fit: cover;
                flex-shrink: 0;
            }
            
            .item-content {
                flex: 1;
                min-width: 0;
            }
            
            .item-title {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #2c3e50;
            }
            
            .item-desc {
                font-size: 15px;
                line-height: 1.6;
                color: #555;
            }
            
            .item-desc a {
                color: #3498db;
                text-decoration: none;
            }
            
            .item-desc a:hover {
                text-decoration: underline;
            }
            
            /* 打印样式优化 */
            @media print {
                body { 
                    margin: 0;
                    font-size: 12pt;
                }
                
                h1 { 
                    margin-bottom: 40px;
                    font-size: 24pt;
                }
                
                .sidebar-info {
                    margin-bottom: 20pt;
                    padding: 15pt;
                    border: 1pt solid #ccc;
                }
                
                .profile-img {
                    width: 60px;
                    height: 60px;
                }
                
                .profile-name {
                    font-size: 18pt;
                }
                
                .contact-info {
                    font-size: 10pt;
                }
                
                .item { 
                    break-inside: avoid; 
                    page-break-inside: avoid;
                    margin-bottom: 15pt;
                    padding: 12pt;
                    border: 1pt solid #ccc;
                }
                
                .item-img { 
                    max-width: 140px !important; 
                }
                
                .item-title {
                    font-size: 14pt;
                }
                
                .item-desc {
                    font-size: 11pt;
                }
            }
        `;
    }

    // 现代主题
    generateModernTheme() {
        return `
            body { 
                font-family: "SF Pro Display", "Inter", sans-serif;
                margin: 24px;
                color: #1a1a1a;
                line-height: 1.5;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            
            h1 {
                font-size: 32px;
                font-weight: 800;
                margin-bottom: 32px;
                color: white;
                text-align: center;
            }
            
            .item {
                display: flex;
                gap: 20px;
                margin-bottom: 24px;
                padding: 24px;
                border-radius: 16px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            }
            
            .item-img {
                max-width: 180px;
                height: auto;
                border-radius: 12px;
                object-fit: cover;
                flex-shrink: 0;
            }
            
            .item-title {
                font-size: 22px;
                font-weight: 700;
                margin-bottom: 12px;
                color: #1a1a1a;
            }
            
            .item-desc {
                font-size: 16px;
                line-height: 1.6;
                color: #666;
            }
            
            @media print {
                body { 
                    margin: 0;
                    background: white;
                }
                
                h1 { 
                    color: #1a1a1a;
                    margin-bottom: 40px;
                }
                
                .item { 
                    break-inside: avoid; 
                    background: white;
                    box-shadow: none;
                }
            }
        `;
    }

    // 经典主题
    generateClassicTheme() {
        return `
            body { 
                font-family: "Georgia", "Times New Roman", serif;
                margin: 30px;
                color: #2c1810;
                line-height: 1.8;
                background: #f8f4f0;
            }
            
            h1 {
                font-size: 36px;
                font-weight: 400;
                margin-bottom: 40px;
                color: #8b4513;
                text-align: center;
                font-style: italic;
                border-bottom: 3px double #8b4513;
                padding-bottom: 15px;
            }
            
            .item {
                display: flex;
                gap: 20px;
                margin-bottom: 25px;
                padding: 25px;
                border: 2px solid #d2b48c;
                border-radius: 4px;
                background: #fffaf0;
            }
            
            .item-img {
                max-width: 150px;
                height: auto;
                border: 1px solid #d2b48c;
                border-radius: 2px;
                flex-shrink: 0;
            }
            
            .item-title {
                font-size: 22px;
                font-weight: 600;
                margin-bottom: 15px;
                color: #8b4513;
                font-style: italic;
            }
            
            .item-desc {
                font-size: 16px;
                line-height: 1.8;
                color: #654321;
            }
            
            @media print {
                body { 
                    margin: 0;
                    background: white;
                }
                
                .item { 
                    break-inside: avoid; 
                    border: 1px solid #ccc;
                }
            }
        `;
    }

    // ===================== 特定功能HTML生成 =====================

    // 生成打印页面的完整 HTML
    generatePrintHTML(content, title = 'Tiancheng Tan - Selected Items', theme = 'light') {
        const printScript = `
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(() => {
                        window.print();
                        setTimeout(() => {
                            if (!window.closed) {
                                window.close();
                            }
                        }, 500);
                    }, 100);
                });
            </script>
        `;

        return this.generateBaseHTML({
            title,
            content,
            extraScript: printScript,
            theme
        });
    }

    // 生成下载页面的完整 HTML
    generateDownloadHTML(content, title = 'Tiancheng Tan - Selected Items', theme = 'light') {
        return this.generateBaseHTML({
            title,
            content,
            theme
        });
    }

    // ===================== 通知系统 =====================

    // 创建通知元素 - 独立样式版本
    createNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 添加通知样式（如果尚未添加）
        this.ensureNotificationStyles();
        
        return notification;
    }

    // 确保通知样式已添加
    ensureNotificationStyles() {
        if (document.getElementById('notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = this.generateNotificationStyles();
        document.head.appendChild(style);
    }

    // 生成通知样式
    generateNotificationStyles() {
        return `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-size: 14px;
                font-weight: 500;
                animation: slideIn 0.3s ease;
                max-width: 300px;
                word-wrap: break-word;
            }
            
            .notification-success {
                background: #27ae60;
                color: white;
            }
            
            .notification-error {
                background: #e74c3c;
                color: white;
            }
            
            .notification-warning {
                background: #f39c12;
                color: white;
            }
            
            .notification-info {
                background: #3498db;
                color: white;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
    }
}

// 导出单例
const htmlBuilder = new HTMLBuilder();
