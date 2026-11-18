# Acceptance matrix

Observed on 18 November 2026 by running `tests/acceptance.spec.js` with Playwright 1.61.1 in Chrome for Testing 153 (headless) against a local static server. Each check ran in two projects: desktop 1280×800 and Pixel 7 emulation at 390×844 (emulation, not a real phone). Every test also fails on any page error or console error. Result: 18 of 18 passed.

| Environment | Action | Expected | Observed | Pass/Fail | Limitation |
|---|---|---|---|---|---|
| Desktop + mobile emulation | 1. Same selections in control and B (Amber drift, quantity 3, every 8 weeks) | Identical requests | Both sent `{"id":4102,"quantity":3,"selling_plan":8108}` | Pass | Mock transport, no real cart |
| Desktop + mobile emulation | 2. One-time purchase, quantity 2 | No `selling_plan` | `{"id":4101,"quantity":2}` | Pass | |
| Desktop + mobile emulation | 3. Subscribe, then change frequency | Plan follows frequency | `selling_plan` 8104, then 8108 | Pass | |
| Desktop + mobile emulation | 4. Subscribe every 8 weeks, switch blend | New variant with valid plan | `{"id":4102,"quantity":1,"selling_plan":8108}` | Pass | App re-renders on variant change |
| Desktop + mobile emulation | 5. Subscribe, then back to one-time | No stale plan | `{"id":4101,"quantity":1}` | Pass | |
| Desktop + mobile emulation | 6. Run init twice, submit | One variation UI, one request per click | 1 UI, request counter 1 | Pass | |
| Desktop + mobile emulation | 7. Simulate app re-render, subscribe, submit | B re-attaches once to the new app markup | 1 UI, `selling_plan` 8108, request counter 1 | Pass | |
| Desktop + mobile emulation | 8. Disable, poke a detached B control, re-render, submit | Native form restored, detached controls inert | 0 B elements, `{"id":4101,"quantity":1}`, request counter 1 | Pass | |
| Desktop + mobile emulation | 9. Keyboard only: arrow to Subscription, Tab to frequency, arrow, Tab to Add to cart, Enter | Submits by keyboard, no horizontal scroll | `selling_plan` 8108, page width within viewport | Pass | Focus order checked, not screen-reader output |
| GitHub Pages (live) | Same 9 checks via the workflow's `pages` target | All pass | See the latest Actions run | See badge | Run from GitHub Actions |
| Physical phone | All checks in portrait and landscape | All pass | Pending – Nafees to verify on a real device | Pending | Not yet observed |
