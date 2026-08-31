import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/get-site-settings";
import { themeStyle } from "@/lib/theme-style";

export const metadata: Metadata = {
  title: "Maintenance — SHAI",
  description: "SHAI's portfolio is temporarily undergoing maintenance.",
};

export default async function MaintenancePage() {
  const { settings } = await getSiteSettings();

  if (!settings.maintenance_mode) {
    redirect("/");
  }

  const content = settings.maintenance_content;

  return (
    <main
      style={themeStyle(settings.theme)}
      className="relative grid min-h-screen overflow-hidden bg-black px-5 py-10 text-white sm:px-8"
    >
      <div aria-hidden className="surface-grid absolute inset-0 opacity-35" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[min(78vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange/20"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[min(55vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-alabaster-grey/15"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col">
        <header className="flex items-center justify-between border-b border-alabaster-grey/15 pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center border border-orange bg-orange font-mono text-xs font-black text-black">
              SH
            </span>
            <span>
              <span className="block text-sm font-black tracking-[-0.03em]">SHAI</span>
              <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.2em] text-alabaster-grey/40">
                Web + Mobile Developer
              </span>
            </span>
          </div>
          <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-alabaster-grey/50">
            <span className="size-2 animate-pulse rounded-full bg-orange" />
            {content.status_label}
          </span>
        </header>

        <section className="flex flex-1 items-center py-20 sm:py-28">
          <div className="max-w-5xl">
            <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.22em] text-orange">
              <span>System / 503</span>
              <span className="h-px w-12 bg-orange" />
              <span>{content.eyebrow}</span>
            </div>
            <h1 className="mt-8 text-[clamp(3.5rem,9vw,8.5rem)] font-black leading-[0.82] tracking-[-0.075em] text-white">
              {content.heading}
            </h1>
            <p className="mt-8 max-w-2xl border-l border-orange pl-5 text-base leading-7 text-alabaster-grey/65 sm:text-lg sm:leading-8">
              {content.message}
            </p>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-alabaster-grey/15 pt-5 font-mono text-[8px] uppercase tracking-[0.16em] text-alabaster-grey/35 sm:flex-row sm:items-center sm:justify-between">
          <span>SHAI / Portfolio maintenance</span>
          <span>GMT +8 / Philippines</span>
        </footer>
      </div>
    </main>
  );
}
