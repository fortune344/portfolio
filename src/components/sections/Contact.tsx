import { ContactForm } from "@/components/sections/ContactForm";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Reveal } from "@/components/ui/Reveal";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { CONTACT_COPY } from "@/content/site";
import type { Profile } from "@/data/portfolio";

const ROW = "flex items-center justify-between gap-4 border-b border-line py-4 text-sm";

/** Contact : mot géant pleine largeur, coordonnées réelles et formulaire. */
export function Contact({ profile }: { profile: Profile }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="overflow-hidden px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal distance={80} duration={0.9}>
          <p className="mb-4 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
            <span className="text-foreground">06</span>
            <span aria-hidden className="h-px w-8 bg-line" />
            Contact
          </p>
          <h2
            id="contact-title"
            className="text-center font-display text-[clamp(3.6rem,16.5vw,15rem)] uppercase leading-[0.9] tracking-tight"
          >
            {CONTACT_COPY.title}
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-12 md:mt-20 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16">
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed sm:text-xl">{CONTACT_COPY.intro}</p>

            <ul className="mt-10 border-t border-line">
              <li className={ROW}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">E-mail</span>
                <span className="flex items-center gap-3">
                  <TrackedLink
                    href={`mailto:${profile.email}`}
                    track={{ event: "contact_submit", method: "email" }}
                    className="link-underline break-all text-right"
                  >
                    {profile.email}
                  </TrackedLink>
                  <CopyEmail email={profile.email} />
                </span>
              </li>
              <li className={ROW}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Téléphone</span>
                <TrackedLink
                  href={profile.phoneHref}
                  track={{ event: "contact_submit", method: "phone" }}
                  className="link-underline"
                >
                  {profile.phone}
                </TrackedLink>
              </li>
              <li className={ROW}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Réseaux</span>
                <span className="flex gap-5">
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline">
                    LinkedIn
                  </a>
                  <TrackedLink
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    track={{ event: "github_click", link_url: profile.github }}
                    className="link-underline"
                  >
                    GitHub
                  </TrackedLink>
                </span>
              </li>
              <li className={ROW}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Basé à</span>
                <span className="text-right">{profile.location} · missions à distance</span>
              </li>
            </ul>

            {profile.cvUrl ? (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-foreground/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-foreground hover:text-ink"
              >
                Télécharger mon CV (PDF)
              </a>
            ) : null}
          </Reveal>

          <Reveal delay={0.2}>
            <ContactForm email={profile.email} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
