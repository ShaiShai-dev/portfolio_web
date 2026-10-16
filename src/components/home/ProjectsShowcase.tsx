"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ProjectCard } from "@/components/home/ProjectCard";
import { formatProjectTimeline } from "@/lib/project-date";
import type { Project, ProjectsContent } from "@/lib/supabase/types";

function getRelativeIndex(index: number, activeIndex: number, length: number) {
  let relativeIndex = index - activeIndex;
  const midpoint = length / 2;

  if (relativeIndex > midpoint) relativeIndex -= length;
  if (relativeIndex < -midpoint) relativeIndex += length;
  return relativeIndex;
}

export function ProjectsShowcase({
  projects,
  displayStyle,
}: {
  projects: Project[];
  displayStyle: ProjectsContent["display_style"];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  if (displayStyle === "grid") {
    return (
      <div className="mt-14 grid grid-cols-1 items-stretch gap-5 sm:mt-20 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    );
  }

  const itemCount = projects.length;
  const safeActiveIndex = activeIndex % itemCount;
  const activeProject = projects[safeActiveIndex];
  const activeTimeline = formatProjectTimeline(
    activeProject.development_start,
    activeProject.development_end,
  );
  const isFloating = displayStyle === "floating";

  function move(direction: -1 | 1) {
    setActiveIndex(
      (current) => (current + direction + itemCount) % itemCount,
    );
  }

  return (
    <section className="mt-14 min-w-0 overflow-hidden border border-alabaster-grey/20 bg-prussian-blue/10 sm:mt-20">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-alabaster-grey/15 px-4 py-4 sm:px-6">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-orange">
            Complete project collection
          </p>
          <p className="mt-1 text-sm font-bold text-white">
            {isFloating ? "Floating gallery" : "Stack showcase"}
          </p>
        </div>
        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-alabaster-grey/50">
          Select a project to inspect its details
        </p>
      </div>

      <div className="fine-grid relative h-[330px] overflow-hidden border-b border-alabaster-grey/15 sm:h-[480px] lg:h-[540px]">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 size-[min(76vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange/15"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 size-[min(58vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-alabaster-grey/15"
        />

        {projects.map((project, projectIndex) => {
          const relativeIndex = getRelativeIndex(
            projectIndex,
            safeActiveIndex,
            itemCount,
          );
          const distance = Math.abs(relativeIndex);
          const isActive = relativeIndex === 0;
          const isVisible = distance <= (isFloating ? 3 : 2);
          const horizontalStep = isFloating ? 290 : 180;
          const verticalOffset = isFloating
            ? relativeIndex % 2 === 0
              ? -28
              : 30
            : distance * 18;
          const projectNumber = String(projectIndex + 1).padStart(2, "0");

          return (
            <motion.button
              key={project.id}
              type="button"
              initial={false}
              animate={{
                x: `calc(-50% + ${relativeIndex * horizontalStep}px)`,
                y: `calc(-50% + ${verticalOffset}px)`,
                scale: isActive ? 1 : isFloating ? 0.66 : 0.82,
                rotate: reduceMotion
                  ? 0
                  : relativeIndex * (isFloating ? 1.8 : -4.5),
                opacity: isVisible ? (isActive ? 1 : 0.58) : 0,
                zIndex: 30 - distance,
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 185,
                      damping: 24,
                      mass: 0.8,
                    }
              }
              onClick={() => setActiveIndex(projectIndex)}
              aria-label={`Feature ${project.title}`}
              aria-pressed={isActive}
              className="group absolute left-1/2 top-1/2 aspect-[4/3] w-[min(78vw,560px)] overflow-hidden rounded-[1.4rem] border border-alabaster-grey/30 bg-prussian-blue text-left shadow-[0_28px_80px_rgba(0,0,0,0.62)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
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
                  duration: 4 + projectIndex * 0.18,
                  repeat: isFloating && !reduceMotion ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                {project.thumbnail_url ? (
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    sizes="(min-width: 768px) 560px, 78vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center bg-prussian-blue">
                    <span className="grid size-28 place-items-center rounded-full border border-orange/65 bg-black font-mono text-4xl font-black text-orange sm:size-36 sm:text-5xl">
                      {projectNumber}
                    </span>
                  </span>
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/45" />
                <span className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 font-mono text-[8px] uppercase tracking-[0.17em] text-white sm:p-5">
                  <span className="border border-alabaster-grey/20 bg-black/85 px-3 py-2">
                    Project / {projectNumber}
                  </span>
                  {isActive && (
                    <span className="border border-orange bg-orange px-3 py-2 font-bold text-black">
                      Featured
                    </span>
                  )}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                  <span className="max-w-[80%] text-2xl font-black leading-none tracking-[-0.05em] text-white sm:text-4xl">
                    {project.title}
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-orange bg-black text-orange">
                    ↗
                  </span>
                </span>
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
            aria-live="polite"
            className="min-w-0"
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-orange">
              Selected project / {String(safeActiveIndex + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 text-3xl font-black leading-none tracking-[-0.05em] text-white sm:text-4xl">
              {activeProject.title}
            </h3>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-alabaster-grey/65 sm:text-base sm:leading-7">
              {activeProject.summary}
            </p>
            {activeTimeline && (
              <p className="mt-4 border-l border-orange pl-3 font-mono text-[8px] uppercase tracking-[0.15em] text-alabaster-grey/50">
                Development / {activeTimeline}
              </p>
            )}
            {activeProject.tech_stack.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {activeProject.tech_stack.slice(0, 6).map((tech) => (
                  <span
                    key={tech}
                    className="border border-alabaster-grey/15 bg-black/40 px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-[0.13em] text-alabaster-grey/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={itemCount < 2}
            aria-label="Show previous project"
            className="grid size-11 place-items-center rounded-full border border-alabaster-grey/30 text-white transition-colors hover:border-orange hover:bg-orange hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={itemCount < 2}
            aria-label="Show next project"
            className="grid size-11 place-items-center rounded-full border border-alabaster-grey/30 text-white transition-colors hover:border-orange hover:bg-orange hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
          <Link
            href={`/projects/${activeProject.slug}`}
            className="ml-1 border border-orange bg-orange px-5 py-3 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black transition-colors hover:bg-black hover:text-orange"
          >
            View case ↗
          </Link>
        </div>
      </div>

      {itemCount > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-alabaster-grey/15 px-5 py-4">
          {projects.map((project, projectIndex) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setActiveIndex(projectIndex)}
              aria-label={`Select ${project.title}`}
              aria-current={projectIndex === safeActiveIndex ? "true" : undefined}
              className={`h-1.5 transition-all ${
                projectIndex === safeActiveIndex
                  ? "w-10 bg-orange"
                  : "w-5 bg-alabaster-grey/25 hover:bg-alabaster-grey/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
