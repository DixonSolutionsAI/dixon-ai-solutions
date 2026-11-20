-- Run against an isolated, empty PostgreSQL database with psql -v ON_ERROR_STOP=1.
create role anon;
create role authenticated;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to authenticated;
grant execute on function auth.uid() to authenticated;

\ir ../supabase/staff-messages.sql

insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000005');
insert into public.staff_companies (id, name) values
  ('10000000-0000-0000-0000-000000000001', 'Company A'),
  ('10000000-0000-0000-0000-000000000002', 'Company B');
insert into public.staff_members (user_id, company_id, display_name, active) values
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Alice', true),
  ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Bob', true),
  ('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Carol', true),
  ('00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Inactive', false),
  ('00000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Dave', true);

set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
do $$
begin
  if (select count(*) from public.staff_members) <> 3 then
    raise exception 'Directory exposed other companies or inactive users';
  end if;
end $$;
insert into public.staff_messages (recipient_id, subject, body)
values ('00000000-0000-0000-0000-000000000002', 'Hello', 'Private message');
do $$
begin
  begin
    insert into public.staff_messages (recipient_id, subject, body)
    values ('00000000-0000-0000-0000-000000000003', 'Cross company', 'Must fail');
    raise exception 'Cross-company message was allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.staff_messages (recipient_id, subject, body)
    values ('00000000-0000-0000-0000-000000000004', 'Inactive', 'Must fail');
    raise exception 'Message to inactive user was allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.staff_messages (sender_id, recipient_id, subject, body)
    values ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Spoof', 'Must fail');
    raise exception 'Sender spoofing was allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';
do $$
begin
  if (select count(*) from public.staff_messages) <> 1 then
    raise exception 'Recipient cannot read their message';
  end if;
end $$;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000003';
do $$
begin
  if (select count(*) from public.staff_messages) <> 0 then
    raise exception 'Another company can read the message';
  end if;
end $$;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000005';
do $$
begin
  if (select count(*) from public.staff_messages) <> 0 then
    raise exception 'Another staff member can read the message';
  end if;
end $$;
reset role;
update public.staff_members set active = false where user_id = '00000000-0000-0000-0000-000000000002';
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';
do $$
begin
  if (select count(*) from public.staff_messages) <> 0 then
    raise exception 'Disabled user can still read messages';
  end if;
end $$;
