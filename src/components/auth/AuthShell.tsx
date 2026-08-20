import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-screen flex-1 bg-black lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden border-r border-alabaster-grey/15 bg-prussian-blue lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-20">
        <div aria-hidden className="surface-grid absolute inset-0 opacity-55" />
        <div
          aria-hidden
          className="absolute -bottom-44 -right-40 size-[680px] rounded-full border border-orange/35"
        />
        <div
          aria-hidden
          className="absolute -bottom-16 -right-20 size-[460px] rounded-full border border-dashed border-alabaster-grey/20"
        />
        <div
          aria-hidden
          className="absolute bottom-24 right-24 size-52 rounded-full border border-orange/45 bg-black/30 shadow-[0_0_100px_rgba(252,163,17,0.12)]"
        />

        <Link href="/" className="relative z-10 flex w-fit items-center gap-3">
          <span className="grid size-11 place-items-center border border-orange bg-orange font-mono text-xs font-black text-black">
            SH
          </span>
          <span>
            <span className="block text-sm font-black text-white">SHAI</span>
            <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.22em] text-alabaster-grey/40">
              Portfolio system
            </span>
          </span>
        </Link>

        <div className="relative z-10 max-w-2xl pb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange">
            Restricted workspace / Admin
          </p>
          <h2 className="mt-6 text-[clamp(4rem,7vw,7.5rem)] font-black leading-[0.82] tracking-[-0.075em] text-white">
            BUILD.
            <span className="mt-2 block text-orange">PUBLISH.</span>
            REFINE.
          </h2>
          <p className="mt-8 max-w-md text-sm leading-7 text-alabaster-grey/55">
            One secure workspace for the portfolio, project archive, visual
            system, media, and incoming opportunities.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-alabaster-grey/15 pt-5 font-mono text-[8px] uppercase tracking-[0.16em] text-alabaster-grey/35">
          <span>Authenticated access only</span>
          <span className="text-orange">TB / 2026</span>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16 sm:px-8 lg:px-14">
        <div aria-hidden className="fine-grid absolute inset-0 opacity-20" />
        <div className="relative w-full max-w-lg">
          <Link href="/" className="mb-14 flex w-fit items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center border border-orange bg-orange font-mono text-xs font-black text-black">
              SH
            </span>
            <span className="font-black text-white">SHAI / ADMIN</span>
          </Link>

          <div className="border-t border-alabaster-grey/25 pt-6">
            <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
              <span>Access / 01</span>
              <span className="h-px w-10 bg-orange" />
              <span>{eyebrow}</span>
            </div>
            <h1 className="mt-7 text-5xl font-black leading-[0.88] tracking-[-0.065em] text-white sm:text-6xl">
              {title}
              <span className="mt-1 block text-orange">{accent}</span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-alabaster-grey/55">
              {description}
            </p>
          </div>

          <div className="mt-10">{children}</div>
        </div>
      </section>
    </main>
  );
}
