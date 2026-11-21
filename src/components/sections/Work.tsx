import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { OtherWork } from "@/components/sections/OtherWork";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { CASE_STUDIES, isCoveredByCaseStudy, type CaseStudy } from "@/content/case-studies";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type WorkProps = { projects: Project[]; githubUrl: string };

/** Cadre « fenêtre » autour d'une capture réelle : gris au repos, couleur et zoom léger au survol. */
function Screenshot({ study, sizes, priority = false }: { study: CaseStudy; sizes: string; priority?: boolean }) {
  return (
    <div className="rounded-[1.1rem] border border-white/10 bg-[#0e0f14] p-1.5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-2">
      <div className="flex items-center gap-1.5 px-2 pb-2 pt-1" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/10" />
      </div>
      <div className="relative aspect-[16/9.5] overflow-hidden rounded-[0.7rem] bg-[#151721]">
        <Image
          src={study.cover.src}
          alt={study.cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="color-reveal object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      </div>
    </div>
  );
}

function Meta({ study }: { study: CaseStudy }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-cool">
      <span>{study.sector}</span>
      <span aria-hidden>·</span>
      <span>{study.year}</span>
      {study.status ? (
        <span className="rounded-full border border-dashed border-foreground/40 px-2.5 py-0.5 text-foreground">{study.status}</span>
      ) : null}
    </p>
  );
}

function ReadMore() {
  return (
    <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
      <span className="link-underline">Lire l&apos;étude de cas</span>
      <ArrowUpRight size={15} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </span>
  );
}

/** Grande carte de l'étude de cas principale. */
function LeadCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/realisations/${study.slug}`}
      data-cursor="Voir l'étude"
      className="group block rounded-[2rem] bg-card p-5 transition-colors duration-500 hover:bg-[#232838] sm:p-8 md:rounded-[2.5rem] md:p-12"
    >
      <article className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <Screenshot study={study} sizes="(min-width: 768px) 55vw, 100vw" />
        </div>
        <div className="md:col-span-5">
          <Meta study={study} />
          <h3 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.6rem)] uppercase leading-[0.95] tracking-tight">
            {study.name}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-cool sm:text-base">{study.summary}</p>
          {study.figures ? (
            <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-line pt-6">
              {study.figures.slice(0, 2).map((f) => (
                <div key={f.label}>
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">{f.label}</dt>
                  <dd className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">
                    <Counter value={f.value} decimals={f.decimals} prefix={f.prefix} suffix={f.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em]">{study.tools.join(" · ")}</p>
          <ReadMore />
        </div>
      </article>
    </Link>
  );
}

/** Carte standard (paire). */
function Card({ study, figure = true }: { study: CaseStudy; figure?: boolean }) {
  const f = figure ? study.figures?.[0] : undefined;
  return (
    <Link
      href={`/realisations/${study.slug}`}
      data-cursor="Voir l'étude"
      className="group flex h-full flex-col rounded-[2rem] bg-card p-5 transition-colors duration-500 hover:bg-[#232838] sm:p-7"
    >
      <article className="flex h-full flex-col">
        <Screenshot study={study} sizes="(min-width: 768px) 45vw, 100vw" />
        <div className="mt-7 flex flex-1 flex-col">
          <Meta study={study} />
          <div className="mt-4 flex items-end justify-between gap-4">
            <h3 className="font-display text-[clamp(1.9rem,3.6vw,2.6rem)] uppercase leading-[0.95] tracking-tight">{study.name}</h3>
            {f ? (
              <p className="shrink-0 text-right">
                <span className="block font-display text-3xl tracking-tight">
                  <Counter value={f.value} decimals={f.decimals} prefix={f.prefix} suffix={f.suffix} />
                </span>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-muted">{f.label}</span>
              </p>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-cool">{study.summary}</p>
          <p className="mt-auto pt-5 text-xs font-bold uppercase tracking-[0.15em]">{study.tools.slice(0, 4).join(" · ")}</p>
          <ReadMore />
        </div>
      </article>
    </Link>
  );
}

/**
 * Réalisations, hiérarchisées par pertinence commerciale :
 * 1. l'étude phare (pilotage commercial, cœur de l'offre Power BI) ;
 * 2. les analyses de données ; 3. les solutions web ;
 * 4. les autres travaux (contenu Supabase), en liste compacte.
 */
export function Work({ projects, githubUrl }: WorkProps) {
  const [lead, ...rest] = CASE_STUDIES;
  const data = rest.filter((c) => c.kind === "data");
  const web = rest.filter((c) => c.kind === "web");
  const others = projects.filter((p) => !isCoveredByCaseStudy(p));

  return (
    <section id="realisations" aria-labelledby="realisations-title" className="bg-panel py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="realisations-title"
          index="02"
          eyebrow="Réalisations"
          title="Des analyses qui répondent à des questions business"
          description="Études de cas complètes : le contexte, les données, la méthode et ce que les chiffres ont révélé. Captures réelles des tableaux de bord et des applications."
        />

        <Reveal>
          <LeadCard study={lead} />
        </Reveal>

        <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2 md:gap-8">
          {data.map((study, i) => (
            <Reveal key={study.slug} delay={i * 0.1} className="h-full">
              <Card study={study} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mb-8 mt-20 flex items-end justify-between gap-6 border-b border-line pb-5">
          <h3 className="font-display text-3xl uppercase tracking-tight sm:text-4xl">Solutions web</h3>
          <p className="max-w-xs text-right text-xs text-muted">Applications métier développées de bout en bout.</p>
        </Reveal>
        <div className={cn("grid gap-6 md:gap-8", web.length > 1 && "md:grid-cols-2")}>
          {web.map((study, i) => (
            <Reveal key={study.slug} delay={i * 0.1} className="h-full">
              <Card study={study} figure={false} />
            </Reveal>
          ))}
        </div>

        {others.length > 0 ? (
          <div className="mt-20">
            <Reveal className="mb-2 flex items-end justify-between gap-6">
              <h3 className="font-display text-3xl uppercase tracking-tight sm:text-4xl">Autres travaux</h3>
              <p className="max-w-xs text-right text-xs text-muted">Exercices, hackathon et outils, avec leur code source.</p>
            </Reveal>
            <OtherWork projects={others} />
          </div>
        ) : null}

        <Reveal delay={0.1} className="mt-14 text-center">
          <TrackedLink
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            track={{ event: "github_click", link_url: githubUrl }}
            className="inline-flex items-center gap-3 rounded-xl border border-foreground/40 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-foreground hover:text-ink"
          >
            <GithubIcon size={16} />
            Tout mon code sur GitHub
          </TrackedLink>
        </Reveal>
      </div>
    </section>
  );
}
