// Word Typing Animation Engine
import { updateStatusBar } from './word-window.js';

let typingInProgress = false;

export function startTypingAnimation(resumeData, targetElement, options = {}) {
    if (typingInProgress) return;

    typingInProgress = true;
    const engine = new TypingEngine(resumeData, targetElement, options);
    engine.start();
}

class TypingEngine {
    constructor(resumeData, targetElement, options = {}) {
        this.data = resumeData;
        this.target = targetElement;
        this.line = 1;
        this.col = 1;
        this.wordCount = 0;
        this.isTyping = true;
        this.currentElement = null;
        this.instant = Boolean(options.instant);

        // Add cursor
        this.cursor = document.createElement('span');
        this.cursor.className = 'word-cursor';
        this.cursor.textContent = '|';
    }

    async start() {
        // Type header section
        await this.typeHeader();

        if (this.data.summary) {
            await this.typeSection('PROFESSIONAL SUMMARY', this.data.summary, { justify: true });
        }

        if (this.data.education) {
            await this.typeEducation();
        }

        if (Array.isArray(this.data.experience) && this.data.experience.length) {
            await this.typeSectionTitle('EXPERIENCE');
            for (const exp of this.data.experience) {
                await this.typeExperience(exp);
            }
        }

        if (Array.isArray(this.data.projects) && this.data.projects.length) {
            await this.typeSectionTitle('TECHNICAL PROJECTS');
            for (const project of this.data.projects) {
                await this.typeProject(project);
            }
        }

        if (this.data.skills && Object.keys(this.data.skills).length) {
            await this.typeSectionTitle('SKILLS');
            for (const [category, items] of Object.entries(this.data.skills)) {
                await this.typeSkillCategory(category, items);
            }
        }

        if (!this.instant) {
            this.cursor.remove();
        }
        typingInProgress = false;
    }

    async typeHeader() {
        // Create centered header container
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'text-align: center; margin-bottom: 12px;';
        this.target.appendChild(headerDiv);

        // Name (bold, larger)
        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = 'font-size: 14pt; font-weight: bold; margin-bottom: 4px;';
        headerDiv.appendChild(nameDiv);
        await this.typeIntoElement(nameDiv, this.data.header.name);

        const contactLines = Array.isArray(this.data.header.contactLines) && this.data.header.contactLines.length
            ? this.data.header.contactLines
            : [this.data.header.contact].filter(Boolean);
        for (const line of contactLines) {
            const contactDiv = document.createElement('div');
            contactDiv.style.cssText = 'font-size: 10pt; color: #333;';
            headerDiv.appendChild(contactDiv);
            const lineText = Array.isArray(line) ? line.join(' | ') : line;
            await this.typeIntoElement(contactDiv, lineText);
        }

        if (!this.instant) {
            await this.sleep(150);
        }
    }

    async typeSectionTitle(title) {
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = 'font-weight: bold; font-size: 11pt; margin: 16px 0 6px 0; border-bottom: 1px solid #000; padding-bottom: 2px;';
        this.target.appendChild(titleDiv);
        await this.typeIntoElement(titleDiv, title);
    }

    async typeSection(title, content, options = {}) {
        await this.typeSectionTitle(title);

        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = `margin-bottom: 12px; ${options.justify ? 'text-align: justify;' : ''}`;
        this.target.appendChild(contentDiv);
        await this.typeIntoElement(contentDiv, content);
    }

    async typeExperience(exp) {
        const expDiv = document.createElement('div');
        expDiv.style.cssText = 'margin-bottom: 12px;';
        this.target.appendChild(expDiv);

        // Title and company line
        const titleLine = document.createElement('div');
        titleLine.style.cssText = 'margin-bottom: 4px;';
        expDiv.appendChild(titleLine);

        const titleSpan = document.createElement('span');
        titleSpan.style.fontWeight = 'bold';
        titleLine.appendChild(titleSpan);
        await this.typeIntoElement(titleSpan, exp.title);

        await this.typeIntoElement(titleLine, ` | ${exp.company} | ${exp.dates}`);

        // Bullets
        const ul = document.createElement('ul');
        ul.style.cssText = 'margin: 4px 0; padding-left: 20px;';
        expDiv.appendChild(ul);

        for (const bullet of exp.bullets) {
            const li = document.createElement('li');
            li.style.marginBottom = '3px';
            ul.appendChild(li);
            await this.typeIntoElement(li, bullet);
        }
    }

