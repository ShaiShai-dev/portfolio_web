"use client";

import {
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  fromProjectMonthInput,
  toProjectMonthInput,
} from "@/lib/project-date";
import type { Project } from "@/lib/supabase/types";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const inputClassName =
  "w-full border border-alabaster-grey/15 bg-black/75 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-alabaster-grey/25 hover:border-alabaster-grey/30 focus:border-orange focus:shadow-[0_0_0_3px_rgba(252,163,17,0.08)]";

const labelClassName =
  "font-mono text-[9px] uppercase tracking-[0.17em] text-alabaster-grey/55";

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function validateImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not a supported image file.`);
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`${file.name} is larger than the 10 MB upload limit.`);
  }
}

async function uploadImage(file: File) {
  validateImage(file);

  const supabase = createClient();
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const path = `${crypto.randomUUID()}-${safeName || "project-image"}`;
  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  return data.publicUrl;
}

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const isEditing = Boolean(project);

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [techStackInput, setTechStackInput] = useState(
    project?.tech_stack.join(", ") ?? "",
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    project?.thumbnail_url ?? null,
  );
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>(
    project?.screenshot_urls ?? [],
  );
  const [galleryStyle, setGalleryStyle] = useState<"stack" | "floating">(
    project?.gallery_style === "floating" ? "floating" : "stack",
  );
  const [developmentStart, setDevelopmentStart] = useState(
    toProjectMonthInput(project?.development_start),
  );
  const [developmentEnd, setDevelopmentEnd] = useState(
    toProjectMonthInput(project?.development_end),
  );
  const [liveUrl, setLiveUrl] = useState(project?.live_url ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [isPublished, setIsPublished] = useState(
    project?.is_published ?? false,
  );
  const [sortOrder, setSortOrder] = useState(project?.sort_order ?? 0);

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const screenshotsInputRef = useRef<HTMLInputElement>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleThumbnailFiles(files: File[]) {
    const file = files[0];
    if (!file) return;

    setUploadingThumbnail(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setThumbnailUrl(url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload image.",
      );
    } finally {
      setUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  }

  async function handleScreenshotFiles(files: File[]) {
    if (files.length === 0) return;

    setUploadingScreenshots(true);
    setError(null);
    try {
      files.forEach(validateImage);
      const urls = await Promise.all(files.map(uploadImage));
      setScreenshotUrls((current) => [...current, ...urls]);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload images.",
      );
    } finally {
      setUploadingScreenshots(false);
      if (screenshotsInputRef.current) screenshotsInputRef.current.value = "";
    }
  }

  function removeScreenshot(url: string) {
    setScreenshotUrls((current) => current.filter((item) => item !== url));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (
      developmentStart &&
      developmentEnd &&
      developmentEnd < developmentStart
    ) {
      setError("Development end must be the same month as or later than the start.");
      return;
    }

    setSubmitting(true);

    const supabase = createClient();
    const techStack = techStackInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: slug || slugify(title),
      summary,
      description: description || null,
      tech_stack: techStack,
      thumbnail_url: thumbnailUrl,
      screenshot_urls: screenshotUrls,
      gallery_style: galleryStyle,
      development_start: fromProjectMonthInput(developmentStart),
      development_end: fromProjectMonthInput(developmentEnd),
      live_url: liveUrl || null,
      github_url: githubUrl || null,
      is_published: isPublished,
      sort_order: sortOrder,
    };

    const { error: databaseError } =
      isEditing && project
        ? await supabase.from("projects").update(payload).eq("id", project.id)
        : await supabase.from("projects").insert(payload);

    if (databaseError) {
      setError(databaseError.message);
      setSubmitting(false);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  }

  const busy = submitting || uploadingThumbnail || uploadingScreenshots;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.06 }}
      className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]"
    >
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-orange/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-80 size-80 rounded-full bg-prussian-blue/45 blur-3xl" />

      <div className="relative min-w-0 space-y-6">
        <FormSection
          number="01"
          icon={<EditIcon />}
          title="Project identity"
          description="Give the project a clear title, URL slug, and concise gallery introduction."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Project title" htmlFor="title">
              <input
                id="title"
                required
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Project name"
                className={inputClassName}
              />
            </Field>

            <Field label="URL slug" htmlFor="slug">
              <div className="flex border border-alabaster-grey/15 bg-black/75 transition-all hover:border-alabaster-grey/30 focus-within:border-orange focus-within:shadow-[0_0_0_3px_rgba(252,163,17,0.08)]">
                <span className="grid place-items-center border-r border-alabaster-grey/15 px-3 font-mono text-[10px] text-orange">
                  /
                </span>
                <input
                  id="slug"
                  required
                  value={slug}
                  onChange={(event) => {
                    setSlug(slugify(event.target.value));
                    setSlugTouched(true);
                  }}
                  placeholder="project-name"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-alabaster-grey/25"
                />
              </div>
            </Field>
          </div>

          <Field label="Gallery summary" htmlFor="summary">
            <textarea
              id="summary"
              required
              rows={3}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="A short, compelling description for the project card."
              className={inputClassName}
            />
          </Field>
        </FormSection>

        <FormSection
          number="02"
          icon={<StoryIcon />}
          title="Story and technology"
          description="Describe the product and list the tools or disciplines behind it."
        >
          <Field label="Case-study description" htmlFor="description">
            <textarea
              id="description"
              rows={9}
              value={description ?? ""}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explain the challenge, process, and outcome. Blank lines create separate paragraphs."
              className={inputClassName}
            />
          </Field>

          <Field label="Technology stack" htmlFor="tech">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange">
                <CodeIcon />
              </span>
              <input
                id="tech"
                value={techStackInput}
                onChange={(event) => setTechStackInput(event.target.value)}
                placeholder="React, TypeScript, Supabase"
                className={`${inputClassName} pl-12`}
              />
            </div>
            <p className="mt-2 text-xs text-alabaster-grey/40">
              Separate each technology with a comma.
            </p>
          </Field>

          <div className="border-t border-alabaster-grey/15 pt-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className={labelClassName}>Development timeline</p>
                <p className="mt-2 text-xs leading-5 text-alabaster-grey/40">
                  Optional month and year. Add either date or both.
                </p>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-orange">
                Optional
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Development started" htmlFor="development_start">
                <input
                  id="development_start"
                  type="month"
                  value={developmentStart}
                  max={developmentEnd || undefined}
                  onChange={(event) => setDevelopmentStart(event.target.value)}
                  className={inputClassName}
                />
              </Field>
              <Field label="Development ended" htmlFor="development_end">
                <input
                  id="development_end"
                  type="month"
                  value={developmentEnd}
                  min={developmentStart || undefined}
                  onChange={(event) => setDevelopmentEnd(event.target.value)}
                  className={inputClassName}
                />
              </Field>
            </div>
          </div>
        </FormSection>

        <FormSection
          number="03"
          icon={<MediaIcon />}
          title="Project media"
          description="Upload a gallery cover and supporting interface screenshots, then choose how the gallery moves."
        >
          <fieldset>
            <legend className={labelClassName}>Screenshot gallery animation</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    value: "stack",
                    label: "Stack view",
                    description: "Overlapping frames with the selected image in front.",
                  },
                  {
                    value: "floating",
                    label: "Floating gallery",
                    description: "Airier frames with gentle independent movement.",
                  },
                ] as const
              ).map((option) => {
                const selected = galleryStyle === option.value;

                return (
                  <label
                    key={option.value}
                    className={`group cursor-pointer border p-4 transition-all ${
                      selected
                        ? "border-orange bg-orange/10 shadow-[0_0_0_2px_rgba(252,163,17,0.08)]"
                        : "border-alabaster-grey/15 bg-black/45 hover:border-alabaster-grey/35"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gallery_style"
                      value={option.value}
                      checked={selected}
                      onChange={() => setGalleryStyle(option.value)}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-between gap-4">
                      <span>
                        <span className="block text-sm font-black text-white">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-alabaster-grey/45">
                          {option.description}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={`grid size-8 shrink-0 place-items-center rounded-full border font-mono text-[10px] ${
                          selected
                            ? "border-orange bg-orange text-black"
                            : "border-alabaster-grey/20 text-alabaster-grey/35"
                        }`}
                      >
                        {selected ? "✓" : "○"}
                      </span>
                    </span>
                    <span className="relative mt-4 block h-16 overflow-hidden border border-alabaster-grey/10 bg-prussian-blue/60">
                      {[0, 1, 2].map((previewIndex) => (
                        <span
                          key={previewIndex}
                          className="absolute left-1/2 top-1/2 h-9 w-14 border border-orange/45 bg-black/80"
                          style={{
                            transform: `translate(calc(-50% + ${(previewIndex - 1) * (option.value === "stack" ? 24 : 36)}px), calc(-50% + ${(previewIndex % 2) * (option.value === "stack" ? 4 : 10)}px)) rotate(${(previewIndex - 1) * (option.value === "stack" ? 5 : 2)}deg)`,
                            zIndex: previewIndex === 1 ? 3 : 2,
                          }}
                        />
                      ))}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-5 lg:grid-cols-2">
            <UploadDropzone
              id="thumbnail-upload"
              label="Cover image"
              description="One image used across project cards."
              icon={<ImageIcon />}
              uploading={uploadingThumbnail}
              inputRef={thumbnailInputRef}
              onFiles={handleThumbnailFiles}
            />
            <UploadDropzone
              id="screenshots-upload"
              label="Screenshot gallery"
              description="Select or drop several interface images."
              icon={<GalleryIcon />}
              multiple
              uploading={uploadingScreenshots}
              inputRef={screenshotsInputRef}
              onFiles={handleScreenshotFiles}
            />
          </div>

          <AnimatePresence mode="popLayout">
            {thumbnailUrl && (
              <motion.div
                key="thumbnail-preview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="overflow-hidden border border-alabaster-grey/15 bg-black/60"
              >
                <div className="flex items-center justify-between border-b border-alabaster-grey/15 px-4 py-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/55">
                    Active cover
                  </span>
                  <IconButton
                    label="Remove cover image"
                    onClick={() => setThumbnailUrl(null)}
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
                <div className="relative aspect-[16/7] min-h-48">
                  <Image
                    src={thumbnailUrl}
                    alt="Project cover preview"
                    fill
                    sizes="(min-width: 1280px) 800px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 border border-orange bg-black/85 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-orange">
                    Gallery cover / Ready
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {screenshotUrls.length > 0 && (
              <motion.div
                key="screenshot-gallery"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className={labelClassName}>Uploaded screenshots</span>
                  <span className="font-mono text-[9px] text-orange">
                    {String(screenshotUrls.length).padStart(2, "0")} files
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {screenshotUrls.map((url, index) => (
                    <motion.div
                      layout
                      key={url}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      className="group relative aspect-video overflow-hidden border border-alabaster-grey/15 bg-black"
                    >
                      <Image
                        src={url}
                        alt={`Project screenshot ${index + 1}`}
                        fill
                        sizes="(min-width: 768px) 30vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/35" />
                      <span className="absolute bottom-2 left-2 bg-black/85 px-2 py-1 font-mono text-[8px] text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeScreenshot(url)}
                        className="absolute right-2 top-2 grid size-9 translate-y-1 place-items-center border border-orange bg-black/90 text-orange opacity-0 transition-all hover:bg-orange hover:text-black focus:translate-y-0 focus:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
                        aria-label={`Remove screenshot ${index + 1}`}
                      >
                        <TrashIcon />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </FormSection>

        <FormSection
          number="04"
          icon={<LinkIcon />}
          title="Project destinations"
          description="Connect visitors to the live product and its source repository."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Live project URL" htmlFor="live_url">
              <UrlField
                id="live_url"
                value={liveUrl}
                placeholder="https://your-project.com"
                onChange={setLiveUrl}
                icon={<GlobeIcon />}
              />
            </Field>
            <Field label="GitHub URL" htmlFor="github_url">
              <UrlField
                id="github_url"
                value={githubUrl}
                placeholder="https://github.com/..."
                onChange={setGithubUrl}
                icon={<GitHubIcon />}
              />
            </Field>
          </div>
        </FormSection>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              role="alert"
              className="flex items-start gap-3 border border-orange/50 bg-orange/10 p-4 text-sm text-alabaster-grey"
            >
              <span className="mt-0.5 text-orange">
                <AlertIcon />
              </span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.aside
        variants={sectionMotion}
        transition={{ duration: 0.45 }}
        className="relative self-start border border-alabaster-grey/15 bg-prussian-blue/35 xl:sticky xl:top-6"
      >
        <div className="fine-grid border-b border-alabaster-grey/15 p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-orange">
              Publish control
            </span>
            <motion.span
              animate={{
                boxShadow: isPublished
                  ? "0 0 0 6px rgba(252,163,17,0.08)"
                  : "0 0 0 0 rgba(252,163,17,0)",
              }}
              className={`size-2 rounded-full ${
                isPublished ? "bg-orange" : "bg-alabaster-grey/25"
              }`}
            />
          </div>
          <h2 className="mt-3 text-xl font-black text-white">
            {isPublished ? "Ready for viewers" : "Saved as a draft"}
          </h2>
          <p className="mt-2 text-xs leading-5 text-alabaster-grey/50">
            Control visibility and placement before saving the project.
          </p>
        </div>

        <div className="space-y-5 p-5">
          <label className="flex cursor-pointer items-center justify-between gap-4 border border-alabaster-grey/15 bg-black/55 p-4 transition-colors hover:border-orange/50">
            <span>
              <span className="block text-sm font-bold text-white">
                Public project
              </span>
              <span className="mt-1 block text-xs text-alabaster-grey/45">
                Show in the viewer gallery
              </span>
            </span>
            <span
              className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors ${
                isPublished
                  ? "border-orange bg-orange"
                  : "border-alabaster-grey/20 bg-black"
              }`}
            >
              <input
                id="is_published"
                type="checkbox"
                checked={isPublished}
                onChange={(event) => setIsPublished(event.target.checked)}
                className="peer sr-only"
              />
              <span
                className={`absolute top-1 size-4 rounded-full transition-all ${
                  isPublished
                    ? "left-7 bg-black"
                    : "left-1 bg-alabaster-grey/45"
                }`}
              />
            </span>
          </label>

          <Field label="Gallery position" htmlFor="sort_order">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange">
                <OrderIcon />
              </span>
              <input
                id="sort_order"
                type="number"
                value={sortOrder}
                onChange={(event) => setSortOrder(Number(event.target.value))}
                className={`${inputClassName} pl-12`}
              />
            </div>
          </Field>

          <div className="border-t border-alabaster-grey/15 pt-5">
            <p className={labelClassName}>Project readiness</p>
            <div className="mt-3 space-y-2">
              <ReadinessItem ready={Boolean(title)} label="Project title" />
              <ReadinessItem ready={Boolean(summary)} label="Gallery summary" />
              <ReadinessItem ready={Boolean(thumbnailUrl)} label="Cover image" optional />
              <ReadinessItem
                ready={screenshotUrls.length > 0}
                label="Screenshot gallery"
                optional
              />
              <ReadinessItem
                ready={Boolean(developmentStart || developmentEnd)}
                label="Development timeline"
                optional
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="group flex w-full items-center justify-between border border-orange bg-orange px-5 py-4 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-black transition-all hover:bg-black hover:text-orange disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>
              {submitting
                ? "Saving project..."
                : isEditing
                  ? "Save changes"
                  : "Create project"}
            </span>
            <span className="transition-transform group-hover:translate-x-1">
              {busy ? <SpinnerIcon /> : <ArrowIcon />}
            </span>
          </button>

          {(uploadingThumbnail || uploadingScreenshots) && (
            <p className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-orange">
              <SpinnerIcon /> Media upload in progress
            </p>
          )}
        </div>
      </motion.aside>
    </motion.form>
  );
}

function FormSection({
  number,
  icon,
  title,
  description,
  children,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      variants={sectionMotion}
      transition={{ duration: 0.45 }}
      className="overflow-hidden border border-alabaster-grey/15 bg-prussian-blue/25 shadow-[0_18px_80px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-start gap-4 border-b border-alabaster-grey/15 bg-black/35 p-5 sm:p-6">
        <span className="grid size-11 shrink-0 place-items-center border border-orange/50 bg-orange/5 text-orange">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-orange">
            Module / {number}
          </p>
          <h2 className="mt-1 text-xl font-black text-white">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-alabaster-grey/50">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </motion.section>
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
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={htmlFor} className={labelClassName}>
        {label}
      </label>
      {children}
    </div>
  );
}

function UploadDropzone({
  id,
  label,
  description,
  icon,
  multiple = false,
  uploading,
  inputRef,
  onFiles,
}: {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
  multiple?: boolean;
  uploading: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onFiles: (files: File[]) => void;
}) {
  const [dragging, setDragging] = useState(false);

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (!uploading) {
      void onFiles(Array.from(event.dataTransfer.files));
    }
  }

  return (
    <label
      htmlFor={id}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`group relative flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed p-6 text-center transition-all ${
        dragging
          ? "scale-[1.01] border-orange bg-orange/10"
          : "border-alabaster-grey/25 bg-black/45 hover:border-orange hover:bg-orange/5"
      }`}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        disabled={uploading}
        onChange={(event) =>
          void onFiles(Array.from(event.target.files ?? []))
        }
        className="sr-only"
      />

      <div
        aria-hidden
        className="absolute -right-12 -top-12 size-36 rounded-full border border-orange/15 transition-transform duration-700 group-hover:scale-125"
      />
      <div
        aria-hidden
        className="absolute -bottom-16 -left-16 size-40 rounded-full border border-dashed border-alabaster-grey/10 transition-transform duration-700 group-hover:-rotate-12"
      />

      <motion.span
        animate={uploading ? { rotate: 360 } : { rotate: 0 }}
        transition={
          uploading
            ? { duration: 1.2, repeat: Infinity, ease: "linear" }
            : { duration: 0.25 }
        }
        className="relative grid size-16 place-items-center rounded-full border border-orange/50 bg-prussian-blue text-orange shadow-[0_0_32px_rgba(252,163,17,0.1)] transition-transform group-hover:-translate-y-1 group-hover:scale-105"
      >
        {uploading ? <SpinnerIcon /> : icon}
      </motion.span>
      <span className="relative mt-5 text-sm font-bold text-white">
        {uploading ? "Uploading securely..." : label}
      </span>
      <span className="relative mt-1 max-w-56 text-xs leading-5 text-alabaster-grey/45">
        {uploading ? "Keep this page open while the media is stored." : description}
      </span>
      <span className="relative mt-4 border border-alabaster-grey/15 bg-black px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-orange transition-colors group-hover:border-orange">
        {dragging ? "Release to upload" : "Choose or drop image"}
      </span>
      <span className="relative mt-3 font-mono text-[7px] uppercase tracking-[0.12em] text-alabaster-grey/30">
        JPG / PNG / WEBP / GIF — maximum 10 MB
      </span>
    </label>
  );
}

function UrlField({
  id,
  value,
  placeholder,
  icon,
  onChange,
}: {
  id: string;
  value: string;
  placeholder: string;
  icon: ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange">
        {icon}
      </span>
      <input
        id={id}
        type="url"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClassName} pl-12`}
      />
    </div>
  );
}

function ReadinessItem({
  ready,
  label,
  optional = false,
}: {
  ready: boolean;
  label: string;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-alabaster-grey/55">{label}</span>
      <span
        className={`flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] ${
          ready ? "text-orange" : "text-alabaster-grey/30"
        }`}
      >
        <span
          className={`size-1.5 rounded-full ${
            ready ? "bg-orange" : "bg-alabaster-grey/20"
          }`}
        />
        {ready ? "Ready" : optional ? "Optional" : "Needed"}
      </span>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid size-9 place-items-center border border-alabaster-grey/15 text-alabaster-grey/55 transition-colors hover:border-orange hover:bg-orange hover:text-black"
      aria-label={label}
    >
      {children}
    </button>
  );
}

type IconProps = { className?: string };

function SvgIcon({
  children,
  className = "size-5",
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function EditIcon() {
  return (
    <SvgIcon>
      <path d="M4 20h4l11-11-4-4L4 16zM13.5 6.5l4 4M4 20l4-1" />
    </SvgIcon>
  );
}

function StoryIcon() {
  return (
    <SvgIcon>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
    </SvgIcon>
  );
}

function MediaIcon() {
  return (
    <SvgIcon>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m4 17 5-5 4 4 2-2 5 5" />
    </SvgIcon>
  );
}

function ImageIcon() {
  return (
    <SvgIcon className="size-7">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m4 17 5-5 4 4 2-2 5 5" />
    </SvgIcon>
  );
}

function GalleryIcon() {
  return (
    <SvgIcon className="size-7">
      <rect x="6" y="6" width="15" height="14" rx="2" />
      <path d="M3 16V5a2 2 0 0 1 2-2h12" />
      <path d="m8 17 4-4 3 3 2-2 3 3" />
    </SvgIcon>
  );
}

function CodeIcon() {
  return (
    <SvgIcon>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
    </SvgIcon>
  );
}

function LinkIcon() {
  return (
    <SvgIcon>
      <path d="m10 13 4-4M8 15l-1.5 1.5a3.2 3.2 0 0 1-4.5-4.5L6 8a3.2 3.2 0 0 1 4.5 0M16 9l1.5-1.5A3.2 3.2 0 0 1 22 12l-4 4a3.2 3.2 0 0 1-4.5 0" />
    </SvgIcon>
  );
}

function GlobeIcon() {
  return (
    <SvgIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z" />
    </SvgIcon>
  );
}

function GitHubIcon() {
  return (
    <SvgIcon>
      <path d="M9 19c-4.5 1.5-4.5-2.5-6-3m12 6v-3.9c0-1.1.1-1.6-.5-2.2 2.8-.3 5.7-1.4 5.7-6.2A4.8 4.8 0 0 0 19 6.4 4.5 4.5 0 0 0 18.9 3S17.9 2.7 15 4.2a12 12 0 0 0-6 0C6.1 2.7 5.1 3 5.1 3A4.5 4.5 0 0 0 5 6.4a4.8 4.8 0 0 0-1.2 3.3c0 4.8 2.9 5.9 5.7 6.2-.6.6-.6 1.2-.5 2.2V22" />
    </SvgIcon>
  );
}

function OrderIcon() {
  return (
    <SvgIcon>
      <path d="M8 6h12M8 12h9M8 18h6M3.5 5v14M2 7l1.5-1.5L5 7M2 17l1.5 1.5L5 17" />
    </SvgIcon>
  );
}

function TrashIcon() {
  return (
    <SvgIcon className="size-4">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </SvgIcon>
  );
}

function AlertIcon() {
  return (
    <SvgIcon>
      <path d="M12 3 2.8 20h18.4zM12 9v4M12 17h.01" />
    </SvgIcon>
  );
}

function ArrowIcon() {
  return (
    <SvgIcon className="size-4">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </SvgIcon>
  );
}

function SpinnerIcon() {
  return (
    <SvgIcon className="size-4 animate-spin">
      <path d="M20 12a8 8 0 1 1-2.3-5.7" />
    </SvgIcon>
  );
}
