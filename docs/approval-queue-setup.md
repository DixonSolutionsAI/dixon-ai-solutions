# Approval queue setup

1. Run `supabase/migrations/202611120001_approval_queue.sql` in the Supabase SQL Editor.
2. Add these server-only Vercel environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (never use a `NEXT_PUBLIC_` prefix)
   - `BUSINESS_ID` (unique tenant identifier; defaults to `pilot-business` for this pilot)
   - `REVIEWER_ACCESS_CODE` (long random reviewer-only secret, different from `PILOT_ACCESS_CODE`)
3. Deploy the feature branch. The reviewer page is `/reviewer`.
4. Reviewers load the queue with their code and approve an edited draft. The consumer's opaque pending ID is polled at `/api/approval-status`.

This is a minimal single-business pilot foundation, not production reviewer identity management. Before public launch, replace the shared reviewer code with Supabase Auth/Clerk, add per-user authorization and audit attribution, and provision a distinct business ID and scoped data access for each tenant. Approval releases text to the consumer UI; external email/SMS delivery and Slack/Teams notification integrations are not configured here.
