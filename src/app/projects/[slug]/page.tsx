import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProjectMediaGallery } from "@/components/projects/ProjectMediaGallery";
import { getSiteSettings } from "@/lib/get-site-settings";
import { formatProjectTimeline } from "@/lib/project-date";
import { themeStyle } from "@/lib/theme-style";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getProject(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  return data;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project not found — SHAI" };
  }

  return {
    title: `${project.title} — SHAI`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { settings } = await getSiteSettings();

  if (settings.maintenance_mode) {
    redirect("/maintenance");
  }

  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const paragraphs = project.description
    ? project.description.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [];
  const projectTimeline = formatProjectTimeline(
    project.development_start,
    project.development_end,
  );

  return (
    <div
      style={themeStyle(settings.theme)}
      className="flex min-h-screen flex-col bg-black text-white"
    >
      <Navbar />
      <main className="flex-1 bg-black">
        <section className="relative overflow-hidden border-b border-alabaster-grey/15 bg-prussian-blue">
          <div aria-hidden className="surface-grid absolute inset-0 opacity-35" />
          <Container className="relative py-16 sm:py-24">
            <FadeIn>
              <Link
                href="/projects"
                className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-alabaster-grey/60 transition-colors hover:text-orange"
              >
                <span>←</span> Back to project archive
              </Link>

              <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange">
                    Case study / {project.slug.replaceAll("-", " ")}
                  </p>
                  <h1 className="mt-5 max-w-4xl text-[clamp(3.5rem,9vw,7.5rem)] font-black leading-[0.84] tracking-[-0.075em] text-white">
                    {project.title}
                    <span className="text-orange">.</span>
                  </h1>
                </div>
                <div className="border-l border-orange pl-6 lg:mb-1">
                  <p className="text-base leading-7 text-alabaster-grey/75 sm:text-lg">
                    {project.summary}
                  </p>
                </div>
              </div>

              <div className="mt-14 flex flex-col gap-8 border-t border-alabaster-grey/20 pt-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  {projectTimeline && (
                    <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.17em] text-orange">
                      Development / {projectTimeline}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/60"
                      >
                        + {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-orange bg-orange px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-black hover:text-orange"
                    >
                      View live site ↗
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-alabaster-grey/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-orange hover:text-orange"
                    >
                      View source ↗
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          </Container>
        </section>

        {project.thumbnail_url && (
          <Container className="pt-8 sm:pt-12">
            <FadeIn>
              <div className="relative aspect-video w-full overflow-hidden border border-alabaster-grey/15 bg-prussian-blue/35">
                <Image
                  src={project.thumbnail_url}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  className="object-cover"
                  priority
                />
                <span className="absolute bottom-4 left-4 bg-black px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/65">
                  Project overview / 01
                </span>
              </div>
            </FadeIn>
          </Container>
        )}

        {paragraphs.length > 0 && (
          <Container className="py-20 sm:py-28">
            <FadeIn className="grid gap-10 border-t border-alabaster-grey/20 pt-7 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
              <div className="flex items-center gap-3 self-start font-mono text-[10px] uppercase tracking-[0.2em] text-orange">
                <span>02</span>
                <span className="h-px w-10 bg-orange" />
                <span>Inside the work</span>
              </div>
              <div className="space-y-7 text-lg leading-8 text-alabaster-grey/75 sm:text-xl sm:leading-9">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </FadeIn>
          </Container>
        )}

        {project.screenshot_urls.length > 0 && (
          <Container className="pb-20 sm:pb-28">
            <FadeIn>
              <div className="mb-8 flex items-end justify-between border-t border-alabaster-grey/20 pt-7">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange">
                    03 / Details
                  </p>
                  <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl">
                    In the interface<span className="text-orange">.</span>
                  </h2>
                </div>
                <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/40 sm:block">
                  {String(project.screenshot_urls.length).padStart(2, "0")} frames
                </span>
              </div>
              <ProjectMediaGallery
                projectTitle={project.title}
                imageUrls={project.screenshot_urls}
                style={
                  project.gallery_style === "floating" ? "floating" : "stack"
                }
              />
            </FadeIn>
          </Container>
        )}

        <section className="border-t border-alabaster-grey/15 bg-orange text-black">
          <Container className="flex flex-col gap-7 py-12 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em]">
                Have something similar in mind?
              </p>
              <p className="mt-2 text-3xl font-black tracking-tighter sm:text-4xl">
                Let&apos;s build the next one.
              </p>
            </div>
            <Link
              href="/#contact"
              className="w-fit border border-black bg-black px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-orange hover:text-black"
            >
              Start a conversation →
            </Link>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
