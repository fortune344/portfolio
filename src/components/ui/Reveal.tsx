"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, EASE, VIEWPORT } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Direction d'où provient l'élément. */
  from?: "bottom" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  /** Décalage initial en px. */
  distance?: number;
  once?: boolean;
  /** Élément rendu : `li` pour rester un enfant direct valide d'une liste. */
  as?: "div" | "li";
};

/**
 * Apparition progressive au scroll.
 * N'anime que transform + opacity pour rester à 60 fps,
 * et s'affiche directement si l'utilisateur préfère réduire les animations.
 */
export function Reveal({
  children,
  from = "bottom",
  delay = 0,
  duration = DURATION.slow,
  className,
  distance = 32,
  once = true,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = {
    bottom: { y: distance, x: 0 },
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    none: { x: 0, y: 0 },
  }[from];

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: EASE.standard },
    },
  };

  const Comp = as === "li" ? m.li : m.div;
  return (
    <Comp
      className={className}
      variants={variants}
      // Même arbre côté serveur et client (pas d'erreur d'hydratation) :
      // en mouvement réduit, l'élément démarre directement dans son état final.
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ ...VIEWPORT, once }}
    >
      {children}
    </Comp>
  );
}
