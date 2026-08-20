import type { ReactNode } from "react";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-black">
      <AdminNav />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
