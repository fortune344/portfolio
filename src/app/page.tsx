import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { getPortfolio } from "@/lib/portfolio-store";

// ISR : la page est régénérée au plus toutes les 60 s,
// et immédiatement après chaque enregistrement dans l'admin (revalidatePath).
export const revalidate = 60;

export default async function Home() {
  const { profile, skillGroups, projects, timeline, languages, interests } =
    await getPortfolio();

  return (
    <>
      <CustomCursor />
      <AnimatedBackground />
      <main>
        <Hero profile={profile} />
        <About
          profile={profile}
          skillGroups={skillGroups}
          languages={languages}
          interests={interests}
        />
        <Projects projects={projects} githubUrl={profile.github} />
        <Journey timeline={timeline} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
