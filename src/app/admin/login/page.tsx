"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { createClient } from "@/lib/supabase/client";

const inputClassName =
  "w-full border border-alabaster-grey/20 bg-black px-4 py-4 text-sm text-white outline-none transition-colors placeholder:text-alabaster-grey/25 focus:border-orange";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Admin sign in"
      title="WELCOME"
      accent="BACK."
      description="Sign in to manage the public portfolio, publish projects, and review new inquiries."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.17em] text-alabaster-grey/55">
            01 / Email address
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

        <div>
          <label htmlFor="admin-password" className="mb-2 block font-mono text-[9px] uppercase tracking-[0.17em] text-alabaster-grey/55">
            02 / Password
          </label>
          <PasswordInput
            id="admin-password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className={inputClassName}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-alabaster-grey/30">
            Secure admin access
          </span>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-alabaster-grey/60 underline decoration-alabaster-grey/25 underline-offset-4 transition-colors hover:text-orange"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p aria-live="polite" className="border-l border-orange bg-orange/10 px-4 py-3 text-sm text-orange">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-between border border-orange bg-orange px-5 py-4 text-sm font-black text-black transition-colors hover:bg-black hover:text-orange disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{loading ? "Authenticating..." : "Enter control room"}</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </form>
    </AuthShell>
  );
}
