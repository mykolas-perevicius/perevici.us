// Internationalization Module
const translations = {
    en: {
        // Navigation
        'nav.experience': 'Experience',
        'nav.projects': 'Projects',
        'nav.skills': 'Skills',
        'nav.blog': 'Blog',
        'nav.contact': 'Contact',

        // Hero Section
        'hero.greeting': "Hi, I'm",
        'hero.role.0': 'Full-Stack Engineer',
        'hero.role.1': 'GPU Computing Enthusiast',
        'hero.role.2': 'Systems Builder',
        'hero.role.3': 'Open Source Contributor',
        'hero.role.4': 'Problem Solver',
        'hero.role.5': 'Production Shipper',
        'hero.description': 'Full-stack software engineer with industry experience, shipping production code in Python, React, .NET, and AWS while never losing sight of the user.',
        'hero.resume': 'Resume.doc',

        // Metrics
        'metrics.lines': 'Lines Added',
        'metrics.commits': 'Commits (2025)',
        'metrics.prs': 'PRs Merged',
        'metrics.stars': 'Total Stars',
        'metrics.updated': 'Updated',

        // Experience Section
        'experience.title': 'Experience',
        'experience.present': 'Present',

        // Projects Section
        'projects.title': 'Featured Projects',
        'projects.viewToggle.modern': 'Modern View',
        'projects.viewToggle.xp': 'Windows XP View',
        'projects.viewAll': 'View All Projects on GitHub',

        // Skills Section
        'skills.title': 'Skills & Technologies',

        // Contact Section
        'contact.title': 'Get In Touch',
        'contact.description': 'I\'m always interested in hearing about new opportunities, collaborations, or just chatting about tech. Feel free to reach out!',
        'contact.send': 'Send Message',
        'contact.linkedin': 'Connect on LinkedIn',
        'contact.email': 'Direct Email',

        // Contact Form
        'form.title': 'Get In Touch',
        'form.subtitle': 'Have a project in mind or want to chat? Let\'s connect!',
        'form.name': 'Name',
        'form.email': 'Email',
        'form.subject': 'Subject',
        'form.message': 'Message',
        'form.submit': 'Send Message',
        'form.sending': 'Sending...',
        'form.namePlaceholder': 'Your name',
        'form.emailPlaceholder': 'your.email@example.com',
        'form.subjectPlaceholder': 'What would you like to discuss?',
        'form.messagePlaceholder': 'Tell me about your project or idea...',

        // Footer
        'footer.built': 'Built with',
        'footer.source': 'View Source',

        // Accessibility
        'aria.themeToggle': 'Switch to {theme} mode',
        'aria.languageToggle': 'Change language',
        'aria.closeModal': 'Close'
    },
    lt: {
        // Navigation
        'nav.experience': 'Patirtis',
        'nav.projects': 'Projektai',
        'nav.skills': 'Įgūdžiai',
        'nav.blog': 'Tinklaraštis',
        'nav.contact': 'Kontaktai',

        // Hero Section
        'hero.greeting': 'Sveiki, aš',
        'hero.role.0': 'Full-Stack Inžinierius',
        'hero.role.1': 'GPU Skaičiavimų Entuziastas',
        'hero.role.2': 'Sistemų Kūrėjas',
        'hero.role.3': 'Atvirojo Kodo Bendradarbis',
        'hero.role.4': 'Problemų Sprendėjas',
        'hero.role.5': 'Produkcijos Pristatytojas',
        'hero.description': 'Full-stack programuotojas su pramonine patirtimi, kurianti produkcinį kodą Python, React, .NET ir AWS, niekada neprarandant vartotojo iš akiračio.',
        'hero.resume': 'Gyvenimo.aprašymas',

        // Metrics
        'metrics.lines': 'Pridėtos Eilutės',
        'metrics.commits': 'Commit\'ai (2025)',
        'metrics.prs': 'Sujungti PR',
        'metrics.stars': 'Viso Žvaigždučių',
        'metrics.updated': 'Atnaujinta',

        // Experience Section
        'experience.title': 'Darbo Patirtis',
        'experience.present': 'Dabar',

        // Projects Section
        'projects.title': 'Pagrindiniai Projektai',
        'projects.viewToggle.modern': 'Šiuolaikinis Vaizdas',
        'projects.viewToggle.xp': 'Windows XP Vaizdas',
        'projects.viewAll': 'Žiūrėti Visus Projektus GitHub',

        // Skills Section
        'skills.title': 'Įgūdžiai ir Technologijos',

        // Contact Section
        'contact.title': 'Susisiekite',
        'contact.description': 'Visada įdomu girdėti apie naujas galimybes, bendradarbiavimą ar tiesiog pasikalbėti apie technologijas. Nedvejodami susisiekite!',
        'contact.send': 'Siųsti Žinutę',
        'contact.linkedin': 'Prisijungti LinkedIn',
        'contact.email': 'Tiesioginis El. paštas',

        // Contact Form
        'form.title': 'Susisiekite',
        'form.subtitle': 'Turite projektą ar norite pasikalbėti? Susisiekime!',
        'form.name': 'Vardas',
        'form.email': 'El. paštas',
        'form.subject': 'Tema',
        'form.message': 'Žinutė',
        'form.submit': 'Siųsti Žinutę',
        'form.sending': 'Siunčiama...',
        'form.namePlaceholder': 'Jūsų vardas',
        'form.emailPlaceholder': 'jusu.pastas@pavyzdys.lt',
        'form.subjectPlaceholder': 'Apie ką norėtumėte kalbėti?',
        'form.messagePlaceholder': 'Papasakokite apie savo projektą ar idėją...',

        // Footer
        'footer.built': 'Sukurta su',
        'footer.source': 'Žiūrėti Šaltinį',

        // Accessibility
        'aria.themeToggle': 'Perjungti į {theme} režimą',
        'aria.languageToggle': 'Pakeisti kalbą',
        'aria.closeModal': 'Uždaryti'
    }
};

