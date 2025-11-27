// DOM 操作工具类
class DOMUtils {
    constructor() {
        this.cache = new Map();
    }

    // 缓存 DOM 节点
    cacheElement(key, selector) {
        if (!this.cache.has(key)) {
            this.cache.set(key, document.querySelectorAll(selector));
        }
        return this.cache.get(key);
    }

    // 获取单个元素
    getElement(selector) {
        return document.querySelector(selector);
    }

    // 获取多个元素
    getElements(selector) {
        return document.querySelectorAll(selector);
    }

    // 添加类名
    addClass(element, className) {
        if (element) {
            element.classList.add(className);
        }
    }

    // 移除类名
    removeClass(element, className) {
        if (element) {
            element.classList.remove(className);
        }
    }

    // 切换类名
    toggleClass(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    }

    // 设置样式
    setStyle(element, styles) {
        if (element) {
            Object.assign(element.style, styles);
        }
    }

    // 创建元素
    createElement(tag, attributes = {}, innerHTML = '') {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
        element.innerHTML = innerHTML;
        return element;
    }

    // 移除元素
    removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    // 清空缓存
    clearCache() {
        this.cache.clear();
    }
}

// 导出单例
const domUtils = new DOMUtils();
