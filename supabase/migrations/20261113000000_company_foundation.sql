begin;

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  created_at timestamptz not null default now()
);

create table public.company_members (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'agent', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (company_id, user_id)
);

create index company_members_user_id_idx on public.company_members(user_id);

create table public.company_audit_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.company_audit_events enable row level security;

revoke all on public.companies, public.company_members, public.company_audit_events from anon, authenticated;
grant select on public.companies, public.company_members, public.company_audit_events to authenticated;

create policy "Users can see their own memberships"
on public.company_members for select to authenticated
using (user_id = (select auth.uid()));

create policy "Members can see their companies"
on public.companies for select to authenticated
using (exists (
  select 1 from public.company_members
  where company_members.company_id = companies.id
    and company_members.user_id = (select auth.uid())
));

create policy "Owners and admins can see audit events"
on public.company_audit_events for select to authenticated
using (exists (
  select 1 from public.company_members
  where company_members.company_id = company_audit_events.company_id
    and company_members.user_id = (select auth.uid())
    and company_members.role in ('owner', 'admin')
));

create function public.create_company(company_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  new_company_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if company_name is null or char_length(btrim(company_name)) not between 1 and 100 then
    raise exception 'Invalid company name' using errcode = '22023';
  end if;

  insert into public.companies(name) values (btrim(company_name))
    returning id into new_company_id;
  insert into public.company_members(company_id, user_id, role)
    values (new_company_id, current_user_id, 'owner');
  insert into public.company_audit_events(company_id, actor_id, event_type)
    values (new_company_id, current_user_id, 'company.created');
  return new_company_id;
end;
$$;

revoke all on function public.create_company(text) from public, anon;
grant execute on function public.create_company(text) to authenticated;

commit;
