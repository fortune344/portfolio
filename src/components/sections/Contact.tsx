import { Reveal } from "@/components/ui/Reveal";
import type { Profile } from "@/data/portfolio";

/** Contact éditorial : mot géant pleine largeur + liens soulignés. */
export function Contact({ profile }: { profile: Profile }) {
  return (
    <section
      id="contact"
      className="flex min-h-[80svh] scroll-mt-16 flex-col justify-center overflow-hidden px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="mx-auto w-full max-w-7xl">
        <Reveal distance={80} duration={0.9}>
          <h2 className="text-center font-display text-[clamp(3.6rem,16.5vw,15rem)] uppercase leading-[0.9] tracking-tight">
            Parlons-en
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 md:mt-24">
          <Reveal delay={0.1}>
            <div>
              <p className="max-w-md text-xs font-semibold uppercase leading-loose tracking-[0.2em] text-muted sm:text-sm">
                Une question, une proposition, un stage ou un projet data à
                confier ?
              </p>
              <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-bold uppercase tracking-[0.15em]">
                <a href={`mailto:${profile.email}`} className="link-underline">
                  Envoyez-moi un e-mail
                </a>
                <span className="font-medium normal-case tracking-normal text-muted">
                  ou
                </span>
                <a href={profile.phoneHref} className="link-underline">
                  Appelez-moi
                </a>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex items-start gap-8 text-base font-medium sm:justify-end">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
              >
                LinkedIn
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
              >
                GitHub
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
