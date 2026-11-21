"use client";

import { m, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { APPROACH } from "@/content/site";
import { EASE, VIEWPORT } from "@/lib/motion";

/**
 * Les 4 étapes de la méthode, reliées par une ligne verticale qui se remplit
 * au rythme du défilement (animation synchronisée au scroll).
 */
export function MethodSteps() {
  const ref = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <ol ref={ref} className="relative space-y-10 pl-10 sm:pl-14">
      {/* Rail + remplissage */}
      <span aria-hidden className="absolute bottom-2 left-[0.6rem] top-2 w-px bg-line sm:left-[0.85rem]" />
      <m.span
        aria-hidden
        className="absolute bottom-2 left-[0.6rem] top-2 w-px origin-top bg-foreground sm:left-[0.85rem]"
        style={reduceMotion ? { scaleY: 1 } : { scaleY: progress }}
      />
      {APPROACH.steps.map((step, i) => (
        <m.li
          key={step.number}
          className="relative"
          initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, delay: i * 0.08, ease: EASE.expo }}
        >
          <span
            aria-hidden
            className="absolute -left-10 top-1 flex h-5 w-5 items-center justify-center rounded-full border border-foreground bg-background sm:-left-14 sm:h-7 sm:w-7"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground sm:h-2 sm:w-2" />
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">{step.number}</p>
          <h3 className="mt-1 font-display text-3xl uppercase tracking-tight sm:text-4xl">{step.title}</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted sm:text-base">{step.text}</p>
        </m.li>
      ))}
    </ol>
  );
}
