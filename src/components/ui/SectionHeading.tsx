import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Numéro de section éditorial (ex. « 01 »). */
  index?: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  id?: string;
};

/** En-tête de section éditorial : libellé espacé, titre display massif révélé mot par mot. */
export function SectionHeading({ index, eyebrow, title, description, className, id }: SectionHeadingProps) {
  return (
    <div className={cn("mb-14 md:mb-20", className)}>
      <Reveal>
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
          {index ? <span className="text-foreground">{index}</span> : null}
          {index ? <span aria-hidden className="h-px w-8 bg-line" /> : null}
          {eyebrow}
        </p>
      </Reveal>
      <SplitText
        text={title}
        className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-[0.95] tracking-tight"
        delay={0.05}
        id={id}
      />
      {description ? (
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
