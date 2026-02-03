// MS-DOS Mode Toggle
export function initDosMode() {
    const toggle = document.getElementById('dosModeToggle');
    if (!toggle) return;

    // Check for saved preference
    const savedMode = localStorage.getItem('dosMode');
    if (savedMode === 'true') {
        document.documentElement.setAttribute('data-dos-mode', 'true');
        toggle.textContent = 'EXIT';
    }

    toggle.addEventListener('click', () => {
        const isDosMode = document.documentElement.getAttribute('data-dos-mode') === 'true';

        if (isDosMode) {
            // Exit DOS mode
            document.documentElement.removeAttribute('data-dos-mode');
            toggle.textContent = 'C:\\>_';
            localStorage.setItem('dosMode', 'false');

            // Show a "Windows is shutting down" style message
            showDosMessage('Exiting MS-DOS Mode...');
        } else {
            // Enter DOS mode
            document.documentElement.setAttribute('data-dos-mode', 'true');
            toggle.textContent = 'EXIT';
            localStorage.setItem('dosMode', 'true');

            // Show DOS boot message
            showDosBootSequence();
        }
    });
}

function showDosMessage(text) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #000;
        color: #0f0;
        font-family: 'Courier New', monospace;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-size: 24px;
    `;
    overlay.textContent = text;
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.remove();
    }, 800);
}

function showDosBootSequence() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #000;
        color: #0f0;
        font-family: 'Courier New', monospace;
        padding: 40px;
        z-index: 10000;
        font-size: 16px;
        line-height: 1.5;
        overflow: hidden;
    `;
    document.body.appendChild(overlay);

    const lines = [
        'Starting MS-DOS...',
        '',
        'HIMEM is testing extended memory...done.',
        'Loading portfolio.sys...',
        '',
        'C:\\PORTFOLIO>dir',
        '',
        ' Volume in drive C is MYKOLAS',
        ' Directory of C:\\PORTFOLIO',
        '',
        'PROJECTS    <DIR>     01-01-25  12:00a',
        'EXPERIEN    <DIR>     01-01-25  12:00a',
        'CONTACT     <DIR>     01-01-25  12:00a',
        '',
        'C:\\PORTFOLIO>load perevici.us',
        '',
        'Ready.'
    ];

    let currentLine = 0;
    const textContainer = document.createElement('pre');
    textContainer.style.margin = '0';
    overlay.appendChild(textContainer);

    const typeNextLine = () => {
        if (currentLine < lines.length) {
            textContainer.textContent += lines[currentLine] + '\n';
            currentLine++;
            setTimeout(typeNextLine, 100);
        } else {
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }
    };

    typeNextLine();
}
