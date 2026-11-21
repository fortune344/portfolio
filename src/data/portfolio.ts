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
  /** Indicateur de disponibilité du hero (vide = masqué). */
  availability: string;
  /** Proposition de valeur affichée sous le nom (repli : texte du code). */
  headline?: string;
  /** Phrase d'accompagnement de la proposition de valeur. */
  pitch?: string;
  /** URL du CV téléchargeable (PDF). Vide = bouton masqué. */
  cvUrl?: string | null;
  /** Anciens textes du hero (conservés pour compatibilité, plus affichés). */
  statusLine?: string;
  statusLink?: { label: string; href: string };
  focusLine?: string;
  bio: string[];
};

/** Place d'un domaine dans mon activité — présentée honnêtement, sans pourcentage. */
export type SkillLevel = "principal" | "regulier" | "complementaire";

export type SkillGroup = {
  title: string;
  skills: string[];
  /** Exemple concret d'utilisation (projet, mission). */
  note?: string;
  level?: SkillLevel;
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
  type: "experience" | "formation" | "projet";
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
