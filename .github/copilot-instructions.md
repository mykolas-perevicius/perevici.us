# perevici.us - Copilot Instructions

## Project Overview
Personal portfolio website for Mykolas Perevicius - a full-stack engineer. **Single-page app**: everything loads from `index.html` with vanilla JavaScript modules, no frameworks. Focus: high performance (Lighthouse 95+), accessibility, SEO, and interactive features.

## Architecture & Key Components

### Page Structure
- **Single `index.html`** with semantic sections: hero, stats, GitHub stats, experience timeline, projects grid, skills matrix, education, blog teaser, contact
- **Modular CSS**: `theme.css` (CSS variables, theming), `components.css` (UI elements), `main.css` (layout/sections)
- **Module-based JS** in `js/`: `main.js` (initialization), `terminal.js`, `konami.js`, `hints.js`, `shortcuts.js`, `metrics.js`

### Theme System
- **CSS Variable approach** (`theme.css`): All colors use custom properties (`--bg`, `--text`, `--link`, etc.)
- **Data attribute switching**: `<html data-theme="dark">` toggles between dark/light presets
- **Persistence**: Theme choice saved to `localStorage` under key `'theme'`
- **WCAG AA compliant**: Light and dark palettes tested for contrast ratios

### JavaScript Modules (ES6 imports in `main.js`)
Each module exports an `init*` function called from `main.js`:
- `terminal.js`: Backtick (`` ` ``) toggles terminal overlay, ESC closes
- `shortcuts.js`: Vim-style navigation (j/k scroll, gg/G jump, p/e/c navigate to sections)
- `konami.js`: ↑↑↓↓←→←→BA triggers Matrix rain effect
- `hints.js`: IntersectionObserver shows hint chips on scroll with data-hint-anchor
- `metrics.js`: Injects live GitHub stats (followers, repos, stars) from `public/metrics.json`

## Critical Patterns & Conventions

### Data-Driven Sections
Experience, projects, and skills are **HTML-based** (hardcoded in index.html), not dynamically fetched. If adding new sections, maintain semantic structure: `<section id="section-name">` with data attributes for JS hooks.

### GitHub Metrics Pipeline
1. `npm run build-metrics` → runs `scripts/build-metrics.ts` (Node.js script fetching GitHub API)
2. Outputs to `public/metrics.json` with schema: `{ generatedAt, username, linesAddedLifetime, commits2025, prsMerged, starsTotal }`
3. Deployed to GitHub Pages (`/public` → root via build output)
4. `metrics.js` loads this JSON and injects values into DOM (`data-stat-value` attributes)

### Accessibility & Motion
- All interactive elements: `aria-label` attributes, `:focus-visible` outlines
- Animations wrapped in `@media (prefers-reduced-motion: reduce)`
- Keyboard navigation fully supported (no mouse-only interactions)

### Mobile Responsiveness
- Mobile-first CSS: `@media (max-width: 480px)` for small screens
- Hero social links stack vertically on mobile (flex-column layout)
- Terminal overlay and hints scale appropriately

## Development Workflow

### Build Metrics
```bash
npm run build-metrics
```
Requires `GITHUB_TOKEN` env var (optional, but recommended to avoid rate limits). Outputs to `public/metrics.json`.

### Local Testing
```bash
npm run serve  # Python HTTP server on :8000
# or open index.html directly in browser
```

### Deployment
- Push to `main` branch → GitHub Pages auto-builds and deploys to `https://perevici.us`
- CNAME file ensures custom domain routing
- DNS configured via Namecheap (4 A records pointing to GitHub Pages IPs)

## When Making Changes

### Adding Features
- Keep vanilla JS (no frameworks) — prioritize performance
- Use CSS variables for new colors (don't hardcode colors)
- Add keyboard shortcuts in `shortcuts.js` if navigation-related
- Test in both light and dark themes using the toggle button

### Updating Content
- Hero section roles (typing animation): edit array in `main.js` ~line 39
- Experience/projects: add `<div>` blocks in appropriate section with semantic `id` attributes
- Add hints via `data-hint-anchor` attributes on sections and load in `hints.js`

### Adding External Data
- Mirror metrics.json pattern: fetch data in build script, output to JSON, load via module
- Never fetch live APIs from browser if avoidable (use build-time generation for performance)

### CSS/Theming Changes
- Define new colors in `:root` and `[data-theme="light"]` in `theme.css`
- Use `var(--token-name)` in component/layout files
- Test contrast with WebAIM Contrast Checker

## File Reference Map
- **Entry point**: `index.html` (534 lines, all HTML/markup)
- **Theme logic**: `css/theme.css` (CSS variables + prefers-reduced-motion)
- **Main init**: `js/main.js` (theme toggle, typing animation, module imports)
- **Metrics build**: `scripts/build-metrics.ts` (GitHub API client, JSON output)
- **CI/CD**: `package.json` has `build-metrics`, `serve`, test scripts; `.github/workflows` handles GitHub Pages

## No-Go Zone
- Don't add heavy dependencies (jQuery, Bootstrap, frameworks)
- Don't hardcode colors directly (use CSS variables)
- Don't make keyboard shortcuts conflict with native browser shortcuts (? was removed, ` is safe)
- Don't assume metrics.json is always available (graceful fallback to "Loading..." if fetch fails)
