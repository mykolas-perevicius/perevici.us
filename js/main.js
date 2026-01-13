// Main initialization - Critical modules only
import { initI18n } from './i18n.js';
import { initMetrics } from './metrics.js';
import { initImageOptimization } from './image-optimizer.js';
import { initBlogModal } from './blog-modal.js';
import { initSectionToggles } from './section-toggles.js';

function scheduleIdle(callback, options = {}) {
    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(callback, options);
        return;
    }
    const timeout = typeof options.timeout === 'number' ? options.timeout : 1000;
    window.setTimeout(callback, timeout);
}

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

// GitHub Stats Integration (for old stats section)
async function fetchGitHubStats() {
    try {
        const response = await fetch('https://api.github.com/users/mykolas-perevicius');
        const data = await response.json();

        const repoCountEl = document.getElementById('repoCount');
        const followerCountEl = document.getElementById('followerCount');
        const totalStarsEl = document.getElementById('totalStars');

        if (repoCountEl) repoCountEl.textContent = data.public_repos || '20+';
        if (followerCountEl) followerCountEl.textContent = data.followers || '0';

        // Fetch repositories to count stars
        const reposResponse = await fetch('https://api.github.com/users/mykolas-perevicius/repos?per_page=100');
        const repos = await reposResponse.json();
        const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
        if (totalStarsEl) totalStarsEl.textContent = totalStars;
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        const repoCountEl = document.getElementById('repoCount');
        const followerCountEl = document.getElementById('followerCount');
        const totalStarsEl = document.getElementById('totalStars');

        if (repoCountEl) repoCountEl.textContent = '20+';
        if (followerCountEl) followerCountEl.textContent = '--';
        if (totalStarsEl) totalStarsEl.textContent = '--';
    }
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
    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue('--primary-color').trim() || '#ff8a3d';
    const accent = styles.getPropertyValue('--accent-color').trim() || '#33d6c8';
    const muted = styles.getPropertyValue('--muted').trim() || '#a7b0a5';

    console.log(`
%c🚀 Welcome to Mykolas's Portfolio! 🚀

%cLooking for something interesting? Try the Konami Code!
↑ ↑ ↓ ↓ ← → ← → B A

%cOr press \` for a terminal experience

%c📧 Email: Perevicius.Mykolas@gmail.com
%c🔗 GitHub: github.com/mykolas-perevicius

`,
        `color: ${primary}; font-size: 20px; font-weight: bold;`,
        `color: ${accent}; font-size: 14px;`,
        `color: ${muted}; font-size: 12px;`,
        `color: ${muted}; font-size: 12px;`,
        `color: ${muted}; font-size: 12px;`
    );
}

// Initialize everything with lazy loading
document.addEventListener('DOMContentLoaded', async () => {
    // Critical: Initialize immediately
    initI18n();
    initTheme();
    initTypingAnimation();
    initSectionToggles();
    initScrollReveal();
    initMetrics();
    initImageOptimization();
    fetchGitHubStats();
    initConsoleMessage();

    // High priority: Load after critical content
    scheduleIdle(() => {
        Promise.all([
            import('./terminal.js').then(m => m.initTerminal()),
            import('./shortcuts.js').then(m => m.initShortcuts()),
            import('./swipe-gestures.js').then(m => m.initSwipeGestures()),
            import('./project-cards.js').then(m => m.initProjectCards())
        ]);
    }, { timeout: 1200 });

    // Medium priority: Load when user might need them
    scheduleIdle(() => {
        Promise.all([
            import('./xp-window.js').then(m => m.initXPWindow()),
            import('./word-window.js').then(m => m.initWordWindow()),
            import('./contact-form.js').then(m => m.initContactForm()),
            import('./hints.js').then(m => m.initHints())
        ]);
        initBlogModal();
    }, { timeout: 2000 });

    // Low priority: Load when browser is truly idle
    scheduleIdle(() => {
        Promise.all([
            import('./konami.js').then(m => m.initKonami()),
            import('./silicon-background.js').then(m => m.initSiliconBackground())
        ]);
    }, { timeout: 3000 });
});
