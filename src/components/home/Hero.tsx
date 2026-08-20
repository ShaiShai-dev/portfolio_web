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
          className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-auto"
        >
          <div className="absolute -left-5 -top-5 z-20 border border-orange bg-black px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-orange sm:-left-8 sm:top-12">
            Creative system / 01
          </div>

          <div className="fine-grid relative aspect-[4/4.6] overflow-hidden border border-alabaster-grey/20 bg-prussian-blue/35">
            {content.image_url && (
              <>
                <Image
                  src={content.image_url}
                  alt={content.image_alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/65" />
              </>
            )}
            <div className="absolute left-5 top-5 font-mono text-[9px] uppercase tracking-[0.2em] text-alabaster-grey/50">
              Design
              <br />
              Develop
              <br />
              Deliver
            </div>
            <div className="absolute right-5 top-5 font-mono text-[9px] text-orange">
              [ TB—26 ]
            </div>

            <motion.div
              aria-hidden
              animate={shouldReduceMotion ? {} : { rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 aspect-square w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange/50"
            >
              <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 bg-orange" />
              <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-white" />
            </motion.div>
            <motion.div
              aria-hidden
              animate={shouldReduceMotion ? {} : { rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-alabaster-grey/30"
            />
            <div className="absolute left-1/2 top-1/2 grid aspect-square w-[39%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-alabaster-grey/20 bg-black shadow-[0_0_80px_rgba(252,163,17,0.16)]">
              <span className="text-center text-[clamp(2rem,6vw,4.5rem)] font-black leading-none tracking-[-0.08em] text-white">
                TB<span className="text-orange">.</span>
              </span>
            </div>

            <p className="absolute bottom-5 left-5 max-w-36 font-mono text-[9px] uppercase leading-5 tracking-[0.15em] text-alabaster-grey/50">
              Built with purpose.
              <br />
              Shipped with care.
            </p>
            <span className="absolute bottom-5 right-5 font-mono text-[9px] text-orange">
              14.5995° N
            </span>
          </div>

          <div className="absolute -bottom-5 -right-3 z-20 bg-orange px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-black sm:-right-6">
            Scroll to explore ↓
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
