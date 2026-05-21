# IONOS DEPLOYMENT GUIDE
1. Collect IONOS SFTP host, username, password/key, and target paths.
2. Create GitHub secrets:
   - `IONOS_SFTP_HOST`, `IONOS_SFTP_PORT`, `IONOS_SFTP_USER`, `IONOS_SFTP_PASSWORD`
   - `IONOS_THEGTCAFE_TARGET_PATH`, `IONOS_THEGTCOLLECTIVE_TARGET_PATH`
3. Copy `.github/workflows/*.example.yml` to active workflow names when ready.
4. Test deploy from a feature branch first.
5. Rollback strategy: redeploy last known-good artifact snapshot.
