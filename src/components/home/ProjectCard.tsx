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
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.7,
        delay: shouldReduceMotion ? 0 : (index % 3) * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group grid overflow-hidden border border-alabaster-grey/15 bg-black transition-colors hover:border-orange md:grid-cols-[1.35fr_0.65fr]"
      >
        <div className="relative aspect-[16/10] overflow-hidden border-b border-alabaster-grey/15 bg-prussian-blue/45 md:min-h-[430px] md:border-b-0 md:border-r">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              sizes="(min-width: 768px) 65vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.035] group-hover:opacity-80"
            />
          ) : (
            <div className="fine-grid absolute inset-0 grid place-items-center">
              <div className="grid size-40 place-items-center rounded-full border border-orange/60 bg-black font-mono text-5xl font-black text-orange sm:size-52 sm:text-7xl">
                {projectNumber}
              </div>
            </div>
          )}

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white sm:p-5">
            <span className="bg-black px-3 py-2">Case study / {projectNumber}</span>
            <span className="bg-orange px-3 py-2 font-bold text-black">
              Selected work
            </span>
          </div>
        </div>

        <div className="flex min-h-[330px] flex-col p-6 sm:p-8 md:min-h-0 lg:p-10">
          <div className="flex items-start justify-between gap-5">
            <span className="font-mono text-xs tracking-[0.2em] text-orange">
              /{projectNumber}
            </span>
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-alabaster-grey/25 text-lg text-white transition-all group-hover:rotate-45 group-hover:border-orange group-hover:bg-orange group-hover:text-black">
              ↗
            </span>
          </div>

          <div className="my-auto py-8">
            <h3 className="text-3xl font-black leading-[0.95] tracking-[-0.05em] text-white transition-colors group-hover:text-orange sm:text-4xl lg:text-5xl">
              {project.title}
            </h3>
            <p className="mt-5 text-sm leading-6 text-alabaster-grey/65 sm:text-base sm:leading-7">
              {project.summary}
            </p>
          </div>

          {project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-alabaster-grey/15 pt-5">
              {project.tech_stack.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/55"
                >
                  + {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
