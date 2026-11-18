# Subscription buy box A/B test

Compare a plain subscription selector (control) with a subscribe-and-save buy box (B), then inspect the exact request each one sends to a mock cart.

## Live demo
[Open the demo](https://nafeeshasnat.github.io/subscription-buy-box-ab-test/?v=b) · [Open control](https://nafeeshasnat.github.io/subscription-buy-box-ab-test/?v=control)

[![Playwright checks](https://github.com/nafeeshasnat/subscription-buy-box-ab-test/actions/workflows/qa.yml/badge.svg)](https://github.com/nafeeshasnat/subscription-buy-box-ab-test/actions/workflows/qa.yml)

## 30-second reviewer path
1. Choose Subscription, Every 8 weeks and Amber drift. Add to cart.
2. Inspect the submitted item. It should contain id 4102 and selling_plan 8108.
3. Simulate a rerender, run init twice and submit again. The request counter advances once. Switch to one-time and submit to remove the plan.

## How the variation attaches
The native product form owns submission. The mock subscription app owns its native inputs, prices and hidden selling plan. B hides the app's fieldset, renders option cards with benefits and a trust row, reads the prices the app rendered, and forwards every choice to the app's own controls. An observer on the product form attaches B to the replacement app subtree.
The variation script installs one lifecycle object on window. Pasting the script starts it; repeated evaluation reuses the same object. Call `window.foldleafVariation.init()` to activate it again. CSS is scoped to variation markup.

## How to disable
Choose **Disable variation**, or call `window.foldleafVariation.destroy()`. This disconnects observation, aborts variation listeners and removes the injected UI. Select Control for a shareable control URL.

## Where the mock ends
Independent frontend demo. All products, identifiers and app behavior are fictional. State resets on reload. The theme serializes a request body and sends it to an in-process mock transport. No network request or order is placed. Both blends accept both plans. Prices are fictional; the subscription price is 15% below one-time. The switch is for manual preview; there is no traffic allocation, analytics or measured lift.

## QA matrix
[Acceptance checks and observed environments](QA-MATRIX.md) · [Agency handoff](HANDOFF.md)

## Run locally
Serve the root with `python3 -m http.server 8080` and open `http://localhost:8080/?v=b`. No storefront build is needed.

For QA, install Node 22+, then run `npm install`, `npx playwright install chromium` and `npm test`. With no target supplied the runner starts a local HTTP server. To repeat the same tests against Pages, set `DEMO_BASE_URL=https://nafeeshasnat.github.io/subscription-buy-box-ab-test/` before running `npm test`.
