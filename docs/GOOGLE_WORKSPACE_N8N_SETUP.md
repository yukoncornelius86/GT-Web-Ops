# Google Workspace n8n Setup

GT Web Ops uses Google OAuth for production email and Workspace actions. Do not use a raw Gmail password for n8n.

## Target URLs

Local review URL:

```text
http://localhost:5678
```

Future production URL:

```text
https://automation.thegtcollective.com
```

Add both OAuth callback URLs in Google Cloud:

```text
http://localhost:5678/rest/oauth2-credential/callback
https://automation.thegtcollective.com/rest/oauth2-credential/callback
```

## Google APIs to enable

Enable these APIs in the Google Cloud project used for n8n:

- Gmail API
- Google Sheets API
- Google Calendar API
- Google Drive API

## n8n credentials to create

Create OAuth credentials in n8n using the same Google Cloud OAuth client:

- Gmail OAuth2 credential
- Google Sheets OAuth2 credential
- Google Calendar OAuth2 credential
- Google Drive OAuth2 credential

Sign in with the Google Workspace account that should own the automation.

## Intake workflow behavior

When a service request is submitted, the production workflow should:

1. Validate and normalize the request.
2. Append a local JSONL audit record.
3. Add a row to the Google Sheet in `GOOGLE_SHEET_ID`.
4. Send an internal Gmail notification to `GOOGLE_WORKSPACE_NOTIFY_TO`.
5. Send a customer confirmation from `GOOGLE_WORKSPACE_SENDER`.
6. Create a Google Calendar follow-up event on `GOOGLE_CALENDAR_ID`.
7. Create or update a Drive folder under `GOOGLE_DRIVE_LEADS_FOLDER_ID` for lead documents and future attachments.

## Values needed in `.env`

```text
AUTOMATION_PUBLIC_URL=https://automation.thegtcollective.com
GOOGLE_SHEET_ID=
GOOGLE_CALENDAR_ID=
GOOGLE_DRIVE_LEADS_FOLDER_ID=
GOOGLE_WORKSPACE_SENDER=crew@thegtcollective.com
GOOGLE_WORKSPACE_NOTIFY_TO=crew@thegtcollective.com
```

## Information needed from the owner

- Google Workspace email to sign into n8n.
- Google Cloud OAuth Client ID.
- Google Cloud OAuth Client Secret.
- Lead intake Google Sheet URL or ID.
- Google Calendar ID for follow-up events.
- Google Drive folder URL or ID for lead folders.
- Internal notification recipient list.
