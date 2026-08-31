"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { createClient } from "@/lib/supabase/client";

const inputClassName =
  "w-full border border-alabaster-grey/20 bg-black px-4 py-4 text-sm text-white outline-none transition-colors placeholder:text-alabaster-grey/25 focus:border-orange";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const errorCode =
      hash.get("error_code") ??
      hash.get("error") ??
      query.get("error_code") ??
      query.get("error");
    const description =
      hash.get("error_description") ?? query.get("error_description");

    if (!errorCode && !description) return;

    let message =
      description?.replaceAll("+", " ") ||
      "The recovery link could not be verified. Request a new link below.";

    if (errorCode === "otp_expired" || errorCode === "access_denied") {
      message =
        "This recovery link has expired or was already used. Request a fresh link below and open only the newest email.";
    } else if (errorCode === "missing_session") {
      message =
        "Your recovery session is no longer active. Request a new link to continue.";
    }

    const errorTimer = window.setTimeout(() => setError(message), 0);

    return () => window.clearTimeout(errorTimer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const confirmUrl = new URL("/auth/confirm", window.location.origin);
    confirmUrl.searchParams.set("next", "/auth/update-password");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: confirmUrl.toString() },
    );

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="RESET"
      accent="ACCESS."
      description="Request a secure, one-time recovery link for your portfolio administrator account."
    >
      {sent ? (
        <div className="border border-orange/45 bg-orange/10 p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center border border-orange bg-orange font-bold text-black">
              ✓
            </span>
            <div>
              <p className="font-bold text-white">Check your inbox</p>
              <p className="mt-1 text-xs text-alabaster-grey/50">
                Recovery request processed
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-alabaster-grey/65">
            If an administrator account exists for{" "}
            <strong className="text-white">{email}</strong>, a password-reset
            link will arrive shortly. Check your spam folder as well.
          </p>
          <div className="mt-5 border-t border-alabaster-grey/15 pt-5">
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-alabaster-grey/40">
              Link checklist
            </p>
            <ol className="mt-3 space-y-2 text-xs leading-5 text-alabaster-grey/60">
              <li>01 / Open only the most recent recovery email.</li>
              <li>02 / Each recovery link can be used only once.</li>
              <li>03 / Request another link if it reports as expired.</li>
            </ol>
          </div>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setError("");
            }}
            className="admin-secondary-button mt-5"
          >
            Send another link
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.17em] text-alabaster-grey/55">
              01 / Administrator email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              className={inputClassName}
            />
          </label>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="border border-orange/35 bg-orange/10 p-4"
            >
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-orange">
                Recovery link unavailable
              </p>
              <p className="mt-2 text-sm leading-6 text-alabaster-grey/75">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-between border border-orange bg-orange px-5 py-4 text-sm font-black text-black transition-colors hover:bg-black hover:text-orange disabled:opacity-50"
          >
            <span>{loading ? "Requesting link..." : "Send recovery link"}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </form>
      )}

      <Link
        href="/admin/login"
        className="mt-6 inline-flex items-center gap-2 text-xs text-alabaster-grey/55 transition-colors hover:text-orange"
      >
        ← Return to sign in
      </Link>
    </AuthShell>
  );
}
