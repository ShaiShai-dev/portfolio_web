import type {
  ContactContent,
  HomeContent,
  ProjectsContent,
  SiteSettings,
  SiteSettingsContent,
  ThemeSettings,
} from "@/lib/supabase/types";

export const DEFAULT_THEME: ThemeSettings = {
  black: "#000000",
  prussian_blue: "#14213d",
  orange: "#fca311",
  alabaster_grey: "#e5e5e5",
  white: "#ffffff",
};

export const DEFAULT_HOME_CONTENT: HomeContent = {
  status: "Available for select projects / 2026",
  eyebrow: "Web + Mobile Developer",
  title: "IDEAS INTO",
  accent_title: "INTERFACES.",
  introduction:
    "I'm SHAI. I design and build polished web and mobile products from first sketch to final ship.",
  primary_cta_label: "Explore my work",
  secondary_cta_label: "Start a conversation",
  meta_items: [
    "Based in the Philippines",
    "React / Next.js",
    "React Native",
  ],
  marquee_items: [
    "Web applications",
    "Mobile experiences",
    "Product design",
    "Full-stack development",
  ],
  image_url: null,
  image_alt: "SHAI working on a digital product",
};

export const DEFAULT_PROJECTS_CONTENT: ProjectsContent = {
  eyebrow: "Featured projects",
  heading: "Selected work",
  introduction:
    "A collection of products shaped through strategy, design, and code.",
  archive_heading: "All projects",
  archive_introduction:
    "An archive of client collaborations, independent builds, and product experiments.",
  empty_title: "Case studies coming soon.",
  empty_message:
    "The work is real. The write-ups are getting the same care as the products.",
  image_url: null,
  image_alt: "A preview of SHAI's selected projects",
};

export const DEFAULT_CONTACT_CONTENT: ContactContent = {
  eyebrow: "Get in touch",
  heading: "Have an idea?",
  accent_heading: "Let's make it real.",
  introduction:
    "Share what you're building, where you are in the process, and what a successful launch looks like. I'll get back to you soon.",
  direct_label: "Direct line",
  direct_title: "A good project starts with a clear conversation.",
  timezone: "GMT +8 / Philippines",
  response_time: "Within 1–2 business days",
  submit_label: "Send project brief",
  project_types: [
    "Web App",
    "Mobile App",
    "Website / Landing Page",
    "Not sure yet",
  ],
  image_url: null,
  image_alt: "Contact SHAI about a new project",
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsContent = {
  theme: DEFAULT_THEME,
  home_content: DEFAULT_HOME_CONTENT,
  projects_content: DEFAULT_PROJECTS_CONTENT,
  contact_content: DEFAULT_CONTACT_CONTENT,
};

function mergeStrings<T extends object>(defaults: T, value: unknown): T {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...defaults };
  }

  const source = value as Partial<Record<keyof T, unknown>>;
  return Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => {
      const candidate = source[key as keyof T];
      if (Array.isArray(fallback)) {
        return [
          key,
          Array.isArray(candidate) && candidate.every((item) => typeof item === "string")
            ? candidate
            : fallback,
        ];
      }
      if (fallback === null) {
        return [key, typeof candidate === "string" && candidate ? candidate : null];
      }
      return [key, typeof candidate === "string" && candidate ? candidate : fallback];
    }),
  ) as T;
}

export function getSiteSettingsContent(
  settings: SiteSettings | null | undefined,
): SiteSettingsContent {
  return {
    theme: mergeStrings(DEFAULT_THEME, settings?.theme),
    home_content: mergeStrings(DEFAULT_HOME_CONTENT, settings?.home_content),
    projects_content: mergeStrings(
      DEFAULT_PROJECTS_CONTENT,
      settings?.projects_content,
    ),
    contact_content: mergeStrings(
      DEFAULT_CONTACT_CONTENT,
      settings?.contact_content,
    ),
  };
}
