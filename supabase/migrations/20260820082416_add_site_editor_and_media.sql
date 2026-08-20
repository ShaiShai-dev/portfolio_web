alter table public.site_profile
  add column if not exists portrait_url text,
  add column if not exists portrait_alt text not null default 'Portrait of SHAI';

create table public.site_settings (
  id text primary key default 'main',
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  theme jsonb not null default '{}'::jsonb,
  home_content jsonb not null default '{}'::jsonb,
  projects_content jsonb not null default '{}'::jsonb,
  contact_content jsonb not null default '{}'::jsonb,

  constraint site_settings_singleton check (id = 'main'),
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
  on public.site_settings
  for select
  to anon
  using (true);

create policy "Owner can read site settings"
  on public.site_settings
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Owner can create site settings"
  on public.site_settings
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Owner can update site settings"
  on public.site_settings
  for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

grant usage on schema public to anon, authenticated;
grant select on table public.site_settings to anon;
grant select, insert, update on table public.site_settings to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Owners can list their site media"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'site-media'
    and owner_id = (select auth.uid()::text)
  );

create policy "Owners can upload site media"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'site-media'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "Owners can update their site media"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'site-media'
    and owner_id = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'site-media'
    and owner_id = (select auth.uid()::text)
  );

create policy "Owners can delete their site media"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'site-media'
    and owner_id = (select auth.uid()::text)
  );
