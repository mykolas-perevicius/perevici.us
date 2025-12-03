// XP Window Project Typing Animation
// Makes projects type out character-by-character in Word 2003 style

let typingInProgress = false;

export async function startXPTypingAnimation() {
    if (typingInProgress) return;

    const projectCards = document.querySelectorAll('.xp-content .project-card');
    if (!projectCards.length) return;

    typingInProgress = true;

    // Type out each card with staggered start
    const typingPromises = [];
    projectCards.forEach((card, index) => {
        const delay = index * 300;
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
    await sleep(initialDelay);

    // Skip document cards (Resume.doc)
    if (card.dataset.document) return;

    // Store original HTML for restoration
    if (!card.dataset.originalHtml) {
        card.dataset.originalHtml = card.innerHTML;
    }

    // Extract content from card
    const content = extractProjectContent(card);

    // Build DOM structure with empty text containers
    const { container, targets } = createProjectElements();

    // Clear card and apply Word 2003 styling
    card.innerHTML = '';
    applyWordStyling(card);

    // Add the container
    card.appendChild(container);

    // Add blinking cursor
    const cursor = createCursor();
    card.appendChild(cursor);

    // Type each section in sequence
    await typeIntoElement(targets.header, content.header);
    await sleep(100); // Pause between sections

    await typeIntoElement(targets.description, content.description);
    await sleep(100);

    // Type stats
    for (const stat of content.stats) {
        const statSpan = document.createElement('span');
        statSpan.style.marginRight = '12px';
        targets.statsContainer.appendChild(statSpan);
        await typeIntoElement(statSpan, '• ' + stat);
    }
    await sleep(100);

    // Type tags
    if (content.tags.length > 0) {
        await typeIntoElement(targets.tagsText, content.tags.join(', '));
    }

    // Remove cursor when done
    cursor.remove();
}

function extractProjectContent(card) {
    const headerEl = card.querySelector('.project-header h3') || card.querySelector('h3');
    const header = headerEl?.textContent || '';
    const description = card.querySelector('.project-description')?.textContent?.trim() || '';
    const stats = Array.from(card.querySelectorAll('.project-stats .stat-item, .stat-item'))
        .map(el => el.textContent.trim())
        .filter(text => text.length > 0);
    const tags = Array.from(card.querySelectorAll('.tech-tags .tag, .tag'))
        .map(el => el.textContent.trim())
        .filter(t => t.length > 0 && !t.includes('Double-click'));

    return { header, description, stats, tags };
}

function createProjectElements() {
    const container = document.createElement('div');

    // Header (bold, larger)
    const header = document.createElement('div');
    header.style.fontSize = '13pt';
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '6px';
    container.appendChild(header);

    // Description
    const description = document.createElement('div');
    description.style.marginBottom = '8px';
    description.style.textAlign = 'justify';
    container.appendChild(description);

    // Stats container
    const statsContainer = document.createElement('div');
    statsContainer.style.marginBottom = '6px';
    statsContainer.style.fontSize = '10pt';
    statsContainer.style.color = '#666';
    container.appendChild(statsContainer);

    // Tags container
    const tagsContainer = document.createElement('div');
    tagsContainer.style.fontSize = '10pt';
    tagsContainer.style.color = '#0066cc';

    const tagsLabel = document.createElement('span');
    tagsLabel.style.fontWeight = 'bold';
    tagsLabel.textContent = 'Technologies: ';
    tagsContainer.appendChild(tagsLabel);

    const tagsText = document.createElement('span');
    tagsContainer.appendChild(tagsText);

    container.appendChild(tagsContainer);

    return {
        container,
        targets: {
            header,
            description,
            statsContainer,
            tagsText
        }
    };
}

function applyWordStyling(card) {
    card.classList.add('xp-typing-card');
    card.style.fontFamily = "'Times New Roman', serif";
    card.style.fontSize = '11pt';
    card.style.lineHeight = '1.5';
    card.style.color = '#000';
    card.style.background = '#fff';
    card.style.padding = '12px';
    card.style.border = '1px solid #ccc';
}

function createCursor() {
    const cursor = document.createElement('span');
    cursor.className = 'xp-typing-cursor';
    cursor.textContent = '|';
    cursor.style.animation = 'xpCursorBlink 1s step-end infinite';
    cursor.style.marginLeft = '2px';
    return cursor;
}

async function typeIntoElement(element, text) {
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        element.textContent += char;

        const delay = getTypingDelay(char);
        await sleep(delay);
    }
}

function getTypingDelay(char) {
    if (char === ' ') return 15;
    if (char === '\n') return 30;
    if (char === '.') return 40;
    if (char === ',') return 35;
    return 25;
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
