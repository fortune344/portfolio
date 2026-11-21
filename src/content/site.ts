/**
 * Contenu éditorial du site (versionné avec le code).
 *
 * Ce qui change rarement et structure le discours commercial vit ici :
 * proposition de valeur par défaut, services, méthode, navigation.
 * Le contenu éditable depuis /admin (profil, projets, parcours, compétences)
 * reste dans Supabase — voir src/lib/portfolio-store.ts.
 */
import type { SkillLevel } from "@/data/portfolio";

export const SITE_URL = "https://fortuneassouan.vercel.app";

/** Identifiants partagés entre services, formulaire de contact et études de cas. */
export type ServiceId = "web" | "powerbi" | "analyse";

export const HERO = {
  role: "Développeur web · Data Analyst",
  /** Repli si `profile.headline` est vide dans Supabase. */
  headline:
    "Je développe des applications web et je transforme les données des entreprises en tableaux de bord utiles.",
  pitch: "Basé à Lomé, je travaille avec des entreprises au Togo, au Bénin et à distance.",
};

export const NAV_ITEMS = [
  { id: "services", label: "Services" },
  { id: "realisations", label: "Réalisations" },
  { id: "approche", label: "À propos" },
  { id: "parcours", label: "Parcours" },
  { id: "contact", label: "Contact" },
] as const;

export type Service = {
  id: ServiceId;
  title: string;
  /** Accroche courte affichée dans la liste. */
  short: string;
  problem: string;
  solution: string;
  tools: string[];
  /** Études de cas qui illustrent le service (slugs). */
  proof: string[];
};

export const SERVICES: Service[] = [
  {
    id: "web",
    title: "Applications web",
    short: "Un outil sur mesure quand les fichiers ne suffisent plus.",
    problem:
      "Votre activité repose sur des fichiers Excel, du papier ou WhatsApp, et aucun logiciel du marché ne colle à votre façon de travailler.",
    solution:
      "Je développe l'application dont vous avez besoin : gestion de stock, ventes, clients, espace d'administration, avec des accès par rôle.",
    tools: ["Django", "Python", "Next.js", "PostgreSQL"],
    proof: ["gestionpro", "digi-farm"],
  },
  {
    id: "powerbi",
    title: "Tableaux de bord",
    short: "Suivre ventes, marges et stocks sur un seul écran.",
    problem:
      "Vos chiffres sont éparpillés entre plusieurs fichiers et chaque reporting se refait à la main.",
    solution:
      "Je relie vos données et je construis un tableau de bord Power BI clair, avec les indicateurs que vous suivez vraiment.",
    tools: ["Power BI", "DAX", "Power Query", "SQL"],
    proof: ["global-superstore", "healthconnect"],
  },
  {
    id: "analyse",
    title: "Analyse de données",
    short: "Comprendre ce que disent vos chiffres.",
    problem:
      "Vous avez des données, mais pas le temps de les nettoyer ni de savoir quoi en tirer.",
    solution:
      "Je nettoie vos données, j'automatise ce qui se répète dans vos fichiers Excel et je vous remets une analyse claire, avec des recommandations.",
    tools: ["Python", "Excel", "SQL"],
    proof: ["telco-churn", "healthconnect"],
  },
];

export const APPROACH = {
  statement: "Comprendre le besoin avant de construire",
  steps: [
    {
      title: "Comprendre",
      text: "On parle de votre activité, de ce qui vous fait perdre du temps et de ce que vous voulez suivre.",
    },
    {
      title: "Construire",
      text: "Je développe l'application ou le tableau de bord par étapes, avec des points réguliers.",
    },
    {
      title: "Livrer",
      text: "Je mets en service, j'explique comment s'en servir et je laisse une documentation.",
    },
  ],
};

export const SKILL_LEVEL_LABEL: Record<SkillLevel, string> = {
  principal: "Cœur de métier",
  regulier: "Pratique régulière",
  complementaire: "Complémentaire",
};

export const CONTACT_COPY = {
  title: "Parlons-en",
  intro:
    "Une application à développer, un tableau de bord à construire ou des données à analyser ? Écrivez-moi, je vous réponds personnellement.",
};
