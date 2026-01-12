/**
 * Serverless API Endpoint for GitHub Metrics
 *
 * Compatible with Vercel, Netlify, and other serverless platforms
 * Serves cached metrics with proper headers
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
    try {
        // Read the pre-generated metrics.json
        const publicPath = join(process.cwd(), 'public', 'metrics.json');
        const metricsPath = existsSync(publicPath)
            ? publicPath
            : join(process.cwd(), 'metrics.json');
        const metrics = JSON.parse(readFileSync(metricsPath, 'utf-8'));

        // Set cache headers (cache for 1 hour)
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

        return res.status(200).json(metrics);
    } catch (error) {
        console.error('Error serving metrics:', error);

        // Return empty metrics on error
        return res.status(500).json({
            generatedAt: null,
            username: 'mykolas-perevicius',
            linesAddedLifetime: null,
            commitsLastYear: null,
            weeklyCommitsLastYear: [],
            rollingYearStart: null,
            rollingYearEnd: null,
            prsMerged: null,
            starsTotal: null,
            error: 'Failed to load metrics'
        });
    }
}
