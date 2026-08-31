"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/supabase/types";

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const projectNumber = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      className="h-full min-w-0"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.7,
        delay: shouldReduceMotion ? 0 : (index % 6) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group relative flex h-full flex-col overflow-hidden border border-alabaster-grey/15 bg-prussian-blue/15 transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-orange hover:shadow-[0_22px_60px_rgba(0,0,0,0.45)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden border-b border-alabaster-grey/15 bg-prussian-blue/45">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="fine-grid absolute inset-0 grid place-items-center overflow-hidden">
              <div
                aria-hidden
                className="absolute -right-[18%] -top-[24%] size-[70%] rounded-full border border-orange/25 transition-transform duration-700 group-hover:scale-110"
              />
              <div
                aria-hidden
                className="absolute -bottom-[34%] -left-[18%] size-[85%] rounded-full border border-dashed border-alabaster-grey/15 transition-transform duration-700 group-hover:-rotate-12"
              />
              <div className="relative grid size-28 place-items-center rounded-full border border-orange/60 bg-black font-mono text-4xl font-black text-orange transition-all duration-500 group-hover:scale-110 group-hover:bg-orange group-hover:text-black sm:size-32 sm:text-5xl">
                {projectNumber}
              </div>
            </div>
          )}

          {project.thumbnail_url && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/25 transition-opacity duration-500 group-hover:opacity-75" />
          )}

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white sm:p-4">
            <span className="border border-alabaster-grey/15 bg-black/90 px-3 py-2">
              Project / {projectNumber}
            </span>
            <span className="border border-orange bg-orange px-3 py-2 font-bold text-black">
              View case
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 font-mono text-[8px] uppercase tracking-[0.16em] text-alabaster-grey/65">
            <span>{project.thumbnail_url ? "Project preview" : "Image pending"}</span>
            <span className="size-1.5 bg-orange" />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-5">
            <h3 className="max-w-[85%] text-2xl font-black leading-[0.95] tracking-[-0.045em] text-white transition-colors group-hover:text-orange sm:text-3xl">
              {project.title}
            </h3>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-alabaster-grey/25 text-sm text-white transition-all group-hover:rotate-45 group-hover:border-orange group-hover:bg-orange group-hover:text-black">
              &#8599;
            </span>
          </div>

          <p className="mt-4 flex-1 text-sm leading-6 text-alabaster-grey/65">
            {project.summary}
          </p>

          {project.tech_stack.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 border-t border-alabaster-grey/15 pt-4">
              {project.tech_stack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="border border-alabaster-grey/15 bg-black/50 px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-[0.13em] text-alabaster-grey/55 transition-colors group-hover:border-orange/30 group-hover:text-alabaster-grey"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.17em] text-orange">
            <span className="h-px flex-1 bg-orange/35 transition-colors group-hover:bg-orange" />
            <span>Open project</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
