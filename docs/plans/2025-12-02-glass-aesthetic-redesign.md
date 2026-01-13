# Portfolio Glass Aesthetic Redesign

**Date:** 2025-12-02
**Status:** Implemented
**Aesthetic:** Subtle Luxury + Minimal Glass Touches (A+C Hybrid)

> **Update (2026-01):** Background is now a procedurally-generated GPU silicon die canvas. Blur values reduced significantly (2-4px) to preserve background visibility while maintaining glass aesthetic through transparency, borders, and glows.

---

## Overview

Transform the portfolio into a cohesive glass-themed experience with **intentional contrast**: refined glass aesthetic throughout the site, interrupted by a maximally-interactive Windows XP IE window for the Projects section. Additionally, replace live GitHub metrics with weekly-updated growth visualizations that tell a compelling year-over-year story.

### Core Principles

1. **Subtle Luxury** - Glass effects are sophisticated, not flashy
2. **Minimal Touches** - Glass is the seasoning, not the main dish
3. **Intentional Contrast** - XP window draws attention through nostalgia
4. **Responsive Scaling** - Works beautifully from mobile to 4K
5. **Performance First** - Fast load times, accessibility built-in
6. **Delightful Over-Engineering** - XP window is absurdly functional

---

## 1. Visual System & Hierarchy

### Glass Treatment Layers

**Tier 1: Navigation (Permanent Glass)**
- Light backdrop-filter with 4px blur (reduced to show silicon die background)
- Sticky positioning with smooth opacity fade on scroll
- Bottom border glow that intensifies when scrolled
- `backdrop-filter: blur(4px) saturate(120%)`

**Tier 2: Content Sections & Cards (Subtle at Rest)**
- Very soft glass borders (barely visible)
- Gentle glow around edges (4px radius, low opacity)
- Minimal blur (2px via `--glass-blur`), relies on transparency + borders
- Silicon die background visible through all glass elements

**Tier 3: Interactive States (Enhanced)**
- Hover: Glass intensifies (more blur, brighter glow, translateY lift)
- Focus: Border illuminates with primary color
- Active: Slight scale (1.02) + enhanced glass
- All transitions: 0.3s ease

**The Exception:**
Projects section wrapped in fully-functional Windows XP IE window - intentional visual interruption to draw attention.

### CSS Custom Properties

```css
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-glow: rgba(0, 212, 255, 0.2);
--glass-blur: 2px;  /* Reduced from 20px to preserve silicon die background */
```

Light theme adjusts opacity/colors accordingly. Background visibility is prioritized over heavy frosting.

---

## 2. Hero Name Treatment

### "Mykolas Perevicius" - Layered Text Approach

**No containers. No WebGL. Pure CSS depth.**

**Typography:**
- Fluid sizing: `clamp(2.5rem, 6vw, 4.5rem)`
- Ensures single line on all screens (desktop → mobile)
- Letter-spacing: `0.02em` for elegance
- Font: Existing display font (Space Grotesk)

**Visual Layers (bottom to top):**

1. **Ambient Aura** - Very large soft shadow (60-80px radius, 0.15 opacity, turquoise tint)
2. **Glow Foundation** - Multiple text-shadows at 20-40px radius (0.3-0.4 opacity, cyan)
3. **Depth Shadows** - Sharper shadows closer to text (4-8px offset, darker, defined)
4. **Base Gradient Text** - Gradient from `var(--text)` → `var(--primary-color)` with `background-clip: text`

**Animation (respects prefers-reduced-motion):**
- Gentle breathing effect on glow intensity (4-5s loop)
- Shadow radius pulses slightly (± 5px)
- No position changes, only luminosity

**Example CSS:**

```css
.hero-name {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, var(--text), var(--primary-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow:
    0 0 40px rgba(0, 212, 255, 0.4),
    0 0 80px rgba(64, 224, 208, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.5),
    0 8px 16px rgba(0, 0, 0, 0.3);
  animation: heroGlow 4s ease-in-out infinite;
}

@keyframes heroGlow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.15); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-name { animation: none; }
}
```

---

## 3. Glass System - Cards & Sections

### Project Cards (Skills, Experience, Education)

