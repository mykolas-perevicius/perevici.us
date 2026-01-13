// Silicon Die GPU Architecture Background
// Realistic GPU die visualization inspired by NVIDIA GA102 architecture

export function initSiliconBackground() {
    const canvas = document.getElementById('threejsBackground');
    if (!canvas) return;

    let ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let scrollY = 0;
    let chunks = new Map();
    let animationId = 0;
    let lastTime = 0;
    let pulses = [];

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Seeded random number generator for deterministic patterns
    function seededRandom(seed) {
        let s = seed;
        return function() {
            s = (s * 1103515245 + 12345) & 0x7fffffff;
            return s / 0x7fffffff;
        };
    }

    // Die shot color palettes
    const darkColors = {
        silicon: '#1a1225',        // dark purple base
        substrate: '#2d1f3d',      // deep silicon
        nDoped: '#3a5a7a',         // blue logic blocks
        nDopedLight: '#4a7a9a',    // lighter blue for active
        pDoped: '#4a6a4a',         // green isolation
        pDopedLight: '#5a8a5a',    // lighter green
        metal1: '#8a7a2a',         // gold traces (dimmed)
        metal2: '#7a5a33',         // copper power (dimmed)
        active: '#ff8a3d',         // theme primary (pulses)
        cache: '#5a4a6a',          // purple cache regions
        memCtrl: '#3a4a5a',        // dark blue memory
        gridLine: 'rgba(100, 80, 60, 0.15)',
        busLine: 'rgba(200, 160, 80, 0.25)'
    };

    const lightColors = {
        silicon: '#f0ebe5',        // light cream base
        substrate: '#e5dfd5',      // slightly darker
        nDoped: '#c5d5e5',         // light blue
        nDopedLight: '#b5c5d5',    // medium blue
        pDoped: '#d5e5d5',         // light green
        pDopedLight: '#c5d5c5',    // medium green
        metal1: '#d0c080',         // gold traces
        metal2: '#c0a080',         // copper traces
        active: '#ff8a3d',         // theme primary
        cache: '#d5d0e0',          // light purple cache
        memCtrl: '#c5d0d5',        // light blue memory
        gridLine: 'rgba(100, 80, 60, 0.12)',
        busLine: 'rgba(180, 140, 60, 0.2)'
    };

    function getColors() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        return isLight ? lightColors : darkColors;
    }

    let colors = getColors();

    // Configuration
    const config = {
        smSize: 32,           // Size of each SM tile in pixels
        smGridX: 4,           // Cores per SM horizontally
        smGridY: 4,           // Cores per SM vertically
        gpcWidth: 6,          // SMs per GPC column
        gpcSpacing: 8,        // Gap between GPCs
        memCtrlWidth: 48,     // Memory controller width
        cacheHeight: 24,      // L2 cache band height
        parallaxSpeed: 0.3,   // Scroll parallax factor
        chunkHeight: 800      // Height of each chunk
    };

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Regenerate visible chunks
        updateChunks();
    }

    // Generate a single SM (Streaming Multiprocessor) tile
    function drawSM(x, y, seed, size) {
        const rng = seededRandom(seed);
        const coreSize = size / config.smGridX - 1;
        const padding = 1;

        // SM background
        ctx.fillStyle = colors.nDoped;
        ctx.fillRect(x, y, size, size);

        // Draw individual cores
        for (let cy = 0; cy < config.smGridY; cy++) {
            for (let cx = 0; cx < config.smGridX; cx++) {
                const coreX = x + cx * (coreSize + padding) + padding;
                const coreY = y + cy * (coreSize + padding) + padding;

                // Core activity based on seed
                const active = rng() > 0.3;
                ctx.fillStyle = active ? colors.nDopedLight : colors.nDoped;
                ctx.fillRect(coreX, coreY, coreSize - padding, coreSize - padding);

                // Tiny internal structure
                if (active && coreSize > 4) {
                    ctx.fillStyle = colors.pDoped;
                    const dotSize = Math.max(1, coreSize / 4);
                    ctx.fillRect(
                        coreX + coreSize / 2 - dotSize / 2,
                        coreY + coreSize / 2 - dotSize / 2,
                        dotSize,
                        dotSize
                    );
                }
            }
        }

        // SM border
        ctx.strokeStyle = colors.metal1;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
    }

    // Generate a GPC column
    function drawGPC(x, y, seed, smsPerColumn, smSize) {
        const rng = seededRandom(seed);

        for (let row = 0; row < smsPerColumn; row++) {
            for (let col = 0; col < config.gpcWidth; col++) {
                const smX = x + col * smSize;
                const smY = y + row * smSize;
                const smSeed = seed + row * 1000 + col;
                drawSM(smX, smY, smSeed, smSize);
            }
        }

        // GPC border
        ctx.strokeStyle = colors.busLine;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 1, y - 1, config.gpcWidth * smSize + 2, smsPerColumn * smSize + 2);
    }

    // Draw memory controller (edge region)
    function drawMemoryController(x, y, w, h, seed) {
        const rng = seededRandom(seed);

        ctx.fillStyle = colors.memCtrl;
        ctx.fillRect(x, y, w, h);

        // Memory channel patterns
        const channels = Math.floor(h / 16);
        for (let i = 0; i < channels; i++) {
            const channelY = y + i * 16 + 4;
            ctx.fillStyle = rng() > 0.5 ? colors.nDoped : colors.pDoped;
            ctx.fillRect(x + 4, channelY, w - 8, 8);

            // Channel subdivisions
            for (let j = 0; j < 4; j++) {
                ctx.fillStyle = colors.substrate;
                ctx.fillRect(x + 6 + j * (w - 12) / 4, channelY + 2, 2, 4);
            }
        }

        // Bus connections
        ctx.strokeStyle = colors.metal2;
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const lineY = y + h * (i + 1) / 4;
            ctx.beginPath();
            ctx.moveTo(x, lineY);
            ctx.lineTo(x + w, lineY);
            ctx.stroke();
        }
    }

    // Draw L2 cache band
    function drawCacheBand(x, y, w, h, seed) {
        const rng = seededRandom(seed);

        ctx.fillStyle = colors.cache;
        ctx.fillRect(x, y, w, h);

        // SRAM cell pattern
        const cellSize = 6;
        const cols = Math.floor(w / cellSize);
        const rows = Math.floor(h / cellSize);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (rng() > 0.3) {
                    ctx.fillStyle = rng() > 0.5 ? colors.pDoped : colors.nDoped;
                    ctx.fillRect(
                        x + col * cellSize + 1,
                        y + row * cellSize + 1,
                        cellSize - 2,
                        cellSize - 2
                    );
                }
            }
        }

        // Horizontal bus lines through cache
        ctx.strokeStyle = colors.metal1;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y + h / 2);
        ctx.lineTo(x + w, y + h / 2);
        ctx.stroke();
    }

    // Draw metal interconnect layer
    function drawMetalLayer(startY, endY, seed) {
        const rng = seededRandom(seed);

        // Vertical bus lines (connecting GPCs)
        ctx.strokeStyle = colors.busLine;
        ctx.lineWidth = 2;

        const busCount = Math.floor((width - config.memCtrlWidth * 2) / 100);
        for (let i = 0; i < busCount; i++) {
            const busX = config.memCtrlWidth + 50 + i * 100 + rng() * 30;
            ctx.beginPath();
            ctx.moveTo(busX, startY);
            ctx.lineTo(busX, endY);
            ctx.stroke();
        }

        // Horizontal power distribution
        ctx.strokeStyle = colors.metal2;
        ctx.lineWidth = 1;
        const hBusCount = Math.floor((endY - startY) / 150);
        for (let i = 0; i < hBusCount; i++) {
            const busY = startY + 75 + i * 150 + rng() * 50;
            ctx.beginPath();
            ctx.moveTo(0, busY);
            ctx.lineTo(width, busY);
            ctx.stroke();
        }
    }

    // Generate a chunk of the die
    function generateChunk(chunkIndex) {
        const chunkY = chunkIndex * config.chunkHeight;
        const seed = chunkIndex * 10000;
        const rng = seededRandom(seed);

        // Create offscreen canvas at PHYSICAL pixel dimensions (matching main canvas DPR)
        const chunkCanvas = document.createElement('canvas');
        chunkCanvas.width = width * dpr;
        chunkCanvas.height = config.chunkHeight * dpr;
        const chunkCtx = chunkCanvas.getContext('2d');
        chunkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);  // Apply same DPR transform as main canvas

        // Fill base silicon
        chunkCtx.fillStyle = colors.silicon;
        chunkCtx.fillRect(0, 0, width, config.chunkHeight);

        // Save current context and swap
        const mainCtx = ctx;
        ctx = chunkCtx;

        // Memory controllers (left and right edges)
        drawMemoryController(0, 0, config.memCtrlWidth, config.chunkHeight, seed + 1);
        drawMemoryController(width - config.memCtrlWidth, 0, config.memCtrlWidth, config.chunkHeight, seed + 2);

        // Calculate GPC layout
        const availableWidth = width - config.memCtrlWidth * 2 - config.gpcSpacing * 2;
        const gpcTotalWidth = config.gpcWidth * config.smSize;
        const gpcCount = Math.max(1, Math.floor(availableWidth / (gpcTotalWidth + config.gpcSpacing)));
        const startX = config.memCtrlWidth + config.gpcSpacing +
            (availableWidth - gpcCount * (gpcTotalWidth + config.gpcSpacing)) / 2;

        // L2 Cache bands (every ~200px)
        const cacheInterval = 200;
        for (let y = cacheInterval / 2; y < config.chunkHeight; y += cacheInterval) {
            drawCacheBand(
                config.memCtrlWidth,
                y - config.cacheHeight / 2,
                width - config.memCtrlWidth * 2,
                config.cacheHeight,
                seed + Math.floor(y)
            );
        }

        // GPC columns with SM grids
        const smsPerColumn = Math.floor((cacheInterval - config.cacheHeight - 20) / config.smSize);
        for (let gpc = 0; gpc < gpcCount; gpc++) {
            const gpcX = startX + gpc * (gpcTotalWidth + config.gpcSpacing);

            // Draw GPCs between cache bands
            for (let y = config.cacheHeight; y < config.chunkHeight - config.smSize * smsPerColumn; y += cacheInterval) {
                drawGPC(gpcX, y + 10, seed + gpc * 100 + Math.floor(y), smsPerColumn, config.smSize);
            }
        }

        // Metal interconnect layer
        drawMetalLayer(0, config.chunkHeight, seed + 5000);

        // Restore context
        ctx = mainCtx;

        return {
            canvas: chunkCanvas,
            y: chunkY,
            index: chunkIndex
        };
    }

    // Update visible chunks based on scroll
    function updateChunks() {
        const parallaxY = scrollY * config.parallaxSpeed;
        const startChunk = Math.floor((parallaxY - height) / config.chunkHeight);
        const endChunk = Math.ceil((parallaxY + height * 2) / config.chunkHeight);

        // Remove chunks that are no longer visible
        for (const [index, chunk] of chunks) {
            if (index < startChunk - 1 || index > endChunk + 1) {
                chunks.delete(index);
            }
        }

        // Generate new chunks
        for (let i = startChunk; i <= endChunk; i++) {
            if (!chunks.has(i)) {
                chunks.set(i, generateChunk(i));
            }
        }
    }

    // Create data pulse for animation
    function createPulse() {
        const startX = Math.random() * width;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const isHorizontal = Math.random() > 0.3;

        return {
            x: startX,
            y: Math.random() * height,
            vx: isHorizontal ? direction * (80 + Math.random() * 40) : 0,
            vy: isHorizontal ? 0 : direction * (60 + Math.random() * 30),
            size: 2 + Math.random() * 2,
            life: 0,
            maxLife: 2 + Math.random() * 3
        };
    }

    // Initialize pulses
    function initPulses() {
        pulses = [];
        const pulseCount = Math.max(8, Math.floor((width * height) / 80000));
        for (let i = 0; i < pulseCount; i++) {
            const pulse = createPulse();
            pulse.life = Math.random() * pulse.maxLife; // Stagger initial states
            pulses.push(pulse);
        }
    }

    // Render the background
    function render() {
        // Clear at physical pixel dimensions
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, width * dpr, height * dpr);

        const parallaxY = scrollY * config.parallaxSpeed;

        // Draw chunks at 1:1 physical pixels
        for (const chunk of chunks.values()) {
            const screenY = (chunk.y - parallaxY) * dpr;  // Scale position by DPR
            if (screenY > height * dpr || screenY + config.chunkHeight * dpr < 0) continue;

            ctx.drawImage(chunk.canvas, 0, screenY);
        }
        ctx.restore();  // Restore DPR transform for pulse drawing

        // Draw animated pulses
        if (!reducedMotionQuery.matches && pulses.length > 0) {
            ctx.globalAlpha = 0.9;
            pulses.forEach(pulse => {
                const alpha = Math.sin((pulse.life / pulse.maxLife) * Math.PI);

                // Pulse glow
                ctx.shadowColor = colors.active;
                ctx.shadowBlur = 12;
                ctx.fillStyle = colors.active;
                ctx.globalAlpha = alpha * 0.8;
                ctx.beginPath();
                ctx.arc(pulse.x, pulse.y - parallaxY % height, pulse.size, 0, Math.PI * 2);
                ctx.fill();

                // Bright center
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#fff';
                ctx.globalAlpha = alpha * 0.6;
                ctx.beginPath();
                ctx.arc(pulse.x, pulse.y - parallaxY % height, pulse.size * 0.4, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }

    // Animation loop
    function animate(time) {
        animationId = requestAnimationFrame(animate);

        const delta = Math.min(32, time - lastTime) / 1000;
        lastTime = time;

        if (!reducedMotionQuery.matches) {
            // Update pulses
            pulses.forEach((pulse, i) => {
                pulse.x += pulse.vx * delta;
                pulse.y += pulse.vy * delta;
                pulse.life += delta;

                if (pulse.life >= pulse.maxLife) {
                    pulses[i] = createPulse();
                }
            });
        }

        render();
    }

    // Handle scroll
    function handleScroll() {
        scrollY = window.scrollY || window.pageYOffset;
        updateChunks();
        if (reducedMotionQuery.matches) {
            render();
        }
    }

    // Handle theme change
    function handleThemeChange() {
        colors = getColors();
        // Clear and regenerate all chunks
        chunks.clear();
        updateChunks();
        render();
    }

    // Theme observer
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'data-theme') {
                handleThemeChange();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // Event listeners
    window.addEventListener('resize', () => {
        chunks.clear();
        resize();
        render();
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    reducedMotionQuery.addEventListener('change', () => {
        if (reducedMotionQuery.matches) {
            cancelAnimationFrame(animationId);
            render();
        } else {
            initPulses();
            lastTime = performance.now();
            animationId = requestAnimationFrame(animate);
        }
    });

    // Initialize
    resize();
    initPulses();
    handleScroll();
    render();

    if (!reducedMotionQuery.matches) {
        lastTime = performance.now();
        animationId = requestAnimationFrame(animate);
    }
}
