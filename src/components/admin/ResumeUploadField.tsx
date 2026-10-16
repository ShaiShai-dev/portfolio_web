"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { getResumeDownloadUrl } from "@/lib/resume";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function documentName(url: string) {
  try {
    const path = new URL(url, "https://portfolio.local").pathname;
    return decodeURIComponent(path.split("/").pop() || "resume.pdf");
  } catch {
    return "resume.pdf";
  }
}

export default function ResumeUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploadedName, setUploadedName] = useState("");

  async function upload(file: File) {
    if (!isPdf(file)) throw new Error("Choose a PDF document.");
    if (file.size > MAX_BYTES) {
      throw new Error("The resume must be 5 MB or smaller.");
    }

    setUploading(true);
    setError("");
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Your admin session has expired.");
      }

      const path = `${user.id}/resume/${crypto.randomUUID()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(path, file, {
          cacheControl: "3600",
          contentType: "application/pdf",
          upsert: false,
        });

      if (uploadError) throw new Error(uploadError.message);

      const publicUrl = supabase.storage
        .from("site-media")
        .getPublicUrl(path).data.publicUrl;

      setUploadedName(file.name);
      onChange(publicUrl);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The resume could not be uploaded.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void upload(file);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (uploading) return;
    const file = event.dataTransfer.files?.[0];
    if (file) void upload(file);
  }

  return (
    <div className="relative overflow-hidden border border-alabaster-grey/15 bg-black/45">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full border border-orange/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-4 size-36 rounded-full border border-dashed border-alabaster-grey/10"
      />

      <div className="relative grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <label
          htmlFor="resume-upload"
          onDragEnter={(event) => {
            event.preventDefault();
            if (!uploading) setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setDragging(false);
            }
          }}
          onDrop={handleDrop}
          className={`group relative flex min-h-72 cursor-pointer flex-col items-center justify-center overflow-hidden border-b p-6 text-center transition-colors lg:border-b-0 lg:border-r ${
            dragging
              ? "border-orange bg-orange/12"
              : "border-alabaster-grey/15 bg-prussian-blue/35 hover:bg-prussian-blue/55"
          } ${uploading ? "pointer-events-none" : ""}`}
        >
          <input
            ref={inputRef}
            id="resume-upload"
            type="file"
            accept="application/pdf,.pdf"
            disabled={uploading}
            onChange={handleInput}
            className="sr-only"
          />

          <motion.span
            animate={
              uploading
                ? { rotate: 360, scale: [1, 1.08, 1] }
                : dragging
                  ? { y: -6, scale: 1.08 }
                  : { y: 0, scale: 1 }
            }
            transition={
              uploading
                ? { rotate: { duration: 1.4, repeat: Infinity, ease: "linear" } }
                : { type: "spring", stiffness: 260, damping: 18 }
            }
            className="grid size-20 place-items-center rounded-full border border-orange/50 bg-black text-orange shadow-[0_0_50px_rgba(252,163,17,0.12)]"
          >
            {uploading ? <SpinnerIcon /> : <UploadDocumentIcon />}
          </motion.span>

          <p className="mt-5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-orange">
            {uploading
              ? "Uploading securely"
              : dragging
                ? "Release to upload"
                : "Resume document / PDF"}
          </p>
          <h3 className="mt-2 text-xl font-black text-white">
            {uploading ? "Preparing your new resume..." : "Drop a PDF here"}
          </h3>
          <p className="mt-2 max-w-sm text-xs leading-5 text-alabaster-grey/50">
            Or click anywhere in this panel to choose a file. Maximum size is 5 MB.
          </p>
          <span className="mt-5 border border-orange bg-orange px-5 py-3 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-black transition-transform group-hover:-translate-y-1">
            {uploading ? "Please wait" : value ? "Replace resume" : "Upload resume"}
          </span>
        </label>

        <div className="relative flex min-h-72 flex-col justify-between p-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 shrink-0 place-items-center border border-alabaster-grey/15 bg-prussian-blue/45 text-orange">
                <PdfIcon />
              </span>
              <span className="rounded-full border border-orange/35 bg-orange/10 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-orange">
                Current file
              </span>
            </div>
            <p className="mt-6 break-all text-base font-bold text-white">
              {uploadedName || documentName(value)}
            </p>
            <p className="mt-2 line-clamp-2 break-all font-mono text-[8px] leading-4 uppercase tracking-[0.12em] text-alabaster-grey/35">
              {value}
            </p>

            <AnimatePresence initial={false}>
              {uploadedName && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 border-l-2 border-orange bg-orange/10 px-3 py-2 text-xs leading-5 text-alabaster-grey/70"
                >
                  Upload complete. Save the About section to publish this PDF.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-alabaster-grey/20 px-3 py-3 font-mono text-[9px] font-black uppercase tracking-[0.13em] text-white transition-colors hover:border-orange hover:text-orange"
            >
              <PreviewIcon /> Preview
            </a>
            <a
              href={getResumeDownloadUrl(value)}
              download
              className="flex items-center justify-center gap-2 border border-alabaster-grey/20 px-3 py-3 font-mono text-[9px] font-black uppercase tracking-[0.13em] text-white transition-colors hover:border-orange hover:text-orange"
            >
              <DownloadIcon /> Download
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-orange/30 bg-orange/10 px-5 py-3 text-xs text-orange"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadDocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 3.75h6.5L18 8.25v12H7z" />
      <path d="M13.5 3.75v4.5H18M12.5 17v-5m0 0-2 2m2-2 2 2" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6.5 2.75h7L18.5 8v13.25h-12zM13.5 2.75V8h5" />
      <path d="M8.5 16.5h7M8.5 13.5h4" />
    </svg>
  );
}

function PreviewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2.75 12s3.25-5.25 9.25-5.25S21.25 12 21.25 12 18 17.25 12 17.25 2.75 12 2.75 12Z" />
      <circle cx="12" cy="12" r="2.25" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 20h16" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 12a8 8 0 1 1-5.1-7.46" />
    </svg>
  );
}
