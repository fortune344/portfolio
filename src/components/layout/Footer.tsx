import Link from "next/link";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { CASE_STUDIES } from "@/content/case-studies";
import { NAV_ITEMS } from "@/content/site";
import type { Profile } from "@/data/portfolio";

const HEAD = "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl uppercase leading-none tracking-tight">{profile.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Consultant Power BI et data analyst à {profile.location.split(",")[0]}. Missions au Togo, au Bénin et à
            distance.
          </p>
          <TrackedLink
            href={`mailto:${profile.email}`}
            track={{ event: "contact_submit", method: "email" }}
            className="link-underline mt-5 inline-block text-sm"
          >
            {profile.email}
          </TrackedLink>
        </div>

        <nav aria-label="Plan du site">
          <p className={HEAD}>Navigation</p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_ITEMS.map((n) => (
              <li key={n.id}>
                <Link href={`/#${n.id}`} className="transition-opacity hover:opacity-70">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Études de cas">
          <p className={HEAD}>Études de cas</p>
          <ul className="mt-4 space-y-2 text-sm">
            {CASE_STUDIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/realisations/${c.slug}`} className="transition-opacity hover:opacity-70">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={HEAD}>Ailleurs</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70">
                GitHub
              </a>
            </li>
            {profile.cvUrl ? (
              <li>
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70">
                  CV (PDF)
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:px-8">
          © {new Date().getFullYear()} {profile.name} — Conçu et développé à Lomé
        </p>
      </div>
    </footer>
  );
}
