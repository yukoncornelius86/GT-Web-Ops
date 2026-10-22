# Project Review preview — 22 October 2026

**Status: tested local feature branch; NOT published. Production approval is pending.**

Repository: `yukoncornelius86/GT-Web-Ops`; source: `sites/thegtcollective`.
Branch: `feature/project-review-20261022`.
Pinned base and fetched `origin/main`: `a6b6136e6140b86037cd164aa1671162eb38d2dd`.

## Baseline and preservation

- The original checkout contains extensive unrelated tracked and untracked changes. Work used a separate Git worktree at `Desktop/GT-Project-Review-20261022`; the original checkout was not edited.
- No repository-specific AGENTS.md was present in the fetched tree; Desktop AGENTS.md applies. Direct Desktop reads/edits worked. Access-toolkit scripts were not found in the inspected locations; no ACL, administrator, network or security settings were changed.
- The attached ZIP was extracted separately and applied with `git apply --check` / `git apply`, not copied over the repository. It applied cleanly to current main.
- Read-only HTTP comparisons confirmed that the live homepage, bright stylesheet, consultation page, paint page and both Porsche articles match the pinned base after line-ending normalization.
- Production inquiry JavaScript and analytics JavaScript remain byte-equivalent after line-ending normalization. Form attributes, control IDs/names/types/required flags, option labels/values/order, privacy wording, Turnstile attributes/sitekey/action, scripts and submission endpoint are preserved.
- Shared navigation/footer, prices, images and hero overlays are preserved. Baseline line-ending conventions were retained to keep the source diff narrow.

## Changes

Seven substantive site files:

1. `sites/thegtcollective/consultation/index.html`: semantic project/details groups and presentation hooks from the supplied patch.
2. `sites/thegtcollective/assets/gt-project-review.css`: restrained consultation layout, spacing, rounded panels, controls, invalid-state presentation, reduced motion, and narrow-screen Turnstile space.
3. `sites/thegtcollective/assets/gt-bright-theme.css`: paired foreground/surface repairs for service cards, badge, project-review heading, paint statistics, Porsche facts/attributions, exterior article heroes, gallery image labels and minimal-hero secondary buttons; slightly darker gold scoped to known stone components.
4. `sites/thegtcollective/index.html`: project-review heading class and stylesheet version.
5. `sites/thegtcollective/paint-correction-leonardtown-md.html`: stylesheet version.
6. `sites/thegtcollective/blog/1988-porsche-911-dry-ice-cleaning.html`: story scope class and stylesheet version.
7. `sites/thegtcollective/blog/2013-porsche-cayenne-lanolin-undercoating.html`: story scope class and stylesheet version.

Sixteen additional public HTML files only change the shared stylesheet version to `20261022-review`, so the audited fixes are fetched on those pages too:

- `auction-preparation-listing-support.html`
- `ceramic-coating-leonardtown-md.html`
- `drivers-club/apply/index.html`
- `drivers-club/index.html`
- `expectations/index.html`
- `faq/index.html`
- `founders-letter.html`
- `gallery/index.html`
- `gt-stewardship.html`
- `philosophy/index.html`
- `preservation-baseline/index.html`
- `preservation-mechanical-services.html`
- `privacy-policy.html`
- `process/index.html`
- `services/preservation-cleaning/index.html`
- `undercarriage-preservation-leonardtown-md.html`

All paths above are relative to `sites/thegtcollective`. Supporting checks and input notes are under `review-artifacts`.

## Commands and static results

Use the bundled Python at `C:/Users/wmzan/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe` on this host:

```text
python scripts/check-gt-public-site.py
PASS: 21 public pages, 815 internal links/assets, sitemap, form labels, metadata, and price-guidance removal.

python review-artifacts/check-preservation.py
PASS: all field identifiers/types/required flags, option attributes, form action/method, scripts and Turnstile attributes preserved.

python review-artifacts/check-review-contract.py
PASS: option labels/order, privacy wording, inquiry JS, analytics JS, navigation, prices and image sources preserved against pinned base.

git -c core.autocrlf=false -c core.whitespace=cr-at-eol diff --check
PASS

node review-artifacts/check-live-baseline.cjs
PASS: six live source files match the pinned base; read-only GET requests only.
```

