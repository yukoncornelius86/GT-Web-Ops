# LOCAL TESTING GUIDE
1. Copy `.env.example` to `.env` and fill placeholders.
2. Start stack: `docker compose up -d --build`.
3. Validate endpoints:
   - http://localhost:8080
   - http://localhost:8787
   - http://localhost:5678
4. Import n8n workflow: `infra/n8n/workflows/service-request-local-test.json`.
5. Submit `forms/service-request-test.html`.
6. Check local request log: `infra/n8n/logs/service-requests.jsonl`.
7. Create Blog Studio post and export; confirm generated static files.
