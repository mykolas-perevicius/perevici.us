// Live GitHub metrics system
export async function initMetrics() {
    const container = document.getElementById('liveMetricsContainer');
    if (!container) return;

    // Show loading state
    showLoadingState(container);

    try {
        // Try serverless endpoint first, fall back to static JSON
        let data;
        try {
            const response = await fetch('/api/metrics');
            if (response.ok) {
                data = await response.json();
            }
        } catch (e) {
            // Serverless not available, try static
        }

        if (!data) {
            const response = await fetch('/metrics.json');
            data = await response.json();
        }

        renderMetrics(container, data);
    } catch (error) {
        console.error('Failed to load metrics:', error);
        renderError(container);
    }
}

function showLoadingState(container) {
    container.innerHTML = `
        <div class="metric-card">
            <div class="metric-skeleton"></div>
            <div class="metric-label">Loading...</div>
        </div>
        <div class="metric-card">
            <div class="metric-skeleton"></div>
            <div class="metric-label">Loading...</div>
        </div>
        <div class="metric-card">
            <div class="metric-skeleton"></div>
            <div class="metric-label">Loading...</div>
        </div>
        <div class="metric-card">
            <div class="metric-skeleton"></div>
            <div class="metric-label">Loading...</div>
        </div>
    `;
}

function renderMetrics(container, data) {
    const metrics = [
        {
            value: data.linesAddedLifetime,
            label: 'Lines Added',
            tooltip: 'Total lines added across all public repositories (lifetime)',
            link: null
        },
        {
            value: data.commits12mo,
            label: 'Commits (12mo)',
            tooltip: 'Total commits in the last 12 months across public repositories',
            link: null
        },
        {
            value: data.prsMerged,
            label: 'PRs Merged',
            tooltip: 'Total pull requests merged (lifetime, public)',
            link: null
        },
        {
            value: data.starsTotal,
            label: 'Total Stars',
            tooltip: 'Stars across all public repositories',
            link: `https://github.com/${data.username}?tab=repositories`
        }
    ];

    container.innerHTML = metrics.map(metric => {
        const formattedValue = formatNumber(metric.value);
        const displayValue = metric.value === null ? '—' : formattedValue.display;
        const exactValue = metric.value === null ? 'GitHub is still generating this metric' : formattedValue.exact;

        const cardContent = `
            <div class="metric-value" title="${exactValue}">${displayValue}</div>
            <div class="metric-label">
                ${metric.label}
                <span class="metric-tooltip" role="tooltip" aria-label="${metric.tooltip}">ⓘ</span>
            </div>
        `;

        if (metric.link && metric.value !== null) {
            return `<a href="${metric.link}" target="_blank" rel="noopener" class="metric-card metric-card-link">${cardContent}</a>`;
        }
        return `<div class="metric-card">${cardContent}</div>`;
    }).join('');

    // Add timestamp if available
    if (data.generatedAt) {
        const timeAgo = getTimeAgo(new Date(data.generatedAt));
        const timestamp = document.createElement('p');
        timestamp.className = 'metrics-timestamp';
        timestamp.textContent = `Updated ${timeAgo}`;
        container.parentElement.appendChild(timestamp);
    }
}

function renderError(container) {
    container.innerHTML = `
        <div class="metric-card">
            <div class="metric-value">—</div>
            <div class="metric-label">Lines Added</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">—</div>
            <div class="metric-label">Commits (12mo)</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">—</div>
            <div class="metric-label">PRs Merged</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">—</div>
            <div class="metric-label">Total Stars</div>
        </div>
    `;
}

function formatNumber(num) {
    if (num === null || num === undefined) {
        return { display: '—', exact: 'Not available' };
    }

    const exact = num.toLocaleString();

    // Abbreviate large numbers
    if (num >= 1000000) {
        return { display: (num / 1000000).toFixed(1) + 'M', exact };
    }
    if (num >= 1000) {
        return { display: (num / 1000).toFixed(1) + 'K', exact };
    }

    return { display: exact, exact };
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

    return date.toLocaleDateString();
}
