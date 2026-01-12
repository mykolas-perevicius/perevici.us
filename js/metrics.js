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
        const exactValue = metric.value === null ? 'Data not available yet' : formattedValue.exact;

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

    const monthly = Array.isArray(data.monthlyCommitsLastYear) ? data.monthlyCommitsLastYear : [];
    const totalCommits = data.commitsLastYear ?? data.commits2025 ?? null;
    if (monthly.length < 6) {
        if (totalCommits !== null && totalCommits !== undefined) {
            const average = totalCommits > 0 ? Math.max(1, Math.round(totalCommits / 12)) : 0;
            const estimated = Array.from({ length: 12 }, () => average);
            const { start, end } = getRollingRange(data, estimated.length);
            const bars = buildBars(estimated, start, true);
            const axisLabels = buildAxisLabels(start, estimated.length);

            activityContainer.innerHTML = `
                <div class="metrics-activity-header">
                    <div class="metrics-activity-title">Rolling 12-Month Activity</div>
                    <div class="metrics-activity-range">${formatRange(start, end)}</div>
                </div>
                <div class="metrics-activity-grid" role="img" aria-label="Estimated monthly commit activity over the last 12 months">
                    ${bars}
                </div>
                <div class="metrics-activity-axis">${axisLabels}</div>
                <div class="metrics-activity-note">Showing average monthly commits. Detailed breakdown updates hourly.</div>
            `;
            return;
        }

        activityContainer.innerHTML = `
            <div class="metrics-activity-empty">Activity data updates hourly. Check back soon.</div>
        `;
        return;
    }

    const { start, end } = getRollingRange(data, monthly.length);
    const bars = buildBars(monthly, start, false);

    const axisLabels = buildAxisLabels(start, monthly.length);

    activityContainer.innerHTML = `
        <div class="metrics-activity-header">
            <div class="metrics-activity-title">Rolling 12-Month Activity</div>
            <div class="metrics-activity-range">${formatRange(start, end)}</div>
        </div>
        <div class="metrics-activity-grid" role="img" aria-label="Monthly commit activity over the last 12 months">
            ${bars}
        </div>
        <div class="metrics-activity-axis">${axisLabels}</div>
    `;
}

function buildBars(values, start, estimated) {
    const maxValue = Math.max(...values, 1);
    return values.map((value, index) => {
        const height = maxValue === 0 ? 6 : Math.max(6, Math.round((value / maxValue) * 80));
        const startDate = new Date(start);
        startDate.setMonth(startDate.getMonth() + index);
        const label = `${formatMonth(startDate)}: ${value} commits`;
        const classes = estimated ? 'metrics-activity-bar metrics-activity-bar-estimated' : 'metrics-activity-bar';
        return `<span class="${classes}" style="height: ${height}px" title="${label}"></span>`;
    }).join('');
}

function getRollingRange(data, monthsLength) {
    const end = data.rollingYearEnd ? new Date(data.rollingYearEnd) : new Date();
    const start = data.rollingYearStart ? new Date(data.rollingYearStart) : new Date(end);
    if (!data.rollingYearStart) {
        start.setMonth(end.getMonth() - (monthsLength - 1));
        start.setDate(1);
    }
    return { start, end };
}

function formatRange(start, end) {
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
    return `${formatter.format(start)} — ${formatter.format(end)}`;
}

function formatMonth(date) {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function buildAxisLabels(start, monthsLength) {
    const labelCount = 6;
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
    const labels = [];
    for (let i = 0; i < labelCount; i++) {
        const index = Math.round((monthsLength - 1) * (i / (labelCount - 1)));
        const date = new Date(start);
        date.setMonth(date.getMonth() + index);
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
