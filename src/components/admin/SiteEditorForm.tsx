"use client";

import {
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import MediaUploadField from "@/components/admin/MediaUploadField";
import { saveSiteSettings } from "@/lib/actions/site-settings";
import {
  DEFAULT_THEME,
  THEME_PRESETS,
  themeMatchesPreset,
} from "@/lib/site-settings";
import type {
  ContactContent,
  HomeContent,
  MaintenanceContent,
  ProjectsContent,
  SiteSettingsContent,
  ThemeSettings,
} from "@/lib/supabase/types";

export type SiteEditorModule =
  | "maintenance"
  | "theme"
  | "home"
  | "projects"
  | "about"
  | "contact";

const modules: Array<{ id: SiteEditorModule; label: string; number: string }> = [
  { id: "maintenance", label: "Maintenance", number: "M" },
  { id: "theme", label: "Global theme", number: "00" },
  { id: "home", label: "Home", number: "01" },
  { id: "projects", label: "Projects", number: "02" },
  { id: "about", label: "About", number: "03" },
  { id: "contact", label: "Contact", number: "04" },
];

const inputClassName =
  "w-full border border-alabaster-grey/15 bg-black px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-alabaster-grey/30 focus:border-orange";
const labelClassName =
  "font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/60";

export default function SiteEditorForm({
  initialSettings,
  databaseReady,
  initialModule = "theme",
}: {
  initialSettings: SiteSettingsContent;
  databaseReady: boolean;
  initialModule?: SiteEditorModule;
}) {
  const router = useRouter();
  const [active, setActive] = useState<SiteEditorModule>(initialModule);
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function updateTheme(patch: Partial<ThemeSettings>) {
    setSettings((current) => ({
      ...current,
      theme: { ...current.theme, ...patch },
    }));
  }

  function updateMaintenance(patch: Partial<MaintenanceContent>) {
    setSettings((current) => ({
      ...current,
      maintenance_content: { ...current.maintenance_content, ...patch },
    }));
  }

  function updateHome(patch: Partial<HomeContent>) {
    setSettings((current) => ({
      ...current,
      home_content: { ...current.home_content, ...patch },
    }));
  }

  function updateProjects(patch: Partial<ProjectsContent>) {
    setSettings((current) => ({
      ...current,
      projects_content: { ...current.projects_content, ...patch },
    }));
  }

  function updateContact(patch: Partial<ContactContent>) {
    setSettings((current) => ({
      ...current,
      contact_content: { ...current.contact_content, ...patch },
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setSuccess(false);
    const result = await saveSiteSettings(settings);
    setSaving(false);
    setMessage(result.message);
    setSuccess(result.success);
    if (result.success) router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[230px_1fr]">
      <aside className="self-start border border-alabaster-grey/15 bg-prussian-blue/35 lg:sticky lg:top-6">
        <div className="border-b border-alabaster-grey/15 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-orange">
            Viewer modules
          </p>
          <p className="mt-2 text-xs leading-5 text-alabaster-grey/50">
            Select a section to edit its public content.
          </p>
        </div>
        <nav className="p-2" aria-label="Website editor modules">
          {modules.map((module) => (
            <button
              key={module.id}
              type="button"
              onClick={() => setActive(module.id)}
              className={`flex w-full items-center justify-between border px-3 py-3 text-left text-sm transition-colors ${
                active === module.id
                  ? "border-orange bg-orange text-black"
                  : "border-transparent text-alabaster-grey hover:border-alabaster-grey/15 hover:text-white"
              }`}
            >
              <span>{module.label}</span>
              <span className="font-mono text-[9px]">/{module.number}</span>
            </button>
          ))}
        </nav>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="m-2 mt-0 flex items-center justify-between border border-alabaster-grey/15 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.13em] text-alabaster-grey/60 transition-colors hover:border-orange hover:text-orange"
        >
          Open viewer <span>↗</span>
        </a>
      </aside>

      <div className="min-w-0 space-y-6">
        {!databaseReady && (
          <div className="border border-orange/50 bg-orange/10 p-4 text-sm leading-6 text-alabaster-grey">
            <strong className="text-orange">Database setup required.</strong>{" "}
            Apply the latest Supabase migrations before publishing. Defaults are
            displayed safely in the meantime.
          </div>
        )}

        {active === "maintenance" && (
          <EditorModule
            number="M"
            title="Maintenance mode"
            description="Hide the complete viewer portfolio behind a focused maintenance screen while keeping the admin workspace available."
          >
            <label className="flex cursor-pointer items-center justify-between gap-5 border border-alabaster-grey/15 bg-black p-5">
              <span>
                <span className="block text-base font-bold text-white">
                  Hide the viewer website
                </span>
                <span className="mt-1 block text-sm leading-6 text-alabaster-grey/55">
                  Publish this setting to redirect Home and all project pages to maintenance.
                </span>
              </span>
              <input
                type="checkbox"
                role="switch"
                checked={settings.maintenance_mode}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    maintenance_mode: event.target.checked,
                  }))
                }
                className="size-5 shrink-0 accent-orange"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Small label"
                value={settings.maintenance_content.eyebrow}
                onChange={(eyebrow) => updateMaintenance({ eyebrow })}
              />
              <TextField
                label="Status label"
                value={settings.maintenance_content.status_label}
                onChange={(status_label) => updateMaintenance({ status_label })}
              />
            </div>
            <TextAreaField
              label="Maintenance heading"
              value={settings.maintenance_content.heading}
              onChange={(heading) => updateMaintenance({ heading })}
            />
            <TextAreaField
              label="Visitor message"
              value={settings.maintenance_content.message}
              onChange={(message) => updateMaintenance({ message })}
            />

            <div className="fine-grid border border-orange/30 bg-prussian-blue/45 p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
                {settings.maintenance_content.eyebrow}
              </p>
              <p className="mt-4 max-w-2xl text-3xl font-black tracking-tighter text-white">
                {settings.maintenance_content.heading}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-6 text-alabaster-grey/65">
                {settings.maintenance_content.message}
              </p>
            </div>
          </EditorModule>
        )}

        {active === "theme" && (
          <EditorModule
            number="00"
            title="Global color system"
            description="Choose one of three complete palettes. Every public section, field, border, button, background, and text treatment follows the selected system."
          >
            <fieldset>
              <legend className={labelClassName}>Portfolio theme presets</legend>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {THEME_PRESETS.map((preset) => {
                  const selected = themeMatchesPreset(settings.theme, preset);

                  return (
                    <label
                      key={preset.id}
                      className={`group cursor-pointer border p-4 transition-all ${
                        selected
                          ? "border-orange bg-orange/10 shadow-[inset_0_0_0_1px_var(--orange)]"
                          : "border-alabaster-grey/15 bg-black/45 hover:border-alabaster-grey/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="theme-preset"
                        value={preset.id}
                        checked={selected}
                        onChange={() => updateTheme({ ...preset.colors })}
                        className="sr-only"
                      />
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block text-sm font-bold text-white">
                            {preset.name}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-alabaster-grey/50">
                            {preset.description}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${
                            selected
                              ? "border-orange bg-orange text-black"
                              : "border-alabaster-grey/30"
                          }`}
                        >
                          {selected ? "✓" : ""}
                        </span>
                      </span>
                      <span className="mt-4 grid grid-cols-5 overflow-hidden border border-alabaster-grey/15">
                        {Object.entries(preset.colors).map(([key, color], index) => (
                          <span
                            key={key}
                            className="h-9"
                            style={{ backgroundColor: color }}
                            title={`${preset.labels[index]}: ${color}`}
                          />
                        ))}
                      </span>
                      <span className="mt-3 block font-mono text-[7px] uppercase leading-4 tracking-[0.12em] text-alabaster-grey/45">
                        {preset.labels.join(" / ")}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div
              className="grid min-h-44 gap-4 border border-alabaster-grey/15 p-5 sm:grid-cols-[1fr_auto] sm:items-end"
              style={themePreviewStyle(settings.theme)}
            >
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--orange)]">
                  Live palette preview
                </p>
                <p className="mt-3 max-w-md text-3xl font-black tracking-tighter text-[var(--white)]">
                  Your portfolio, your visual system<span className="text-[var(--orange)]">.</span>
                </p>
                <p className="mt-3 text-sm text-[var(--alabaster-grey)]/70">
                  Changes preview here before you publish them.
                </p>
              </div>
              <div className="flex gap-2">
                {Object.entries(settings.theme).map(([key, color]) => (
                  <span
                    key={key}
                    className="size-8 border border-[var(--alabaster-grey)]/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <ColorField label="Main background" value={settings.theme.black} onChange={(black) => updateTheme({ black })} />
              <ColorField label="Section background" value={settings.theme.prussian_blue} onChange={(prussian_blue) => updateTheme({ prussian_blue })} />
              <ColorField label="Accent" value={settings.theme.orange} onChange={(orange) => updateTheme({ orange })} />
              <ColorField label="Muted text" value={settings.theme.alabaster_grey} onChange={(alabaster_grey) => updateTheme({ alabaster_grey })} />
              <ColorField label="Primary text" value={settings.theme.white} onChange={(white) => updateTheme({ white })} />
            </div>
            <button
              type="button"
              onClick={() => setSettings((current) => ({ ...current, theme: { ...DEFAULT_THEME } }))}
              className="admin-secondary-button"
            >
              Restore original palette
            </button>
          </EditorModule>
        )}

        {active === "home" && (
          <EditorModule number="01" title="Home / hero" description="Manage the first screen, calls to action, moving ticker, and optional feature image.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Availability status" value={settings.home_content.status} onChange={(status) => updateHome({ status })} />
              <TextField label="Eyebrow" value={settings.home_content.eyebrow} onChange={(eyebrow) => updateHome({ eyebrow })} />
              <TextField label="Main title" value={settings.home_content.title} onChange={(title) => updateHome({ title })} />
              <TextField label="Accent title" value={settings.home_content.accent_title} onChange={(accent_title) => updateHome({ accent_title })} />
            </div>
            <TextAreaField label="Introduction" value={settings.home_content.introduction} onChange={(introduction) => updateHome({ introduction })} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Primary button" value={settings.home_content.primary_cta_label} onChange={(primary_cta_label) => updateHome({ primary_cta_label })} />
              <TextField label="Secondary button" value={settings.home_content.secondary_cta_label} onChange={(secondary_cta_label) => updateHome({ secondary_cta_label })} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <ListField label="Metadata — one item per line" value={settings.home_content.meta_items} onChange={(meta_items) => updateHome({ meta_items })} />
              <ListField label="Moving ticker — one item per line" value={settings.home_content.marquee_items} onChange={(marquee_items) => updateHome({ marquee_items })} />
            </div>
            <MediaUploadField label="Hero feature image" folder="home" value={settings.home_content.image_url} alt={settings.home_content.image_alt} onChange={(image_url) => updateHome({ image_url })} />
            <TextField label="Image description for accessibility" value={settings.home_content.image_alt} onChange={(image_alt) => updateHome({ image_alt })} />
          </EditorModule>
        )}

        {active === "projects" && (
          <EditorModule number="02" title="Projects presentation" description="Edit section copy and its optional header image. Individual case studies remain in Manage Projects.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Section label" value={settings.projects_content.eyebrow} onChange={(eyebrow) => updateProjects({ eyebrow })} />
              <TextField label="Homepage heading" value={settings.projects_content.heading} onChange={(heading) => updateProjects({ heading })} />
            </div>
            <TextAreaField label="Homepage introduction" value={settings.projects_content.introduction} onChange={(introduction) => updateProjects({ introduction })} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Archive heading" value={settings.projects_content.archive_heading} onChange={(archive_heading) => updateProjects({ archive_heading })} />
              <TextField label="Empty state title" value={settings.projects_content.empty_title} onChange={(empty_title) => updateProjects({ empty_title })} />
            </div>
            <TextAreaField label="Archive introduction" value={settings.projects_content.archive_introduction} onChange={(archive_introduction) => updateProjects({ archive_introduction })} />
            <TextAreaField label="Empty state message" value={settings.projects_content.empty_message} onChange={(empty_message) => updateProjects({ empty_message })} />
            <MediaUploadField label="Projects header image" folder="projects" value={settings.projects_content.image_url} alt={settings.projects_content.image_alt} onChange={(image_url) => updateProjects({ image_url })} />
            <TextField label="Image description for accessibility" value={settings.projects_content.image_alt} onChange={(image_alt) => updateProjects({ image_alt })} />
            <a href="/admin/projects" className="admin-secondary-button inline-block">Manage individual projects →</a>
          </EditorModule>
        )}

        {active === "about" && (
          <EditorModule
            number="03"
            title="About"
            description="Identity, education, portrait, technology logos, and social links use the adaptable profile editor."
          >
            <div className="fine-grid border border-alabaster-grey/15 bg-black/35 p-6">
              <p className="max-w-2xl text-sm leading-6 text-alabaster-grey/65">
                The About workspace supports repeatable technology and social
                modules, reordering controls, and an optional uploaded portrait.
              </p>
              <a
                href="/admin/about"
                className="admin-secondary-button mt-5 inline-block"
              >
                Open About editor →
              </a>
            </div>
          </EditorModule>
        )}

        {active === "contact" && (
          <EditorModule number="04" title="Contact" description="Control the invitation, response details, form choices, button, and optional contact image.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Section label" value={settings.contact_content.eyebrow} onChange={(eyebrow) => updateContact({ eyebrow })} />
              <TextField label="Main heading" value={settings.contact_content.heading} onChange={(heading) => updateContact({ heading })} />
              <TextField label="Accent heading" value={settings.contact_content.accent_heading} onChange={(accent_heading) => updateContact({ accent_heading })} />
              <TextField label="Contact card label" value={settings.contact_content.direct_label} onChange={(direct_label) => updateContact({ direct_label })} />
            </div>
            <TextAreaField label="Introduction" value={settings.contact_content.introduction} onChange={(introduction) => updateContact({ introduction })} />
            <TextAreaField label="Contact card statement" value={settings.contact_content.direct_title} onChange={(direct_title) => updateContact({ direct_title })} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Timezone" value={settings.contact_content.timezone} onChange={(timezone) => updateContact({ timezone })} />
              <TextField label="Typical response" value={settings.contact_content.response_time} onChange={(response_time) => updateContact({ response_time })} />
              <TextField label="Submit button" value={settings.contact_content.submit_label} onChange={(submit_label) => updateContact({ submit_label })} />
            </div>
            <ListField label="Project types — one item per line" value={settings.contact_content.project_types} onChange={(project_types) => updateContact({ project_types })} />
            <MediaUploadField label="Contact feature image" folder="contact" value={settings.contact_content.image_url} alt={settings.contact_content.image_alt} onChange={(image_url) => updateContact({ image_url })} />
            <TextField label="Image description for accessibility" value={settings.contact_content.image_alt} onChange={(image_alt) => updateContact({ image_alt })} />
          </EditorModule>
        )}

        <div className="sticky bottom-4 z-20 flex flex-col gap-3 border border-alabaster-grey/20 bg-prussian-blue/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className={`text-sm ${success ? "text-white" : "text-orange"}`}>
            {message || "Save once to publish changes across the viewer website."}
          </p>
          <button type="submit" disabled={saving} className="border border-orange bg-orange px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-black transition-colors hover:bg-black hover:text-orange disabled:opacity-60">
            {saving ? "Publishing..." : "Publish website changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

function EditorModule({ number, title, description, children }: { number: string; title: string; description: string; children: ReactNode }) {
  return (
    <section className="border border-alabaster-grey/15 bg-prussian-blue/35">
      <div className="border-b border-alabaster-grey/15 p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-orange">Module / {number}</p>
        <h2 className="mt-1 text-xl font-bold text-white">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-alabaster-grey/55">{description}</p>
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>
      <input required value={value} onChange={(event) => onChange(event.target.value)} className={inputClassName} />
    </label>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>
      <textarea required rows={4} value={value} onChange={(event) => onChange(event.target.value)} className={inputClassName} />
    </label>
  );
}

function ListField({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>
      <textarea
        required
        rows={5}
        value={value.join("\n")}
        onChange={(event) => onChange(event.target.value.split("\n"))}
        className={inputClassName}
      />
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>
      <span className="flex border border-alabaster-grey/15 bg-black p-1 focus-within:border-orange">
        <input type="color" value={value.slice(0, 7)} onChange={(event) => onChange(event.target.value)} className="h-9 w-11 cursor-pointer border-0 bg-transparent" />
        <input required pattern="#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?" value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 font-mono text-xs uppercase text-white outline-none" />
      </span>
    </label>
  );
}

function themePreviewStyle(theme: ThemeSettings) {
  return {
    "--black": theme.black,
    "--prussian-blue": theme.prussian_blue,
    "--orange": theme.orange,
    "--alabaster-grey": theme.alabaster_grey,
    "--white": theme.white,
    backgroundColor: theme.black,
  } as CSSProperties;
}
