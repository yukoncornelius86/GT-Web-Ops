#!/usr/bin/env bash
docker compose exec n8n n8n export:workflow --all --output=/workflows/export.json
