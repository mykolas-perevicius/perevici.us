// Windows XP Window - Browser Controls & Interactivity
// Handles address bar filtering, navigation buttons, window management

import { initContextMenus } from './xp-context-menu.js';
import { initEasterEggs } from './xp-easter-eggs.js';
import { startXPTypingAnimation, restoreOriginalCards } from './xp-typing.js';

let filterHistory = [];
let historyIndex = -1;
let allProjects = [];
let isAnimating = false;

// View mode management (XP vs Modern)
let currentViewMode = 'xp'; // 'xp' or 'modern'

export function setViewMode(mode) {
    currentViewMode = mode;
    localStorage.setItem('projectViewMode', mode);
    updateViewDisplay();
}

function updateViewDisplay() {
    const xpWindow = document.querySelector('.xp-window');
    const modernGrid = document.querySelector('.modern-projects-grid');

    if (currentViewMode === 'xp') {
        // Fade out modern, fade in XP
        if (modernGrid) {
            modernGrid.classList.add('fade-out');
            setTimeout(() => {
                modernGrid.classList.add('hidden');
                modernGrid.classList.remove('fade-out');
            }, 300);
        }

        if (xpWindow) {
            xpWindow.classList.remove('hidden');
            xpWindow.classList.remove('minimized');
            // Force reflow then fade in
            xpWindow.offsetHeight;
            xpWindow.style.opacity = '1';
        }
    } else {
        // Fade out XP, fade in modern
        if (xpWindow) {
            xpWindow.classList.add('fade-out');
            setTimeout(() => {
                xpWindow.classList.add('hidden');
                xpWindow.classList.remove('fade-out');
            }, 300);
        }

        if (modernGrid) {
            modernGrid.classList.remove('hidden');
            // Force reflow then fade in
            modernGrid.offsetHeight;
            modernGrid.style.opacity = '1';
        }
    }
}

export function initXPWindow() {
    const xpWindow = document.querySelector('.xp-window');
    const addressInput = document.querySelector('.xp-address-input span');
    const goButton = document.querySelector('.xp-go-button');
    const minimizeBtn = document.querySelector('.xp-minimize');
    const maximizeBtn = document.querySelector('.xp-maximize');
    const closeBtn = document.querySelector('.xp-close');

    if (!xpWindow) {
        console.warn('XP window not found');
        return;
    }

    // Cache all projects
    cacheProjects();

    // Initialize with 'all' filter
    pushHistory('all');

    // Address bar editing
    if (addressInput) {
        addressInput.contentEditable = true;
        addressInput.addEventListener('keydown', handleAddressKeydown);
        addressInput.addEventListener('blur', () => {
            if (!addressInput.textContent.startsWith('https://perevici.us/projects/')) {
                addressInput.textContent = 'https://perevici.us/projects/' + getCurrentFilter();
            }
        });
    }

    // Go button
    if (goButton) {
        goButton.addEventListener('click', () => {
            const path = addressInput.textContent.replace('https://perevici.us/projects/', '');
            applyFilter(path);
        });
    }

    // Window controls
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            xpWindow.classList.toggle('minimized');
        });
    }

    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            xpWindow.classList.toggle('maximized');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Closing XP window switches to modern view
            setViewMode('modern');
        });
    }

    // Status bar updates
    updateStatusBar('Ready');

    // Enable double-click to spawn windows
    attachProjectCardHandlers();

    // Initialize context menus
    initContextMenus();

    // Initialize easter eggs
    initEasterEggs();

    // Load saved view mode preference (default to 'modern')
    const savedMode = localStorage.getItem('projectViewMode') || 'modern';
    currentViewMode = savedMode;

    // Create view toggle button
    createViewToggleButton();

    // Initial display setup (no animations on first load)
    initializeViewDisplay();

    // Start typing animation if in XP mode
    if (currentViewMode === 'xp') {
        // Small delay to let DOM settle
        setTimeout(() => {
            startXPTypingAnimation();
        }, 500);
    }
}

function initializeViewDisplay() {
    const xpWindow = document.querySelector('.xp-window');
    const modernGrid = document.querySelector('.modern-projects-grid');

    // Set initial visibility without animations
    if (currentViewMode === 'modern') {
        // Show modern, hide XP
        if (xpWindow) {
            xpWindow.classList.add('hidden');
        }
        if (modernGrid) {
            modernGrid.classList.remove('hidden');
        }
    } else {
        // Show XP, hide modern
        if (xpWindow) {
            xpWindow.classList.remove('hidden');
        }
        if (modernGrid) {
            modernGrid.classList.add('hidden');
        }
    }
}

