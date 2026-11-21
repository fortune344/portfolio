"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";

type CursorMode = "default" | "text" | "link" | "label";

/** Taille du disque selon ce qui est survolé. */
const SIZES: Record<CursorMode, number> = {
  default: 14,
  text: 60,
  link: 44,
  label: 104,
};

const TEXT_SELECTOR = "h1, h2, h3, h4, p, li, blockquote, th, td, dt, dd";
const LINK_SELECTOR = "a, button, [role='button'], select, input, textarea, label";
const LABEL_SELECTOR = "[data-cursor]";

/**
 * Curseur personnalisé : disque crème en mix-blend-difference (négatif couleur
 * de ce qui est dessous), qui grossit sur les textes et les liens.
 * Sur un élément `data-cursor="Texte"`, il devient une pastille pleine avec ce
 * texte (ex. « Voir l'étude » sur les cartes de projets).
 * Actif uniquement sur pointeur précis, désactivé si prefers-reduced-motion.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("");
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, { stiffness: 500, damping: 38, mass: 0.5 });
  const y = useSpring(mouseY, { stiffness: 500, damping: 38, mass: 0.5 });

  useEffect(() => {
    if (reduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- activation après détection du pointeur (navigateur uniquement)
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>(LABEL_SELECTOR);
      if (labelled) {
        setMode("label");
        setLabel(labelled.dataset.cursor ?? "");
      } else if (target?.closest(LINK_SELECTOR)) setMode("link");
      else if (target?.closest(TEXT_SELECTOR)) setMode("text");
      else setMode("default");
    };
    const leave = () => setMode("default");

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [reduceMotion, mouseX, mouseY]);

  if (!enabled) return null;

  const isLabel = mode === "label";

  return (
    <m.div
      aria-hidden
      className={
        isLabel
          ? "pointer-events-none fixed left-0 top-0 z-[70] flex items-center justify-center rounded-full bg-foreground text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.16em] text-ink shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          : "pointer-events-none fixed left-0 top-0 z-[70] rounded-full bg-[#e8e3d7] mix-blend-difference"
      }
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: SIZES[mode], height: SIZES[mode] }}
      transition={{ duration: 0.3, ease: EASE.expo }}
    >
      {isLabel ? <span className="max-w-[78%]">{label}</span> : null}
    </m.div>
  );
}
