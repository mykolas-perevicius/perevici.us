# Changelog - perevici.us Portfolio

All notable changes to this project will be documented in this file.

---

## [1.0.0] - 2025-11-07

### 🎉 Initial Release - Complete Portfolio Deployment

#### ✅ Repository & Deployment
- Created GitHub repository: `mykolas-perevicius/perevici.us`
- Deployed to GitHub Pages
- Configured custom domain: `perevici.us`
- Added CNAME file for custom domain support
- Enabled GitHub Pages deployment (build time: ~46s)

#### 🎨 Portfolio Features Built

**Core Sections:**
- **Hero Section**: Animated typing effect showing multiple roles (Full-Stack Engineer, GPU Computing Enthusiast, etc.)
- **Status Badge**: "Open to opportunities" indicator with pulse animation
- **Stats Bar**: Key achievements display
  - 90% test coverage
  - 60% time reduction
  - 4.6× GPU speedup
  - 500+ engineers taught
- **GitHub Stats Section**: Live API integration showing:
  - Public repositories count
  - Follower count
  - Total stars across repos
- **Experience Timeline**: 4 positions with achievements
  - UserAuthGuard by Asan Digital (Oct 2025 - Present)
  - Bessemer Trust (Jun 2023 - Aug 2023)
  - The Coding Place (Dec 2022 - Jun 2024)
  - Project Innovate Newark (Dec 2021 - Dec 2022)
- **Featured Projects**: 6 projects with descriptions, stats, and tech tags
  - Koala's Forge (100+ apps, cross-platform installer)
  - Distributed AlexNet (4.6× speedup with CUDA/MPI)
  - Ultimate System Setup (AI lab automation)
  - Education Playground (Python learning platform)
  - Smart Recycling Bin (95% accuracy CNN)
  - LedgerLite (Distributed ledger microservice)
- **Skills Grid**: 4 categories
  - Languages: Python, C/C++, Java, C#, JavaScript/TypeScript, Go, Rust
  - Frameworks: Django REST, Spring Boot, .NET Core, React 18, Node.js, Express
  - Infrastructure: Docker, Kubernetes, AWS, GitHub Actions, Jenkins, Linux
  - Specialized: CUDA, MPI, PyTorch, TensorFlow, ML, Computer Vision
