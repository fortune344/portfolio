"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Project, ProjectCategory } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const ALL = "Tout";
type Filter = typeof ALL | ProjectCategory;

/** Même courbe que `Reveal`, pour une entrée/sortie cohérente avec les cartes. */
const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * Élément de la grille filtrée : apparition au scroll (comme `Reveal`),
 * sortie en fondu et repositionnement fluide des voisins au changement de filtre.
 */
function FilterItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      layout
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.25, ease: EASE } }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const COMPACT_ROW =
  "group flex items-center justify-between gap-6 border-b border-line py-6 transition-colors duration-200 hover:bg-white/[0.02]";

/** Grille de projets avec barre de filtres par catégorie (état local). */
export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Filter>(ALL);

  // Catégories dérivées des données, dans leur ordre d'apparition.
  const filters = useMemo<Filter[]>(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );

  const visible = active === ALL ? projects : projects.filter((p) => p.category === active);
  const featured = visible.filter((p) => p.featured);
  const others = visible.filter((p) => !p.featured);

  return (
    <>
      <div
        role="group"
        aria-label="Filtrer les projets par catégorie"
        className="mb-10 flex flex-wrap gap-2.5 md:mb-14"
      >
        {filters.map((filter) => {
          const pressed = filter === active;
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={pressed}
              onClick={() => setActive(filter)}
              className={cn(
                "rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-panel",
                pressed
                  ? "border-foreground bg-foreground text-ink"
                  : "border-line text-muted hover:border-foreground/60 hover:text-foreground"
              )}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="space-y-6 md:space-y-8">
        <AnimatePresence initial={false} mode="popLayout">
          {featured.map((project, i) => (
            <FilterItem key={project.title}>
              <ProjectCard project={project} reversed={i % 2 === 1} />
            </FilterItem>
          ))}
        </AnimatePresence>
      </div>

      {/* Autres projets, en format compact */}
      {others.length > 0 ? (
        <div className={cn("border-t border-line", featured.length > 0 && "mt-14")}>
          <AnimatePresence initial={false} mode="popLayout">
            {others.map((project) => {
              const href = project.liveUrl || project.github || undefined;
              const inner = (
                <>
                  <div>
                    <h3 className="text-base font-semibold sm:text-lg">{project.title}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-cool">
                      {project.tags.join(" · ")}
                    </p>
                  </div>
                  {href ? (
                    <ArrowUpRight
                      size={20}
                      className="shrink-0 text-muted-cool transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground"
                    />
                  ) : null}
                </>
              );
              return (
                <FilterItem key={project.title}>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={COMPACT_ROW}>
                      {inner}
                    </a>
                  ) : (
                    <div className={COMPACT_ROW}>{inner}</div>
                  )}
                </FilterItem>
              );
            })}
          </AnimatePresence>
        </div>
      ) : null}
    </>
  );
}
