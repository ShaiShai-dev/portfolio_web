import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <main className="flex-1 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-white">New Project</h1>
        <div className="mt-8">
          <ProjectForm />
        </div>
      </div>
    </main>
  );
}
