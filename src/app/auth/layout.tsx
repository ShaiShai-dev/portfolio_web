import type { ReactNode } from "react";
import { getSiteSettings } from "@/lib/get-site-settings";
import { themeStyle } from "@/lib/theme-style";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const { settings } = await getSiteSettings();

  return (
    <div style={themeStyle(settings.theme)} className="min-h-full bg-black text-white">
      {children}
    </div>
  );
}
