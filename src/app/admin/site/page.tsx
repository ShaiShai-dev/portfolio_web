import SiteEditorForm, {
  type SiteEditorModule,
} from "@/components/admin/SiteEditorForm";
import { getSiteSettingsContent } from "@/lib/site-settings";
import { createClient } from "@/lib/supabase/server";

const validModules: SiteEditorModule[] = [
  "maintenance",
  "theme",
  "home",
  "projects",
  "about",
  "contact",
];

export default async function AdminSiteEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string | string[] }>;
}) {
  const requestedModule = (await searchParams).module;
  const initialModule =
    typeof requestedModule === "string" &&
    validModules.includes(requestedModule as SiteEditorModule)
      ? (requestedModule as SiteEditorModule)
      : "theme";
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*, maintenance_mode, maintenance_content")
    .eq("id", "main")
    .maybeSingle();

  return (
    <main className="flex-1 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange">
          Portfolio CMS / Viewer website
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Website editor
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-alabaster-grey/65">
          Publish global colors, public copy, list content, calls to action, and
          optional section imagery from one adaptable workspace.
        </p>
        <div className="mt-8">
          <SiteEditorForm
            initialSettings={getSiteSettingsContent(data)}
            databaseReady={!error}
            initialModule={initialModule}
          />
        </div>
      </div>
    </main>
  );
}
