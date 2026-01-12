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
    const commitsLastYear = data.commitsLastYear ?? data.commits2025 ?? null;
    const metrics = [
        {
            value: data.linesAddedLifetime,
            label: 'Lines Added',
            tooltip: 'Total lines added across all public repositories (lifetime)',
            link: null
        },
        {
            value: commitsLastYear,
            label: 'Commits (Last 12 Months)',
            tooltip: 'Total commits across all public repositories in the rolling last 12 months',
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

    renderActivityChart(container.parentElement, data);

    // Add timestamp if available
    if (data.generatedAt) {
        const existingTimestamp = container.parentElement.querySelector('.metrics-timestamp');
        if (existingTimestamp) {
            existingTimestamp.remove();
        }
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
            <div class="metric-label">Commits (Last 12 Months)</div>
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

    const activityContainer = document.getElementById('metricsActivity');
    if (activityContainer) {
        activityContainer.innerHTML = `
            <div class="metrics-activity-empty">Activity visualization unavailable.</div>
        `;
    }
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

function renderActivityChart(parent, data) {
    const activityContainer = document.getElementById('metricsActivity');
    if (!activityContainer || !parent) return;

    const weekly = Array.isArray(data.weeklyCommitsLastYear) ? data.weeklyCommitsLastYear : [];
    if (weekly.length < 10) {
        activityContainer.innerHTML = `
            <div class="metrics-activity-empty">Weekly activity is generating. Check back soon.</div>
        `;
        return;
    }

    const { start, end } = getRollingRange(data, weekly.length);
    const maxValue = Math.max(...weekly, 1);
    const bars = weekly.map((value, index) => {
        const height = maxValue === 0 ? 6 : Math.max(6, Math.round((value / maxValue) * 80));
        const startDate = new Date(start);
        startDate.setDate(startDate.getDate() + index * 7);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        const label = `${formatShortDate(startDate)} - ${formatShortDate(endDate)}: ${value} commits`;
        return `<span class="metrics-activity-bar" style="height: ${height}px" title="${label}"></span>`;
    }).join('');

    const axisLabels = buildAxisLabels(start, weekly.length);

    activityContainer.innerHTML = `
        <div class="metrics-activity-header">
            <div class="metrics-activity-title">Rolling 12-Month Activity</div>
            <div class="metrics-activity-range">${formatRange(start, end)}</div>
        </div>
        <div class="metrics-activity-grid" role="img" aria-label="Weekly commit activity over the last 12 months">
            ${bars}
        </div>
        <div class="metrics-activity-axis">${axisLabels}</div>
    `;
}

function getRollingRange(data, weeksLength) {
    const end = data.rollingYearEnd ? new Date(data.rollingYearEnd) : new Date();
    const start = data.rollingYearStart ? new Date(data.rollingYearStart) : new Date(end);
    if (!data.rollingYearStart) {
        start.setDate(end.getDate() - (weeksLength * 7 - 1));
    }
    return { start, end };
}

function formatRange(start, end) {
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
    return `${formatter.format(start)} — ${formatter.format(end)}`;
}

function formatShortDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function buildAxisLabels(start, weeksLength) {
    const labelCount = 6;
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
    const labels = [];
    for (let i = 0; i < labelCount; i++) {
        const index = Math.round((weeksLength - 1) * (i / (labelCount - 1)));
        const date = new Date(start);
        date.setDate(date.getDate() + index * 7);
        labels.push(`<span>${formatter.format(date)}</span>`);
    }
    return labels.join('');
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

    return date.toLocaleDateString();
}
