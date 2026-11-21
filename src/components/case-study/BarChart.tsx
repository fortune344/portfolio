"use client";

import { m, useReducedMotion } from "framer-motion";
import type { CaseChart } from "@/content/case-studies";
import { EASE, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * Barres horizontales animées, sans librairie : supporte les valeurs négatives
 * (axe zéro placé selon l'étendue des données). Chaque valeur est écrite en
 * clair ; un tableau équivalent est fourni aux lecteurs d'écran.
 */
export function BarChart({ chart }: { chart: CaseChart }) {
  const reduceMotion = useReducedMotion();
  const values = chart.data.map((d) => d.value);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = max - min || 1;
  const zero = (-min / span) * 100; // position de l'axe zéro, en %

  return (
    <figure className="rounded-[1.75rem] border border-line bg-card/60 p-6 sm:p-8">
      <figcaption>
        <p className="font-display text-2xl uppercase tracking-tight sm:text-3xl">{chart.title}</p>
        <p className="mt-2 text-sm text-muted">{chart.caption}</p>
      </figcaption>

      <div aria-hidden className="mt-8 space-y-5">
        {chart.data.map((d, i) => {
          const width = (Math.abs(d.value) / span) * 100;
          const negative = d.value < 0;
          // Barre assez large : étiquette à l'intérieur, côté extrémité. Sinon, juste après la barre.
          const inside = width > 28;
          const start = negative ? zero - width : zero;
          const end = negative ? zero : zero + width;
          const labelStyle = inside
            ? negative
              ? { left: `${start}%` }
              : { right: `${100 - end}%` }
            : negative
              ? { right: `${100 - start}%` }
              : { left: `${end}%` };
          return (
            <div key={d.label} className="grid grid-cols-[6.5rem_1fr] items-center gap-4 sm:grid-cols-[9rem_1fr]">
              <div>
                <p className="text-sm font-medium leading-tight">{d.label}</p>
                {d.note ? <p className="text-[11px] text-muted">{d.note}</p> : null}
              </div>
              <div className="relative h-9">
                {min < 0 ? (
                  <span className="absolute inset-y-[-6px] w-px bg-foreground/40" style={{ left: `${zero}%` }} />
                ) : null}
                <m.div
                  className={cn(
                    "absolute inset-y-0 rounded-md",
                    d.highlight ? "bg-foreground" : "bg-foreground/35",
                    negative ? "origin-right" : "origin-left"
                  )}
                  style={{
                    left: negative ? `${zero - width}%` : `${zero}%`,
                    width: `${width}%`,
                  }}
                  initial={{ scaleX: reduceMotion ? 1 : 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.1, ease: EASE.expo }}
                />
                <m.span
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 text-sm font-semibold tabular-nums",
                    inside ? (d.highlight ? "text-ink" : "text-foreground") : "text-muted"
                  )}
                  style={labelStyle}
                  initial={{ opacity: reduceMotion ? 1 : 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                >
                  {d.value > 0 && min < 0 ? "+" : ""}
                  {fmt(d.value)}
                  {chart.unit}
                </m.span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sr-only">
      <table>
        <caption>{chart.title}</caption>
        <tbody>
          {chart.data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}{d.note ? ` (${d.note})` : ""}</th>
              <td>{fmt(d.value)}{chart.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className="mt-6 text-[11px] text-muted">Source : {chart.source}</p>
    </figure>
  );
}
