import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { useProfile, useSettings } from "@/lib/api/hooks";

const defaultRoles = [
  "B.Tech CSE Student",
  "Python Developer",
  "AI/ML Enthusiast",
  "Computer Vision Builder",
];

function Typewriter({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (roles.length === 0) return;
    const current = roles[i];
    const speed = deleting ? 40 : 80;
    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), 1400);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setI((p) => (p + 1) % roles.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, i, roles]);

  return (
    <span className="text-gradient">
      {text}
      <span className="cursor-blink text-cyan">|</span>
    </span>
  );
}

export function Hero() {
  const { data: profile } = useProfile();
  const { data: settings } = useSettings();

  const roles = profile?.roles?.length ? profile.roles : defaultRoles;
  const name = profile?.name ?? "K. Uday Kiran";
  const nameParts = name.split(" ");
  const firstName = nameParts.slice(0, -1).join(" ") || name;
  const lastName = nameParts[nameParts.length - 1] ?? "";
  const availability = profile?.availability ?? "Available for internships & collaborations";
  const description = profile?.heroDescription ?? "Passionate about building intelligent systems.";
  const resumeUrl = settings?.resumeUrl ?? "http://localhost:3001/api/resume";

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-cyan/20 blur-3xl float-y" />
        <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-purple/20 blur-3xl float-y" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-cyan/10 blur-2xl float-y" style={{ animationDelay: "2.8s" }} />
      </div>

      <div className="mx-auto max-w-6xl px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start gap-6 max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono text-cyan">
            <Sparkles className="h-3.5 w-3.5" />
            {availability}
          </span>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05]">
            {firstName} <span className="text-gradient">{lastName}</span>
          </h1>

          <h2 className="font-display text-2xl md:text-4xl font-semibold text-muted-foreground min-h-[3rem]">
            <Typewriter roles={roles} />
          </h2>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-3 text-sm font-semibold text-background glow-cyan-sm hover:glow-cyan transition-all hover:-translate-y-0.5"
            >
              View My Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg glass px-6 py-3 text-sm font-semibold hover:border-cyan/50 transition-all hover:-translate-y-0.5"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </div>

          <div className="pt-6 font-mono text-xs text-muted-foreground/70">
            <span className="text-cyan">$</span> whoami → cs_student && code && ship
          </div>
        </motion.div>
      </div>
    </section>
  );
}
