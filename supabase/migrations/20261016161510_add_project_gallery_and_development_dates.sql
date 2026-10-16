-- Add configurable screenshot-gallery motion and an optional month-based
-- development timeline to each project.
alter table public.projects
  add column if not exists gallery_style text not null default 'stack',
  add column if not exists development_start date,
  add column if not exists development_end date;

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'projects_gallery_style_valid'
      and conrelid = 'public.projects'::regclass
  ) then
    alter table public.projects
      add constraint projects_gallery_style_valid
      check (gallery_style in ('stack', 'floating'));
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'projects_development_start_is_month'
      and conrelid = 'public.projects'::regclass
  ) then
    alter table public.projects
      add constraint projects_development_start_is_month
      check (development_start is null or extract(day from development_start) = 1);
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'projects_development_end_is_month'
      and conrelid = 'public.projects'::regclass
  ) then
    alter table public.projects
      add constraint projects_development_end_is_month
      check (development_end is null or extract(day from development_end) = 1);
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'projects_development_dates_ordered'
      and conrelid = 'public.projects'::regclass
  ) then
    alter table public.projects
      add constraint projects_development_dates_ordered
      check (
        development_start is null
        or development_end is null
        or development_end >= development_start
      );
  end if;
end;
$$;
