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
    let modernGrid = document.querySelector('.modern-projects-grid');

    // Create modern grid if it doesn't exist
    if (!modernGrid) {
        modernGrid = createModernGrid();
    }

    if (currentViewMode === 'xp') {
        // Fade out modern, fade in XP
        if (modernGrid) {
            modernGrid.classList.add('fade-out');
            setTimeout(() => {
                modernGrid.style.display = 'none';
                modernGrid.classList.remove('fade-out');
            }, 300);
        }

        if (xpWindow) {
            xpWindow.style.display = '';
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
                xpWindow.style.display = 'none';
                xpWindow.classList.remove('fade-out');
            }, 300);
        }

        if (modernGrid) {
            modernGrid.style.display = '';
            // Force reflow then fade in
            modernGrid.offsetHeight;
            modernGrid.style.opacity = '1';
        }
    }
}

function createModernGrid() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return null;

    const sectionContent = projectsSection.querySelector('.section-content');
    if (!sectionContent) return null;

    // Clone the project cards from XP window
    const xpGrid = document.querySelector('.xp-content .projects-grid');
    if (!xpGrid) return null;

    const modernContainer = document.createElement('div');
    modernContainer.className = 'modern-projects-grid';
    modernContainer.style.display = 'none'; // Hidden by default

    // Clone the grid
    const clonedGrid = xpGrid.cloneNode(true);

    // Restore original HTML in cloned cards and remove XP styling
    const cards = clonedGrid.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        // Get corresponding original card from XP window
        const originalCard = xpGrid.querySelectorAll('.project-card')[index];
        if (originalCard && originalCard.dataset.originalHtml) {
            card.innerHTML = originalCard.dataset.originalHtml;
        }

        // Remove XP-specific classes and inline styles
        card.classList.remove('xp-typing-card');
        card.style.cssText = '';
        delete card.dataset.originalHtml;
    });

    modernContainer.appendChild(clonedGrid);

    // Insert after XP window
    const xpWindow = projectsSection.querySelector('.xp-window');
    if (xpWindow && xpWindow.parentNode) {
        xpWindow.parentNode.insertBefore(modernContainer, xpWindow.nextSibling);
    } else {
        sectionContent.appendChild(modernContainer);
    }

    return modernContainer;
}

