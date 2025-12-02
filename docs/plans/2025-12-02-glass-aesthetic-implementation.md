# Glass Aesthetic Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform portfolio into cohesive glass-themed experience with maximally-interactive Windows XP projects window

**Architecture:** Remove WebGL entirely, implement CSS-only glass effects site-wide, enhance XP window with working browser controls, multi-window spawning, context menus, and easter eggs. Add GitHub metrics visualization with weekly auto-updates.

**Tech Stack:** Vanilla JS (ES6 modules), CSS3 (backdrop-filter, grid, flexbox), GitHub Actions (cron), Chart.js (metrics)

---

## Phase 1: Remove WebGL & Fix Hero Name

### Task 1: Remove WebGL Code

**Files:**
- Delete: `js/hero-liquid-webgl.js`
- Delete: `js/fancy-mode.js`
- Modify: `js/main.js:7-8` (remove imports)
- Modify: `js/main.js:165-166` (remove init calls)
- Modify: `index.html:51-56` (remove fancy toggle)
- Modify: `css/components.css:183-272` (remove fancy toggle styles)

**Step 1: Remove WebGL module files**

```bash
cd ~/.config/superpowers/worktrees/perevici.us/glass-redesign
rm js/hero-liquid-webgl.js
rm js/fancy-mode.js
```

**Step 2: Remove imports from main.js**

Remove lines 7-8:
```javascript
import { initFancyMode } from './fancy-mode.js';
import { initXPWindow } from './xp-window.js';
```

Remove lines 165-166:
```javascript
initFancyMode();
initXPWindow();
```

**Step 3: Remove fancy toggle from HTML**

Remove from index.html lines 51-56:
```html
<div class="fancy-toggle">
    <label>
        <input type="checkbox" id="fancy-mode-toggle" aria-label="Toggle fancy mode">
        <span class="fancy-label">Fancy</span>
    </label>
</div>
```

**Step 4: Remove fancy toggle CSS**

Remove from css/components.css lines 183-272 (entire fancy toggle section)

**Step 5: Commit cleanup**

```bash
git add -A
git commit -m "Remove WebGL fancy mode and related code"
```

---

### Task 2: Implement Layered Hero Name

**Files:**
- Modify: `css/main.css:37-103`
- Modify: `index.html:64`

**Step 1: Update hero name CSS**

Replace css/main.css lines 37-103 with:

```css
.hero-name {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  letter-spacing: 0.02em;
  line-height: 1.1;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text), var(--primary-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow:
    0 0 40px rgba(0, 212, 255, 0.4),
    0 0 80px rgba(64, 224, 208, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.5),
    0 8px 16px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 0 30px rgba(0, 212, 255, 0.4))
          drop-shadow(0 4px 8px rgba(0, 212, 255, 0.2));
  animation: heroGlow 5s ease-in-out infinite;
  position: relative;
}

@keyframes heroGlow {
  0%, 100% {
    filter: drop-shadow(0 0 30px rgba(0, 212, 255, 0.4))
            drop-shadow(0 4px 8px rgba(0, 212, 255, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(0, 212, 255, 0.5))
            drop-shadow(0 6px 12px rgba(0, 212, 255, 0.3));
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-name {
    animation: none;
  }
}
```

**Step 2: Test visual appearance**

```bash
python3 -m http.server 8080
```

Open http://localhost:8080 and verify:
- Name appears on one line
- Has gradient color
- Has glowing effect
- Breathing animation works

**Step 3: Commit**

```bash
git add css/main.css
git commit -m "Implement layered CSS hero name effect

- Gradient text with clamp sizing
- Multi-layer shadow depth
- Breathing glow animation
- Respects reduced motion"
```

---

## Phase 2: Glass System Foundation

### Task 3: Add Glass CSS Variables

**Files:**
- Modify: `css/theme.css:2-27`

**Step 1: Add glass variables to :root**

Add to css/theme.css after line 17 (after --success):

```css
    /* Glass effect system */
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
    --glass-glow: rgba(0, 212, 255, 0.2);
    --glass-blur: 20px;
```

