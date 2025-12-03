// Enhanced Project Cards with Flip Animation
export function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // Add click handler for mobile
        card.addEventListener('click', (e) => {
            // Don't flip if clicking on a link
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }

            // Toggle flip on mobile
            if (window.innerWidth <= 768) {
                card.classList.toggle('flipped');
            }
        });

        // Desktop: hover to flip
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', () => {
                card.classList.add('flipped');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('flipped');
            });
        }

        // Fetch GitHub stats if repo link exists
        const githubLink = card.querySelector('a[href*="github.com"]');
        if (githubLink) {
            fetchGitHubStats(githubLink.href, card);
        }
    });
}

async function fetchGitHubStats(url, card) {
    try {
        // Extract owner/repo from URL
        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) return;

        const [, owner, repo] = match;

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!response.ok) return;

        const data = await response.json();

        // Update card back with stats
        const statsContainer = card.querySelector('.card-back-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="github-stat">
                    <span class="stat-icon">⭐</span>
                    <span class="stat-value">${data.stargazers_count || 0}</span>
                    <span class="stat-label">Stars</span>
                </div>
                <div class="github-stat">
                    <span class="stat-icon">🔱</span>
                    <span class="stat-value">${data.forks_count || 0}</span>
                    <span class="stat-label">Forks</span>
                </div>
                <div class="github-stat">
                    <span class="stat-icon">👁️</span>
                    <span class="stat-value">${data.watchers_count || 0}</span>
                    <span class="stat-label">Watchers</span>
                </div>
            `;
        }

        // Update last updated
        const lastUpdated = card.querySelector('.card-back-updated');
        if (lastUpdated && data.pushed_at) {
            const date = new Date(data.pushed_at);
            const timeAgo = getTimeAgo(date);
            lastUpdated.textContent = `Updated ${timeAgo}`;
        }
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
    }
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;

    return `${Math.floor(seconds / 31536000)}y ago`;
}
