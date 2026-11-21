"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ServiceGlyph } from "@/components/sections/ServiceGlyph";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CASE_STUDIES } from "@/content/case-studies";
import { SERVICES, type ServiceId } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { SELECT_SERVICE_EVENT } from "@/lib/events";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Présélectionne le service dans le formulaire, puis laisse l'ancre faire défiler. */
function selectService(id: ServiceId) {
  window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: id }));
  trackEvent({ event: "cta_click", cta: `service_${id}` });
}

/**
 * Services : composition éditoriale interactive.
 * Desktop : liste des services à gauche, détail du service actif à droite (sticky).
 * Mobile : accordéon — le même DOM, réorganisé par la grille.
 */
export function Services() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="services" aria-labelledby="services-title" className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          title="Ce que je peux faire pour vous"
        />

        <div className="grid border-t border-line md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:grid-rows-[auto_auto_auto_1fr] md:gap-x-14">
          {SERVICES.map((service, i) => {
            const isActive = i === active;
            const proofs = service.proof
              .map((slug) => CASE_STUDIES.find((c) => c.slug === slug))
              .filter((c) => c !== undefined);
            return (
              <div key={service.id} className="contents">
                <Reveal delay={i * 0.06} className="md:col-start-1">
                  <h3>
                    <button
                      type="button"
                      id={`service-tab-${service.id}`}
                      aria-expanded={isActive}
                      aria-controls={`service-panel-${service.id}`}
                      onClick={() => setActive(i)}
                      className="group flex w-full items-start gap-5 border-b border-line py-6 text-left md:py-8"
                    >
                      <span className="flex-1">
                        <span
                          className={cn(
                            "block font-display text-[clamp(1.75rem,4vw,2.6rem)] uppercase leading-[1] tracking-tight transition-all duration-300 ease-out group-hover:translate-x-1.5",
                            isActive ? "text-foreground" : "text-foreground/45 group-hover:text-foreground/80"
                          )}
                        >
                          {service.title}
                        </span>
                        <span className="mt-2 block text-sm text-muted">
                          {service.short}
                        </span>
                      </span>
                      <Plus
                        size={20}
                        aria-hidden
                        className={cn(
                          "mt-2 shrink-0 transition-transform duration-300 md:hidden",
                          isActive ? "rotate-45" : "rotate-0"
                        )}
                      />
                      <ArrowRight
                        size={20}
                        aria-hidden
                        className={cn(
                          "mt-2 hidden shrink-0 transition-all duration-300 md:block",
                          isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                        )}
                      />
                    </button>
                  </h3>
                </Reveal>

                {/* Détail : sous le bouton sur mobile, colonne de droite (sticky) sur desktop */}
                <div
                  id={`service-panel-${service.id}`}
                  role="region"
                  aria-labelledby={`service-tab-${service.id}`}
                  hidden={!isActive}
                  className="md:col-start-2 md:row-span-4 md:row-start-1"
                >
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <m.div
                        key={service.id}
                        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DURATION.base, ease: EASE.expo }}
                        className="border-b border-line py-8 md:sticky md:top-28 md:border-b-0 md:py-10"
                      >
                        <div className="relative overflow-hidden rounded-[1.75rem] bg-card p-6 sm:p-9">
                          <ServiceGlyph id={service.id} className="absolute right-6 top-6 h-14 w-14 text-foreground/25 sm:h-20 sm:w-20" />

                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-cool">Le problème</p>
                          <p className="mt-2 pr-16 text-base leading-relaxed sm:pr-24 sm:text-lg">{service.problem}</p>

                          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-cool">Ce que je mets en place</p>
                          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{service.solution}</p>

                          <div className="mt-7 flex flex-wrap gap-2">
                            {service.tools.map((t) => (
                              <span key={t} className="rounded-full border border-line px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
                                {t}
                              </span>
                            ))}
                          </div>

                          {proofs.length > 0 ? (
                            <p className="mt-6 text-sm text-muted">
                              Exemples :{" "}
                              {proofs.map((c, j) => (
                                <span key={c.slug}>
                                  {j > 0 ? ", " : null}
                                  <Link href={`/realisations/${c.slug}`} className="link-underline text-foreground">
                                    {c.name}
                                  </Link>
                                </span>
                              ))}
                            </p>
                          ) : null}

                          <a
                            href="#contact"
                            onClick={() => selectService(service.id)}
                            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-transform duration-200 hover:-translate-y-0.5"
                          >
                            Parler de ce besoin
                            <ArrowUpRight size={15} aria-hidden className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </a>
                        </div>
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
