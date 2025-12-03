// XP Window Project Typing Animation
// Makes projects type out character-by-character in Word 2003 style

let typingInProgress = false;

export async function startXPTypingAnimation() {
    if (typingInProgress) return;

    const projectCards = document.querySelectorAll('.xp-content .project-card');
    if (!projectCards.length) return;

    typingInProgress = true;

    // Convert all project cards to typing format
    const typingPromises = [];
    projectCards.forEach((card, index) => {
        const delay = index * 300; // Stagger start times
        typingPromises.push(typeOutProjectCard(card, delay));
    });

    await Promise.all(typingPromises);
    typingInProgress = false;
}

// Restore original card HTML (for modern view)
export function restoreOriginalCards() {
    const projectCards = document.querySelectorAll('.xp-content .project-card');
    projectCards.forEach(card => {
        if (card.dataset.originalHtml) {
            card.innerHTML = card.dataset.originalHtml;
            card.classList.remove('xp-typing-card');
            card.style.cssText = '';
        }
    });
    typingInProgress = false;
}

async function typeOutProjectCard(card, initialDelay) {
    // Wait for stagger delay
    await sleep(initialDelay);

    // Skip document cards (Resume.doc)
    if (card.dataset.document) return;

    // Store original HTML for potential restoration
    if (!card.dataset.originalHtml) {
        card.dataset.originalHtml = card.innerHTML;
    }

    // Get all text content from the card
    const headerEl = card.querySelector('.project-header h3') || card.querySelector('h3');
    const header = headerEl?.textContent || '';
    const description = card.querySelector('.project-description')?.textContent?.trim() || '';
    const stats = Array.from(card.querySelectorAll('.project-stats .stat-item, .stat-item')).map(el => el.textContent.trim());
    const tags = Array.from(card.querySelectorAll('.tech-tags .tag, .tag')).map(el => el.textContent.trim()).filter(t => !t.includes('Double-click'));

    // Build HTML structure with Word 2003 styling
    const content = buildProjectHTML(header, description, stats, tags);

    // Clear the card and add Word-style container
    card.innerHTML = '';
    card.classList.add('xp-typing-card');
    card.style.fontFamily = "'Times New Roman', serif";
    card.style.fontSize = '11pt';
    card.style.lineHeight = '1.5';
    card.style.color = '#000';
    card.style.background = '#fff';
    card.style.padding = '12px';
    card.style.border = '1px solid #ccc';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'xp-typed-content';
    card.appendChild(contentDiv);

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'xp-typing-cursor';
    cursor.textContent = '|';
    cursor.style.animation = 'xpCursorBlink 1s step-end infinite';
    contentDiv.appendChild(cursor);

    // Type out the content
    await typeHTML(content, contentDiv, cursor);

    // Remove cursor when done
    cursor.remove();
}

function buildProjectHTML(header, description, stats, tags) {
    let html = '';

    // Header (bold, larger)
    html += `<div style="font-size: 13pt; font-weight: bold; margin-bottom: 6px;">${header}</div>\n\n`;

    // Description
    html += `<div style="margin-bottom: 8px; text-align: justify;">${description}</div>\n\n`;

    // Stats
    if (stats.length) {
        html += `<div style="margin-bottom: 6px; font-size: 10pt; color: #666;">`;
        stats.forEach(stat => {
            html += `<span style="margin-right: 12px;">• ${stat}</span>`;
        });
        html += `</div>\n\n`;
    }

    // Tags
    if (tags.length) {
        html += `<div style="font-size: 10pt; color: #0066cc;">`;
        html += `<span style="font-weight: bold;">Technologies:</span> `;
        html += tags.join(', ');
        html += `</div>`;
    }

    return html;
}

async function typeHTML(htmlContent, targetElement, cursor) {
    let position = 0;

    while (position < htmlContent.length) {
        const char = htmlContent[position];

        // Handle HTML tags - insert without typing effect
        if (char === '<') {
            const tagEnd = htmlContent.indexOf('>', position);
            if (tagEnd !== -1) {
                const tag = htmlContent.substring(position, tagEnd + 1);
                insertBeforeCursor(tag, targetElement, cursor);
                position = tagEnd + 1;
                await sleep(5);
                continue;
            }
        }

        // Type regular character
        insertBeforeCursor(char, targetElement, cursor);
        position++;

        // Variable speed
        const delay = getTypingDelay(char);
        await sleep(delay);
    }
}

function getTypingDelay(char) {
    if (char === ' ') return 15;
    if (char === '\n') return 30;
    if (char === '.') return 40;
    if (char === ',') return 35;
    return 25; // Faster than Word resume since multiple cards typing
}

function insertBeforeCursor(text, container, cursor) {
    const textNode = document.createTextNode(text);
    container.insertBefore(textNode, cursor);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Add cursor blink animation to page
if (!document.getElementById('xp-typing-styles')) {
    const style = document.createElement('style');
    style.id = 'xp-typing-styles';
    style.textContent = `
        @keyframes xpCursorBlink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        .xp-typing-card {
            transition: none !important;
        }

        [data-theme="dark"] .xp-typing-card {
            background: #ffffff !important;
            color: #000000 !important;
        }
    `;
    document.head.appendChild(style);
}
