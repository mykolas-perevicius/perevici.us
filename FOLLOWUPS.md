# Follow-ups (Deferred — non-content issues observed during the reconciliation pass)

Initial entries dated 2026-04-28; dead-code cleanup completed in a follow-on pass.
The three "Dead code from ..." sections that lived here previously have all been resolved
and removed from this file. Items below are still open.

---

## Repo-internal docs with stale facts (NOT user-facing)

These markdown files live in the repo and contain fact claims that the live site no longer makes.
They could leak into search results or PR descriptions.

- **`CHANGELOG.md`** — references "LedgerLite (Distributed ledger microservice)", "Smart Recycling Bin (95% accuracy CNN)", and the old "4.6× speedup with CUDA/MPI" claim.
  - *Severity:* low. *Suggested fix:* prune the now-incorrect lines or add a "(superseded)" note.
- **`STATUS.md`** — line ~220 still asserts "4.6× GPU speedup on distributed AlexNet".
  - *Severity:* low. *Suggested fix:* drop the line or generalize.
- **`DEPLOYMENT_GUIDE.md`** — lists "UserAuthGuard, Bessemer Trust, The Coding Place, Project Innovate" and "Koala's Forge, Distributed AlexNet, etc." — no false specifics.
  - *Severity:* low. *Suggested fix:* none required; cosmetic.

## Dead / unused infrastructure (still pending)

- **`og-image.png` + `scripts/generate-og.js`** — OG image generator exists but `<meta property="og:image">` is not present in `index.html`. The image is unused.
  - *Severity:* medium (SEO). *Suggested fix:* add `<meta property="og:image" content="https://perevici.us/og-image.png">` and matching Twitter card tag — i.e. *use* the asset rather than delete it.

## URL / link integrity (not verified during this pass)

- **stocksandoptions.org GitHub link** — current href: `https://github.com/mykolas-perevicius/Stock-Option-Tradeoff-Stimulator`. Note the typo `Stimulator` (not `Simulator`). If the actual repo has the correct spelling, this is broken.
  - *Severity:* high if broken, low if actual repo name matches. *Suggested fix:* visit the URL and rename if needed.
- **RIFE Gameplay Interpolation URL** — content reconciliation pass changed this from `Video-Frame-Interpolation` to `rife-gameplay-interpolation` (the resume URL). If only the old repo exists publicly, the new link will 404.
  - *Severity:* high if 404. *Suggested fix:* verify which repo exists; if both, ensure the resume's repo is the canonical one.

## Build / runtime concerns

- **No `requestIdleCallback` polyfill** for Safari. Already noted in CLAUDE.md memory.
  - *Severity:* low. *Suggested fix:* add a tiny polyfill or feature-detect.
- **Three.js loads even with `prefers-reduced-motion: reduce`**. Already noted in CLAUDE.md memory.
  - *Severity:* medium (a11y). *Suggested fix:* gate the `import('./three-background.js')` call behind a `matchMedia` check.

## Content gaps the reconciliation pass did NOT add (consider whether to add)

- **Dean's List & Honors at NJIT** — LinkedIn says "Dean's List and Honors". The main site does not currently surface education at all (it's only inside the Word resume modal). Optional: add an Education section.
  - *Severity:* low. *Suggested fix:* add a short education stripe.
- **Strive Digital Fitness** — listed on LinkedIn but not on resume. Per task spec, treated as low-priority. Currently *not* on the site, which is consistent with resume-as-source-of-truth.
  - *Severity:* none. *Suggested fix:* leave off unless wanted.

## Easter-egg copy (cosmetic, not factual)

- **Terminal easter egg (`index.html` ~lines 590–610)** — `ls projects/` lists `distributed-alexnet/ koalas-forge/ education-playground/ piano-trainer/`. After the reconciliation pass, two new project entries exist that aren't echoed there: `rife-interpolation/` and `static-cpp-analyzer/`. Cosmetic only.
  - *Severity:* low. *Suggested fix:* update the listing for consistency.
- **`js/main.js` role-rotation array** — aspirational descriptors, not factual claims. Left unchanged.
  - *Severity:* none. *Suggested fix:* none.
