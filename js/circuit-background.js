// Circuit-inspired ambient background
export function initCircuitBackground() {
    const canvas = document.getElementById('threejsBackground');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let edges = [];
    let pulses = [];
    let colors = getThemeColors();
    let animationId = 0;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function getThemeColors() {
        const styles = getComputedStyle(document.documentElement);
        return {
            primary: styles.getPropertyValue('--primary-color').trim() || '#ff8a3d',
            accent: styles.getPropertyValue('--accent-color').trim() || '#33d6c8',
            muted: styles.getPropertyValue('--muted').trim() || '#a7b0a5',
            border: styles.getPropertyValue('--border').trim() || '#273231',
            bg: styles.getPropertyValue('--bg').trim() || '#0b1211'
        };
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        buildGraph();
    }

    function buildGraph() {
        nodes = [];
        edges = [];
        pulses = [];

        const spacing = Math.max(120, Math.min(170, Math.round(Math.min(width, height) / 5)));
        const jitter = spacing * 0.18;

        for (let y = spacing * 0.5; y < height; y += spacing) {
            for (let x = spacing * 0.5; x < width; x += spacing) {
                nodes.push({
                    x: x + (Math.random() - 0.5) * jitter,
                    y: y + (Math.random() - 0.5) * jitter
                });
            }
        }

        const cols = Math.max(1, Math.round(width / spacing));
        const rows = Math.max(1, Math.round(height / spacing));

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                const node = nodes[index];
                if (!node) continue;

                const right = nodes[index + 1];
                const down = nodes[index + cols];

                if (right && Math.random() > 0.25) {
                    addEdge(node, right);
                }
                if (down && Math.random() > 0.25) {
                    addEdge(node, down);
                }
            }
        }

        const pulseCount = Math.max(6, Math.round((width * height) / 220000));
        for (let i = 0; i < pulseCount; i++) {
            pulses.push(createPulse());
        }
    }

    function addEdge(start, end) {
        const horizontalFirst = Math.random() > 0.5;
        const mid = horizontalFirst
            ? { x: end.x, y: start.y }
            : { x: start.x, y: end.y };

        const points = [start, mid, end];
        const length = polylineLength(points);
        edges.push({ points, length });
    }

    function polylineLength(points) {
        let total = 0;
        for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            total += Math.hypot(dx, dy);
        }
        return total;
    }

    function pointAlong(edge, distance) {
        let remaining = distance;
        const pts = edge.points;

        for (let i = 0; i < pts.length - 1; i++) {
            const start = pts[i];
            const end = pts[i + 1];
            const segLen = Math.hypot(end.x - start.x, end.y - start.y);

            if (remaining <= segLen) {
                const t = segLen === 0 ? 0 : remaining / segLen;
                return {
                    x: start.x + (end.x - start.x) * t,
                    y: start.y + (end.y - start.y) * t
                };
            }

            remaining -= segLen;
        }

        return pts[pts.length - 1];
    }

    function createPulse() {
        if (!edges.length) return null;
        const edge = edges[Math.floor(Math.random() * edges.length)];
        return {
            edge,
            offset: Math.random() * edge.length,
            speed: 18 + Math.random() * 25,
            size: 1.6 + Math.random() * 1.8
        };
    }

    function drawBackground() {
        ctx.clearRect(0, 0, width, height);

        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colors.border;
        ctx.globalAlpha = 0.35;

        edges.forEach(edge => {
            ctx.beginPath();
            edge.points.forEach((pt, idx) => {
                if (idx === 0) {
                    ctx.moveTo(pt.x, pt.y);
                } else {
                    ctx.lineTo(pt.x, pt.y);
                }
            });
            ctx.stroke();
        });

        ctx.globalAlpha = 0.55;
        ctx.fillStyle = colors.muted;
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 0.8;
        ctx.shadowColor = colors.accent;
        ctx.shadowBlur = 12;

        pulses.forEach(pulse => {
            if (!pulse || !pulse.edge) return;
            const point = pointAlong(pulse.edge, pulse.offset);
            ctx.fillStyle = colors.accent;
            ctx.beginPath();
            ctx.arc(point.x, point.y, pulse.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 18;
            ctx.fillStyle = colors.primary;
            ctx.beginPath();
            ctx.arc(point.x, point.y, pulse.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 12;
        });

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }

    let lastTime = 0;
    function animate(time) {
        if (reducedMotionQuery.matches) return;
        animationId = requestAnimationFrame(animate);

        const delta = Math.min(32, time - lastTime) / 1000;
        lastTime = time;

        pulses = pulses.map(pulse => {
            if (!pulse) return pulse;
            pulse.offset += pulse.speed * delta;
            if (pulse.offset > pulse.edge.length) {
                return createPulse();
            }
            return pulse;
        });

        drawBackground();
    }

    function handleThemeChange() {
        colors = getThemeColors();
        drawBackground();
    }

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

    window.addEventListener('resize', () => {
        resize();
        drawBackground();
    });

    reducedMotionQuery.addEventListener('change', () => {
        if (reducedMotionQuery.matches) {
            cancelAnimationFrame(animationId);
            drawBackground();
        } else {
            lastTime = performance.now();
            animationId = requestAnimationFrame(animate);
        }
    });

    resize();
    drawBackground();

    if (!reducedMotionQuery.matches) {
        lastTime = performance.now();
        animationId = requestAnimationFrame(animate);
    }
}
