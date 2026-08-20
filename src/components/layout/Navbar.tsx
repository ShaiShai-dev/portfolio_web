"use client";

import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useState } from "react";

const links = [
  { href: "/#projects", label: "Work", index: "01" },
  { href: "/#about", label: "About", index: "02" },
  { href: "/#contact", label: "Contact", index: "03" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  const duration = shouldReduceMotion ? 0 : 0.45;

  return (
    <motion.header
      initial={shouldReduceMotion ? false : { y: -72, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-500 ${
        isScrolled
          ? "border-alabaster-grey/0 bg-black/0"
          : "border-alabaster-grey/10 bg-black/95"
      }`}
    >
      <motion.nav
        animate={{ height: isScrolled ? 62 : 76 }}
        transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 sm:px-8 lg:px-10"
        aria-label="Main navigation"
      >
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { x: 3 }}
          transition={{ type: "spring", stiffness: 350, damping: 24 }}
        >
          <Link
            href="/"
            aria-label="SHAI — Home"
            className="group flex items-center gap-3"
          >
            <motion.span
              animate={{
                rotate: isScrolled ? -4 : 0,
                scale: isScrolled ? 0.92 : 1,
              }}
              whileHover={shouldReduceMotion ? undefined : { rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative grid size-9 place-items-center border border-orange bg-orange font-mono text-[10px] font-black text-black sm:size-10 sm:text-xs"
            >
              <span className="relative z-10">TB</span>
              <span className="absolute -right-1 -top-1 size-2 border-r border-t border-orange opacity-0 transition-all duration-300 group-hover:-right-2 group-hover:-top-2 group-hover:opacity-100" />
              <span className="absolute -bottom-1 -left-1 size-2 border-b border-l border-orange opacity-0 transition-all duration-300 group-hover:-bottom-2 group-hover:-left-2 group-hover:opacity-100" />
            </motion.span>

            <span className="hidden overflow-hidden sm:block">
              <span className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-[-0.025em] text-white transition-colors group-hover:text-orange">
                  SHAI
                </span>
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-orange" />
                </span>
              </span>
              <motion.span
                animate={{
                  height: isScrolled ? 0 : 13,
                  marginTop: isScrolled ? 0 : 4,
                  opacity: isScrolled ? 0 : 1,
                }}
                transition={{ duration: duration * 0.8 }}
                className="block font-mono text-[8px] uppercase tracking-[0.24em] text-alabaster-grey/45"
              >
                Developer / Designer
              </motion.span>
            </span>
          </Link>
        </motion.div>

        <div className="flex items-center gap-1 sm:gap-5">
          <ul className="flex items-center rounded-full border border-alabaster-grey/0 px-0.5 transition-colors duration-500 hover:border-alabaster-grey/15">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative flex items-baseline gap-1.5 overflow-hidden px-2 py-3 text-[11px] font-medium text-alabaster-grey transition-colors hover:text-orange sm:px-3 sm:text-sm"
                >
                  <span className="hidden font-mono text-[8px] text-orange/65 transition-transform duration-300 group-hover:-translate-y-0.5 sm:inline">
                    {link.index}
                  </span>
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-orange transition-transform duration-300 group-hover:scale-x-100" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/#contact"
            className="group relative hidden overflow-hidden border border-orange bg-orange px-5 py-3 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-black md:block"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-300 group-hover:scale-x-100" />
            <span className="relative z-10 flex items-center gap-3 transition-colors group-hover:text-orange">
              Let&apos;s talk
              <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </span>
          </Link>
        </div>
      </motion.nav>

      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-orange"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.div
        aria-hidden
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-12 bg-gradient-to-t from-black/35 to-transparent"
      />
    </motion.header>
  );
}
