# Perevici.us Design System

## Visual Direction
A warm, humanist tech aesthetic: ember copper + tidal teal over paper/ink neutrals. The goal is to feel engineered, calm, and distinct without neon or generic gradients.

## Source of Truth
All core tokens live in `css/theme.css`. Update tokens there and reference them via CSS variables everywhere else. Avoid hardcoded colors in CSS/JS.

## Color System
### Core Surfaces
- `--bg` (primary background)
- `--bg-elev` (raised surfaces)
- `--border` (dividers and outlines)
- `--chip-bg`, `--chip-text`
- `--text`, `--muted`, `--link`

### Brand Accents
- `--primary-color` (ember/copper)
- `--secondary-color` (warm sand)
- `--accent-color` (tidal teal)
- `--on-primary` / `--on-accent` for text on gradients

### Status
- `--success`, `--success-bg`
- `--danger`, `--danger-bg`

### Glass System
- `--glass-bg` (frosted base)
- `--glass-bg-strong` (hover/active)
- `--glass-border`, `--glass-border-alt`
- `--glass-glow`, `--glass-glow-alt`
- `--glass-blur`

### RGB Helpers
Use for transparent glows and gradients:
- `--primary-rgb`, `--secondary-rgb`, `--accent-rgb`, `--shadow-rgb`

### Utility
- `--overlay` (modal scrim)
- `--nav-fallback-bg` (no-backdrop-filter fallback)

## Typography
- **Display**: `Fraunces` (600/700) for `h1-h3`
- **Sans**: `Sora` for body, UI, and buttons
- **Mono**: `JetBrains Mono` for tags, stats, and code

## Shape Language
- `--radius-card`: asymmetric corner treatment for cards and panels
- `--radius-pill`: pills for buttons, tags, and badges
- `--radius-sm` / `--radius-md` for inputs and UI blocks

## Shadows & Glows
- `--shadow-soft`, `--shadow-medium`, `--shadow-strong`
- `--glow-primary`, `--glow-accent` for hover emphasis

## Motion
- Default: `var(--transition)` (0.3s cubic-bezier(0.4, 0, 0.2, 1))
- Respect `prefers-reduced-motion` and remove non-essential animations

## Component Guidelines
- **Buttons**: pill radius, `primary` uses gradient `primary to accent`, text uses `--on-primary`.
- **Cards**: glass background + border-image, `--radius-card`, glow on hover.
- **Badges/Tags**: compact pill chips, mono font, subdued backgrounds.
- **Nav**: glass + blur with subtle shadow; avoid heavy borders.

## Accessibility
- Focus rings use `--primary-color`.
- Preserve WCAG AA contrast for text and links (especially in light theme).

## Exceptions (Intentional)
Retro UI modules deliberately use fixed palettes:
- Windows XP/Word UI (`css/word-window.css`, `js/xp-*`, `js/word-*`).
These are stylistic Easter eggs and should not inherit the main palette.

## Update Workflow
1. Change tokens in `css/theme.css`.
2. Propagate via CSS variables (avoid hardcoded colors).
3. Keep JS color usage synced by reading CSS variables via `getComputedStyle`.
