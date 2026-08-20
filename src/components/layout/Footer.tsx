import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-alabaster-grey/15 bg-black">
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-5 py-10 sm:px-8 md:grid-cols-3 md:items-end lg:px-10">
        <div>
          <p className="text-2xl font-bold tracking-[-0.04em] text-white">
            SHAI<span className="text-orange">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-alabaster-grey/60">
            Thoughtful interfaces, dependable builds, and digital products
            made to last.
          </p>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-alabaster-grey/45 md:text-center">
          © {new Date().getFullYear()} SHAI
          <br />
          Built with Next.js + Supabase
        </p>

        <div className="flex gap-5 text-sm text-alabaster-grey md:justify-end">
          <Link href="/projects" className="transition-colors hover:text-orange">
            Projects
          </Link>
          <Link href="/#about" className="transition-colors hover:text-orange">
            About
          </Link>
          <Link href="/#contact" className="transition-colors hover:text-orange">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