function createViewToggleButton() {
    const section = document.getElementById('projects');
    if (!section) return;

    // Check if button already exists
    if (document.getElementById('viewModeToggle')) return;

    const toggleContainer = document.createElement('div');
    toggleContainer.id = 'viewModeToggle';
    toggleContainer.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 100;
    `;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'view-toggle-btn';
    toggleBtn.textContent = currentViewMode === 'xp' ? '📊 Modern View' : '🪟 XP View';
    toggleBtn.style.cssText = `
        background: var(--glass-bg);
        border: 2px solid var(--glass-border);
        backdrop-filter: blur(10px);
        padding: 8px 16px;
        border-radius: var(--radius-sm);
        color: var(--text);
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 6px 16px rgb(var(--shadow-rgb) / 0.2);
    `;

    toggleBtn.addEventListener('mouseenter', () => {
        toggleBtn.style.background = 'var(--glass-bg-strong)';
        toggleBtn.style.boxShadow = 'var(--glow-accent)';
        toggleBtn.style.transform = 'translateY(-2px)';
    });

    toggleBtn.addEventListener('mouseleave', () => {
        toggleBtn.style.background = 'var(--glass-bg)';
        toggleBtn.style.boxShadow = '0 6px 16px rgb(var(--shadow-rgb) / 0.2)';
        toggleBtn.style.transform = 'translateY(0)';
    });

    toggleBtn.addEventListener('click', () => {
        const newMode = currentViewMode === 'xp' ? 'modern' : 'xp';

        setViewMode(newMode);
        toggleBtn.textContent = newMode === 'xp' ? '📊 Modern View' : '🪟 XP View';

        // Start typing animation when switching to XP mode
        if (newMode === 'xp') {
            // First restore original cards
            restoreOriginalCards();
            setTimeout(() => {
                startXPTypingAnimation();
            }, 300);
        }
    });

    toggleContainer.appendChild(toggleBtn);

    // Insert at the beginning of the section
    const sectionContent = section.querySelector('.section-content');
    if (sectionContent) {
        sectionContent.style.position = 'relative';
        sectionContent.insertBefore(toggleContainer, sectionContent.firstChild);
    }
}

function cacheProjects() {
    allProjects = Array.from(document.querySelectorAll('.project-card'));
}

function handleAddressKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const path = e.target.textContent.replace('https://perevici.us/projects/', '');
        applyFilter(path);
        e.target.blur();
    }
}

function getCurrentFilter() {
    return filterHistory[historyIndex] || 'all';
}

function pushHistory(filter) {
    // Remove any forward history
    filterHistory = filterHistory.slice(0, historyIndex + 1);
    filterHistory.push(filter);
    historyIndex = filterHistory.length - 1;
}

function applyFilter(filter, addToHistory = true) {
    if (isAnimating) return;

    const validFilters = ['all', 'frontend', 'backend', 'gpu', 'fullstack'];
    if (!validFilters.includes(filter)) {
        showError(`The address is not valid: /projects/${filter}`);
        return;
    }

    if (addToHistory) {
        pushHistory(filter);
    }

    // Update address bar
    const addressInput = document.querySelector('.xp-address-input span');
    if (addressInput) {
        addressInput.textContent = 'https://perevici.us/projects/' + filter;
    }

    // Show loading
    showLoadingState();

    // Filter projects after delay (fake loading)
    setTimeout(() => {
        filterProjects(filter);
        updateStatusBar(`${getVisibleProjectCount()} projects found`);
        hideLoadingState();
    }, 600);
}

function filterProjects(filter) {
    allProjects.forEach(card => {
        if (filter === 'all') {
            card.classList.remove('hidden');
            return;
        }

        // Check tags for filter match
        const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase());
        const techTags = Array.from(card.querySelectorAll('.tech-tags .tag')).map(t => t.textContent.toLowerCase());
        const allTags = [...tags, ...techTags];

        const matches = allTags.some(tag => {
            if (filter === 'frontend') return ['react', 'javascript', 'typescript', 'html', 'css', 'paper.js', 'howler.js'].includes(tag);
            if (filter === 'backend') return ['django', 'python', 'postgresql', 'spring boot', 'java', 'node.js'].includes(tag);
            if (filter === 'gpu') return ['cuda', 'pytorch', 'mpi', 'c++'].includes(tag);
            if (filter === 'fullstack') return ['django', 'react', '.net', 'node.js', 'docker'].includes(tag);
            return false;
        });

        card.classList.toggle('hidden', !matches);
    });
}

function getVisibleProjectCount() {
    return allProjects.filter(card => !card.classList.contains('hidden')).length;
}

function showLoadingState() {
    isAnimating = true;
    updateStatusBar('Loading projects...');
    showProgressBar();
}

function hideLoadingState() {
    isAnimating = false;
    hideProgressBar();
}

function showProgressBar() {
    const statusBar = document.querySelector('.xp-status');
    if (!statusBar) return;

    let progress = document.querySelector('.xp-progress');
    if (!progress) {
        progress = document.createElement('div');
        progress.className = 'xp-progress';
        progress.innerHTML = '<div class="xp-progress-bar"></div>';
        statusBar.appendChild(progress);
    }

    const bar = progress.querySelector('.xp-progress-bar');
    bar.style.width = '0%';

    setTimeout(() => {
        bar.style.width = '100%';
    }, 50);
}

function hideProgressBar() {
    const progress = document.querySelector('.xp-progress');
    if (progress) {
        setTimeout(() => {
            progress.remove();
        }, 200);
    }
}

function updateStatusBar(text) {
    const statusText = document.querySelector('.xp-status-text');
    if (statusText) {
        statusText.textContent = text;
    }
}

function showError(message) {
    alert(`Internet Explorer\n\n${message}\n\nPlease check the address and try again.`);
}

// Multi-window spawning functionality
let openWindows = [];
let nextZIndex = 1000;

export function spawnProjectWindow(projectCard) {
    if (openWindows.length >= 3) {
        alert('Maximum number of windows reached (3)');
        return;
    }

    const title = projectCard.querySelector('h3').textContent;
    const description = projectCard.querySelector('.project-description').textContent;
    const links = Array.from(projectCard.querySelectorAll('.project-links a'));
    const tags = Array.from(projectCard.querySelectorAll('.tech-tags .tag')).map(t => t.textContent);

    const windowEl = createProjectWindow(title, description, links, tags);
    document.body.appendChild(windowEl);

    makeWindowDraggable(windowEl);
    bringToFront(windowEl);

    openWindows.push(windowEl);
}

function createProjectWindow(title, description, links, tags) {
    const win = document.createElement('div');
    win.className = 'xp-child-window';
    win.style.cssText = `
        position: fixed;
        top: ${100 + openWindows.length * 40}px;
        left: ${200 + openWindows.length * 40}px;
        width: 500px;
        z-index: ${nextZIndex++};
    `;

    win.innerHTML = `
        <div class="xp-titlebar">
            <div class="xp-title">
                <img class="xp-icon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23003f80' d='M0 0h7v7H0zm9 0h7v7H9zM0 9h7v7H0zm9 0h7v7H9z'/%3E%3C/svg%3E" alt="">
                <span>Internet Explorer - ${title}</span>
            </div>
            <div class="xp-controls">
                <button class="xp-btn xp-close" aria-label="Close">
                    <span>×</span>
                </button>
            </div>
        </div>
        <div class="xp-content">
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="project-links-detail">
                ${links.map(link => `<a href="${link.href}" target="_blank">${link.textContent}</a>`).join('')}
            </div>
            <div class="tech-tags">
                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;

    // Close button
    const closeBtn = win.querySelector('.xp-close');
    closeBtn.addEventListener('click', () => {
        win.remove();
        openWindows = openWindows.filter(w => w !== win);
    });

    return win;
}

