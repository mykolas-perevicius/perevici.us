# Content Reconciliation Report

**Date:** 2026-04-28
**Scope:** Every factual claim rendered on perevici.us, compared against three sources of truth in priority order:
1. Resume (highest)
2. GitHub README at `github.com/mykolas-perevicius/mykolas-perevicius` (already reconciled against resume)
3. LinkedIn About / Education

**Categories used:** Wrong fact · Unverified claim · Outdated · Phantom project · Tech-stack overreach · Ambiguous

---

## index.html

### Metadata + JSON-LD

| File:Line | Current | Category | Proposed | Source |
|---|---|---|---|---|
| `index.html:7` | `meta description` mentions "Python, React, .NET, and AWS" | Tech-stack overreach | Replace `AWS` with `Django` (AWS is not in resume; Django is heavily used at UserAuthGuard / Project Innovate) | Resume — UserAuthGuard, Project Innovate |
| `index.html:38` | JSON-LD `knowsAbout` includes `"AWS"` | Tech-stack overreach | Replace `"AWS"` with `"TypeScript"` | Resume — TypeScript appears in TapiaTax, UserAuthGuard, Bessemer |

### Experience: TapiaTax (lines 126–148)

| Field | Current | Category | Proposed | Source |
|---|---|---|---|---|
| Title | "CTO & Lead Developer" | Wrong fact | "Founding Engineer" | Resume — TapiaTax entry |
| Date | "2025 - Present" | Outdated/imprecise | "Dec 2025 - Present" | Resume |
| Bullet 1 | "Architected and deployed full-stack tax preparation portal (tapiatax.com) with secure document management, client workflows, and real-time collaboration for small business clients" | Unverified claim | "Founding software engineer for a local accounting firm focused on tax returns for individuals and bookkeeping for small businesses" | Resume |
| Bullet 2 | "Designed RESTful API layer and relational database schema (Supabase/PostgreSQL) handling sensitive PII with role-based access control and encrypted storage" | Unverified claim | "Built and deployed landing page and lightweight client portal using React, TypeScript, Supabase, and Vercel" | Resume |
| Bullet 3 | "Integrated TypeScript/React 19 frontend with backend services; deployed cloud-native application on Vercel with CI/CD automation" | Unverified claim | "Implemented secure client messaging and file upload workflows to support business communication, reduce spam, and provide a fallback from SaaS solutions" | Resume |

### Experience: UserAuthGuard (lines 151–176)

| Field | Current | Category | Proposed | Source |
|---|---|---|---|---|
| Title | "Software Engineer" | Imprecise | "Software Engineer Contractor" | Resume |
| Bullet 1 | "Spearheaded test-driven development initiative for a Django SaaS platform serving 17,000+ students across multiple school districts, increasing backend coverage with 1,500+ tests (unit, E2E, frontend walkthroughs)" | Unverified claim ("multiple school districts", "spearheaded TDD") | "Contracted to improve testing for an internal portal managing groups, users, and school-issued devices for a SaaS platform serving 17,000+ students; increased backend coverage with 1,500+ pytest-django tests" | Resume |
| Bullet 2 | "...96% frontend coverage..." with "Factory Boy" | Wrong number, tech overreach | "...90%+ frontend coverage..." (drop Factory Boy) | Resume — explicitly says 90%+ |
| Bullet 3 | "Full-stack contributions across Django REST Framework, PostgreSQL, Redis, Celery, and Django Channels (WebSockets), with integrations to Google Workspace, Stripe, and Dell Warranty APIs" | Tech-stack overreach (Redis/Celery/Channels not in resume), Unverified (Dell Warranty APIs) | "Contributed Django REST framework backend work for internal portal features and service integrations including Google Workspace and Stripe" | Resume |
| Bullet 4 | "Implemented CI/CD pipelines with GitHub Actions and Docker for automated test execution, coverage reporting, and deployment validation" | OK | (no change) | Resume |
| Tech tags | Redis, Celery (in tag list) | Tech-stack overreach | Drop Redis and Celery; keep Django REST, pytest-django, PostgreSQL, Docker, Playwright | Resume |

### Experience: Bessemer Trust (lines 178–202)

