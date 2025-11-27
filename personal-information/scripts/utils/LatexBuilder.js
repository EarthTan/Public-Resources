// LaTeX 构建工具类
class LatexBuilder {
    // 生成完整的 LaTeX 文档
    generateLaTeXDocument(personalInfo, content) {
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

    // 生成教育部分
    generateEducationSection(educationItems) {
        if (!educationItems || educationItems.length === 0) return '';
        
        let section = '\\section{Education}\n';
        educationItems.forEach(item => {
            section += `\\subsection{${this.escapeLaTeX(item.title)}}\n`;
            section += `${this.escapeLaTeX(item.description)}\\\\\n`;
        });
        return section;
    }

    // 生成经验部分
    generateExperienceSection(experienceItems) {
        if (!experienceItems || experienceItems.length === 0) return '';
        
        let section = '\\section{Experience}\n';
        experienceItems.forEach(item => {
            section += `\\subsection{${this.escapeLaTeX(item.title)}}\n`;
            section += `${this.escapeLaTeX(item.description)}\\\\\n`;
        });
        return section;
    }

    // 生成项目部分
    generateProjectsSection(projectItems) {
        if (!projectItems || projectItems.length === 0) return '';
        
        let section = '\\section{Projects}\n';
        projectItems.forEach(item => {
            section += `\\subsection{${this.escapeLaTeX(item.title)}}\n`;
            section += `${this.escapeLaTeX(item.description)}\\\\\n`;
        });
        return section;
    }

    // 生成技能部分
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

    // 生成证书和奖项部分
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

    // 转义 LaTeX 特殊字符 - 使用映射表确保正确顺序
    escapeLaTeX(text) {
        if (!text) return '';
        
        const replacements = {
            '\\': '\\textbackslash{}',
            '{': '\\{',
            '}': '\\}',
            '$': '\\$',
            '%': '\\%',
            '#': '\\#',
            '_': '\\_',
            '^': '\\^{}',
            '&': '\\&',
            '~': '\\~{}',
            '\n': '\\\\'
        };
        
        return text.replace(/[\\{}$%#_^&~\n]/g, m => replacements[m]);
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

    // 按分类组织内容
    organizeContentByCategory(selectedItems) {
        const categories = {
            'Education': [],
            'Experience': [],
            'Certificates & Awards': [],
            'Skills': [],
            'Projects': []
        };

        selectedItems.forEach(item => {
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
}

// 导出单例
const latexBuilder = new LatexBuilder();
