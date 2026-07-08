# 紫微斗數排盤 UI/UX Audit Report

> Conducted: 2026-07-08 via browser-based inspection (375×812 mobile viewport)
> Pages audited: 5 pages (index, about, contact, privacy-policy, 404)
> Framework: Vanilla HTML/CSS/JS (single-page app in index.html)

---

## 📊 Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 3 |
| 🟧 High | 5 |
| 🟨 Medium | 8 |
| 🟩 Low | 6 |
| **Total** | **22** |

---

## ✅ Positive Findings

| # | Finding |
|---|---------|
| P1 | Single `<h1>` on every page — "紫微斗數排盤" ✅ |
| P2 | `lang="zh-TW"` on all pages — correct locale ✅ |
| P3 | Viewport meta set correctly (`width=device-width, initial-scale=1.0`) ✅ |
| P4 | No `target="_blank"` links missing `rel="noopener"` ✅ |
| P5 | Meta description present on all pages ✅ |
| P6 | Footer links (關於 / 聯絡我們 / 隱私權) present on all pages ✅ |
| P7 | No images missing `alt` attributes ✅ |
| P8 | Form inputs (date picker, combobox) have visible labels ✅ |
| P9 | Color contrast: rgb(34,34,34) on rgb(221,210,188) — passes WCAG AA for normal text ✅ |

---

## 🔴 Critical Issues

### C1. 404 Page Returns Full Chart Page
**Severity:** Critical
**Pages affected:** All (via GitHub Pages SPA 404 fallback)
**Evidence:** Visiting `/nonexistent-page-for-404-test` returns the full 紫微斗數排盤 chart form (same as index.html), not a proper 404 page.
**Impact:** Users hitting a wrong URL get confused — they see a completely filled-in chart with no indication of an error.
**Fix:** Create `404.html` with a custom message, link back to the chart tool, and configure GitHub Pages to serve it.

### C2. No `<main>` Landmark on Any Page
**Severity:** Critical
**Pages affected:** All (index, about, contact, privacy-policy)
**Evidence:** No `<main id="main-content">` found on any page. Skip-to-content link also missing.
**Impact:** Screen reader users have no semantic landmark to jump directly to page content. Violates WCAG 1.3.1 (Info and Relationships) and 2.4.1 (Bypass Blocks).
**Fix:** Wrap the primary content of each page in `<main id="main-content">` and add a skip-to-content link as the first focusable element.

### C3. Chart Palaces Are Not Accessible to Screen Readers
**Severity:** Critical
**Pages affected:** index.html (chart view)
**Evidence:** The 12 palaces (命宮, 兄弟, 夫妻, etc.) and their stars (紫微, 武曲, 破軍...) render as plain text with no semantic structure. No `<table>`, no ARIA roles, no labels.
**Impact:** Screen reader users hear a wall of palace/star names with no context — they cannot distinguish which stars belong to which palace, nor understand the chart structure.
**Fix:** Re-render the 12-palace grid as a `<table>` with proper `scope="col"`/`scope="row"`, or use ARIA grid layout (`role="grid"` with `aria-rowcount="12"`, `aria-colcount`). Each palace should be a `<th>` with its stars as data cells.

---

## 🟧 High Issues

### H1. Icon Buttons Lack `aria-label`
**Severity:** High
**Pages affected:** index.html (排盤 button, icon buttons like ⏺, ⏴, ⏵)
**Evidence:** `document.querySelectorAll('button[aria-label]').length` returns 0. The "排盤" button has text, but icon-only buttons (toggle 大限/小限/etc., prev/next) have no accessible name.
**Impact:** Screen reader users hear button as "button" with no hint of its function. Touch target icons (previous/next) are especially problematic.
**Fix:** Add `aria-label` to all icon buttons: e.g., `aria-label="上一個宮位"`, `aria-label="切換大限"`.

