// Image Optimization & Lazy Loading System

export function initImageOptimization() {
    // Add lazy loading to all images
    lazyLoadImages();

    // Monitor for dynamically added images
    observeNewImages();

    // Preload critical images
    preloadCriticalImages();
}

function lazyLoadImages() {
    // Get all images that should be lazy loaded
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image enters viewport
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => loadImage(img));
    }
}

function loadImage(img) {
    // Handle data-src for lazy loading
    if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
    }

    // Handle srcset for responsive images
    if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        delete img.dataset.srcset;
    }

    // Add loaded class for animations
    img.classList.add('lazy-loaded');

    // Handle WebP with fallback
    if (img.dataset.webp && supportsWebP()) {
        img.src = img.dataset.webp;
    }
}

function observeNewImages() {
    // Watch for dynamically added images
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'IMG' && (node.dataset.src || node.loading === 'lazy')) {
                    lazyLoadImages();
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function preloadCriticalImages() {
    // Preload images that are above the fold or critical
    const criticalImages = document.querySelectorAll('img[data-critical]');

    criticalImages.forEach(img => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src || img.dataset.src;

        if (img.dataset.srcset) {
            link.imagesrcset = img.dataset.srcset;
        }

        document.head.appendChild(link);
    });
}

// Check WebP support
let webpSupported = null;
function supportsWebP() {
    if (webpSupported !== null) return webpSupported;

    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } else {
        webpSupported = false;
    }

    return webpSupported;
}

// Utility: Convert image to WebP (for future use with user uploads)
export async function convertToWebP(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                canvas.toBlob(
                    (blob) => resolve(blob),
                    'image/webp',
                    0.9 // Quality
                );
            };
            img.src = e.target.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Utility: Generate responsive srcset
export function generateSrcSet(baseUrl, widths = [320, 640, 960, 1280, 1920]) {
    return widths.map(width => {
        const url = baseUrl.replace(/\.(jpg|jpeg|png)$/i, `-${width}w.$1`);
        return `${url} ${width}w`;
    }).join(', ');
}

// Utility: Create optimized image element
export function createOptimizedImage({
    src,
    alt,
    webp = null,
    srcset = null,
    sizes = '100vw',
    lazy = true,
    critical = false
}) {
    const img = document.createElement('img');

    if (lazy && !critical) {
        img.dataset.src = src;
        if (srcset) img.dataset.srcset = srcset;
        if (webp) img.dataset.webp = webp;
        img.loading = 'lazy';
    } else {
        img.src = webp && supportsWebP() ? webp : src;
        if (srcset) img.srcset = srcset;
    }

    img.alt = alt;
    if (sizes) img.sizes = sizes;
    if (critical) img.dataset.critical = 'true';

    // Add blur-up placeholder
    img.style.filter = 'blur(10px)';
    img.style.transition = 'filter 0.3s ease';

    img.addEventListener('load', () => {
        img.style.filter = 'none';
    });

    return img;
}
