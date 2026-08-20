-- ============================================================================
-- SHAI portfolio database upgrade
--
-- Run this once in Supabase Dashboard > SQL Editor against the database that
-- already contains public.projects and public.inquiries. The script preserves
-- all existing project and inquiry rows and is safe to run again.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- Shared updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Editable About profile, education, technology stack, and social links
-- ---------------------------------------------------------------------------
create table if not exists public.site_profile (
  id text primary key default 'main',
  owner_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),

  full_name text not null default 'Trishia Kyle Bagtas',
  stage_name text not null default 'SHAI',
  headline text not null default
    'Web and mobile developer building purposeful digital experiences.',
  bio text not null default
    'I am a web and mobile developer and a fourth-year student at National University Baliwag, taking up a Bachelor of Science in Information Technology with a specialization in Mobile and Web Applications.',
  location text not null default 'Baliwag, Bulacan, Philippines',
  availability text not null default
    'Open to collaborations and selected projects',

  education_school text not null default 'National University Baliwag',
  education_year text not null default '4th Year Student',
  education_degree text not null default
    'Bachelor of Science in Information Technology',
  education_specialization text not null default
    'Mobile and Web Applications',

  portrait_url text,
  portrait_alt text not null default 'Portrait of SHAI',
  tech_stack jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '[]'::jsonb,

  constraint site_profile_singleton check (id = 'main'),
  constraint site_profile_tech_stack_is_array
    check (jsonb_typeof(tech_stack) = 'array'),
  constraint site_profile_social_links_is_array
    check (jsonb_typeof(social_links) = 'array')
);

-- Supports databases where the first profile migration was already applied.
alter table public.site_profile
  add column if not exists portrait_url text,
  add column if not exists portrait_alt text not null default 'Portrait of SHAI';

drop trigger if exists site_profile_set_updated_at on public.site_profile;
create trigger site_profile_set_updated_at
  before update on public.site_profile
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Editable global palette and Home, Projects, and Contact section content
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id text primary key default 'main',
  owner_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  theme jsonb not null default '{}'::jsonb,
  home_content jsonb not null default '{}'::jsonb,
  projects_content jsonb not null default '{}'::jsonb,
  contact_content jsonb not null default '{}'::jsonb,

  constraint site_settings_singleton check (id = 'main'),
  constraint site_settings_theme_is_object
    check (jsonb_typeof(theme) = 'object'),
  constraint site_settings_home_is_object
    check (jsonb_typeof(home_content) = 'object'),
  constraint site_settings_projects_is_object
    check (jsonb_typeof(projects_content) = 'object'),
  constraint site_settings_contact_is_object
    check (jsonb_typeof(contact_content) = 'object')
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Anonymous visitors can read public portfolio content and submit inquiries.
-- Authenticated access is intended for the single admin account.
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_profile enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects for select to anon
  using (is_published = true);

drop policy if exists "Authenticated can read all projects" on public.projects;
create policy "Authenticated can read all projects"
  on public.projects for select to authenticated
  using (true);

drop policy if exists "Authenticated can insert projects" on public.projects;
create policy "Authenticated can insert projects"
  on public.projects for insert to authenticated
  with check (true);

drop policy if exists "Authenticated can update projects" on public.projects;
create policy "Authenticated can update projects"
  on public.projects for update to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete projects" on public.projects;
create policy "Authenticated can delete projects"
  on public.projects for delete to authenticated
  using (true);

drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries"
  on public.inquiries for insert to anon, authenticated
  with check (true);

drop policy if exists "Authenticated can read inquiries" on public.inquiries;
create policy "Authenticated can read inquiries"
  on public.inquiries for select to authenticated
  using (true);

drop policy if exists "Public can read the site profile" on public.site_profile;
create policy "Public can read the site profile"
  on public.site_profile for select to anon
  using (true);

drop policy if exists "Owner can read the site profile" on public.site_profile;
create policy "Owner can read the site profile"
  on public.site_profile for select to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "Owner can create the site profile" on public.site_profile;
create policy "Owner can create the site profile"
  on public.site_profile for insert to authenticated
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Owner can update the site profile" on public.site_profile;
create policy "Owner can update the site profile"
  on public.site_profile for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select to anon
  using (true);

drop policy if exists "Owner can read site settings" on public.site_settings;
create policy "Owner can read site settings"
  on public.site_settings for select to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "Owner can create site settings" on public.site_settings;
create policy "Owner can create site settings"
  on public.site_settings for insert to authenticated
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Owner can update site settings" on public.site_settings;
create policy "Owner can update site settings"
  on public.site_settings for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

-- Explicit privileges keep these tables available to the Data API even when
-- automatic public-schema exposure/default grants are disabled.
grant usage on schema public to anon, authenticated;

revoke all on table public.projects from anon, authenticated;
grant select on table public.projects to anon;
grant select, insert, update, delete on table public.projects to authenticated;

revoke all on table public.inquiries from anon, authenticated;
grant insert on table public.inquiries to anon;
grant select, insert on table public.inquiries to authenticated;

revoke all on table public.site_profile from anon, authenticated;
grant select on table public.site_profile to anon;
grant select, insert, update on table public.site_profile to authenticated;

revoke all on table public.site_settings from anon, authenticated;
grant select on table public.site_settings to anon;
grant select, insert, update on table public.site_settings to authenticated;

-- ---------------------------------------------------------------------------
-- Public image buckets
-- project-images: project thumbnails and case-study screenshots
-- site-media: Home, About, Projects, and Contact section images
-- ---------------------------------------------------------------------------
insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'project-images',
  'project-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view project images" on storage.objects;
create policy "Public can view project images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Authenticated can upload project images" on storage.objects;
create policy "Authenticated can upload project images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-images');

drop policy if exists "Authenticated can update project images" on storage.objects;
create policy "Authenticated can update project images"
  on storage.objects for update to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

drop policy if exists "Authenticated can delete project images" on storage.objects;
create policy "Authenticated can delete project images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Owners can list their site media" on storage.objects;
create policy "Owners can list their site media"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'site-media'
    and owner_id = (select auth.uid()::text)
  );

drop policy if exists "Owners can upload site media" on storage.objects;
create policy "Owners can upload site media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'site-media'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "Owners can update their site media" on storage.objects;
create policy "Owners can update their site media"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'site-media'
    and owner_id = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'site-media'
    and owner_id = (select auth.uid()::text)
  );

drop policy if exists "Owners can delete their site media" on storage.objects;
create policy "Owners can delete their site media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'site-media'
    and owner_id = (select auth.uid()::text)
  );

-- ---------------------------------------------------------------------------
-- Query indexes used by the public gallery and admin inquiry dashboard
-- ---------------------------------------------------------------------------
create index if not exists projects_is_published_sort_order_idx
  on public.projects (is_published, sort_order);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

commit;

-- ---------------------------------------------------------------------------
-- Verification output: the SQL Editor should return four RLS-enabled tables
-- and two public buckets after the transaction succeeds.
-- ---------------------------------------------------------------------------
select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled
from pg_catalog.pg_class c
join pg_catalog.pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('projects', 'inquiries', 'site_profile', 'site_settings')
order by c.relname;

select id, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in ('project-images', 'site-media')
order by id;
