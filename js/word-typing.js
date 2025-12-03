// Word Typing Animation Engine
import { updateStatusBar } from './word-window.js';

let typingInProgress = false;

export function startTypingAnimation(resumeData, targetElement) {
    if (typingInProgress) return;

    typingInProgress = true;
    const fullText = buildResumeHTML(resumeData);
    const engine = new TypingEngine(fullText, targetElement);
    engine.start();
}

class TypingEngine {
    constructor(htmlContent, targetElement) {
        this.content = htmlContent;
        this.target = targetElement;
        this.position = 0;
        this.line = 1;
        this.col = 1;
        this.wordCount = 0;
        this.isTyping = true;

        // Pre-generate typo positions (2-3 typos randomly placed)
        this.typos = this.generateTypoPositions();

        // Add cursor
        this.cursor = document.createElement('span');
        this.cursor.className = 'word-cursor';
        this.cursor.textContent = '|';
        this.target.appendChild(this.cursor);
    }

    generateTypoPositions() {
        const typoCount = 2 + Math.floor(Math.random() * 2); // 2-3 typos
        const typos = [];
        const contentLength = this.content.length;

        for (let i = 0; i < typoCount; i++) {
            // Place typos at random positions (not too early, not in last 20%)
            const pos = Math.floor(contentLength * 0.2 + Math.random() * contentLength * 0.6);
            typos.push(pos);
        }

        return typos.sort((a, b) => a - b);
    }

    getDelay(char, nextChar) {
        // Variable speed based on character type
        if (char === ' ') return 10;
        if (char === '\n') return 50;
        if (char === ',') return 80;
        if (char === '.') return 80;
        if (char === ':' || char === ';') return 80;

        // Letters and numbers
        return 80;
    }

    getPauseAfter(char) {
        // Pause after punctuation
        if (char === '.') return 300;
        if (char === ',') return 200;
        if (char === ':' || char === ';') return 150;
        return 0;
    }

    async start() {
        while (this.isTyping && this.position < this.content.length) {
            // Check for typo at this position
            if (this.typos.includes(this.position)) {
                await this.performTypo();
            } else {
                await this.typeCharacter();
            }
        }

        // Remove cursor when done
        this.cursor.remove();
        typingInProgress = false;
    }

    async typeCharacter() {
        const char = this.content[this.position];
        const nextChar = this.content[this.position + 1];

        // Handle HTML tags - insert without typing effect
        if (char === '<') {
            const tagEnd = this.content.indexOf('>', this.position);
            if (tagEnd !== -1) {
                const tag = this.content.substring(this.position, tagEnd + 1);
                this.insertAtCursor(tag);
                this.position = tagEnd + 1;
                await this.sleep(20);
                return;
            }
        }

        // Type regular character
        this.insertAtCursor(char);
        this.position++;

        // Update position tracking
        if (char === '\n') {
            this.line++;
            this.col = 1;
        } else if (char !== '<' && char !== '>') {
            this.col++;
        }

        // Update word count occasionally
        if (char === ' ' || char === '\n') {
            this.wordCount++;
            if (this.wordCount % 5 === 0) {
                updateStatusBar(1, this.line, this.col, this.wordCount);
            }
        }

        const delay = this.getDelay(char, nextChar);
        const pause = this.getPauseAfter(char);

        await this.sleep(delay + pause);
    }

    async performTypo() {
        const correctChar = this.content[this.position];
        const wrongChars = 'abcdefghijklmnopqrstuvwxyz';
        const wrongChar = wrongChars[Math.floor(Math.random() * wrongChars.length)];

        // Type wrong character
        this.insertAtCursor(wrongChar);
        await this.sleep(400);

        // Backspace
        const textNode = this.cursor.previousSibling;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = textNode.textContent.slice(0, -1);
        }
        await this.sleep(100);

        // Type correct character
        this.insertAtCursor(correctChar);
        this.position++;
        this.col++;

        await this.sleep(80);
    }

    insertAtCursor(text) {
        const textNode = document.createTextNode(text);
        this.target.insertBefore(textNode, this.cursor);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

function buildResumeHTML(data) {
    let html = '';

    // Header (centered, bold)
    html += `<div style="text-align: center; margin-bottom: 8px;">`;
    html += `<div style="font-size: 14pt; font-weight: bold;">${data.header.name}</div>`;
    html += `<div style="font-size: 10pt;">${data.header.contact.join(' | ')}</div>`;
    html += `</div>\n\n`;

    // Professional Summary
    html += `<div style="margin-bottom: 12px;">`;
    html += `<div style="font-weight: bold; font-size: 11pt; margin-bottom: 4px;">PROFESSIONAL SUMMARY</div>`;
    html += `<div style="text-align: justify;">${data.summary}</div>`;
    html += `</div>\n\n`;

    // Experience
    html += `<div style="margin-bottom: 12px;">`;
    html += `<div style="font-weight: bold; font-size: 11pt; margin-bottom: 4px;">EXPERIENCE</div>`;
    data.experience.forEach(exp => {
        html += `<div style="margin-bottom: 8px;">`;
        html += `<div><span style="font-weight: bold;">${exp.title}</span> | ${exp.company} | ${exp.dates}</div>`;
        html += `<ul style="margin: 4px 0; padding-left: 20px;">`;
        exp.bullets.forEach(bullet => {
            html += `<li style="margin-bottom: 2px;">${bullet}</li>`;
        });
        html += `</ul>`;
        html += `</div>`;
    });
    html += `</div>\n\n`;

    // Technical Skills
    html += `<div style="margin-bottom: 12px;">`;
    html += `<div style="font-weight: bold; font-size: 11pt; margin-bottom: 4px;">TECHNICAL SKILLS</div>`;
    Object.entries(data.skills).forEach(([category, items]) => {
        html += `<div style="margin-bottom: 2px;">`;
        html += `<span style="font-weight: bold;">${category}:</span> ${items.join(', ')}`;
        html += `</div>`;
    });
    html += `</div>\n\n`;

    // Education
    html += `<div style="margin-bottom: 12px;">`;
    html += `<div style="font-weight: bold; font-size: 11pt; margin-bottom: 4px;">EDUCATION</div>`;
    html += `<div><span style="font-weight: bold;">${data.education.school}</span> | ${data.education.location}</div>`;
    html += `<div>${data.education.degree} | ${data.education.graduation}</div>`;
    html += `<div>${data.education.gpa}</div>`;
    html += `<div style="margin-top: 2px;"><span style="font-weight: bold;">Relevant Coursework:</span> ${data.education.coursework}</div>`;
    html += `</div>\n\n`;

    // Projects
    html += `<div style="margin-bottom: 12px;">`;
    html += `<div style="font-weight: bold; font-size: 11pt; margin-bottom: 4px;">PROJECTS</div>`;
    data.projects.forEach(project => {
        html += `<div style="margin-bottom: 4px;">`;
        html += `<span style="font-weight: bold;">${project.name}</span> - ${project.description}`;
        html += `</div>`;
    });
    html += `</div>`;

    return html;
}
