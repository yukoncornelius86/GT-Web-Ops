# Imported package notes (historical)

The following notes describe the supplied ZIP before this run. See TEST-RESULTS.md for current rendered validation and approval status.

# GT Collective Project Review refinement

Status: local candidate only. NOT published, NOT visually validated.

Source: https://github.com/yukoncornelius86/GT-Web-Ops
Base: a6b6136e6140b86037cd164aa1671162eb38d2dd (main at clone time). Production workflow deploys sites/thegtcollective on a main push. No preview workflow found.

## Scope
- Consultation: editorial introduction; two semantic fieldsets (The project / Your details), smoother spacing, tactile controls, calm ivory surfaces, gold detail, desktop sidebar, single-column phone layout, visible focus and reduced-motion support.
- Preserves field IDs/names, required flags, options, endpoint/method, scripts, Turnstile, privacy language, success and status content. No backend changes.
- Scoped contrast repairs: homepage service descriptions, popular badge and Project Review panel heading; paint page stats; two Porsche case-study facts and quote attribution.
- No hero images, copy meaning, price, routing, checkout, Cafe or account changes.

## Verified
- scripts/check-gt-public-site.py PASS: 21 public pages, 815 internal links/assets, sitemap, form labels, metadata and price-guidance removal.
- review-artifacts/check-preservation.py PASS: form identifiers/types/required flags, option attributes, form action/method, script list and Turnstile unchanged.
- git -c core.whitespace=cr-at-eol diff --check PASS.
- No live inquiries submitted or remote writes.

## Remaining QA before deployment
- Run review-artifacts/test.cjs with installed Chromium and local server on port 8766. It blocks every non-local request to prevent analytics or production form calls. Tests widths 1440/768/390/382/381/375/360/320, overflow, required validation, service-dependent details, reserved Turnstile container width and computed colors; captures screenshots. No tests in this script reached execution here. All external requests are blocked, so the real Turnstile widget and Google Fonts do not load. Reserved container width is only a synthetic geometry check, not proof that the real widget fits or works; recorded colors are diagnostics, not contrast-ratio assertions.
- Inspect screenshots with actual fonts loaded in a suitable local environment. Check keyboard sequence, visible focus, nav at mobile sizes, enlarged text, reduced motion, conditional cleaning and auction sections, phone preference validation, failure and success states with mocked endpoints only.
- Baseline vs live differences must be reconciled before deploying because source main may not reflect every direct-upload production change.

## Remaining environment limitation
The available browser could not run the local preview. Desktop/mobile screenshots and runtime behavior therefore remain unverified. Use the included apply-and-verify instructions when a suitable development computer is connected. No security or network settings were changed.

## Static review follow-up
- Preserved all form controls, required flags, option attributes, submission endpoint, scripts and Turnstile attributes. No routing regression found.
- Corrected sidebar list-selector specificity so its intended spacing wins the older aside rules.
- Restored distinct error text using a consultation-scoped foreground override, which wins the shared main-paragraph color rule.
- Reserved at least 300px for flexible Turnstile at 320px and wider target viewports: through 381px, use 8px page insets, 12px form insets and -12px widget margins. The main wrapper is border-box; the form is an auto-width stretched grid item. The 381px breakpoint also covers the otherwise-too-narrow 361–381px range. Real-widget QA remains required.
