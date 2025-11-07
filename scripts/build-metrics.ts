#!/usr/bin/env node
/**
 * Build GitHub Metrics
 *
 * Fetches public GitHub statistics for mykolas-perevicius and generates metrics.json
 * Run: npm run build-metrics or ts-node scripts/build-metrics.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const GITHUB_USERNAME = 'mykolas-perevicius';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional, increases rate limits

interface MetricsData {
    generatedAt: string;
    username: string;
    linesAddedLifetime: number | null;
    commits12mo: number | null;
    prsMerged: number | null;
    starsTotal: number | null;
}

async function fetchGitHub(endpoint: string): Promise<any> {
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'perevici.us-metrics-builder'
    };

    if (GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com${endpoint}`, { headers });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
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

async function calculateCommits12mo(repos: any[]): Promise<number> {
    let totalCommits = 0;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    for (const repo of repos) {
        try {
            const activity = await fetchGitHub(`/repos/${GITHUB_USERNAME}/${repo.name}/stats/commit_activity`);

            if (Array.isArray(activity)) {
                // Each week contains 'total' commits
                for (const week of activity) {
                    totalCommits += week.total || 0;
                }
            }

            // Rate limiting: sleep 100ms between repos
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.warn(`Warning: Could not fetch commit activity for ${repo.name}:`, error);
        }
    }

    return totalCommits;
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

    console.log('Calculating commits in last 12 months...');
    const commits12mo = await calculateCommits12mo(repos);
    console.log(`Commits (12mo): ${commits12mo.toLocaleString()}`);

    console.log('Calculating merged PRs...');
    const prsMerged = await calculatePRsMerged();
    console.log(`PRs merged: ${prsMerged.toLocaleString()}`);

    const starsTotal = calculateTotalStars(repos);
    console.log(`Total stars: ${starsTotal.toLocaleString()}`);

    return {
        generatedAt: new Date().toISOString(),
        username: GITHUB_USERNAME,
        linesAddedLifetime,
        commits12mo,
        prsMerged,
        starsTotal
    };
}

async function main() {
    try {
        const metrics = await buildMetrics();

        const outputPath = join(__dirname, '..', 'public', 'metrics.json');
        writeFileSync(outputPath, JSON.stringify(metrics, null, 2));

        console.log('\n✅ Metrics generated successfully!');
        console.log(`📁 Output: ${outputPath}`);
        console.log('\nMetrics summary:');
        console.log(`  Lines Added (lifetime): ${metrics.linesAddedLifetime?.toLocaleString() || 'N/A'}`);
        console.log(`  Commits (12 months): ${metrics.commits12mo?.toLocaleString() || 'N/A'}`);
        console.log(`  PRs Merged: ${metrics.prsMerged?.toLocaleString() || 'N/A'}`);
        console.log(`  Total Stars: ${metrics.starsTotal?.toLocaleString() || 'N/A'}`);
    } catch (error) {
        console.error('❌ Error building metrics:', error);
        process.exit(1);
    }
}

main();
