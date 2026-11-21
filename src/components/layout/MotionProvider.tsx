"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/**
 * Charge le moteur d'animation après l'affichage initial : les composants `m.*`
 * sont rendus tout de suite, puis s'animent dès que les fonctionnalités arrivent.
 * `strict` interdit l'usage accidentel de `motion.*` (qui réembarquerait tout le moteur).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
