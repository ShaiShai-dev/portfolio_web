-- The project showcase layout belongs to the whole Projects section.
-- Existing sites retain their current card grid until an admin chooses a new view.
update public.site_settings
set projects_content = jsonb_set(
  coalesce(projects_content, '{}'::jsonb),
  '{display_style}',
  coalesce(projects_content -> 'display_style', '"grid"'::jsonb),
  true
)
where id = 'main';
