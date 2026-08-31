-- Add Donivra without replacing images or links added through the admin editor.

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
values (
  'Donivra',
  'donivra',
  'An AI-assisted hair donation management system for hair qualification, donation tracking, event management, and wig distribution.',
  $donivra$
Donivra is an AI-assisted mobile and web platform designed to support the hair donation process. It brings hair qualification, donor activity, donation tracking, and event management into one coordinated system.

The platform also supports wig distribution workflows, helping organizers maintain clearer records as donated hair moves from qualification to its intended recipients.
$donivra$,
  array['AI API Integration', 'Mobile Development', 'Web Development', 'Management System'],
  null,
  '{}'::text[],
  null,
  null,
  true,
  6
)
on conflict (slug) do update
set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  tech_stack = excluded.tech_stack,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;

