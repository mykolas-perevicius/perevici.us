// Main initialization - Critical modules only
// Theme Management
function initTheme() {
    // Auto-detect system preference if no saved preference
    let theme = localStorage.getItem('theme');

    if (!theme) {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Typing Animation
function initTypingAnimation() {
    const roles = [
        'Full-Stack Engineer',
        'GPU Computing Enthusiast',
        'Systems Builder',
        'Open Source Contributor',
        'Problem Solver',
        'Production Shipper'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const typeRole = () => {
        const roleText = document.getElementById('roleText');
        if (!roleText) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            roleText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            roleText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(typeRole, typeSpeed);
    };

    setTimeout(typeRole, 1000);
}

// Scroll Reveal Animation
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

// Console Easter Egg
function initConsoleMessage() {
    console.log(`
%c🚀 Welcome to Mykolas's Portfolio! 🚀

%cLooking for something interesting? Try these:
%c  • Press \` (backtick) for terminal mode
%c  • Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
%c  • Click C:\\>_ for MS-DOS mode

%c📧 Email: Perevicius.Mykolas@gmail.com
%c🔗 GitHub: github.com/mykolas-perevicius

`,
        'color: #00d4ff; font-size: 20px; font-weight: bold;',
        'color: #40e0d0; font-size: 14px;',
        'color: #8b92b9; font-size: 12px;',
        'color: #8b92b9; font-size: 12px;',
        'color: #8b92b9; font-size: 12px;',
        'color: #8b92b9; font-size: 12px;',
        'color: #8b92b9; font-size: 12px;'
    );
}

// Initialize everything with lazy loading
document.addEventListener('DOMContentLoaded', async () => {
    // Critical: Initialize immediately
    initTheme();
    initTypingAnimation();
    initScrollReveal();
    initConsoleMessage();

    // High priority: Load after critical content
    requestIdleCallback(() => {
        Promise.all([
            import('./shortcuts.js').then(m => m.initShortcuts()),
            import('./swipe-gestures.js').then(m => m.initSwipeGestures()),
            import('./project-cards.js').then(m => m.initProjectCards())
        ]);
    });

    // Medium priority: Load when user might need them
    requestIdleCallback(() => {
        Promise.all([
            import('./contact-form.js').then(m => m.initContactForm()),
            import('./word-window.js').then(m => m.initWordWindow()),
            import('./hints.js').then(m => m.initHints())
        ]);
    }, { timeout: 2000 });

    // Low priority: Load when browser is truly idle
    requestIdleCallback(() => {
        Promise.all([
            import('./three-background.js').then(m => m.initThreeBackground()),
            import('./terminal.js').then(m => m.initTerminal()),
            import('./konami.js').then(m => m.initKonami()),
            import('./dos-mode.js').then(m => m.initDosMode())
        ]);
    }, { timeout: 3000 });
});
