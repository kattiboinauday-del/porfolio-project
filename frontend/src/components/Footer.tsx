import { Link } from "@tanstack/react-router";
import { Github, Mail, Linkedin } from "lucide-react";
import { useSettings } from "@/lib/api/hooks";

export function Footer() {
  const { data: settings } = useSettings();

  const footerText = settings?.footerText ?? "Built with ♥ by K. Uday Kiran · © 2025";
  const github = settings?.github ?? "https://github.com/kattiboinauday-del";
  const email = settings?.email ?? "kattiboinauday@gmail.com";
  const linkedin = settings?.linkedin || "#";

  return (
    <footer className="border-t border-border/60 mt-20">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-muted-foreground">{footerText}</p>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link>
          <a href={github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-cyan transition-colors">
            <Github className="h-4 w-4" />
          </a>
          <a href={linkedin} className="text-muted-foreground hover:text-cyan transition-colors" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </a>
          <a href={`mailto:${email}`} className="text-muted-foreground hover:text-cyan transition-colors">
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
