# Windows XP Word Resume Feature - Design Document

**Date:** December 2, 2025
**Status:** Approved for Implementation
**Author:** Claude Code + Mykolas Perevicius

## Overview

Add an interactive Microsoft Word 2003-styled resume viewer as a special project card in the existing Windows XP Internet Explorer projects window. When clicked, it opens a full-screen modal with authentic Word interface and a one-time scroll-triggered typing animation that renders the resume character-by-character with variable speed and realistic behavior.

## Architecture

### Component Structure

Three main components work together:

1. **Resume Project Card** - Special document card in the XP projects grid
2. **Word Modal Window** - Full-screen overlay with complete Word 2003 UI
3. **Typing Animation Engine** - Variable-speed character rendering system

### File Organization

```
js/
  word-window.js          # Main Word modal logic, window management
  word-typing.js          # Typing animation engine with variable speeds
  word-easter-eggs.js     # Toolbar interactions, Clippy, dialogs
css/
  word-window.css         # Complete Word 2003 styling (~400 lines)
data/
  resume-content.json     # Structured resume data with formatting
```

### Integration Points

**Resume.doc Card:**
- Added to projects grid HTML with class `project-card-document`
- Click handler triggers `openWordWindow()` from `word-window.js`
- Card styling matches Windows file icon aesthetic

**Word Window Flow:**
1. Create modal overlay with Word interface
2. Initialize blank document view (white page, margins visible)
3. Start typing animation after 500ms delay (simulates loading)
4. Attach easter egg event listeners to toolbar buttons
5. Status bar updates as typing progresses

## Word 2003 Interface Design

### Title Bar
- Classic XP blue gradient: `#0054E3` to `#3C8CFF`
- Icon: Microsoft Word blue "W" (data URI SVG)
- Text: "Resume.doc - Microsoft Word"
- Window controls: Minimize, Maximize, Close (standard XP style)
- Draggable by title bar (reuse existing XP window drag logic)

### Menu Bar
```
File | Edit | View | Insert | Format | Tools | Table | Window | Help
```
- Background: `#ECE9D8` (Office 2003 gray)
- Hover state: `#B6BDD2` (light blue highlight)
- **File menu functional:** Download PDF, Download DOC, Print, Close
- **Other menus:** Decorative/trigger easter eggs

### Toolbar (Two Rows)

**Row 1:**
- New, Open, Save, Print (separator)
- Cut, Copy, Paste (separator)
- Undo, Redo (separator)
- Insert Table, Insert Picture

**Row 2:**
- Font dropdown: "Times New Roman"
- Size dropdown: "12"
- Bold, Italic, Underline
- Align Left, Center, Right
- Bullets, Numbering

All buttons use authentic Office 2003 16x16px icons with slight 3D effect.

### Document Area
- White background `#FFFFFF` with subtle shadow/border
- Visible margins with light gray ruler marks (top/left)
- Paper size: 8.5" × 11" simulation, max-width 816px, centered
- Default styling: Times New Roman, 12pt, black text, 1" margins
- Scrollable for 2-page content

### Status Bar
- Background: `#ECE9D8` (matches menu bar)
- Left side: "Page 1 of 2"
- Center: "Ln 1, Col 1"
- Right side: "842 words"
- Updates as typing progresses

## Typing Animation Behavior

### Trigger & Flow
1. Window opens with completely blank document
2. Blinking cursor appears at top-left (500ms delay)
3. Typing begins automatically
4. One-time animation - once complete, text stays static
5. Cursor disappears after completion

### Variable Speed Logic

| Character Type | Speed | Behavior |
|----------------|-------|----------|
| Letters/numbers | 80ms | Standard typing pace |
| Spaces | 10ms | Fast (invisible anyway) |
| Newlines/paragraphs | 50ms | Quick formatting |
| Commas | 80ms + 200ms pause | Brief pause after |
| Periods | 80ms + 300ms pause | Longer pause after |
| Colons/semicolons | 80ms + 150ms pause | Medium pause after |
| Section headers | 60ms | Slightly faster (confident) |

### Realistic Touches
- **Typos:** 2-3 times during animation
  - Types wrong letter → pause 400ms → backspace (100ms) → correct letter
- **Cursor:** Blinks throughout at 500ms interval (standard CSS animation)
- **Completion:** Cursor disappears (simulates clicking away)

