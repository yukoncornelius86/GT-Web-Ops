# N8N SETUP GUIDE
- URL: http://localhost:5678
- Default auth from `.env`: `N8N_BASIC_AUTH_USER` / `N8N_BASIC_AUTH_PASSWORD`.
- Import workflows: n8n UI -> Workflows -> Import from file -> `infra/n8n/workflows/*.json`.
- Local test form: open `forms/service-request-test.html`, submit, inspect `infra/n8n/logs/service-requests.jsonl`.
- SMTP setup: create SMTP credential in n8n; add `SMTP_*` placeholders in `.env`.
- Google setup (later): create OAuth credential and sheets/gmail nodes using `GOOGLE_*` values.
- Export workflow: use `infra/scripts/export-n8n-workflows.sh`.
- Security: keep editor/admin private, only expose webhook endpoints publicly in production.
- VPS migration: change `WEBHOOK_URL` to public HTTPS domain.
