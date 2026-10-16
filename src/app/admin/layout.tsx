import type { ReactNode } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { getSiteSettings } from "@/lib/get-site-settings";
import { themeStyle } from "@/lib/theme-style";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { settings } = await getSiteSettings();

  return (
    <div
      style={themeStyle(settings.theme)}
      className="flex min-h-full flex-1 flex-col bg-black text-white"
    >
      <AdminNav />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
