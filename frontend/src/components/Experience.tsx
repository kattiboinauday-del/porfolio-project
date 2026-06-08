import { Section } from "./Section";
import { Briefcase, GraduationCap } from "lucide-react";
import { useExperience } from "@/lib/api/hooks";

export function Experience() {
  const { data: entries = [], isLoading } = useExperience();

  return (
    <Section id="experience" eyebrow="Journey" title={<>Experience & <span className="text-gradient">Education</span></>}>
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {entries.map((entry) => {
            const isEducation = entry.type === "education";
            return (
              <div key={entry._id ?? entry.title} className="glass rounded-2xl p-6 hover:border-cyan/40 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`rounded-lg p-2 ${isEducation ? "bg-purple/15 text-purple" : "bg-cyan/10 text-cyan"}`}>
                    {isEducation ? <GraduationCap className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className={`font-mono text-xs uppercase tracking-wider ${isEducation ? "text-purple" : "text-cyan"}`}>
                      {isEducation ? "Education" : "Internship"}
                    </p>
                    <h3 className="font-display text-lg font-bold">
                      {entry.title} · {entry.organization}
                    </h3>
                  </div>
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-3">
                  {entry.period}
                  {entry.location ? ` · ${entry.location}` : ""}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
