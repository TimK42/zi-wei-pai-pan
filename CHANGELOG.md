# Changelog

## 2026-05-23

### Cloudflare Pages Deployment
- Deployed to Cloudflare Pages at `zi-wei-pai-pan.pages.dev`

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

### Late Changes (post-AdSense)
- Default birth date changed from hardcoded 1982-11-11 to dynamic today's date + current hour
- Dark mode support via `prefers-color-scheme` media query (all 4 pages)
- Adjunct star (雜星) font-size set to `.5em` for exact 1/2 ratio of main star
- Center cell lunar date now includes '日' suffix
- Center cell shows calculated age (實歲) between lunar date and zodiac
- Flow palace role names (流年/月/日/時) displayed in palace header, left-aligned after 本命 宮名
- Mobile: flow role names auto-abbreviated to single characters, no gap between abbreviations
- `ads.txt` added for AdSense authorized seller compliance
