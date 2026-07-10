# Task Plan — Issue #20

## Issue: [Module 9] Extract shared accessibility CSS from inline styles

## Steps

| Step | Description | Status | Timestamp |
|------|-------------|--------|-----------|
| 0 | Init (read issue, check CI, create branch) | ✅ DONE | 2026-07-10T13:18 |
| 1 | Group Problems (single group — all 5 files) | ✅ DONE | 2026-07-10T13:18 |
| 2 | Fix Code (create css/accessibility.css, link all pages, remove inline) | ✅ DONE | 2026-07-10T13:18 |
| 3 | Self-Review (6-axis) | 🔄 IN PROGRESS | |
| 4 | Integration Tests | ⏳ PENDING | |
| 5 | Push to origin | ⏳ PENDING | |
| 6 | CI + Copilot Monitor Loop | ⏳ PENDING | |
| 7 | Merge Gate | ⏳ PENDING | |
| 8 | Report | ⏳ PENDING | |

## Fix Summary
- Created `css/accessibility.css` with focus-visible and prefers-reduced-motion rules
- Added `<link rel="stylesheet" href="/css/accessibility.css">` to all 5 HTML files
- Removed duplicated inline CSS blocks from all 5 files
