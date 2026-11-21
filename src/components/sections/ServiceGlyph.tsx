"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ServiceId } from "@/content/site";
import { EASE } from "@/lib/motion";

/**
 * Pictogrammes au trait des services, dessinés à l'apparition (pathLength).
 * Purement décoratifs : aucun chiffre, aucune donnée.
 */
const PATHS: Record<ServiceId, string[]> = {
  // Barres + courbe de tendance
  powerbi: ["M8 72V52", "M24 72V40", "M40 72V46", "M56 72V28", "M72 72V20", "M6 44 L24 30 L40 36 L56 18 L74 10", "M2 76H78"],
  // Nuage de points + droite d'ajustement
  analyse: ["M10 62a2 2 0 1 0 0.1 0", "M22 54a2 2 0 1 0 0.1 0", "M30 58a2 2 0 1 0 0.1 0", "M40 40a2 2 0 1 0 0.1 0", "M50 44a2 2 0 1 0 0.1 0", "M60 28a2 2 0 1 0 0.1 0", "M70 22a2 2 0 1 0 0.1 0", "M4 66 L76 16", "M2 76H78", "M2 76V4"],
  // Grille de tableur avec une ligne calculée
  excel: ["M4 8H76V72H4Z", "M4 24H76", "M4 40H76", "M4 56H76", "M28 8V72", "M52 8V72", "M56 44H72"],
  // Fenêtre d'application avec blocs
  web: ["M4 10H76V70H4Z", "M4 22H76", "M10 16h0.1", "M16 16h0.1", "M22 16h0.1", "M12 32H38V60H12Z", "M46 32H68", "M46 42H62", "M46 52H66"],
};

export function ServiceGlyph({ id, className }: { id: ServiceId; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={className}>
      {PATHS[id].map((d, i) => (
        <m.path
          key={`${id}-${i}`}
          d={d}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.1 + i * 0.06, ease: EASE.expo }}
        />
      ))}
    </svg>
  );
}