function makeWindowDraggable(windowEl) {
    const titleBar = windowEl.querySelector('.xp-titlebar');
    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    titleBar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.xp-btn')) return;

        isDragging = true;
        initialX = e.clientX - windowEl.offsetLeft;
        initialY = e.clientY - windowEl.offsetTop;
        titleBar.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        windowEl.style.left = currentX + 'px';
        windowEl.style.top = currentY + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'move';
    });

    windowEl.addEventListener('mousedown', () => {
        bringToFront(windowEl);
    });
}

function bringToFront(windowEl) {
    windowEl.style.zIndex = nextZIndex++;
}

// Attach to project cards
export function attachProjectCardHandlers() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('dblclick', () => {
            spawnProjectWindow(card);
        });
    });
}

// Add CSS for spin animation
const style = document.createElement('style');
style.textContent = `
/* Status bar */
.xp-status {
    background: linear-gradient(180deg, #f5f4f2 0%, #e9e6de 100%);
    border-top: 1px solid #919b9c;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'Tahoma', var(--font-sans);
    font-size: 11px;
    color: #000000;
    min-height: 22px;
}

.xp-status-text {
    flex: 1;
}

/* Progress bar */
.xp-progress {
    width: 200px;
    height: 16px;
    border: 1px solid #7f9db9;
    background: #ffffff;
    position: relative;
}

.xp-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #00ff00 0%, #00cc00 100%);
    transition: width 0.6s ease;
    width: 0%;
}

/* Maximized state */
.xp-window.maximized {
    position: fixed;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    margin: 0;
    z-index: 999;
}

.xp-window.maximized .projects-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* Child XP Windows */
.xp-child-window {
    background: #ece9d8;
    border: 3px solid;
    border-color: #ffffff #888888 #888888 #ffffff;
    border-radius: 8px 8px 0 0;
    box-shadow:
        0 0 0 1px #0054e3,
        0 4px 24px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.xp-child-window .xp-titlebar {
    cursor: move;
}

.xp-child-window .xp-content {
    background: #ffffff;
    padding: 16px;
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
}

.xp-child-window h3 {
    margin-top: 0;
    color: #000000;
}

.xp-child-window p {
    color: #000000;
    margin-bottom: 16px;
}

.project-links-detail {
    margin: 16px 0;
}

.project-links-detail a {
    display: inline-block;
    margin-right: 12px;
    color: #0000ee;
    text-decoration: underline;
}

.project-links-detail a:visited {
    color: #551a8b;
}
`;
document.head.appendChild(style);
