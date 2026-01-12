#!/usr/bin/env node
/**
 * Build GitHub Metrics
 *
 * Fetches public GitHub statistics for mykolas-perevicius and generates metrics.json
 * Run: npm run build-metrics or ts-node scripts/build-metrics.ts
 */

const { writeFileSync } = require('fs');
const { join } = require('path');
const https = require('https');

const GITHUB_USERNAME = 'mykolas-perevicius';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional, increases rate limits

interface MetricsData {
    generatedAt: string;
    username: string;
    linesAddedLifetime: number | null;
    commitsLastYear: number | null;
    weeklyCommitsLastYear: number[];
    rollingYearStart: string | null;
    rollingYearEnd: string | null;
    prsMerged: number | null;
    starsTotal: number | null;
}

async function fetchGitHub(endpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: endpoint,
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'perevici.us-metrics-builder',
                ...(GITHUB_TOKEN && { 'Authorization': `Bearer ${GITHUB_TOKEN}` })
            }
        };

        const req = https.request(options, (res: any) => {
            let data = '';

            res.on('data', (chunk: any) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(new Error(`Failed to parse JSON: ${error}`));
                    }
                } else {
                    reject(new Error(`GitHub API error: ${res.statusCode} ${res.statusMessage}`));
                }
            });
        });

        req.on('error', (error: any) => {
            reject(error);
        });

        req.end();
    });
}

async function fetchAllRepos(): Promise<any[]> {
    const repos: any[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
        const batch = await fetchGitHub(`/users/${GITHUB_USERNAME}/repos?per_page=${perPage}&page=${page}&type=owner`);

        if (batch.length === 0) break;

        repos.push(...batch.filter((repo: any) => !repo.fork && !repo.private));

        if (batch.length < perPage) break;
        page++;
    }

    return repos;
}

async function calculateLinesAdded(repos: any[]): Promise<number> {
    let totalLines = 0;

    for (const repo of repos) {
        try {
            const stats = await fetchGitHub(`/repos/${GITHUB_USERNAME}/${repo.name}/stats/code_frequency`);

            if (Array.isArray(stats)) {
                // Each entry is [timestamp, additions, deletions]
                for (const [, additions] of stats) {
                    totalLines += additions;
                }
            }

            // Rate limiting: sleep 100ms between repos
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.warn(`Warning: Could not fetch code frequency for ${repo.name}:`, error);
        }
    }

    return totalLines;
}

async function fetchCommitActivity(repoName: string): Promise<any[] | null> {
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const stats = await fetchGitHub(`/repos/${GITHUB_USERNAME}/${repoName}/stats/commit_activity`);
            if (Array.isArray(stats)) {
                return stats;
            }
        } catch (error: any) {
            const message = String(error?.message || error);
            if (message.includes('202') && attempt < 2) {
                await new Promise(resolve => setTimeout(resolve, 1200 + attempt * 800));
                continue;
            }
            console.warn(`Warning: Could not fetch commit activity for ${repoName}:`, error);
            return null;
        }
    }

    return null;
}

async function calculateCommitActivity(repos: any[]): Promise<{
    weeklyTotals: number[];
    rollingYearStart: string | null;
    rollingYearEnd: string | null;
}> {
    const weeklyTotals = Array(52).fill(0);
    let sampleWeeks: any[] | null = null;

    for (const repo of repos) {
        const activity = await fetchCommitActivity(repo.name);
        if (Array.isArray(activity) && activity.length === 52) {
            if (!sampleWeeks) {
                sampleWeeks = activity;
            }
            for (let i = 0; i < 52; i++) {
                weeklyTotals[i] += activity[i]?.total || 0;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 120));
    }

    let rollingYearStart: string | null = null;
    let rollingYearEnd: string | null = null;

    if (sampleWeeks && sampleWeeks.length) {
        const start = new Date(sampleWeeks[0].week * 1000);
        const end = new Date(sampleWeeks[sampleWeeks.length - 1].week * 1000);
        end.setDate(end.getDate() + 6);
        rollingYearStart = start.toISOString();
        rollingYearEnd = end.toISOString();
    }

    return { weeklyTotals, rollingYearStart, rollingYearEnd };
}

async function calculatePRsMerged(): Promise<number> {
    try {
        // Search for merged PRs by this author across all of GitHub
        const search = await fetchGitHub(`/search/issues?q=author:${GITHUB_USERNAME}+type:pr+is:merged`);
        return search.total_count || 0;
    } catch (error) {
        console.warn('Warning: Could not fetch PR count:', error);
        return 0;
    }
}

function calculateTotalStars(repos: any[]): number {
    return repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
}

async function buildMetrics(): Promise<MetricsData> {
    console.log('Fetching GitHub repositories...');
    const repos = await fetchAllRepos();
    console.log(`Found ${repos.length} public repositories`);

    console.log('Calculating lines added (this may take a while)...');
    const linesAddedLifetime = await calculateLinesAdded(repos);
    console.log(`Lines added: ${linesAddedLifetime.toLocaleString()}`);

    console.log('Calculating rolling 12-month commit activity...');
    const activity = await calculateCommitActivity(repos);
    const commitsLastYear = activity.weeklyTotals.reduce((sum, value) => sum + value, 0);
    console.log(`Commits (last 12 months): ${commitsLastYear.toLocaleString()}`);

    console.log('Calculating merged PRs...');
    const prsMerged = await calculatePRsMerged();
    console.log(`PRs merged: ${prsMerged.toLocaleString()}`);

    const starsTotal = calculateTotalStars(repos);
    console.log(`Total stars: ${starsTotal.toLocaleString()}`);

    return {
        generatedAt: new Date().toISOString(),
        username: GITHUB_USERNAME,
        linesAddedLifetime,
        commitsLastYear,
        weeklyCommitsLastYear: activity.weeklyTotals,
        rollingYearStart: activity.rollingYearStart,
        rollingYearEnd: activity.rollingYearEnd,
        prsMerged,
        starsTotal
    };
}

async function main() {
    try {
        const metrics = await buildMetrics();

        const outputPath = join(__dirname, '..', 'metrics.json');
        writeFileSync(outputPath, JSON.stringify(metrics, null, 2));

        console.log('\n✅ Metrics generated successfully!');
        console.log(`📁 Output: ${outputPath}`);
        console.log('\nMetrics summary:');
        console.log(`  Lines Added (lifetime): ${metrics.linesAddedLifetime?.toLocaleString() || 'N/A'}`);
        console.log(`  Commits (last 12 months): ${metrics.commitsLastYear?.toLocaleString() || 'N/A'}`);
        console.log(`  PRs Merged: ${metrics.prsMerged?.toLocaleString() || 'N/A'}`);
        console.log(`  Total Stars: ${metrics.starsTotal?.toLocaleString() || 'N/A'}`);
    } catch (error) {
        console.error('❌ Error building metrics:', error);
        process.exit(1);
    }
}

main();
