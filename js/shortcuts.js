// Vim-style keyboard shortcuts (NO "?" modal)
export function initShortcuts() {
    let lastKeyTime = 0;
    let lastKey = '';

    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        const currentTime = Date.now();
        const timeDiff = currentTime - lastKeyTime;

        // Vim-style navigation
        if (e.key === 'j') {
            e.preventDefault();
            window.scrollBy({ top: 100, behavior: 'smooth' });
        } else if (e.key === 'k') {
            e.preventDefault();
            window.scrollBy({ top: -100, behavior: 'smooth' });
        } else if (e.key === 'g' && lastKey === 'g' && timeDiff < 500) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (e.key === 'G' && e.shiftKey) {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } else if (e.key === 'p') {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'e') {
            e.preventDefault();
            document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'c') {
            e.preventDefault();
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }

        lastKey = e.key;
        lastKeyTime = currentTime;
    });
}