**At Rest:**
```css
.card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--glass-blur)) saturate(120%);
  box-shadow: 0 4px 12px var(--glass-glow);
  border-radius: 12px;
  transition: all 0.3s ease;
}
```

**On Hover:**
```css
.card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary-color);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.4);
  transform: translateY(-4px);
}
```

### Section Containers

- Very subtle glass frame around entire section
- Softer blur (10px), lower opacity
- Acts as visual grouping, not hard separation
- No hover states (not interactive)

### Graceful Degradation

**No backdrop-filter support:**
```css
@supports not (backdrop-filter: blur(20px)) {
  .glass-element {
    background: rgba(255, 255, 255, 0.12); /* Slightly more opaque */
  }
}
```

---

## 4. Windows XP Window - Core Structure

### Authentic XP Aesthetic

**Preserve existing:**
- Blue gradient title bar (exact XP colors: `#0997ff` → `#0033cc`)
- IE icon in title bar
- Window control buttons (minimize, maximize, close)
- Menu bar (File, Edit, View, Favorites, Tools, Help)
- Address bar with "Go" button
- Beige content area background

**Client-side state management:**
- All interactivity via vanilla JavaScript
- State persists to localStorage
- No backend dependencies

---

## 5. XP Window - Browser Controls (Working)

### Address Bar

**Functionality:**
- Shows current filter: `https://perevici.us/projects/all`
- Actually editable via click
- Type paths: `/frontend`, `/backend`, `/gpu`, `/fullstack`, `/all`
- Enter key applies filter
- Auto-complete dropdown with suggestions
- Typing triggers status bar loading animation

**UI:**
- IE icon at start of input
- Editable text input (styled as XP address bar)
- "Go" button on right
- Focus state with XP blue outline

### Navigation Buttons

**Back/Forward:**
- Navigate through filter history
- Gray out when at history limits
- Push state to browser history for actual back/forward button support

**Refresh:**
- Shuffles project order randomly
- Spinning refresh icon during "load"
- Status bar shows "Refreshing... Please wait..."

**Stop:**
- Freezes all animations on entire page
- Button remains depressed while stopped
- Click again to resume

**Home:**
- Resets to "all projects" view
- Clears filter history

### Favorites Menu

**Dropdown shows:**
- Preset filters as "bookmarks"
- "Add to Favorites..." option
- Custom favorites saved to localStorage
- Star icons for bookmarked filters

**Interaction:**
- Click menu item applies filter
- "Add to Favorites" prompts for name
- Can remove favorites via right-click

---

## 6. XP Window - Window Management

### Existing Features (Keep)

- **Dragging:** Title bar is draggable (desktop only)
- **Minimize/Restore:** Toggle via button

### New Features

**Actual Maximize:**
- Window expands to fill viewport (minus small margin)
- Projects grid goes full-width (4-5 columns)
- Title bar button changes to "Restore" icon
- Click again to restore original size/position

**Minimize to Taskbar:**
- Creates Windows XP taskbar at bottom of screen
- Minimized window appears as taskbar button
- Click button to restore window
- Taskbar auto-hides when no windows minimized
- Taskbar includes Start button (cosmetic) and clock

**Multi-Window Mode:**
- Click project card → spawns new XP window with project details
- Each window:
  - Independently draggable
  - Has own title (e.g., "Internet Explorer - Koala's Forge")
  - Close button functional
  - Z-index managed (click brings to front)
- Limit: 3-4 windows max to avoid chaos
- Child windows smaller than parent

---

## 7. XP Window - Status Bar & Loading

### Status Bar Layout

**Left:** Dynamic status messages
**Center:** Security icon (padlock) - click shows joke certificate
**Right:** "Internet" zone indicator
**Far Right:** Progress indicator area

### Status Messages

```
"Ready" → Idle state
"Loading projects..." → With progress bar
"Filtering by Frontend..." → Quick flash
"Refreshing... Please wait..." → Spinner icon
"X projects found" → After search
"Downloading project details... 128KB of 420KB" → Fake progress
"Done" → After action completes
```

### Progress Bars

**Visual:**
- Classic XP green progress bar (chunky segments)
- Percentage text inside bar
- Appears in far-right status area

