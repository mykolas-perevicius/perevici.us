// Enhanced Project Cards with Flip Animation
export function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // Add click handler for mobile
        card.addEventListener('click', (e) => {
            // Don't flip if clicking on a link
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }

            // Toggle flip on mobile
            if (window.innerWidth <= 768) {
                card.classList.toggle('flipped');
            }
        });

        // Desktop: hover to flip
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', () => {
                card.classList.add('flipped');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('flipped');
            });
        }

    });
}
