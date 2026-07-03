/**
 * Types du contenu du portfolio + données par défaut.
 *
 * En production, le contenu vit dans Supabase (table `portfolio`) et se
 * modifie via /admin. `portfolio.json` sert de données par défaut : premier
 * remplissage et solution de secours si Supabase n'est pas configuré.
 */
import raw from "./portfolio.json";

export type Profile = {
  name: string;
  firstName: string;
  lastName: string;
  initials: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  phoneHref: string;
  github: string;
  githubUser: string;
  linkedin: string;
  availability: string;
  /** Texte du coin inférieur gauche du hero. */
  statusLine: string;
  statusLink: { label: string; href: string };
  /** Texte du coin inférieur droit du hero. */
  focusLine: string;
  /** Lignes du manifeste géant de la section À propos. */
  manifesto: string[];
  bio: string[];
};

export type SkillGroup = {
  title: string;
  skills: string[];
};

/** Type d'aperçu dessiné en CSS, utilisé quand le projet n'a pas d'image. */
export type ProjectScreenKind = "chart" | "kanban" | "table" | "terminal";

export type ProjectCategory = "Data" | "Web" | "Mobile" | "Outil";

export type Project = {
  title: string;
  description: string;
  tags: string[];
  /** Lien du dépôt GitHub (optionnel). */
  github?: string | null;
  /** Lien du site en ligne (optionnel). */
  liveUrl?: string | null;
  /** URL de l'image du projet (optionnelle) — sinon aperçu CSS `screen`. */
  image?: string | null;
  category: ProjectCategory;
  featured: boolean;
  screen: ProjectScreenKind;
};

export type TimelineEntry = {
  period: string;
  title: string;
  place: string;
  description: string;
  type: "formation" | "projet";
};

export type Language = { name: string; level: string };

export type PortfolioData = {
  profile: Profile;
  skillGroups: SkillGroup[];
  projects: Project[];
  timeline: TimelineEntry[];
  languages: Language[];
  interests: string[];
};

export const defaultPortfolio = raw as unknown as PortfolioData;
