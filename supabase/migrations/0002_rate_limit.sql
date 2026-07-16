-- Brute-force protection for the login form.
--
-- Deployment-safe by design: Vercel functions are stateless and do not share
-- memory, so an in-process counter would reset on every cold start and be
-- trivially bypassed. This keeps the counter in Postgres instead.

create table if not exists public.auth_attempts (
  id         bigserial primary key,
  -- Hashed identifier (IP + email), never the raw value.
  bucket     text not null,
  created_at timestamptz not null default now()
);

create index if not exists auth_attempts_bucket_time_idx
  on public.auth_attempts (bucket, created_at desc);

-- Locked down: only the service-role key (server-side) may touch this table.
alter table public.auth_attempts enable row level security;

-- Records an attempt and reports how many happened in the window.
-- SECURITY DEFINER so it can run without granting table rights to any role.
create or replace function public.record_auth_attempt(
  p_bucket        text,
  p_window_secs   integer default 900
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  attempt_count integer;
begin
  delete from public.auth_attempts
   where created_at < now() - make_interval(secs => p_window_secs * 4);

  insert into public.auth_attempts (bucket) values (p_bucket);

  select count(*) into attempt_count
    from public.auth_attempts
   where bucket = p_bucket
     and created_at > now() - make_interval(secs => p_window_secs);

  return attempt_count;
end;
$$;

-- Clears the counter after a successful sign-in.
create or replace function public.clear_auth_attempts(p_bucket text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.auth_attempts where bucket = p_bucket;
end;
$$;
