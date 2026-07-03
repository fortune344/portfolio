import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectScreen } from "@/components/ui/ProjectScreen";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  /** Inverse la disposition texte / mockup (cartes alternées). */
  reversed?: boolean;
};

/** Grande carte projet : texte d'un côté, mockup laptop de l'autre. */
export function ProjectCard({ project, reversed = false }: ProjectCardProps) {
  return (
    <article className="rounded-[2rem] bg-card p-7 sm:p-10 md:rounded-[2.5rem] md:p-14">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        {/* Texte */}
        <div className={cn(reversed && "md:order-2")}>
          <div className="flex items-center gap-4">
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Code source de ${project.title} sur GitHub`}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-ink transition-transform duration-300 hover:scale-110"
              >
                <GithubIcon size={20} />
              </a>
            ) : null}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir ${project.title} en ligne`}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-ink transition-transform duration-300 hover:scale-110"
              >
                <ArrowUpRight size={22} />
              </a>
            ) : null}
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-cool">
              {project.category}
            </span>
          </div>

          <h3 className="mt-7 text-3xl font-semibold tracking-tight sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-cool sm:text-base">
            {project.description}
          </p>

          <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-bold uppercase tracking-[0.15em] text-foreground"
              >
                {tag}
              </span>
            ))}
          </p>
        </div>

        {/* Mockup */}
        <div
          className={cn(
            "flex justify-center transition-transform duration-500 ease-out hover:scale-[1.03]",
            reversed && "md:order-1"
          )}
        >
          <ProjectScreen
            kind={project.screen}
            image={project.image}
            alt={`Aperçu du projet ${project.title}`}
          />
        </div>
      </div>
    </article>
  );
}
