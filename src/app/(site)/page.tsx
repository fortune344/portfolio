import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { getPortfolio } from "@/lib/portfolio-store";

// ISR : la page est régénérée au plus toutes les 60 s,
// et immédiatement après chaque enregistrement dans l'admin (revalidatePath).
export const revalidate = 60;

/**
 * Parcours de la page : qui / quelle valeur (hero) → ce que je fais (services)
 * → preuves (réalisations) → comment (approche, compétences) → crédibilité
 * (parcours) → passage à l'action (contact).
 */
export default async function Home() {
  const { profile, skillGroups, projects, timeline, languages } = await getPortfolio();

  return (
    <>
      <Hero profile={profile} />
      <Services />
      <Work projects={projects} githubUrl={profile.github} />
      <About profile={profile} languages={languages} />
      <Skills groups={skillGroups} />
      <Journey timeline={timeline} />
      <Contact profile={profile} />
    </>
  );
}
