import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Manage Projects</h1>
          <Link
            href="/admin/projects/new"
            className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            New Project
          </Link>
        </div>

        {error && (
          <p className="mt-6 text-sm text-orange">
            Failed to load projects: {error.message}
          </p>
        )}

        {!error && projects && projects.length === 0 && (
          <p className="mt-6 text-sm text-alabaster-grey/80">
            No projects yet. Create your first one.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-4 rounded-lg border border-white/10 bg-prussian-blue/50 p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-black/40">
                {project.thumbnail_url ? (
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-alabaster-grey/50">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-white">
                    {project.title}
                  </h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      project.is_published
                        ? "bg-orange/20 text-orange"
                        : "bg-prussian-blue text-alabaster-grey"
                    }`}
                  >
                    {project.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-alabaster-grey/70">
                  /{project.slug} · sort {project.sort_order}
                </p>
                {project.tech_stack.length > 0 && (
                  <p className="mt-1 truncate text-xs text-alabaster-grey/60">
                    {project.tech_stack.join(", ")}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="rounded-md border border-white/15 px-3 py-1.5 text-sm font-medium text-alabaster-grey transition-colors hover:border-orange hover:text-orange"
                >
                  Edit
                </Link>
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
