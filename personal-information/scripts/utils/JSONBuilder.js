// JSON Resume 构建工具类
class JSONBuilder {
    // 生成 JSON Resume 格式的数据
    generateJSONResume(selectedItems) {
        const personalInfo = dataModel.getPersonalInfo();
        const parsedItems = dataModel.parseItems(selectedItems);
        const organizedItems = dataModel.organizeByCategory(parsedItems);

        // 构建 JSON Resume 对象
        const jsonResume = {
            basics: this.buildBasics(personalInfo),
            work: this.buildWork(organizedItems['Experience']),
            education: this.buildEducation(organizedItems['Education']),
            skills: this.buildSkills(organizedItems['Skills']),
            projects: this.buildProjects(organizedItems['Projects']),
            awards: this.buildAwards(organizedItems['Certificates & Awards']),
            certificates: this.buildCertificates(organizedItems['Certificates & Awards']),
            languages: this.buildLanguages(),
            interests: this.buildInterests()
        };

        // 过滤空数组
        Object.keys(jsonResume).forEach(key => {
            if (Array.isArray(jsonResume[key]) && jsonResume[key].length === 0) {
                delete jsonResume[key];
            }
        });

        return jsonResume;
    }

    // 构建基本信息
    buildBasics(personalInfo) {
        return {
            name: personalInfo.name,
            label: "Undergraduate Student at DKU",
            email: personalInfo.email,
            phone: personalInfo.phone,
            website: personalInfo.githubUrl,
            location: {
                city: "Kunshan",
                region: "Jiangsu",
                country: "China"
            },
            summary: "Undergraduate  student at Duke Kunshan University",
            profiles: this.buildProfiles()
        };
    }

    // 构建社交账号信息
    buildProfiles() {
        const profilesSection = document.querySelector('.profiles');
        if (!profilesSection) return [];

        const profileItems = profilesSection.querySelectorAll('.profile-item');
        const profiles = [];

        profileItems.forEach(item => {
            const network = item.getAttribute('data-network');
            const username = item.getAttribute('data-username');
            const url = item.querySelector('a')?.href;

            if (network && username && url) {
                profiles.push({
                    network: network,
                    username: username,
                    url: url
                });
            }
        });

        return profiles;
    }

    // 构建工作经历
    buildWork(experienceItems) {
        if (!experienceItems) return [];

        return experienceItems.map(item => {
            const workItem = {
                name: this.extractOrganization(item.title),
                location: "Kunshan, China",
                position: this.extractPosition(item.title),
                startDate: this.extractStartDate(item.cleanDescription),
                endDate: this.extractEndDate(item.cleanDescription),
                summary: item.cleanDescription,
                highlights: this.extractHighlights(item.cleanDescription)
            };

            // 过滤空值
            Object.keys(workItem).forEach(key => {
                if (!workItem[key] || (Array.isArray(workItem[key]) && workItem[key].length === 0)) {
                    delete workItem[key];
                }
            });

            return workItem;
        });
    }

    // 构建教育背景
    buildEducation(educationItems) {
        if (!educationItems) return [];

        return educationItems.map(item => {
            const educationItem = {
                institution: this.extractInstitution(item.title),
                location: "Kunshan, China",
                studyType: "Bachelor of Science",
                area: "Computer Science",
                startDate: this.extractStartDate(item.cleanDescription),
                endDate: this.extractEndDate(item.cleanDescription),
                gpa: "3.82/4.0",
                courses: this.extractCourses(item.cleanDescription)
            };

            // 过滤空值
            Object.keys(educationItem).forEach(key => {
                if (!educationItem[key] || (Array.isArray(educationItem[key]) && educationItem[key].length === 0)) {
                    delete educationItem[key];
                }
            });

            return educationItem;
        });
    }

    // 构建技能
    buildSkills(skillsItems) {
        if (!skillsItems) return [];

        return skillsItems.map(item => {
            const skillItem = {
                name: item.title,
                keywords: this.extractKeywords(item.cleanDescription)
            };

            // 过滤空值
            if (!skillItem.keywords || skillItem.keywords.length === 0) {
                delete skillItem.keywords;
            }

            return skillItem;
        });
    }

    // 构建项目
    buildProjects(projectsItems) {
        if (!projectsItems) return [];

        return projectsItems.map(item => {
            const projectItem = {
                name: item.title,
                url: this.extractUrl(item.description),
                startDate: this.extractStartDate(item.cleanDescription),
                endDate: this.extractEndDate(item.cleanDescription),
                description: item.cleanDescription,
                highlights: this.extractHighlights(item.cleanDescription)
            };

            // 过滤空值
            Object.keys(projectItem).forEach(key => {
                if (!projectItem[key] || (Array.isArray(projectItem[key]) && projectItem[key].length === 0)) {
                    delete projectItem[key];
                }
            });

            return projectItem;
        });
    }

    // 构建奖项
    buildAwards(certificateItems) {
        if (!certificateItems) return [];

        return certificateItems
            .filter(item => item.title.toLowerCase().includes('award') || 
                           item.title.toLowerCase().includes('prize') ||
                           item.title.toLowerCase().includes('contest'))
            .map(item => ({
                title: item.title,
                date: this.extractDate(item.cleanDescription),
                awarder: this.extractAwarder(item.title),
                summary: item.cleanDescription
            }));
    }

