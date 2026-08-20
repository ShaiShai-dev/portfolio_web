"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/admin", label: "Dashboard", index: "00" },
  { href: "/admin/site", label: "Website", index: "01" },
  { href: "/admin/about", label: "About", index: "02" },
  { href: "/admin/projects", label: "Projects", index: "03" },
  { href: "/admin/inquiries", label: "Inbox", index: "04" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-alabaster-grey/10 bg-black/95 backdrop-blur-xl">
      <nav
        className="mx-auto flex min-h-[76px] w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-10"
        aria-label="Admin navigation"
      >
        <Link href="/admin" className="group flex shrink-0 items-center gap-3">
          <span className="grid size-10 place-items-center border border-orange bg-orange font-mono text-xs font-black text-black transition-transform duration-300 group-hover:rotate-6">
            SH
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-black tracking-[-0.03em] text-white group-hover:text-orange">
              SHAI / ADMIN
            </span>
            <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.22em] text-alabaster-grey/40">
              Portfolio control room
            </span>
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <ul className="flex min-w-0 items-center overflow-x-auto">
            {links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href} className="shrink-0">
                  <Link
                    href={link.href}
                    className={`group relative flex items-baseline gap-1.5 px-2 py-4 text-[11px] font-semibold transition-colors sm:px-3 sm:text-sm ${
                      active
                        ? "text-orange"
                        : "text-alabaster-grey/70 hover:text-white"
                    }`}
                  >
                    <span className="hidden font-mono text-[7px] text-orange/60 lg:inline">
                      {link.index}
                    </span>
                    <span>{link.label}</span>
                    <span
                      className={`absolute inset-x-2 bottom-2 h-px origin-left bg-orange transition-transform ${
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/"
            target="_blank"
            className="hidden shrink-0 border border-orange bg-orange px-4 py-3 font-mono text-[9px] font-black uppercase tracking-[0.13em] text-black transition-colors hover:bg-black hover:text-orange md:inline-flex"
          >
            View site ↗
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 border border-alabaster-grey/15 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-alabaster-grey/60 transition-colors hover:border-orange hover:text-orange"
            aria-label="Log out of admin"
          >
            <span className="hidden xl:inline">Logout</span>
            <span className="xl:hidden">Exit</span>
          </button>
        </div>
      </nav>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-orange/45 to-transparent" />
    </header>
  );
}
