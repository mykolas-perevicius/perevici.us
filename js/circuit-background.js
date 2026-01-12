// Circuit grid background with moving data calls
export function initCircuitBackground() {
    const canvas = document.getElementById('threejsBackground');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let grid = null;
    let gridLines = [];
    let busLines = [];
    let banks = [];
    let pulses = [];
    let colors = getThemeColors();
    let animationId = 0;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function getThemeColors() {
        const styles = getComputedStyle(document.documentElement);
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        return {
            primary: styles.getPropertyValue('--primary-color').trim() || '#ff8a3d',
            accent: styles.getPropertyValue('--accent-color').trim() || '#33d6c8',
            muted: styles.getPropertyValue('--muted').trim() || '#a7b0a5',
            border: styles.getPropertyValue('--border').trim() || '#273231',
            isLight,
            gridAlpha: isLight ? 0.2 : 0.3,
            busAlpha: isLight ? 0.32 : 0.45,
            nodeAlpha: isLight ? 0.35 : 0.55
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

        buildGrid();
    }

    function buildGrid() {
        gridLines = [];
        busLines = [];
        banks = [];
        pulses = [];

        const minDim = Math.min(width, height);
        const spacing = Math.max(70, Math.min(110, Math.round(minDim / 8)));
        const cols = Math.max(6, Math.floor(width / spacing));
        const rows = Math.max(5, Math.floor(height / spacing));
        const offsetX = (width - (cols - 1) * spacing) / 2;
        const offsetY = (height - (rows - 1) * spacing) / 2;

        const nodes = Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => ({
                row,
                col,
                x: offsetX + col * spacing,
                y: offsetY + row * spacing
            }))
        );

        const busRows = new Set();
        const busCols = new Set();
        for (let row = 0; row < rows; row += 3) {
            busRows.add(row);
        }
        for (let col = 0; col < cols; col += 3) {
            busCols.add(col);
        }
        busRows.add(Math.floor(rows / 2));
        busCols.add(Math.floor(cols / 2));

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols - 1; col++) {
                const start = nodes[row][col];
                const end = nodes[row][col + 1];
                const segment = { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
                (busRows.has(row) ? busLines : gridLines).push(segment);
            }
        }

        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows - 1; row++) {
                const start = nodes[row][col];
                const end = nodes[row + 1][col];
                const segment = { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
                (busCols.has(col) ? busLines : gridLines).push(segment);
            }
        }

        banks = buildBanks(nodes, spacing);
        grid = { nodes, rows, cols, spacing, busRows: [...busRows], busCols: [...busCols] };

        const pulseCount = Math.max(8, Math.round((width * height) / 180000));
        for (let i = 0; i < pulseCount; i++) {
            pulses.push(createPulse());
        }
    }

    function buildBanks(nodes, spacing) {
        const rows = nodes.length;
        const cols = nodes[0]?.length || 0;
        const bankCount = Math.min(8, Math.max(3, Math.floor((rows * cols) / 18)));
        const bankSizes = [
            { w: 3, h: 2 },
            { w: 2, h: 3 },
            { w: 2, h: 2 }
        ];
        const taken = new Set();
        const result = [];

        function mark(row, col) {
            taken.add(`${row},${col}`);
        }

        function isFree(row, col, w, h) {
            for (let r = row; r < row + h; r++) {
                for (let c = col; c < col + w; c++) {
                    if (taken.has(`${r},${c}`)) return false;
                }
            }
            return true;
        }

        for (let i = 0; i < bankCount; i++) {
            const size = bankSizes[Math.floor(Math.random() * bankSizes.length)];
            let placed = false;

            for (let attempt = 0; attempt < 30 && !placed; attempt++) {
                const row = Math.floor(Math.random() * (rows - size.h - 1)) + 1;
                const col = Math.floor(Math.random() * (cols - size.w - 1)) + 1;
                if (!isFree(row, col, size.w, size.h)) continue;

                for (let r = row; r < row + size.h; r++) {
                    for (let c = col; c < col + size.w; c++) {
                        mark(r, c);
                    }
                }

                const topLeft = nodes[row][col];
                const bottomRight = nodes[row + size.h - 1][col + size.w - 1];
                const padding = spacing * 0.35;

                result.push({
                    x: topLeft.x - padding,
                    y: topLeft.y - padding,
                    w: (bottomRight.x - topLeft.x) + padding * 2,
                    h: (bottomRight.y - topLeft.y) + padding * 2
                });
                placed = true;
            }
        }

        return result;
    }

    function createPulse() {
        if (!grid) return null;

        const start = randomNode();
        const end = randomNode();
        const busRow = grid.busRows[Math.floor(Math.random() * grid.busRows.length)];
        const busCol = grid.busCols[Math.floor(Math.random() * grid.busCols.length)];

        const path = buildPath(start, end, busRow, busCol);
        const length = polylineLength(path);

        return {
            path,
            length,
            offset: Math.random() * length,
            speed: 20 + Math.random() * 28,
            size: 1.6 + Math.random() * 1.4
        };
    }

    function randomNode() {
        const row = Math.floor(Math.random() * grid.rows);
        const col = Math.floor(Math.random() * grid.cols);
        return grid.nodes[row][col];
    }

    function buildPath(start, end, busRow, busCol) {
        const points = [start];
        const pivot1 = grid.nodes[start.row][busCol] || start;
        const pivot2 = grid.nodes[busRow][busCol] || pivot1;
        const pivot3 = grid.nodes[busRow][end.col] || pivot2;

        points.push(pivot1, pivot2, pivot3, end);
        return dedupePoints(points);
    }

    function dedupePoints(points) {
        const result = [];
        points.forEach(point => {
            const last = result[result.length - 1];
            if (!last || last.x !== point.x || last.y !== point.y) {
                result.push(point);
            }
        });
        return result;
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

    function pointAlong(path, distance) {
        let remaining = distance;
        for (let i = 0; i < path.length - 1; i++) {
            const start = path[i];
            const end = path[i + 1];
            const segLen = Math.hypot(end.x - start.x, end.y - start.y);
            if (remaining <= segLen) {
                const t = segLen === 0 ? 0 : remaining / segLen;
                const dx = segLen === 0 ? 0 : (end.x - start.x) / segLen;
                const dy = segLen === 0 ? 0 : (end.y - start.y) / segLen;
                return {
                    x: start.x + (end.x - start.x) * t,
                    y: start.y + (end.y - start.y) * t,
                    dx,
                    dy
                };
            }
            remaining -= segLen;
        }
        const last = path[path.length - 1];
        return { x: last.x, y: last.y, dx: 1, dy: 0 };
    }

    function drawLines(lines, alpha, width) {
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width;
        ctx.beginPath();
        lines.forEach(line => {
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
        });
        ctx.stroke();
    }

    function drawBackground() {
        if (!grid) return;
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = colors.border;
        ctx.lineCap = 'round';
        drawLines(gridLines, colors.gridAlpha, 1);

        ctx.strokeStyle = colors.accent;
        drawLines(busLines, colors.busAlpha, 1.6);

        ctx.globalAlpha = colors.nodeAlpha;
        ctx.fillStyle = colors.muted;
        grid.nodes.forEach(row => {
            row.forEach(node => {
                ctx.fillRect(node.x - 1, node.y - 1, 2, 2);
            });
        });

        if (banks.length) {
            ctx.globalAlpha = colors.isLight ? 0.25 : 0.2;
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 1.2;
            banks.forEach(bank => {
                ctx.strokeRect(bank.x, bank.y, bank.w, bank.h);
            });
        }

        ctx.globalAlpha = 0.9;
        ctx.shadowColor = colors.accent;
        ctx.shadowBlur = colors.isLight ? 10 : 14;

        pulses.forEach(pulse => {
            if (!pulse) return;
            const point = pointAlong(pulse.path, pulse.offset);
            const beamLength = pulse.size * 6;

            ctx.strokeStyle = colors.accent;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(point.x - point.dx * beamLength, point.y - point.dy * beamLength);
            ctx.lineTo(point.x + point.dx * beamLength, point.y + point.dy * beamLength);
            ctx.stroke();

            ctx.fillStyle = colors.accent;
            ctx.beginPath();
            ctx.arc(point.x, point.y, pulse.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = colors.isLight ? 16 : 20;
            ctx.fillStyle = colors.primary;
            ctx.beginPath();
            ctx.arc(point.x, point.y, pulse.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = colors.isLight ? 10 : 14;
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
            if (pulse.offset > pulse.length) {
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
