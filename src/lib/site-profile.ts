import type {
  ProfileSection,
  SiteProfile,
  SiteProfileContent,
  SocialLink,
  TechStackItem,
} from "@/lib/supabase/types";

export const TECH_ICON_OPTIONS = [
  { value: "react", label: "React" },
  { value: "flutter", label: "Flutter" },
  { value: "dart", label: "Dart" },
  { value: "nextjs", label: "Next.js" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "nodejs", label: "Node.js" },
  { value: "supabase", label: "Supabase" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "html", label: "HTML5" },
  { value: "css", label: "CSS3" },
  { value: "figma", label: "Figma" },
  { value: "git", label: "Git" },
  { value: "github", label: "GitHub" },
  { value: "uiux", label: "UI/UX Design" },
  { value: "ai", label: "AI / Generative AI" },
  { value: "notion", label: "Notion" },
  { value: "canva", label: "Canva" },
  { value: "code", label: "Generic code" },
] as const;

export const SOCIAL_PLATFORM_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X" },
  { value: "github", label: "GitHub" },
  { value: "email", label: "Email" },
  { value: "website", label: "Website" },
] as const;

const defaultTechStack: TechStackItem[] = [
  { id: "flutter", name: "Flutter", icon: "flutter" },
  { id: "dart", name: "Dart", icon: "dart" },
  { id: "javascript", name: "JavaScript", icon: "javascript" },
  { id: "typescript", name: "TypeScript", icon: "typescript" },
  { id: "react", name: "React", icon: "react" },
  { id: "react-native", name: "React Native", icon: "react" },
  { id: "nextjs", name: "Next.js", icon: "nextjs" },
  { id: "supabase", name: "Supabase", icon: "supabase" },
  { id: "tailwind", name: "Tailwind CSS", icon: "tailwind" },
  { id: "git-github", name: "Git / GitHub", icon: "github" },
  { id: "ui-ux", name: "UI/UX Design", icon: "uiux" },
  { id: "ai-api", name: "AI API Integration", icon: "ai" },
  { id: "notion", name: "Notion", icon: "notion" },
  { id: "canva", name: "Canva", icon: "canva" },
];

const defaultSocialLinks: SocialLink[] = [
  {
    id: "facebook",
    platform: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/trishia.kyle.n.bagtas/",
  },
  {
    id: "linkedin",
    platform: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/trishia-kyle-bagtas-391916305",
  },
  {
    id: "github",
    platform: "github",
    label: "GitHub",
    url: "https://github.com/ShaiShai-dev",
  },
  {
    id: "email",
    platform: "email",
    label: "Email",
    url: "mailto:trishiabagtas2004@gmail.com",
  },
];

export const DEFAULT_SITE_PROFILE: SiteProfileContent = {
  full_name: "Trishia Kyle Bagtas",
  stage_name: "SHAI",
  headline: "Web and mobile developer turning ideas into purposeful digital solutions.",
  bio: "I am a fourth-year BS Information Technology student at National University Baliwag, specializing in Mobile and Web Applications. I transform ideas and user needs into functional digital products through AI-assisted development, rapid prototyping, UI/UX design, system integration, testing, and iterative improvement. My work spans interactive learning, digital storytelling, and management systems, supported by leadership, collaboration, project coordination, and technical documentation.",
  location: "Baliwag, Bulacan, Philippines",
  availability: "Open to internships, collaborations, and selected projects",
  education_school: "National University Baliwag",
  education_year: "Fourth Year - 2023 to Present",
  education_degree: "Bachelor of Science in Information Technology",
  education_specialization: "Mobile and Web Applications",
  portrait_url: null,
  portrait_alt: "Portrait of SHAI",
  resume_url: "/documents/trishia-kyle-bagtas-resume.pdf",
  resume_label: "View full resume",
  resume_summary:
    "Explore my technical skills, selected projects, education, and leadership experience.",
  tech_stack: defaultTechStack,
  social_links: defaultSocialLinks,
  custom_sections: [],
};

