# Apply and verify

Use an authorized connected development environment with Chromium available. Do not push main before review.

1. Clone https://github.com/yukoncornelius86/GT-Web-Ops, inspect AGENTS.md if present, and fetch current main.
2. This patch is based on a6b6136e6140b86037cd164aa1671162eb38d2dd. If main has advanced, compare changes before applying. Never replace the site wholesale with this snapshot.
3. Create a feature branch, then `git apply --check gt-project-review-20261022.patch` followed by `git apply gt-project-review-20261022.patch`.
4. Copy the review-artifacts folder into that repository. Run `python scripts/check-gt-public-site.py` and `python review-artifacts/check-preservation.py`. The latter expects the base form in HEAD until committing.
5. Start `python -m http.server 8766 --directory sites/thegtcollective`. In another terminal run `node review-artifacts/test.cjs`. Adjust Chromium executablePath to the authorized environment's installed browser if required. Playwright is needed.
6. Review desktop and mobile screenshots. External requests are intentionally blocked by the test. Fonts/Turnstile validation need a separate safe preview with production submission blocked. Never submit a real test inquiry.
7. Test keyboard focus, reduced motion, zoom, conditional fields and mocked success/error behavior. Confirm all routed links and form data are unchanged.
8. Review against live production and current main. Open a reviewable feature-branch PR only after tests. Merging/pushing main automatically deploys to GitHub Pages. Production deployment requires the parent's go-ahead after visual QA.
