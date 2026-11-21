"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { OPEN_MENU_EVENT } from "@/lib/events";

/**
 * Couche de parallaxe du hero : le contenu remonte moins vite que la page et
 * s'efface en sortant. Le rendu serveur reste statique (aucun décalage avant
 * hydratation) ; désactivé avec prefers-reduced-motion.
 */
export function HeroParallax({
  children,
  distance = 160,
  fade = true,
  className,
}: {
  children: ReactNode;
  distance?: number;
  fade?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, distance]);
  const opacity = useTransform(scrollY, [0, 650], [1, fade ? 0 : 1]);
  return (
    <m.div className={className} style={reduceMotion ? undefined : { y, opacity }}>
      {children}
    </m.div>
  );
}

/** Bouton « Menu » du coin supérieur droit (mobile) : ouvre le menu plein écran. */
export function HeroMenuButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))}
      aria-label="Ouvrir le menu"
      aria-haspopup="dialog"
      className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 md:hidden"
    >
      <Menu size={18} aria-hidden />
      Menu
    </button>
  );
}
