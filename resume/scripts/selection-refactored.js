// 重构后的 SelectionManager 类 - 使用新工具模块
class SelectionManager {
    constructor() {
        this.isSelectMode = false;
        this.selectedItems = new Set();
        
        // 缓存 DOM 节点
        this.dom = {
            copyBtn: document.getElementById('copy-btn'),
            selectBtn: document.getElementById('select-btn'),
            cancelBtn: document.getElementById('cancel-btn'),
            printBtn: document.getElementById('print-btn'),
            downloadBtn: document.getElementById('download-btn'),
            topbar: document.getElementById('topbar'),
            body: document.body
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定按钮事件
        this.dom.copyBtn.addEventListener('click', () => this.copyURL());
        this.dom.selectBtn.addEventListener('click', () => this.toggleSelectMode());
        this.dom.cancelBtn.addEventListener('click', () => this.cancelSelection());
        this.dom.printBtn.addEventListener('click', () => this.printSelected());
        this.dom.downloadBtn.addEventListener('click', () => this.downloadSelected());
        
        // 使用事件委托处理复选框
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('select-checkbox')) {
                this.handleCheckboxChange(e.target);
            }
        });
    }

    handleCheckboxChange(checkbox) {
        const item = checkbox.closest('.item');
        if (checkbox.checked) {
            this.selectedItems.add(item);
            domUtils.addClass(item, 'selected');
        } else {
            this.selectedItems.delete(item);
            domUtils.removeClass(item, 'selected');
        }
    }

    // 状态管理方法
    setSelectMode(on) {
        this.isSelectMode = on;
        this.renderSelectModeUI();
    }

    renderSelectModeUI() {
        if (this.isSelectMode) {
            domUtils.addClass(this.dom.topbar, 'select-mode');
            domUtils.addClass(this.dom.body, 'select-mode');
            domUtils.setStyle(this.dom.copyBtn, { display: 'none' });
            domUtils.setStyle(this.dom.selectBtn, { display: 'none' });
        } else {
            this.exitSelectMode();
        }
    }

    exitSelectMode() {
        this.isSelectMode = false;
        domUtils.removeClass(this.dom.topbar, 'select-mode');
        domUtils.removeClass(this.dom.body, 'select-mode');
        domUtils.setStyle(this.dom.copyBtn, { display: 'inline-block' });
        domUtils.setStyle(this.dom.selectBtn, { display: 'inline-block' });
        
        // 重置选择状态
        this.selectedItems.clear();
        const checkboxes = domUtils.getElements('.select-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        const selectedItems = domUtils.getElements('.item.selected');
        selectedItems.forEach(item => {
            domUtils.removeClass(item, 'selected');
        });
    }

    // 业务逻辑方法
    async copyURL() {
        const url = 'https://earthtan.github.io/Webpages/personal-information/';
        const success = await fileUtils.copyToClipboard(url);
        this.showNotification(success ? 'URL copied' : 'Failed to copy URL');
    }

    toggleSelectMode() {
        this.setSelectMode(!this.isSelectMode);
    }

    cancelSelection() {
        this.exitSelectMode();
    }

    printSelected() {
        if (this.selectedItems.size === 0) {
            this.showNotification('请先选择要打印的项目');
            return;
        }

        const content = htmlBuilder.generateCompleteContent(this.selectedItems);
        fileUtils.printHTML(content, 'Tiancheng Tan - Resume');
        
        // 打印后退出选择模式
        this.exitSelectMode();
    }

    downloadSelected() {
        if (this.selectedItems.size === 0) {
            this.showNotification('请先选择要下载的项目');
            return;
        }

        const content = htmlBuilder.generateCompleteContent(this.selectedItems);
        const htmlContent = htmlBuilder.generateDownloadHTML(content, 'Tiancheng Tan - Resume');
        const blob = fileUtils.createHTMLBlob(htmlContent, 'Tiancheng Tan - Resume');
        fileUtils.downloadBlob(blob, 'Tiancheng_Tan_Resume.html');
        
        this.showNotification('文件下载完成');
        this.exitSelectMode();
    }


    showNotification(message, type = 'success') {
        notificationManager.show(message, type);
    }
}

// 初始化重构后的选择管理器
document.addEventListener('DOMContentLoaded', () => {
    new SelectionManager();
});
