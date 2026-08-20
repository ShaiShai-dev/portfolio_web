"use client";

import { BrandIcon } from "@/components/ui/BrandIcon";
import type { TechStackItem } from "@/lib/supabase/types";

export function TechStackRoll({ items }: { items: TechStackItem[] }) {
  return (
    <div className="group/roll relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-8 sm:py-12">
      <div
        className="tech-roll-track flex w-max group-hover/roll:[animation-play-state:paused]"
        role="list"
        aria-label="Technology stack"
      >
        {[0, 1].map((set) => (
          <div
            key={set}
            className="flex shrink-0 items-center gap-10 px-8 sm:gap-16 sm:px-12 lg:gap-20"
            aria-hidden={set === 1}
          >
            {items.map((item, index) => (
              <div
                key={`${set}-${item.id}-${index}`}
                role={set === 0 ? "listitem" : undefined}
                className="tech-logo-item group/logo relative grid h-28 w-20 shrink-0 place-items-center sm:h-32 sm:w-28"
              >
                <span
                  aria-hidden="true"
                  className="tech-logo-halo absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange opacity-0 blur-2xl transition-opacity duration-300 group-hover/logo:opacity-15"
                />
                <span className="tech-logo-mark relative grid size-20 place-items-center text-alabaster-grey/75 transition-all duration-300 group-hover/logo:-translate-y-2 group-hover/logo:scale-110 group-hover/logo:text-orange sm:size-24">
                  <BrandIcon name={item.icon} className="size-14 sm:size-20" />
                </span>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 text-center font-mono text-[8px] uppercase tracking-[0.16em] text-alabaster-grey/0 transition-all duration-300 group-hover/logo:translate-y-0 group-hover/logo:text-alabaster-grey/55">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-prussian-blue via-prussian-blue/80 to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-prussian-blue via-prussian-blue/80 to-transparent sm:w-40" />
    </div>
  );
}