let currentLanguage = 'en';

// Get browser language or saved preference
function getInitialLanguage() {
    const saved = localStorage.getItem('language');
    if (saved && translations[saved]) {
        return saved;
    }

    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'en';
}

// Translate a key
export function t(key, replacements = {}) {
    let text = translations[currentLanguage]?.[key] || translations.en[key] || key;

    // Replace placeholders like {theme}
    Object.keys(replacements).forEach(placeholder => {
        text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    });

    return text;
}

// Update all elements with data-i18n attribute
function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const replacements = {};

        // Get replacement values from data attributes
        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('data-i18n-')) {
                const placeholder = attr.name.replace('data-i18n-', '');
                replacements[placeholder] = attr.value;
            }
        });

        element.textContent = t(key, replacements);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });

    // Update aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria');
        element.setAttribute('aria-label', t(key));
    });
}

// Change language
export function setLanguage(lang) {
    if (!translations[lang]) return;

    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);

    updatePageTranslations();

    // Dispatch custom event for other modules
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
}

// Get current language
export function getCurrentLanguage() {
    return currentLanguage;
}

// Get available languages
export function getAvailableLanguages() {
    return Object.keys(translations).map(code => ({
        code,
        name: code === 'en' ? 'English' : 'Lietuvių'
    }));
}

// Initialize i18n
export function initI18n() {
    currentLanguage = getInitialLanguage();
    document.documentElement.setAttribute('lang', currentLanguage);

    // Create language toggle
    createLanguageToggle();

    // Initial translation
    updatePageTranslations();
}

// Create language toggle UI
function createLanguageToggle() {
    const nav = document.querySelector('.nav-content');
    if (!nav) return;

    const toggle = document.createElement('div');
    toggle.className = 'language-toggle';
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-label', t('aria.languageToggle'));

    const languages = getAvailableLanguages();
    const currentLang = languages.find(l => l.code === currentLanguage);

    toggle.innerHTML = `
        <span class="language-toggle-current">${currentLang.code.toUpperCase()}</span>
        <div class="language-toggle-dropdown">
            ${languages.map(lang => `
                <button class="language-option ${lang.code === currentLanguage ? 'active' : ''}"
                        data-lang="${lang.code}">
                    ${lang.name}
                </button>
            `).join('')}
        </div>
    `;

    // Insert before theme toggle
    const themeToggle = nav.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.parentNode.insertBefore(toggle, themeToggle);
    } else {
        nav.appendChild(toggle);
    }

    // Toggle dropdown
    toggle.addEventListener('click', (e) => {
        if (!e.target.closest('.language-option')) {
            toggle.classList.toggle('active');
        }
    });

    // Handle language selection
    toggle.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);

            // Update UI
            toggle.querySelector('.language-toggle-current').textContent = lang.toUpperCase();
            toggle.querySelectorAll('.language-option').forEach(opt => {
                opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
            });
            toggle.classList.remove('active');
        });
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target)) {
            toggle.classList.remove('active');
        }
    });

    // Keyboard accessibility
    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle.classList.toggle('active');
        }
        if (e.key === 'Escape') {
            toggle.classList.remove('active');
        }
    });
}
