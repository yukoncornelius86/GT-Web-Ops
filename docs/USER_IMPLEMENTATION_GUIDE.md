# USER IMPLEMENTATION GUIDE
## 1) What this project does
Provides a local-first stack for static website preview, Blog Studio authoring, and n8n automation testing before VPS deployment.

## 2) Install prerequisites
- Git
- Docker Desktop
- VS Code/Codex
- Optional Python 3.11+

## 3) Clone and open
- Clone repo and open root folder.

## 4) Create environment
- `cp .env.example .env`
- Fill required values manually.

## 5) Required manual values
- `POSTGRES_PASSWORD`
- `N8N_ENCRYPTION_KEY`
- `N8N_BASIC_AUTH_PASSWORD`
- `BLOG_STUDIO_SECRET_KEY`

## 6) Start local stack
- `docker compose up -d --build`

## 7) Access services
- n8n: http://localhost:5678
- Blog Studio: http://localhost:8787
- Static preview: http://localhost:8080
- Optional: Portainer 9000, Uptime Kuma 3001 (`--profile tools`)

## 8) Import n8n workflows
Import JSON from `infra/n8n/workflows` in the n8n UI.

## 9) Test service request flow
Open `forms/service-request-test.html`, submit form, check `infra/n8n/logs/service-requests.jsonl`.

## 10-13) Integrations later
- Google Workspace OAuth via `GOOGLE_*` placeholders.
- SMTP via `SMTP_*` placeholders.
- Google Sheets logging in production workflow.
- Square is manual after consultation; do not automate deposits.

## 14) Use Blog Studio
- Import existing posts
- Create/edit markdown posts
- Preview markdown/full HTML
- Publish + export static files
- Commit/push content changes

## 15) Check changes before push
- `git status`
- `git diff --stat`

## 16-17) Deployment and migration
Use IONOS and VPS guides in `docs/` when ready to promote from local.

## 18-20) Security boundaries
Keep secrets local/private. Protect admin tools with Cloudflare Access in production.

## 21) Troubleshooting
See `docs/TROUBLESHOOTING.md`.
