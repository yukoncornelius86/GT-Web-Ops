# SECRETS AND ENV GUIDE
Never commit `.env`.

## Secret locations
1. Local development: `.env` (copied from `.env.example`).
2. GitHub Actions: Repository -> Settings -> Secrets and variables -> Actions.
3. VPS runtime: `/opt/gt-web-ops/.env` or equivalent deployment path.
4. n8n credentials manager: SMTP, Google OAuth, Slack, Square, etc.
5. Cloudflare dashboard: Access applications, DNS, WAF, Turnstile.

## Required baseline
- `N8N_ENCRYPTION_KEY`, `N8N_BASIC_AUTH_PASSWORD`, `POSTGRES_PASSWORD`, `BLOG_STUDIO_SECRET_KEY`.

## Optional integrations
- SMTP (`SMTP_*`), Google (`GOOGLE_*`), Square future placeholders (`SQUARE_*`), IONOS (`IONOS_*`), VPS (`VPS_*`).
