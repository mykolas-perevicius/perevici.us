# perevici.us - Personal Portfolio

[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-blue)](https://perevici.us)

## 🚀 Overview

My personal portfolio website showcasing my work as a full-stack engineer and CS student at NJIT. Built with vanilla JavaScript for maximum performance and complete control.

## 🎨 Features

### Core Functionality
- **Dark/Light Mode**: Persistent theme toggle with localStorage
- **Responsive Design**: Mobile-first, works beautifully on all devices
- **Performance Optimized**: Lighthouse 95+ score across all categories
- **SEO Optimized**: Structured data, meta tags, semantic HTML

### Interactive Elements
- **Typing Animation**: Rotating role descriptions in the hero section
- **Scroll Animations**: Elements reveal smoothly as you scroll
- **GitHub Stats Integration**: Live repository, follower, and star counts via GitHub API
- **Vim-Style Keyboard Shortcuts**:
  - `` ` `` - Toggle terminal overlay
  - `?` - Show keyboard shortcuts help
  - `j/k` - Scroll down/up
  - `gg` - Jump to top
  - `G` - Jump to bottom
  - `p` - View projects
  - `e` - View experience
  - `c` - Contact section
  - `ESC` - Close all modals

### Easter Eggs
- **Terminal Mode**: Press `` ` `` to open an interactive terminal overlay
- **Konami Code**: ↑↑↓↓←→←→BA triggers Matrix rain effect
- **Console Message**: Custom welcome for curious developers

## 📁 Project Structure

```
perevici.us/
├── index.html          # Main portfolio page (all-in-one)
├── README.md           # This file
├── CNAME              # Custom domain configuration
└── .gitignore         # Git ignore rules
```

## 🛠️ Tech Stack

- **HTML5**: Semantic markup, schema.org structured data
- **CSS3**: CSS Grid, Flexbox, CSS Variables, animations
- **Vanilla JavaScript**: No frameworks, pure performance
- **GitHub API**: Real-time stats integration
- **GitHub Pages**: Free, fast hosting with custom domain

## 🚀 Deployment

This site is deployed on GitHub Pages with a custom domain.

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/mykolas-perevicius/perevici.us.git
cd perevici.us

# Open locally
open index.html
```

### GitHub Pages Setup

1. Repository is configured to serve from `main` branch
2. Custom domain `perevici.us` is configured via CNAME file
3. DNS A records point to GitHub Pages IPs:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
4. SSL certificate is automatically provisioned

## 📊 Sections

1. **Hero**: Eye-catching intro with status badge and social links
2. **Stats Bar**: Key achievements in numbers
3. **GitHub Stats**: Live repository and follower counts
4. **Experience Timeline**: Interactive work history
5. **Projects Grid**: Featured projects with hover effects
6. **Skills Matrix**: Categorized technical skills
7. **Education**: Academic background
8. **Blog Teaser**: Placeholder for upcoming technical blog
9. **Contact**: Clear call-to-action

## 🎯 Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Page Weight**: < 500KB (excluding fonts)
- **Lighthouse Score**: 95+ across all categories

## 💡 Content Updates

### Update Experience

Edit the timeline items in the `Experience` section of `index.html`.

### Update Projects

Modify the project cards in the `Projects Grid` section.

### Update Skills

Change skill items in the `Skills` section.

## 🔧 Customization

### Colors

Edit CSS variables in `:root`:

```css
:root {
    --primary-color: #00d4ff;  /* Main accent - cyan */
    --accent-color: #40e0d0;   /* Secondary - turquoise */
    --bg-dark: #0a0e27;        /* Dark mode background */
}
```

### Fonts

Currently using:
- **JetBrains Mono** for code/monospace
- **Inter** for body text
- **Space Grotesk** for display headers

## 🤝 Connect

- **Email**: Perevicius.Mykolas@gmail.com
- **GitHub**: [@mykolas-perevicius](https://github.com/mykolas-perevicius)
- **LinkedIn**: [mykolasperevicius](https://linkedin.com/in/mykolasperevicius)

## 📝 License

© 2024 Mykolas Perevicius. All rights reserved.

---

*"I thrive at the intersection of backend rigor and frontend empathy."*
