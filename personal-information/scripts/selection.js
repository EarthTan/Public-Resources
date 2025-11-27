// Selection Mode Functionality
class SelectionManager {
    constructor() {
        this.isSelectMode = false;
        this.selectedItems = new Set();
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Copy URL button
        document.getElementById('copy-btn').addEventListener('click', () => this.copyURL());
        
        // Select mode toggle
        document.getElementById('select-btn').addEventListener('click', () => this.toggleSelectMode());
        
        // Selection controls
        document.getElementById('cancel-btn').addEventListener('click', () => this.cancelSelection());
        document.getElementById('print-btn').addEventListener('click', () => this.printSelected());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadSelected());
        document.getElementById('latex-btn').addEventListener('click', () => this.generateLaTeXResume());
        
        // Checkbox events
        this.bindCheckboxEvents();
    }

    bindCheckboxEvents() {
        const checkboxes = document.querySelectorAll('.select-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const item = e.target.closest('.item');
                if (e.target.checked) {
                    this.selectedItems.add(item);
                    item.classList.add('selected');
                } else {
                    this.selectedItems.delete(item);
                    item.classList.remove('selected');
                }
            });
        });
    }

    copyURL() {
        const url = 'https://earthtan.github.io/Webpages/personal-information/';
        navigator.clipboard.writeText(url).then(() => {
            this.showNotification('URL copied');
        }).catch(err => {
            console.error('Failed to copy URL', err);
            this.showNotification('Failed to copy URL');
        });
    }

    toggleSelectMode() {
        this.isSelectMode = !this.isSelectMode;
        const topbar = document.getElementById('topbar');
        const body = document.body;

        if (this.isSelectMode) {
            topbar.classList.add('select-mode');
            body.classList.add('select-mode');
            // Hide copy and select buttons in select mode
            document.getElementById('copy-btn').style.display = 'none';
            document.getElementById('select-btn').style.display = 'none';
        } else {
            this.exitSelectMode();
        }
    }

    exitSelectMode() {
        this.isSelectMode = false;
        const topbar = document.getElementById('topbar');
        const body = document.body;
        
        topbar.classList.remove('select-mode');
        body.classList.remove('select-mode');
        
        // Show copy and select buttons again with inline display
        document.getElementById('copy-btn').style.display = 'inline-block';
        document.getElementById('select-btn').style.display = 'inline-block';
        
        // Reset selection
        this.selectedItems.clear();
        document.querySelectorAll('.select-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        document.querySelectorAll('.item.selected').forEach(item => {
            item.classList.remove('selected');
        });
    }

    cancelSelection() {
        this.exitSelectMode();
        // No notification for cancel
    }

    printSelected() {
        if (this.selectedItems.size === 0) {
            this.showNotification('请先选择要打印的项目');
            return;
        }

        const printWindow = window.open('', '_blank');
        const selectedContent = this.getSelectedContent();
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Tiancheng Tan - Selected Items</title>
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
                <h1>Tiancheng Tan - Selected Items</h1>
                ${selectedContent}
                <div class="clear"></div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(() => window.close(), 500);
                    }
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        // Exit select mode after printing
        this.exitSelectMode();
    }

    downloadSelected() {
        if (this.selectedItems.size === 0) {
            this.showNotification('请先选择要下载的项目');
            return;
        }

        const content = this.getSelectedContent();
        const blob = new Blob([`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Tiancheng Tan - Selected Items</title>
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
                <h1>Tiancheng Tan - Selected Items</h1>
                ${content}
                <div class="clear"></div>
            </body>
            </html>
        `], { type: 'text/html' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Tiancheng_Tan_Selected_Items.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('文件下载完成');
        
        // Exit select mode after downloading
        this.exitSelectMode();
    }

    generateLaTeXResume() {
        if (this.selectedItems.size === 0) {
            this.showNotification('请先选择要包含在简历中的项目');
            return;
        }

        const personalInfo = this.getPersonalInfo();
        const selectedContent = this.getSelectedContentByCategory();
        const latexContent = this.generateLaTeXContent(personalInfo, selectedContent);
        
        const blob = new Blob([latexContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Tiancheng_Tan_Resume.tex';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('LaTeX简历文件已生成，请用LaTeX编译器渲染');
        
        // Exit select mode after generating
        this.exitSelectMode();
    }

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

    getSelectedContentByCategory() {
        const categories = {
            'Education': [],
            'Experience': [],
            'Certificates & Awards': [],
            'Skills': [],
            'Projects': []
        };

        this.selectedItems.forEach(item => {
            const section = item.closest('section');
            const sectionTitle = section ? section.querySelector('.section-title').textContent : 'Other';
            const title = item.querySelector('.item-title').textContent;
            const desc = item.querySelector('.item-desc').textContent;
            
            // 清理描述文本，移除HTML标签和多余空格
            const cleanDesc = desc.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            
            if (categories[sectionTitle]) {
                categories[sectionTitle].push({
                    title: title,
                    description: cleanDesc
                });
            }
        });

        return categories;
    }

    generateLaTeXContent(personalInfo, content) {
        return `% Tiancheng Tan - Resume
% Generated from personal information website
% Compile with: pdflatex resume.tex

\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{xeCJK}
\\setCJKmainfont{SimSun}
\\usepackage{fontspec}
\\setmainfont{Times New Roman}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}

% Section formatting
\\titleformat{\\section}{\\Large\\bfseries}{}{0em}{}
\\titlespacing*{\\section}{0pt}{12pt}{6pt}

\\titleformat{\\subsection}{\\large\\bfseries}{}{0em}{}
\\titlespacing*{\\subsection}{0pt}{8pt}{4pt}

\\setlist[itemize]{leftmargin=*,topsep=2pt,itemsep=1pt}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{4pt}

\\begin{document}

% Header
\\begin{center}
    {\\Huge\\bfseries ${personalInfo.name}}\\\\[6pt]
    \\href{mailto:${personalInfo.email}}{${personalInfo.email}} | ${personalInfo.phone} | ${personalInfo.location}\\\\
    \\href{${personalInfo.githubUrl}}{GitHub: ${personalInfo.github}}
\\end{center}

\\vspace{10pt}

% Education
${this.generateEducationSection(content['Education'])}

% Experience
${this.generateExperienceSection(content['Experience'])}

% Projects
${this.generateProjectsSection(content['Projects'])}

% Skills
${this.generateSkillsSection(content['Skills'])}

% Certificates & Awards
${this.generateCertificatesSection(content['Certificates & Awards'])}

\\end{document}
`;
    }

    generateEducationSection(educationItems) {
        if (!educationItems || educationItems.length === 0) return '';
        
        let section = '\\section{Education}\n';
        educationItems.forEach(item => {
            section += `\\subsection{${this.escapeLaTeX(item.title)}}\n`;
            section += `${this.escapeLaTeX(item.description)}\\\\\n`;
        });
        return section;
    }

    generateExperienceSection(experienceItems) {
        if (!experienceItems || experienceItems.length === 0) return '';
        
        let section = '\\section{Experience}\n';
        experienceItems.forEach(item => {
            section += `\\subsection{${this.escapeLaTeX(item.title)}}\n`;
            section += `${this.escapeLaTeX(item.description)}\\\\\n`;
        });
        return section;
    }

    generateProjectsSection(projectItems) {
        if (!projectItems || projectItems.length === 0) return '';
        
        let section = '\\section{Projects}\n';
        projectItems.forEach(item => {
            section += `\\subsection{${this.escapeLaTeX(item.title)}}\n`;
            section += `${this.escapeLaTeX(item.description)}\\\\\n`;
        });
        return section;
    }

    generateSkillsSection(skillItems) {
        if (!skillItems || skillItems.length === 0) return '';
        
        let section = '\\section{Skills}\n';
        section += '\\begin{itemize}\n';
        skillItems.forEach(item => {
            section += `    \\item \\textbf{${this.escapeLaTeX(item.title)}}: ${this.escapeLaTeX(item.description)}\n`;
        });
        section += '\\end{itemize}\n';
        return section;
    }

    generateCertificatesSection(certificateItems) {
        if (!certificateItems || certificateItems.length === 0) return '';
        
        let section = '\\section{Certificates \\& Awards}\n';
        section += '\\begin{itemize}\n';
        certificateItems.forEach(item => {
            section += `    \\item \\textbf{${this.escapeLaTeX(item.title)}}: ${this.escapeLaTeX(item.description)}\n`;
        });
        section += '\\end{itemize}\n';
        return section;
    }

    escapeLaTeX(text) {
        if (!text) return '';
        return text
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}')
            .replace(/\$/g, '\\$')
            .replace(/%/g, '\\%')
            .replace(/#/g, '\\#')
            .replace(/_/g, '\\_')
            .replace(/\^/g, '\\^{}')
            .replace(/&/g, '\\&')
            .replace(/~/g, '\\~{}')
            .replace(/\n/g, '\\\\');
    }

    getSelectedContent() {
        let content = '';
        this.selectedItems.forEach(item => {
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

    showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
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

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }
}

// Add notification animations to CSS
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

// Initialize selection manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SelectionManager();
});
