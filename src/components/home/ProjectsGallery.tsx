import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProjectCard } from "@/components/home/ProjectCard";
import type { ProjectsContent } from "@/lib/supabase/types";

export async function ProjectsGallery({
  limit,
  archive = false,
  content,
}: {
  limit?: number;
  archive?: boolean;
  content: ProjectsContent;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data: projects, error } = await query;

  if (error) {
    console.error("Failed to load projects:", error.message);
  }

  const heading = archive ? content.archive_heading : content.heading;
  const subheading = archive
    ? content.archive_introduction
    : content.introduction;

  return (
    <Container className="py-24 sm:py-32">
      <FadeIn className="grid gap-8 border-t border-alabaster-grey/20 pt-7 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <div className="flex items-center gap-3 self-start font-mono text-[10px] uppercase tracking-[0.22em] text-orange">
          <span>01</span>
          <span className="h-px w-10 bg-orange" />
          <span>{content.eyebrow}</span>
        </div>
        <div>
          <h2 className="max-w-3xl text-5xl font-black leading-[0.9] tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl">
            {heading}
            <span className="text-orange">.</span>
          </h2>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-base leading-7 text-alabaster-grey/65">
              {subheading}
            </p>
            {!archive && (
              <Link
                href="/projects"
                className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-alabaster-grey underline decoration-alabaster-grey/30 underline-offset-8 transition-colors hover:text-orange"
              >
                View archive ↗
              </Link>
            )}
          </div>
        </div>
      </FadeIn>

      {content.image_url && (
        <FadeIn delay={0.06} className="mt-12 sm:mt-16">
          <div className="relative aspect-[16/5] min-h-52 overflow-hidden border border-alabaster-grey/15 bg-prussian-blue/35">
            <Image
              src={content.image_url}
              alt={content.image_alt}
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/25" />
          </div>
        </FadeIn>
      )}

      {projects && projects.length > 0 ? (
        <div className="mt-14 space-y-7 sm:mt-20 sm:space-y-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      ) : (
        <FadeIn delay={0.1}>
          <div className="fine-grid mt-14 grid min-h-80 place-items-center border border-dashed border-alabaster-grey/25 bg-prussian-blue/25 px-5 text-center sm:mt-20">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-orange">
                Archive is being assembled
              </p>
              <p className="mt-4 text-2xl font-bold text-white">
                {content.empty_title}
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-alabaster-grey/55">
                {content.empty_message}
              </p>
            </div>
          </div>
        </FadeIn>
      )}
    </Container>
  );
}
