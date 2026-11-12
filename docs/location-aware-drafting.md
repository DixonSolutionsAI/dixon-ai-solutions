# Location-aware OpenAI and approval queue

The existing `app/api/reply-draft/route.js` is the project equivalent of the example `/api/draft` route. It validates a fixed branch selection, inserts the selected branch's verified hours/phone/policy and the user message into the OpenAI request, then places the resulting draft into the approval queue. Consumers receive an opaque `pendingId`; the draft itself is not displayed until approved.

The `location` column already exists in `supabase/migrations/202611120001_approval_queue.sql`, and reviewer cards display that location. The official OpenAI SDK is already declared in `package.json` as `openai`; no additional install is needed. The repo includes `.env.example`; set the real `OPENAI_API_KEY` in `.env.local` for local work or server environment settings, never commit the secret.

To persist reviewer confidence, run `supabase/migrations/202611120002_approval_confidence.sql`. Confidence is a model-generated triage estimate only; it is not calibrated and must never replace human fact checking. Mock drafts intentionally have no confidence score. Existing supported branch data is in `lib/location-data.js`; do not add a location until its verified branch facts are supplied.
