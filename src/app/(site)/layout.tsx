import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { getPortfolio } from "@/lib/portfolio-store";

/** Gabarit commun du site public (accueil + études de cas). L'admin n'en hérite pas. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getPortfolio();
  return (
    <MotionProvider>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Aller au contenu
      </a>
      <CustomCursor />
      <AnimatedBackground />
      <SiteNav email={profile.email} linkedin={profile.linkedin} github={profile.github} cvUrl={profile.cvUrl} />
      <main id="contenu">{children}</main>
      <Footer profile={profile} />
    </MotionProvider>
  );
}
