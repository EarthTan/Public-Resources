// 文件操作工具类
class FileUtils {
    // 下载 Blob 文件
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 打印 HTML 内容 - 改进可靠性
    printHTML(content, title = 'Document') {
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
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
                ${content}
                <div class="clear"></div>
                <script>
                    // 更可靠的打印触发方式
                    document.addEventListener('DOMContentLoaded', function() {
                        setTimeout(() => {
                            window.print();
                            setTimeout(() => window.close(), 500);
                        }, 100);
                    });
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // 备用打印触发
        setTimeout(() => {
            if (!printWindow.closed) {
                printWindow.print();
                setTimeout(() => printWindow.close(), 500);
            }
        }, 200);
    }

    // 复制文本到剪贴板
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text', err);
            return false;
        }
    }

    // 创建 HTML Blob
    createHTMLBlob(content, title = 'Document') {
        const html = `
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
        return new Blob([html], { type: 'text/html' });
    }

    // 创建文本 Blob
    createTextBlob(content, type = 'text/plain') {
        return new Blob([content], { type });
    }
}

// 导出单例
const fileUtils = new FileUtils();
