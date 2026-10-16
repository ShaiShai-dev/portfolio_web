"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { ProfileSection } from "@/lib/supabase/types";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatMonthYear(value: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;

  return `${MONTH_NAMES[Number(match[2]) - 1]} ${match[1]}`;
}

function getRelativeIndex(index: number, activeIndex: number, length: number) {
  let relativeIndex = index - activeIndex;
  const midpoint = length / 2;

  if (relativeIndex > midpoint) relativeIndex -= length;
  if (relativeIndex < -midpoint) relativeIndex += length;

  return relativeIndex;
}

export function ProfileSectionGallery({ section }: { section: ProfileSection }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const itemCount = section.items.length;
  const safeActiveIndex = itemCount > 0 ? activeIndex % itemCount : 0;
  const activeItem = section.items[safeActiveIndex];
  const isFloating = section.display_style === "floating";

  function move(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + itemCount) % itemCount);
  }

  if (!activeItem) return null;

  return (
    <div className="overflow-hidden border border-alabaster-grey/20 bg-black/25">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-alabaster-grey/15 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-alabaster-grey/50">
          <span className="size-1.5 rounded-full bg-orange" />
          <span>{isFloating ? "Floating gallery" : "Stack view"}</span>
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-orange">
          {String(safeActiveIndex + 1).padStart(2, "0")} / {String(itemCount).padStart(2, "0")}
        </span>
      </div>

      <div className="fine-grid relative h-[310px] overflow-hidden border-b border-alabaster-grey/15 sm:h-[390px]">
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-alabaster-grey/10" />
        <div aria-hidden className="absolute left-1/2 top-8 h-[calc(100%-4rem)] w-px bg-alabaster-grey/10" />

        {section.items.map((item, itemIndex) => {
          const relativeIndex = getRelativeIndex(
            itemIndex,
            safeActiveIndex,
            itemCount,
          );
          const distance = Math.abs(relativeIndex);
          const isActive = relativeIndex === 0;
          const isVisible = distance <= (isFloating ? 3 : 2);
          const horizontalStep = isFloating ? 190 : 138;
          const verticalOffset = isFloating
            ? relativeIndex % 2 === 0
              ? 20
              : -22
            : distance * 13;

          return (
            <motion.button
              key={item.id}
              type="button"
              initial={false}
              animate={{
                x: `calc(-50% + ${relativeIndex * horizontalStep}px)`,
                y: `calc(-50% + ${verticalOffset}px)`,
                scale: isActive ? 1 : isFloating ? 0.72 : 0.82,
                rotate: reduceMotion
                  ? 0
                  : relativeIndex * (isFloating ? 2.2 : -3.5),
                opacity: isVisible ? (isActive ? 1 : 0.62) : 0,
                zIndex: 20 - distance,
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 190, damping: 24, mass: 0.8 }
              }
              onClick={() => setActiveIndex(itemIndex)}
              aria-label={`Show details for ${item.title}`}
              aria-pressed={isActive}
              className="absolute left-1/2 top-1/2 aspect-[4/3] w-[min(68vw,350px)] overflow-hidden rounded-[1.25rem] border border-alabaster-grey/30 bg-prussian-blue text-left shadow-[0_24px_60px_rgba(0,0,0,0.55)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
              style={{ pointerEvents: isVisible ? "auto" : "none" }}
            >
              <motion.span
                className="absolute inset-0 block"
                initial={false}
                animate={
                  isFloating && !reduceMotion
                    ? { y: [0, -8, 0] }
                    : { y: 0 }
                }
                transition={{
                  duration: 3.5 + itemIndex * 0.2,
                  repeat: isFloating && !reduceMotion ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                {item.image_url ? (
                  <>
                    <Image
                      src={item.image_url}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 350px, 68vw"
                      className="scale-110 object-cover opacity-25 blur-xl"
                    />
                    <Image
                      src={item.image_url}
                      alt={item.image_alt || item.title}
                      fill
                      sizes="(min-width: 768px) 350px, 68vw"
                      className="object-contain p-2"
                    />
                  </>
                ) : (
                  <span className="surface-grid absolute inset-0 grid place-items-center p-8 text-center">
                    <span className="text-3xl font-black tracking-[-0.045em] text-white">
                      {item.title}
                    </span>
                  </span>
                )}

                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black via-black/75 to-transparent px-4 pb-4 pt-14">
                  <span className="line-clamp-2 text-sm font-black leading-tight text-white">
                    {item.title}
                  </span>
                  <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.16em] text-orange">
                    {isActive ? "Selected" : `/${String(itemIndex + 1).padStart(2, "0")}`}
                  </span>
                </span>
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-2 border-b border-alabaster-grey/15 p-4 lg:border-b-0 lg:border-r sm:p-5">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={itemCount < 2}
            aria-label={`Show previous ${section.title} item`}
            className="grid size-11 place-items-center rounded-full border border-alabaster-grey/30 font-mono text-sm text-white transition-colors hover:border-orange hover:bg-orange hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={itemCount < 2}
            aria-label={`Show next ${section.title} item`}
            className="grid size-11 place-items-center rounded-full border border-alabaster-grey/30 font-mono text-sm text-white transition-colors hover:border-orange hover:bg-orange hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            &rarr;
          </button>
        </div>

        <div className="min-h-64 p-5 sm:p-7" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={activeItem.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.24 }}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[8px] uppercase tracking-[0.17em]">
                <span className="text-orange">Photo record / {String(safeActiveIndex + 1).padStart(2, "0")}</span>
                {activeItem.date && (
                  <time dateTime={activeItem.date} className="text-alabaster-grey/45">
                    {formatMonthYear(activeItem.date)}
                  </time>
                )}
              </div>
              <h4 className="mt-4 text-3xl font-black leading-none tracking-[-0.045em] text-white sm:text-4xl">
                {activeItem.title}
              </h4>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-alabaster-grey/70">
                {activeItem.description}
              </p>
              {activeItem.image_url && activeItem.image_alt && (
                <p className="mt-4 border-l border-alabaster-grey/20 pl-3 font-mono text-[8px] uppercase leading-5 tracking-[0.14em] text-alabaster-grey/40">
                  Image details / {activeItem.image_alt}
                </p>
              )}
              {activeItem.link && (
                <a
                  href={activeItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-3 border-b border-orange pb-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-orange transition-colors hover:border-white hover:text-white"
                >
                  View credential or reference <span aria-hidden>↗</span>
                </a>
              )}
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
