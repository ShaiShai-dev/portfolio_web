import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminInquiriesPage() {
  const supabase = await createClient();
  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="flex-1 bg-black">
      <section className="relative overflow-hidden border-b border-alabaster-grey/15 bg-prussian-blue">
        <div aria-hidden className="surface-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <Link
            href="/admin"
            className="font-mono text-[9px] uppercase tracking-[0.18em] text-alabaster-grey/50 transition-colors hover:text-orange"
          >
            ← Back to dashboard
          </Link>
          <div className="mt-12 grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-14">
            <div className="flex items-center gap-3 self-start font-mono text-[10px] uppercase tracking-[0.22em] text-orange">
              <span>04</span>
              <span className="h-px w-10 bg-orange" />
              <span>Admin inbox</span>
            </div>
            <div>
              <h1 className="text-5xl font-black leading-[0.9] tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl">
                Project inquiries<span className="text-orange">.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-alabaster-grey/65">
                Messages submitted through the public contact section, newest
                first and ready for your reply.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="flex items-end justify-between border-t border-alabaster-grey/20 pt-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
              Message archive
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-white">
              {String(inquiries?.length ?? 0).padStart(2, "0")} conversations
            </h2>
          </div>
          <span className="hidden font-mono text-[8px] uppercase tracking-[0.15em] text-alabaster-grey/35 sm:block">
            Contact form / Live data
          </span>
        </div>

        {error && (
          <div className="mt-8 border border-orange/40 bg-orange/10 p-5 text-sm text-orange">
            Failed to load inquiries: {error.message}
          </div>
        )}

        {!error && inquiries && inquiries.length === 0 && (
          <div className="fine-grid mt-10 grid min-h-72 place-items-center border border-dashed border-alabaster-grey/20 bg-prussian-blue/20 text-center">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
                Inbox clear
              </p>
              <p className="mt-4 text-2xl font-bold text-white">No inquiries yet.</p>
              <a href="/#contact" target="_blank" className="mt-4 inline-block text-sm text-alabaster-grey/55 underline underline-offset-4 hover:text-orange">
                Preview the public contact form ↗
              </a>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {inquiries?.map((inquiry, index) => (
            <article
              key={inquiry.id}
              className="group flex min-h-80 flex-col border border-alabaster-grey/15 bg-prussian-blue/20 p-6 transition-colors hover:border-orange hover:bg-prussian-blue/35 sm:p-8"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-orange">
                    Inquiry / {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">
                    {inquiry.name}
                  </h3>
                </div>
                <span className="border border-orange/40 bg-orange/10 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-orange">
                  {inquiry.project_type}
                </span>
              </div>

              <p className="my-8 whitespace-pre-wrap text-sm leading-7 text-alabaster-grey/65">
                {inquiry.message}
              </p>

              <div className="mt-auto flex flex-col gap-4 border-t border-alabaster-grey/15 pt-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-alabaster-grey/35">
                    Received / {formatDate(inquiry.created_at)}
                  </p>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="mt-2 block truncate text-sm text-alabaster-grey/65 transition-colors hover:text-orange"
                  >
                    {inquiry.email}
                  </a>
                </div>
                <a
                  href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Re: ${inquiry.project_type} inquiry`)}`}
                  className="inline-flex shrink-0 items-center justify-center border border-orange bg-orange px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-black hover:text-orange"
                >
                  Reply →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
