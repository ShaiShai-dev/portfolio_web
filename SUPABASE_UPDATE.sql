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
    'Web and mobile developer turning ideas into purposeful digital solutions.',
  bio text not null default
    'I am a fourth-year BS Information Technology student at National University Baliwag, specializing in Mobile and Web Applications. I transform ideas and user needs into functional digital products through AI-assisted development, rapid prototyping, UI/UX design, system integration, testing, and iterative improvement. My work spans interactive learning, digital storytelling, and management systems, supported by leadership, collaboration, project coordination, and technical documentation.',
  location text not null default 'Baliwag, Bulacan, Philippines',
  availability text not null default
    'Open to internships, collaborations, and selected projects',

  education_school text not null default 'National University Baliwag',
  education_year text not null default 'Fourth Year - 2023 to Present',
  education_degree text not null default
    'Bachelor of Science in Information Technology',
  education_specialization text not null default
    'Mobile and Web Applications',

  portrait_url text,
  portrait_alt text not null default 'Portrait of SHAI',
  resume_url text not null default
    '/documents/trishia-kyle-bagtas-resume.pdf',
  resume_label text not null default 'View full resume',
  resume_summary text not null default
    'Explore my technical skills, selected projects, education, and leadership experience.',
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
  add column if not exists portrait_alt text not null default 'Portrait of SHAI',
  add column if not exists resume_url text not null default
    '/documents/trishia-kyle-bagtas-resume.pdf',
  add column if not exists resume_label text not null default
    'View full resume',
  add column if not exists resume_summary text not null default
    'Explore my technical skills, selected projects, education, and leadership experience.';

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
  constraint site_settings_maintenance_is_object
    check (jsonb_typeof(maintenance_content) = 'object'),
  constraint site_settings_theme_is_object
    check (jsonb_typeof(theme) = 'object'),
  constraint site_settings_home_is_object
    check (jsonb_typeof(home_content) = 'object'),
  constraint site_settings_projects_is_object
    check (jsonb_typeof(projects_content) = 'object'),
  constraint site_settings_contact_is_object
    check (jsonb_typeof(contact_content) = 'object')
);

-- Supports databases where site_settings already exists.
alter table public.site_settings
  add column if not exists maintenance_mode boolean not null default false,
  add column if not exists maintenance_content jsonb not null default '{
    "eyebrow": "Scheduled maintenance",
    "heading": "The portfolio is getting a quick tune-up.",
    "message": "SHAI is making a few improvements behind the scenes. Please check back soon.",
    "status_label": "Temporarily offline"
  }'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'site_settings_maintenance_is_object'
      and conrelid = 'public.site_settings'::regclass
  ) then
    alter table public.site_settings
      add constraint site_settings_maintenance_is_object
      check (jsonb_typeof(maintenance_content) = 'object');
  end if;
end;
$$;

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

-- ---------------------------------------------------------------------------
-- Resume projects
-- Text content is seeded now; thumbnails, screenshots, and links stay editable
-- in the admin workspace and are preserved when a matching slug already exists.
-- ---------------------------------------------------------------------------
-- Seed the projects documented in Trishia Kyle Bagtas' resume.
-- Image and link fields remain untouched when a matching slug already exists.

insert into public.projects (
  title,
  slug,
  summary,
  description,
  tech_stack,
  thumbnail_url,
  screenshot_urls,
  live_url,
  github_url,
  is_published,
  sort_order
)
values
  (
    'BrightInk Kids',
    'brightink-kids',
    'An AI-assisted storytelling platform for writing, publishing, image generation, narration, and interactive reading.',
    $brightink$
BrightInk Kids helps young creators move from an idea to a complete story in one guided experience. The platform supports writing, publishing, AI-assisted image generation, narration, and interactive reading.

The project focuses on making digital storytelling approachable for children while giving stories a structured place to be created, explored, and shared.
$brightink$,
    array['AI API Integration', 'Digital Storytelling', 'Web Development', 'UI/UX Design'],
    null,
    '{}'::text[],
    null,
    null,
    true,
    1
  ),
  (
    'NumBlox Quest',
    'numblox-quest',
    'A child-friendly mathematics learning application with game-based activities, guided feedback, rewards, and accessible UI/UX.',
    $numblox$
NumBlox Quest turns mathematics practice into a child-friendly learning journey. Game-based activities, guided feedback, and rewards encourage learners to continue practicing at their own pace.

The interface was designed to keep instructions clear, interactions accessible, and learning progress engaging for young users.
$numblox$,
    array['Mobile Development', 'Game-Based Learning', 'UI/UX Design'],
    null,
    '{}'::text[],
    null,
    null,
    true,
    2
  ),
  (
    'InkAItive',
    'inkaitive',
    'An AI-enhanced reading and writing application with story management, recommendations, progress tracking, and social features.',
    $inkaitive$
InkAItive combines reading and writing tools in an AI-enhanced storytelling application. It brings story creation, content management, personalized recommendations, and reading progress into a connected experience.

Social features support discovery and interaction, while the product structure helps readers and writers organize their activity in one place.
$inkaitive$,
    array['AI API Integration', 'Mobile Development', 'Digital Storytelling', 'UI/UX Design'],
    null,
    '{}'::text[],
    null,
    null,
    true,
    3
  ),
  (
    'E-Elyon / EECM',
    'e-elyon-eecm',
    'A digital church management system for membership, QR attendance, finance, events, messaging, and administrative records.',
    $eecm$
E-Elyon / EECM is a church management system created to organize essential community and administrative workflows. It brings membership records, QR-based attendance, financial tracking, events, and messaging into one digital workspace.

The system reduces manual record keeping and gives administrators a clearer way to maintain information and coordinate church activities.
$eecm$,
    array['Web Development', 'System Integration', 'QR Attendance', 'Database Management'],
    null,
    '{}'::text[],
    null,
    null,
    true,
    4
  ),
  (
    'Alamat Explorer',
    'alamat-explorer',
    'A mobile learning experience that introduces children to Filipino legends through narration, visual storytelling, quizzes, and simple activities.',
    $alamat$
Alamat Explorer introduces children to Filipino legends through a mobile learning experience. Voice narration and visual storytelling make each story easier to follow, while quizzes and simple activities reinforce comprehension.

The project combines cultural learning with accessible interaction to help younger audiences discover traditional stories in a more engaging format.
$alamat$,
    array['Mobile Development', 'Interactive Learning', 'Voice Narration', 'UI/UX Design'],
    null,
    '{}'::text[],
    null,
    null,
    true,
    5
  )
on conflict (slug) do update
set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  tech_stack = excluded.tech_stack,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;


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
