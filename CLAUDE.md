# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Mykolas Perevicius at https://perevici.us. Built with vanilla JavaScript (no frameworks) for maximum performance. Single-page app where everything loads from `index.html` with ES6 module-based JavaScript.

## Commands

```bash
npm run serve           # Start Python HTTP server on localhost:8000
npm run build-metrics   # Fetch GitHub stats and generate metrics.json (optional: GITHUB_TOKEN env var)
```

**Deployment**: Push to `main` branch → GitHub Pages auto-deploys to https://perevici.us

## Architecture

### File Structure
- **`index.html`** - Single entry point containing all HTML markup (~104KB)
- **`css/`** - Modular stylesheets: `theme.css` (CSS variables), `components.css`, `main.css`, plus feature-specific files
- **`js/`** - ES6 modules imported by `main.js`: each exports an `init*` function
- **`scripts/build-metrics.ts`** - Node.js script that fetches GitHub API and outputs `metrics.json`

### Theme System
- CSS variables defined in `css/theme.css` under `:root` (dark) and `[data-theme="light"]`
- Toggle via `<html data-theme="dark|light">` attribute
- Persisted to `localStorage` under key `'theme'`
- All colors must use CSS variables (`var(--bg)`, `var(--text)`, etc.) - never hardcode colors

### JavaScript Module Pattern
`main.js` is the orchestrator that imports and initializes all modules:
- `metrics.js` - GitHub stats display (fetches `/api/metrics` or `/metrics.json`)
- `terminal.js` - Backtick toggles terminal overlay
- `shortcuts.js` - Vim-style navigation (j/k, gg/G, p/e/c)
- `konami.js` - Matrix rain easter egg (↑↑↓↓←→←→BA)
- `hints.js` - IntersectionObserver reveals hint chips
- `word-window.js`, `xp-window.js` - Windows XP/Word 97 resume easter egg overlay

### GitHub Metrics Pipeline
1. `npm run build-metrics` runs TypeScript script fetching GitHub API
2. Outputs to `metrics.json` with: `linesAddedLifetime`, `commitsLastYear`, `monthlyCommitsLastYear`, `prsMerged`, `starsTotal`
3. `metrics.js` loads JSON and injects values into DOM via `data-stat-value` attributes
4. Always handle fetch failures gracefully (show "Loading..." fallback)

## Key Patterns

### Content Updates
- **Hero roles** (typing animation): Edit array in `js/main.js` around line 54-61
- **Experience/Projects/Skills**: Edit HTML directly in `index.html` sections
- **Resume data**: `data/resume-content.json`

### Adding New Features
- Keep vanilla JS - no frameworks
- Add keyboard shortcuts in `shortcuts.js` (avoid conflicts with browser shortcuts)
- Test both light and dark themes
- Wrap animations in `@media (prefers-reduced-motion: reduce)`
- Use `requestIdleCallback` for non-critical initialization

### CSS Guidelines
- Define new colors in both `:root` and `[data-theme="light"]` in `theme.css`
- Fonts: Fraunces (display), Sora (body), JetBrains Mono (code)
- Mobile-first with breakpoints at 480px, 768px

## Constraints

- No heavy dependencies (jQuery, Bootstrap, React, etc.)
- Never hardcode colors - always use CSS variables
- Don't fetch live APIs from browser at runtime (use build-time generation)
- Keyboard shortcuts must not conflict with native browser shortcuts
- Target Lighthouse 95+ score
