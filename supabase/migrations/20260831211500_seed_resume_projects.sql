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

