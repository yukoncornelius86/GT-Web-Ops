param(
  [Parameter(Mandatory=$true)]
  [string]$SynologyHost,

  [Parameter(Mandatory=$true)]
  [string]$SynologyUser,

  [string]$RemoteDir = "/volume1/docker/gt-web-ops",
  [string]$Branch = "codex/build-local-docker-environment-for-gt-web-ops-gq0n6j",
  [switch]$Tools
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "../..")
$archive = Join-Path $env:TEMP "gt-web-ops-synology.tar.gz"
$remote = "$SynologyUser@$SynologyHost"
$profileArgs = ""

if ($Tools) {
  $profileArgs = "--profile tools"
}

Push-Location $repoRoot
try {
  git checkout $Branch
  git status --short
  if (Test-Path $archive) {
    Remove-Item -LiteralPath $archive -Force
  }
  tar --exclude=".git" --exclude=".env" --exclude="blog-studio/backups/*" -czf $archive .
}
finally {
  Pop-Location
}

ssh $remote "mkdir -p '$RemoteDir'"
scp $archive "${remote}:$RemoteDir/gt-web-ops-synology.tar.gz"
ssh $remote "cd '$RemoteDir' && tar -xzf gt-web-ops-synology.tar.gz && if [ ! -f .env ]; then cp .env.synology.example .env; fi"

Write-Host ""
Write-Host "Files copied to ${remote}:$RemoteDir"
Write-Host "Edit $RemoteDir/.env on the Synology before first startup, especially secrets and SYNOLOGY_BIND_IP."
Write-Host ""
Write-Host "Then run on the Synology:"
Write-Host "  cd $RemoteDir"
Write-Host "  docker compose -f docker-compose.yml -f docker-compose.synology.yml --env-file .env $profileArgs up -d --build"