**Behavior:**
- Artificially slowed to ~800ms for nostalgia
- Appears for any "loading" action (even instant ones)
- Smooth fill animation

### Loading Theater

**When switching filters or navigating:**
1. Address bar shows loading animation (shimmer)
2. Throbber icon spins in toolbar
3. Status bar shows "Connecting to server..."
4. Progress bar fills from 0-100%
5. Content fades out → updates → fades in
6. Status changes to "Done" then "Ready"

**All fake. All instant. All delightful.**

---

## 8. XP Window - Right-Click Menus

### Context Menu System

**Right-click Title Bar:**
```
Restore
Move
Size
Minimize
Maximize
─────────────
Close     Alt+F4
```
- Classic XP menu styling (gray, beveled borders)
- All items functional
- Keyboard shortcuts shown (but don't need to work)

**Right-click Project Card:**
```
Open
Open in New Window
─────────────
Add to Favorites...
─────────────
Copy Project Link
View Source
Properties
```
- "Open in New Window" spawns child XP window
- "View Source" opens modal with project code snippet
- "Properties" shows XP properties dialog:
  - Project name, type, date created
  - Fake file size, tags
  - Tech stack listed as "file contents"
- "Copy Project Link" copies URL to clipboard

**Right-click Address Bar:**
```
Undo
─────────────
Cut
Copy
Paste
Delete
─────────────
Select All
```
- Standard edit menu
- Actually works for text editing

### Context Menu Behavior

- Click outside to close
- Mouse out delay before closing (XP-style)
- Disabled items grayed out
- Hover highlights with XP blue
- Animations: Fade in (100ms)

---

## 9. XP Window - Easter Eggs

### 1. Konami Code in XP Window

**Trigger:** ↑↑↓↓←→←→BA while XP window has focus

**Effect:**
- XP error dialog appears: "This program has performed an illegal operation"
- Details button shows fake error code
- Click OK → Projects shuffle and dance for 2 seconds

### 2. Triple-Click Title Bar

**Effect:**
- Window shakes violently (5px random offset, 10 times)
- Title bar text changes to "(Not Responding)"
- After 2 seconds, recovers to normal
- Status bar shows "Recovering application..."

### 3. Address Bar: `about:projects`

**Effect:**
- Shows "About Internet Explorer" dialog
- But displays portfolio stats instead:
  - Version: "6.0 (Mykolas Edition)"
  - Total Projects: X
  - Lines of Code: X
  - Coffee Consumed: X cups (joke stat)

### 4. Click IE Icon 5 Times Fast

**Effect:**
- Clippy appears in bottom-right: "It looks like you're viewing projects. Would you like help?"
- Yes button → Shows helpful tooltips on project cards
- No button → Clippy sadly leaves
- Clippy animation: Slide in from bottom-right, bounce

---

## 10. GitHub Metrics - Growth Chart + Timeline

### Data Collection Strategy

**GitHub Actions - Weekly Cron Job:**

```yaml
name: Update GitHub Metrics
on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday at midnight UTC
  workflow_dispatch:  # Manual trigger option

jobs:
  update-metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Fetch GitHub Stats
        run: node scripts/fetch-github-metrics.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Commit Data
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/metrics/
          git commit -m "Update GitHub metrics [skip ci]" || exit 0
          git push
```

**Data Storage:**

Each week creates: `data/metrics/YYYY-MM-DD.json`

```json
{
  "date": "2025-12-02",
  "totalStars": 245,
  "totalRepos": 28,
  "totalCommits": 1547,
  "followers": 89,
  "pullRequests": 156,
  "closedIssues": 43,
  "contributions": 2104,
  "topLanguages": {
    "Python": 45,
    "JavaScript": 30,
    "C++": 15,
    "Other": 10
  }
}
```

Historical data accumulates indefinitely.

### Visualization Layout

**Section Structure:**
```
┌─────────────────────────────────────────┐
│  GitHub Activity (glass section frame)  │
├─────────────────────────────────────────┤
│  [Key Stats Cards - Current Numbers]    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  │245 │ │28  │ │1.5K│ │89  │           │
│  │★   │ │Repo│ │Cmt │ │Flw │           │
│  └────┘ └────┘ └────┘ └────┘           │
├─────────────────────────────────────────┤
│  [Growth Chart - Toggleable Metrics]    │
│  [Line graph with gradient fill]        │
│  Toggle: [Commits][Stars][PRs][Contrib] │
│  View: [YTD][6 Months][All Time]        │
├─────────────────────────────────────────┤
│  [Timeline - Notable Achievements]       │
│  ● Launched Koala's Forge (Nov 2025)    │
│  ● Hit 200 stars total (Oct 2025)       │
│  ● Contributed to 15 OSS projects       │
└─────────────────────────────────────────┘
```

### Top Section - Key Stats

**Layout:**
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Each stat card: Glass effect with hover enhancement

**Card Contents:**
- Large number (primary metric)
- Label below number
- Small sparkline (last 12 weeks trend)
- Trend indicator: ↑ +15% or ↓ -3%
- Hover: Tooltip with details

**Stats to Show:**
1. Total Stars
2. Total Repositories
3. Total Commits (this year)
4. Followers
5. Pull Requests Merged
6. Open Source Contributions

### Middle Section - Growth Chart

**Chart Library:** Chart.js or Recharts (lightweight)

**Configuration:**
- Type: Area chart (line with gradient fill)
- Gradient: Primary color → transparent
- X-Axis: Time (weeks/months, intelligent scaling)
- Y-Axis: Metric value (auto-scale)
- Grid: Subtle, glass-themed
- Responsive: Adapts to container width

**Toggle Buttons:**
- Style: Glass pill buttons
- Metrics: Commits, Stars, PRs, Contributions
- Active state: Highlighted with primary color
- Click switches chart data smoothly

**View Switchers:**
- Year to Date (default)
- Last 6 Months
- All Time (since first data point)

**Interactions:**
- Hover over chart: Tooltip shows exact values + date
- Click data point: Highlights that week in timeline (if applicable)
- Smooth transitions between metrics (0.5s ease)

### Bottom Section - Timeline

**Data Sources:**

Auto-generated events:
- First commit to new repo → "Launched [Project Name]"
- Star milestones → "Hit X stars total"
- Contribution patterns → "Contributed to Y open source projects"

Manual events (from `data/timeline-events.json`):
```json
[
  {
    "date": "2025-11-15",
    "icon": "🚀",
    "title": "Launched Koala's Forge",
    "description": "Cross-platform system installer supporting 100+ applications"
  }
]
```

**Visual Design:**
- Vertical timeline (line down left side)
- Glass cards on timeline nodes
- Icons on left of each event
- Date + title + description
- Chronological order (newest first)
- Infinite scroll or "Load More" if many events

**Responsive:**
- Desktop: Side-by-side layout (icon | content)
- Mobile: Stacked (icon above content)

---

## 11. Mobile Responsiveness

### Breakpoints

- Desktop: > 1024px (full features)
- Tablet: 768px - 1024px (simplified XP)
- Mobile: < 768px (XP aesthetic only)

### XP Window on Mobile (< 768px)

**Transforms:**
- No dragging (doesn't make sense on touch)
- No multi-window spawning
- Menu bar: Hidden
- Toolbar/Address bar: Hidden
- Window controls: Close button only
- Window: Full width minus 16px margin
- Content: Vertically stacked project cards

**Becomes:** XP-styled section container (not functional window)

**Context Menus:**
- Right-click → Long-press (500ms)
- Shows simplified action sheet (native iOS/Android style)

### XP Window on Tablet (768px - 1024px)

**Keeps:**
- Dragging (touch drag works)
- Address bar (simplified)
- Window controls (all buttons)
- Single window only

**Removes:**
- Multi-window spawning
- Some toolbar buttons
- Complex menus

### Touch Interactions

**Requirements:**
- Tap targets: Minimum 48×48px
- Drag: Works with touch events
- Buttons: Visual press state
- Address bar: Touch keyboard friendly
- Menus: Larger spacing for fat fingers

### Glass Effects on Mobile

**Considerations:**
- Backdrop-filter can be slow on low-end devices
- Provide fallback for older browsers
- Test on actual devices (iOS Safari, Chrome Android)

**Performance mode:**
- Detect low-end device (via user agent or performance API)
- Reduce blur radius (10px instead of 30px)
- Fewer shadows
- Simpler animations

---

## 12. Performance & Optimization

### Load Time Targets

- First Contentful Paint: < 1.2s
- Time to Interactive: < 2.5s
- Largest Contentful Paint: < 2.0s
- Cumulative Layout Shift: < 0.1
- Lighthouse Score: 90+ (all categories)

### Code Splitting

**Critical (inline or early load):**
- Hero styles (glass name effect)
- Navigation styles
- Core layout CSS

**Deferred:**
- XP window JS (lazy load after hero visible)
- GitHub metrics chart library (intersection observer)
- Context menu system (on-demand)

### CSS Optimizations

**Backdrop-filter:**
- Use sparingly (GPU intensive)
- Test fallbacks for unsupported browsers
- Avoid on elements that repaint frequently

**Animations:**
- Prefer `transform` and `opacity` (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly (memory cost)

**Examples:**
```css
/* Good */
.card:hover {
  transform: translateY(-4px);
  opacity: 0.9;
}

/* Bad */
.card:hover {
  margin-top: -4px;
  background: rgba(0, 0, 0, 0.9);
}
```

### JavaScript Optimizations

**Event Handling:**
- Debounce window drag events (16ms / 60fps)
- Throttle scroll listeners
- Passive event listeners where possible

**DOM Manipulation:**
- Batch updates (use DocumentFragment)
- Avoid layout thrashing (read then write)
- Virtual scrolling if project list exceeds 50 items

**State Management:**
- localStorage writes debounced (500ms)
- Minimize re-renders
- Memoize expensive computations

### Asset Optimization

**Images:**
- WebP with PNG/JPG fallback
- Responsive images (srcset)
- Lazy loading (loading="lazy")
- Compress all images (< 100KB each)

**Fonts:**
- Preload critical fonts
- Font-display: swap
- Subset fonts (Latin only if possible)

---

## 13. Accessibility

### Keyboard Navigation

**Global:**
- Tab: Navigate interactive elements
- Shift+Tab: Navigate backwards
- Enter/Space: Activate buttons
- Escape: Close dialogs/menus
- Arrow keys: Navigate menus

**XP Window Specific:**
- Tab into window controls
- Enter: Click focused button
- Alt+F4: Close window (optional easter egg)
- Ctrl+L: Focus address bar

### Screen Reader Support

**XP Window:**
```html
<div role="dialog" aria-labelledby="xp-title" aria-modal="false">
  <div class="xp-titlebar">
    <h2 id="xp-title">Projects - Internet Explorer</h2>
    <div class="xp-controls">
      <button aria-label="Minimize window">_</button>
      <button aria-label="Maximize window">□</button>
      <button aria-label="Close window">×</button>
    </div>
  </div>
  ...
</div>
```

**Status Bar:**
```html
<div class="xp-status" role="status" aria-live="polite" aria-atomic="true">
  <span id="status-text">Ready</span>
</div>
```

**Menus:**
```html
<ul role="menu">
  <li role="menuitem" tabindex="0">Open</li>
  <li role="menuitem" tabindex="0">Open in New Window</li>
</ul>
```

### Focus Management

**Visible Focus Indicators:**
- XP-styled blue outline (2px solid)
- High contrast (4.5:1 minimum)
- Never `outline: none` without replacement

**Focus Trapping:**
- When modal dialog opens (e.g., error dialog)
- Focus moves to first interactive element
- Tab cycles within dialog
- Escape closes dialog and returns focus

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Keep functional transforms */
  .xp-window {
    transition: transform 0.2s ease;
  }
}
```

**Disable:**
- Breathing animations
- Window shake easter egg
- Progress bar animations
- Sparkline animations

**Keep:**
- Window minimize/maximize (functional)
- Hover effects (instant)
- Focus indicators

### Color Contrast

**Requirements:**
- Text: Minimum 4.5:1 (WCAG AA)
- Large text: Minimum 3:1
- UI components: Minimum 3:1

**Glass Effects:**
- Never reduce text contrast below threshold
- Test with color contrast tools
- Provide high contrast mode option if needed

---

## 14. Browser Support

### Target Browsers

**Fully Supported:**
- Chrome/Edge 90+ (2021+)
- Firefox 88+ (2021+)
- Safari 14+ (2020+)

**Graceful Degradation:**
- Chrome/Edge 80-89
- Firefox 78-87
- Safari 12-13

**Not Supported:**
- IE11 (no longer supported by Microsoft)
- Very old mobile browsers

### Feature Detection

**Backdrop-filter:**
```css
@supports (backdrop-filter: blur(20px)) {
  .glass-element {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.05);
  }
}

@supports not (backdrop-filter: blur(20px)) {
  .glass-element {
    background: rgba(255, 255, 255, 0.12);
  }
}
```

**CSS Grid:**
```css
@supports (display: grid) {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

@supports not (display: grid) {
  .stats-grid {
    display: flex;
    flex-wrap: wrap;
  }
}
```

---

## 15. Implementation Phases

### Phase 1: Foundation (Week 1)

- Remove WebGL code entirely
- Implement hero name layered text effect
- Set up CSS custom properties for glass system
- Apply glass effects to nav bar
- Test on multiple devices

### Phase 2: Glass System (Week 1)

- Apply glass effects to cards (Skills, Experience, Education)
- Implement hover states
- Create section containers with glass frames
- Test accessibility (keyboard nav, screen readers)
- Performance check (Lighthouse)

### Phase 3: XP Window Core (Week 2)

- Enhance existing XP window structure
- Implement working address bar with filtering
- Add back/forward/refresh button functionality
- Create favorites system
- Status bar with dynamic messages

### Phase 4: XP Window Advanced (Week 2)

- Multi-window spawning
- Taskbar with minimize functionality
- Actual maximize/restore
- Loading states and progress bars

### Phase 5: XP Context Menus (Week 3)

- Right-click menu system
- Project card context menus
- Address bar edit menu
- Menu keyboard navigation

### Phase 6: Easter Eggs (Week 3)

- Konami code
- Triple-click title bar
- Clippy appearance
- about:projects page

### Phase 7: GitHub Metrics (Week 4)

- GitHub Actions workflow for data collection
- Data schema and storage
- Stat cards with sparklines
- Growth chart component
- Timeline component

### Phase 8: Mobile & Polish (Week 4)

- XP window mobile adaptations
- Touch interaction refinements
- Performance optimization pass
- Accessibility audit
- Cross-browser testing

---

## 16. Testing Checklist

### Visual Testing

- [ ] Hero name looks correct (no wrapping, proper glow)
- [ ] Glass effects visible but subtle
- [ ] XP window looks authentic
- [ ] Cards have proper hover states
- [ ] Status bar updates correctly
- [ ] Context menus styled properly

### Functional Testing

- [ ] Address bar filtering works
- [ ] Back/forward buttons work
- [ ] Refresh shuffles projects
- [ ] Multi-window spawning works
- [ ] Minimize to taskbar works
- [ ] Context menus trigger correctly
- [ ] Easter eggs trigger reliably

### Responsive Testing

- [ ] Desktop: Full XP functionality
- [ ] Tablet: Simplified XP works
- [ ] Mobile: XP aesthetic renders
- [ ] Glass effects scale properly
- [ ] Touch interactions work

### Performance Testing

- [ ] Lighthouse score 90+
- [ ] First Contentful Paint < 1.2s
- [ ] No layout shift
- [ ] Animations smooth (60fps)
- [ ] No memory leaks (long sessions)

### Accessibility Testing

- [ ] Keyboard navigation complete
- [ ] Screen reader announces properly
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG AA
- [ ] Reduced motion respected

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Chrome Android

---

## 17. Success Metrics

### Qualitative

- Design feels cohesive and intentional
- XP window is delightfully over-engineered
- Glass effects enhance without distracting
- Personality shines through (serious but playful)

### Quantitative

- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- Time on Projects section: +30% (vs current)
- Interaction rate with XP features: >50% of visitors
- Mobile bounce rate: < 40%

---

## Next Steps

1. **Review & Approve** this design document
2. **Create Git Worktree** for isolated development
3. **Write Implementation Plan** with detailed tasks
4. **Execute in Phases** as outlined above
5. **Test & Iterate** based on real device feedback
6. **Deploy** when all phases complete

---

**End of Design Document**