    // 构建证书
    buildCertificates(certificateItems) {
        if (!certificateItems) return [];

        return certificateItems
            .filter(item => item.title.toLowerCase().includes('certificate') || 
                           item.title.toLowerCase().includes('certification') ||
                           item.title.toLowerCase().includes('qualification'))
            .map(item => ({
                name: item.title,
                date: this.extractDate(item.cleanDescription),
                issuer: this.extractIssuer(item.title)
            }));
    }

    // 构建语言能力
    buildLanguages() {
        return [
            { language: "English", fluency: "Fluent" },
            { language: "Chinese", fluency: "Native" }
        ];
    }

    // 构建兴趣爱好
    buildInterests() {
        return [
            { name: "Machine Learning" },
            { name: "Systems Programming" },
            { name: "Photography" }
        ];
    }

    // 辅助方法：提取组织名称
    extractOrganization(title) {
        if (title.includes('DKU')) return "Duke Kunshan University";
        if (title.includes('HRC')) return "Humanities Research Center";
        if (title.includes('SFMUN')) return "Sino-Foreign Model United Nations";
        if (title.includes('CEIBS')) return "China Europe International Business School";
        if (title.includes('U-Corp')) return "University Corporate Partnership";
        return title.split(' ')[0] + " " + (title.split(' ')[1] || "");
    }

    // 辅助方法：提取职位
    extractPosition(title) {
        if (title.includes('Core Member')) return "Core Member";
        if (title.includes('Volunteer')) return "Volunteer";
        if (title.includes('Contribution')) return "Contributor";
        if (title.includes('Project')) return "Project Participant";
        return "Participant";
    }

    // 辅助方法：提取机构名称
    extractInstitution(title) {
        if (title.includes('DKU')) return "Duke Kunshan University";
        if (title.includes('IELTS')) return "British Council";
        if (title.includes('Changzhou')) return "Changzhou Senior High School of Jiangsu Province";
        return title;
    }

    // 辅助方法：提取开始日期
    extractStartDate(description) {
        // 简化处理，返回默认日期
        if (description.includes('2022')) return "2022-08";
        if (description.includes('2023')) return "2023-09";
        if (description.includes('2024')) return "2024-06";
        if (description.includes('2025')) return "2025-01";
        return "2022-08";
    }

    // 辅助方法：提取结束日期
    extractEndDate(description) {
        // 简化处理，返回默认日期
        if (description.includes('2025')) return "2025-06";
        if (description.includes('2024')) return "2024-08";
        if (description.includes('2023')) return "2023-12";
        return "2026-05";
    }

    // 辅助方法：提取日期
    extractDate(description) {
        if (description.includes('2023')) return "2023-12";
        if (description.includes('2024')) return "2024-09";
        if (description.includes('2025')) return "2025-06";
        return "2024-12";
    }

    // 辅助方法：提取课程
    extractCourses(description) {
        const courses = [];
        if (description.includes('Calculus')) courses.push("Calculus");
        if (description.includes('English')) courses.push("English for Academic Purpose");
        if (description.includes('Video Games')) courses.push("Crafting Narrative in Video Games");
        if (description.includes('Data Structures')) courses.push("Data Structures and Algorithms");
        if (description.includes('Operating Systems')) courses.push("Operating Systems");
        if (description.includes('Database')) courses.push("Database Systems");
        if (description.includes('Machine Learning')) courses.push("Machine Learning");
        return courses;
    }

    // 辅助方法：提取关键词
    extractKeywords(description) {
        const keywords = [];
        const techKeywords = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'React', 
                             'Node.js', 'Express', 'Flask', 'Docker', 'Git', 'HTML', 'CSS',
                             'AutoHotkey', 'Markdown', 'Obsidian', 'MCP', 'REST API'];
        
        techKeywords.forEach(keyword => {
            if (description.includes(keyword)) {
                keywords.push(keyword);
            }
        });

        return keywords;
    }

    // 辅助方法：提取亮点
    extractHighlights(description) {
        const highlights = [];
        const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 10);
        
        sentences.forEach(sentence => {
            const trimmed = sentence.trim();
            if (trimmed.length > 20 && trimmed.length < 200) {
                highlights.push(trimmed);
            }
        });

        return highlights.slice(0, 3); // 最多返回3个亮点
    }

    // 辅助方法：提取URL
    extractUrl(description) {
        const urlMatch = description.match(/href="([^"]*)"/);
        return urlMatch ? urlMatch[1] : "";
    }

    // 辅助方法：提取颁发机构
    extractAwarder(title) {
        if (title.includes('Jiangsu')) return "Jiangsu Adolescents Science & Technology Association";
        if (title.includes('Biology')) return "China High School Biology Olympiad Committee";
        return "Duke Kunshan University";
    }

    // 辅助方法：提取颁发者
    extractIssuer(title) {
        if (title.includes('Mental Health')) return "Kunshan Red Cross Society";
        if (title.includes('First Aid')) return "Kunshan Red Cross Society";
        if (title.includes('CEIBS')) return "China Europe International Business School";
        return "Duke Kunshan University";
    }
}

// 导出单例
const jsonBuilder = new JSONBuilder();
