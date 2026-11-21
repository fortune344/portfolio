import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SKILL_LEVEL_LABEL } from "@/content/site";
import type { SkillGroup, SkillLevel } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const ORDER: Record<SkillLevel, number> = { principal: 0, regulier: 1, complementaire: 2 };

/** Pastille de niveau : pleine / contour / pointillé (même grammaire que le parcours). */
const LEVEL_STYLE: Record<SkillLevel, string> = {
  principal: "border-foreground bg-foreground text-ink",
  regulier: "border-foreground/50 text-foreground",
  complementaire: "border-dashed border-foreground/35 text-muted",
};

/**
 * Compétences par domaine. Pas de barres ni de pourcentages : chaque domaine
 * indique sa place dans mon activité et un exemple concret d'utilisation.
 * Contenu éditable dans /admin → Compétences.
 */
export function Skills({ groups }: { groups: SkillGroup[] }) {
  const sorted = [...groups].sort(
    (a, b) => ORDER[a.level ?? "regulier"] - ORDER[b.level ?? "regulier"]
  );

  return (
    <section id="competences" aria-labelledby="competences-title" className="bg-panel px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="competences-title"
          index="04"
          eyebrow="Compétences"
          title="Les outils, au service de la méthode"
          description="Classés par place réelle dans mon travail : ce que je pratique au quotidien, ce que j'utilise régulièrement en projet, et ce qui vient en complément."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {sorted.map((group, i) => {
            const level = group.level ?? "regulier";
            return (
              <Reveal key={group.title} delay={(i % 2) * 0.08} className="h-full">
                <article
                  className={cn(
                    "flex h-full flex-col rounded-[1.75rem] border p-6 transition-colors duration-300 sm:p-8",
                    level === "principal" ? "border-foreground/25 bg-card" : "border-line bg-background/40 hover:border-foreground/25"
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                    <h3 className="font-display text-2xl uppercase leading-none tracking-tight sm:text-3xl">{group.title}</h3>
                    <span className={cn("shrink-0 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", LEVEL_STYLE[level])}>
                      {SKILL_LEVEL_LABEL[level]}
                    </span>
                  </div>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {group.skills.map((s) => (
                      <li key={s} className="rounded-lg bg-white/[0.05] px-3 py-1.5 text-sm">
                        {s}
                      </li>
                    ))}
                  </ul>
                  {group.note ? (
                    <p className="mt-auto pt-6 text-sm leading-relaxed text-muted">
                      <span aria-hidden className="mr-2 text-foreground">→</span>
                      {group.note}
                    </p>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
