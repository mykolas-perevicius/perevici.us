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
            // Trigger double click to spawn window
            const event = new MouseEvent('dblclick', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            card.dispatchEvent(event);
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
    if (!text) {
        alert('No link available to copy');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard');
    }).catch(() => {
        alert('Failed to copy to clipboard');
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

// Add context menu styles
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);