    async typeSkillCategory(category, items) {
        const skillDiv = document.createElement('div');
        skillDiv.style.cssText = 'margin-bottom: 4px;';
        this.target.appendChild(skillDiv);

        const categorySpan = document.createElement('span');
        categorySpan.style.fontWeight = 'bold';
        skillDiv.appendChild(categorySpan);
        await this.typeIntoElement(categorySpan, category + ':');

        await this.typeIntoElement(skillDiv, ' ' + items.join(', '));
    }

    async typeEducation() {
        await this.typeSectionTitle('EDUCATION');

        const eduDiv = document.createElement('div');
        eduDiv.style.cssText = 'margin-bottom: 12px;';
        this.target.appendChild(eduDiv);

        // School name and dates
        const schoolDiv = document.createElement('div');
        schoolDiv.style.marginBottom = '2px';
        eduDiv.appendChild(schoolDiv);

        const schoolSpan = document.createElement('span');
        schoolSpan.style.fontWeight = 'bold';
        schoolDiv.appendChild(schoolSpan);
        await this.typeIntoElement(schoolSpan, this.data.education.school);
        if (this.data.education.dates) {
            await this.typeIntoElement(schoolDiv, ` | ${this.data.education.dates}`);
        }

        // Degree line
        const degreeDiv = document.createElement('div');
        degreeDiv.style.marginBottom = '2px';
        eduDiv.appendChild(degreeDiv);
        await this.typeIntoElement(degreeDiv, this.data.education.degree);

        // Coursework
        if (this.data.education.graduateCoursework) {
            const gradDiv = document.createElement('div');
            gradDiv.style.marginBottom = '2px';
            eduDiv.appendChild(gradDiv);
            const gradLabel = document.createElement('span');
            gradLabel.style.fontWeight = 'bold';
            gradDiv.appendChild(gradLabel);
            await this.typeIntoElement(gradLabel, 'Graduate Coursework:');
            await this.typeIntoElement(gradDiv, ' ' + this.data.education.graduateCoursework);
        }

        if (this.data.education.coreCoursework) {
            const coreDiv = document.createElement('div');
            eduDiv.appendChild(coreDiv);
            const coreLabel = document.createElement('span');
            coreLabel.style.fontWeight = 'bold';
            coreDiv.appendChild(coreLabel);
            await this.typeIntoElement(coreLabel, 'Core CS:');
            await this.typeIntoElement(coreDiv, ' ' + this.data.education.coreCoursework);
        }
    }

    async typeProject(project) {
        const projectDiv = document.createElement('div');
        projectDiv.style.cssText = 'margin-bottom: 6px;';
        this.target.appendChild(projectDiv);

        const headerLine = document.createElement('div');
        headerLine.style.marginBottom = '2px';
        projectDiv.appendChild(headerLine);

        const nameSpan = document.createElement('span');
        nameSpan.style.fontWeight = 'bold';
        headerLine.appendChild(nameSpan);
        await this.typeIntoElement(nameSpan, project.name);

        if (project.tech) {
            await this.typeIntoElement(headerLine, ` | ${project.tech}`);
        }

        if (project.link && project.link.trim().length > 0) {
            await this.typeIntoElement(headerLine, ` | ${project.link}`);
        }

        if (Array.isArray(project.bullets)) {
            const ul = document.createElement('ul');
            ul.style.cssText = 'margin: 4px 0; padding-left: 20px;';
            projectDiv.appendChild(ul);
            for (const bullet of project.bullets) {
                const li = document.createElement('li');
                li.style.marginBottom = '3px';
                ul.appendChild(li);
                await this.typeIntoElement(li, bullet);
            }
        }

    }

    async typeIntoElement(element, text) {
        this.currentElement = element;
        if (!this.instant) {
            element.appendChild(this.cursor);
        }
 
        if (this.instant) {
            element.textContent = text;
            this.wordCount += text.trim() ? text.trim().split(/\s+/).length : 0;
            updateStatusBar(1, this.line, this.col, this.wordCount);
            return;
        }

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // Insert character before cursor
            const textNode = document.createTextNode(char);
            element.insertBefore(textNode, this.cursor);

            // Update tracking
            if (char === ' ') {
                this.wordCount++;
                this.col++;
                if (this.wordCount % 10 === 0) {
                    updateStatusBar(1, this.line, this.col, this.wordCount);
                }
            } else if (char === '\n') {
                this.line++;
                this.col = 1;
            } else {
                this.col++;
            }

            const delay = this.getDelay(char);
            await this.sleep(delay);
        }

        // Remove cursor from this element (will be added to next)
        this.cursor.remove();
    }

    getDelay(char) {
        if (this.instant) return 0;
        if (char === ' ') return 15;
        if (char === ',') return 40;
        if (char === '.') return 60;
        if (char === ':' || char === ';') return 50;
        return 25;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
