import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ProjectsGallery } from "@/components/home/ProjectsGallery";
import { About } from "@/components/home/About";
import { ContactForm } from "@/components/home/ContactForm";
import { getSiteSettings } from "@/lib/get-site-settings";
import { themeStyle } from "@/lib/theme-style";

export default async function Home() {
  const { settings } = await getSiteSettings();

  return (
    <div
      style={themeStyle(settings.theme)}
      className="flex min-h-screen flex-col bg-black text-white"
    >
      <Navbar />
      <main className="flex-1">
        <Hero content={settings.home_content} />
        <section id="projects" className="scroll-mt-16 bg-black">
          <ProjectsGallery content={settings.projects_content} />
        </section>
        <section id="about" className="scroll-mt-16">
          <About />
        </section>
        <section id="contact" className="scroll-mt-16 bg-black">
          <ContactForm content={settings.contact_content} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
