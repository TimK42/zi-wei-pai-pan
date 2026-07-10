# Issue #18 — DOM Structure Fix

## Status: Step 1 — Grouping Problems

| Step | Description | Status | Timestamp |
|------|-------------|--------|-----------|
| 0 | Init (read issue, check CI, create branch/PR) | ✅ DONE |
| 1 | Group problems | ⏳ IN PROGRESS |
| 2 | Fix code (iterate groups) | ⏳ PENDING |
| 3 | Self-review (6-axis) | ⏳ PENDING |
| 4 | Integration tests | ⏳ PENDING |
| 5 | Push to origin | ⏳ PENDING |
| 6 | CI + Copilot monitor loop | ⏳ PENDING |
| 7 | Merge gate | ⏳ PENDING |
| 8 | Report | ⏳ PENDING |

## Issue Summary
Fix DOM structure across all HTML pages:
- footer inside nav (footer should wrap nav, not be inside it)
- Unclosed .container div across all pages
- Out-of-order close tags

## Affected Files
- index.html
- about.html
- contact.html
- privacy-policy.html

## Analysis (Step 1)
### DOM Structure Verification
Using codebase-memory-mcp to verify actual HTML structure:

**All 4 files — verified with Python depth tracking:**
- `.container` properly closed before `</main>` ✅ (depth returns to 0 after .container closes)
- `<footer>` at document level, NOT inside nav ✅ 
- `<nav>` correctly nested inside `<footer>` ✅
- All opening/closing tags balanced ✅

**Structure in all files:**
```html
<div class="container">
  <main id="main-content">
    ... page content ...
  </main>
</div>
<footer>
  <nav aria-label="...">...</nav>
</footer>
```

This matches the expected structure from issue #18.
The issue description may have been based on a different code version.

### Fix Grouping
**Group 0 (DOM structure):** All 4 files — verify/restructure DOM landmarks
