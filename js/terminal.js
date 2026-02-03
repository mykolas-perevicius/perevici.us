// Terminal functionality
export function initTerminal() {
    const terminalOverlay = document.getElementById('terminalOverlay');

    if (!terminalOverlay) return;

    // Toggle terminal
    window.toggleTerminal = () => {
        terminalOverlay.classList.toggle('active');
    };

    // Close on outside click
    terminalOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'terminalOverlay') {
            toggleTerminal();
        }
    });

    // Terminal key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === '`') {
            e.preventDefault();
            toggleTerminal();
        }

        if (e.key === 'Escape') {
            if (terminalOverlay.classList.contains('active')) {
                terminalOverlay.classList.remove('active');
            }
        }
    });
}
