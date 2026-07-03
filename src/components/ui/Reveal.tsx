"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

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
};

/**
 * Apparition progressive au scroll.
 * N'anime que transform + opacity pour rester à 60 fps,
 * et se désactive si l'utilisateur préfère réduire les animations.
 */
export function Reveal({
  children,
  from = "bottom",
  delay = 0,
  duration = 0.6,
  className,
  distance = 32,
  once = true,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

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
      transition: { duration, delay, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-64px" }}
    >
      {children}
    </motion.div>
  );
}