### Content Rendering Order
1. Header (name, contact info, centered)
2. Professional Summary (2-3 sentences)
3. Experience (4 jobs with bullets)
4. Technical Skills (categorized lists)
5. Education (NJIT details)
6. Projects (3-4 brief descriptions)

**Formatting preserved:**
- **Bold text** (name, job titles, company names)
- Line breaks and paragraph spacing
- Bullet points (• character)
- Indentation for bullets

**Performance:**
- Total typing time: 45-60 seconds
- Status bar word count updates every 5 words (not per character)
- Line/column updates every 10 characters

## Easter Eggs and Interactions

### File Menu (Functional)
- **Download PDF:** Shows dialog "Feature coming soon! Check back later." with OK button
- **Download DOC:** Same "coming soon" dialog
- **Print:** Triggers browser print dialog (print-optimized CSS)
  - Future enhancement: Show "PC LOAD LETTER" error first
- **Close:** Closes Word window, returns to projects grid

### Edit Menu (Easter Eggs)
- **Cut/Copy/Paste:** Dialog "You can't edit a resume this good!"
- **Find:** Opens find dialog, searching shows "Not found. This resume is perfect as-is."
- **Select All:** Brief blue highlight flash, then "Copying my resume? I'm flattered!"

### Format Menu (Easter Eggs)
- **Font:** Dialog showing only "Comic Sans" and "Wingdings" as options
  - Clicking either shows "Nice try." and closes
- **Bold button:** "Your resume is already bold enough!"
- **Italic button:** "Let's not get carried away"
- **Underline button:** "Underlining is so 2003... wait"

### Help Menu (Easter Eggs)
- **Office Assistant:** Spawns Clippy with randomized messages:
  - "It looks like you're trying to hire me. Would you like help with that?"
  - "I see you're viewing a resume. Did you know I'm available for interviews?"
  - "Tip: This resume is best viewed with coffee and an open req."
- **About Microsoft Word:** Fake dialog
  - "Microsoft Word 2003 (Build 11.0.5329)"
  - "Licensed to: Mykolas Perevicius"
  - "This product is for portfolio demonstration purposes"

### Toolbar Button Clicks
- Non-functional buttons show tooltips on hover
- Clicking triggers subtle effects or easter egg messages
- Future: Add sound effects (typing sounds, error beeps)

## Resume Content Structure

### Header (Centered, Bold)
```
MYKOLAS PEREVICIUS
Perevicius.Mykolas@gmail.com | linkedin.com/in/mykolasperevicius | github.com/mykolas-perevicius
```

### Professional Summary
Full-stack software engineer with expertise in distributed systems, GPU computing, and production-grade application development. Proven track record delivering high-performance applications with comprehensive test coverage, optimizing database queries and infrastructure, and shipping features that directly impact user productivity. Passionate about building scalable systems that balance technical excellence with practical user needs.

### Experience Section

#### Software Engineer | UserAuthGuard by Asan Digital | Oct 2025 - Present
- Develop and maintain full-stack Django REST API with PostgreSQL backend, achieving 90%+ test coverage through comprehensive unit and integration testing
- Implement end-to-end testing infrastructure using Playwright for frontend validation, ensuring application reliability across all user workflows
- Refactor legacy test suites from coverage-focused patterns to behavioral testing methodology, improving code maintainability and reducing false positives

#### Software Developer Intern | Bessemer Trust | Jun 2023 - Aug 2023
- Architected and deployed securities management platform reducing analyst reconciliation time by 60% for 20+ users through automated data validation and workflow optimization
- Optimized SQL Server query performance through strategic indexing and query plan analysis, decreasing complex report generation latency by 45%
- Delivered technical presentation on AI/ML applications in financial services to 500+ company stakeholders, achieving top 5% feedback score

#### Curriculum Developer | The Coding Place | Dec 2022 - Jun 2024
- Authored comprehensive Python certification curriculum (PCEP/PCAP) achieving 90% student pass rate across 120+ enrollments through structured learning modules and hands-on projects
- Engineered automated grading pipeline using PyTest and GitHub Actions for continuous assessment, reducing manual grading time by 80%
- Instructed 100+ students in object-oriented programming, data structures and algorithms, and web development fundamentals

#### Software Engineering Intern | Project Innovate Newark | Dec 2021 - Dec 2022
- Designed and deployed event management application adopted by 9 organizational programs, reducing scheduling conflicts by 30% through intelligent conflict detection
- Containerized full application stack using Docker and deployed to AWS ECS, reducing deployment time from days to hours and enabling rapid iteration
- Implemented JWT authentication and role-based access control system, passing third-party security audit with zero critical vulnerabilities

