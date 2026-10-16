"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Project } from "@/lib/supabase/types";

function getRelativeIndex(index: number, activeIndex: number, length: number) {
  let relativeIndex = index - activeIndex;
  const midpoint = length / 2;

  if (relativeIndex > midpoint) relativeIndex -= length;
  if (relativeIndex < -midpoint) relativeIndex += length;
  return relativeIndex;
}

export function ProjectMediaGallery({
  projectTitle,
  imageUrls,
  style,
}: {
  projectTitle: string;
  imageUrls: string[];
  style: Project["gallery_style"];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const itemCount = imageUrls.length;
  const safeActiveIndex = itemCount > 0 ? activeIndex % itemCount : 0;
  const isFloating = style === "floating";

  function move(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + itemCount) % itemCount);
  }

  if (itemCount === 0) return null;

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden border border-alabaster-grey/20 bg-black/25">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-alabaster-grey/15 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-alabaster-grey/50">
          <span className="size-1.5 rounded-full bg-orange" />
          <span>{isFloating ? "Floating gallery" : "Stack view"}</span>
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-orange">
          Frame {String(safeActiveIndex + 1).padStart(2, "0")} / {String(itemCount).padStart(2, "0")}
        </span>
      </div>

      <div className="fine-grid relative h-[310px] overflow-hidden border-b border-alabaster-grey/15 sm:h-[520px]">
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-alabaster-grey/10" />
        <div aria-hidden className="absolute left-1/2 top-8 h-[calc(100%-4rem)] w-px bg-alabaster-grey/10" />

        {imageUrls.map((url, imageIndex) => {
          const relativeIndex = getRelativeIndex(
            imageIndex,
            safeActiveIndex,
            itemCount,
          );
          const distance = Math.abs(relativeIndex);
          const isActive = relativeIndex === 0;
          const isVisible = distance <= (isFloating ? 3 : 2);
          const horizontalStep = isFloating ? 270 : 185;
          const verticalOffset = isFloating
            ? relativeIndex % 2 === 0
              ? 24
              : -26
            : distance * 15;

          return (
            <motion.button
              key={`${url}-${imageIndex}`}
              type="button"
              initial={false}
              animate={{
                x: `calc(-50% + ${relativeIndex * horizontalStep}px)`,
                y: `calc(-50% + ${verticalOffset}px)`,
                scale: isActive ? 1 : isFloating ? 0.7 : 0.84,
                rotate: reduceMotion
                  ? 0
                  : relativeIndex * (isFloating ? 1.7 : -3.2),
                opacity: isVisible ? (isActive ? 1 : 0.64) : 0,
                zIndex: 20 - distance,
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 190, damping: 24, mass: 0.8 }
              }
              onClick={() => setActiveIndex(imageIndex)}
              aria-label={`Show ${projectTitle} screenshot ${imageIndex + 1}`}
              aria-pressed={isActive}
              className="absolute left-1/2 top-1/2 aspect-video w-[min(78vw,760px)] overflow-hidden rounded-[1.25rem] border border-alabaster-grey/30 bg-prussian-blue text-left shadow-[0_24px_70px_rgba(0,0,0,0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
              style={{ pointerEvents: isVisible ? "auto" : "none" }}
            >
              <motion.span
                className="absolute inset-0 block"
                initial={false}
                animate={
                  isFloating && !reduceMotion ? { y: [0, -9, 0] } : { y: 0 }
                }
                transition={{
                  duration: 3.7 + imageIndex * 0.22,
                  repeat: isFloating && !reduceMotion ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 760px, 78vw"
                  className="scale-110 object-cover opacity-25 blur-xl"
                />
                <Image
                  src={url}
                  alt={`${projectTitle} screenshot ${imageIndex + 1}`}
                  fill
                  sizes="(min-width: 1024px) 760px, 78vw"
                  className="object-contain p-2"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black via-black/70 to-transparent px-4 pb-4 pt-16 font-mono text-[8px] uppercase tracking-[0.16em]">
                  <span className="text-white">{projectTitle}</span>
                  <span className="text-orange">
                    {isActive
                      ? "Selected frame"
                      : `/${String(imageIndex + 1).padStart(2, "0")}`}
                  </span>
                </span>
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div aria-live="polite">
          <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-orange">
            Project image / {String(safeActiveIndex + 1).padStart(2, "0")}
          </p>
          <p className="mt-2 text-sm font-bold text-white">
            {projectTitle} — screenshot {safeActiveIndex + 1}
          </p>
          <p className="mt-1 text-xs text-alabaster-grey/45">
            Full uploaded image shown inside the active frame.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={itemCount < 2}
            aria-label="Show previous project image"
            className="grid size-11 place-items-center rounded-full border border-alabaster-grey/30 font-mono text-sm text-white transition-colors hover:border-orange hover:bg-orange hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={itemCount < 2}
            aria-label="Show next project image"
            className="grid size-11 place-items-center rounded-full border border-alabaster-grey/30 font-mono text-sm text-white transition-colors hover:border-orange hover:bg-orange hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
