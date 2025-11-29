// 主入口文件 - 加载所有工具模块和重构后的选择管理器

// 加载工具模块
import './utils/DOMUtils.js';
import './utils/FileUtils.js';
import './utils/LatexBuilder.js';
import './utils/HTMLBuilder.js';

// 加载重构后的选择管理器
import './selection-refactored.js';

// 全局初始化函数
function initializeApp() {
    console.log('应用程序初始化完成');
    
    // 检查必要的 DOM 元素是否存在
    const requiredElements = [
        'copy-btn',
        'select-btn', 
        'cancel-btn',
        'print-btn',
        'download-btn',
        'latex-btn',
        'topbar'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.warn('缺少必要的 DOM 元素:', missingElements);
    }
}

// 当 DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initializeApp);
