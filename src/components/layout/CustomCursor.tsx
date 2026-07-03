"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type CursorMode = "default" | "text" | "link";

/** Taille du disque selon ce qui est survolé. */
const SIZES: Record<CursorMode, number> = {
  default: 14,
  text: 60,
  link: 44,
};

const TEXT_SELECTOR = "h1, h2, h3, h4, p, li, blockquote, th, td, dt, dd";
const LINK_SELECTOR = "a, button, [role='button']";

/**
 * Curseur personnalisé : disque crème en mix-blend-difference.
 * En passant sur du texte ou une image, tout ce qui se trouve sous le disque
 * apparaît en négatif couleur ; il grossit sur les textes et les liens.
 * Actif uniquement sur pointeur précis, désactivé si prefers-reduced-motion.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, { stiffness: 500, damping: 38, mass: 0.5 });
  const y = useSpring(mouseY, { stiffness: 500, damping: 38, mass: 0.5 });

  useEffect(() => {
    if (reduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = e.target as HTMLElement | null;
      if (target?.closest(LINK_SELECTOR)) setMode("link");
      else if (target?.closest(TEXT_SELECTOR)) setMode("text");
      else setMode("default");
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [reduceMotion, mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] rounded-full bg-[#e8e3d7] mix-blend-difference"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: SIZES[mode], height: SIZES[mode] }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    />
  );
}
