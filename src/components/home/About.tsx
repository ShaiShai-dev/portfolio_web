import Image from "next/image";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { TechStackRoll } from "@/components/home/TechStackRoll";
import { createClient } from "@/lib/supabase/server";
import { getSiteProfileContent } from "@/lib/site-profile";

export async function About() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_profile")
    .select("*")
    .eq("id", "main")
    .maybeSingle();
  const profile = getSiteProfileContent(data);

  return (
    <div className="relative overflow-hidden bg-prussian-blue">
      <div aria-hidden className="surface-grid absolute inset-0 opacity-40" />
      <Container className="relative py-24 sm:py-32">
        <FadeIn className="grid gap-8 border-t border-alabaster-grey/25 pt-7 md:grid-cols-[0.7fr_1.3fr] md:gap-14">
          <div className="flex items-center gap-3 self-start font-mono text-[10px] uppercase tracking-[0.22em] text-orange">
            <span>02</span>
            <span className="h-px w-10 bg-orange" />
            <span>About me</span>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-alabaster-grey/50">
              Meet {profile.stage_name}
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              {profile.headline}
            </h2>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <FadeIn>
            <div className="fine-grid relative aspect-[4/4.75] max-w-md overflow-hidden border border-alabaster-grey/25 bg-black">
              {profile.portrait_url && (
                <>
                  <Image
                    src={profile.portrait_url}
                    alt={profile.portrait_alt}
                    fill
                    sizes="(min-width: 1024px) 36vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/35" />
                </>
              )}
              <span className="absolute left-5 top-5 font-mono text-[9px] uppercase tracking-[0.2em] text-alabaster-grey/45">
                Student / Developer — 01
              </span>
              <span className="absolute right-5 top-5 size-2 bg-orange" />

              <div className={`absolute inset-0 grid place-items-center ${profile.portrait_url ? "hidden" : ""}`}>
                <div className="relative grid size-[58%] place-items-center rounded-full border border-orange">
                  <div className="absolute inset-[10%] rounded-full border border-dashed border-alabaster-grey/30" />
                  <span className="text-[clamp(2.8rem,9vw,6.8rem)] font-black leading-none tracking-[-0.09em] text-outline">
                    {profile.stage_name}
                  </span>
                </div>
              </div>

              <div className="absolute inset-x-5 bottom-5 border-t border-alabaster-grey/20 pt-4">
                <div className="flex items-end justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/50">
                  <span>{profile.full_name}</span>
                  <span className="shrink-0 text-right text-orange">PH / 2026</span>
                </div>
                <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.14em] text-alabaster-grey/35">
                  {profile.location}
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="max-w-3xl text-xl leading-8 text-white sm:text-2xl sm:leading-10">
              {profile.bio}
            </p>

            <div className="mt-10 border border-alabaster-grey/20 bg-black/20">
              <div className="flex items-center justify-between border-b border-alabaster-grey/20 px-5 py-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
                  Education file
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-alabaster-grey/40">
                  Currently enrolled
                </span>
              </div>
              <div className="grid sm:grid-cols-2">
                <div className="border-b border-alabaster-grey/15 p-5 sm:border-r">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-alabaster-grey/40">
                    Institution
                  </p>
                  <p className="mt-2 font-semibold text-white">
                    {profile.education_school}
                  </p>
                </div>
                <div className="border-b border-alabaster-grey/15 p-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-alabaster-grey/40">
                    Academic standing
                  </p>
                  <p className="mt-2 font-semibold text-white">
                    {profile.education_year}
                  </p>
                </div>
                <div className="border-b border-alabaster-grey/15 p-5 sm:border-b-0 sm:border-r">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-alabaster-grey/40">
                    Degree
                  </p>
                  <p className="mt-2 text-sm leading-6 text-alabaster-grey/75">
                    {profile.education_degree}
                  </p>
                </div>
                <div className="p-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-alabaster-grey/40">
                    Specialization
                  </p>
                  <p className="mt-2 text-sm leading-6 text-alabaster-grey/75">
                    {profile.education_specialization}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 border-l border-orange px-5 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-alabaster-grey/60">
              <span className="size-1.5 rounded-full bg-orange" />
              {profile.availability}
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-20 border-t border-alabaster-grey/25 pt-8 sm:mt-28">
          <div className="grid overflow-hidden border border-alabaster-grey/20 bg-black lg:grid-cols-[0.72fr_1.28fr]">
            <div className="relative flex min-h-80 flex-col justify-between overflow-hidden bg-orange p-6 text-black sm:p-8 lg:min-h-[620px]">
              <div aria-hidden className="surface-grid absolute inset-0 opacity-20" />
              <div className="relative">
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em]">
                  Profile document / 03
                </p>
                <h3 className="mt-5 max-w-sm text-4xl font-black leading-[0.92] tracking-[-0.06em] sm:text-5xl">
                  Experience,
                  <br />skills &amp;
                  <br />selected work.
                </h3>
                <p className="mt-6 max-w-sm text-sm leading-6 text-black/70">
                  {profile.resume_summary}
                </p>
              </div>

              <div className="relative mt-12 space-y-3">
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-black bg-black px-5 py-4 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-orange hover:text-black"
                >
                  <span>{profile.resume_label}</span>
                  <span aria-hidden>&nearr;</span>
                </a>
                <a
                  href={profile.resume_url}
                  download
                  className="flex items-center justify-between border border-black px-5 py-4 font-mono text-[10px] font-black uppercase tracking-[0.16em] transition-colors hover:bg-black hover:text-white"
                >
                  <span>Download PDF</span>
                  <span aria-hidden>&darr;</span>
                </a>
              </div>
            </div>

            <div className="relative min-h-[520px] bg-alabaster-grey sm:min-h-[620px]">
              <div className="flex h-11 items-center justify-between border-b border-black/15 bg-white px-4 font-mono text-[8px] uppercase tracking-[0.16em] text-black/55">
                <span>Trishia Kyle Bagtas &mdash; Resume</span>
                <span>PDF / Preview</span>
              </div>
              <iframe
                src={`${profile.resume_url}#view=FitH&toolbar=0&navpanes=0`}
                title="Preview of Trishia Kyle Bagtas' resume"
                loading="lazy"
                className="h-[calc(100%-2.75rem)] w-full bg-white"
              />
            </div>
          </div>
        </FadeIn>

        <FadeIn className="mt-20 sm:mt-28">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
                Tools of the trade / rolling index
              </p>
              <h3 className="mt-3 text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl">
                Technology I build with<span className="text-orange">.</span>
              </h3>
            </div>
            <p className="max-w-sm text-sm leading-6 text-alabaster-grey/55">
              Hover the rail to pause it. Every item and logo can be managed
              from the admin workspace.
            </p>
          </div>
          <TechStackRoll items={profile.tech_stack} />
        </FadeIn>

        <FadeIn className="mt-20 border-t border-alabaster-grey/25 pt-8 sm:mt-28">
          <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-14">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
                Find me online / 05
              </p>
              <h3 className="mt-3 text-4xl font-black tracking-[-0.055em] text-white">
                Let&apos;s connect<span className="text-orange">.</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {profile.social_links.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target={social.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    social.url.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="group flex min-h-36 flex-col justify-between border border-alabaster-grey/20 bg-black/20 p-4 transition-colors hover:border-orange hover:bg-black"
                  aria-label={`${social.label} profile`}
                >
                  <BrandIcon
                    name={social.platform}
                    className="size-8 text-alabaster-grey transition-colors group-hover:text-orange"
                  />
                  <span className="flex items-end justify-between gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-alabaster-grey/70 group-hover:text-white">
                      {social.label}
                    </span>
                    <span className="text-orange transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                      ↗
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