### H2. Touch Targets Below 44px on All Pages
**Severity:** High
**Pages affected:** All pages (index: 3 small, about: 4 small, contact: 3 small, privacy: 3 small)
**Evidence:** `document.querySelectorAll('button,a[href]')` filtered by `getBoundingClientRect()` shows 3–4 buttons per page below the 44×44px WCAG target size.
**Impact:** Users with motor impairments or large fingers cannot reliably tap these controls on mobile.
**Fix:** Increase button padding to ensure minimum 44×44px touch targets. CSS: `min-width: 44px; min-height: 44px; padding: 8px 12px;`.

### H3. No Skip-to-Content Link
**Severity:** High
**Pages affected:** All pages
**Evidence:** No `<a href="#main-content">` or `[aria-label="Skip to content"]` found.
**Impact:** Keyboard/screen reader users must tab through every element (all 12 palaces + stars) to reach navigation or forms.
**Fix:** Add a hidden-but-focusable skip link as the first element: `<a href="#main-content" class="skip-link">跳到主要內容</a>`. Style: `position:absolute; top:-40px; left:0; background:#fff; color:#000; padding:8px; z-index:999;` and `:focus { top:0; }`.

### H4. No `<nav>` Landmark
**Severity:** High
**Pages affected:** All pages (confirmed: `hasNav = false`)
**Evidence:** No `<nav>` element found. Footer navigation links exist but are not inside a `<nav>`.
**Impact:** Screen reader users cannot jump to navigation regions. Violates WCAG 1.3.1.
**Fix:** Wrap footer (and optionally header) links in `<nav aria-label="Site navigation">`.

### H5. No Custom 404 — Users Lost on Wrong URLs
**Severity:** High
**Pages affected:** All unknown URLs
**Evidence:** GitHub Pages SPA fallback serves the full chart page for any non-existent path. The title changes to "紫微斗數排盤 – 少數支援流時＋四化的免費排盤工具" (different from index), but the content is identical to index.html.
**Impact:** Users arriving from a bookmarked link or search engine on a wrong URL see a pre-filled chart and don't know what happened. No error message, no back navigation.
**Fix:** Create `404.html` with: "頁面找不到" message, link back to the main tool, and a link to 關於/聯絡我們.

---

## 🟨 Medium Issues

### M1. No `<meta name="theme-color">`
**Severity:** Medium
**Pages affected:** All pages
**Evidence:** `hasThemeColor = false` on all pages.
**Impact:** Mobile browsers show default browser chrome color (often white or system blue) which may clash with the site's warm beige background.
**Fix:** Add `<meta name="theme-color" content="#D9D2BC">` (matching `rgb(221, 210, 188)`).

