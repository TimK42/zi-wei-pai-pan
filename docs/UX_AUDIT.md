# 紫微斗數排盤 UI/UX Audit Report

> **📅 Last updated: 2026-07-10** — findings marked ✅ Resolved have been addressed in subsequent PRs.
> Original report conducted: 2026-07-08 via browser-based inspection (375×812 mobile viewport)
> Pages audited: 5 pages (index, about, contact, privacy-policy, 404)
> Framework: Vanilla HTML/CSS/JS (single-page app in index.html)
>
> See [CHANGELOG.md](../CHANGELOG.md) for the full fix history.

---

## 📊 Summary

| Severity | Count | Resolved |
|----------|-------|----------|
| 🔴 Critical | 3 | 3 ✅ |
| 🟧 High | 5 | 5 ✅ |
| 🟨 Medium | 8 | 4 ✅ |
| 🟩 Low | 6 | 4 ✅ |
| **Total** | **22** | **16 ✅** |

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

### ~~C1. 404 Page Returns Full Chart Page~~ ✅ Resolved
**Severity:** Critical
**Pages affected:** All
**Resolved in:** PR #14 (2026-07-09)
**Fix:** Custom `404.html` created with error message, back link, and About/Contact links.

### ~~C2. No `<main>` Landmark on Any Page~~ ✅ Resolved
**Severity:** Critical
**Pages affected:** All
**Resolved in:** PR #12 (2026-07-08)
**Fix:** `<main id="main-content">` added to all pages with skip-to-content link (`<a href="#main-content" class="skip-link">跳到主要內容</a>`).

### ~~C3. Chart Palaces Are Not Accessible to Screen Readers~~ ✅ Resolved
**Severity:** Critical
**Pages affected:** index.html (chart view)
**Resolved in:** PR #13 (2026-07-09)
**Fix:** Chart grid now uses `role="grid"` with `aria-label`, `aria-rowcount="4"`, `aria-colcount="4"`. Each palace cell has a dynamic `aria-label` set at render time.

---

## 🟧 High Issues

### ~~H1. Icon Buttons Lack `aria-label`~~ ✅ Resolved
**Severity:** High
**Pages affected:** index.html
**Resolved in:** PR #15 (2026-07-09)
**Fix:** `aria-label` added to all icon-only buttons: prediction toggle, prev/next navigation, and dynamic ARIA labels on palace cells.

### ~~H2. Touch Targets Below 44px on All Pages~~ ✅ Resolved
**Severity:** High
**Pages affected:** All pages
**Resolved in:** PR #15 (2026-07-09)
**Fix:** All interactive buttons now have `min-width: 44px; min-height: 44px` plus adequate padding.

### ~~H3. No Skip-to-Content Link~~ ✅ Resolved
**Severity:** High
**Pages affected:** All pages
**Resolved in:** PR #12 (2026-07-08, same fix as C2)
**Fix:** Skip link `<a href="#main-content" class="skip-link">跳到主要內容</a>` added as the first focusable element on all pages.

### ~~H4. No `<nav>` Landmark~~ ✅ Resolved
**Severity:** High
**Pages affected:** All pages
**Resolved in:** PR #12 (2026-07-08)
**Fix:** Footer navigation links wrapped in `<nav aria-label="站內導航">` on all pages.

### ~~H5. No Custom 404 — Users Lost on Wrong URLs~~ ✅ Resolved
**Severity:** High
**Pages affected:** All unknown URLs
**Resolved in:** PR #14 (2026-07-09, same fix as C1)
**Fix:** Custom `404.html` created with 頁面找不到 message, back link, and footer navigation.

---

## 🟨 Medium Issues

### ~~M1. No `<meta name="theme-color">`~~ ✅ Resolved
**Severity:** Medium
**Pages affected:** All pages
**Resolved in:** PR #16 (2026-07-09)
**Fix:** `<meta name="theme-color" content="#D9D2BC">` added to all pages.

### ~~M2. No Apple Web App Meta Tags~~ ✅ Resolved
**Severity:** Medium
**Pages affected:** All pages
**Resolved in:** PR #16 (2026-07-09)
**Fix:** Apple web app meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`) added to all pages.

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

### ~~M7. No Focus Indicators Visible (Keyboard Navigation)~~ ✅ Resolved
**Severity:** Medium
**Pages affected:** All pages
**Resolved in:** PR #17 (2026-07-09), reinforced in PR #24 (`css/accessibility.css`)
**Fix:** Global `:focus-visible` styles with 2px solid #8B7355 outline added via `css/accessibility.css`.

### ~~M8. No `prefers-reduced-motion` Handling~~ ✅ Resolved
**Severity:** Medium
**Pages affected:** index.html
**Resolved in:** PR #17 (2026-07-09), reinforced in PR #24 (`css/accessibility.css`)
**Fix:** `@media (prefers-reduced-motion: reduce)` media query added to `css/accessibility.css`.

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

### ~~L3. Page Title Format Inconsistent~~ ✅ Resolved
**Severity:** Low
**Resolved in:** PR #22 (2026-07-10)
**Fix:** All 5 pages standardized to `[Page Name] | 紫微斗數排盤` format.
- index: `首頁 | 紫微斗數排盤`
- about: `關於 | 紫微斗數排盤`
- contact: `聯絡我們 | 紫微斗數排盤`
- privacy: `隱私權政策 | 紫微斗數排盤`
- 404: `頁面找不到 | 紫微斗數排盤`

### ~~L4. No Open Graph Image~~ ✅ Resolved
**Severity:** Low
**Resolved in:** PR #22 (2026-07-10)
**Fix:** `<meta property="og:image" content="/icon-192.png">` added to all 5 pages.

### ~~L5. No Schema.org Structured Data~~ ✅ Resolved
**Severity:** Low
**Resolved in:** PR #22 (2026-07-10)
**Fix:** `WebApplication` JSON-LD structured data added to all 5 pages with name, description, author, and pricing info.

### ~~L6. No Loading State for Chart Generation~~ ✅ Resolved
**Severity:** Low
**Resolved in:** PR #22 (2026-07-10)
**Fix:** Loading spinner (Bootstrap `.spinner-border`) with `aria-hidden="true"` displayed on 排盤 button during calculation, disabled state with restoration in `finally` block.

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
