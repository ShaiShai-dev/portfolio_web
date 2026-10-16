"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  ProfileSection,
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

function optionalText(value: unknown, label: string, maximumLength: number) {
  if (typeof value !== "string") return "";
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

function sanitizeCustomSections(value: unknown): ProfileSection[] {
  if (!Array.isArray(value)) {
    throw new Error("Custom profile sections must be a list.");
  }
  if (value.length > 12) {
    throw new Error("The About page supports up to 12 custom sections.");
  }

  return value.map((rawSection, sectionIndex) => {
    if (!rawSection || typeof rawSection !== "object") {
      throw new Error(`Section ${sectionIndex + 1} is invalid.`);
    }

    const section = rawSection as Partial<ProfileSection>;
    if (!Array.isArray(section.items)) {
      throw new Error(`Section ${sectionIndex + 1} entries must be a list.`);
    }
    if (section.items.length > 24) {
      throw new Error(`Section ${sectionIndex + 1} supports up to 24 entries.`);
    }

    return {
      id: requiredText(section.id, `Section ${sectionIndex + 1} ID`, 100),
      title: requiredText(section.title, `Section ${sectionIndex + 1} title`, 120),
      display_style:
        section.display_style === "floating" ? "floating" : "stack",
      items: section.items.map((rawItem, itemIndex) => {
        if (!rawItem || typeof rawItem !== "object") {
          throw new Error(
            `Entry ${itemIndex + 1} in section ${sectionIndex + 1} is invalid.`,
          );
        }

        const item = rawItem as Partial<ProfileSection["items"][number]>;
        const title = requiredText(
          item.title,
          `Entry ${itemIndex + 1} title in section ${sectionIndex + 1}`,
          160,
        );
        const date = optionalText(
          item.date,
          `Entry ${itemIndex + 1} date in section ${sectionIndex + 1}`,
          7,
        );
        if (date && !/^\d{4}-(0[1-9]|1[0-2])$/.test(date)) {
          throw new Error(
            `Entry ${itemIndex + 1} date must include a valid month and year.`,
          );
        }
        const link = typeof item.link === "string" ? item.link.trim() : "";
        if (link && !/^https:\/\//i.test(link)) {
          throw new Error(
            `Entry ${itemIndex + 1} link must start with https://.`,
          );
        }
        const imageUrl =
          typeof item.image_url === "string" && item.image_url.trim()
            ? item.image_url.trim()
            : null;
        if (imageUrl && !/^https:\/\//i.test(imageUrl)) {
          throw new Error(
            `Entry ${itemIndex + 1} image must be a secure uploaded image URL.`,
          );
        }

        return {
          id: requiredText(
            item.id,
            `Entry ${itemIndex + 1} ID in section ${sectionIndex + 1}`,
            100,
          ),
          title,
          date,
          description: requiredText(
            item.description,
            `Entry ${itemIndex + 1} description in section ${sectionIndex + 1}`,
            1_200,
          ),
          link,
          image_url: imageUrl,
          image_alt: imageUrl
            ? optionalText(
                item.image_alt,
                `Entry ${itemIndex + 1} image description in section ${sectionIndex + 1}`,
                180,
              ) || title
            : "",
        };
      }),
    };
  });
}

function sanitizeProfile(value: SiteProfileContent): SiteProfileContent {
  const portraitUrl = value.portrait_url?.trim() || null;
  if (portraitUrl && !/^https:\/\//i.test(portraitUrl)) {
    throw new Error("Portrait must be a secure uploaded image URL.");
  }

  const resumeUrl = requiredText(value.resume_url, "Resume URL", 500);
  if (!/^(https:\/\/|\/(?!\/))/i.test(resumeUrl)) {
    throw new Error(
      "Resume URL must be a secure https:// URL or a local path beginning with /.",
    );
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
    resume_url: resumeUrl,
    resume_label: requiredText(value.resume_label, "Resume button label", 80),
    resume_summary: requiredText(value.resume_summary, "Resume summary", 400),
    tech_stack: sanitizeTechStack(value.tech_stack),
    social_links: sanitizeSocialLinks(value.social_links),
    custom_sections: sanitizeCustomSections(value.custom_sections),
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
