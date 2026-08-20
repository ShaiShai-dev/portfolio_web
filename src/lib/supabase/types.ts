// Hand-written types mirroring the SQL schema (see SCHEMA.sql).
// Once the schema is confirmed you can regenerate this with:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts

export type Project = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  summary: string;
  description: string | null; // problem / process / outcome, case-study body
  tech_stack: string[];
  thumbnail_url: string | null;
  screenshot_urls: string[];
  live_url: string | null;
  github_url: string | null;
  is_published: boolean;
  sort_order: number;
};

export type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
};

export type TechStackItem = {
  id: string;
  name: string;
  icon: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
};

export type SiteProfileContent = {
  full_name: string;
  stage_name: string;
  headline: string;
  bio: string;
  location: string;
  availability: string;
  education_school: string;
  education_year: string;
  education_degree: string;
  education_specialization: string;
  portrait_url: string | null;
  portrait_alt: string;
  tech_stack: TechStackItem[];
  social_links: SocialLink[];
};

export type ThemeSettings = {
  black: string;
  prussian_blue: string;
  orange: string;
  alabaster_grey: string;
  white: string;
};

export type HomeContent = {
  status: string;
  eyebrow: string;
  title: string;
  accent_title: string;
  introduction: string;
  primary_cta_label: string;
  secondary_cta_label: string;
  meta_items: string[];
  marquee_items: string[];
  image_url: string | null;
  image_alt: string;
};

export type ProjectsContent = {
  eyebrow: string;
  heading: string;
  introduction: string;
  archive_heading: string;
  archive_introduction: string;
  empty_title: string;
  empty_message: string;
  image_url: string | null;
  image_alt: string;
};

export type ContactContent = {
  eyebrow: string;
  heading: string;
  accent_heading: string;
  introduction: string;
  direct_label: string;
  direct_title: string;
  timezone: string;
  response_time: string;
  submit_label: string;
  project_types: string[];
  image_url: string | null;
  image_alt: string;
};

export type SiteSettingsContent = {
  theme: ThemeSettings;
  home_content: HomeContent;
  projects_content: ProjectsContent;
  contact_content: ContactContent;
};

export type SiteSettings = SiteSettingsContent & {
  id: string;
  owner_id: string;
  updated_at: string;
};

export type SiteProfile = SiteProfileContent & {
  id: string;
  owner_id: string;
  updated_at: string;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13";
  };
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at" | "updated_at"> &
          Partial<Pick<Project, "id" | "created_at" | "updated_at">>;
        Update: Partial<Project>;
        Relationships: [];
      };
      inquiries: {
        Row: Inquiry;
        Insert: Omit<Inquiry, "id" | "created_at"> &
          Partial<Pick<Inquiry, "id" | "created_at">>;
        Update: Partial<Inquiry>;
        Relationships: [];
      };
      site_profile: {
        Row: SiteProfile;
        Insert: SiteProfileContent & {
          id?: string;
          owner_id?: string;
          updated_at?: string;
        };
        Update: Partial<SiteProfileContent>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettings;
        Insert: SiteSettingsContent & {
          id?: string;
          owner_id?: string;
          updated_at?: string;
        };
        Update: Partial<SiteSettingsContent>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
