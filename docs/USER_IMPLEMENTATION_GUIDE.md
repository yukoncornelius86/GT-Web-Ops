# USER IMPLEMENTATION GUIDE
## Start here
1. Copy `.env.example` to `.env` and fill all `change-me` and blank values.
2. Run `docker compose up -d --build`.
3. Open:
   - n8n: http://localhost:5678
   - Blog Studio: http://localhost:8787
   - Static preview: http://localhost:8080
   - Portainer (optional): http://localhost:9000 (`--profile tools`)
   - Uptime Kuma (optional): http://localhost:3001 (`--profile tools`)

## Required installs
Git, Docker Desktop, optional Python 3.11+, VS Code/Codex.

## Credentials entry points
- Local `.env`
- GitHub repo secrets for actions
- VPS `.env`
- n8n credentials manager
- Cloudflare dashboard

## Manual business flow policy
Service requests are consultation-only. Do not automate Square invoice/deposit creation.
