// Word Window Easter Eggs
let clippyActive = false;

export function initWordEasterEggs(overlay) {
    // Menu item clicks
    const menuItems = overlay.querySelectorAll('.word-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => handleMenuClick(e.target.dataset.menu));
    });

    // Toolbar button clicks
    const formatBtns = overlay.querySelectorAll('[data-format]');
    formatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const format = e.currentTarget.dataset.format;
            handleFormatClick(format);
        });
    });

    // Other toolbar buttons
    const toolBtns = overlay.querySelectorAll('.word-tool-btn:not([data-format])');
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('title');
            handleToolbarClick(title);
        });
    });
}

function handleMenuClick(menu) {
    switch(menu) {
        case 'file':
            showFileMenu();
            break;
        case 'edit':
            showDialog('Edit', "You can't edit a resume this good!");
            break;
        case 'format':
            showFontDialog();
            break;
        case 'help':
            showHelpMenu();
            break;
        default:
            showDialog('Microsoft Word', `The ${menu.charAt(0).toUpperCase() + menu.slice(1)} menu is currently unavailable.`);
    }
}

function showFileMenu() {
    const dialog = createDialog('File Menu', `
        <div style="padding: 10px;">
            <button class="word-dialog-btn" onclick="this.closest('.word-dialog-overlay').remove(); alert('Feature coming soon! Check back later.');">📄 Download PDF</button>
            <button class="word-dialog-btn" onclick="this.closest('.word-dialog-overlay').remove(); alert('Feature coming soon! Check back later.');">📝 Download DOC</button>
            <button class="word-dialog-btn" onclick="window.print();">🖨️ Print</button>
            <button class="word-dialog-btn" onclick="document.querySelector('.word-close').click(); this.closest('.word-dialog-overlay').remove();">❌ Close</button>
        </div>
    `);
    document.body.appendChild(dialog);
}

function showFontDialog() {
    const dialog = createDialog('Font', `
        <div style="padding: 20px; text-align: center;">
            <p style="margin-bottom: 10px;">Choose a font:</p>
            <select style="padding: 5px; margin-bottom: 15px;">
                <option>Comic Sans MS</option>
                <option>Wingdings</option>
            </select>
            <br>
            <button class="word-dialog-btn" onclick="this.closest('.word-dialog-overlay').remove(); alert('Nice try.');">OK</button>
        </div>
    `);
    document.body.appendChild(dialog);
}

function showHelpMenu() {
    const options = [
        'It looks like you\'re trying to hire me. Would you like help with that?',
        'I see you\'re viewing a resume. Did you know I\'m available for interviews?',
        'Tip: This resume is best viewed with coffee and an open req.',
        'Looking for a full-stack engineer? You found one!',
        'Pro tip: Ctrl+H to hire immediately (just kidding, email me)'
    ];

    const choice = Math.random();

    if (choice < 0.5) {
        // Show Clippy
        showClippy();
    } else {
        // Show About dialog
        showAboutWord();
    }
}

function showClippy() {
    if (clippyActive) return;

    clippyActive = true;
    const messages = [
        'It looks like you\'re trying to hire me. Would you like help with that?',
        'I see you\'re viewing a resume. Did you know I\'m available for interviews?',
        'Tip: This resume is best viewed with coffee and an open req.',
        'Looking for a full-stack engineer? You found one!',
        'Pro tip: Email Perevicius.Mykolas@gmail.com to get started!'
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];

    const clippy = document.createElement('div');
    clippy.className = 'word-clippy';
    clippy.innerHTML = `
        <div class="word-clippy-character">📎</div>
        <div class="word-clippy-bubble">
            <div>${message}</div>
            <button onclick="this.closest('.word-clippy').remove(); window.clippyActive = false;">Got it</button>
        </div>
    `;

    document.body.appendChild(clippy);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
        if (clippy.parentNode) {
            clippy.remove();
            clippyActive = false;
        }
    }, 10000);
}

function showAboutWord() {
    showDialog('About Microsoft Word', `
        <div style="text-align: center; padding: 10px;">
            <div style="font-size: 32px; margin-bottom: 10px;">📘</div>
            <div style="font-weight: bold; margin-bottom: 5px;">Microsoft Word 2003</div>
            <div style="margin-bottom: 10px;">Build 11.0.5329</div>
            <div style="margin-bottom: 5px;">Licensed to: Mykolas Perevicius</div>
            <div style="font-size: 10px; color: #666;">This product is for portfolio demonstration purposes</div>
        </div>
    `);
}

function handleFormatClick(format) {
    const messages = {
        'bold': "Your resume is already bold enough!",
        'italic': "Let's not get carried away",
        'underline': "Underlining is so 2003... wait"
    };

    showDialog('Format', messages[format] || 'This formatting option is unavailable.');
}

function handleToolbarClick(title) {
    const responses = {
        'Cut': "You can't edit this document!",
        'Copy': "Copying my resume? I'm flattered!",
        'Paste': "Nothing to paste here.",
        'Undo': "There's nothing to undo - it's perfect as-is!",
        'Redo': "Can't improve on perfection.",
        'Print': null // Let browser print work
    };

    if (title === 'Print') {
        window.print();
        return;
    }

    const message = responses[title] || `${title} is not available in this view.`;
    showDialog('Microsoft Word', message);
}

function showDialog(title, content) {
    const dialog = createDialog(title, `
        <div style="padding: 20px; text-align: center;">
            ${content}
            <br><br>
            <button class="word-dialog-btn" onclick="this.closest('.word-dialog-overlay').remove();">OK</button>
        </div>
    `);
    document.body.appendChild(dialog);
}

function createDialog(title, content) {
    const overlay = document.createElement('div');
    overlay.className = 'word-dialog-overlay';
    overlay.innerHTML = `
        <div class="word-dialog">
            <div class="word-dialog-titlebar">
                <span>${title}</span>
                <button onclick="this.closest('.word-dialog-overlay').remove();">×</button>
            </div>
            <div class="word-dialog-content">
                ${content}
            </div>
        </div>
    `;

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    return overlay;
}

// Export for global access if needed
window.clippyActive = false;
