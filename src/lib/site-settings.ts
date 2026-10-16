import type {
  ContactContent,
  HomeContent,
  MaintenanceContent,
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

export type ThemePreset = {
  id:
    | "signature"
    | "molten-lava"
    | "ink-black"
    | "onyx-frost"
    | "bordeaux-stone";
  name: string;
  description: string;
  colors: ThemeSettings;
  labels: [string, string, string, string, string];
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "signature",
    name: "SHAI Signature",
    description: "The original black, Prussian blue, and orange portfolio system.",
    colors: DEFAULT_THEME,
    labels: ["Black", "Prussian blue", "Orange", "Alabaster grey", "White"],
  },
  {
    id: "molten-lava",
    name: "Molten Lava",
    description: "A bold editorial system balancing warm reds with deep blue.",
    colors: {
      black: "#780000ff",
      prussian_blue: "#003049ff",
      orange: "#c1121fff",
      alabaster_grey: "#669bbcff",
      white: "#fdf0d5ff",
    },
    labels: ["Molten lava", "Deep space blue", "Brick red", "Steel blue", "Papaya whip"],
  },
  {
    id: "ink-black",
    name: "Ink & Denim",
    description: "A calm navy system with blue-slate details and eggshell type.",
    colors: {
      black: "#0d1321ff",
      prussian_blue: "#1d2d44ff",
      orange: "#748cabff",
      alabaster_grey: "#3e5c76ff",
      white: "#f0ebd8ff",
    },
    labels: ["Ink black", "Deep space blue", "Dusty denim", "Blue slate", "Eggshell"],
  },
  {
    id: "onyx-frost",
    name: "Onyx & Frost",
    description: "A crisp dark-teal system with platinum type and icy blue energy.",
    colors: {
      black: "#0a090cff",
      prussian_blue: "#07393cff",
      orange: "#90ddf0ff",
      alabaster_grey: "#2c666eff",
      white: "#f0edeeff",
    },
    labels: ["Onyx", "Dark teal", "Frosted blue", "Stormy teal", "Platinum"],
  },
  {
    id: "bordeaux-stone",
    name: "Bordeaux & Stone",
    description: "A warm, refined system pairing deep wine surfaces with tactile neutrals.",
    colors: {
      black: "#0a0908ff",
      prussian_blue: "#49111cff",
      orange: "#a9927dff",
      alabaster_grey: "#5e503fff",
      white: "#f2f4f3ff",
    },
    labels: ["Black", "Night bordeaux", "Dusty taupe", "Stone brown", "White smoke"],
  },
];

export function themeMatchesPreset(
  theme: ThemeSettings,
  preset: ThemePreset,
) {
  return (Object.keys(preset.colors) as Array<keyof ThemeSettings>).every(
    (key) => theme[key].toLowerCase() === preset.colors[key].toLowerCase(),
  );
}

export const DEFAULT_MAINTENANCE_CONTENT: MaintenanceContent = {
  eyebrow: "Scheduled maintenance",
  heading: "The portfolio is getting a quick tune-up.",
  message:
    "SHAI is making a few improvements behind the scenes. Please check back soon.",
  status_label: "Temporarily offline",
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
  image_frame_size: "standard",
  image_frame_aspect: "portrait",
  image_fit: "cover",
  image_position: "center",
};

export const DEFAULT_PROJECTS_CONTENT: ProjectsContent = {
  display_style: "grid",
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
  maintenance_mode: false,
  maintenance_content: DEFAULT_MAINTENANCE_CONTENT,
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
  const projectsContent = mergeStrings(
    DEFAULT_PROJECTS_CONTENT,
    settings?.projects_content,
  );

  return {
    maintenance_mode: settings?.maintenance_mode === true,
    maintenance_content: mergeStrings(
      DEFAULT_MAINTENANCE_CONTENT,
      settings?.maintenance_content,
    ),
    theme: mergeStrings(DEFAULT_THEME, settings?.theme),
    home_content: mergeStrings(DEFAULT_HOME_CONTENT, settings?.home_content),
    projects_content: {
      ...projectsContent,
      display_style:
        projectsContent.display_style === "stack" ||
        projectsContent.display_style === "floating"
          ? projectsContent.display_style
          : "grid",
    },
    contact_content: mergeStrings(
      DEFAULT_CONTACT_CONTENT,
      settings?.contact_content,
    ),
  };
}
