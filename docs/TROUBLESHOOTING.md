# TROUBLESHOOTING
## Docker Desktop not running
Start Docker Desktop and rerun `docker compose up -d --build`.

## Port already in use
Change local ports in `docker-compose.yml` or stop conflicting service.

## n8n cannot connect to PostgreSQL
Check `.env` DB values and `docker compose logs postgres n8n`.

## Blog Studio cannot write files
Ensure repo mount `./:/workspace` exists and permissions allow writes.

## Git auth issues
Use SSH key or GitHub credential manager. Verify with `git pull`.

## Workflow import errors
Use n8n UI import and validate node versions.

## Email not sending / Google OAuth missing
Use local logging-only flow until credentials are configured.
