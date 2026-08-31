-- Add an editable public resume and align the About profile with the current CV.

alter table public.site_profile
  add column if not exists resume_url text not null default
    '/documents/trishia-kyle-bagtas-resume.pdf',
  add column if not exists resume_label text not null default
    'View full resume',
  add column if not exists resume_summary text not null default
    'Explore my technical skills, selected projects, education, and leadership experience.';

update public.site_profile
set
  headline = 'Web and mobile developer turning ideas into purposeful digital solutions.',
  bio = 'I am a fourth-year BS Information Technology student at National University Baliwag, specializing in Mobile and Web Applications. I transform ideas and user needs into functional digital products through AI-assisted development, rapid prototyping, UI/UX design, system integration, testing, and iterative improvement. My work spans interactive learning, digital storytelling, and management systems, supported by leadership, collaboration, project coordination, and technical documentation.',
  availability = 'Open to internships, collaborations, and selected projects',
  education_school = 'National University Baliwag',
  education_year = 'Fourth Year - 2023 to Present',
  education_degree = 'Bachelor of Science in Information Technology',
  education_specialization = 'Mobile and Web Applications',
  resume_url = '/documents/trishia-kyle-bagtas-resume.pdf',
  resume_label = 'View full resume',
  resume_summary = 'Explore my technical skills, selected projects, education, and leadership experience.',
  tech_stack = jsonb_build_array(
    jsonb_build_object('id', 'flutter', 'name', 'Flutter', 'icon', 'flutter'),
    jsonb_build_object('id', 'dart', 'name', 'Dart', 'icon', 'dart'),
    jsonb_build_object('id', 'javascript', 'name', 'JavaScript', 'icon', 'javascript'),
    jsonb_build_object('id', 'typescript', 'name', 'TypeScript', 'icon', 'typescript'),
    jsonb_build_object('id', 'react', 'name', 'React', 'icon', 'react'),
    jsonb_build_object('id', 'react-native', 'name', 'React Native', 'icon', 'react'),
    jsonb_build_object('id', 'nextjs', 'name', 'Next.js', 'icon', 'nextjs'),
    jsonb_build_object('id', 'supabase', 'name', 'Supabase', 'icon', 'supabase'),
    jsonb_build_object('id', 'tailwind', 'name', 'Tailwind CSS', 'icon', 'tailwind'),
    jsonb_build_object('id', 'git-github', 'name', 'Git / GitHub', 'icon', 'github'),
    jsonb_build_object('id', 'ui-ux', 'name', 'UI/UX Design', 'icon', 'uiux'),
    jsonb_build_object('id', 'ai-api', 'name', 'AI API Integration', 'icon', 'ai'),
    jsonb_build_object('id', 'notion', 'name', 'Notion', 'icon', 'notion'),
    jsonb_build_object('id', 'canva', 'name', 'Canva', 'icon', 'canva')
  ),
  social_links = jsonb_build_array(
    jsonb_build_object(
      'id', 'facebook',
      'platform', 'facebook',
      'label', 'Facebook',
      'url', 'https://www.facebook.com/trishia.kyle.n.bagtas/'
    ),
    jsonb_build_object(
      'id', 'linkedin',
      'platform', 'linkedin',
      'label', 'LinkedIn',
      'url', 'https://www.linkedin.com/in/trishia-kyle-bagtas-391916305'
    ),
    jsonb_build_object(
      'id', 'github',
      'platform', 'github',
      'label', 'GitHub',
      'url', 'https://github.com/ShaiShai-dev'
    ),
    jsonb_build_object(
      'id', 'email',
      'platform', 'email',
      'label', 'Email',
      'url', 'mailto:trishiabagtas2004@gmail.com'
    )
  )
where id = 'main';
