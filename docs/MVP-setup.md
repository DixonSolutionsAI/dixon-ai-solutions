# InstantReply private MVP pilot setup

The current application is an early, human-reviewed support reply-drafting prototype. It is not connected to a help desk, does not send customer messages, and has not been validated for production customer data.

## Configure a private test

In the Vercel project, add these environment variables for the Preview environment first:

- `OPENAI_API_KEY`: a secret API key created in your OpenAI API account. Keep it server-side; never add a `NEXT_PUBLIC_` prefix, paste it into source code, or share it in chat.
- `PILOT_ACCESS_CODE`: a long, unique private code shared only with pilot testers. This is a basic shared-code gate, not user accounts or enterprise authentication.
- `OPENAI_MODEL` (optional): model name; defaults to `gpt-4o-mini`.

Redeploy the Preview deployment after setting variables. Do not enable the AI key on a public Production deployment until access controls, usage limits, privacy practices, and provider billing limits have been reviewed. The shared pilot code is only an interim gate and can be shared or misused; rotate it if exposed.

## Shared policy and guidelines

The document controls support one shared policy and one shared guidelines file, each UTF-8 plain text, up to 16,000 bytes. Uploading replaces the corresponding file; it does not append. Use fictional or redacted content suitable for sending to OpenAI. The documents are included in every draft and action request and may be downloaded by anyone with the pilot access code.

1. Enable the Google Drive API in a Google Cloud project and create a service account with a JSON key. Protect the key; never commit it or share it in chat.
2. In Google Drive, create two separate plain `.txt` files (not Google Docs), initially empty if desired. Share both files with the service account email as an editor. Copy each file's ID from its Drive URL. Use a dedicated account with access only to these files.
3. Set these server-side environment variables in the same Vercel Preview environment:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: the `client_email` and `private_key` values from the service account key. Preserve the private key's newlines (or use literal `\n` sequences).
   - `GOOGLE_DRIVE_POLICY_FILE_ID` and `GOOGLE_DRIVE_GUIDELINES_FILE_ID`: the two distinct file IDs.
   - `COMPANY_DOCUMENT_OWNER_PASSWORD`: a long, unique password, different from `PILOT_ACCESS_CODE`, for replacing documents.
4. Redeploy. Enter the owner password on the home page to upload each file; enter the pilot access code to download. Each upload replaces its Drive file immediately. New drafts read the current files.

If no Drive settings are configured, drafting remains available with a visible warning that company documents were not used. If configuration is incomplete or Drive is unavailable, drafting fails rather than silently omitting documents. The owner password and pilot code are shared secrets, not individual accounts; the in-memory rate limit is not reliable across serverless instances. Do not treat this pilot as production-grade access control. Restrict Vercel Preview access and review document sharing and provider retention before use.

## What the prototype does

- Accepts one customer message plus optional confirmed policies/details.
- Optionally reads the current shared policy and guidelines from Google Drive.
- Produces an editable reply draft and a review note.
- Instructs the model to avoid guessing and to ask a clarifying question when needed.
- Requires human verification and does not send or persist the generated draft in the application.

## Safe evaluation

Use fictional or redacted cases only. Do not submit personal, payment, health, credentials, or other sensitive customer data. Test routine requests, missing-information cases, conflicting policy context, requests for refunds/actions, frustrated customers, and prompt-injection attempts embedded in customer text. Review every draft and note errors before considering broader use.

The prototype has not been independently security-reviewed, load-tested, or validated for a production support workflow. A successful deployment alone does not establish those capabilities.
