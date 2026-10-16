import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <main className="relative flex-1 overflow-hidden px-5 py-12 sm:px-6 sm:py-16">
      <div
        aria-hidden
        className="surface-grid pointer-events-none absolute inset-0 opacity-25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 size-[520px] rounded-full border border-orange/15"
      />
      <div className="relative mx-auto max-w-6xl">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/50 transition-colors hover:text-orange"
        >
          <span aria-hidden>&larr;</span> Project archive
        </Link>

        <div className="mt-7 border-t border-alabaster-grey/20 pt-6 sm:flex sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
              Project workspace / New entry
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Build a case study<span className="text-orange">.</span>
            </h1>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-alabaster-grey/50 sm:mt-0">
            Shape the story, upload project media, and control exactly when it
            becomes public.
          </p>
        </div>

        <div className="mt-10">
          <ProjectForm />
        </div>
      </div>
    </main>
  );
}