**Step 2: Add light theme glass overrides**

Add to css/theme.css in [data-theme="light"] block after line 38:

```css
    /* Glass effect adjustments for light mode */
    --glass-bg: rgba(0, 0, 0, 0.03);
    --glass-border: rgba(0, 0, 0, 0.08);
    --glass-glow: rgba(0, 212, 255, 0.15);
```

**Step 3: Test variable availability**

Open DevTools console and run:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--glass-bg')
```

Expected: "rgba(255, 255, 255, 0.05)"

**Step 4: Commit**

```bash
git add css/theme.css
git commit -m "Add CSS variables for glass effect system"
```

---

### Task 4: Apply Glass to Navigation

**Files:**
- Modify: `css/components.css:108-118`

**Step 1: Update nav-bar styles**

Replace css/components.css lines 108-118 with:

```css
.nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--glass-bg);
    backdrop-filter: blur(30px) saturate(150%);
    -webkit-backdrop-filter: blur(30px) saturate(150%);
    z-index: 1000;
    border-bottom: 1px solid var(--glass-border);
    box-shadow: 0 4px 12px var(--glass-glow);
    transition: all 0.3s ease;
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(30px)) {
    .nav-bar {
        background: rgba(10, 10, 10, 0.95);
    }
}

[data-theme="light"] .nav-bar {
    @supports not (backdrop-filter: blur(30px)) {
        background: rgba(250, 250, 250, 0.95);
    }
}
```

**Step 2: Test nav glass effect**

Open site and verify:
- Nav has frosted glass look
- Content shows through blur
- Border glow visible
- Works in light theme

**Step 3: Commit**

```bash
git add css/components.css
git commit -m "Apply glass effect to navigation bar"
```

---

### Task 5: Apply Glass to Cards

**Files:**
- Modify: `css/main.css:269-298` (project cards)
- Modify: `css/main.css:346-351` (skill categories)
- Modify: `css/main.css:399-406` (education card)

**Step 1: Update project card styles**

Replace css/main.css lines 269-298 with:

```css
.project-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(var(--glass-blur)) saturate(120%);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(120%);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px var(--glass-glow);
}

.project-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.project-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--primary-color);
    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.4);
    transform: translateY(-4px);
}

.project-card:hover::before {
    transform: scaleX(1);
}

/* Fallback for no backdrop-filter */
@supports not (backdrop-filter: blur(20px)) {
    .project-card {
        background: var(--bg-elev);
    }
}
```

**Step 2: Update skill category cards**

Replace css/main.css lines 346-351 with:

```css
.skill-category {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(var(--glass-blur)) saturate(120%);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(120%);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px var(--glass-glow);
    transition: all 0.3s ease;
}

.skill-category:hover {
    border-color: var(--primary-color);
    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
}

@supports not (backdrop-filter: blur(20px)) {
    .skill-category {
        background: var(--bg-elev);
    }
}
```

**Step 3: Update education card**

Replace css/main.css lines 399-406 with:

```css
.education-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(var(--glass-blur)) saturate(120%);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(120%);
    border-radius: 12px;
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    box-shadow: 0 4px 12px var(--glass-glow);
}

@supports not (backdrop-filter: blur(20px)) {
    .education-card {
        background: var(--bg-elev);
    }
}
```

**Step 4: Test all cards**

Scroll through site and verify:
- All cards have glass effect
- Hover states work
- No layout breaks
- Fallback works in Firefox

**Step 5: Commit**

```bash
git add css/main.css
git commit -m "Apply glass effects to all card components"
```

---

## Phase 3: XP Window Browser Controls

### Task 6: Create XP Window JS Module

**Files:**
- Create: `js/xp-window.js`
- Modify: `js/main.js:2` (add import)
- Modify: `js/main.js:162` (add init)

**Step 1: Create xp-window.js module**

Create js/xp-window.js:

```javascript
// Windows XP Window - Browser Controls & Interactivity
// Handles address bar filtering, navigation buttons, window management

