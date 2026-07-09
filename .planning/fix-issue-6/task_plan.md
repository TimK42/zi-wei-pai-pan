# Task Plan: Issue #6 - Make 12-palace chart accessible

## Status
- **Current Phase**: Step 3 (Self-Review)
- **Next Action**: Self-review 6-axis

## Steps
- [x] Step 0: Init - Read issue, understand repo, create branch
- [x] Step 1: Group problems (single group)
- [x] Step 2: Fix Code - Add ARIA roles to chart grid
- [ ] Step 3: Self-Review 6-axis
- [ ] Step 4: Integration Tests
- [ ] Step 5: Self-Check + Push
- [ ] Step 6: CI + Copilot Monitor Loop
- [ ] Step 7: Merge Gate
- [ ] Step 8: Report

## Fix Summary
Added ARIA grid accessibility to the 12-palace chart:
- `role="grid"` on chart container with `aria-rowcount` and `aria-colcount`
- `role="gridcell"` on each palace cell
- Dynamic `aria-label` on each cell with palace name, branch, and star list
- Visually hidden `<h2>` heading for chart section
- `.sr-only` utility class for screen-reader-only content
