import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { TimelineEntry } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/** Libellé et style du badge selon le type d'étape : plein / contour / pointillé. */
const TYPE_BADGE: Record<TimelineEntry["type"], { label: string; className: string }> = {
  experience: { label: "Expérience", className: "border-foreground bg-foreground text-ink" },
  formation: { label: "Formation", className: "border-line text-muted" },
  projet: { label: "Projet", className: "border-dashed border-foreground/40 text-muted" },
};

export function Journey({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <section id="parcours" className="scroll-mt-16 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Parcours"
          title="Expérience, formation & étapes clés"
        />

        <div className="border-t border-line">
          {timeline.map((entry, i) => (
            <Reveal key={`${entry.period}-${entry.title}`} delay={i * 0.05}>
              <article className="grid gap-3 border-b border-line py-8 transition-colors duration-200 hover:bg-white/[0.02] md:grid-cols-[220px_1fr_auto] md:gap-8 md:py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  {entry.period}
                </p>
                <div>
                  <h3 className="text-xl font-semibold sm:text-2xl">{entry.title}</h3>
                  <p className="mt-1 text-sm text-muted">{entry.place}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                    {entry.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "h-fit w-fit rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
                    (TYPE_BADGE[entry.type] ?? TYPE_BADGE.projet).className
                  )}
                >
                  {(TYPE_BADGE[entry.type] ?? TYPE_BADGE.projet).label}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
