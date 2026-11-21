import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { HeroMenuButton, HeroParallax } from "@/components/sections/HeroClient";
import { AvatarArt } from "@/components/ui/AvatarArt";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { HERO, SERVICES } from "@/content/site";
import type { Profile } from "@/data/portfolio";

const d = (delay: number) => ({ "--delay": `${delay}s` }) as CSSProperties;

/**
 * Hero éditorial : nom géant Anton, avatar qui le chevauche, coins d'écran.
 * La proposition de valeur et les deux appels à l'action occupent le bas.
 * Composant serveur : les entrées sont des animations CSS (visibles dès le
 * premier rendu) ; seule la parallaxe au scroll est en JavaScript.
 */
export function Hero({ profile }: { profile: Profile }) {
  const headline = profile.headline?.trim() || HERO.headline;
  const pitch = profile.pitch?.trim() || HERO.pitch;

  return (
    <section id="accueil" className="relative flex min-h-svh flex-col overflow-hidden">
      {/* Coins supérieurs */}
      <div className="hero-fade z-20 flex items-center justify-between p-5 sm:p-8" style={d(0.7)}>
        <a
          href="#contact"
          className="rounded-xl border border-foreground/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-foreground hover:text-ink sm:px-5 sm:text-xs"
        >
          Me contacter
        </a>
        <nav aria-label="Accès rapide" className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#services" className="transition-opacity hover:opacity-70">Services</a>
          <a href="#realisations" className="transition-opacity hover:opacity-70">Réalisations</a>
          <a href="#approche" className="transition-opacity hover:opacity-70">Approche</a>
          {profile.cvUrl ? (
            <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70">
              CV
            </a>
          ) : null}
        </nav>
        <HeroMenuButton />
      </div>

      {/* Nom géant + avatar */}
      <div className="relative z-0 flex flex-1 flex-col items-center justify-center px-4 pb-6 pt-2">
        <HeroParallax className="relative flex flex-col items-center">
          {/* Rôle + disponibilité */}
          <div className="hero-fade mb-6 flex flex-col items-center gap-3 text-center sm:mb-7" style={d(0.45)}>
            {profile.availability ? (
              <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-background/40 px-3.5 py-1.5 text-[11px] font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="pulse-ring absolute inset-0 rounded-full bg-foreground" />
                  <span className="relative h-2 w-2 rounded-full bg-foreground" />
                </span>
                {profile.availability}
              </p>
            ) : null}
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted sm:text-xs">
              {HERO.role}
            </p>
          </div>

          <h1 className="relative text-center font-display uppercase leading-[0.86] tracking-tight">
            {/* Point décoratif flottant, au-dessus du nom (comme dans la version d'origine) */}
            <span aria-hidden className="hero-fade absolute -left-5 top-[0.6em] z-20 sm:-left-12" style={d(1.1)}>
              <span className="block h-4 w-4 animate-float-slow rounded-full bg-foreground sm:h-7 sm:w-7" />
            </span>
            <span className="block overflow-hidden">
              <span className="hero-rise block text-[clamp(3.7rem,min(18vw,17svh),11.5rem)]" style={d(0.15)}>
                {profile.firstName}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-rise block text-[clamp(3.7rem,min(18vw,17svh),11.5rem)]" style={d(0.27)}>
                {profile.lastName}
              </span>
            </span>
            <span className="sr-only">, consultant Power BI et data analyst freelance à Lomé</span>
          </h1>

          {/* Avatar chevauchant le nom */}
          <HeroParallax distance={-50} fade={false} className="z-10 -mt-[0.6rem] sm:-mt-[2.6rem] md:-mt-[3.4rem]">
            <div className="hero-pop group relative" style={d(0.55)}>
              <div className="color-reveal h-28 w-28 overflow-hidden rounded-[1.4rem] border border-foreground/15 bg-[#26272e] shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:h-40 sm:w-40 md:h-48 md:w-48 md:rounded-[2rem]">
                <AvatarArt label={`Illustration de ${profile.name}`} className="block h-full w-full" />
              </div>
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 scale-90 whitespace-nowrap rounded-lg bg-[#f2ecdf] px-4 py-2 text-xs font-semibold text-ink opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                Parlons de vos données !
              </div>
            </div>
          </HeroParallax>
        </HeroParallax>
      </div>

      {/* Bas du hero : proposition de valeur + appels à l'action */}
      <div className="z-10 grid gap-8 p-5 sm:p-8 md:pt-2 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-end md:gap-12">
        <div className="hero-fade max-w-xl" style={d(0.6)}>
          <p className="text-lg font-medium leading-snug sm:text-[1.4rem] sm:leading-snug">{headline}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{pitch}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <TrackedLink
              href="#contact"
              track={{ event: "cta_click", cta: "hero_discutons" }}
              className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-transform duration-200 hover:-translate-y-0.5"
            >
              Discutons de votre projet
              <ArrowUpRight size={15} aria-hidden className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </TrackedLink>
            <TrackedLink
              href="#realisations"
              track={{ event: "cta_click", cta: "hero_realisations" }}
              className="group inline-flex items-center gap-2 rounded-xl border border-foreground/40 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-foreground hover:text-ink"
            >
              Découvrir mes réalisations
              <ArrowDownRight size={15} aria-hidden className="transition-transform duration-200 group-hover:translate-y-0.5" />
            </TrackedLink>
          </div>
        </div>

        <ul
          aria-label="Services"
          className="hero-fade hidden gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] md:grid md:justify-self-end md:text-right"
          style={d(0.75)}
        >
          {SERVICES.map((s) => (
            <li key={s.id}>
              <a href="#services" className="text-muted transition-colors hover:text-foreground">
                <span className="mr-3 text-foreground/70">{s.number}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
