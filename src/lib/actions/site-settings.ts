"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  ContactContent,
  HomeContent,
  ProjectsContent,
  SiteSettingsContent,
  ThemeSettings,
} from "@/lib/supabase/types";

export type SaveSiteSettingsResult = {
  success: boolean;
  message: string;
};

function text(value: unknown, label: string, max: number) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }
  const result = value.trim();
  if (result.length > max) {
    throw new Error(`${label} must be ${max} characters or fewer.`);
  }
  return result;
}

function imageUrl(value: unknown, label: string) {
  if (value === null || value === "" || value === undefined) return null;
  const result = text(value, label, 600);
  if (!/^https:\/\//i.test(result)) {
    throw new Error(`${label} must be a secure uploaded image URL.`);
  }
  return result;
}

function list(value: unknown, label: string, maxItems: number) {
  if (!Array.isArray(value)) throw new Error(`${label} must be a list.`);
  const items = value
    .filter((item) => typeof item === "string" && item.trim())
    .map((item, index) => text(item, `${label} item ${index + 1}`, 100));
  if (items.length === 0) throw new Error(`${label} needs at least one item.`);
  if (items.length > maxItems) {
    throw new Error(`${label} supports up to ${maxItems} items.`);
  }
  return items;
}

function theme(value: ThemeSettings): ThemeSettings {
  const color = (candidate: unknown, label: string) => {
    const result = text(candidate, label, 7).toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(result)) {
      throw new Error(`${label} must use a six-digit hex color.`);
    }
    return result;
  };

  return {
    black: color(value.black, "Black"),
    prussian_blue: color(value.prussian_blue, "Prussian blue"),
    orange: color(value.orange, "Accent"),
    alabaster_grey: color(value.alabaster_grey, "Muted text"),
    white: color(value.white, "Primary text"),
  };
}

function home(value: HomeContent): HomeContent {
  return {
    status: text(value.status, "Home status", 140),
    eyebrow: text(value.eyebrow, "Home eyebrow", 100),
    title: text(value.title, "Home title", 100),
    accent_title: text(value.accent_title, "Home accent title", 100),
    introduction: text(value.introduction, "Home introduction", 600),
    primary_cta_label: text(value.primary_cta_label, "Primary button", 60),
    secondary_cta_label: text(value.secondary_cta_label, "Secondary button", 60),
    meta_items: list(value.meta_items, "Home metadata", 8),
    marquee_items: list(value.marquee_items, "Home marquee", 12),
    image_url: imageUrl(value.image_url, "Home image"),
    image_alt: text(value.image_alt, "Home image description", 180),
  };
}

function projects(value: ProjectsContent): ProjectsContent {
  return {
    eyebrow: text(value.eyebrow, "Projects eyebrow", 100),
    heading: text(value.heading, "Projects heading", 120),
    introduction: text(value.introduction, "Projects introduction", 500),
    archive_heading: text(value.archive_heading, "Archive heading", 120),
    archive_introduction: text(
      value.archive_introduction,
      "Archive introduction",
      500,
    ),
    empty_title: text(value.empty_title, "Empty state title", 120),
    empty_message: text(value.empty_message, "Empty state message", 500),
    image_url: imageUrl(value.image_url, "Projects section image"),
    image_alt: text(value.image_alt, "Projects image description", 180),
  };
}

function contact(value: ContactContent): ContactContent {
  return {
    eyebrow: text(value.eyebrow, "Contact eyebrow", 100),
    heading: text(value.heading, "Contact heading", 120),
    accent_heading: text(value.accent_heading, "Contact accent heading", 120),
    introduction: text(value.introduction, "Contact introduction", 600),
    direct_label: text(value.direct_label, "Contact card label", 80),
    direct_title: text(value.direct_title, "Contact card title", 240),
    timezone: text(value.timezone, "Timezone", 100),
    response_time: text(value.response_time, "Response time", 100),
    submit_label: text(value.submit_label, "Submit button", 80),
    project_types: list(value.project_types, "Project types", 12),
    image_url: imageUrl(value.image_url, "Contact image"),
    image_alt: text(value.image_alt, "Contact image description", 180),
  };
}

export async function saveSiteSettings(
  value: SiteSettingsContent,
): Promise<SaveSiteSettingsResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, message: "Your admin session has expired." };
    }

    const sanitized: SiteSettingsContent = {
      theme: theme(value.theme),
      home_content: home(value.home_content),
      projects_content: projects(value.projects_content),
      contact_content: contact(value.contact_content),
    };

    const { error } = await supabase.from("site_settings").upsert(
      { id: "main", owner_id: user.id, ...sanitized },
      { onConflict: "id" },
    );

    if (error) return { success: false, message: error.message };

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/site");
    return { success: true, message: "Website settings published." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to save settings.",
    };
  }
}
