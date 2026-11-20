-- Run once in the Supabase SQL editor as the project owner.
create extension if not exists pgcrypto;

create table public.staff_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 200)
);

create table public.staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid not null references public.staff_companies(id),
  display_name text not null check (length(trim(display_name)) between 1 and 100),
  active boolean not null default true
);

create function public.current_staff_company()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select company_id from public.staff_members
  where user_id = auth.uid() and active = true
$$;

revoke all on function public.current_staff_company() from public, anon;
grant execute on function public.current_staff_company() to authenticated;

create table public.staff_messages (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null default public.current_staff_company() references public.staff_companies(id),
  sender_id uuid not null default auth.uid() references public.staff_members(user_id),
  recipient_id uuid not null references public.staff_members(user_id),
  subject text not null check (length(trim(subject)) between 1 and 200),
  body text not null check (length(trim(body)) between 1 and 10000),
  created_at timestamptz not null default now()
);

create index staff_messages_sender_idx on public.staff_messages (company_id, sender_id, created_at desc);
create index staff_messages_recipient_idx on public.staff_messages (company_id, recipient_id, created_at desc);

alter table public.staff_companies enable row level security;
alter table public.staff_members enable row level security;
alter table public.staff_messages enable row level security;

revoke all on public.staff_companies, public.staff_members, public.staff_messages from public, anon, authenticated;
grant select (user_id, company_id, display_name, active) on public.staff_members to authenticated;
grant select on public.staff_messages to authenticated;
grant insert (recipient_id, subject, body) on public.staff_messages to authenticated;

create policy "Staff can see their active company directory"
on public.staff_members for select to authenticated
using (active and company_id = public.current_staff_company());

create policy "Staff can read their own messages"
on public.staff_messages for select to authenticated
using (
  company_id = public.current_staff_company()
  and (sender_id = auth.uid() or recipient_id = auth.uid())
);

create policy "Staff can send to active colleagues"
on public.staff_messages for insert to authenticated
with check (
  company_id = public.current_staff_company()
  and sender_id = auth.uid()
  and recipient_id <> auth.uid()
  and exists (
    select 1 from public.staff_members
    where user_id = recipient_id and active and company_id = public.current_staff_company()
  )
);
