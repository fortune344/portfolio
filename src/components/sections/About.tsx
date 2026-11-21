import { MethodSteps } from "@/components/sections/MethodSteps";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { APPROACH } from "@/content/site";
import type { Language, Profile } from "@/data/portfolio";

type AboutProps = { profile: Profile; languages: Language[] };

/**
 * Approche : comment je travaille (méthode en 4 étapes), puis qui je suis.
 * La biographie (éditable dans /admin) vient après la méthode : la valeur
 * apportée passe avant le parcours académique.
 */
export function About({ profile, languages }: AboutProps) {
  return (
    <section id="approche" aria-labelledby="approche-title" className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="approche-title" index="03" eyebrow="Approche" title={APPROACH.statement} />

        <div className="grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20">
          <div className="space-y-7">
            <Reveal>
              <p className="text-lg leading-relaxed sm:text-xl">{APPROACH.intro}</p>
            </Reveal>
            {profile.bio.map((paragraph, i) => (
              <Reveal key={i} delay={0.08 + i * 0.08}>
                <p className="leading-relaxed text-muted sm:text-lg">{paragraph}</p>
              </Reveal>
            ))}
            {languages.length > 0 ? (
              <Reveal delay={0.24}>
                <p className="text-sm text-muted">
                  <span className="font-semibold uppercase tracking-[0.18em] text-foreground">Langues · </span>
                  {languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(", ")}
                </p>
              </Reveal>
            ) : null}
          </div>

          <MethodSteps />
        </div>

        <ul className="mt-20 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {APPROACH.principles.map((p, i) => (
            <li key={p} className="bg-background">
              <Reveal delay={i * 0.06} className="h-full p-6">
                <span aria-hidden className="block font-display text-2xl text-foreground/30">0{i + 1}</span>
                <span className="mt-3 block text-sm font-medium leading-snug">{p}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
