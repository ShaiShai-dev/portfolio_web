-- ============================================================================
-- Portfolio site schema — review and run this yourself in the Supabase
-- SQL editor. Nothing here is applied automatically.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROJECTS TABLE
-- Stores portfolio case studies shown on the public site and managed from
-- the admin dashboard.
-- ----------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  title text not null,
  slug text not null unique,               -- used in /projects/[slug] URLs
  summary text not null,                    -- short teaser for gallery cards
  description text,                         -- long-form case study body (problem/process/outcome)
  tech_stack text[] not null default '{}',  -- e.g. {"Next.js","Supabase","Tailwind"}

  thumbnail_url text,                       -- gallery card image (Supabase storage)
  screenshot_urls text[] not null default '{}', -- additional case-study screenshots

  live_url text,
  github_url text,

  is_published boolean not null default false, -- drafts stay hidden from public site
  sort_order integer not null default 0         -- controls display order in the gallery
);

-- Keep updated_at current on every row update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 2. INQUIRIES TABLE
-- Stores contact/inquiry form submissions from potential clients.
-- ----------------------------------------------------------------------------
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  email text not null,
  project_type text not null,   -- e.g. "Web App", "Mobile App", "Not sure yet"
  message text not null
);

-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- Public (anonymous) visitors can only READ published projects and INSERT
-- inquiries. Only an authenticated user (you, logged in via Supabase Auth)
-- can write to projects or read inquiries.
-- ----------------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.inquiries enable row level security;

-- Anyone can view published projects.
create policy "Public can read published projects"
  on public.projects
  for select
  to anon, authenticated
  using (is_published = true);

-- Authenticated (admin) users can view all projects, including drafts.
create policy "Authenticated can read all projects"
  on public.projects
  for select
  to authenticated
  using (true);

-- Only authenticated users can create/update/delete projects.
create policy "Authenticated can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (true);

create policy "Authenticated can update projects"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete projects"
  on public.projects
  for delete
  to authenticated
  using (true);

-- Anyone (including anonymous visitors) can submit an inquiry.
create policy "Public can submit inquiries"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated users can read submitted inquiries.
create policy "Authenticated can read inquiries"
  on public.inquiries
  for select
  to authenticated
  using (true);

-- (No public update/delete policies on inquiries — visitors can only submit.)

-- ----------------------------------------------------------------------------
-- 4. STORAGE BUCKET FOR PROJECT IMAGES
-- Holds thumbnails and screenshots uploaded from the admin dashboard.
-- Public read (so images display on the site), authenticated-only write.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "Public can view project images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'project-images');

create policy "Authenticated can upload project images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'project-images');

create policy "Authenticated can update project images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

create policy "Authenticated can delete project images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'project-images');

-- ----------------------------------------------------------------------------
-- 5. HELPFUL INDEXES
-- ----------------------------------------------------------------------------
create index projects_is_published_sort_order_idx
  on public.projects (is_published, sort_order);

create index projects_slug_idx
  on public.projects (slug);

-- ----------------------------------------------------------------------------
-- 6. EDITABLE SITE PROFILE
-- Stores the About content, education, technology roll, and social links.
-- JSON arrays keep repeatable content adaptable without schema changes.
-- ----------------------------------------------------------------------------
create table public.site_profile (
  id text primary key default 'main',
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),

  full_name text not null default 'Trishia Kyle Bagtas',
  stage_name text not null default 'SHAI',
  headline text not null default 'Web and mobile developer building purposeful digital experiences.',
  bio text not null default 'I am a web and mobile developer and a fourth-year student at National University Baliwag, taking up a Bachelor of Science in Information Technology with a specialization in Mobile and Web Applications.',
  location text not null default 'Baliwag, Bulacan, Philippines',
  availability text not null default 'Open to collaborations and selected projects',

  education_school text not null default 'National University Baliwag',
  education_year text not null default '4th Year Student',
  education_degree text not null default 'Bachelor of Science in Information Technology',
  education_specialization text not null default 'Mobile and Web Applications',

  portrait_url text,
  portrait_alt text not null default 'Portrait of SHAI',

  tech_stack jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '[]'::jsonb,

  constraint site_profile_singleton check (id = 'main'),
  constraint site_profile_tech_stack_is_array check (jsonb_typeof(tech_stack) = 'array'),
  constraint site_profile_social_links_is_array check (jsonb_typeof(social_links) = 'array')
);

create trigger site_profile_set_updated_at
  before update on public.site_profile
  for each row
  execute function public.set_updated_at();

alter table public.site_profile enable row level security;

create policy "Public can read the site profile"
  on public.site_profile
  for select
  to anon
  using (true);

create policy "Owner can read the site profile"
  on public.site_profile
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Owner can create the site profile"
  on public.site_profile
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Owner can update the site profile"
  on public.site_profile
  for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

grant usage on schema public to anon, authenticated;
grant select on table public.site_profile to anon;
grant select, insert, update on table public.site_profile to authenticated;

-- ----------------------------------------------------------------------------
-- 7. SITE EDITOR SETTINGS + MEDIA
-- Stores the global palette and editable Home, Projects, and Contact content.
-- About text remains in site_profile; its optional portrait is stored there.
-- ----------------------------------------------------------------------------
create table public.site_settings (
  id text primary key default 'main',
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  maintenance_mode boolean not null default false,
  maintenance_content jsonb not null default '{
    "eyebrow": "Scheduled maintenance",
    "heading": "The portfolio is getting a quick tune-up.",
    "message": "SHAI is making a few improvements behind the scenes. Please check back soon.",
    "status_label": "Temporarily offline"
  }'::jsonb,
  theme jsonb not null default '{}'::jsonb,
  home_content jsonb not null default '{}'::jsonb,
  projects_content jsonb not null default '{}'::jsonb,
  contact_content jsonb not null default '{}'::jsonb,

  constraint site_settings_singleton check (id = 'main'),
  constraint site_settings_maintenance_is_object check (jsonb_typeof(maintenance_content) = 'object'),
  constraint site_settings_theme_is_object check (jsonb_typeof(theme) = 'object'),
  constraint site_settings_home_is_object check (jsonb_typeof(home_content) = 'object'),
  constraint site_settings_projects_is_object check (jsonb_typeof(projects_content) = 'object'),
  constraint site_settings_contact_is_object check (jsonb_typeof(contact_content) = 'object')
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();

alter table public.site_settings enable row level security;

create policy "Public can read site settings"
  on public.site_settings for select to anon using (true);

create policy "Owner can read site settings"
  on public.site_settings for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Owner can create site settings"
  on public.site_settings for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Owner can update site settings"
  on public.site_settings for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

grant usage on schema public to anon, authenticated;
grant select on table public.site_settings to anon;
grant select, insert, update on table public.site_settings to authenticated;

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'site-media', 'site-media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Owners can list their site media"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'site-media'
    and owner_id = (select auth.uid()::text)
  );

create policy "Owners can upload site media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'site-media'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

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

create policy "Owners can delete their site media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'site-media'
    and owner_id = (select auth.uid()::text)
  );
