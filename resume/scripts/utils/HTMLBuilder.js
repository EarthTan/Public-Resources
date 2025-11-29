// HTML 构建工具类
class HTMLBuilder {
    // 生成选中内容的 HTML
    generateSelectedContent(selectedItems) {
        let content = '';
        selectedItems.forEach(item => {
            const title = item.querySelector('.item-title').textContent;
            const desc = item.querySelector('.item-desc').innerHTML;
            const img = item.querySelector('img');
            const imgSrc = img ? img.src : '';
            const imgAlt = img ? img.alt : '';

            content += `
                <div class="item">
                    ${imgSrc ? `<img src="${imgSrc}" alt="${imgAlt}">` : ''}
                    <div class="item-title">${title}</div>
                    <div class="item-desc">${desc}</div>
                    <div class="clear"></div>
                </div>
            `;
        });
        return content;
    }

    // 生成打印页面的完整 HTML
    generatePrintHTML(content, title = 'Tiancheng Tan - Selected Items') {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .item { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                    .item-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
                    .item-desc { line-height: 1.4; }
                    img { max-width: 200px; height: auto; margin-right: 15px; float: left; }
                    .clear { clear: both; }
                    @media print {
                        body { margin: 0; }
                        .item { break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                ${content}
                <div class="clear"></div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(() => window.close(), 500);
                    }
                </script>
            </body>
            </html>
        `;
    }

    // 生成下载页面的完整 HTML
    generateDownloadHTML(content, title = 'Tiancheng Tan - Selected Items') {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .item { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                    .item-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
                    .item-desc { line-height: 1.4; }
                    img { max-width: 200px; height: auto; margin-right: 15px; float: left; }
                    .clear { clear: both; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                ${content}
                <div class="clear"></div>
            </body>
            </html>
        `;
    }

    // 创建通知元素
    createNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
        return notification;
    }

    // 添加通知动画样式
    addNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 导出单例
const htmlBuilder = new HTMLBuilder();
