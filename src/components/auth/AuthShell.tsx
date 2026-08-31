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
    <main className="relative flex min-h-screen flex-1 items-center overflow-hidden bg-black px-4 py-8 text-white sm:px-8 sm:py-12">
      <div aria-hidden className="surface-grid absolute inset-0 opacity-25" />
      <div
        aria-hidden
        className="absolute -left-44 -top-44 size-130 rounded-full border border-orange/20"
      />
      <div
        aria-hidden
        className="absolute -bottom-52 -right-36 size-[620px] rounded-full border border-dashed border-alabaster-grey/10"
      />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden border border-alabaster-grey/15 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.45)] lg:grid-cols-[0.82fr_1.18fr]">
        <section className="fine-grid relative flex min-h-72 flex-col justify-between overflow-hidden border-b border-alabaster-grey/15 bg-prussian-blue p-7 sm:p-10 lg:min-h-[680px] lg:border-b-0 lg:border-r lg:p-12">
          <div
            aria-hidden
            className="absolute -bottom-36 -right-36 size-[440px] rounded-full border border-orange/35"
          />
          <div
            aria-hidden
            className="absolute -bottom-16 -right-16 size-[280px] rounded-full border border-dashed border-alabaster-grey/20"
          />

          <Link href="/" className="relative z-10 flex w-fit items-center gap-3">
            <span className="grid size-11 place-items-center border border-orange bg-orange font-mono text-xs font-black text-black transition-transform hover:rotate-6">
              SH
            </span>
            <span>
              <span className="block text-sm font-black text-white">SHAI</span>
              <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.22em] text-alabaster-grey/45">
                Portfolio system
              </span>
            </span>
          </Link>

          <div className="relative z-10 my-12 max-w-md lg:my-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-orange">
              Restricted workspace / Admin
            </p>
            <p className="mt-5 text-4xl font-black leading-[0.9] tracking-[-0.065em] text-white sm:text-5xl lg:text-6xl">
              BUILD. <span className="text-orange">PUBLISH.</span> REFINE.
            </p>
            <p className="mt-6 max-w-sm text-sm leading-7 text-alabaster-grey/60">
              Secure access to the portfolio, project archive, visual system,
              media, and incoming opportunities.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-alabaster-grey/15 pt-5 font-mono text-[8px] uppercase tracking-[0.16em] text-alabaster-grey/40">
            <span>Authenticated access only</span>
            <span className="text-orange">TB / 2026</span>
          </div>
        </section>

        <section className="relative flex items-center px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
          <div aria-hidden className="fine-grid absolute inset-0 opacity-15" />
          <div className="relative mx-auto w-full max-w-lg">
            <div className="border-t border-alabaster-grey/25 pt-6">
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
                <span>Access / 01</span>
                <span className="h-px w-10 bg-orange" />
                <span>{eyebrow}</span>
              </div>
              <h1 className="mt-7 text-5xl font-black leading-[0.86] tracking-[-0.065em] text-white sm:text-6xl">
                {title}
                <span className="mt-1 block text-orange">{accent}</span>
              </h1>
              <p className="mt-6 max-w-md text-sm leading-7 text-alabaster-grey/60">
                {description}
              </p>
            </div>

            <div className="mt-9">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
