-- Add model confidence as a reviewer triage hint. It is not a correctness guarantee.
alter table public.approval_queue
  add column if not exists confidence integer null check (confidence between 1 and 100);
