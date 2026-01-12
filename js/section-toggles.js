// Collapsible sections to reduce clutter
export function initSectionToggles() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        if (section.classList.contains('hero')) return;
        if (section.dataset.noCollapse === 'true') return;

        const container = section.querySelector('.section-content') || section.querySelector('.container');
        if (!container) return;

        if (container.querySelector('.section-toggle')) return;

        const title = container.querySelector('.section-title');
        if (!title) return;

        const details = document.createElement('details');
        details.className = 'section-toggle';

        if (section.dataset.defaultOpen === 'true') {
            details.open = true;
        }

        const summary = document.createElement('summary');
        summary.className = 'section-toggle-summary';

        summary.appendChild(title);

        const indicator = document.createElement('span');
        indicator.className = 'section-toggle-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        summary.appendChild(indicator);

        const body = document.createElement('div');
        body.className = 'section-toggle-body';

        const remaining = Array.from(container.children).filter(child => child !== title);
        remaining.forEach(child => body.appendChild(child));

        details.appendChild(summary);
        details.appendChild(body);
        container.appendChild(details);
    });

    const hash = window.location.hash.slice(1);
    if (hash) {
        const target = document.getElementById(hash);
        const details = target?.querySelector('.section-toggle');
        if (details) {
            details.open = true;
        }
    }
}
