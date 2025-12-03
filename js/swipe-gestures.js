// Swipe Gestures for Mobile Navigation
export function initSwipeGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const minSwipeDistance = 50; // Minimum distance for a swipe
    const maxVerticalDistance = 100; // Max vertical movement to still count as horizontal swipe

    // Get all main sections
    const sections = Array.from(document.querySelectorAll('section[id]'));
    let currentSectionIndex = 0;

    // Track which section is currently in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const index = sections.indexOf(entry.target);
                if (index !== -1) {
                    currentSectionIndex = index;
                }
            }
        });
    }, {
        threshold: 0.5
    });

    sections.forEach(section => observer.observe(section));

    // Touch event handlers
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }

    function handleSwipe() {
        const horizontalDistance = touchEndX - touchStartX;
        const verticalDistance = Math.abs(touchEndY - touchStartY);

        // Only process if it's a primarily horizontal swipe
        if (verticalDistance > maxVerticalDistance) {
            return;
        }

        // Swipe left (next section)
        if (horizontalDistance < -minSwipeDistance) {
            navigateToSection(currentSectionIndex + 1);
        }

        // Swipe right (previous section)
        if (horizontalDistance > minSwipeDistance) {
            navigateToSection(currentSectionIndex - 1);
        }
    }

    function navigateToSection(index) {
        if (index < 0 || index >= sections.length) {
            return; // Out of bounds
        }

        const section = sections[index];
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Show visual feedback
        showSwipeFeedback(index > currentSectionIndex ? 'next' : 'prev');
    }

    function showSwipeFeedback(direction) {
        // Create or get existing feedback element
        let feedback = document.getElementById('swipe-feedback');

        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'swipe-feedback';
            feedback.className = 'swipe-feedback';
            document.body.appendChild(feedback);
        }

        // Set direction
        feedback.className = `swipe-feedback ${direction}`;
        feedback.textContent = direction === 'next' ? '→' : '←';

        // Remove after animation
        setTimeout(() => {
            feedback.className = 'swipe-feedback';
        }, 300);
    }

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Also handle modal swipe to close
    const modals = document.querySelectorAll('.contact-modal, .xp-window');

    modals.forEach(modal => {
        let modalTouchStartY = 0;

        modal.addEventListener('touchstart', (e) => {
            // Only track if touching the modal content, not backdrop
            if (e.target === modal || e.target.classList.contains('contact-modal-content')) {
                modalTouchStartY = e.changedTouches[0].screenY;
            }
        }, { passive: true });

        modal.addEventListener('touchend', (e) => {
            if (modalTouchStartY === 0) return;

            const touchEndY = e.changedTouches[0].screenY;
            const swipeDistance = touchEndY - modalTouchStartY;

            // Swipe down to close
            if (swipeDistance > 100) {
                if (modal.classList.contains('contact-modal')) {
                    document.getElementById('closeContactForm')?.click();
                }
            }

            modalTouchStartY = 0;
        }, { passive: true });
    });
}
