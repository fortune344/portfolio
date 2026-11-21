/**
 * Motion system du site : une seule source pour les durées, courbes et décalages.
 * Toute animation (Motion / framer-motion ou CSS) doit partir de ces valeurs,
 * pour que l'ensemble garde le même « rythme ».
 *
 * Règles :
 * - n'animer que `transform` et `opacity` (60 fps, pas de reflow) ;
 * - une entrée = un mouvement court et décidé, jamais de rebond ;
 * - pas d'animation permanente hors fond d'ambiance ;
 * - `prefers-reduced-motion` : contenus visibles immédiatement, sans déplacement.
 */

/** Courbes. `standard` = courbe historique du site ; `expo` = révélations typographiques. */
export const EASE = {
  standard: [0.21, 0.47, 0.32, 0.98],
  expo: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** Durées en secondes. */
export const DURATION = {
  fast: 0.2,
  base: 0.45,
  slow: 0.7,
  reveal: 0.9,
} as const;

/** Décalage entre éléments d'une même séquence (mots, cartes, lignes). */
export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.12,
} as const;

/** Marge du viewport avant déclenchement des apparitions au scroll. */
export const VIEWPORT = { once: true, margin: "-72px" } as const;
