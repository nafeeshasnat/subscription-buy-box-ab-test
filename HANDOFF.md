# Agency handoff

**Change.** B replaces the app's plain purchase options with two option cards (one-time and subscription with a Save 15% tag and Most popular badge), a benefits list, a styled frequency picker and a trust row under Add to cart. Prices are read from the app's own markup. The app continues to own frequency, plan and add-to-cart behavior.

**Target.** This repo's fictional product page with a compatible app fieldset and purchase controls. Preview with `?v=b`. Review control with `?v=control`. No automatic launch.

**Events.** B forwards native change/click events to app fields. The theme alone handles form submit. The panel records the serialized request received by the mock. No analytics tags fire.

**Rollback.** Disable variation in the toolbar or call `window.foldleafVariation.destroy()`. No theme changes are needed to restore control.

**Limits.** Local fictional data; no merchant API, payment, analytics or traffic assignment. Physical-device testing is pending. Recheck selectors, plan eligibility, app events and the agreed browser matrix before adapting to a different environment.