let filterHistory = [];
let historyIndex = -1;
let allProjects = [];
let isAnimating = false;

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
            if (confirm('Are you sure you want to close this window?')) {
                xpWindow.classList.add('minimized');
            }
        });
    }

    // Status bar updates
    updateStatusBar('Ready');
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

// Add CSS for spin animation
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
```

**Step 2: Add toolbar buttons to HTML**

Modify index.html XP toolbar section (after address bar, before closing toolbar div):

```html
<div class="xp-toolbar-buttons">
    <button class="xp-btn-back" aria-label="Back">◄</button>
    <button class="xp-btn-forward" aria-label="Forward">►</button>
    <button class="xp-btn-refresh" aria-label="Refresh">↻</button>
    <button class="xp-btn-stop" aria-label="Stop">✕</button>
    <button class="xp-btn-home" aria-label="Home">⌂</button>
</div>
```

**Step 3: Add status bar to HTML**

Add before closing xp-window div:

```html
<div class="xp-status">
    <span class="xp-status-text">Ready</span>
</div>
```

**Step 4: Add toolbar button styles**

Add to css/components.css after xp-toolbar section:

```css
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
```

**Step 5: Import and initialize in main.js**

Add to imports section:
```javascript
import { initXPWindow } from './xp-window.js';
```

Add to DOMContentLoaded:
```javascript
initXPWindow();
```

**Step 6: Test browser controls**

Open site and test:
- Type in address bar: `/frontend` → Enter
- Projects should filter
- Back button should work
- Refresh should shuffle
- Stop should freeze animations
- Maximize should expand window

**Step 7: Commit**

```bash
git add js/xp-window.js js/main.js index.html css/components.css
git commit -m "Add XP window browser controls

- Working address bar with filtering
- Back/forward navigation
- Refresh shuffles projects
- Stop freezes animations
- Maximize/minimize states
- Status bar with loading"
```

---

### Task 7: Add Multi-Window Spawning

**Files:**
- Modify: `js/xp-window.js` (add multi-window functions)
- Modify: `css/components.css` (add child window styles)

**Step 1: Add multi-window functions to xp-window.js**

Add after initXPWindow function:

```javascript
let openWindows = [];
let nextZIndex = 1000;

function spawnProjectWindow(projectCard) {
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
```

**Step 2: Call attachProjectCardHandlers in initXPWindow**

Add at end of initXPWindow function:

```javascript
// Enable double-click to spawn windows
attachProjectCardHandlers();
```

**Step 3: Add child window styles to css/components.css**

```css
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
```

**Step 4: Test multi-window**

- Double-click a project card
- New window should spawn
- Should be draggable
- Close button should work
- Try spawning 3 windows
- 4th should show alert

**Step 5: Commit**

```bash
git add js/xp-window.js css/components.css
git commit -m "Add multi-window spawning for projects

- Double-click project spawns new window
- Each window draggable independently
- Z-index management (click brings to front)
- Limit 3 windows max
- Close button functional"
```

---

## Phase 4: Context Menus & Easter Eggs

### Task 8: Right-Click Context Menus

**Files:**
- Create: `js/xp-context-menu.js`
- Modify: `js/xp-window.js` (integrate context menus)
- Modify: `css/components.css` (menu styles)

**Step 1: Create context menu module**

Create js/xp-context-menu.js:

```javascript
// XP Context Menu System

let activeMenu = null;

export function initContextMenus() {
    // Title bar context menu
    document.querySelector('.xp-titlebar')?.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showTitleBarMenu(e.clientX, e.clientY);
    });

    // Project card context menus
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showProjectMenu(e.clientX, e.clientY, card);
        });
    });

    // Address bar context menu
    document.querySelector('.xp-address-input')?.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showAddressMenu(e.clientX, e.clientY);
    });

    // Close menu on outside click
    document.addEventListener('click', () => {
        if (activeMenu) {
            activeMenu.remove();
            activeMenu = null;
        }
    });
}

