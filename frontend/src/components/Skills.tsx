import { Section } from "./Section";
import { useSkills } from "@/lib/api/hooks";
import { getIcon } from "@/lib/icon-map";

export function Skills() {
  const { data: groups = [], isLoading } = useSkills();

  return (
    <Section id="skills" eyebrow="Skills" title={<>What I <span className="text-gradient">work with</span></>}>
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {groups.map((g) => {
            const Icon = getIcon(g.icon);
            return (
              <div key={g.title} className="glass rounded-2xl p-6 hover:border-cyan/40 transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-cyan/10 p-2 text-cyan">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg">{g.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-sm text-foreground/90 hover:border-cyan/50 hover:text-cyan transition-colors"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
