import type {
  SiteProfile,
  SiteProfileContent,
  SocialLink,
  TechStackItem,
} from "@/lib/supabase/types";

export const TECH_ICON_OPTIONS = [
  { value: "react", label: "React" },
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
  { id: "react", name: "React", icon: "react" },
  { id: "nextjs", name: "Next.js", icon: "nextjs" },
  { id: "react-native", name: "React Native", icon: "react" },
  { id: "typescript", name: "TypeScript", icon: "typescript" },
  { id: "nodejs", name: "Node.js", icon: "nodejs" },
  { id: "supabase", name: "Supabase", icon: "supabase" },
  { id: "postgresql", name: "PostgreSQL", icon: "postgresql" },
  { id: "tailwind", name: "Tailwind CSS", icon: "tailwind" },
];

const defaultSocialLinks: SocialLink[] = [
  {
    id: "facebook",
    platform: "facebook",
    label: "Facebook",
    url: "https://facebook.com/",
  },
  {
    id: "instagram",
    platform: "instagram",
    label: "Instagram",
    url: "https://instagram.com/",
  },
  {
    id: "linkedin",
    platform: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/",
  },
  { id: "x", platform: "x", label: "X", url: "https://x.com/" },
];

export const DEFAULT_SITE_PROFILE: SiteProfileContent = {
  full_name: "Trishia Kyle Bagtas",
  stage_name: "SHAI",
  headline: "Web and mobile developer building purposeful digital experiences.",
  bio: "I am a web and mobile developer and a fourth-year student at National University Baliwag, taking up a Bachelor of Science in Information Technology with a specialization in Mobile and Web Applications.",
  location: "Baliwag, Bulacan, Philippines",
  availability: "Open to collaborations and selected projects",
  education_school: "National University Baliwag",
  education_year: "4th Year Student",
  education_degree: "Bachelor of Science in Information Technology",
  education_specialization: "Mobile and Web Applications",
  portrait_url: null,
  portrait_alt: "Portrait of SHAI",
  tech_stack: defaultTechStack,
  social_links: defaultSocialLinks,
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
  };
}
