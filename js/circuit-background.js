// Hybrid CPU/GPU/RAM architecture grid with moving data calls
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
            secondary: styles.getPropertyValue('--secondary-color').trim() || '#f5b66d',
            accent: styles.getPropertyValue('--accent-color').trim() || '#33d6c8',
            muted: styles.getPropertyValue('--muted').trim() || '#a7b0a5',
            border: styles.getPropertyValue('--border').trim() || '#273231',
            isLight,
            gridAlpha: isLight ? 0.18 : 0.28,
            busAlpha: isLight ? 0.3 : 0.48,
            nodeAlpha: isLight ? 0.32 : 0.55
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
        const spacing = Math.max(64, Math.min(110, Math.round(minDim / 8)));
        const cols = Math.max(8, Math.floor(width / spacing));
        const rows = Math.max(7, Math.floor(height / spacing));
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

        const centerRow = Math.floor(rows / 2);
        const centerCol = Math.floor(cols / 2);
        const busRows = [centerRow, Math.max(1, centerRow - 2), Math.min(rows - 2, centerRow + 2)];
        const busCols = [centerCol, Math.max(1, centerCol - 3), Math.min(cols - 2, centerCol + 3)];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols - 1; col++) {
                const start = nodes[row][col];
                const end = nodes[row][col + 1];
                const segment = { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
                (busRows.includes(row) ? busLines : gridLines).push(segment);
            }
        }

        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows - 1; row++) {
                const start = nodes[row][col];
                const end = nodes[row + 1][col];
                const segment = { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
                (busCols.includes(col) ? busLines : gridLines).push(segment);
            }
        }

        const cpuZone = collectZone(nodes, centerRow - 1, centerRow + 1, centerCol - 1, centerCol + 1);
        const gpuZone = collectZone(nodes, Math.max(1, centerRow - 2), Math.min(rows - 2, centerRow + 2), Math.max(0, cols - 3), cols - 1);
        const ramTop = collectZone(nodes, 0, 0, 0, cols - 1);
        const ramBottom = collectZone(nodes, rows - 1, rows - 1, 0, cols - 1);

        banks = buildMemoryBanks(nodes, spacing, cols, rows);

        grid = {
            nodes,
            rows,
            cols,
            spacing,
            busRows,
            busCols,
            zones: {
                cpu: cpuZone,
                gpu: gpuZone,
                ramTop,
                ramBottom
            },
            bounds: {
                cpu: zoneBounds(cpuZone, spacing * 0.5),
                gpu: zoneBounds(gpuZone, spacing * 0.5)
            }
        };

        const pulseCount = Math.max(10, Math.round((width * height) / 160000));
        for (let i = 0; i < pulseCount; i++) {
            pulses.push(createPulse());
        }
    }

    function collectZone(nodes, rowStart, rowEnd, colStart, colEnd) {
        const zone = [];
        for (let row = rowStart; row <= rowEnd; row++) {
            for (let col = colStart; col <= colEnd; col++) {
                const node = nodes[row]?.[col];
                if (node) zone.push(node);
            }
        }
        return zone;
    }

    function zoneBounds(zone, padding) {
        if (!zone.length) return null;
        const xs = zone.map(node => node.x);
        const ys = zone.map(node => node.y);
        return {
            x: Math.min(...xs) - padding,
            y: Math.min(...ys) - padding,
            w: Math.max(...xs) - Math.min(...xs) + padding * 2,
            h: Math.max(...ys) - Math.min(...ys) + padding * 2
        };
    }

    function buildMemoryBanks(nodes, spacing, cols, rows) {
        const bankCount = Math.max(3, Math.floor(cols / 3));
        const banks = [];
        const topRow = 0;
        const bottomRow = rows - 1;

        for (let i = 0; i < bankCount; i++) {
            const colStart = i * 3;
            const colEnd = Math.min(cols - 1, colStart + 1);
            const padding = spacing * 0.35;
            const topLeft = nodes[topRow][colStart];
            const bottomRight = nodes[topRow][colEnd];

            banks.push({
                x: topLeft.x - padding,
                y: topLeft.y - spacing * 0.6,
                w: (bottomRight.x - topLeft.x) + padding * 2,
                h: spacing * 0.8
            });

            const bottomLeft = nodes[bottomRow][colStart];
            const bottomRightNode = nodes[bottomRow][colEnd];
            banks.push({
                x: bottomLeft.x - padding,
                y: bottomLeft.y - spacing * 0.2,
                w: (bottomRightNode.x - bottomLeft.x) + padding * 2,
                h: spacing * 0.8
            });
        }

        return banks;
    }

    function createPulse() {
        if (!grid) return null;

        const callType = pickCallType();
        const start = randomNode(grid.zones[callType.from]);
        const end = randomNode(grid.zones[callType.to]);
        const busRow = grid.busRows[Math.floor(Math.random() * grid.busRows.length)];
        const busCol = grid.busCols[Math.floor(Math.random() * grid.busCols.length)];

        const path = buildPath(start, end, busRow, busCol);
        const length = polylineLength(path);

        return {
            path,
            length,
            offset: Math.random() * length,
            speed: 18 + Math.random() * 26,
            size: 1.4 + Math.random() * 1.6,
            color: callType.color,
            glow: callType.glow
        };
    }

    function pickCallType() {
        const calls = [
            { from: 'cpu', to: 'ramTop', weight: 3, color: colors.accent, glow: colors.accent },
            { from: 'cpu', to: 'ramBottom', weight: 3, color: colors.accent, glow: colors.accent },
            { from: 'cpu', to: 'gpu', weight: 4, color: colors.primary, glow: colors.primary },
            { from: 'gpu', to: 'ramTop', weight: 2, color: colors.secondary, glow: colors.secondary },
            { from: 'gpu', to: 'ramBottom', weight: 2, color: colors.secondary, glow: colors.secondary },
            { from: 'cpu', to: 'cpu', weight: 1, color: colors.muted, glow: colors.accent }
        ];

        const totalWeight = calls.reduce((sum, call) => sum + call.weight, 0);
        let pick = Math.random() * totalWeight;
        for (const call of calls) {
            pick -= call.weight;
            if (pick <= 0) return call;
        }
        return calls[0];
    }

    function randomNode(zone) {
        if (!zone || zone.length === 0) {
            const row = Math.floor(Math.random() * grid.rows);
            const col = Math.floor(Math.random() * grid.cols);
            return grid.nodes[row][col];
        }
        return zone[Math.floor(Math.random() * zone.length)];
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
            ctx.globalAlpha = colors.isLight ? 0.26 : 0.22;
            ctx.strokeStyle = colors.secondary;
            ctx.lineWidth = 1.2;
            banks.forEach(bank => {
                ctx.strokeRect(bank.x, bank.y, bank.w, bank.h);
            });
        }

        if (grid.bounds.cpu) {
            ctx.globalAlpha = colors.isLight ? 0.3 : 0.35;
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 1.4;
            ctx.setLineDash([6, 6]);
            ctx.strokeRect(grid.bounds.cpu.x, grid.bounds.cpu.y, grid.bounds.cpu.w, grid.bounds.cpu.h);
            ctx.setLineDash([]);
        }

        if (grid.bounds.gpu) {
            ctx.globalAlpha = colors.isLight ? 0.26 : 0.3;
            ctx.strokeStyle = colors.accent;
            ctx.lineWidth = 1.4;
            ctx.setLineDash([4, 8]);
            ctx.strokeRect(grid.bounds.gpu.x, grid.bounds.gpu.y, grid.bounds.gpu.w, grid.bounds.gpu.h);
            ctx.setLineDash([]);
        }

        ctx.globalAlpha = 0.9;
        pulses.forEach(pulse => {
            if (!pulse) return;
            const point = pointAlong(pulse.path, pulse.offset);
            const beamLength = pulse.size * 6;

            ctx.shadowColor = pulse.glow;
            ctx.shadowBlur = colors.isLight ? 10 : 16;
            ctx.strokeStyle = pulse.color;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(point.x - point.dx * beamLength, point.y - point.dy * beamLength);
            ctx.lineTo(point.x + point.dx * beamLength, point.y + point.dy * beamLength);
            ctx.stroke();

            ctx.fillStyle = pulse.color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, pulse.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = colors.isLight ? 16 : 20;
            ctx.fillStyle = colors.primary;
            ctx.beginPath();
            ctx.arc(point.x, point.y, pulse.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
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
