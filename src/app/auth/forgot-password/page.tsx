"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { createClient } from "@/lib/supabase/client";

const inputClassName =
  "w-full border border-alabaster-grey/20 bg-black px-4 py-4 text-sm text-white outline-none transition-colors placeholder:text-alabaster-grey/25 focus:border-orange";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo },
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
      description="Request a secure recovery link for the email connected to your portfolio administrator account."
    >
      {sent ? (
        <div className="border border-orange/45 bg-orange/10 p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center border border-orange bg-orange font-bold text-black">
              ✓
            </span>
            <div>
              <p className="font-bold text-white">Check your inbox</p>
              <p className="mt-1 text-xs text-alabaster-grey/50">Recovery request processed</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-alabaster-grey/65">
            If an administrator account exists for <strong className="text-white">{email}</strong>,
            Supabase will send a password-reset link. Check your spam folder if
            it does not arrive shortly.
          </p>
          <button type="button" onClick={() => setSent(false)} className="admin-secondary-button mt-5">
            Try another email
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
            <p aria-live="polite" className="border-l border-orange bg-orange/10 px-4 py-3 text-sm text-orange">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="group flex w-full items-center justify-between border border-orange bg-orange px-5 py-4 text-sm font-black text-black transition-colors hover:bg-black hover:text-orange disabled:opacity-50">
            <span>{loading ? "Requesting link..." : "Send recovery link"}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </form>
      )}

      <Link href="/admin/login" className="mt-6 inline-flex items-center gap-2 text-xs text-alabaster-grey/55 transition-colors hover:text-orange">
        ← Return to sign in
      </Link>
    </AuthShell>
  );
}
