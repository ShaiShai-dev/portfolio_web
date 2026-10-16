import SiteProfileForm from "@/components/admin/SiteProfileForm";
import { getSiteProfileContent } from "@/lib/site-profile";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAboutPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_profile")
    .select("*")
    .eq("id", "main")
    .maybeSingle();

  return (
    <main className="flex-1 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange">
          Content system / About
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Edit the About section
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-alabaster-grey/65">
          Update your identity, education, resume, certificates and achievements,
          animated technology roll, and social contact links. Custom sections can
          be reordered and expanded without changing the public page code.
        </p>

        <div className="mt-8">
          <SiteProfileForm
            initialProfile={getSiteProfileContent(data)}
            databaseReady={!error}
          />
        </div>
      </div>
    </main>
  );
}
