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
  ProfileSection,
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
    custom_sections: initialProfile.custom_sections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({ ...item })),
    })),
  }));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function updateTextField(
    field: Exclude<
      keyof SiteProfileContent,
      "tech_stack" | "social_links" | "custom_sections"
    >,
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

  function updateCustomSection(
    sectionIndex: number,
    patch: Partial<ProfileSection>,
  ) {
    setProfile((current) => ({
      ...current,
      custom_sections: current.custom_sections.map((section, index) =>
        index === sectionIndex ? { ...section, ...patch } : section,
      ),
    }));
  }

  function addCustomSection() {
    setProfile((current) => ({
      ...current,
      custom_sections: [
        ...current.custom_sections,
        {
          id: makeId("section"),
          title: "Achievements",
          display_style: "stack",
          items: [],
        },
      ],
    }));
  }

  function removeCustomSection(sectionIndex: number) {
    setProfile((current) => ({
      ...current,
      custom_sections: current.custom_sections.filter(
        (_, index) => index !== sectionIndex,
      ),
    }));
  }

  function moveCustomSection(sectionIndex: number, direction: -1 | 1) {
    setProfile((current) => {
      const target = sectionIndex + direction;
      if (target < 0 || target >= current.custom_sections.length) return current;
      const sections = [...current.custom_sections];
      [sections[sectionIndex], sections[target]] = [
        sections[target],
        sections[sectionIndex],
      ];
      return { ...current, custom_sections: sections };
    });
  }

  function addCustomSectionItem(sectionIndex: number) {
    setProfile((current) => ({
      ...current,
      custom_sections: current.custom_sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              items: [
                ...section.items,
                {
                  id: makeId("entry"),
                  title: "New entry",
                  date: "",
                  description: "Add a short description of this achievement.",
                  link: "",
                  image_url: null,
                  image_alt: "",
                },
              ],
            }
          : section,
      ),
    }));
  }

  function updateCustomSectionItem(
    sectionIndex: number,
    itemIndex: number,
    patch: Partial<ProfileSection["items"][number]>,
  ) {
    setProfile((current) => ({
      ...current,
      custom_sections: current.custom_sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, currentItemIndex) =>
                currentItemIndex === itemIndex ? { ...item, ...patch } : item,
              ),
            }
          : section,
      ),
    }));
  }

  function removeCustomSectionItem(sectionIndex: number, itemIndex: number) {
    setProfile((current) => ({
      ...current,
      custom_sections: current.custom_sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              items: section.items.filter(
                (_, currentItemIndex) => currentItemIndex !== itemIndex,
              ),
            }
          : section,
      ),
    }));
  }

  function moveCustomSectionItem(
    sectionIndex: number,
    itemIndex: number,
    direction: -1 | 1,
  ) {
    setProfile((current) => ({
      ...current,
      custom_sections: current.custom_sections.map((section, index) => {
        if (index !== sectionIndex) return section;
        const target = itemIndex + direction;
        if (target < 0 || target >= section.items.length) return section;
        const items = [...section.items];
        [items[itemIndex], items[target]] = [items[target], items[itemIndex]];
        return { ...section, items };
      }),
    }));
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
        title="Custom profile sections"
        description="Create flexible sections for certificates, achievements, training, leadership, or any other resume highlight, then choose how each gallery moves."
        action={
          <button
            type="button"
            onClick={addCustomSection}
            className="admin-secondary-button"
          >
            + Add section
          </button>
        }
      >
        {profile.custom_sections.length === 0 ? (
          <div className="fine-grid border border-dashed border-alabaster-grey/25 bg-black/30 px-5 py-10 text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-orange">
              No custom sections yet
            </p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-alabaster-grey/60">
              Add a section such as Certificates or Achievements, then create as
              many entries as you need with optional dates, images, and links.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {profile.custom_sections.map((section, sectionIndex) => (
              <section
                key={section.id}
                className="overflow-hidden border border-alabaster-grey/20 bg-black/35"
              >
                <div className="flex flex-col gap-4 border-b border-alabaster-grey/15 bg-prussian-blue/30 p-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
                    <Field
                      label="Section title"
                      htmlFor={`section-title-${section.id}`}
                    >
                      <input
                        id={`section-title-${section.id}`}
                        required
                        value={section.title}
                        onChange={(event) =>
                          updateCustomSection(sectionIndex, {
                            title: event.target.value,
                          })
                        }
                        placeholder="Certificates"
                        className={inputClassName}
                      />
                    </Field>
                    <Field
                      label="Gallery animation"
                      htmlFor={`section-style-${section.id}`}
                    >
                      <select
                        id={`section-style-${section.id}`}
                        value={section.display_style}
                        onChange={(event) =>
                          updateCustomSection(sectionIndex, {
                            display_style: event.target.value as ProfileSection["display_style"],
                          })
                        }
                        className={inputClassName}
                      >
                        <option value="stack">Stack view</option>
                        <option value="floating">Floating gallery</option>
                      </select>
                    </Field>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addCustomSectionItem(sectionIndex)}
                      className="admin-secondary-button"
                    >
                      + Add entry
                    </button>
                    <ItemActions
                      index={sectionIndex}
                      length={profile.custom_sections.length}
                      onMove={(direction) =>
                        moveCustomSection(sectionIndex, direction)
                      }
                      onRemove={() => removeCustomSection(sectionIndex)}
                      itemLabel="section"
                    />
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  {section.items.length === 0 ? (
                    <p className="border border-dashed border-alabaster-grey/15 px-4 py-7 text-center text-sm text-alabaster-grey/45">
                      This section is hidden publicly until it has an entry.
                    </p>
                  ) : (
                    section.items.map((item, itemIndex) => (
                      <article
                        key={item.id}
                        className="relative grid gap-4 border border-alabaster-grey/15 bg-prussian-blue/20 p-4 lg:grid-cols-[1fr_0.45fr_auto]"
                      >
                        <Field
                          label="Entry title"
                          htmlFor={`entry-title-${item.id}`}
                        >
                          <input
                            id={`entry-title-${item.id}`}
                            required
                            value={item.title}
                            onChange={(event) =>
                              updateCustomSectionItem(sectionIndex, itemIndex, {
                                title: event.target.value,
                              })
                            }
                            placeholder="Certificate or achievement title"
                            className={inputClassName}
                          />
                        </Field>
                        <Field
                          label="Date achieved or taken (optional)"
                          htmlFor={`entry-date-${item.id}`}
                        >
                          <input
                            id={`entry-date-${item.id}`}
                            type="month"
                            value={item.date}
                            onChange={(event) =>
                              updateCustomSectionItem(sectionIndex, itemIndex, {
                                date: event.target.value,
                              })
                            }
                            className={inputClassName}
                          />
                        </Field>
                        <div className="self-end">
                          <ItemActions
                            index={itemIndex}
                            length={section.items.length}
                            onMove={(direction) =>
                              moveCustomSectionItem(
                                sectionIndex,
                                itemIndex,
                                direction,
                              )
                            }
                            onRemove={() =>
                              removeCustomSectionItem(sectionIndex, itemIndex)
                            }
                            itemLabel="entry"
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <Field
                            label="Description"
                            htmlFor={`entry-description-${item.id}`}
                          >
                            <textarea
                              id={`entry-description-${item.id}`}
                              required
                              rows={3}
                              value={item.description}
                              onChange={(event) =>
                                updateCustomSectionItem(sectionIndex, itemIndex, {
                                  description: event.target.value,
                                })
                              }
                              placeholder="What you completed, learned, or achieved."
                              className={inputClassName}
                            />
                          </Field>
                        </div>
                        <div className="lg:col-span-3">
                          <MediaUploadField
                            label="Certificate or achievement image (optional)"
                            folder="certificates"
                            value={item.image_url}
                            alt={item.image_alt || item.title}
                            previewAspect="landscape"
                            previewFit="contain"
                            onChange={(image_url) =>
                              updateCustomSectionItem(sectionIndex, itemIndex, {
                                image_url,
                                image_alt:
                                  image_url && !item.image_alt
                                    ? item.title
                                    : item.image_alt,
                              })
                            }
                          />
                        </div>
                        {item.image_url && (
                          <div className="lg:col-span-3">
                            <Field
                              label="Image description for accessibility"
                              htmlFor={`entry-image-alt-${item.id}`}
                            >
                              <input
                                id={`entry-image-alt-${item.id}`}
                                required
                                value={item.image_alt}
                                onChange={(event) =>
                                  updateCustomSectionItem(
                                    sectionIndex,
                                    itemIndex,
                                    { image_alt: event.target.value },
                                  )
                                }
                                placeholder={`Image of ${item.title}`}
                                className={inputClassName}
                              />
                            </Field>
                          </div>
                        )}
                        <div className="lg:col-span-3">
                          <Field
                            label="Credential or LinkedIn link (optional)"
                            htmlFor={`entry-link-${item.id}`}
                          >
                            <input
                              id={`entry-link-${item.id}`}
                              type="url"
                              value={item.link}
                              onChange={(event) =>
                                updateCustomSectionItem(sectionIndex, itemIndex, {
                                  link: event.target.value,
                                })
                              }
                              placeholder="https://..."
                              className={inputClassName}
                            />
                          </Field>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </EditorSection>

      <EditorSection
        index="05"
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
        index="06"
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
  itemLabel = "item",
}: {
  index: number;
  length: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  itemLabel?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(-1)}
        className="admin-icon-button"
        aria-label={`Move ${itemLabel} up`}
      >
        ↑
      </button>
      <button
        type="button"
        disabled={index === length - 1}
        onClick={() => onMove(1)}
        className="admin-icon-button"
        aria-label={`Move ${itemLabel} down`}
      >
        ↓
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="admin-icon-button hover:border-orange hover:text-orange"
        aria-label={`Remove ${itemLabel}`}
      >
        ×
      </button>
    </div>
  );
}
