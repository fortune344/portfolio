import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { TimelineEntry } from "@/data/portfolio";

export function Journey({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <section id="parcours" className="scroll-mt-16 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Parcours"
          title="Formation & étapes clés"
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
                <span className="h-fit w-fit rounded-full border border-line px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {entry.type === "formation" ? "Formation" : "Projet"}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
