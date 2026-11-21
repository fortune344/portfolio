"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";

type CounterProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

const format = (n: number, decimals: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Compteur animé jusqu'à une valeur réelle (jamais inventée).
 * Le HTML serveur contient déjà la valeur finale : sans JavaScript ou avec
 * prefers-reduced-motion, le chiffre exact s'affiche directement.
 */
export function Counter({ value, decimals = 0, prefix = "", suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(() => format(value, decimals));
  const armed = useRef(false);

  // Hors écran au montage : on repart de zéro pour animer à l'apparition.
  useEffect(() => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      armed.current = true;
      setDisplay(format(0, decimals));
    }
  }, [reduceMotion, decimals]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    armed.current = false;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE.expo,
      onUpdate: (v) => setDisplay(format(v, decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{`${prefix}${format(value, decimals)}${suffix}`}</span>
      <span aria-hidden className="tabular-nums">
        {prefix}
        {display}
        {suffix}
      </span>
    </span>
  );
}
