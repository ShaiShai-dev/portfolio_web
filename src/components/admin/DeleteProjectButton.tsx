"use client";

import { useState, useTransition } from "react";
import { deleteProject } from "@/lib/actions/projects";

export default function DeleteProjectButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (
      !window.confirm(
        `Delete "${title}"? This cannot be undone and will remove it from the public site.`,
      )
    ) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await deleteProject(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-md border border-orange/40 px-3 py-1.5 text-sm font-medium text-orange transition-colors hover:border-orange disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {error && <p className="text-xs text-orange">{error}</p>}
    </div>
  );
}
