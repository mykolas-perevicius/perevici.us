# Portfolio Redesign: Project-Focused Liquid Glass

**Date:** 2026-02-02
**Status:** Approved
**Goal:** Full redesign with focus on projects, sophisticated Apple Liquid Glass effects, removal of fluff

---

## Design Philosophy

Strip away distractions. Let the work speak. Premium glass aesthetic that feels alive without stealing focus from content.

---

## 1. Hero Section

### Layout
- Full-viewport height
- **Top:** Name + one-line tagline (no lengthy intro)
- **Center:** Featured project spotlight—large Liquid Glass card with:
  - Project screenshot/visual (Distributed AlexNet recommended as featured)
  - Title + one-sentence hook
  - CTA button to view project
- **Bottom:** Subtle scroll indicator

### Glass Treatment
- Multi-layered translucency
- Soft refraction on card edges
- Specular highlight that shifts on scroll
- Adaptive shadow responding to background colors

### Background
- Three.js particles at **full vibrancy**
- Animation most prominent here

---

## 2. Background Strategy

### Depth-Aware Dimming
```
Hero (0-100vh):     100% particle opacity, full animation
Transition zone:    Gradient overlay fades in (100vh - 150vh)
Projects section:   ~30% particle visibility, semi-opaque dark layer
Experience section: ~10% particle visibility, nearly solid
Footer:             Solid dark gradient
```

### Contrast Layer
- Semi-transparent dark overlay between Three.js and content
- Ensures glass panels remain crisp and readable
- Glass panels get **stronger blur** (20-30px vs current 12px)

---

## 3. Projects Section

### Layout
- Section title: "Projects" (minimal, left-aligned)
- Responsive glass grid with slight bento variation

### Project List (in order)
1. **Distributed AlexNet** ⭐ Featured/larger card
   - CUDA/MPI GPU cluster, 4.6× speedup
   - Tags: CUDA, C++, MPI, PyTorch

2. **Piano-Keyboard-Trainer**
   - Browser-based QWERTY piano trainer
   - Tags: TypeScript, Web Audio API

3. **Video-Frame-Interpolation**
   - Benchmark study, 16 methods on gaming content
   - Tags: Python, Deep Learning, Computer Vision

4. **Koala's Forge**
   - Cross-platform system installer, 100+ apps
   - Tags: PowerShell, Bash, Python

5. **Education Playground**
   - 117 Jupyter notebooks, 90% student pass rate
   - Tags: Python, Jupyter, Education

6. **stocksandoptions.org**
   - Stock option tradeoff simulator
   - Tags: JavaScript, Finance

7. **Rosetta** 🚧 *In Progress*
   - [Details TBD]
   - Styled with "In Progress" badge, subtle WIP treatment

### Card Design
- **Default state:**
  - Glass panel with project screenshot/thumbnail
  - Project title visible
  - Subtle border glow

- **Hover state:**
  - Glass brightens
  - Description slides in from bottom
  - Tech tags appear
  - Refraction shift effect
  - Shadow deepens

### Glass Specifications
```css
/* Liquid Glass Card */
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(24px) saturate(120%);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow:
  0 8px 32px rgba(0, 0, 0, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.1),  /* top specular */
  inset 0 -1px 0 rgba(0, 0, 0, 0.1);       /* bottom shadow */
```

---

## 4. Experience Timeline

### Layout
- Clean section after projects
- Existing timeline structure preserved
- Upgraded to Liquid Glass aesthetic

### Visual Treatment
- Timeline line: subtle gradient glow (cyan → magenta)
- Each entry: lighter glass card treatment
- Current/active role: brighter specular highlight + subtle pulse
- Tech tags as glass pills
- Dates in monospace

### Entries to Keep
1. Software Engineer @ UserAuthGuard (Current)
2. Software Engineer Intern @ Bessemer Trust
3. Curriculum Developer @ The Coding Place
4. Software Engineer @ Project Innovate Newark
5. Research Intern @ Bergen Community College

---

## 5. Contact + Metrics Footer

### Layout
Two-zone glass panel:

```
┌─────────────────────────────────────────────────────────┐
│  [GitHub] [LinkedIn] [Email]    │  Commits • Repos • PRs │
│         Contact Links           │    GitHub Metrics      │
└─────────────────────────────────────────────────────────┘
                    © 2026 Mykolas Perevicius
```

### Contact Links
- Icon buttons with glass hover states
- GitHub, LinkedIn, Email

### Metrics Display
- Compact row of small glass pills
- Shows: commits this year, public repos, contributions
- Updates from existing metrics system

---

## 6. Removed Elements

| Element | Reason |
|---------|--------|
| Windows XP theming | Distracting from projects |
| Word 2003 resume modal | Novelty over function |
| Skills section | Tech shows on project cards |
| Blog section | Not the focus |
| Education section | Resume covers this |
| Separate metrics section | Moved to footer |
| Easter eggs (konami, matrix, terminal) | Clutter |
| i18n/language toggle | Simplify |

---

## 7. Technical Implementation

### Files to Modify
- `index.html` - Restructure to new sections
- `css/theme.css` - Enhanced glass variables
- `css/main.css` - New layout styles
- `css/components.css` - Liquid Glass components
- `js/three-background.js` - Depth-aware dimming
- `js/main.js` - Simplified interactions

### Files to Remove
- `css/word-window.css`
- `js/word-*.js`
- `js/xp-*.js`
- `js/konami.js`
- `js/terminal.js`
- `js/i18n.js`
- `js/hints.js`
- `css/blog-modal.css`
- `js/blog-modal.js`

### New Assets Needed
- Project screenshots/thumbnails for each project card
- Optimized images (WebP format, lazy loaded)

---

## 8. Color Palette

```css
/* Primary */
--primary: #00d4ff;      /* Cyan */
--accent: #a855f7;       /* Purple */
--accent-alt: #ec4899;   /* Magenta */

/* Glass */
--glass-bg: rgba(255, 255, 255, 0.03);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-highlight: rgba(255, 255, 255, 0.15);
--glass-blur: 24px;

/* Background */
--bg-deep: #050508;
--bg-overlay: rgba(5, 5, 8, 0.85);
```

---

## 9. Typography

- **Headings:** Space Grotesk (existing)
- **Body:** Inter (existing)
- **Code/Tags:** JetBrains Mono (existing)

No changes needed—current font stack is strong.

---

## 10. Responsive Behavior

### Desktop (1200px+)
- Projects: 3-column grid, featured card spans 2 columns
- Timeline: full width with comfortable spacing

### Tablet (768px - 1199px)
- Projects: 2-column grid
- Featured card: full width
- Timeline: condensed spacing

### Mobile (< 768px)
- Projects: single column, stacked cards
- Timeline: vertical, full-bleed cards
- Contact: stacked layout
- Three.js: reduced particle count for performance

---

## 11. Accessibility

- Maintain `prefers-reduced-motion` support
- Glass panels need sufficient contrast (WCAG AA)
- Focus states on all interactive elements
- Semantic HTML structure
- Alt text for project images

---

## 12. Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Three.js: requestAnimationFrame throttling on scroll
- Images: lazy loaded, WebP with fallbacks

---

## Sign-off

**Approved by:** User
**Date:** 2026-02-02
**Next step:** Implementation
