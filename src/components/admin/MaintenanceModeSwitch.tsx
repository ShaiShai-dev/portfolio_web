"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setMaintenanceMode } from "@/lib/actions/site-settings";

export default function MaintenanceModeSwitch({
  initialEnabled,
  databaseReady,
}: {
  initialEnabled: boolean;
  databaseReady: boolean;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function toggleMode() {
    const nextEnabled = !enabled;
    setMessage("");

    startTransition(async () => {
      const result = await setMaintenanceMode(nextEnabled);
      setMessage(result.message);
      if (result.success) {
        setEnabled(nextEnabled);
        router.refresh();
      }
    });
  }

  return (
    <section
      className={`relative overflow-hidden border p-5 sm:p-6 ${
        enabled
          ? "border-orange bg-orange/10"
          : "border-alabaster-grey/15 bg-prussian-blue/30"
      }`}
      aria-labelledby="maintenance-control-title"
    >
      <div aria-hidden className="fine-grid absolute inset-0 opacity-25" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`size-2 rounded-full ${
                enabled ? "animate-pulse bg-orange" : "bg-emerald-400"
              }`}
            />
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-alabaster-grey/55">
              Viewer status / {enabled ? "Maintenance" : "Live"}
            </p>
          </div>
          <h2
            id="maintenance-control-title"
            className="mt-3 text-2xl font-black tracking-[-0.04em] text-white"
          >
            {enabled ? "Portfolio hidden from visitors" : "Portfolio is public"}
            <span className="text-orange">.</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-alabaster-grey/60">
            {enabled
              ? "Visitors are seeing only the maintenance screen. Admin and authentication pages remain available."
              : "Turn this on to immediately replace every public portfolio page with the maintenance screen."}
          </p>
          {message && (
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.13em] text-orange" aria-live="polite">
              {message}
            </p>
          )}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle maintenance mode"
          disabled={isPending || !databaseReady}
          onClick={toggleMode}
          className={`group flex min-w-56 shrink-0 items-center justify-between border px-4 py-3 transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
            enabled
              ? "border-orange bg-orange text-black hover:bg-black hover:text-orange"
              : "border-alabaster-grey/25 bg-black text-white hover:border-orange"
          }`}
        >
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.14em]">
            {isPending
              ? "Updating..."
              : enabled
                ? "Disable maintenance"
                : "Enable maintenance"}
          </span>
          <span
            aria-hidden
            className={`relative ml-4 h-6 w-11 border transition-colors ${
              enabled
                ? "border-black/35 bg-black/20 group-hover:border-orange"
                : "border-alabaster-grey/25 bg-prussian-blue"
            }`}
          >
            <span
              className={`absolute top-1 size-3.5 transition-all ${
                enabled ? "left-6 bg-black group-hover:bg-orange" : "left-1 bg-alabaster-grey"
              }`}
            />
          </span>
        </button>
      </div>
    </section>
  );
}
