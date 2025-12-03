// Contact Form Module
export function initContactForm() {
    const modal = document.getElementById('contactModal');
    const openBtn = document.getElementById('openContactForm');
    const closeBtn = document.getElementById('closeContactForm');
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (!modal || !openBtn || !closeBtn || !form) return;

    // Open modal
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.contact-form-submit');
        const submitText = submitBtn.querySelector('.submit-text');
        const submitLoading = submitBtn.querySelector('.submit-loading');

        // Get form data
        const formData = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        // Disable submit button
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline';
        formStatus.style.display = 'none';

        try {
            // Create mailto link with form data
            const mailto = `mailto:Perevicius.Mykolas@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
            )}`;

            // Open mailto (fallback method)
            window.location.href = mailto;

            // Show success message
            formStatus.className = 'form-status success';
            formStatus.textContent = 'Email client opened! Your message has been prepared.';
            formStatus.style.display = 'block';

            // Reset form
            form.reset();

            // Close modal after 2 seconds
            setTimeout(() => {
                closeModal();
                formStatus.style.display = 'none';
            }, 2000);

        } catch (error) {
            console.error('Form submission error:', error);
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Something went wrong. Please try again or email directly at Perevicius.Mykolas@gmail.com';
            formStatus.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitText.style.display = 'inline';
            submitLoading.style.display = 'none';
        }
    });
}
