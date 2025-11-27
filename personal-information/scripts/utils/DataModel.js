// 数据模型工具类 - 统一数据结构
class DataModel {
    // 解析项目数据
    parseItem(item) {
        const title = item.querySelector('.item-title').textContent;
        const desc = item.querySelector('.item-desc').innerHTML;
        const img = item.querySelector('img');
        const imgSrc = img ? img.src : '';
        const imgAlt = img ? img.alt : '';
        
        const section = item.closest('section');
        const category = section ? section.querySelector('.section-title').textContent : 'Other';
        
        // 清理描述文本
        const cleanDesc = desc.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        
        return {
            title,
            description: desc,
            cleanDescription: cleanDesc,
            imgSrc,
            imgAlt,
            category,
            element: item
        };
    }

    // 解析多个项目
    parseItems(items) {
        return Array.from(items).map(item => this.parseItem(item));
    }

    // 按分类组织数据
    organizeByCategory(items) {
        const categories = {
            'Education': [],
            'Experience': [],
            'Certificates & Awards': [],
            'Skills': [],
            'Projects': []
        };

        items.forEach(item => {
            if (categories[item.category]) {
                categories[item.category].push(item);
            }
        });

        return categories;
    }

    // 获取个人信息
    getPersonalInfo() {
        const sidebar = document.querySelector('.sidebar');
        return {
            name: sidebar.querySelector('h1').textContent,
            email: 'tt302@duke.edu',
            phone: '+86 152 6112 2732',
            location: 'Kunshan, China',
            github: 'EarthTan',
            githubUrl: 'https://github.com/EarthTan'
        };
    }
}

// 导出单例
const dataModel = new DataModel();
