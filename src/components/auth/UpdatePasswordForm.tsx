"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { createClient } from "@/lib/supabase/client";

const inputClassName =
  "w-full border border-alabaster-grey/20 bg-black px-4 py-4 text-sm text-white outline-none transition-colors placeholder:text-alabaster-grey/25 focus:border-orange";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="new-password" className="mb-2 block font-mono text-[9px] uppercase tracking-[0.17em] text-alabaster-grey/55">
          01 / New password
        </label>
        <PasswordInput
          id="new-password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 8 characters"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="mb-2 block font-mono text-[9px] uppercase tracking-[0.17em] text-alabaster-grey/55">
          02 / Confirm password
        </label>
        <PasswordInput
          id="confirm-password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          placeholder="Enter the password again"
          className={inputClassName}
        />
      </div>

      <p className="font-mono text-[8px] uppercase leading-5 tracking-[0.14em] text-alabaster-grey/35">
        Use at least eight characters. A longer, unique passphrase is recommended.
      </p>

      {error && (
        <p aria-live="polite" className="border-l border-orange bg-orange/10 px-4 py-3 text-sm text-orange">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="group flex w-full items-center justify-between border border-orange bg-orange px-5 py-4 text-sm font-black text-black transition-colors hover:bg-black hover:text-orange disabled:opacity-50">
        <span>{loading ? "Updating password..." : "Set new password"}</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </button>
    </form>
  );
}
