import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/data/portfolio";

type ProjectsProps = {
  projects: Project[];
  /** Lien vers le profil GitHub (bouton « tous mes projets »). */
  githubUrl: string;
};

export function Projects({ projects, githubUrl }: ProjectsProps) {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="projets" className="scroll-mt-16 bg-panel py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Projets"
          title="Ce que j'ai construit"
          description="Une sélection de projets concrets — analyse de données, applications web et outils."
        />

        <div className="space-y-6 md:space-y-8">
          {featured.map((project, i) => (
            <Reveal key={project.title} delay={0.05}>
              <ProjectCard project={project} reversed={i % 2 === 1} />
            </Reveal>
          ))}
        </div>

        {/* Autres projets, en format compact */}
        {others.length > 0 ? (
          <div className="mt-14 border-t border-line">
            {others.map((project, i) => {
              const href = project.liveUrl || project.github || undefined;
              const inner = (
                <>
                  <div>
                    <h3 className="text-base font-semibold sm:text-lg">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-cool">
                      {project.tags.join(" · ")}
                    </p>
                  </div>
                  {href ? (
                    <ArrowUpRight
                      size={20}
                      className="shrink-0 text-muted-cool transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground"
                    />
                  ) : null}
                </>
              );
              const rowClass =
                "group flex items-center justify-between gap-6 border-b border-line py-6 transition-colors duration-200 hover:bg-white/[0.02]";

              return (
                <Reveal key={project.title} delay={i * 0.08}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={rowClass}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={rowClass}>{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        ) : null}

        <Reveal delay={0.15} className="mt-14 text-center">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl border border-foreground/40 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-foreground hover:text-ink"
          >
            <GithubIcon size={16} />
            Tous mes projets sur GitHub
          </a>
        </Reveal>
      </div>
    </section>
  );
}
