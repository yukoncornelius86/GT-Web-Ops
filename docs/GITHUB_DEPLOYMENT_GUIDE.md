# GITHUB DEPLOYMENT GUIDE
## Branch model
- `main` for production-ready content.
- feature branches for blog/content/infra changes.

## Before push
- Review `git status` and `git diff`.
- Ensure no `.env` or secrets are tracked.

## Example workflows
- `deploy-thegtcafe-to-ionos.example.yml`
- `deploy-thegtcollective-to-ionos.example.yml`
- `deploy-vps.example.yml`
- `backup-n8n.example.yml`

Rename examples only when secrets and targets are fully configured.
