"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/supabase/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadImage(file: File) {
  const supabase = createClient();
  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  return data.publicUrl;
}

export default function ProjectForm({
  project,
}: {
  project?: Project;
}) {
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

  async function handleThumbnailChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setThumbnailUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  }

  async function handleScreenshotsChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploadingScreenshots(true);
    setError(null);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setScreenshotUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images.");
    } finally {
      setUploadingScreenshots(false);
      if (screenshotsInputRef.current) screenshotsInputRef.current.value = "";
    }
  }

  function removeScreenshot(url: string) {
    setScreenshotUrls((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const techStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: slug || slugify(title),
      summary,
      description: description || null,
      tech_stack: techStack,
      thumbnail_url: thumbnailUrl,
      screenshot_urls: screenshotUrls,
      live_url: liveUrl || null,
      github_url: githubUrl || null,
      is_published: isPublished,
      sort_order: sortOrder,
    };

    const { error: dbError } =
      isEditing && project
        ? await supabase.from("projects").update(payload).eq("id", project.id)
        : await supabase.from("projects").insert(payload);

    if (dbError) {
      setError(dbError.message);
      setSubmitting(false);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-alabaster-grey">
            Title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-white outline-none focus:border-orange"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className="text-sm font-medium text-alabaster-grey">
            Slug
          </label>
          <input
            id="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-white outline-none focus:border-orange"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="summary" className="text-sm font-medium text-alabaster-grey">
          Summary
        </label>
        <textarea
          id="summary"
          required
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-white outline-none focus:border-orange"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-sm font-medium text-alabaster-grey"
        >
          Description
        </label>
        <p className="text-xs text-alabaster-grey/60">
          Plain text. Blank lines separate paragraphs on the public case-study
          page.
        </p>
        <textarea
          id="description"
          rows={8}
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-white outline-none focus:border-orange"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tech" className="text-sm font-medium text-alabaster-grey">
          Tech stack
        </label>
        <p className="text-xs text-alabaster-grey/60">
          Comma-separated, e.g. React, TypeScript, Supabase
        </p>
        <input
          id="tech"
          value={techStackInput}
          onChange={(e) => setTechStackInput(e.target.value)}
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-white outline-none focus:border-orange"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="live_url" className="text-sm font-medium text-alabaster-grey">
            Live URL
          </label>
          <input
            id="live_url"
            type="url"
            value={liveUrl ?? ""}
            onChange={(e) => setLiveUrl(e.target.value)}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-white outline-none focus:border-orange"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="github_url"
            className="text-sm font-medium text-alabaster-grey"
          >
            GitHub URL
          </label>
          <input
            id="github_url"
            type="url"
            value={githubUrl ?? ""}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-white outline-none focus:border-orange"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-alabaster-grey">
          Thumbnail
        </span>
        <div className="flex items-center gap-4">
          {thumbnailUrl && (
            <div className="relative h-20 w-32 overflow-hidden rounded-md border border-white/10 bg-black/40">
              <Image
                src={thumbnailUrl}
                alt="Thumbnail preview"
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="text-sm text-alabaster-grey"
            />
            {uploadingThumbnail && (
              <span className="text-xs text-alabaster-grey/60">
                Uploading…
              </span>
            )}
            {thumbnailUrl && (
              <button
                type="button"
                onClick={() => setThumbnailUrl(null)}
                className="w-fit text-xs text-orange hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-alabaster-grey">
          Screenshots
        </span>
        <input
          ref={screenshotsInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleScreenshotsChange}
          className="text-sm text-alabaster-grey"
        />
        {uploadingScreenshots && (
          <span className="text-xs text-alabaster-grey/60">Uploading…</span>
        )}
        {screenshotUrls.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-3">
            {screenshotUrls.map((url) => (
              <div key={url} className="relative">
                <div className="relative h-20 w-32 overflow-hidden rounded-md border border-white/10 bg-black/40">
                  <Image
                    src={url}
                    alt="Screenshot preview"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeScreenshot(url)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange text-xs font-bold text-black"
                  aria-label="Remove screenshot"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="sort_order"
            className="text-sm font-medium text-alabaster-grey"
          >
            Sort order
          </label>
          <input
            id="sort_order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-white outline-none focus:border-orange"
          />
        </div>

        <div className="flex items-end gap-2 pb-2">
          <input
            id="is_published"
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 accent-orange"
          />
          <label
            htmlFor="is_published"
            className="text-sm font-medium text-alabaster-grey"
          >
            Published (visible on the public site)
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-orange">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || uploadingThumbnail || uploadingScreenshots}
          className="rounded-md bg-orange px-5 py-2 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting
            ? "Saving…"
            : isEditing
              ? "Save changes"
              : "Create project"}
        </button>
      </div>
    </form>
  );
}
