# CLOUDFLARE SECURITY GUIDE
## Recommended map
- Public: `thegtcafe.com`, `thegtcollective.com`
- Protected: `automation.thegtcollective.com`, `blogstudio.thegtcollective.com`, `status.thegtcollective.com`, `portainer.thegtcollective.com`

## Access policy
- Protect n8n editor/admin via Cloudflare Access.
- Expose only required public webhook paths.
- Protect Portainer and Uptime Kuma behind identity-based access.

## Form protection
- Add Cloudflare Turnstile to public request forms.
- Rate-limit webhook endpoints.
