import type { CSSProperties, ElementType } from "react";

/**
 * Titre révélé mot par mot en CSS pur (composant serveur) : pour les titres
 * visibles dès l'arrivée sur la page, qui ne doivent pas attendre le JavaScript.
 * Même rendu que <SplitText>, déclenché au chargement plutôt qu'au défilement.
 */
export function RiseText({
  text,
  as: Tag = "h1",
  className,
  delay = 0.1,
  step = 0.06,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="-mb-[0.08em] -mt-[0.2em] inline-block overflow-hidden pb-[0.08em] pt-[0.2em] align-bottom"
        >
          <span className="hero-rise inline-block" style={{ "--delay": `${delay + i * step}s` } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