The uploaded `test.cjs` is retained as original input, not claimed as executed. Actual browser testing used the connected in-app Chromium browser through `cua_repl`, with its documented viewport, Playwright and CDP APIs. Results are saved as JSON; screenshots are from actual rendered pages with Google Fonts loaded.

## Rendered results

- 21 public pages × widths **320, 375, 390, 768, 1440** = **105 checks**, no page overflow and no detected AA text-contrast failures on the audited visible solid-surface text.
- Image/pseudo-element hero backgrounds are excluded from the solid-color calculation and were reviewed visually in desktop/mobile screenshots. Decorative transparent logo text is excluded. This is not a full WCAG certification or a pixel-level proof over every photograph.
- Main consultation and the homepage service cards, paint statistics and two Porsche fact/hero regions were captured at all five widths. Before screenshots cover consultation at all five widths and contrast components at 390/1440.
- All five widths: required controls/labels, native required validation, auction scope, expanded cleaning details, checkboxes, method enable/disable, mobile/desktop menus, Enter/Escape handling, menu focus restoration and visible 3px keyboard focus passed.
- Focus sequence: service → vehicle → goal → first name → last name → email → phone → timing → preferred contact. Hidden/disabled conditional controls do not intercept this sequence.
- All five widths: phone preference validation, submitting/disabled state, mock HTTP failure, retained details, enabled retry, mock success, hidden form and success focus passed.
- Additional 390px tests: invalid email, missing token, mock expired-security rejection, unconfirmed/empty response, underbody details and mocked Stewardship plan context passed.
- Fail-closed initial disabled button was verified by temporarily blocking only the local inquiry script, then restoring it. No source handler or production setting was disabled.
- Reduced-motion emulation: input/button transitions `0s`; document scroll behavior `auto`. Emulation was cleared afterward.
- Turnstile available widths: **303, 342, 357, 615, 726px** respectively. A visible genuine Cloudflare test widget fits, including a classic 15px scrollbar at 320px. The supplied patch initially left only 287px at 320 and 293px at 390; the tested CSS fixes these cases.
- Browser screenshots confirm readable card descriptions, badge/heading, paint figures, fact values/attributions, and light Porsche headings over the unchanged dark image heroes.

## Mocking and limitations

- **No real inquiry was sent.** The loopback preview sends a CSP that blocks production form/analytics requests. Explicit `?qa=...` URLs inject a local mock fetch handler; request outcomes and a simulated token are controlled by a visibly labelled local QA panel. These helpers live outside the site source and are not deployed.
- The production Turnstile sitekey rejects localhost with error 110200 (domain not authorized). For rendering tests only, the preview response substitutes Cloudflare's documented visible test sitekey. The repository's production key, widget attributes and endpoint are unchanged. Test-widget success is not production security or delivery validation.
- References: https://developers.cloudflare.com/turnstile/troubleshooting/testing/ and https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/.
- Real endpoint delivery, server-side token verification, real-user challenge behavior, physical-device Safari and a screen-reader session remain untested. Hidden lightboxes and dynamically loaded remote plans are not a complete site-wide accessibility certification.
- No push/merge to main, production deployment, real test inquiry, permission expansion or security change occurred.

## Preview and evidence

- Candidate: http://127.0.0.1:18921/consultation/
- Baseline: http://127.0.0.1:18922/consultation/
- Review gallery: http://127.0.0.1:18921/__review/
- Evidence folder: `Desktop/GT-Project-Review-QA-20261022` (before/after screenshots, comparison sheets, JSON test results, local preview/mock helpers and gallery).
- The preview is loopback-only and requires this computer and the preview process to remain running.

## Decision log and next step

1. Keep the supplied design direction and form behavior; adapt only for measured layout/contrast defects.
2. Reserve widget space based on the actual content viewport, including scrollbar width.
3. Preserve image-hero overlays and restore their intended light foregrounds, rather than applying blanket text-color overrides.
4. Keep audit fixes scoped to components and known surface containers; version shared CSS on every affected public page.
5. Await the user's approval of this tested preview. After approval: fetch/reconcile main again, publish only the reviewed feature changes, watch Pages deployment, verify the specified live pages, and report the actual deployment commit. A real delivery test needs separate approval.
