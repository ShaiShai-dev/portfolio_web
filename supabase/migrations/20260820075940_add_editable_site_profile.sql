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
