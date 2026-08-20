"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  SiteProfileContent,
  SocialLink,
  TechStackItem,
} from "@/lib/supabase/types";

export type SaveSiteProfileResult = {
  success: boolean;
  message: string;
};

function requiredText(
  value: unknown,
  label: string,
  maximumLength: number,
) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} is required.`);
  }

  const text = value.trim();
  if (text.length > maximumLength) {
    throw new Error(`${label} must be ${maximumLength} characters or fewer.`);
  }

  return text;
}

function sanitizeTechStack(value: unknown): TechStackItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Add at least one technology.");
  }
  if (value.length > 24) {
    throw new Error("The technology list supports up to 24 items.");
  }

  return value.map((rawItem, index) => {
    if (!rawItem || typeof rawItem !== "object") {
      throw new Error(`Technology ${index + 1} is invalid.`);
    }
    const item = rawItem as Partial<TechStackItem>;
    return {
      id: requiredText(item.id, `Technology ${index + 1} ID`, 80),
      name: requiredText(item.name, `Technology ${index + 1} name`, 80),
      icon: requiredText(item.icon, `Technology ${index + 1} icon`, 40),
    };
  });
}

function sanitizeSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) {
    throw new Error("Social links must be a list.");
  }
  if (value.length > 16) {
    throw new Error("The social link list supports up to 16 items.");
  }

  return value.map((rawItem, index) => {
    if (!rawItem || typeof rawItem !== "object") {
      throw new Error(`Social link ${index + 1} is invalid.`);
    }
    const item = rawItem as Partial<SocialLink>;
    const url = requiredText(item.url, `Social link ${index + 1} URL`, 500);

    if (!/^(https?:\/\/|mailto:)/i.test(url)) {
      throw new Error(
        `Social link ${index + 1} must start with https://, http://, or mailto:.`,
      );
    }

    return {
      id: requiredText(item.id, `Social link ${index + 1} ID`, 80),
      platform: requiredText(
        item.platform,
        `Social link ${index + 1} platform`,
        40,
      ),
      label: requiredText(item.label, `Social link ${index + 1} label`, 80),
      url,
    };
  });
}

function sanitizeProfile(value: SiteProfileContent): SiteProfileContent {
  const portraitUrl = value.portrait_url?.trim() || null;
  if (portraitUrl && !/^https:\/\//i.test(portraitUrl)) {
    throw new Error("Portrait must be a secure uploaded image URL.");
  }

  return {
    full_name: requiredText(value.full_name, "Full name", 120),
    stage_name: requiredText(value.stage_name, "Stage name", 60),
    headline: requiredText(value.headline, "Headline", 220),
    bio: requiredText(value.bio, "Biography", 2_000),
    location: requiredText(value.location, "Location", 160),
    availability: requiredText(value.availability, "Availability", 200),
    education_school: requiredText(
      value.education_school,
      "School",
      180,
    ),
    education_year: requiredText(value.education_year, "Year level", 80),
    education_degree: requiredText(value.education_degree, "Degree", 220),
    education_specialization: requiredText(
      value.education_specialization,
      "Specialization",
      180,
    ),
    portrait_url: portraitUrl,
    portrait_alt: requiredText(value.portrait_alt, "Portrait description", 180),
    tech_stack: sanitizeTechStack(value.tech_stack),
    social_links: sanitizeSocialLinks(value.social_links),
  };
}

export async function saveSiteProfile(
  value: SiteProfileContent,
): Promise<SaveSiteProfileResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, message: "Your admin session has expired." };
    }

    const profile = sanitizeProfile(value);
    const { error } = await supabase.from("site_profile").upsert(
      {
        id: "main",
        owner_id: user.id,
        ...profile,
      },
      { onConflict: "id" },
    );

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/about");

    return { success: true, message: "About content saved successfully." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to save content.",
    };
  }
}