function showTitleBarMenu(x, y) {
    const menu = createMenu([
        { label: 'Restore', action: () => restoreWindow() },
        { label: 'Move', action: () => {} },
        { label: 'Size', action: () => {} },
        { label: 'Minimize', action: () => minimizeWindow() },
        { label: 'Maximize', action: () => maximizeWindow() },
        { separator: true },
        { label: 'Close     Alt+F4', action: () => closeWindow() }
    ]);

    showMenu(menu, x, y);
}

function showProjectMenu(x, y, card) {
    const title = card.querySelector('h3').textContent;
    const link = card.querySelector('.project-links a')?.href;

    const menu = createMenu([
        { label: 'Open', action: () => window.open(link, '_blank') },
        { label: 'Open in New Window', action: () => {
            const { spawnProjectWindow } = require('./xp-window.js');
            spawnProjectWindow(card);
        }},
        { separator: true },
        { label: 'Add to Favorites...', action: () => addToFavorites(title) },
        { separator: true },
        { label: 'Copy Project Link', action: () => copyToClipboard(link) },
        { label: 'View Source', action: () => showSourceModal(card) },
        { label: 'Properties', action: () => showPropertiesDialog(card) }
    ]);

    showMenu(menu, x, y);
}

function showAddressMenu(x, y) {
    const menu = createMenu([
        { label: 'Undo', action: () => {}, disabled: true },
        { separator: true },
        { label: 'Cut', action: () => document.execCommand('cut') },
        { label: 'Copy', action: () => document.execCommand('copy') },
        { label: 'Paste', action: () => document.execCommand('paste') },
        { label: 'Delete', action: () => document.execCommand('delete') },
        { separator: true },
        { label: 'Select All', action: () => document.execCommand('selectAll') }
    ]);

    showMenu(menu, x, y);
}

function createMenu(items) {
    const menu = document.createElement('ul');
    menu.className = 'xp-context-menu';

    items.forEach(item => {
        if (item.separator) {
            const sep = document.createElement('li');
            sep.className = 'xp-menu-separator';
            menu.appendChild(sep);
        } else {
            const li = document.createElement('li');
            li.className = 'xp-menu-item';
            if (item.disabled) li.classList.add('disabled');
            li.textContent = item.label;
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!item.disabled) {
                    item.action();
                    menu.remove();
                    activeMenu = null;
                }
            });
            menu.appendChild(li);
        }
    });

    return menu;
}

function showMenu(menu, x, y) {
    if (activeMenu) activeMenu.remove();

    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    document.body.appendChild(menu);
    activeMenu = menu;

    // Adjust if off screen
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        menu.style.left = (x - rect.width) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
        menu.style.top = (y - rect.height) + 'px';
    }
}

function restoreWindow() {
    const win = document.querySelector('.xp-window');
    win.classList.remove('maximized');
    win.classList.remove('minimized');
}

function minimizeWindow() {
    document.querySelector('.xp-window').classList.add('minimized');
}

function maximizeWindow() {
    document.querySelector('.xp-window').classList.add('maximized');
}

function closeWindow() {
    if (confirm('Are you sure you want to close this window?')) {
        document.querySelector('.xp-window').classList.add('minimized');
    }
}

function addToFavorites(title) {
    alert(`Added "${title}" to favorites`);
    // Could implement actual localStorage favorites here
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard');
    });
}

function showSourceModal(card) {
    const code = card.querySelector('.project-description').textContent;
    alert(`View Source:\n\n${code}`);
    // Could implement proper modal here
}

function showPropertiesDialog(card) {
    const title = card.querySelector('h3').textContent;
    const tags = Array.from(card.querySelectorAll('.tech-tags .tag')).map(t => t.textContent).join(', ');

    alert(`Properties\n\nProject: ${title}\nTechnologies: ${tags}\nType: Web Application\nDate Created: 2025`);
}
```

**Step 2: Add context menu styles**

Add to css/components.css:

```css
/* Context Menus */
.xp-context-menu {
    position: fixed;
    background: #f5f4f2;
    border: 2px solid;
    border-color: #ffffff #888888 #888888 #ffffff;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    list-style: none;
    padding: 2px;
    margin: 0;
    min-width: 180px;
    z-index: 10000;
    font-family: 'Tahoma', var(--font-sans);
    font-size: 11px;
}

