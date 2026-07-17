#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${ROOT_DIR:-/opt/gt-automation-ops}"
BACKUP_DIR="${BACKUP_DIR:-${ROOT_DIR}/backups/full}"
RETENTION_COUNT="${RETENTION_COUNT:-14}"
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-gtwo_postgres}"
POSTGRES_USER="${POSTGRES_USER:-n8n}"
POSTGRES_DB="${POSTGRES_DB:-n8n}"
SYNOLOGY_BACKUP_HOST="${SYNOLOGY_BACKUP_HOST:-100.112.76.111}"
SYNOLOGY_BACKUP_USER="${SYNOLOGY_BACKUP_USER:-wmzanni}"
SYNOLOGY_BACKUP_DIR="${SYNOLOGY_BACKUP_DIR:-/volume1/docker/VPS Backups/GT-Automation-Ops}"
SYNOLOGY_BACKUP_KEY="${SYNOLOGY_BACKUP_KEY:-/root/.ssh/gt_synology_backup_ed25519}"

stamp="$(date -u +%Y%m%d-%H%M%SZ)"
host="$(hostname -s)"
work="$(mktemp -d)"
tmp_archive="${BACKUP_DIR}/.${host}-${stamp}.tar.gz.tmp"
archive="${BACKUP_DIR}/${host}-${stamp}.tar.gz"
manifest="${BACKUP_DIR}/${host}-${stamp}.manifest.txt"
checksum="${archive}.sha256"

cleanup() {
  rm -rf "$work"
  rm -f "$tmp_archive"
}
trap cleanup EXIT

if ! [[ "$RETENTION_COUNT" =~ ^[1-9][0-9]*$ ]]; then
  echo "RETENTION_COUNT must be a positive integer." >&2
  exit 2
fi

if [[ ! -f "$SYNOLOGY_BACKUP_KEY" ]]; then
  echo "Synology backup key is missing: $SYNOLOGY_BACKUP_KEY" >&2
  exit 2
fi

mkdir -p "$BACKUP_DIR"
cd "$ROOT_DIR"

env_value() {
  local key="$1"
  if [[ -f .env ]]; then
    grep -E "^${key}=" .env | tail -1 | cut -d= -f2- | sed -E 's/^"//; s/"$//; s/^'\''//; s/'\''$//'
  fi
}

POSTGRES_USER="${POSTGRES_USER:-$(env_value POSTGRES_USER)}"
POSTGRES_DB="${POSTGRES_DB:-$(env_value POSTGRES_DB)}"
POSTGRES_USER="${POSTGRES_USER:-n8n}"
POSTGRES_DB="${POSTGRES_DB:-n8n}"

mkdir -p "$work/db" "$work/meta"

db_tmp="$work/db/n8n.dump.tmp"
docker exec "$POSTGRES_CONTAINER" pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "$db_tmp"
test -s "$db_tmp"
mv "$db_tmp" "$work/db/n8n.dump"

{
  echo "GT VPS full backup"
  echo "host=${host}"
  echo "stamp=${stamp}"
  echo "created_utc=$(date -u --iso-8601=seconds)"
  echo
  echo "[docker ps]"
  docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
  echo
  echo "[docker volumes]"
  docker volume ls --format '{{.Name}}'
  echo
  echo "[disk]"
  df -h / "$ROOT_DIR" 2>/dev/null || true
  echo
  echo "[compose]"
  ls -la "$ROOT_DIR"/docker-compose*.yml 2>/dev/null || true
} > "$work/meta/manifest.txt"

tar \
  --warning=no-file-changed \
  --ignore-failed-read \
  --exclude="opt/gt-automation-ops/backups" \
  --exclude="opt/gt-automation-ops/backups/**" \
  -czf "$tmp_archive" \
  -C / \
  "opt/gt-automation-ops" \
  "var/lib/docker/volumes/gt-automation-ops_gt_ai_reviews" \
  "var/lib/docker/volumes/gt-automation-ops_n8n_data" \
  "var/lib/docker/volumes/gt-automation-ops_postgres_data" \
  -C "$work" \
  db meta

test -s "$tmp_archive"
mv "$tmp_archive" "$archive"
cp "$work/meta/manifest.txt" "$manifest"
(
  cd "$BACKUP_DIR"
  sha256sum "$(basename "$archive")"
) > "$checksum"

ssh_options=(
  -i "$SYNOLOGY_BACKUP_KEY"
  -o BatchMode=yes
  -o ConnectTimeout=15
  -o StrictHostKeyChecking=accept-new
)
remote="${SYNOLOGY_BACKUP_USER}@${SYNOLOGY_BACKUP_HOST}"
remote_dir_q="$(printf '%q' "$SYNOLOGY_BACKUP_DIR")"
remote_scp_destination="${remote}:'${SYNOLOGY_BACKUP_DIR}/'"

ssh "${ssh_options[@]}" "$remote" "mkdir -p -- $remote_dir_q"
scp -O "${ssh_options[@]}" "$archive" "$manifest" "$checksum" "$remote_scp_destination"

remote_checksum_q="$(printf '%q' "$(basename "$checksum")")"
ssh "${ssh_options[@]}" "$remote" "cd $remote_dir_q && sha256sum -c $remote_checksum_q"

mapfile -t remote_obsolete < <(
  ssh "${ssh_options[@]}" "$remote" \
    "find $remote_dir_q -maxdepth 1 -type f -name '*.tar.gz' -printf '%f\\n' | sort -r | tail -n '+$((RETENTION_COUNT + 1))'"
)
for obsolete_name in "${remote_obsolete[@]}"; do
  remote_archive_q="$(printf '%q' "$SYNOLOGY_BACKUP_DIR/$obsolete_name")"
  remote_checksum_file_q="$(printf '%q' "$SYNOLOGY_BACKUP_DIR/$obsolete_name.sha256")"
  remote_manifest_q="$(printf '%q' "$SYNOLOGY_BACKUP_DIR/${obsolete_name%.tar.gz}.manifest.txt")"
  ssh "${ssh_options[@]}" "$remote" \
    "rm -f -- $remote_archive_q $remote_checksum_file_q $remote_manifest_q"
done

mapfile -t local_obsolete < <(
  find "$BACKUP_DIR" -maxdepth 1 -type f -name '*.tar.gz' -printf '%f\n' \
    | sort -r \
    | tail -n "+$((RETENTION_COUNT + 1))"
)
for obsolete_name in "${local_obsolete[@]}"; do
  obsolete_archive="$BACKUP_DIR/$obsolete_name"
  obsolete_stem="${obsolete_archive%.tar.gz}"
  rm -f -- "$obsolete_archive" "$obsolete_archive.sha256" "$obsolete_stem.manifest.txt"
done

echo "Full backup complete: $archive"
echo "Synology copy verified: $SYNOLOGY_BACKUP_DIR/$(basename "$archive")"
cat "$checksum"