### Technical Skills Section

**Languages:** Python, Java, C#, JavaScript/TypeScript, Go, Rust, SQL, CUDA C/C++

**Frameworks & Libraries:** Django REST Framework, Spring Boot, .NET Core, React 18, Node.js, Express, PyTorch, TensorFlow

**Infrastructure & DevOps:** Docker, Kubernetes, AWS (Lambda, ECS, RDS, S3), GitHub Actions, Jenkins, Linux/Unix, Redis, PostgreSQL, SQL Server

**Specialized Technologies:** CUDA Programming, MPI, GPU Computing, Machine Learning, Computer Vision, Test-Driven Development, Playwright

### Education Section

**New Jersey Institute of Technology** | Newark, NJ
Bachelor of Science in Computer Science | Expected Dec 2025
- GPA: 3.8/4.0, Dean's List
- Relevant Coursework: GPU Cluster Programming, Advanced Algorithms, Machine Learning, Operating Systems, Compiler Design, Database Systems, Programming Language Principles

### Projects Section

**Koala's Forge** - Visual Git workflow tool with intuitive rebase and conflict resolution UI, built with Rust and Tauri for cross-platform desktop performance

**Distributed AlexNet** - MPI-based distributed deep learning implementation across GPU cluster, achieving linear scaling for image classification tasks with custom data parallelism

**GPU Ray Tracer** - CUDA-accelerated path tracing renderer with BVH spatial optimization, achieving real-time performance for complex scenes with global illumination

**MykoSnips** - Code snippet management system with AI-powered semantic search and VSCode extension integration, built with Go backend and TypeScript frontend

## Technical Implementation Details

### Modal Overlay Structure
```css
.word-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.word-window {
  max-width: 1200px;
  width: 95vw;
  height: 90vh;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

- Clicking backdrop closes window
- ESC key also closes window
- Matches existing XP window close behavior

### Resume.doc Project Card HTML
```html
<div class="project-card project-card-document" data-type="document">
  <div class="document-icon">
    <img src="[Word icon data URI]" alt="Word Document">
  </div>
  <h3>Resume.doc</h3>
  <div class="document-meta">
    <p><strong>Type:</strong> Microsoft Word Document</p>
    <p><strong>Size:</strong> 47 KB</p>
    <p><strong>Modified:</strong> December 2, 2025</p>
  </div>
</div>
```

**Styling:**
- Distinct from regular project cards
- White/beige background suggesting paper
- Hover effect highlights like Windows XP file selection
- Double-click or single-click opens (match XP behavior)

### Typing Engine Architecture

**State Machine:**
```javascript
class TypingEngine {
  constructor(content, targetElement) {
    this.content = content;          // Full text to type
    this.target = targetElement;      // DOM element
    this.position = 0;                // Current character index
    this.isTyping = true;
    this.typoQueue = this.generateTypos(); // Pre-generated typo positions
  }

  getCharacterDelay(char, nextChar) {
    // Returns delay in ms based on character type
  }

  type() {
    // Main animation loop using requestAnimationFrame
  }
}
```

**Performance Optimizations:**
- Character queue pre-calculated with timing metadata
- Uses `requestAnimationFrame` for smooth rendering
- Appends to hidden buffer, renders to visible DOM in batches
- Status bar updates debounced to 50ms intervals
- Word count calculations cached

### Data Format (resume-content.json)

```json
{
  "header": {
    "name": "MYKOLAS PEREVICIUS",
    "contact": [
      "Perevicius.Mykolas@gmail.com",
      "linkedin.com/in/mykolasperevicius",
      "github.com/mykolas-perevicius"
    ]
  },
  "summary": "Full-stack software engineer with...",
  "experience": [
    {
      "title": "Software Engineer",
      "company": "UserAuthGuard by Asan Digital",
      "dates": "Oct 2025 - Present",
      "bullets": [
        "Develop and maintain full-stack Django REST API...",
        "Implement end-to-end testing infrastructure..."
      ]
    }
  ],
  "skills": {
    "Languages": ["Python", "Java", "C#", ...],
    "Frameworks & Libraries": ["Django REST Framework", ...],
    "Infrastructure & DevOps": ["Docker", "Kubernetes", ...],
    "Specialized Technologies": ["CUDA Programming", ...]
  },
  "education": {
    "school": "New Jersey Institute of Technology",
    "location": "Newark, NJ",
    "degree": "Bachelor of Science in Computer Science",
    "graduation": "Expected Dec 2025",
    "gpa": "3.8/4.0, Dean's List",
    "coursework": "GPU Cluster Programming, Advanced Algorithms..."
  },
  "projects": [
    {
      "name": "Koala's Forge",
      "description": "Visual Git workflow tool..."
    }
  ]
}
```

### CSS Architecture

**word-window.css Structure (~400 lines):**
```css
/* Modal & Overlay */
.word-modal-overlay { ... }
.word-window { ... }

