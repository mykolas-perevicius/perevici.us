// Three.js 3D Background Module
export function initThreeBackground() {
    const canvas = document.getElementById('threejsBackground');
    if (!canvas) return;

    // Section-based opacity targets for depth effect
    const SECTION_OPACITY = {
        hero: 1.0,       // 100% - full vibrancy at top
        projects: 0.3,   // 30% - dimmed for content focus
        experience: 0.1, // 10% - subtle background
        footer: 0.0      // 0% - solid background
    };

    let currentOpacity = 1.0;
    let targetOpacity = 1.0;
    let currentLineOpacity = 0.15;
    let targetLineOpacity = 0.15;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Create particle system
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Get theme colors
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const primaryColor = new THREE.Color(isDark ? 0x00d4ff : 0x0078d4);
    const accentColor = new THREE.Color(isDark ? 0x40e0d0 : 0x00c9ff);

    for (let i = 0; i < particleCount; i++) {
        // Random positions
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        // Random velocities
        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

        // Gradient colors between primary and accent
        const mixRatio = Math.random();
        const color = new THREE.Color().lerpColors(primaryColor, accentColor, mixRatio);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Create connecting lines between nearby particles
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: isDark ? 0x00d4ff : 0x0078d4,
        transparent: true,
        opacity: 0.15
    });
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // Animation loop
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    function animate() {
        requestAnimationFrame(animate);

        const positions = particleSystem.geometry.attributes.position.array;
        const linePositions = [];

        // Update particle positions
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];

            // Bounce particles at boundaries
            if (Math.abs(positions[i * 3]) > 10) velocities[i * 3] *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
            if (Math.abs(positions[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -1;
        }

        // Draw lines between nearby particles
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < 2) {
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                }
            }
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        // Smooth camera rotation based on mouse
        targetRotationX += (mouseY * 0.001 - targetRotationX) * 0.05;
        targetRotationY += (mouseX * 0.001 - targetRotationY) * 0.05;

        particleSystem.rotation.x = targetRotationX;
        particleSystem.rotation.y = targetRotationY;
        lineSegments.rotation.x = targetRotationX;
        lineSegments.rotation.y = targetRotationY;

        // Auto-rotate slowly
        particleSystem.rotation.y += 0.0005;
        lineSegments.rotation.y += 0.0005;

        // Smoothly interpolate opacity based on scroll position
        currentOpacity += (targetOpacity - currentOpacity) * 0.1;
        currentLineOpacity += (targetLineOpacity - currentLineOpacity) * 0.1;

        particleMaterial.opacity = currentOpacity * 0.6; // Base opacity was 0.6
        lineMaterial.opacity = currentLineOpacity;

        renderer.render(scene, camera);
    }

    // Mouse interaction
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX - window.innerWidth / 2;
        mouseY = event.clientY - window.innerHeight / 2;
    });

    // Linear interpolation helper
    function lerp(start, end, t) {
        return start + (end - start) * t;
    }

    function updateScrollOpacity() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Get section positions (with fallbacks)
        const heroSection = document.querySelector('.hero');
        const projectsSection = document.getElementById('projects');
        const experienceSection = document.getElementById('experience');
        const footerSection = document.querySelector('.footer');

        const heroEnd = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : windowHeight;
        const projectsEnd = projectsSection ? projectsSection.offsetTop + projectsSection.offsetHeight : heroEnd + windowHeight;
        const experienceEnd = experienceSection ? experienceSection.offsetTop + experienceSection.offsetHeight : projectsEnd + windowHeight;

        // Calculate which section we're in and interpolate
        if (scrollY < heroEnd * 0.7) {
            // In hero
            targetOpacity = SECTION_OPACITY.hero;
            targetLineOpacity = 0.15;
        } else if (scrollY < projectsEnd * 0.8) {
            // In projects - interpolate from hero to projects
            const progress = (scrollY - heroEnd * 0.7) / (projectsEnd * 0.8 - heroEnd * 0.7);
            targetOpacity = lerp(SECTION_OPACITY.hero, SECTION_OPACITY.projects, Math.min(progress, 1));
            targetLineOpacity = lerp(0.15, 0.05, Math.min(progress, 1));
        } else if (scrollY < experienceEnd * 0.9) {
            // In experience
            const progress = (scrollY - projectsEnd * 0.8) / (experienceEnd * 0.9 - projectsEnd * 0.8);
            targetOpacity = lerp(SECTION_OPACITY.projects, SECTION_OPACITY.experience, Math.min(progress, 1));
            targetLineOpacity = lerp(0.05, 0.02, Math.min(progress, 1));
        } else {
            // Footer
            targetOpacity = SECTION_OPACITY.footer;
            targetLineOpacity = 0;
        }
    }

    // Throttled scroll handler for depth-aware opacity
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                updateScrollOpacity();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Initial call to set opacity on load
    updateScrollOpacity();

    // Handle window resize
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    // Handle theme changes
    function updateTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const primaryColor = new THREE.Color(isDark ? 0x00d4ff : 0x0078d4);
        const accentColor = new THREE.Color(isDark ? 0x40e0d0 : 0x00c9ff);

        const colors = particleSystem.geometry.attributes.color.array;
        for (let i = 0; i < particleCount; i++) {
            const mixRatio = Math.random();
            const color = new THREE.Color().lerpColors(primaryColor, accentColor, mixRatio);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        particleSystem.geometry.attributes.color.needsUpdate = true;

        lineMaterial.color.set(isDark ? 0x00d4ff : 0x0078d4);
    }

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                updateTheme();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    animate();
}
