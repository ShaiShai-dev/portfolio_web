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