/* Title Bar */
.word-titlebar { ... }
.word-title { ... }
.word-controls { ... }

/* Menu Bar */
.word-menubar { ... }
.word-menu-item { ... }
.word-menu-dropdown { ... }

/* Toolbar */
.word-toolbar { ... }
.word-toolbar-row { ... }
.word-toolbar-button { ... }
.word-toolbar-dropdown { ... }

/* Document Area */
.word-document { ... }
.word-page { ... }
.word-content { ... }

/* Status Bar */
.word-statusbar { ... }

/* Print Styles */
@media print {
  .word-titlebar,
  .word-menubar,
  .word-toolbar,
  .word-statusbar {
    display: none;
  }
  .word-document {
    box-shadow: none;
    margin: 0;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .word-window {
    width: 100vw;
    height: 100vh;
  }
  .word-toolbar {
    /* Simplify to single row */
  }
}
```

### Mobile Considerations
- Word window becomes full-screen on mobile
- Toolbar simplified to single row with essential buttons
- Font/size dropdowns hidden on small screens
- Menu bar collapses to hamburger menu
- Typing animation speed increased (60ms base) for shorter attention span
- Touch gestures: swipe down from title bar to close

## Implementation Phases

### Phase 1: Core Structure
1. Create Resume.doc project card HTML/CSS
2. Build word-window.js with modal open/close logic
3. Style complete Word 2003 interface (title bar, menu, toolbar, document)
4. Test dragging, minimize/maximize/close functionality

### Phase 2: Content & Data
1. Create resume-content.json with all formatted content
2. Build content parser that converts JSON to HTML with styling
3. Render static resume in Word document (no animation yet)
4. Verify formatting, margins, page breaks

### Phase 3: Typing Animation
1. Build word-typing.js with variable speed engine
2. Implement character-by-character rendering
3. Add realistic pauses (commas, periods)
4. Implement typo generation and correction
5. Add blinking cursor CSS animation
6. Update status bar (page, line, column, word count)

### Phase 4: Easter Eggs
1. Build word-easter-eggs.js
2. Implement File menu with download dialogs
3. Add Edit/Format menu interactions
4. Create Clippy easter egg (reuse from XP window if applicable)
5. Add "About Word" dialog
6. Wire up toolbar button clicks

### Phase 5: Polish & Testing
1. Test on multiple browsers (Chrome, Firefox, Safari)
2. Mobile responsive testing and refinements
3. Performance optimization (typing animation smoothness)
4. Accessibility: keyboard navigation, screen reader support
5. Cross-browser print styling verification

## Success Criteria

- [ ] Resume.doc card appears in projects grid with authentic icon
- [ ] Clicking card opens full-screen Word 2003 modal
- [ ] Typing animation completes in 45-60 seconds with realistic behavior
- [ ] Status bar updates accurately during typing
- [ ] All menu items show appropriate easter eggs
- [ ] File → Close and ESC key both close window
- [ ] Download buttons show "coming soon" dialogs
- [ ] Clippy appears with career-themed messages
- [ ] Mobile experience is functional and responsive
- [ ] Print styling produces clean resume output
- [ ] Zero console errors during animation

## Future Enhancements

- Add actual PDF/DOC generation for downloads
- Sound effects (typing sounds, error beeps, Clippy voice)
- More elaborate easter eggs (animated Clippy, Office Assistant variety)
- "Edit mode" that actually lets you modify resume (save to localStorage)
- Multiple resume "templates" (chronological vs. functional)
- Integration with GitHub metrics - "Last updated: [date]" from commits

## Notes

This feature complements the existing Windows XP Internet Explorer projects window, maintaining the nostalgic computing aesthetic while providing actual utility (resume viewing/downloading). The typing animation transforms a static document into an engaging experience that holds attention and creates a memorable portfolio moment.

The easter eggs reward exploration without interfering with the primary function - users who just want to read the resume can do so, while those who click around discover playful interactions.
