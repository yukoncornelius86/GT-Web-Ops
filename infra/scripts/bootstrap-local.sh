#!/usr/bin/env bash
cp -n .env.example .env
docker compose up -d --build
