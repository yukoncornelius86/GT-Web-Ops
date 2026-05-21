# BLOG STUDIO GUIDE
## URL
- http://localhost:8787

## Core flow
1. Open **Settings** and confirm `active_site`.
2. Run **Import Existing** to pull from `sites/{site}/blog-posts.js`.
3. Create/edit posts in **Editor** using markdown + front matter fields.
4. Set status to `published` for public export.
5. Click **Export Static Files** on Dashboard.
6. Validate output in:
   - `sites/{site}/blog/*.html`
   - `sites/{site}/blog-posts.js`
   - optional `sitemap.xml` and `rss.xml`

## Archive/delete
- Default action is archive (moves markdown to `blog-studio/content/archived`).
- Hard delete should only be used in advanced mode policy.

## Git workflow
- Verify status on dashboard.
- Commit/push from terminal (or future UI enhancements).
- Never store GitHub password in app settings.
