"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";
import { DURATION, EASE, STAGGER, VIEWPORT } from "@/lib/motion";

type SplitTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  id?: string;
};

/**
 * Titre révélé mot par mot : chaque mot monte depuis un masque (overflow hidden),
 * avec un léger décalage. Signature typographique des grands titres Anton.
 * Le texte complet reste dans le HTML (SEO, lecteurs d'écran via aria-label).
 */
export function SplitText({ text, as: Tag = "h2", className, delay = 0, id }: SplitTextProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag id={id} className={className} aria-label={text}>
      <m.span
        aria-hidden
        initial={reduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={VIEWPORT}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: STAGGER.base, delayChildren: delay } },
        }}
        className="inline"
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="-mb-[0.08em] -mt-[0.2em] inline-block overflow-hidden pb-[0.08em] pt-[0.2em] align-bottom">
            <m.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "105%" },
                visible: { y: 0, transition: { duration: DURATION.reveal, ease: EASE.expo } },
              }}
            >
              {word}
            </m.span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </m.span>
    </Tag>
  );
}
