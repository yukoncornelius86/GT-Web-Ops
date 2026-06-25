# GT Collective Local SEO Audit - June 25, 2026

## Scope

Audit focus: searches around ceramic coating, paint correction, paint polishing, and auto detailing near Leonardtown, St. Mary's County, Lexington Park, California, and Southern Maryland.

This audit is based on accessible public search result pages and live website checks from the local workstation. Google local-pack / Google Business Profile data could not be exhaustively verified from this environment, so that work remains a manual Google Maps / Business Profile task.

## Search Evidence

DuckDuckGo returned GT detailing content for the query `ceramic coating Leonardtown MD auto detailing`, but the result pointed at `thegtcafe.com`. Live checks confirmed `https://thegtcafe.com/` and `https://www.thegtcafe.com/` are currently serving an old GT detailing page with a canonical to `https://thegtcollective.com`. That is a cross-domain duplication problem and should be fixed by publishing the current `sites/thegtcafe/` coffee-only site.

Bing returned poor broad-match results for the test queries and was not useful for competitor discovery in this session.

## Competitor Snapshot

### Guy's Detailing

URL: `https://www.guysdetailing.com/shop`

Observed title: `Top Mobile Detailing Services & Ceramic Coatings in Leonardtown | Guy's Detailing`

Observed description: mobile detailing services, ceramic coatings for vehicles, boats, and RVs, 20+ years of expertise, Leonardtown, MD.

Takeaway: Strong title match for `mobile detailing`, `ceramic coatings`, and `Leonardtown`. GT should not try to look like the mobile option; GT should own the dedicated studio, correction-first coating, paint polishing, dry ice cleaning, and preservation position.

### Pro Gloss Auto Solutions

URL: `https://www.proglossautosolutions.com/`

Observed title: `Pro Car Care and Protection Packages in California, MD | Pro Gloss Auto Solutions`

Observed description: California, Maryland leader in ceramic coatings, restorative auto detailing, and related protection services.

Observed H1: `Southern Maryland's Premier Auto Detailing Center - Pro Gloss Auto Solutions`

Takeaway: Strong Southern Maryland / California MD positioning. GT should keep Leonardtown, St. Mary's County, Lexington Park, California, and Southern Maryland signals visible on the homepage and service pages.

### Spankin Clean

URL: `https://spankincleandetailing.com/`

Observed title: `Mobile Auto Detailing in Southern Maryland | Spankin Clean`

Observed description: professional mobile auto detailing in Southern Maryland, interior shampooing, steam cleaning, stain removal, and exterior detailing.

Observed H1: `Mobile Auto Detailing in Southern Maryland That Comes To You`

Takeaway: Strong mobile detailing positioning, less directly focused on ceramic coating / correction in the observed metadata. GT should keep its dedicated studio and high-skill paint services distinct.

### Directories

Yelp blocked automated inspection with `403`, but DuckDuckGo returned Yelp category pages for ceramic coating and auto detailing near Leonardtown.

Yahoo Local returned an `Auto Detailing in Leonardtown, MD` directory page and did not visibly mention GT in the retrieved HTML.

## Code Changes Made

- Homepage title, description, keywords, service copy, local service-area section, and internal links were tightened around ceramic coating, paint correction, paint polishing, and Leonardtown / St. Mary's County searches.
- LocalBusiness schema was expanded with real phone/email, more service-area cities, and automotive business typing.
- Service pages were added for:
  - `ceramic-coating-leonardtown-md.html`
  - `paint-correction-leonardtown-md.html`
  - `dry-ice-cleaning-southern-maryland.html`
  - `undercarriage-preservation-leonardtown-md.html`
- `sites/thegtcollective/sitemap.xml` now points at GT Collective service URLs instead of `thegtcafe.com`.
- `sites/thegtcollective/rss.xml` now describes GT Collective detailing content instead of GT Cafe.
- Homepage visible NAP data now matches schema: `crew@thegtcollective.com` and `(856) 237-9881`.
- Homepage journal cards now support detailing education and point to service pages.

## Remaining Non-Code Work

1. Publish the current GT Collective changes through the GitHub Pages workflow.
2. Publish the current GT Cafe coffee-only site so `thegtcafe.com` stops serving duplicated detailing content.
3. Open Google Business Profile / Google Maps manually and verify:
   - Business name, category, address/service area, phone, website URL, hours.
   - Primary category should be aligned with auto detailing.
   - Services should explicitly include ceramic coating, paint correction, paint polishing, dry ice cleaning, and undercarriage preservation where allowed.
   - Add photos of the studio, correction lighting, finished coatings, undercarriage work, and before/after paint correction.
4. Add review-request language after completed jobs, with customers naturally mentioning the exact service and city when true.
5. Submit `https://thegtcollective.com/sitemap.xml` in Google Search Console after publish.
