"use client";

import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/portfolio";
import { trackEvent } from "@/lib/analytics";
import { EASE, VIEWPORT } from "@/lib/motion";

/**
 * Liste compacte des autres travaux (contenu éditable dans /admin).
 * Sur écran avec souris, un aperçu de la capture suit le pointeur au survol d'une ligne.
 */
export function OtherWork({ projects }: { projects: Project[] }) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<Project | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  return (
    <div
      className="relative border-t border-line"
      onMouseMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onMouseLeave={() => setHovered(null)}
    >
      <ul>
        {projects.map((project, i) => {
          const href = project.liveUrl || project.github || undefined;
          const onClick = () => {
            trackEvent({ event: "project_click", project_name: project.title });
            if (href?.includes("github.com")) trackEvent({ event: "github_click", link_url: href });
          };
          const inner = (
            <>
              <span className="w-8 shrink-0 pt-1 text-[11px] font-semibold tabular-nums tracking-[0.15em] text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold transition-transform duration-300 ease-out group-hover:translate-x-1 sm:text-lg">
                  {project.title}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-[0.15em] text-muted-cool">
                  {project.tags.join(" · ")}
                </span>
              </span>
              <span className="hidden shrink-0 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:block">
                {project.category}
              </span>
              {href ? (
                <ArrowUpRight
                  size={20}
                  aria-hidden
                  className="shrink-0 text-muted-cool transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground"
                />
              ) : null}
            </>
          );
          const rowClass =
            "group flex items-start gap-4 border-b border-line py-5 transition-colors duration-200 hover:bg-white/[0.02] sm:gap-6 sm:py-6";
          return (
            <m.li
              key={project.title}
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.04, ease: EASE.standard }}
              onMouseEnter={() => setHovered(project.image ? project : null)}
            >
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClick}
                  className={rowClass}
                  aria-label={`${project.title} — ${project.description}`}
                >
                  {inner}
                </a>
              ) : (
                <div className={rowClass}>{inner}</div>
              )}
            </m.li>
          );
        })}
      </ul>

      {/* Aperçu flottant (souris uniquement, masqué sur tactile) */}
      {/* Toujours rendu (même arbre serveur / client) ; vide en mouvement réduit. */}
      <m.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 hidden [@media(hover:hover)]:block"
          style={{ x: sx, y: sy }}
        >
          <AnimatePresence>
            {hovered?.image && !reduceMotion ? (
              <m.div
                key={hovered.title}
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: EASE.expo }}
                className="relative ml-6 mt-6 h-[170px] w-[280px] overflow-hidden rounded-xl border border-white/10 bg-[#151721] shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
              >
                <Image src={hovered.image} alt="" fill sizes="280px" className="object-cover object-top" />
              </m.div>
            ) : null}
          </AnimatePresence>
        </m.div>
    </div>
  );
}