.xp-menu-item {
    padding: 4px 20px 4px 8px;
    cursor: pointer;
    color: #000000;
}

.xp-menu-item:hover {
    background: #3168d5;
    color: #ffffff;
}

.xp-menu-item.disabled {
    color: #888888;
    cursor: not-allowed;
}

.xp-menu-item.disabled:hover {
    background: transparent;
    color: #888888;
}

.xp-menu-separator {
    height: 1px;
    background: #888888;
    margin: 2px 0;
}
```

**Step 3: Import and initialize**

Add to js/xp-window.js:

```javascript
import { initContextMenus } from './xp-context-menu.js';

// At end of initXPWindow:
initContextMenus();
```

**Step 4: Test context menus**

- Right-click title bar → menu appears
- Right-click project card → menu appears
- Right-click address bar → edit menu
- Click "Copy Project Link" → copies
- Click "Properties" → shows dialog

**Step 5: Commit**

```bash
git add js/xp-context-menu.js js/xp-window.js css/components.css
git commit -m "Add XP context menu system

- Title bar context menu with window controls
- Project card menus with actions
- Address bar edit menu
- Copy link, view source, properties
- XP-authentic styling and behavior"
```

---

### Task 9: Easter Eggs

**Files:**
- Create: `js/xp-easter-eggs.js`
- Modify: `js/xp-window.js` (integrate easter eggs)

**Step 1: Create easter eggs module**

Create js/xp-easter-eggs.js:

```javascript
// XP Window Easter Eggs

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
let clickCount = 0;
let clickTimer = null;

export function initEasterEggs() {
    // Konami code
    document.addEventListener('keydown', handleKonamiKey);

    // Triple-click title bar
    const titleBar = document.querySelector('.xp-titlebar');
    if (titleBar) {
        titleBar.addEventListener('click', handleTitleBarClick);
    }

    // IE icon multi-click
    const ieIcon = document.querySelector('.xp-icon');
    if (ieIcon) {
        ieIcon.addEventListener('click', handleIconClick);
    }

    // about:projects in address bar
    const addressInput = document.querySelector('.xp-address-input span');
    if (addressInput) {
        addressInput.addEventListener('blur', handleAddressSpecial);
    }
}

function handleKonamiKey(e) {
    const xpWindow = document.querySelector('.xp-window');
    if (!xpWindow || !xpWindow.contains(document.activeElement)) return;

    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            triggerKonamiEffect();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
}

function triggerKonamiEffect() {
    showXPError();
    setTimeout(() => {
        danceProjects();
    }, 2000);
}

function showXPError() {
    const errorDialog = document.createElement('div');
    errorDialog.className = 'xp-error-dialog';
    errorDialog.innerHTML = `
        <div class="xp-error-content">
            <div class="xp-error-icon">✕</div>
            <div class="xp-error-text">
                <strong>Internet Explorer</strong><br>
                This program has performed an illegal operation and will be shut down.
                <br><br>
                If the problem persists, contact the program vendor.
            </div>
        </div>
        <div class="xp-error-buttons">
            <button class="xp-error-btn">Details >></button>
            <button class="xp-error-btn xp-error-ok">OK</button>
        </div>
    `;

    document.body.appendChild(errorDialog);

    errorDialog.querySelector('.xp-error-ok').addEventListener('click', () => {
        errorDialog.remove();
    });

    errorDialog.querySelector('.xp-error-btn:first-child').addEventListener('click', function() {
        const details = document.createElement('div');
        details.className = 'xp-error-details';
        details.textContent = 'Error Code: 0xC0000005\nException: ACCESS_VIOLATION at 0x7C00BEEF';
        this.parentElement.parentElement.appendChild(details);
        this.disabled = true;
    });
}

