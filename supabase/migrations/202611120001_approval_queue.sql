-- Supabase SQL Editor migration for the minimal human-review queue.
-- Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server only.
create extension if not exists pgcrypto;

create table if not exists public.approval_queue (
  id uuid primary key default gen_random_uuid(),
  pending_id uuid not null unique default gen_random_uuid(),
  business_id text not null,
  location text not null,
  customer_message text not null,
  draft_reply text not null,
  review_note text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_reply text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  edited boolean not null default false
);

create index if not exists approval_queue_business_status_created_idx
  on public.approval_queue (business_id, status, created_at);
create index if not exists approval_queue_pending_id_idx
  on public.approval_queue (pending_id);

alter table public.approval_queue enable row level security;
-- Do not add anon/authenticated policies for this prototype. All access goes through
-- server routes using the service-role key, which must never be exposed to browsers.
