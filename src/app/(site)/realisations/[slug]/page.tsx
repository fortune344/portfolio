import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { BarChart } from "@/components/case-study/BarChart";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { RiseText } from "@/components/ui/RiseText";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { CASE_STUDIES, getCaseStudy, getNextCaseStudy, type CaseImage } from "@/content/case-studies";
import { SERVICES, SITE_URL } from "@/content/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const url = `/realisations/${study.slug}`;
  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: study.title, description: study.summary },
    twitter: { card: "summary_large_image", title: study.title, description: study.summary },
  };
}

/** Bloc de contenu : intitulé collant à gauche, contenu à droite. */
function Block({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section aria-labelledby={id} className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
      <Reveal className="md:col-span-4">
        <h2 id={id} className="font-display text-2xl uppercase tracking-tight md:sticky md:top-28 md:text-3xl">
          {title}
        </h2>
      </Reveal>
      <div className="md:col-span-8">{children}</div>
    </section>
  );
}

function Shot({ image, sizes, priority = false }: { image: CaseImage; sizes: string; priority?: boolean }) {
  return (
    <figure>
      <div className="rounded-[1.1rem] border border-white/10 bg-[#0e0f14] p-1.5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-2">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full rounded-[0.7rem]"
        />
      </div>
      {image.caption ? <figcaption className="mt-3 text-xs text-muted">{image.caption}</figcaption> : null}
    </figure>
  );
}

