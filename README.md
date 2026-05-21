# GT Web Ops Local Lab
Enterprise-ready local-first stack for The GT Cafe and The Grand Tour Collective.

## Services
- Static preview: http://localhost:8080
- Blog Studio: http://localhost:8787
- n8n: http://localhost:5678
- Portainer (optional profile): http://localhost:9000
- Uptime Kuma (optional profile): http://localhost:3001

## Quick start
1. `cp .env.example .env`
2. Fill placeholders (do not use real secrets in Git).
3. `docker compose up -d --build`
4. Import n8n local workflow from `infra/n8n/workflows/service-request-local-test.json`.
5. Submit `forms/service-request-test.html` and verify log output.

## Safety
- Consultation-first flow only.
- No automatic Square invoice/deposit requests.
- Admin tools should be protected behind access controls in production.

## Read first
- `docs/USER_IMPLEMENTATION_GUIDE.md`
- `docs/N8N_SETUP_GUIDE.md`
- `docs/BLOG_STUDIO_GUIDE.md`
- `docs/SECRETS_AND_ENV_GUIDE.md`

## PR note
If a GitHub PR was updated outside Codex, open a new PR from latest branch state.
