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

    // 打印 HTML 内容 - 使用新的HTMLBuilder
    printHTML(content, title = 'Tiancheng Tan - Selected Items', theme = 'light') {
        const printHTML = htmlBuilder.generatePrintHTML(content, title, theme);
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(printHTML);
        printWindow.document.close();
        printWindow.focus();
        
        // 备用打印触发
        setTimeout(() => {
            if (!printWindow.closed) {
                printWindow.print();
                setTimeout(() => {
                    if (!printWindow.closed) {
                        printWindow.close();
                    }
                }, 500);
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

    // 创建 HTML Blob - 使用新的HTMLBuilder
    createHTMLBlob(content, title = 'Tiancheng Tan - Selected Items', theme = 'light') {
        const html = htmlBuilder.generateDownloadHTML(content, title, theme);
        return new Blob([html], { type: 'text/html' });
    }

    // 创建文本 Blob
    createTextBlob(content, type = 'text/plain') {
        return new Blob([content], { type });
    }
}

// 导出单例
const fileUtils = new FileUtils();
