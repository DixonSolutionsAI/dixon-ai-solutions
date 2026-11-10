# InstantReply private MVP pilot setup

The current application is an early, human-reviewed support reply-drafting prototype. It is not connected to a help desk, does not send customer messages, and has not been validated for production customer data.

## Configure a private test

In the Vercel project, add these environment variables for the Preview environment first:

- `OPENAI_API_KEY`: a secret API key created in your OpenAI API account. Keep it server-side; never add a `NEXT_PUBLIC_` prefix, paste it into source code, or share it in chat.
- `PILOT_ACCESS_CODE`: a long, unique private code shared only with pilot testers. This is a basic shared-code gate, not user accounts or enterprise authentication.
- `OPENAI_MODEL` (optional): model name; defaults to `gpt-4o-mini`.

Redeploy the Preview deployment after setting variables. Do not enable the AI key on a public Production deployment until access controls, usage limits, privacy practices, and provider billing limits have been reviewed. The shared pilot code is only an interim gate and can be shared or misused; rotate it if exposed.

## What the prototype does

- Accepts one customer message plus optional confirmed policies/details.
- Produces an editable reply draft and a review note.
- Instructs the model to avoid guessing and to ask a clarifying question when needed.
- Requires human verification and does not send or persist the generated draft in the application.

## Safe evaluation

Use fictional or redacted cases only. Do not submit personal, payment, health, credentials, or other sensitive customer data. Test routine requests, missing-information cases, conflicting policy context, requests for refunds/actions, frustrated customers, and prompt-injection attempts embedded in customer text. Review every draft and note errors before considering broader use.

The prototype has not been independently security-reviewed, load-tested, or validated for a production support workflow. A successful deployment alone does not establish those capabilities.
