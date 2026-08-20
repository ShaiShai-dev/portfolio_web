"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import type { ContactContent } from "@/lib/supabase/types";

type Status = "idle" | "submitting" | "success" | "error";

const inputClassName =
  "w-full border-0 border-b border-alabaster-grey/25 bg-transparent px-0 py-4 text-base text-white outline-none transition-colors placeholder:text-alabaster-grey/30 focus:border-orange";

export function ContactForm({ content }: { content: ContactContent }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState(content.project_types[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function openDialog() {
    setStatus("idle");
    setErrorMessage("");
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill in your name, email, and message.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");

    const supabase = createClient();
    const { error } = await supabase.from("inquiries").insert({
      name: name.trim(),
      email: email.trim(),
      project_type: projectType,
      message: message.trim(),
    });

    if (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again in a moment.");
      return;
    }

    setStatus("success");
    setName("");
    setEmail("");
    setProjectType(content.project_types[0]);
    setMessage("");
  }

  return (
    <Container className="py-24 sm:py-32">
      <FadeIn className="grid gap-8 border-t border-alabaster-grey/20 pt-7 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <div className="flex items-center gap-3 self-start font-mono text-[10px] uppercase tracking-[0.22em] text-orange">
          <span>03</span>
          <span className="h-px w-10 bg-orange" />
          <span>{content.eyebrow}</span>
        </div>
        <div>
          <h2 className="max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl">
            {content.heading}
            <span className="block text-orange">{content.accent_heading}</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-alabaster-grey/65">
            {content.introduction}
          </p>
        </div>
      </FadeIn>

      <FadeIn className="fine-grid relative mt-14 overflow-hidden border border-alabaster-grey/15 bg-prussian-blue sm:mt-20">
        {content.image_url && (
          <>
            <Image
              src={content.image_url}
              alt=""
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-prussian-blue via-prussian-blue/90 to-prussian-blue/55" />
          </>
        )}

        <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-12">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
              {content.direct_label}
            </span>
            <p className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-4xl">
              {content.direct_title}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 font-mono text-[9px] uppercase tracking-[0.15em] text-alabaster-grey/55">
              <p>
                Timezone <span className="ml-2 text-white">{content.timezone}</span>
              </p>
              <p>
                Typical reply{" "}
                <span className="ml-2 text-white">{content.response_time}</span>
              </p>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={openDialog}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.99 }}
            className="group inline-flex w-full items-center justify-between border border-orange bg-orange px-6 py-4 text-sm font-bold text-black transition-colors hover:bg-black hover:text-orange sm:w-auto sm:min-w-60"
          >
            Start a project
            <span className="ml-8 transition-transform group-hover:translate-x-1">→</span>
          </motion.button>
        </div>
      </FadeIn>

      <dialog
        ref={dialogRef}
        aria-labelledby="contact-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        className="contact-dialog w-[min(1180px,calc(100vw-2rem))] max-h-[calc(100svh-2rem)] overflow-y-auto border border-alabaster-grey/20 bg-black p-0 text-white shadow-2xl"
      >
        <button
          type="button"
          onClick={closeDialog}
          aria-label="Close contact form"
          className="absolute right-4 top-4 z-20 grid size-11 place-items-center border border-alabaster-grey/20 bg-black/70 text-xl text-white backdrop-blur-sm transition-colors hover:border-orange hover:text-orange"
        >
          ×
        </button>

        <div className="grid min-h-[620px] lg:grid-cols-[0.58fr_1.42fr]">
          <div className="fine-grid relative flex min-h-72 flex-col justify-between overflow-hidden border-b border-alabaster-grey/15 bg-prussian-blue p-7 lg:min-h-full lg:border-b-0 lg:border-r lg:p-10">
            {content.image_url && (
              <>
                <Image
                  src={content.image_url}
                  alt={content.image_alt}
                  fill
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-prussian-blue via-prussian-blue/65 to-prussian-blue/20" />
              </>
            )}
            <div>
              <span className="relative font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
                {content.direct_label}
              </span>
              <h3
                id="contact-dialog-title"
                className="relative mt-5 max-w-xs text-2xl font-bold tracking-[-0.04em] text-white"
              >
                {content.direct_title}
              </h3>
            </div>
            <div className="relative mt-12 space-y-5 font-mono text-[10px] uppercase tracking-[0.15em] text-alabaster-grey/60">
              <div className="border-t border-alabaster-grey/20 pt-4">
                <span className="block text-alabaster-grey/35">Timezone</span>
                <span className="mt-1 block text-white">{content.timezone}</span>
              </div>
              <div className="border-t border-alabaster-grey/20 pt-4">
                <span className="block text-alabaster-grey/35">Typical reply</span>
                <span className="mt-1 block text-white">{content.response_time}</span>
              </div>
            </div>
          </div>

          <div className="bg-black p-7 pt-20 sm:p-10 sm:pt-20 lg:p-14">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="font-mono text-[9px] uppercase tracking-[0.18em] text-orange">
                    01 / Your name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClassName}
                    placeholder="What should I call you?"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="font-mono text-[9px] uppercase tracking-[0.18em] text-orange">
                    02 / Your email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClassName}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-project-type" className="font-mono text-[9px] uppercase tracking-[0.18em] text-orange">
                  03 / What are we making?
                </label>
                <select
                  id="contact-project-type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className={`${inputClassName} cursor-pointer`}
                >
                  {content.project_types.map((type) => (
                    <option key={type} value={type} className="bg-black">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="font-mono text-[9px] uppercase tracking-[0.18em] text-orange">
                  04 / Project notes
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className={`${inputClassName} resize-none`}
                  placeholder="The idea, goals, timing—whatever you know so far."
                />
              </div>

              <div aria-live="polite">
                {status === "error" && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-orange">
                    {errorMessage}
                  </p>
                )}
                {status === "success" && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-orange">
                    Message received. I&apos;ll be in touch soon.
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileHover={status === "submitting" ? {} : { x: 4 }}
                whileTap={status === "submitting" ? {} : { scale: 0.99 }}
                className="group inline-flex w-full items-center justify-between border border-orange bg-orange px-6 py-4 text-sm font-bold text-black transition-colors hover:bg-black hover:text-orange disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-56"
              >
                {status === "submitting" ? "Sending..." : content.submit_label}
                <span className="ml-8">→</span>
              </motion.button>
            </form>
          </div>
        </div>
      </dialog>
    </Container>
  );
}
