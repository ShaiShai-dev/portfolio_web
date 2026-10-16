"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;

export default function MediaUploadField({
  label,
  folder,
  value,
  alt,
  onChange,
  previewAspect = "landscape",
  previewFit = "cover",
  previewPosition = "center",
}: {
  label: string;
  folder: "home" | "about" | "projects" | "contact";
  value: string | null;
  alt: string;
  onChange: (url: string | null) => void;
  previewAspect?: "portrait" | "square" | "landscape";
  previewFit?: "cover" | "contain";
  previewPosition?: "center" | "top" | "bottom" | "left" | "right";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const aspectClass = {
    portrait: "aspect-[4/5] sm:w-36",
    square: "aspect-square sm:w-40",
    landscape: "aspect-[16/9] sm:w-48",
  }[previewAspect];
  const fitClass = previewFit === "contain" ? "object-contain" : "object-cover";
  const positionClass = {
    center: "object-center",
    top: "object-top",
    bottom: "object-bottom",
    left: "object-left",
    right: "object-right",
  }[previewPosition];

  async function upload(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error("Use a JPG, PNG, WebP, or GIF image.");
    }
    if (file.size > MAX_BYTES) {
      throw new Error("Images must be 5 MB or smaller.");
    }

    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Your admin session has expired.");

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${folder}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("site-media")
      .upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });
    if (uploadError) throw new Error(uploadError.message);

    return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      onChange(await upload(file));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="border border-alabaster-grey/15 bg-black/35 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className={`relative grid w-full shrink-0 place-items-center overflow-hidden border border-alabaster-grey/15 bg-prussian-blue/40 ${aspectClass}`}>
          {value ? (
            <Image
              src={value}
              alt={alt || `${label} preview`}
              fill
              sizes="192px"
              className={`${fitClass} ${positionClass}`}
            />
          ) : (
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/35">
              No image
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="mt-1 text-xs leading-5 text-alabaster-grey/50">
            JPG, PNG, WebP, or GIF · maximum 5 MB
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="admin-secondary-button cursor-pointer">
              {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                disabled={uploading}
                onChange={handleChange}
                className="sr-only"
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="admin-secondary-button"
              >
                Hide image
              </button>
            )}
          </div>
          {error && <p className="mt-2 text-xs text-orange">{error}</p>}
        </div>
      </div>
    </div>
  );
}
