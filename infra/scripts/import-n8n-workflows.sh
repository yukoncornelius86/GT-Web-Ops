#!/usr/bin/env bash
docker compose exec n8n n8n import:workflow --input=/workflows/service-request-local-test.json
