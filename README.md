# dixon-ai-solutions
Dixon AI Solutions LLC Website

## Staff Messages setup

Staff Messages is an internal inbox, not email. It uses separate Supabase accounts; existing browser-only employee accounts and time records are not migrated or authenticated by it. The other prototype pages and their browser-only access controls are **not secured** by this feature.

Before deploying:

1. Use Node.js 20 or later. In the intended Supabase project, disable public sign-ups in Authentication settings. Configure the project's authentication and password recovery settings for administrator-managed accounts.
2. Run `supabase/staff-messages.sql` once in the Supabase SQL editor. It creates its own tables and row-level security policies. Do not expose a service-role or secret key to the browser.
3. Add a company in the SQL editor, then create each staff user in Supabase Authentication and add their membership. Substitute the actual values in this example:

   ```sql
   insert into public.staff_companies (name)
   values ('Your company')
   returning id;

   insert into public.staff_members (user_id, company_id, display_name)
   values ('AUTH_USER_UUID', 'COMPANY_UUID', 'Staff name');
   ```

   The auth user ID comes from the Supabase Authentication dashboard; use the company ID returned by the first statement. Give each employee their own credentials through a secure channel. Each user can belong to one company; only active members of the same company can message one another.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the project URL and its publishable key (or legacy anon key) in `.env.local` for local development and in the Vercel **Production** environment. Never use a secret or service-role key. Redeploy after setting these variables.
5. Test using two different staff accounts: send and receive a message, check Sent, and verify a different company's user and a disabled user cannot access those messages. Database administrators retain access to stored messages.

Use the Supabase dashboard or SQL editor to deactivate a member (`update public.staff_members set active = false where user_id = 'AUTH_USER_UUID';`) and disable or revoke their authentication sessions. This immediately denies access to their staff messages through the database policies. The inbox requires manual refresh and does not provide external email or notifications.
