import { Reveal } from "@/components/ui/Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

/** En-tête de section éditorial : libellé espacé, titre display massif. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={className ?? "mb-14 md:mb-20"}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
