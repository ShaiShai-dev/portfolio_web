import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectsGallery } from "@/components/home/ProjectsGallery";
import { getSiteSettings } from "@/lib/get-site-settings";
import { themeStyle } from "@/lib/theme-style";

export const metadata: Metadata = {
  title: "Projects — SHAI",
  description: "Web and mobile development case studies by SHAI.",
};

export default async function ProjectsPage() {
  const { settings } = await getSiteSettings();

  return (
    <div
      style={themeStyle(settings.theme)}
      className="flex min-h-screen flex-col bg-black text-white"
    >
      <Navbar />
      <main className="flex-1">
        <ProjectsGallery
          archive
          content={settings.projects_content}
        />
      </main>
      <Footer />
    </div>
  );
}