- **Education Section**: NJIT CS degree (GPA 3.8, Dean's List)
- **Blog Teaser**: Placeholder for future technical writing
- **Contact Section**: Email and LinkedIn CTAs

#### 🎮 Interactive Features

**Theme System:**
- Dark mode (default, developer-friendly)
- Light mode toggle
- Persistent storage via localStorage
- Smooth transitions

**Keyboard Shortcuts (Vim-style):**
- `` ` `` - Toggle terminal overlay
- `?` - Show help modal with all shortcuts
- `j` - Scroll down
- `k` - Scroll up
- `gg` - Jump to top
- `G` - Jump to bottom
- `p` - Jump to Projects section
- `e` - Jump to Experience section
- `c` - Jump to Contact section
- `ESC` - Close all modals

**Terminal Easter Egg:**
- Press `` ` `` to open working terminal interface
- Pre-populated with realistic commands:
  - `whoami` - Shows engineer tagline
  - `ls projects/` - Lists project directories
  - `cat philosophy.txt` - Shows personal philosophy
  - `echo $SKILLS` - Displays tech stack
  - `cat contact.txt` - Shows contact info
- Authentic terminal styling with header dots
- Click outside or press ESC to close

**Konami Code Easter Egg:**
- Input sequence: ↑↑↓↓←→←→BA
- Triggers Matrix rain effect for 10 seconds
- Uses cyan color theme matching site design
- Automatically stops and cleans up

**Console Easter Egg:**
- Custom styled welcome message for developers
- Includes hints about terminal and Konami code
- Showcases contact information

**Animations:**
- Typing animation for hero roles (6 different titles)
- Smooth scroll reveals for sections (Intersection Observer)
- Floating code block in hero decoration
- Status badge pulse animation
- Smooth hover effects on all interactive elements
- Navigation link underline animations
- Project card lift and glow on hover

#### 🔧 Technical Implementation

**Performance:**
- 100% vanilla JavaScript (no frameworks)
- Single HTML file for simplicity
- Optimized CSS with CSS Grid and Flexbox
- Lazy loading strategy for GitHub API
- Smooth scroll with `behavior: smooth`
- Optimized animations with CSS transforms

**SEO & Accessibility:**
- Schema.org structured data (Person type)
- Open Graph meta tags for social sharing
- Semantic HTML5 elements
- Keyboard navigation support
- Proper heading hierarchy
- Alt text for SVG icons
- Color contrast compliance
- Responsive meta viewport

**GitHub API Integration:**
- Fetches user profile data
- Counts public repositories
- Displays follower count
- Calculates total stars across all repos
- Error handling with fallback values
- Rate limit consideration

**Responsive Design:**
- Mobile-first approach
- Breakpoint at 768px
- Flexible grid layouts
- Touch-friendly tap targets
- Adjusted typography scales
- Hidden elements on mobile when appropriate
- Optimized navigation for small screens

#### 📚 Documentation Created

**README.md:**
- Project overview and features
- Tech stack description
- Deployment instructions
- Content update guide
- Customization tips
- Performance metrics
- Connection information

**DEPLOYMENT_GUIDE.md:**
- Complete deployment walkthrough
- DNS configuration instructions for multiple providers
- SSL certificate setup
- GitHub Pages settings
- Verification steps
- Troubleshooting section
- Update procedures
- Analytics integration guide

**SETUP_NAMECHEAP_DNS.md:**
- Step-by-step Namecheap-specific guide
- Screenshots descriptions
- Exact DNS record values
- Verification methods
- Timeline expectations
- Troubleshooting for common issues

**CHANGELOG.md (this file):**
- Complete feature documentation
- Version tracking
- Change history

#### 🌐 DNS Configuration

**Status:** In Progress
- Configured CNAME file: `perevici.us`
- DNS A records added in Namecheap:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153
- Optional CNAME for www subdomain: `mykolas-perevicius.github.io`
- Propagation in progress (expected: 2-24 hours)

**Domain Status:**
- Registrar: Namecheap
- Nameservers: dns1.registrar-servers.com, dns2.registrar-servers.com
- Previous IP: 162.255.119.27 (parking page)
- Target IPs: GitHub Pages servers
- HTTPS: Will be auto-provisioned by GitHub after DNS verification

#### 🎯 Live URLs

**Primary:**
- Custom Domain (after DNS): https://perevici.us
- GitHub Pages (live now): https://mykolas-perevicius.github.io/perevici.us
- Repository: https://github.com/mykolas-perevicius/perevici.us

**Settings:**
- GitHub Pages Config: https://github.com/mykolas-perevicius/perevici.us/settings/pages

#### 🔄 Git History

**Initial Commit:**
- Commit SHA: 38849f5
- Branch: main
- Files: index.html, README.md, CNAME, .gitignore
- Lines added: 1933+

#### 📊 Statistics

**Code Metrics:**
- HTML: 1 file, ~1800 lines
- CSS: Inline, ~800 lines
- JavaScript: Inline, ~400 lines
- Total Size: <100KB (uncompressed)
- Load Time Target: <1.5s

**Features Count:**
- Sections: 9
- Interactive Elements: 8
- Keyboard Shortcuts: 10
- Easter Eggs: 3
- Animations: 15+
- External APIs: 1 (GitHub)

#### 🎨 Design System

**Colors:**
- Primary: #00d4ff (Cyan)
- Secondary: #00a6cc
- Accent: #40e0d0 (Turquoise)
- Dark BG: #0a0e27
- Light BG: #ffffff
- Success: #10b981

**Typography:**
- Sans: Inter (body text)
- Mono: JetBrains Mono (code, stats)
- Display: Space Grotesk (headers)

**Spacing:**
- Max Width: 1200px
- Section Padding: 4rem vertical
- Grid Gap: 2rem

#### 🚀 Next Steps

**Immediate (User):**
- [x] Configure DNS in Namecheap
- [ ] Wait for DNS propagation
- [ ] Verify site loads at perevici.us
- [ ] Enable HTTPS in GitHub Pages settings

**Future Enhancements:**
- [ ] Add blog section with actual posts
- [ ] Create resume download functionality
- [ ] Add more project demos
- [ ] Implement analytics tracking
- [ ] Add contact form backend
- [ ] Create project detail pages
- [ ] Add testimonials section
- [ ] Build out blog with technical articles

#### 🙏 Credits

**Built with:**
- Claude Code by Anthropic
- GitHub Pages (hosting)
- GitHub API (live stats)
- Google Fonts (typography)
- Vanilla JavaScript (no frameworks)

**Design Inspiration:**
- Modern developer portfolios
- Terminal aesthetics
- Vim keybinding conventions
- Matrix (1999) for rain effect

---

## Version History

### [1.0.0] - 2025-11-07
- Initial release with complete portfolio
- All core features implemented
- Documentation completed
- Deployed to GitHub Pages
- DNS configuration in progress

---

*"I thrive at the intersection of backend rigor and frontend empathy, shipping production code that helps everyday people get more done with less friction."*

**Built by Mykolas Perevicius with Claude Code**
