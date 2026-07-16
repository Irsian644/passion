-- Passion Dream — products schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id                 uuid primary key default gen_random_uuid(),

  -- Both languages are typed by hand. Either may be blank: whichever is filled
  -- is shown, and the other falls back to it (see lib/localize.ts).
  -- The CHECK at the end of the table requires at least one name.
  name_sq            text not null default '' check (length(name_sq) <= 120),
  name_en            text not null default '' check (length(name_en) <= 120),
  tagline_sq         text not null default '' check (length(tagline_sq) <= 160),
  tagline_en         text not null default '' check (length(tagline_en) <= 160),
  description_sq     text not null default '' check (length(description_sq) <= 2000),
  description_en     text not null default '' check (length(description_en) <= 2000),
  care_sq            text not null default '' check (length(care_sq) <= 600),
  care_en            text not null default '' check (length(care_en) <= 600),
  materials_sq       text not null default '' check (length(materials_sq) <= 300),
  materials_en       text not null default '' check (length(materials_en) <= 300),

  -- Storage paths (not public URLs) so the bucket can be re-pointed later.
  images             text[] not null default '{}' check (cardinality(images) <= 8),

  collections        text[] not null default '{}',
  primary_collection text,

  best_seller        boolean not null default false,
  new_arrival        boolean not null default false,

  display_order      integer not null default 0,
  published          boolean not null default false,

  -- URL slug for /products/[slug]; stable once set.
  slug               text not null unique
                       check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  -- A product must be nameable in at least one language.
  constraint products_has_a_name
    check (length(trim(name_sq)) > 0 or length(trim(name_en)) > 0)
);

create index if not exists products_published_order_idx
  on public.products (published, display_order, created_at desc);
create index if not exists products_slug_idx on public.products (slug);

-- Keep updated_at honest regardless of what the client sends.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
--   Visitors (anon)        -> may read published rows only.
--   Signed-in admin (auth) -> full access.
-- The service-role key bypasses RLS entirely and is never sent to the browser.
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "public reads published products" on public.products;
create policy "public reads published products"
  on public.products for select
  to anon
  using (published = true);

drop policy if exists "admin reads all products" on public.products;
create policy "admin reads all products"
  on public.products for select
  to authenticated
  using (true);

drop policy if exists "admin writes products" on public.products;
create policy "admin writes products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for product images (public read, authenticated write)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public reads product images" on storage.objects;
create policy "public reads product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "admin writes product images" on storage.objects;
create policy "admin writes product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "admin updates product images" on storage.objects;
create policy "admin updates product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "admin deletes product images" on storage.objects;
create policy "admin deletes product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
