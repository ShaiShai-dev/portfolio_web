import "server-only";

import { cache } from "react";
import { getSiteSettingsContent } from "@/lib/site-settings";
import { createClient } from "@/lib/supabase/server";

export const getSiteSettings = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();

  return {
    settings: getSiteSettingsContent(data),
    databaseReady: !error,
  };
});
