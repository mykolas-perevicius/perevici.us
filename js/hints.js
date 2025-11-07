// Hint chips and idle micro-hint system
export function initHints() {
    // Lightbulb SVG icon
    const lightbulbSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2 11.7V16h-4v-2.3C8.48 12.63 7 11.01 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.01-1.48 3.63-3 4.7z"/>
    </svg>`;

    // Hint configurations
    const hints = [
        {
            anchor: 'experience',
            text: 'Psst… press the grave key',
            position: 'top'
        },
        {
            anchor: 'projects',
            text: 'Try the classic ↑↑↓↓←→←→BA',
            position: 'top'
        }
    ];

    // Create and inject hint chips
    hints.forEach(hint => {
        const anchor = document.querySelector(`[data-hint-anchor="${hint.anchor}"]`);
        if (!anchor) return;

        const chip = document.createElement('button');
        chip.className = 'hint-chip pulse';
        chip.setAttribute('aria-label', hint.text);
        chip.setAttribute('tabindex', '0');
        chip.innerHTML = `${lightbulbSVG}<span>${hint.text}</span>`;

        // Insert after section title
        const sectionContent = anchor.querySelector('.section-content');
        if (sectionContent) {
            const title = sectionContent.querySelector('.section-title');
            if (title) {
                title.insertAdjacentElement('afterend', chip);
            }
        }

        // Make chip visible when section scrolls into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    chip.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        observer.observe(anchor);

        // Dismiss on click
        chip.addEventListener('click', () => {
            chip.style.opacity = '0';
            setTimeout(() => chip.remove(), 300);
        });
    });

    // Idle micro-hint
    initIdleMicroHint();
}

function initIdleMicroHint() {
    let idleTimer;
    const hasShownIdleHint = sessionStorage.getItem('idleHintShown');

    if (hasShownIdleHint) return;

    // Create idle hint element
    const idleHint = document.createElement('div');
    idleHint.className = 'idle-micro-hint';
    idleHint.innerHTML = 'Press <kbd>`</kbd> to open terminal';
    document.body.appendChild(idleHint);

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        if (!sessionStorage.getItem('idleHintShown')) {
            idleTimer = setTimeout(() => {
                idleHint.classList.add('show');
                sessionStorage.setItem('idleHintShown', 'true');
            }, 10000);
        }
    }

    function hideIdleHint() {
        idleHint.classList.remove('show');
    }

    // Track user activity
    ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(event => {
        document.addEventListener(event, () => {
            hideIdleHint();
            if (!sessionStorage.getItem('idleHintShown')) {
                resetIdleTimer();
            }
        }, { passive: true });
    });

    resetIdleTimer();
}
