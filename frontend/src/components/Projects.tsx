import { Section } from "./Section";
import { Github, ExternalLink, Calendar } from "lucide-react";
import { useProjects } from "@/lib/api/hooks";

export function Projects() {
  const { data: projects = [], isLoading } = useProjects();

  return (
    <Section id="projects" eyebrow="Projects" title={<>Things I've <span className="text-gradient">built</span></>}>
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <article
              key={p.title}
              className="group glass rounded-2xl p-6 flex flex-col gap-4 hover:border-cyan/50 hover:-translate-y-1 transition-all hover:glow-cyan-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl font-bold leading-tight group-hover:text-cyan transition-colors">
                  {p.title}
                </h3>
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-lg glass p-2 hover:bg-cyan hover:text-background transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {p.period}
                </span>
                <span className="text-cyan">{p.stack}</span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>

              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-md bg-secondary/60 px-2.5 py-1 text-xs font-mono text-foreground/80">
                    {t}
                  </span>
                ))}
              </div>

              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-cyan hover:underline mt-1"
                >
                  View on GitHub <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}
