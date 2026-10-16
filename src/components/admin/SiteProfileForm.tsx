"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BrandIcon } from "@/components/ui/BrandIcon";
import MediaUploadField from "@/components/admin/MediaUploadField";
import ResumeUploadField from "@/components/admin/ResumeUploadField";
import {
  SOCIAL_PLATFORM_OPTIONS,
  TECH_ICON_OPTIONS,
} from "@/lib/site-profile";
import { saveSiteProfile } from "@/lib/actions/site-profile";
import type {
  SiteProfileContent,
  SocialLink,
  TechStackItem,
} from "@/lib/supabase/types";

const inputClassName =
  "w-full border border-alabaster-grey/15 bg-black px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-alabaster-grey/30 focus:border-orange";

const labelClassName =
  "font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/60";

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export default function SiteProfileForm({
  initialProfile,
  databaseReady,
}: {
  initialProfile: SiteProfileContent;
  databaseReady: boolean;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<SiteProfileContent>(() => ({
    ...initialProfile,
    tech_stack: initialProfile.tech_stack.map((item) => ({ ...item })),
    social_links: initialProfile.social_links.map((item) => ({ ...item })),
  }));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function updateTextField(
    field: Exclude<keyof SiteProfileContent, "tech_stack" | "social_links">,
    value: string,
  ) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function updateTech(index: number, patch: Partial<TechStackItem>) {
    setProfile((current) => ({
      ...current,
      tech_stack: current.tech_stack.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addTech() {
    setProfile((current) => ({
      ...current,
      tech_stack: [
        ...current.tech_stack,
        { id: makeId("tech"), name: "New technology", icon: "code" },
      ],
    }));
  }

  function removeTech(index: number) {
    setProfile((current) => ({
      ...current,
      tech_stack: current.tech_stack.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function moveTech(index: number, direction: -1 | 1) {
    setProfile((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.tech_stack.length) return current;
      const nextItems = [...current.tech_stack];
      [nextItems[index], nextItems[target]] = [nextItems[target], nextItems[index]];
      return { ...current, tech_stack: nextItems };
    });
  }

  function updateSocial(index: number, patch: Partial<SocialLink>) {
    setProfile((current) => ({
      ...current,
      social_links: current.social_links.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addSocial() {
    setProfile((current) => ({
      ...current,
      social_links: [
        ...current.social_links,
        {
          id: makeId("social"),
          platform: "website",
          label: "Website",
          url: "https://",
        },
      ],
    }));
  }

  function removeSocial(index: number) {
    setProfile((current) => ({
      ...current,
      social_links: current.social_links.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  function moveSocial(index: number, direction: -1 | 1) {
    setProfile((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.social_links.length) return current;
      const nextItems = [...current.social_links];
      [nextItems[index], nextItems[target]] = [nextItems[target], nextItems[index]];
      return { ...current, social_links: nextItems };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setSuccess(false);

    const result = await saveSiteProfile(profile);
    setMessage(result.message);
    setSuccess(result.success);
    setSaving(false);

    if (result.success) {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {!databaseReady && (
        <div className="border border-orange/50 bg-orange/10 p-4 text-sm leading-6 text-alabaster-grey">
          <strong className="text-orange">Database setup required.</strong>{" "}
          Apply the generated migration before saving. The form is showing safe
          defaults until the <code>site_profile</code> table is available.
        </div>
      )}

      <EditorSection
        index="01"
        title="Identity and introduction"
        description="The primary information displayed at the start of the About section."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="full_name">
            <input
              id="full_name"
              required
              value={profile.full_name}
              onChange={(event) => updateTextField("full_name", event.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label="Stage name" htmlFor="stage_name">
            <input
              id="stage_name"
              required
              value={profile.stage_name}
              onChange={(event) => updateTextField("stage_name", event.target.value)}
              className={inputClassName}
            />
          </Field>
        </div>

        <Field label="Headline" htmlFor="headline">
          <textarea
            id="headline"
            required
            rows={2}
            value={profile.headline}
            onChange={(event) => updateTextField("headline", event.target.value)}
            className={inputClassName}
          />
        </Field>

        <Field label="Biography" htmlFor="bio">
          <textarea
            id="bio"
            required
            rows={6}
            value={profile.bio}
            onChange={(event) => updateTextField("bio", event.target.value)}
            className={inputClassName}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Location" htmlFor="location">
            <input
              id="location"
              required
              value={profile.location}
              onChange={(event) => updateTextField("location", event.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label="Availability message" htmlFor="availability">
            <input
              id="availability"
              required
              value={profile.availability}
              onChange={(event) =>
                updateTextField("availability", event.target.value)
              }
              className={inputClassName}
            />
          </Field>
        </div>

        <MediaUploadField
          label="About portrait or feature image"
          folder="about"
          value={profile.portrait_url}
          alt={profile.portrait_alt}
          onChange={(portrait_url) =>
            setProfile((current) => ({ ...current, portrait_url }))
          }
        />
        <Field label="Portrait description for accessibility" htmlFor="portrait_alt">
          <input
            id="portrait_alt"
            required
            value={profile.portrait_alt}
            onChange={(event) => updateTextField("portrait_alt", event.target.value)}
            className={inputClassName}
          />
        </Field>
      </EditorSection>

      <EditorSection
        index="02"
        title="Education"
        description="Structured academic details shown in the education file card."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="School" htmlFor="education_school">
            <input
              id="education_school"
              required
              value={profile.education_school}
              onChange={(event) =>
                updateTextField("education_school", event.target.value)
              }
              className={inputClassName}
            />
          </Field>
          <Field label="Year level" htmlFor="education_year">
            <input
              id="education_year"
              required
              value={profile.education_year}
              onChange={(event) =>
                updateTextField("education_year", event.target.value)
              }
              className={inputClassName}
            />
          </Field>
          <Field label="Degree" htmlFor="education_degree">
            <input
              id="education_degree"
              required
              value={profile.education_degree}
              onChange={(event) =>
                updateTextField("education_degree", event.target.value)
              }
              className={inputClassName}
            />
          </Field>
          <Field label="Specialization" htmlFor="education_specialization">
            <input
              id="education_specialization"
              required
              value={profile.education_specialization}
              onChange={(event) =>
                updateTextField("education_specialization", event.target.value)
              }
              className={inputClassName}
            />
          </Field>
        </div>
      </EditorSection>

      <EditorSection
        index="03"
        title="Resume preview"
        description="Upload a new PDF and control the public preview and download shown on the About section."
      >
        <ResumeUploadField
          value={profile.resume_url}
          onChange={(resume_url) =>
            setProfile((current) => ({ ...current, resume_url }))
          }
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Resume button label" htmlFor="resume_label">
            <input
              id="resume_label"
              required
              value={profile.resume_label}
              onChange={(event) =>
                updateTextField("resume_label", event.target.value)
              }
              className={inputClassName}
            />
          </Field>
          <details className="group border border-alabaster-grey/15 bg-black/30 p-4">
            <summary className="cursor-pointer font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/60 transition-colors hover:text-orange">
              Advanced: document URL
            </summary>
            <input
              id="resume_url"
              required
              value={profile.resume_url}
              onChange={(event) =>
                updateTextField("resume_url", event.target.value)
              }
              aria-label="Resume PDF URL or public path"
              placeholder="/documents/your-resume.pdf"
              className={`${inputClassName} mt-3`}
            />
          </details>
        </div>
        <Field label="Resume summary" htmlFor="resume_summary">
          <textarea
            id="resume_summary"
            required
            rows={3}
            value={profile.resume_summary}
            onChange={(event) =>
              updateTextField("resume_summary", event.target.value)
            }
            className={inputClassName}
          />
        </Field>
      </EditorSection>

      <EditorSection
        index="04"
        title="Technology roll"
        description="Add, reorder, rename, or remove technologies. The selected mark appears in the animated logo rail."
        action={
          <button type="button" onClick={addTech} className="admin-secondary-button">
            + Add technology
          </button>
        }
      >
        <div className="space-y-3">
          {profile.tech_stack.map((item, index) => (
            <div
              key={item.id}
              className="grid gap-3 border border-alabaster-grey/15 bg-black/40 p-4 md:grid-cols-[52px_1fr_1fr_auto] md:items-end"
            >
              <span className="grid size-11 place-items-center border border-orange/50 text-orange">
                <BrandIcon name={item.icon} className="size-7" />
              </span>
              <Field label="Display name" htmlFor={`tech-name-${item.id}`}>
                <input
                  id={`tech-name-${item.id}`}
                  required
                  value={item.name}
                  onChange={(event) => updateTech(index, { name: event.target.value })}
                  className={inputClassName}
                />
              </Field>
              <Field label="Logo" htmlFor={`tech-icon-${item.id}`}>
                <select
                  id={`tech-icon-${item.id}`}
                  value={item.icon}
                  onChange={(event) => updateTech(index, { icon: event.target.value })}
                  className={inputClassName}
                >
                  {TECH_ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <ItemActions
                index={index}
                length={profile.tech_stack.length}
                onMove={(direction) => moveTech(index, direction)}
                onRemove={() => removeTech(index)}
              />
            </div>
          ))}
        </div>
      </EditorSection>

      <EditorSection
        index="05"
        title="Social links"
        description="Manage contact platforms and profile URLs. Facebook, Instagram, LinkedIn, and X are included by default."
        action={
          <button type="button" onClick={addSocial} className="admin-secondary-button">
            + Add social link
          </button>
        }
      >
        <div className="space-y-3">
          {profile.social_links.map((item, index) => (
            <div
              key={item.id}
              className="grid gap-3 border border-alabaster-grey/15 bg-black/40 p-4 lg:grid-cols-[52px_0.7fr_0.8fr_1.4fr_auto] lg:items-end"
            >
              <span className="grid size-11 place-items-center border border-orange/50 text-orange">
                <BrandIcon name={item.platform} className="size-7" />
              </span>
              <Field label="Platform" htmlFor={`social-platform-${item.id}`}>
                <select
                  id={`social-platform-${item.id}`}
                  value={item.platform}
                  onChange={(event) =>
                    updateSocial(index, { platform: event.target.value })
                  }
                  className={inputClassName}
                >
                  {SOCIAL_PLATFORM_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Label" htmlFor={`social-label-${item.id}`}>
                <input
                  id={`social-label-${item.id}`}
                  required
                  value={item.label}
                  onChange={(event) =>
                    updateSocial(index, { label: event.target.value })
                  }
                  className={inputClassName}
                />
              </Field>
              <Field label="Profile URL" htmlFor={`social-url-${item.id}`}>
                <input
                  id={`social-url-${item.id}`}
                  required
                  type={item.platform === "email" ? "text" : "url"}
                  value={item.url}
                  onChange={(event) =>
                    updateSocial(index, { url: event.target.value })
                  }
                  placeholder={
                    item.platform === "email"
                      ? "mailto:you@example.com"
                      : "https://..."
                  }
                  className={inputClassName}
                />
              </Field>
              <ItemActions
                index={index}
                length={profile.social_links.length}
                onMove={(direction) => moveSocial(index, direction)}
                onRemove={() => removeSocial(index)}
              />
            </div>
          ))}
        </div>
      </EditorSection>

      <div className="sticky bottom-4 z-20 flex flex-col gap-3 border border-alabaster-grey/20 bg-prussian-blue/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p
          aria-live="polite"
          className={`text-sm ${success ? "text-white" : "text-orange"}`}
        >
          {message || "Changes appear on the public About section after saving."}
        </p>
        <button
          type="submit"
          disabled={saving}
          className="border border-orange bg-orange px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-black transition-colors hover:bg-black hover:text-orange disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save About section"}
        </button>
      </div>
    </form>
  );
}

function EditorSection({
  index,
  title,
  description,
  action,
  children,
}: {
  index: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border border-alabaster-grey/15 bg-prussian-blue/35">
      <div className="flex flex-col gap-4 border-b border-alabaster-grey/15 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-orange">
            Module / {index}
          </p>
          <h2 className="mt-1 text-lg font-bold text-white">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-alabaster-grey/55">
            {description}
          </p>
        </div>
        {action}
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={htmlFor} className={labelClassName}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ItemActions({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(-1)}
        className="admin-icon-button"
        aria-label="Move item up"
      >
        ↑
      </button>
      <button
        type="button"
        disabled={index === length - 1}
        onClick={() => onMove(1)}
        className="admin-icon-button"
        aria-label="Move item down"
      >
        ↓
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="admin-icon-button hover:border-orange hover:text-orange"
        aria-label="Remove item"
      >
        ×
      </button>
    </div>
  );
}
