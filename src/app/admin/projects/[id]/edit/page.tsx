import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-white">
          Edit Project — {project.title}
        </h1>
        <div className="mt-8">
          <ProjectForm project={project} />
        </div>
      </div>
    </main>
  );
}
