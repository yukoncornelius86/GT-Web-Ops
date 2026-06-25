# GT Collective Local SEO Audit - June 25, 2026

## Scope

Audit focus: searches around ceramic coating, paint correction, paint polishing, and auto detailing near Leonardtown, St. Mary's County, Lexington Park, California, and Southern Maryland.

This audit is based on accessible public search result pages, live website checks, and a headless Chrome Google Maps review from the local workstation. Google Maps can vary by user, device, location, personalization, and time, so the rankings below should be treated as a June 25, 2026 snapshot rather than a permanent position.

## Search Evidence

DuckDuckGo returned GT detailing content for the query `ceramic coating Leonardtown MD auto detailing`, but the result pointed at `thegtcafe.com`. Live checks confirmed `https://thegtcafe.com/` and `https://www.thegtcafe.com/` are currently serving an old GT detailing page with a canonical to `https://thegtcollective.com`. That is a cross-domain duplication problem and should be fixed by publishing the current `sites/thegtcafe/` coffee-only site.

Bing returned poor broad-match results for the test queries and was not useful for competitor discovery in this session.

## Google Maps Snapshot

Test center: Leonardtown / St. Mary's County area.

Queries checked in Google Maps:

### `ceramic coating near Leonardtown MD`

Visible local order:

1. Obsessed Detail
2. Pro-Gloss Auto Solutions
3. The GT Collective
4. The Detail Company
5. Rush's Auto Spa & Services
6. Supreme Finishes MxD
7. SOMD DETAILING & WINDOW TINT
8. Polish And Rinse Detailing
9. Pure Chrome Detailing
10. Dylan's Mobile Detailing

GT evidence: The GT Collective appeared as a `5.0` rated `Car detailing service` at `19220 Eliff Ln` with `(856) 237-9881`, website link, and directions link.

### `paint correction near Leonardtown MD`

Visible local order after one sponsored auto repair result:

1. Obsessed Detail
2. Pro-Gloss Auto Solutions
3. The GT Collective
4. Polish And Rinse Detailing
5. Rush's Auto Spa & Services
6. The Detail Company
7. SOMD DETAILING & WINDOW TINT
8. Dylan's Mobile Detailing
9. Supreme Finishes MxD

GT evidence: The GT Collective appeared as a `5.0(1)` rated `Car detailing service`; visible review snippet: `The gloss and finish look incredible--better than showroom quality.`

### `auto detailing ceramic coating Lexington Park MD`

Visible local order:

1. The Detail Company
2. Rush's Auto Spa & Services
3. Pro-Gloss Auto Solutions
4. Big Boyz Accessories & Auto Detailing
5. Down & Dirty Detailing
6. PurgeeBeatsMobileDetailing
7. The GT Collective
8. PRO CERAMIC - Best Auto Salon
9. Shine Right Auto Detailing
10. Pure Chrome Detailing

GT evidence: The GT Collective appeared, but below several Lexington Park / California-area competitors. This is likely partly proximity-driven.

### `paint polishing St Marys County MD`

Visible local order:

1. Polish And Rinse Detailing
2. Rush's Auto Spa & Services
3. Pro-Gloss Auto Solutions
4. Obsessed Detail
5. Dylan's Mobile Detailing
6. The Detail Company
7. Supreme Finishes MxD
8. Butler Auto Detailing & Ceramic Coatings
9. SOMD DETAILING & WINDOW TINT
10. Pure Chrome Detailing

GT evidence: The GT Collective did not appear in the first visible set for this query. That is the clearest remaining Google Business Profile gap from this pass.

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
- Existing full service pages were preserved and their title / description snippets were tightened for:
  - `ceramic-coating-leonardtown-md.html`
  - `paint-correction-leonardtown-md.html`
  - `dry-ice-cleaning-southern-maryland.html`
  - `undercarriage-preservation-leonardtown-md.html`
- `sites/thegtcollective/sitemap.xml` now points at GT Collective service URLs instead of `thegtcafe.com`.
- `sites/thegtcollective/rss.xml` now describes GT Collective detailing content instead of GT Cafe.
- Homepage visible NAP data now matches schema: `crew@thegtcollective.com` and `(856) 237-9881`.
- Homepage journal cards now support detailing education and point to service pages.
- PR #4 merged to `main` and the GitHub Pages deployment completed successfully on June 25, 2026. Live verification returned HTTP `200` for the homepage, service pages, sitemap, and RSS.

## Remaining Non-Code Work

1. Publish the current GT Cafe coffee-only site so `thegtcafe.com` stops serving duplicated detailing content.
2. Open Google Business Profile / Google Maps manually and verify:
   - Business name, category, address/service area, phone, website URL, hours.
   - Primary category should be aligned with auto detailing.
   - Services should explicitly include ceramic coating, paint correction, paint polishing, dry ice cleaning, and undercarriage preservation where allowed.
   - Add photos of the studio, correction lighting, finished coatings, undercarriage work, and before/after paint correction.
   - Pay special attention to the `paint polishing St Marys County MD` gap; add `Paint Polishing` as a service if Google Business Profile allows it.
3. Add review-request language after completed jobs, with customers naturally mentioning the exact service and city when true. For the current gap, ask legitimate paint correction / polishing customers to describe the service in their own words.
4. Submit or resubmit `https://thegtcollective.com/sitemap.xml` in Google Search Console after publish.
5. Add more project photos to Google Business Profile and the website showing paint polishing/correction work under lights, ceramic coating finished gloss, and the Leonardtown studio environment.