function danceProjects() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, i) => {
        const originalTransform = card.style.transform;

        let frame = 0;
        const interval = setInterval(() => {
            frame++;
            const x = Math.sin(frame * 0.3 + i) * 20;
            const y = Math.cos(frame * 0.2 + i) * 20;
            const rotate = Math.sin(frame * 0.1) * 10;
            card.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;

            if (frame > 60) {
                clearInterval(interval);
                card.style.transform = originalTransform;
            }
        }, 33);
    });
}

function handleTitleBarClick(e) {
    if (e.target.closest('.xp-btn')) return;

    clickCount++;

    if (clickTimer) clearTimeout(clickTimer);

    if (clickCount === 3) {
        triggerNotResponding();
        clickCount = 0;
    }

    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 500);
}

function triggerNotResponding() {
    const titleBar = document.querySelector('.xp-titlebar');
    const titleText = titleBar.querySelector('.xp-title span');
    const originalText = titleText.textContent;

    titleText.textContent = originalText + ' (Not Responding)';

    // Shake window
    const window = document.querySelector('.xp-window');
    let shakes = 0;
    const shakeInterval = setInterval(() => {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        window.style.transform = `translate(${x}px, ${y}px)`;

        shakes++;
        if (shakes > 10) {
            clearInterval(shakeInterval);
            window.style.transform = '';

            setTimeout(() => {
                titleText.textContent = originalText;
            }, 2000);
        }
    }, 100);
}

let iconClickCount = 0;
let iconClickTimer = null;

function handleIconClick(e) {
    e.stopPropagation();
    iconClickCount++;

    if (iconClickTimer) clearTimeout(iconClickTimer);

    if (iconClickCount === 5) {
        spawnClippy();
        iconClickCount = 0;
    }

    iconClickTimer = setTimeout(() => {
        iconClickCount = 0;
    }, 1000);
}

function spawnClippy() {
    const clippy = document.createElement('div');
    clippy.className = 'clippy';
    clippy.innerHTML = `
        <div class="clippy-content">
            <div class="clippy-text">
                It looks like you're viewing projects. Would you like help?
            </div>
            <div class="clippy-buttons">
                <button class="clippy-btn">Yes</button>
                <button class="clippy-btn">No</button>
            </div>
        </div>
    `;

    document.body.appendChild(clippy);

    clippy.querySelector('.clippy-btn:first-child').addEventListener('click', () => {
        alert('Great! Double-click any project to open it in a new window.');
        clippy.classList.add('clippy-leaving');
        setTimeout(() => clippy.remove(), 500);
    });

    clippy.querySelector('.clippy-btn:last-child').addEventListener('click', () => {
        clippy.classList.add('clippy-sad');
        setTimeout(() => {
            clippy.classList.add('clippy-leaving');
            setTimeout(() => clippy.remove(), 500);
        }, 1000);
    });
}

function handleAddressSpecial(e) {
    const text = e.target.textContent;

    if (text === 'about:projects') {
        showAboutDialog();
        e.target.textContent = 'https://perevici.us/projects/all';
    }
}

function showAboutDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'xp-about-dialog';
    dialog.innerHTML = `
        <div class="xp-about-content">
            <h2>About Internet Explorer</h2>
            <p><strong>Version:</strong> 6.0 (Mykolas Edition)</p>
            <p><strong>Total Projects:</strong> ${document.querySelectorAll('.project-card').length}</p>
            <p><strong>Lines of Code:</strong> 10,000+</p>
            <p><strong>Coffee Consumed:</strong> ∞ cups</p>
            <br>
            <p style="font-size: 9px;">This portfolio is best viewed in any browser except Internet Explorer.</p>
        </div>
        <button class="xp-about-ok">OK</button>
    `;

    document.body.appendChild(dialog);

    dialog.querySelector('.xp-about-ok').addEventListener('click', () => {
        dialog.remove();
    });
}

