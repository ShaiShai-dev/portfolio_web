import Link from "next/link";
import { EditIcon } from "@/components/admin/EditIcon";
import { createClient } from "@/lib/supabase/server";

const editableSections = [
  {
    number: "01",
    name: "Home",
    description: "Hero copy, calls to action, ticker, metadata, and feature image.",
    href: "/admin/site?module=home",
    treatment: "bg-black",
  },
  {
    number: "02",
    name: "Projects",
    description: "Section presentation, archive copy, project cards, and case studies.",
    href: "/admin/site?module=projects",
    treatment: "bg-prussian-blue",
  },
  {
    number: "03",
    name: "About",
    description: "Identity, education, portrait, technology roll, and social links.",
    href: "/admin/about",
    treatment: "bg-prussian-blue",
  },
  {
    number: "04",
    name: "Contact",
    description: "Invitation copy, response details, form options, and contact imagery.",
    href: "/admin/site?module=contact",
    treatment: "bg-black",
  },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: totalInquiries },
    { data: recentInquiries, error: inquiriesError },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const stats = [
    { number: "01", label: "Total projects", value: totalProjects ?? 0 },
    { number: "02", label: "Published work", value: publishedProjects ?? 0 },
    { number: "03", label: "Project inquiries", value: totalInquiries ?? 0 },
  ];

  return (
    <main className="flex-1 bg-black">
      <section className="relative overflow-hidden border-b border-alabaster-grey/15 bg-prussian-blue">
        <div aria-hidden className="surface-grid absolute inset-0 opacity-45" />
        <div
          aria-hidden
          className="absolute -right-32 top-1/2 size-[520px] -translate-y-1/2 rounded-full border border-orange/20"
        />
        <div
          aria-hidden
          className="absolute -right-12 top-1/2 size-[330px] -translate-y-1/2 rounded-full border border-dashed border-alabaster-grey/15"
        />

        <div className="relative mx-auto grid w-full max-w-[1280px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-10">
          <div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-orange">
              <span>Admin / 00</span>
              <span className="h-px w-12 bg-orange" />
              <span>Control room</span>
            </div>
            <h1 className="mt-7 max-w-4xl text-[clamp(3.5rem,8vw,7rem)] font-black leading-[0.84] tracking-[-0.075em] text-white">
              YOUR SITE,
              <span className="mt-2 block text-orange">UNDER CONTROL.</span>
            </h1>
          </div>
          <div className="relative border-l border-orange pl-6 lg:mb-2">
            <p className="max-w-md text-base leading-7 text-alabaster-grey/70">
              Edit the public portfolio visually, manage published work, and
              respond to new opportunities from one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/site"
                className="border border-orange bg-orange px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-black hover:text-orange"
              >
                Open website editor →
              </Link>
              <Link
                href="/admin/inquiries"
                className="border border-alabaster-grey/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-orange hover:text-orange"
              >
                Open inbox
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <section aria-labelledby="dashboard-stats-title">
          <div className="flex items-end justify-between border-t border-alabaster-grey/20 pt-6">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
                Portfolio pulse
              </p>
              <h2 id="dashboard-stats-title" className="mt-2 text-3xl font-black tracking-[-0.05em] text-white">
                At a glance<span className="text-orange">.</span>
              </h2>
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/35 sm:block">
              Live content overview
            </span>
          </div>

          <div className="mt-8 grid border-l border-t border-alabaster-grey/15 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group border-b border-r border-alabaster-grey/15 bg-prussian-blue/25 p-6 transition-colors hover:bg-prussian-blue/55 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[9px] text-orange">/{stat.number}</span>
                  <span className="size-2 bg-orange opacity-30 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-8 text-5xl font-black tracking-[-0.06em] text-white">
                  {String(stat.value).padStart(2, "0")}
                </p>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster-grey/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24" aria-labelledby="editable-sections-title">
          <div className="grid gap-8 border-t border-alabaster-grey/20 pt-7 md:grid-cols-[0.7fr_1.3fr] md:gap-14">
            <div className="flex items-center gap-3 self-start font-mono text-[10px] uppercase tracking-[0.22em] text-orange">
              <span>01</span>
              <span className="h-px w-10 bg-orange" />
              <span>Viewer sections</span>
            </div>
            <div>
              <h2 id="editable-sections-title" className="max-w-3xl text-5xl font-black leading-[0.9] tracking-[-0.065em] text-white sm:text-6xl">
                Edit what visitors see<span className="text-orange">.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-alabaster-grey/60">
                Each card maps directly to a public portfolio section. Select
                its edit icon to open the matching content workspace.
              </p>
            </div>
          </div>

          <div className="mt-14 grid border-l border-t border-alabaster-grey/15 md:grid-cols-2">
            {editableSections.map((section) => (
              <Link
                key={section.name}
                href={section.href}
                className={`fine-grid group relative min-h-72 overflow-hidden border-b border-r border-alabaster-grey/15 p-7 transition-colors hover:border-orange sm:p-9 ${section.treatment}`}
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange">
                    Section / {section.number}
                  </span>
                  <span className="grid size-12 place-items-center border border-alabaster-grey/25 bg-black text-alabaster-grey transition-all duration-300 group-hover:rotate-6 group-hover:border-orange group-hover:bg-orange group-hover:text-black">
                    <EditIcon className="size-5" />
                  </span>
                </div>
                <div className="mt-16 max-w-md">
                  <h3 className="text-4xl font-black tracking-[-0.055em] text-white transition-colors group-hover:text-orange sm:text-5xl">
                    {section.name}
                    <span className="text-orange">.</span>
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-alabaster-grey/55">
                    {section.description}
                  </p>
                </div>
                <span className="absolute bottom-6 right-7 font-mono text-[8px] uppercase tracking-[0.15em] text-alabaster-grey/30 transition-colors group-hover:text-orange">
                  Click to edit →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-24" aria-labelledby="recent-inquiries-title">
          <div className="flex flex-col gap-5 border-t border-alabaster-grey/20 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
                Inbox / Latest activity
              </p>
              <h2 id="recent-inquiries-title" className="mt-3 text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl">
                Recent inquiries<span className="text-orange">.</span>
              </h2>
            </div>
            <Link
              href="/admin/inquiries"
              className="w-fit font-mono text-[10px] uppercase tracking-[0.18em] text-alabaster-grey underline decoration-alabaster-grey/30 underline-offset-8 transition-colors hover:text-orange"
            >
              View full inbox ↗
            </Link>
          </div>

          {inquiriesError ? (
            <div className="mt-10 border border-orange/40 bg-orange/10 p-5 text-sm text-orange">
              The inquiry inbox could not be loaded: {inquiriesError.message}
            </div>
          ) : recentInquiries && recentInquiries.length > 0 ? (
            <div className="mt-10 border-l border-t border-alabaster-grey/15">
              {recentInquiries.map((inquiry, index) => (
                <article
                  key={inquiry.id}
                  className="grid gap-5 border-b border-r border-alabaster-grey/15 p-5 transition-colors hover:bg-prussian-blue/25 sm:grid-cols-[52px_0.7fr_1.3fr_auto] sm:items-center sm:p-6"
                >
                  <span className="font-mono text-xs text-orange">
                    /{String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-white">{inquiry.name}</h3>
                    <a href={`mailto:${inquiry.email}`} className="mt-1 block truncate text-xs text-alabaster-grey/45 hover:text-orange">
                      {inquiry.email}
                    </a>
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-orange">
                      {inquiry.project_type}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-alabaster-grey/55">
                      {inquiry.message}
                    </p>
                  </div>
                  <time className="shrink-0 font-mono text-[8px] uppercase tracking-[0.12em] text-alabaster-grey/35">
                    {formatDate(inquiry.created_at)}
                  </time>
                </article>
              ))}
            </div>
          ) : (
            <div className="fine-grid mt-10 grid min-h-52 place-items-center border border-dashed border-alabaster-grey/20 bg-prussian-blue/20 text-center">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
                  Inbox clear
                </p>
                <p className="mt-3 text-xl font-bold text-white">No inquiries yet.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
