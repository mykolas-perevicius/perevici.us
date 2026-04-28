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

        this.cursor = document.createElement('span');
        this.cursor.className = 'word-cursor';
        this.cursor.textContent = '|';
    }

    async start() {
        await this.typeHeader();

        if (this.data.education) {
            await this.typeEducation();
        }

        if (Array.isArray(this.data.experience) && this.data.experience.length) {
            await this.typeSectionTitle('Experience');
            for (const exp of this.data.experience) {
                await this.typeExperience(exp);
            }
        }

        if (Array.isArray(this.data.projects) && this.data.projects.length) {
            await this.typeSectionTitle('Projects');
            for (const project of this.data.projects) {
                await this.typeProject(project);
            }
        }

        if (!this.instant) {
            this.cursor.remove();
        }
        typingInProgress = false;
    }

    async typeHeader() {
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'text-align: center; margin-bottom: 12px;';
        this.target.appendChild(headerDiv);

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
            await this.typeContactLine(contactDiv, line);
        }

        if (!this.instant) {
            await this.sleep(150);
        }
    }

    async typeContactLine(contactDiv, line) {
        if (!Array.isArray(line)) {
            await this.typeIntoElement(contactDiv, line);
            return;
        }
        for (let i = 0; i < line.length; i++) {
            if (i > 0) await this.typeIntoElement(contactDiv, ' | ');
            const token = line[i];
            if (token && typeof token === 'object' && token.href) {
                const anchor = this.createHyperlink(token.href);
                contactDiv.appendChild(anchor);
                await this.typeIntoElement(anchor, token.text || token.href);
            } else {
                await this.typeIntoElement(contactDiv, String(token));
            }
        }
    }

    createHyperlink(href) {
        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.style.color = '#0066cc';
        anchor.style.textDecoration = 'underline';
        return anchor;
    }

    async typeSectionTitle(title) {
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = 'font-weight: bold; font-size: 12pt; margin: 16px 0 6px 0; border-bottom: 1px solid #000; padding-bottom: 2px;';
        this.target.appendChild(titleDiv);
        await this.typeIntoElement(titleDiv, title);
    }

    async typeEducation() {
        await this.typeSectionTitle('Education');

        const eduDiv = document.createElement('div');
        eduDiv.style.cssText = 'margin-bottom: 12px;';
        this.target.appendChild(eduDiv);

        // School and dates on one line, separated by a space (per resume layout)
        const schoolDiv = document.createElement('div');
        schoolDiv.style.marginBottom = '2px';
        eduDiv.appendChild(schoolDiv);

        const schoolSpan = document.createElement('span');
        schoolSpan.style.fontWeight = 'bold';
        schoolDiv.appendChild(schoolSpan);
        await this.typeIntoElement(schoolSpan, this.data.education.school);
        if (this.data.education.dates) {
            await this.typeIntoElement(schoolDiv, ` ${this.data.education.dates}`);
        }

        const degreeDiv = document.createElement('div');
        degreeDiv.style.marginBottom = '2px';
        eduDiv.appendChild(degreeDiv);
        await this.typeIntoElement(degreeDiv, this.data.education.degree);

        if (this.data.education.coursework) {
            const courseDiv = document.createElement('div');
            eduDiv.appendChild(courseDiv);
            const courseLabel = document.createElement('span');
            courseLabel.style.fontWeight = 'bold';
            courseDiv.appendChild(courseLabel);
            await this.typeIntoElement(courseLabel, 'Coursework:');
            await this.typeIntoElement(courseDiv, ' ' + this.data.education.coursework);
        }
    }

    async typeExperience(exp) {
        const expDiv = document.createElement('div');
        expDiv.style.cssText = 'margin-bottom: 12px;';
        this.target.appendChild(expDiv);

        // Title (bold) | Company Dates  — single pipe between title and company, space before dates
        const titleLine = document.createElement('div');
        titleLine.style.cssText = 'margin-bottom: 4px;';
        expDiv.appendChild(titleLine);

        const titleSpan = document.createElement('span');
        titleSpan.style.fontWeight = 'bold';
        titleLine.appendChild(titleSpan);
        await this.typeIntoElement(titleSpan, exp.title);

        await this.typeIntoElement(titleLine, ` | ${exp.company} ${exp.dates}`);

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

    async typeProject(project) {
        const projectDiv = document.createElement('div');
        projectDiv.style.cssText = 'margin-bottom: 8px;';
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
            await this.typeIntoElement(headerLine, ' | ');
            if (project.linkUrl) {
                const anchor = this.createHyperlink(project.linkUrl);
                headerLine.appendChild(anchor);
                await this.typeIntoElement(anchor, project.link);
            } else {
                await this.typeIntoElement(headerLine, project.link);
            }
        }

        if (project.description) {
            const descDiv = document.createElement('div');
            descDiv.style.marginBottom = '2px';
            projectDiv.appendChild(descDiv);
            await this.typeIntoElement(descDiv, project.description);
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

            const textNode = document.createTextNode(char);
            element.insertBefore(textNode, this.cursor);

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