| Field | Current | Category | Proposed | Source |
|---|---|---|---|---|
| Bullet 1 | "Built securities analysis platform that reduced reconciliation time by 60% for 20+ wealth advisors" | Unverified claim | DROP — replace with resume language | Resume — only says "Contributed full-stack features" |
| Bullet 2 | "Optimized SQL Server queries and indexes, cutting report generation latency by 45%" | Unverified claim | DROP | Resume — no latency claim |
| Bullet 3 | "Delivered AI Tech Talk to 100+ employees on practical ML applications" | Wrong fact (topic) | "Presented an AI Tech Talk to 100+ employees on LLM integrations for Bessemer's core business and daily operations" | Resume |
| Bullet 4 | "Developed and tested full-stack C#/.NET & React features for critical internal securities management platform" | Mostly OK, can be tightened | "Contributed full-stack features to an internal securities analysis platform using C#/.NET, React/TypeScript, and SQL Server for wealth management analysts and client advisors" | Resume |
| Tech tag | "Redis" | Tech-stack overreach | Remove (resume doesn't mention Redis at Bessemer) | Resume |

### Experience: The Coding Place (lines 204–223)

| Field | Current | Category | Proposed | Source |
|---|---|---|---|---|
| Bullet 1 | "Created 117 Jupyter notebooks covering Python from basics to GPU programming" | Unverified claim ("117", "GPU programming") | "Created Jupyter notebook learning materials covering Python fundamentals, web development with JS, OOP, and data structures" | Resume |
| Bullet 2 | "Achieved 90% student certification rate (PCEP/PCAP) across 120+ students" | Unverified claim | "Prepared students for PCEP and PCAP certifications, with a high pass rate" | Resume |
| Bullet 3 | "Designed and taught 30+ hours of comprehensive coursework covering Web Development, OOP, and Data Structures & Algorithms" | Unverified ("30+ hours") | "Provided private tutoring in supplementary coding education for kids, teens, and adults — including continuing education" | Resume |
| Bullet 4 | "Built automated testing pipeline with GitHub Actions for student code evaluation" | Unverified claim | DROP | Not in resume |

### Experience: Project Innovate Newark (lines 225–245)

| Field | Current | Category | Proposed | Source |
|---|---|---|---|---|
| Title | "Software Engineer" | Imprecise | "Curriculum Developer, Instructor, and Software Engineer" | Resume |
| Date | "Dec 2019 - Oct 2025" | **Wrong fact (4-year overstatement)** | "Dec 2019 - Oct 2021" | Resume |
| Bullet 1 | "Developed and launched event-planning suite using React, Node.js, and PostgreSQL, reducing scheduling conflicts by 30% across 9+ programs" | Unverified ("30%", "9+ programs") | "Built an internal scheduling portal using React, Node.js, PostgreSQL, Django, JWT authentication, and Docker" | Resume |
| Bullet 2 | "Implemented Docker for containerization, significantly reducing release cycles from days to hours" | Unverified ("days to hours") | DROP — already covered in rewritten bullet 1 | Resume |
| Bullet 3 | "Established role-based access control and JWT authentication, achieving zero critical findings in penetration testing" | Unverified ("zero critical pen-test findings") | DROP — JWT already covered | Resume |
| Bullet 4 | "Contributed to increasing data reporting efficiency by ~30% through modular UI elements and RESTful API integration" | Unverified ("~30%") | "Progressed from learning the stack to teaching introductory Python classes, then to developing curriculum and coding instructional materials" | Resume |

### Experience: Bergen Community College (lines 247–270)

| Field | Current | Category | Proposed | Source |
|---|---|---|---|---|
| Bullet 1 | "Prototyped embedded systems incorporating GUIs and machine vision capabilities for robotics applications" | Unverified ("robotics applications") | "Built early embedded systems and Python-based research prototypes through the STEM Student Scholars (3SP) program under Dr. Joseph Sivo" | Resume |
| Bullet 2 | "Engineered CNN-powered recycling-bin prototype attaining 95% material-detection accuracy" | Unverified claim ("95%") | "Contributed to computer vision experimentation with a CNN-based recycling-bin detection prototype built with TensorFlow" | Resume |
| Bullet 3 | "Built Arduino-based EV GUI that boosted converted pickup truck range by approximately 20%" | Unverified claim (entire bullet not in resume) | DROP | Resume — no Arduino / EV / range claim |
| Bullet 4 | "Systematically collected, cleaned, processed, and analyzed experimental data using Python libraries" | Generic but supported | (keep, slightly tightened) | Resume |
| Tag | "Arduino" | Unverified | Drop tag | Resume |

### Projects Grid (lines 275–512)

| Card | Current | Category | Proposed | Source |
|---|---|---|---|---|
| Distributed AlexNet | "Achieved 4.6x speedup over baseline PyTorch on DGX-1 cluster..." + stat "4.6x Faster" | Unverified claim | "Custom CUDA kernels and MPI orchestration on a cluster to demonstrate scaling laws and techniques" — stat → "GPU Cluster" | Resume |
| Piano Keyboard Trainer | Tags: "JavaScript, Web Audio API, Canvas". Description vague | Tech-stack mismatch | Tags → "React, TypeScript, Tailwind, Web Audio API". Description: "Browser-based piano trainer mapping QWERTY to a 30+ note chromatic instrument; 8 scales, real-time visualization, scale-practice with progress tracking" | Resume |
| Video Frame Interpolation | Title "Video Frame Interpolation", URL `Video-Frame-Interpolation` | Wrong title; URL mismatch | Title → "RIFE Gameplay Interpolation"; URL → `https://github.com/mykolas-perevicius/rife-gameplay-interpolation`; Description → "GPU-accelerated video interpolation pipeline converting 30 FPS gameplay to 60+ FPS, focused on evaluation and benchmarking"; Tags → "Python, CUDA, FFmpeg, Bash" | Resume |
| Education Playground | "117 Jupyter notebooks. Covers basics to GPU programming with 90% student certification pass rate" | Unverified claim | "Jupyter notebook learning materials for Python fundamentals, designed to support PCEP/PCAP certification preparation" — drop "117" and "90%" stats | Resume — Coding Place entry |
| Koala's Forge | OK; minor tightening | OK | Add "Inspired by Ninite" reference | Resume |
| Rosetta | **PHANTOM PROJECT** — replaced on resume by Static C++ Code Analyzer | Phantom | Replace card content with: "Static C++ Code Analyzer" — "Parser and static analysis tool for a C++ subset; identifies type errors and unused variables using AST generation and control-flow analysis (Sep 2023 – Jan 2024)"; tags → C++, AST, Static Analysis; remove "In Progress" badge | Resume |
| TapiaTax (project card) | OK | OK | Minor: drop "real-time collaboration" — not in resume | Resume |
| stocksandoptions.org | OK | OK | (no change) | Resume |

### Terminal easter egg (lines 590–610)

| Line | Current | Category | Proposed |
|---|---|---|---|
| 602 | `> distributed-alexnet/ koalas-forge/ education-playground/ piano-trainer/` | Could update for completeness | Optional — add `rife-interpolation/` and `static-cpp-analyzer/` (low priority; stylistic) |

---

## data/resume-content.json (Word 2003 modal data)

Full rewrite — this file has the **same categories** of issues as `index.html` plus additional tech-stack overreach in the `skills` block. See file diff for details. Key changes:

- TapiaTax title: `CTO & Lead Developer` → `Founding Engineer`
- Project Innovate Newark dates: `Dec 2019 -- Oct 2025` → `Dec 2019 -- Oct 2021`
- All unverified percentages removed (60%, 45%, 96%, 95%, 30%, 117, 120+, 85%+)
- Rosetta Multi-Language Compiler → Static C++ Code Analyzer
- "Additional Projects" merged bullet (with phantom EEG/Network Viz Dashboard) → split into RIFE Gameplay Interpolation, Stock & Options Simulator, Piano Keyboard Trainer (all resume-confirmed)
- `skills.Languages`: drop `Rust`, `Go` (tech-stack overreach per landmines)
- `skills.Backend`: drop `Spring Boot` (overreach)
- `skills.Infrastructure`: drop `Kubernetes`, `MongoDB`, `AWS`, `Redis` (overreach)
- `skills.Testing`: drop `Selenium`, `JUnit`; add `Playwright`, `Faker` (resume-confirmed)
- `skills.Specialized`: drop `PyTorch`, `scikit-learn` (not in resume)

---

## js/main.js role-rotation array (lines 40–47)

The animated role anchor cycles through six **aspirational descriptors** rather than factual claims (e.g., "Problem Solver", "Production Shipper"). No numerical or verifiable specifics. Treated as **OK / no edit needed** — these don't violate the "no invented facts" rule.

---

## Summary of impact

- **3 wrong facts** corrected (TapiaTax title, Project Innovate end date, UserAuthGuard 96%→90%+)
- **~14 unverified percentages / counts** removed across 6 jobs and 3 projects
- **1 phantom project** removed (Rosetta → Static C++ Code Analyzer)
- **5 tech-stack overreaches** removed (AWS, Spring Boot, MongoDB, Kubernetes, Rust, Go — including from skills section of Word resume modal)
- **2 phantom side-projects** dropped from "Additional Projects" merged bullet (EEG Signal Classification 85%+, Interactive Network Visualization Dashboard)
- **1 missing project** added (Static C++ Code Analyzer + RIFE Gameplay Interpolation as separate first-class entries)

No design changes. No refactoring. Edits land in `index.html` and `data/resume-content.json` only.