const List = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3 leading-relaxed text-muted sm:text-lg">
        <span aria-hidden className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const next = getNextCaseStudy(study.slug);
  const service = SERVICES.find((s) => s.id === study.service);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: study.title,
        description: study.summary,
        url: `${SITE_URL}/realisations/${study.slug}`,
        image: `${SITE_URL}${study.cover.src}`,
        author: { "@id": `${SITE_URL}/#person` },
        dateCreated: study.year,
        keywords: study.tools.join(", "),
        inLanguage: "fr",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Réalisations", item: `${SITE_URL}/#realisations` },
          { "@type": "ListItem", position: 3, name: study.name, item: `${SITE_URL}/realisations/${study.slug}` },
        ],
      },
    ],
  };

  return (
    <article className="pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* En-tête */}
      <header className="mx-auto max-w-6xl px-5 pb-12 pt-28 sm:px-8 md:pt-36">
        <nav aria-label="Fil d'Ariane" className="hero-fade text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          <Link href="/#realisations" className="group inline-flex items-center gap-2 transition-colors hover:text-foreground">
            <ArrowLeft size={14} aria-hidden className="transition-transform group-hover:-translate-x-1" />
            Réalisations
          </Link>
        </nav>

        <p className="hero-fade mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-cool" style={{ "--delay": "0.1s" } as CSSProperties}>
          <span>{study.sector}</span>
          <span aria-hidden>·</span>
          <span>{study.context}</span>
          <span aria-hidden>·</span>
          <span>{study.year}</span>
          {study.status ? (
            <span className="rounded-full border border-dashed border-foreground/40 px-2.5 py-0.5 text-foreground">{study.status}</span>
          ) : null}
        </p>

        <RiseText
          text={study.title}
          className="mt-5 max-w-5xl font-display text-[clamp(2.6rem,7vw,5.6rem)] uppercase leading-[1] tracking-tight"
        />

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <div className="hero-fade md:col-span-7" style={{ "--delay": "0.35s" } as CSSProperties}>
            <p className="text-lg leading-relaxed sm:text-2xl sm:leading-snug">{study.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {study.links.map((link) => (
                <TrackedLink
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  track={link.kind === "github" ? { event: "github_click", link_url: link.href } : { event: "project_click", project_name: study.name }}
                  className={
                    link.kind === "live"
                      ? "inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-transform hover:-translate-y-0.5"
                      : "inline-flex items-center gap-2 rounded-xl border border-foreground/40 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-foreground hover:text-ink"
                  }
                >
                  {link.kind === "github" ? <GithubIcon size={15} /> : <ArrowUpRight size={15} aria-hidden />}
                  {link.label}
                </TrackedLink>
              ))}
            </div>
          </div>
          <div className="hero-fade md:col-span-5" style={{ "--delay": "0.45s" } as CSSProperties}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 text-sm md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <div className="col-span-2">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Outils</dt>
                <dd className="mt-1.5">{study.tools.join(" · ")}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Livrables</dt>
                <dd className="mt-1.5">{study.deliverables.join(" · ")}</dd>
              </div>
              {service ? (
                <div className="col-span-2">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Service associé</dt>
                  <dd className="mt-1.5">
                    <Link href="/#services" className="link-underline">{service.title}</Link>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      </header>

      {/* Capture principale, pleine largeur */}
      <div className="hero-fade mx-auto max-w-7xl px-3 sm:px-6" style={{ "--delay": "0.55s" } as CSSProperties}>
        <Shot image={study.cover} sizes="(min-width: 1280px) 1240px, 100vw" priority />
      </div>

      {/* Chiffres clés réels */}
      {study.figures ? (
        <section aria-label="Chiffres clés" className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line md:grid-cols-4">
            {study.figures.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.06} className="flex flex-col-reverse justify-end bg-background p-5 sm:p-7">
                <dt className="mt-3 text-xs uppercase tracking-[0.14em] text-muted">{f.label}</dt>
                <dd className="font-display text-[clamp(2rem,4.4vw,3.3rem)] leading-none tracking-tight">
                  <Counter value={f.value} decimals={f.decimals} prefix={f.prefix} suffix={f.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
          {study.figuresSource ? (
            <p className="mt-3 text-[11px] text-muted">Source : {study.figuresSource}</p>
          ) : null}
        </section>
      ) : null}

      <div className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
        <Block title="Le problème" id="probleme">
          <Reveal>
            <p className="text-xl leading-relaxed sm:text-2xl sm:leading-snug">{study.problem}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-cool">Objectifs</p>
            <List items={study.objectives} />
          </Reveal>
        </Block>

        <Block title={study.kind === "data" ? "Les données" : "La stack"} id="donnees">
          <Reveal>
            <dl className="grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2">
              {study.facts.map((f) => (
                <div key={f.label} className="bg-background p-5">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{f.label}</dt>
                  <dd className="mt-1.5 text-lg font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          {study.dataNote ? (
            <Reveal delay={0.1}>
              <p className="mt-5 text-sm leading-relaxed text-muted">{study.dataNote}</p>
            </Reveal>
          ) : null}
        </Block>

        <Block title="La méthode" id="methode">
          <ol className="grid gap-4 sm:grid-cols-2">
            {study.method.map((m, i) => (
              <Reveal as="li" key={m.title} delay={i * 0.08} className="h-full rounded-[1.25rem] bg-card p-6">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-muted">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-2xl uppercase tracking-tight">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{m.text}</p>
              </Reveal>
            ))}
          </ol>
        </Block>

        <Block title={study.insightsTitle} id="resultats">
          <ol className="space-y-6">
            {study.insights.map((insight, i) => (
              <Reveal as="li" key={insight} delay={i * 0.05} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line pb-6 last:border-0">
                  <span aria-hidden className="font-display text-xl text-foreground/60">{String(i + 1).padStart(2, "0")}</span>
                  <p className="leading-relaxed sm:text-lg">{insight}</p>
              </Reveal>
            ))}
          </ol>
          {study.chart ? (
            <Reveal className="mt-10">
              <BarChart chart={study.chart} />
            </Reveal>
          ) : null}
        </Block>

        {study.recommendations ? (
          <Block title="Recommandations" id="recommandations">
            <Reveal>
              <List items={study.recommendations} />
            </Reveal>
          </Block>
        ) : null}

        <Block title="À garder en tête" id="limites">
          <Reveal>
            <List items={study.limits} />
          </Reveal>
        </Block>

        {study.gallery.length > 0 ? (
          <Block title="En images" id="galerie">
            <div className="grid gap-10">
              {study.gallery.map((img, i) => (
                <Reveal key={img.src} delay={i * 0.05}>
                  <Shot image={img} sizes="(min-width: 768px) 760px, 100vw" />
                </Reveal>
              ))}
            </div>
          </Block>
        ) : null}
      </div>

      {/* Appel à l'action contextualisé */}
      <section className="mx-auto mt-10 max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-foreground p-8 text-ink sm:p-12 md:flex-row md:items-center">
            <div>
              <p className="font-display text-[clamp(2rem,4.5vw,3.4rem)] uppercase leading-[0.95] tracking-tight">
                Un besoin similaire ?
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
                {service ? `${service.title} : ${service.short.toLowerCase()}` : "Parlons de vos données."}
              </p>
            </div>
            <Link
              href={`/?service=${study.service}#contact`}
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-transform hover:-translate-y-0.5"
            >
              Discutons de votre projet
              <ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Étude suivante */}
      <nav aria-label="Étude de cas suivante" className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <Link href={`/realisations/${next.slug}`} data-cursor="Suivante" className="group block border-t border-line pt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">Étude suivante</p>
          <p className="mt-3 flex items-end justify-between gap-6">
            <span className="font-display text-[clamp(2.6rem,9vw,7rem)] uppercase leading-[0.9] tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
              {next.name}
            </span>
            <ArrowUpRight
              size={56}
              aria-hidden
              className="mb-2 hidden shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:translate-x-2 sm:block"
            />
          </p>
          <p className="mt-3 max-w-xl text-sm text-muted">{next.summary}</p>
        </Link>
      </nav>
    </article>
  );
}
