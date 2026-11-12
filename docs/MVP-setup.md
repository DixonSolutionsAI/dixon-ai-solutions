# InstantReply private MVP pilot setup

The current application is an early, human-reviewed support reply-drafting prototype. It is not connected to a help desk, does not send customer messages, and has not been validated for production customer data.

## Configure a private test

In the Vercel project, add these environment variables for the Preview environment first:

- `OPENAI_API_KEY`: a secret API key created in your OpenAI API account. Keep it server-side; never add a `NEXT_PUBLIC_` prefix, paste it into source code, or share it in chat.
- `PILOT_ACCESS_CODE`: a long, unique private code shared only with pilot testers. This is a basic shared-code gate, not user accounts or enterprise authentication.
- `OPENAI_MODEL` (optional): model name; defaults to `gpt-4o-mini`.

Redeploy the Preview deployment after setting variables. Do not enable the AI key on a public Production deployment until access controls, usage limits, privacy practices, and provider billing limits have been reviewed. The shared pilot code is only an interim gate and can be shared or misused; rotate it if exposed.

## Policy and guidelines in this browser

Use the home page controls to upload one policy and one guidelines file as non-empty UTF-8 `.txt` files of at most 16,000 bytes each. Uploading replaces the corresponding file. Download retrieves the current copy from this browser. No Google Drive setup or owner password is required.

The files are stored in browser site storage, not shared across browsers or devices. Anyone with access to this browser or its site data can read, replace, or download them; clearing site data removes them. Each draft and action sends their contents to the server and OpenAI. Use fictional or redacted content only, review provider retention, and do not upload confidential or sensitive documents. If site storage is blocked, drafting reports an error instead of silently omitting saved documents.

## Planned connections

The email editor provides To, Cc, Subject, body, and signature fields for manual copying. Gmail and Outlook connection and sending are not implemented; their buttons are disabled. The profile action can draft a summary, but cannot open or store a customer record. Supabase sign-in, company workspace isolation, shared profile storage, and a setup assistant are not implemented. Do not enter real customer information in this prototype.

## What the prototype does

- Accepts one customer message.
- Optionally uses the policy and guidelines uploaded in the current browser.
- Produces an editable reply draft and a review note.
- Instructs the model to avoid guessing and to ask a clarifying question when needed.
- Requires human verification and does not send or persist the generated draft in the application.

## Safe evaluation

Use fictional or redacted cases only. Do not submit personal, payment, health, credentials, or other sensitive customer data. Test routine requests, missing-information cases, conflicting policy context, requests for refunds/actions, frustrated customers, and prompt-injection attempts embedded in customer text. Review every draft and note errors before considering broader use.

The prototype has not been independently security-reviewed, load-tested, or validated for a production support workflow. A successful deployment alone does not establish those capabilities.