// Add styles
const style = document.createElement('style');
style.textContent = `
.xp-error-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background: #ece9d8;
    border: 3px solid;
    border-color: #ffffff #888888 #888888 #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    z-index: 10001;
    font-family: 'Tahoma', sans-serif;
}

.xp-error-content {
    display: flex;
    padding: 16px;
    gap: 12px;
}

.xp-error-icon {
    font-size: 32px;
    color: #ff0000;
}

.xp-error-text {
    font-size: 11px;
    color: #000000;
}

.xp-error-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 0 16px 16px;
}

.xp-error-btn {
    padding: 4px 16px;
    background: linear-gradient(180deg, #f1f0e9 0%, #dddad1 85%, #bdb8ae 100%);
    border: 1px solid;
    border-color: #ffffff #888888 #888888 #ffffff;
    font-family: 'Tahoma', sans-serif;
    font-size: 11px;
    cursor: pointer;
    min-width: 75px;
}

.xp-error-details {
    padding: 0 16px 16px;
    font-size: 10px;
    font-family: monospace;
    color: #000000;
}

.clippy {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 200px;
    background: #ffffe1;
    border: 1px solid #000000;
    padding: 12px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 10001;
    font-family: 'Tahoma', sans-serif;
    font-size: 11px;
    animation: slideInClippy 0.3s ease-out;
}

@keyframes slideInClippy {
    from {
        transform: translateY(100px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.clippy-leaving {
    animation: slideOutClippy 0.5s ease-out forwards;
}

@keyframes slideOutClippy {
    to {
        transform: translateY(100px);
        opacity: 0;
    }
}

.clippy-sad {
    filter: grayscale(100%);
}

.clippy-text {
    margin-bottom: 12px;
    color: #000000;
}

.clippy-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.clippy-btn {
    padding: 3px 12px;
    background: linear-gradient(180deg, #f1f0e9 0%, #dddad1 85%, #bdb8ae 100%);
    border: 1px solid;
    border-color: #ffffff #888888 #888888 #ffffff;
    font-family: 'Tahoma', sans-serif;
    font-size: 11px;
    cursor: pointer;
}

.xp-about-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    background: #ece9d8;
    border: 3px solid;
    border-color: #ffffff #888888 #888888 #ffffff;
    padding: 16px;
    z-index: 10001;
    font-family: 'Tahoma', sans-serif;
}

.xp-about-content {
    color: #000000;
    font-size: 11px;
    margin-bottom: 16px;
}

.xp-about-content h2 {
    font-size: 14px;
    margin-bottom: 12px;
    color: #000000;
}

.xp-about-ok {
    padding: 4px 24px;
    background: linear-gradient(180deg, #f1f0e9 0%, #dddad1 85%, #bdb8ae 100%);
    border: 1px solid;
    border-color: #ffffff #888888 #888888 #ffffff;
    font-family: 'Tahoma', sans-serif;
    font-size: 11px;
    cursor: pointer;
    float: right;
}
`;
document.head.appendChild(style);
```

**Step 2: Import and initialize**

Add to js/xp-window.js:

```javascript
import { initEasterEggs } from './xp-easter-eggs.js';

// At end of initXPWindow:
initEasterEggs();
```

**Step 3: Test easter eggs**

- Konami code in XP window → error + dancing projects
- Triple-click title bar → "Not Responding" + shake
- Click IE icon 5 times → Clippy appears
- Type `about:projects` in address bar → about dialog

**Step 4: Commit**

```bash
git add js/xp-easter-eggs.js js/xp-window.js
git commit -m "Add XP window easter eggs

- Konami code triggers error + dancing projects
- Triple-click title bar freezes window
- 5 clicks on IE icon spawns Clippy
- about:projects shows portfolio stats
- All with authentic XP styling"
```

---

## Phase 5: GitHub Metrics System

Due to length constraints, I'll summarize the remaining phases briefly. Would you like me to:

1. **Continue with full detailed steps** for GitHub metrics, or
2. **Provide summary-level tasks** for remaining work, or
3. **Save this plan now** and execute what we have so far?

The plan is getting very comprehensive - what would be most useful?
