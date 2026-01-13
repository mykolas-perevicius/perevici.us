// Windows XP Word Resume Window
import { startTypingAnimation } from './word-typing.js';
import { initWordEasterEggs } from './word-easter-eggs.js';

let wordWindowOpen = false;
let wordWindowOpening = false;
let resumeData = null;
let resumeLoadPromise = null;
let viewportHandler = null;
let viewportTarget = null;
let scrollPositionY = 0;

// Detect iOS Safari
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export async function initWordWindow() {
    // Warm the cache but don't block the UI
    loadResumeData();

    // Add click handler to Resume widget
    const resumeWidget = document.querySelector('.resume-widget');
    if (resumeWidget) {
        // Use both click and touchend for iOS Safari reliability
        resumeWidget.addEventListener('click', handleResumeClick);
        // For iOS Safari: touchend fires more reliably than click on some devices
        resumeWidget.addEventListener('touchend', handleResumeTouchEnd, { passive: false });
    }
}

function handleResumeClick(e) {
    // Prevent double-firing from touch + click
    if (e.target.dataset.touchHandled) {
        delete e.target.dataset.touchHandled;
        return;
    }
    openWordWindow();
}

function handleResumeTouchEnd(e) {
    // Mark as touch-handled to prevent click from also firing
    e.target.dataset.touchHandled = 'true';
    e.preventDefault();
    openWordWindow();
    // Clear the flag after a short delay
    setTimeout(() => delete e.target.dataset.touchHandled, 300);
}

async function loadResumeData() {
    if (resumeData) return resumeData;
    if (!resumeLoadPromise) {
        resumeLoadPromise = fetch('/data/resume-content.json')
            .then(response => response.json())
            .then((data) => {
                resumeData = data;
                return data;
            })
            .catch((error) => {
                console.error('Failed to load resume data:', error);
                resumeLoadPromise = null;
                return null;
            });
    }
    return resumeLoadPromise;
}

async function openWordWindow() {
    if (wordWindowOpen || wordWindowOpening) return;
    wordWindowOpening = true;
    const data = await loadResumeData();
    if (!data) {
        wordWindowOpening = false;
        return;
    }

    wordWindowOpen = true;
    wordWindowOpening = false;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const overlay = createWordOverlay();

    // Lock body scroll (especially important for iOS Safari)
    lockBodyScroll();

    if (isMobile) {
        overlay.classList.add('word-mobile');
        const updateViewport = () => {
            const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            document.documentElement.style.setProperty('--word-vh', `${height * 0.01}px`);
            overlay.style.setProperty('--word-vh', `${height * 0.01}px`);
        };
        updateViewport();
        viewportHandler = updateViewport;
        viewportTarget = overlay;
        window.addEventListener('resize', viewportHandler);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', viewportHandler);
        }

        // Prevent touchmove on overlay background (iOS Safari scroll lock)
        overlay.addEventListener('touchmove', handleOverlayTouchMove, { passive: false });
    }
    document.body.appendChild(overlay);

    // Small delay then start typing
    setTimeout(() => {
        const contentArea = overlay.querySelector('.word-document-content');
        startTypingAnimation(resumeData, contentArea, { instant: prefersReducedMotion });
    }, 500);

    // Initialize easter eggs
    initWordEasterEggs(overlay);
}

// iOS Safari scroll lock helpers
function lockBodyScroll() {
    scrollPositionY = window.scrollY;
    document.documentElement.style.setProperty('--window-inner-height', `${window.innerHeight}px`);
    document.documentElement.classList.add('word-modal-open');
    document.body.classList.add('word-modal-open');
}

function unlockBodyScroll() {
    document.documentElement.classList.remove('word-modal-open');
    document.body.classList.remove('word-modal-open');
    window.scrollTo(0, scrollPositionY);
}

function handleOverlayTouchMove(e) {
    // Allow scrolling inside the document content area
    const wordDocument = e.target.closest('.word-document');
    if (wordDocument) {
        // Allow scroll inside document
        return;
    }
    // Prevent scroll on overlay background
    e.preventDefault();
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
                    <span>Resume.doc - Microsoft Word 2003</span>
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

    // Close handlers with iOS Safari touch support
    const closeBtn = overlay.querySelector('.word-close');
    closeBtn.addEventListener('click', (e) => {
        if (!e.target.dataset.touchHandled) {
            closeWordWindow(overlay);
        }
        delete e.target.dataset.touchHandled;
    });
    closeBtn.addEventListener('touchend', (e) => {
        e.target.dataset.touchHandled = 'true';
        e.preventDefault();
        closeWordWindow(overlay);
        setTimeout(() => delete e.target.dataset.touchHandled, 300);
    }, { passive: false });

    // Close on overlay background tap/click
    const handleOverlayClose = (e) => {
        if (e.target === overlay) {
            closeWordWindow(overlay);
        }
    };
    overlay.addEventListener('click', handleOverlayClose);
    overlay.addEventListener('touchend', (e) => {
        if (e.target === overlay) {
            e.preventDefault();
            closeWordWindow(overlay);
        }
    }, { passive: false });

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape' && wordWindowOpen) {
            closeWordWindow(overlay);
            document.removeEventListener('keydown', escHandler);
        }
    });

    return overlay;
}

function closeWordWindow(overlay) {
    if (viewportHandler && viewportTarget === overlay) {
        window.removeEventListener('resize', viewportHandler);
        if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', viewportHandler);
        }
        viewportHandler = null;
        viewportTarget = null;
    }
    // Remove touchmove handler
    overlay.removeEventListener('touchmove', handleOverlayTouchMove);
    // Unlock body scroll
    unlockBodyScroll();
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