function isTechStackItem(value: unknown): value is TechStackItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<TechStackItem>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.icon === "string"
  );
}

function isSocialLink(value: unknown): value is SocialLink {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<SocialLink>;
  return (
    typeof item.id === "string" &&
    typeof item.platform === "string" &&
    typeof item.label === "string" &&
    typeof item.url === "string"
  );
}

function normalizeProfileSections(value: unknown): ProfileSection[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((rawSection) => {
    if (!rawSection || typeof rawSection !== "object") return [];
    const section = rawSection as Partial<ProfileSection>;
    if (
      typeof section.id !== "string" ||
      typeof section.title !== "string" ||
      !Array.isArray(section.items)
    ) {
      return [];
    }

    const items = section.items.flatMap((rawItem) => {
      if (!rawItem || typeof rawItem !== "object") return [];
      const item = rawItem as Partial<ProfileSection["items"][number]>;
      if (
        typeof item.id !== "string" ||
        typeof item.title !== "string" ||
        typeof item.description !== "string"
      ) {
        return [];
      }

      const imageUrl =
        typeof item.image_url === "string" &&
        /^https:\/\//i.test(item.image_url)
          ? item.image_url
          : null;

      return [
        {
          id: item.id,
          title: item.title,
          date:
            typeof item.date === "string" &&
            /^\d{4}-(0[1-9]|1[0-2])$/.test(item.date)
              ? item.date
              : "",
          description: item.description,
          link: typeof item.link === "string" ? item.link : "",
          image_url: imageUrl,
          image_alt:
            typeof item.image_alt === "string" && item.image_alt.trim()
              ? item.image_alt
              : item.title,
        },
      ];
    });

    return [
      {
        id: section.id,
        title: section.title,
        display_style:
          section.display_style === "floating" ? "floating" : "stack",
        items,
      },
    ];
  });
}

export function getSiteProfileContent(
  profile: SiteProfile | null | undefined,
): SiteProfileContent {
  if (!profile) return DEFAULT_SITE_PROFILE;

  return {
    full_name: profile.full_name || DEFAULT_SITE_PROFILE.full_name,
    stage_name: profile.stage_name || DEFAULT_SITE_PROFILE.stage_name,
    headline: profile.headline || DEFAULT_SITE_PROFILE.headline,
    bio: profile.bio || DEFAULT_SITE_PROFILE.bio,
    location: profile.location || DEFAULT_SITE_PROFILE.location,
    availability: profile.availability || DEFAULT_SITE_PROFILE.availability,
    education_school:
      profile.education_school || DEFAULT_SITE_PROFILE.education_school,
    education_year:
      profile.education_year || DEFAULT_SITE_PROFILE.education_year,
    education_degree:
      profile.education_degree || DEFAULT_SITE_PROFILE.education_degree,
    education_specialization:
      profile.education_specialization ||
      DEFAULT_SITE_PROFILE.education_specialization,
    portrait_url: profile.portrait_url || null,
    portrait_alt: profile.portrait_alt || DEFAULT_SITE_PROFILE.portrait_alt,
    resume_url: profile.resume_url || DEFAULT_SITE_PROFILE.resume_url,
    resume_label: profile.resume_label || DEFAULT_SITE_PROFILE.resume_label,
    resume_summary:
      profile.resume_summary || DEFAULT_SITE_PROFILE.resume_summary,
    tech_stack:
      Array.isArray(profile.tech_stack) &&
      profile.tech_stack.every(isTechStackItem) &&
      profile.tech_stack.length > 0
        ? profile.tech_stack
        : DEFAULT_SITE_PROFILE.tech_stack,
    social_links:
      Array.isArray(profile.social_links) &&
      profile.social_links.every(isSocialLink) &&
      profile.social_links.length > 0
        ? profile.social_links
        : DEFAULT_SITE_PROFILE.social_links,
    custom_sections: normalizeProfileSections(profile.custom_sections),
  };
}
