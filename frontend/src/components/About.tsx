import { Section } from "./Section";
import { useProfile } from "@/lib/api/hooks";
import { getIcon } from "@/lib/icon-map";

export function About() {
  const { data: profile, isLoading } = useProfile();

  return (
    <Section id="about" eyebrow="About" title={<>Who I <span className="text-gradient">am</span></>}>
      {isLoading || !profile ? (
        <div className="grid md:grid-cols-[280px_1fr] gap-10">
          <div className="h-56 w-56 rounded-full glass animate-pulse mx-auto md:mx-0" />
          <div className="space-y-4">
            <div className="h-4 glass rounded animate-pulse" />
            <div className="h-4 glass rounded animate-pulse w-3/4" />
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-[280px_1fr] gap-10 items-start">
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan to-purple blur-2xl opacity-60 spin-slow" />
              <div className="relative h-56 w-56 rounded-full glass overflow-hidden ring-2 ring-cyan/40 flex items-center justify-center">
                <span className="font-display text-6xl font-bold text-gradient">{profile.initials}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {profile.aboutParagraphs.map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              {profile.stats.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <div key={s.label} className="glass rounded-xl p-4 hover:border-cyan/40 transition-colors">
                    <Icon className="h-5 w-5 text-cyan mb-2" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className="font-display font-bold text-base mt-1">{s.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
