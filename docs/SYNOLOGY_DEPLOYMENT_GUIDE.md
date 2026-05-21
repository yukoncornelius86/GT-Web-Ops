# Synology Deployment Guide

This guide is for reviewing GT Web Ops on a Synology NAS before later VPS integration.

## Requirements

- Synology Container Manager or Docker package installed.
- SSH enabled if using the deploy script.
- A NAS folder such as `/volume1/docker/gt-web-ops`.
- A non-public review network. Do not expose Blog Studio or n8n directly to the internet.

## Security posture

`docker-compose.synology.yml` binds all review ports to `SYNOLOGY_BIND_IP`.

- Default: `127.0.0.1`, reachable only from the NAS or through SSH tunnels.
- LAN review: set `SYNOLOGY_BIND_IP` to the NAS LAN IP, for example `192.168.1.50`.
- Public access: use a reverse proxy with password protection or identity-aware auth. Do not publish Blog Studio or n8n unauthenticated.

Blog Studio git actions remain disabled by default. Enable them only for a trusted admin workflow after reviewing the repository and remote settings.

## Option A: deploy by SSH from Windows

From this repository on your Windows machine:

```powershell
.\infra\scripts\deploy-synology.ps1 -SynologyHost 192.168.1.50 -SynologyUser your-nas-user
```

Then SSH into the Synology and edit the environment file:

```sh
cd /volume1/docker/gt-web-ops
cp .env.synology.example .env
vi .env
```

At minimum, replace:

- `N8N_ENCRYPTION_KEY`
- `N8N_BASIC_AUTH_PASSWORD`
- `POSTGRES_PASSWORD`
- `BLOG_STUDIO_SECRET_KEY`
- `SYNOLOGY_BIND_IP`

Start the stack:

```sh
docker compose -f docker-compose.yml -f docker-compose.synology.yml --env-file .env up -d --build
```

Optional tools:

```sh
docker compose -f docker-compose.yml -f docker-compose.synology.yml --env-file .env --profile tools up -d --build
```

## Option B: upload through DSM

1. Create `/volume1/docker/gt-web-ops` in File Station.
2. Upload the repository contents into that folder.
3. Copy `.env.synology.example` to `.env` and edit the secrets.
4. In Container Manager, create a project from the folder.
5. Use both compose files:
   - `docker-compose.yml`
   - `docker-compose.synology.yml`
6. Build and start the project.

## Review URLs

If `SYNOLOGY_BIND_IP` is your NAS LAN IP:

- Static preview: `http://NAS-IP:8080`
- Blog Studio: `http://NAS-IP:8787`
- n8n: `http://NAS-IP:5678`
- Caddy local route: `http://NAS-IP:8088`
- Portainer optional profile: `http://NAS-IP:9000`
- Uptime Kuma optional profile: `http://NAS-IP:3001`

If `SYNOLOGY_BIND_IP=127.0.0.1`, use SSH tunnels:

```sh
ssh -L 8080:127.0.0.1:8080 -L 8787:127.0.0.1:8787 -L 5678:127.0.0.1:5678 your-nas-user@NAS-IP
```

Then open:

- `http://localhost:8080`
- `http://localhost:8787`
- `http://localhost:5678`

## Useful commands

```sh
cd /volume1/docker/gt-web-ops
docker compose -f docker-compose.yml -f docker-compose.synology.yml --env-file .env ps
docker compose -f docker-compose.yml -f docker-compose.synology.yml --env-file .env logs -f
docker compose -f docker-compose.yml -f docker-compose.synology.yml --env-file .env down
```

## VPS migration note

Use this Synology review to validate content authoring, n8n workflow behavior, and secrets. For VPS deployment, keep public traffic behind a reverse proxy with TLS and auth for admin tools, then switch to the production compose overlay and DNS-specific environment values.
