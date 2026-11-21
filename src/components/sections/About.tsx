import { MethodSteps } from "@/components/sections/MethodSteps";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { APPROACH } from "@/content/site";
import type { Language, Profile } from "@/data/portfolio";

type AboutProps = { profile: Profile; languages: Language[] };

/**
 * À propos : qui je suis (bio éditable dans /admin) et comment je travaille.
 */
export function About({ profile, languages }: AboutProps) {
  return (
    <section id="approche" aria-labelledby="approche-title" className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="approche-title" eyebrow="À propos" title={APPROACH.statement} />

        <div className="grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20">
          <div className="space-y-7">
            {profile.bio.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? "text-lg leading-relaxed sm:text-xl" : "leading-relaxed text-muted sm:text-lg"}>
                  {paragraph}
                </p>
              </Reveal>
            ))}
            {languages.length > 0 ? (
              <Reveal delay={0.2}>
                <p className="text-sm text-muted">
                  <span className="font-semibold uppercase tracking-[0.18em] text-foreground">Langues · </span>
                  {languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(", ")}
                </p>
              </Reveal>
            ) : null}
          </div>

          <MethodSteps />
        </div>
      </div>
    </section>
  );
}
