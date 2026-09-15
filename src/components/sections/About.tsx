import { Reveal } from "@/components/ui/Reveal";
import type { Language, Profile, SkillGroup } from "@/data/portfolio";

type AboutProps = {
  profile: Profile;
  skillGroups: SkillGroup[];
  languages: Language[];
  interests: string[];
};

/**
 * À propos éditorial : bio à gauche, compétences en listes à droite.
 */
export function About({ profile, skillGroups, languages, interests }: AboutProps) {
  return (
    <section id="a-propos" className="scroll-mt-16 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 md:grid-cols-[1.3fr_1fr] md:gap-20">
          {/* Bio */}
          <div className="space-y-7">
            {profile.bio.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-lg leading-relaxed sm:text-xl">{paragraph}</p>
              </Reveal>
            ))}
            <Reveal delay={0.24}>
              <p className="text-lg leading-relaxed text-muted sm:text-xl">
                Loin du clavier, je me ressource entre{" "}
                {interests.map((it) => it.toLowerCase()).join(", ")} — de quoi
                garder l&apos;esprit curieux et créatif.
              </p>
            </Reveal>
          </div>

          {/* Compétences */}
          <div id="competences" className="scroll-mt-24 space-y-9">
            {skillGroups.map((group, i) => (
              <Reveal key={group.title} from="right" delay={i * 0.08}>
                <div>
                  <h3 className="text-lg font-bold">{group.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-muted">
                    {group.skills.join(", ")}.
                  </p>
                </div>
              </Reveal>
            ))}
            <Reveal from="right" delay={0.32}>
              <div>
                <h3 className="text-lg font-bold">Langues</h3>
                <p className="mt-2.5 leading-relaxed text-muted">
                  {languages
                    .map((lang) => `${lang.name} (${lang.level.toLowerCase()})`)
                    .join(", ")}
                  .
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
