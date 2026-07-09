# Out-of-scope Copilot comments for Issue #10

## CSS Duplication (noted for future refactor)
- focus/reduced-motion CSS duplicated across 5 HTML files → extract to shared stylesheet

## Pre-existing DOM issues (from PRs #8-#16, not in scope for #10)
- footer nested inside nav (index.html, about.html, contact.html, privacy-policy.html)
- Unclosed .container div elements (about.html, contact.html, privacy-policy.html)
- Out-of-order closing tags (</main>, </div> nesting)
- aria-label not localized to zh-TW (all HTML files)
- main landmark position in index.html (jumps past form inputs)

## Resolved comments
- ✅ :focus fallback for browser compatibility (added *:focus + *:focus:not(:focus-visible))
