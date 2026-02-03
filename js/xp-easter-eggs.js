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