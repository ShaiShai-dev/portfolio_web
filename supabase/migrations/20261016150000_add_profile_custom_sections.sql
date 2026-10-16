-- Add flexible About-page sections for certificates, achievements, training,
-- leadership, and other resume highlights. Each section and its entries are
-- stored as structured JSON so the admin can add new categories without
-- another schema change.

alter table public.site_profile
  add column if not exists custom_sections jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'site_profile_custom_sections_is_array'
      and conrelid = 'public.site_profile'::regclass
  ) then
    alter table public.site_profile
      add constraint site_profile_custom_sections_is_array
      check (jsonb_typeof(custom_sections) = 'array');
  end if;
end;
$$;

notify pgrst, 'reload schema';
