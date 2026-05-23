# Changelog

## 2026-05-23

### Cloudflare Pages Deployment
- Deployed to Cloudflare Pages at `zi-wei-pai-pan.pages.dev`

### Flow Role Color System Redesign
- Fixed 流年 color (purple #8e44ad) clashing with 化科 (purple #8a4a9a) → changed to blue (#2980b9 light, #5dade2 dark)
- Fixed 流日/流時 warm tones clashing with 化忌 (red) → 流日 changed to sienna (#a0522d light, #d4875a dark), 流時 changed to red (#c0392b light, #e74c3c dark)
- Swapped 大限 and 流時 color families (大限 now orange #e67e22→#d35400, 流時 now red #c0392b in light theme)
- Darkened 大限 light theme color from #e67e22 to #d35400 for contrast on tan background
- Swapped 流月 and 流日 colors in dark theme (流月 = copper #d4875a, 流日 = teal #48c9b0)
- Added full dark-theme flow role color overrides (6 periods × 2 themes, all distinct from 四化)

### Star Chart Layout Restructure
- Split star rendering into left column (主星 + 輔星, vertical stack) and right column (雜星, vertical stack, right-aligned)
- Each star occupies its own line for clarity

### Prediction Bar Collapse/Expand
- Added toggle button to collapse/expand target-time section
- Collapsed: hides date/time inputs and all flow period checkboxes, keeps prev/next buttons visible
- Settings remain functionally active when collapsed
- Collapse state persisted in localStorage (`ziwei_pred_collapsed`)

### Documentation Alignment
- Updated README with star layout, collapse feature, and persistence details
- Updated CHANGELOG with all recent changes
- Synced GitHub Release v1.0.0 notes with CHANGELOG content

### SEO Optimization
- Unique titles and meta descriptions (150-160 chars) for all pages
- Open Graph tags (og:title, og:description, og:type, og:url, og:locale)
- Twitter Card tags
- Canonical URLs on every page
- Schema.org JSON-LD (WebApplication) for Google Rich Results
- `robots.txt` and `sitemap.xml` added
- SEO copy refined to emphasize "流時+四化" unique selling point

### Analytics
- Cloudflare Web Analytics injected into all pages for traffic tracking

### Visual Polish
- Removed header subtitle line
- Removed iztro MIT license attribution from footer (credit remains on About page)
- Star visual hierarchy: minor stars reduced to 3/4, adjunct stars to 1/2 of major star size

### Content Pages
- Added About, Contact, Privacy Policy pages for AdSense application
- Updated footer navigation to link between all pages
- Updated contact email

### Bug Fixes
- Fixed `runPrediction()` not updating center cell (`center_2_2`)
- Added date-time space padding in center cell display
- Fixed test failure by using `dispatchEvent(new Event('change'))` for change event

### Ad Monetization
- Google AdSense code injected into all pages

### Late Changes (post-AdSense deployment)
- Default birth date changed from hardcoded 1982-11-11 to dynamic today's date + current hour
- Dark mode support via `prefers-color-scheme` media query (all 4 pages)
- Adjunct star (雜星) font-size set to `.5em` for exact 1/2 ratio of main star
- Center cell lunar date now includes '日' suffix
- Center cell shows calculated age (實歲) between lunar date and zodiac
- Flow palace role names (流年/月/日/時) displayed in palace header, left-aligned after 本命 宮名
- Mobile: flow role names auto-abbreviated to single characters, no gap between abbreviations
- `ads.txt` added for AdSense authorized seller compliance
- perf: add `min-height` to chart-grid to reduce Cumulative Layout Shift (CLS)
- fix: change `href=/` to `href=index.html` in footer nav links to avoid 404 on subpages
- feat: persist all form state (gender, birth, target, toggles) in localStorage across page navigations
- docs: align README and CHANGELOG with feature changes
