// Windows XP Word Resume Window
import { startTypingAnimation } from './word-typing.js';
import { initWordEasterEggs } from './word-easter-eggs.js';

let wordWindowOpen = false;
let resumeData = null;

export async function initWordWindow() {
    // Load resume data
    try {
        const response = await fetch('/data/resume-content.json');
        resumeData = await response.json();
    } catch (error) {
        console.error('Failed to load resume data:', error);
    }

    // Add click handler to Resume widget
    const resumeWidget = document.querySelector('.resume-widget');
    if (resumeWidget) {
        resumeWidget.addEventListener('click', openWordWindow);
        resumeWidget.addEventListener('dblclick', openWordWindow);
    }
}

function openWordWindow() {
    if (wordWindowOpen || !resumeData) return;

    wordWindowOpen = true;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const overlay = createWordOverlay();
    if (isMobile) {
        overlay.classList.add('word-mobile');
    }
    document.body.appendChild(overlay);

    // Small delay then start typing
    setTimeout(() => {
        const contentArea = overlay.querySelector('.word-document-content');
        startTypingAnimation(resumeData, contentArea, { instant: isMobile || prefersReducedMotion });
    }, 500);

    // Initialize easter eggs
    initWordEasterEggs(overlay);
}

function createWordOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'word-modal-overlay';
    overlay.innerHTML = `
        <div class="word-window">
            <!-- Title Bar -->
            <div class="word-titlebar">
                <div class="word-title">
                    <img class="word-icon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%232b579a' d='M2 2h12v12H2z'/%3E%3Cpath fill='white' d='M4 4l1.5 8h1.2l1.3-5 1.3 5h1.2L12 4h-1.5l-1 5.5L8.2 4H7.3L6 9.5 5 4z'/%3E%3C/svg%3E" alt="Word">
                    <span>Resume.doc - Microsoft Word</span>
                </div>
                <div class="word-controls">
                    <button class="word-btn word-minimize" title="Minimize">
                        <span>_</span>
                    </button>
                    <button class="word-btn word-maximize" title="Maximize">
                        <span>□</span>
                    </button>
                    <button class="word-btn word-close" title="Close">
                        <span>×</span>
                    </button>
                </div>
            </div>

            <!-- Menu Bar -->
            <div class="word-menubar">
                <span class="word-menu-item" data-menu="file">File</span>
                <span class="word-menu-item" data-menu="edit">Edit</span>
                <span class="word-menu-item" data-menu="view">View</span>
                <span class="word-menu-item" data-menu="insert">Insert</span>
                <span class="word-menu-item" data-menu="format">Format</span>
                <span class="word-menu-item" data-menu="tools">Tools</span>
                <span class="word-menu-item" data-menu="table">Table</span>
                <span class="word-menu-item" data-menu="window">Window</span>
                <span class="word-menu-item" data-menu="help">Help</span>
            </div>

            <!-- Toolbar -->
            <div class="word-toolbar">
                <div class="word-toolbar-row">
                    <button class="word-tool-btn" title="New"><span>📄</span></button>
                    <button class="word-tool-btn" title="Open"><span>📂</span></button>
                    <button class="word-tool-btn" title="Save"><span>💾</span></button>
                    <button class="word-tool-btn" title="Print"><span>🖨️</span></button>
                    <span class="word-separator"></span>
                    <button class="word-tool-btn" title="Cut"><span>✂️</span></button>
                    <button class="word-tool-btn" title="Copy"><span>📋</span></button>
                    <button class="word-tool-btn" title="Paste"><span>📌</span></button>
                    <span class="word-separator"></span>
                    <button class="word-tool-btn" title="Undo"><span>↶</span></button>
                    <button class="word-tool-btn" title="Redo"><span>↷</span></button>
                </div>
                <div class="word-toolbar-row">
                    <select class="word-font-select">
                        <option>Times New Roman</option>
                    </select>
                    <select class="word-size-select">
                        <option>12</option>
                    </select>
                    <button class="word-tool-btn" title="Bold" data-format="bold"><span><b>B</b></span></button>
                    <button class="word-tool-btn" title="Italic" data-format="italic"><span><i>I</i></span></button>
                    <button class="word-tool-btn" title="Underline" data-format="underline"><span><u>U</u></span></button>
                    <span class="word-separator"></span>
                    <button class="word-tool-btn" title="Align Left"><span>≡</span></button>
                    <button class="word-tool-btn" title="Align Center"><span>≣</span></button>
                    <button class="word-tool-btn" title="Align Right"><span>≢</span></button>
                    <button class="word-tool-btn" title="Bullets"><span>•</span></button>
                    <button class="word-tool-btn" title="Numbering"><span>1.</span></button>
                </div>
            </div>

            <!-- Document Area -->
            <div class="word-document">
                <div class="word-page">
                    <div class="word-document-content"></div>
                </div>
            </div>

            <!-- Status Bar -->
            <div class="word-statusbar">
                <span class="word-status-page">Page 1 of 2</span>
                <span class="word-status-pos">Ln 1, Col 1</span>
                <span class="word-status-words">0 words</span>
            </div>
        </div>
    `;

    // Close handlers
    const closeBtn = overlay.querySelector('.word-close');
    closeBtn.addEventListener('click', () => closeWordWindow(overlay));

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeWordWindow(overlay);
        }
    });

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape' && wordWindowOpen) {
            closeWordWindow(overlay);
            document.removeEventListener('keydown', escHandler);
        }
    });

    return overlay;
}

function closeWordWindow(overlay) {
    overlay.classList.add('closing');
    setTimeout(() => {
        overlay.remove();
        wordWindowOpen = false;
    }, 200);
}

// Export for status bar updates
export function updateStatusBar(page, line, col, words) {
    const pageEl = document.querySelector('.word-status-page');
    const posEl = document.querySelector('.word-status-pos');
    const wordsEl = document.querySelector('.word-status-words');

    if (pageEl) pageEl.textContent = `Page ${page} of 2`;
    if (posEl) posEl.textContent = `Ln ${line}, Col ${col}`;
    if (wordsEl) wordsEl.textContent = `${words} words`;
}