export function initXPWindow() {
    const xpWindow = document.querySelector('.xp-window');
    const addressInput = document.querySelector('.xp-address-input span');
    const goButton = document.querySelector('.xp-go-button');
    const backButton = document.querySelector('.xp-btn-back');
    const forwardButton = document.querySelector('.xp-btn-forward');
    const refreshButton = document.querySelector('.xp-btn-refresh');
    const stopButton = document.querySelector('.xp-btn-stop');
    const homeButton = document.querySelector('.xp-btn-home');
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

    // Navigation buttons
    if (backButton) {
        backButton.addEventListener('click', navigateBack);
        updateNavButtons();
    }

    if (forwardButton) {
        forwardButton.addEventListener('click', navigateForward);
    }

    if (refreshButton) {
        refreshButton.addEventListener('click', refreshProjects);
    }

    if (stopButton) {
        stopButton.addEventListener('click', toggleAnimations);
    }

    if (homeButton) {
        homeButton.addEventListener('click', () => applyFilter('all'));
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

    // Update display based on mode
    updateViewDisplay();

    // Start typing animation if in XP mode
    if (currentViewMode === 'xp') {
        // Small delay to let DOM settle
        setTimeout(() => {
            startXPTypingAnimation();
        }, 500);
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
        border-radius: 6px;
        color: var(--text);
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    toggleBtn.addEventListener('mouseenter', () => {
        toggleBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        toggleBtn.style.transform = 'translateY(-2px)';
    });

    toggleBtn.addEventListener('mouseleave', () => {
        toggleBtn.style.background = 'var(--glass-bg)';
        toggleBtn.style.transform = 'translateY(0)';
    });

    toggleBtn.addEventListener('click', () => {
        const newMode = currentViewMode === 'xp' ? 'modern' : 'xp';

        // If switching to modern, recreate modern grid with original HTML
        if (newMode === 'modern') {
            const existingModern = document.querySelector('.modern-projects-grid');
            if (existingModern) {
                existingModern.remove();
            }
            createModernGrid();
        }

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
    updateNavButtons();
}

function navigateBack() {
    if (historyIndex > 0) {
        historyIndex--;
        applyFilter(filterHistory[historyIndex], false);
        updateNavButtons();
    }
}

function navigateForward() {
    if (historyIndex < filterHistory.length - 1) {
        historyIndex++;
        applyFilter(filterHistory[historyIndex], false);
        updateNavButtons();
    }
}

function updateNavButtons() {
    const backButton = document.querySelector('.xp-btn-back');
    const forwardButton = document.querySelector('.xp-btn-forward');

    if (backButton) {
        backButton.disabled = historyIndex <= 0;
        backButton.style.opacity = historyIndex <= 0 ? '0.5' : '1';
    }

    if (forwardButton) {
        forwardButton.disabled = historyIndex >= filterHistory.length - 1;
        forwardButton.style.opacity = historyIndex >= filterHistory.length - 1 ? '0.5' : '1';
    }
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
            card.style.display = '';
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

        card.style.display = matches ? '' : 'none';
    });
}

function getVisibleProjectCount() {
    return allProjects.filter(card => card.style.display !== 'none').length;
}

function refreshProjects() {
    const refreshButton = document.querySelector('.xp-btn-refresh');
    if (refreshButton) {
        refreshButton.style.animation = 'spin 0.8s linear';
        setTimeout(() => {
            refreshButton.style.animation = '';
        }, 800);
    }

    updateStatusBar('Refreshing...');

    setTimeout(() => {
        // Shuffle visible projects
        const grid = document.querySelector('.projects-grid');
        const visible = allProjects.filter(card => card.style.display !== 'none');

        // Fisher-Yates shuffle
        for (let i = visible.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            grid.appendChild(visible[j]);
        }

        updateStatusBar('Done');
        setTimeout(() => updateStatusBar('Ready'), 1000);
    }, 800);
}

function toggleAnimations() {
    const stopButton = document.querySelector('.xp-btn-stop');
    const allAnimated = document.querySelectorAll('*');

    if (stopButton.classList.contains('active')) {
        // Resume animations
        allAnimated.forEach(el => {
            el.style.animationPlayState = 'running';
            el.style.transitionDuration = '';
        });
        stopButton.classList.remove('active');
        updateStatusBar('Ready');
    } else {
        // Pause animations
        allAnimated.forEach(el => {
            el.style.animationPlayState = 'paused';
            el.style.transitionDuration = '0s';
        });
        stopButton.classList.add('active');
        updateStatusBar('Stopped');
    }
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
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Toolbar button styles */
.xp-toolbar-buttons {
    display: flex;
    gap: 2px;
    padding: 2px 0;
}

.xp-btn-back,
.xp-btn-forward,
.xp-btn-refresh,
.xp-btn-stop,
.xp-btn-home {
    width: 24px;
    height: 22px;
    border: 1px solid;
    background: linear-gradient(180deg, #f1f0e9 0%, #dddad1 85%, #bdb8ae 100%);
    border-color: #ffffff #888888 #888888 #ffffff;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Tahoma', var(--font-sans);
    color: #000000;
}

.xp-btn-back:hover,
.xp-btn-forward:hover,
.xp-btn-refresh:hover,
.xp-btn-stop:hover,
.xp-btn-home:hover {
    background: linear-gradient(180deg, #fefffe 0%, #e9e6de 85%, #c9c5bd 100%);
}

.xp-btn-back:active,
.xp-btn-forward:active,
.xp-btn-refresh:active,
.xp-btn-stop:active,
.xp-btn-home:active {
    background: linear-gradient(180deg, #c5c2b8 0%, #e4e1d8 100%);
    border-color: #888888 #ffffff #ffffff #888888;
}

.xp-btn-back:disabled,
.xp-btn-forward:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.xp-btn-stop.active {
    background: linear-gradient(180deg, #c5c2b8 0%, #e4e1d8 100%);
    border-color: #888888 #ffffff #ffffff #888888;
}

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