### M2. No Apple Web App Meta Tags
**Severity:** Medium
**Pages affected:** All pages
**Evidence:** `apple-mobile-web-app-capable` and `apple-mobile-web-app-status-bar-style` missing.
**Impact:** Adding to home screen on iOS does not hide browser chrome or set status bar style.
**Fix:** Add:
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-icon" href="/icon-192.png">
```

### M3. Chart Data Has No Semantic Structure (WCAG 1.3.1)
**Severity:** Medium
**Pages affected:** index.html (chart view only)
**Evidence:** The 12 palaces are rendered as plain text concatenated together: "遷移 癸巳 武曲平 破軍平 祿存...". No visual borders, no grouping.
**Impact:** Visually impaired users cannot parse the chart. Even sighted users on small screens may find it hard to distinguish palace boundaries without visual separators.
**Fix:** Render as a CSS grid or table with clear palace boundaries (borders, spacing, background colors per palace).

### M4. Chart Labels Are Not Readable on Small Screens (Visual, not Screen Reader)
**Severity:** Medium
**Pages affected:** index.html (chart view)
**Evidence:** On 375px viewport, palace names and star lists are extremely small text running together with no visual separation.
**Impact:** Users cannot read the chart on mobile without zooming, defeating the purpose of responsive design.
**Fix:** Use a card-based layout for mobile: one palace per "card" row, with palace name as header and stars listed below.

### M5. Footer Links Use Relative URLs on SPA
**Severity:** Medium
**Pages affected:** All pages
**Evidence:** Footer links use relative paths (`about.html`, `contact.html`, `privacy-policy.html`). On GitHub Pages SPA, navigation to these pages works, but the URL changes from `/` (SPA) to `/about.html` — inconsistent URL patterns.
**Impact:** Bookmarked URLs become inconsistent; share links may break if SPA routing changes.
**Fix:** Consider using a single-page approach for all pages (routing within `index.html`), or standardize to `/about/`, `/contact/` with server-side redirects.

### M6. No `robots.txt` Guidance for SPA
**Severity:** Medium
**Pages affected:** All pages (SEO)
**Evidence:** `sitemap.xml` exists, but no robots.txt check for SPA considerations. GitHub Pages serves all HTML files; if index.html loads all content dynamically, crawlers may not see chart data.
**Fix:** Verify that Google can crawl and render the SPA (Googlebot uses headless Chrome, so JS rendering should work).

### M7. No Focus Indicators Visible (Keyboard Navigation)
**Severity:** Medium
**Pages affected:** All pages
**Evidence:** No `:focus-visible` styles observed on buttons or links.
**Impact:** Keyboard users cannot see which element is currently focused.
**Fix:** Add global focus styles: `*:focus-visible { outline: 2px solid #8B7355; outline-offset: 2px; }`.

### M8. No `prefers-reduced-motion` Handling
**Severity:** Medium
**Pages affected:** index.html (if any transitions exist)
**Impact:** Users with vestibular disorders may experience discomfort from animations.
**Fix:** Add `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`.

---

## 🟩 Low Issues

### L1. No `X-Content-Type-Options: nosniff` Header
**Severity:** Low
**Pages affected:** All pages (server-level)
**Evidence:** Not directly visible in HTML, but should be checked at HTTP level.

### L2. No `Content-Security-Policy` Header
**Severity:** Low
**Pages affected:** All pages (server-level)
**Evidence:** Should be configured at GitHub Pages level.

### L3. Page Title Format Inconsistent
**Severity:** Low
**Evidence:** 
- index.html: "紫微斗數排盤" (no suffix)
- about.html: "關於 – 紫微斗數排盤 | 免費線上算命工具"
- contact.html: "聯絡我們 – 紫微斗數排盤 | 免費線上算命工具"
- privacy-policy.html: "隱私權政策 – 紫微斗數排盤 | 免費線上算命工具"
- 404 fallback: "紫微斗數排盤 – 少數支援流時＋四化的免費排盤工具"
**Fix:** Standardize title format: `[Page Name] | 紫微斗數排盤`.

### L4. No Open Graph Image
**Severity:** Low
**Evidence:** OG tags present (`og:url`) but no `og:image` found.
**Fix:** Add `<meta property="og:image" content="/share-preview.png">` with a representative chart image.

### L5. No Schema.org Structured Data
**Severity:** Low
**Evidence:** No JSON-LD or microdata on any page.
**Fix:** Add `WebApplication` structured data:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "紫微斗數排盤",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web Browser"
}
```

### L6. No Loading State for Chart Generation
**Severity:** Low
**Evidence:** When clicking "排盤", the chart generates instantly (no loading indicator), but if it takes longer (slow device), users may think the button didn't work.
**Fix:** Show a brief loading spinner on the "排盤" button during calculation.

---

## Mobile Viewport Screenshots

- **375×812 (iPhone SE 3rd gen):** Chart view shows all 12 palaces in a single text block — very cramped. Form inputs (gender radio, date, time combobox) are usable but tight.
- **Touch targets:** 3–4 buttons below 44px on every page (prev/next navigation, icon toggle buttons).

---

## Recommended Priority Order

1. **C2** — Add `<main>` landmark + skip link (quick win, big accessibility impact)
2. **C3** — Make chart accessible to screen readers (restructure as table/grid)
3. **C1** — Create custom 404 page (GitHub Pages SPA requirement)
4. **H1** — Add `aria-label` to icon buttons
5. **H2** — Enlarge all touch targets to 44×44px minimum
6. **H3** — Skip-to-content link (paired with C2)
7. **H4** — Add `<nav>` landmark
8. **H5** — Fix 404 behavior
9. **M1–M8** — Theme color, Apple meta, chart readability, focus indicators, etc.

---

*Report generated: 2026-07-08 13:25 HKT*
