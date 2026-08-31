"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import type { HomeContent } from "@/lib/supabase/types";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function Hero({ content }: { content: HomeContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-alabaster-grey/15 bg-black">
      <div aria-hidden className="surface-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute -right-24 top-10 size-[420px] rounded-full bg-prussian-blue/45 blur-3xl sm:size-[620px]"
      />

      <Container className="relative grid min-h-[calc(100svh-72px)] items-center gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: shouldReduceMotion ? 0 : 0.1 }}
          className="relative z-10"
        >
          <motion.div
            variants={reveal}
            transition={{ duration: shouldReduceMotion ? 0 : 0.55 }}
            className="mb-8 flex items-center gap-3"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange opacity-70 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2.5 rounded-full bg-orange" />
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-alabaster-grey/70 sm:text-xs">
              {content.status}
            </span>
          </motion.div>

          <motion.p
            variants={reveal}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
            className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-orange"
          >
            {content.eyebrow}
          </motion.p>

          <motion.h1
            variants={reveal}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7 }}
            className="max-w-4xl text-[clamp(3.5rem,8vw,7.4rem)] font-black leading-[0.84] tracking-[-0.075em] text-white"
          >
            {content.title}
            <span className="mt-2 block text-orange">{content.accent_title}</span>
          </motion.h1>

          <motion.p
            variants={reveal}
            transition={{ duration: shouldReduceMotion ? 0 : 0.65 }}
            className="mt-8 max-w-xl text-base leading-7 text-alabaster-grey/75 sm:text-lg sm:leading-8"
          >
            {content.introduction}
          </motion.p>

          <motion.div
            variants={reveal}
            transition={{ duration: shouldReduceMotion ? 0 : 0.65 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-5 border border-orange bg-orange px-6 py-4 text-sm font-bold text-black transition-colors hover:bg-black hover:text-orange"
            >
              {content.primary_cta_label}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center border border-alabaster-grey/25 bg-black px-6 py-4 text-sm font-semibold text-white transition-colors hover:border-orange hover:text-orange"
            >
              {content.secondary_cta_label}
            </a>
          </motion.div>

          <motion.div
            variants={reveal}
            transition={{ duration: shouldReduceMotion ? 0 : 0.65 }}
            className="mt-10 flex flex-wrap gap-x-7 gap-y-2 border-t border-alabaster-grey/15 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-alabaster-grey/45"
          >
            {content.meta_items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: 0.25 }}
          className="relative isolate mx-auto w-full max-w-[560px] px-5 py-8 sm:px-8 lg:mx-0 lg:ml-auto"
        >
          <div
            aria-hidden
            className="absolute inset-[8%] z-0 rounded-full bg-prussian-blue/55 blur-3xl"
          />
          <motion.div
            aria-hidden
            animate={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange/45"
          >
            <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 bg-orange" />
            <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-white" />
          </motion.div>
          <motion.div
            aria-hidden
            animate={shouldReduceMotion ? {} : { rotate: -360 }}
            transition={{ duration: 17, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-alabaster-grey/25"
          />

          <div className="relative z-10">
            <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.16em]">
              <span className="border border-orange bg-black px-4 py-2 text-orange">
                Creative system / 01
              </span>
              <span className="text-orange">[ TB—26 ]</span>
            </div>

            <div className="fine-grid relative aspect-[4/4.6] overflow-hidden border border-alabaster-grey/25 bg-prussian-blue/35 shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
              {content.image_url ? (
                <Image
                  src={content.image_url}
                  alt={content.image_alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="z-10 object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-center text-[clamp(2rem,6vw,4.5rem)] font-black leading-none tracking-[-0.08em] text-white">
                    TB<span className="text-orange">.</span>
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-end justify-between gap-5 font-mono text-[9px] uppercase tracking-[0.15em]">
              <p className="leading-5 text-alabaster-grey/50">
                Built with purpose. / Shipped with care.
              </p>
              <span className="shrink-0 text-orange">14.5995° N</span>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="bg-orange px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-black">
                Scroll to explore ↓
              </div>
            </div>
          </div>
        </motion.div>
      </Container>

      <div className="overflow-hidden border-t border-black bg-orange py-3 text-black">
        <div className="marquee-track flex" aria-hidden>
          {[0, 1].map((set) => (
            <div key={set} className="flex shrink-0 items-center">
              {content.marquee_items.map((item) => (
                <span
                  key={`${set}-${item}`}
                  className="flex items-center font-mono text-[10px] font-bold uppercase tracking-[0.22em] sm:text-xs"
                >
                  <span className="mx-7 inline-block size-1.5 rounded-full bg-black" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
