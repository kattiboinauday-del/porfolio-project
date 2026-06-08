import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { BlogPreview } from "@/components/BlogPreview";
import { Contact } from "@/components/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "K. Uday Kiran — Python & AI/ML Developer" },
      { name: "description", content: "Portfolio of K. Uday Kiran — B.Tech CS student at Velammal Institute of Technology building Python, AI/ML, and computer vision projects." },
      { property: "og:title", content: "K. Uday Kiran — Python & AI/ML Developer" },
      { property: "og:description", content: "Portfolio of K. Uday Kiran — B.Tech CS student building AI/ML & computer vision projects." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <BlogPreview />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
