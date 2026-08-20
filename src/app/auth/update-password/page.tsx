import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/forgot-password");

  return (
    <AuthShell
      eyebrow="Password recovery"
      title="NEW"
      accent="PASSWORD."
      description="Choose a new administrator password to restore access to your portfolio workspace."
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
