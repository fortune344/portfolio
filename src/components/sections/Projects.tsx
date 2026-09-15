import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/ui/TrackedLink";
import type { Project } from "@/data/portfolio";

type ProjectsProps = {
  projects: Project[];
  /** Lien vers le profil GitHub (bouton « tous mes projets »). */
  githubUrl: string;
};

export function Projects({ projects, githubUrl }: ProjectsProps) {
  return (
    <section id="projets" className="scroll-mt-16 bg-panel py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Projets"
          title="Ce que j'ai construit"
          description="Une sélection de projets concrets — analyse de données, applications web et outils."
        />

        <ProjectsGrid projects={projects} />

        <Reveal delay={0.15} className="mt-14 text-center">
          <TrackedLink
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            track={{ event: "github_click", link_url: githubUrl }}
            className="inline-flex items-center gap-3 rounded-xl border border-foreground/40 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-foreground hover:text-ink"
          >
            <GithubIcon size={16} />
            Tous mes projets sur GitHub
          </TrackedLink>
        </Reveal>
      </div>
    </section>
  );
}
