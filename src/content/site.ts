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
export type ServiceId = "powerbi" | "analyse" | "excel" | "web";

export const HERO = {
  role: "Consultant Power BI · Data Analyst",
  /** Repli si `profile.headline` est vide dans Supabase. */
  headline:
    "J'accompagne les entreprises dans la valorisation de leurs données de gestion grâce à Power BI.",
  pitch:
    "Ventes, marges, stocks, activité : des tableaux de bord fiables pour décider plus vite. Basé à Lomé, j'interviens au Togo, au Bénin et à distance.",
};

export const NAV_ITEMS = [
  { id: "services", label: "Services" },
  { id: "realisations", label: "Réalisations" },
  { id: "approche", label: "Approche" },
  { id: "parcours", label: "Parcours" },
  { id: "contact", label: "Contact" },
] as const;

export type Service = {
  id: ServiceId;
  number: string;
  title: string;
  /** Accroche courte affichée dans la liste. */
  short: string;
  problem: string;
  solution: string;
  benefits: string[];
  /** Cas d'usage typiques. */
  useCases: string[];
  tools: string[];
  /** Études de cas qui illustrent le service (slugs). */
  proof: string[];
};

export const SERVICES: Service[] = [
  {
    id: "powerbi",
    number: "01",
    title: "Tableaux de bord Power BI",
    short: "Piloter l'activité à partir d'un seul écran.",
    problem:
      "Vos chiffres sont éparpillés entre fichiers Excel, logiciel de caisse et exports. Chaque reporting prend des heures et arrive trop tard pour décider.",
    solution:
      "Je connecte et modélise vos données, je définis avec vous les indicateurs qui comptent, puis je construis un tableau de bord Power BI clair, filtrable et documenté.",
    benefits: [
      "Ventes, marges, stocks et performances suivis au même endroit",
      "Des indicateurs définis avec vous, calculés toujours de la même façon",
      "Un reporting qui se met à jour au lieu d'être refait à la main",
    ],
    useCases: [
      "Suivi des ventes et des performances commerciales",
      "Indicateurs financiers et opérationnels",
      "Analyse de la rentabilité par produit, client ou région",
      "Suivi des stocks et des performances produits",
    ],
    tools: ["Power BI", "DAX", "Power Query", "SQL"],
    proof: ["global-superstore", "healthconnect"],
  },
  {
    id: "analyse",
    number: "02",
    title: "Analyse et valorisation des données",
    short: "Transformer des données brutes en constats chiffrés.",
    problem:
      "Vous accumulez des données sans savoir quoi en tirer, ou vous doutez de leur fiabilité au moment de les présenter.",
    solution:
      "J'audite, nettoie et prépare vos données, puis j'explore les tendances et les facteurs qui expliquent vos résultats. Vous recevez un rapport clair, avec des recommandations.",
    benefits: [
      "Des données fiabilisées : doublons, valeurs manquantes et incohérences traités",
      "Des constats compréhensibles sans être data analyst",
      "Des synthèses rédigées en français ou en anglais",
    ],
    useCases: [
      "Exploration et nettoyage de bases existantes",
      "Recoupement de sources hétérogènes",
      "Identification de tendances et de facteurs explicatifs",
      "Rapports analytiques et synthèses exécutives",
    ],
    tools: ["Python (Pandas)", "SQL", "Excel", "Power BI"],
    proof: ["healthconnect", "telco-churn"],
  },
  {
    id: "excel",
    number: "03",
    title: "Automatisation et fichiers Excel",
    short: "Des fichiers de gestion structurés, moins de copier-coller.",
    problem:
      "Vos fichiers de suivi sont lourds et fragiles, et les mêmes manipulations reviennent chaque semaine.",
    solution:
      "Je restructure vos fichiers de gestion, j'automatise les traitements récurrents (Power Query, formules, scripts Python) et je mets en place des tableaux de suivi fiables.",
    benefits: [
      "Moins de saisie manuelle et d'erreurs de recopie",
      "Des fichiers lisibles, utilisables par toute l'équipe",
      "Un reporting plus rapide à produire chaque semaine",
    ],
    useCases: [
      "Structuration de fichiers de gestion",
      "Automatisation de traitements récurrents",
      "Tableaux de suivi et tableaux croisés dynamiques",
      "Optimisation du processus de reporting",
    ],
    tools: ["Excel", "Power Query", "Tableaux croisés dynamiques", "Python"],
    proof: [],
  },
  {
    id: "web",
    number: "04",
    title: "Applications web métier",
    short: "Un outil sur mesure quand les fichiers ne suffisent plus.",
    problem:
      "Vos processus reposent sur des fichiers, du papier ou des messageries, et aucun logiciel du marché ne correspond à votre façon de travailler.",
    solution:
      "Je conçois des applications web adaptées à vos opérations : outils de gestion, interfaces d'administration, suivi d'activité, avec des accès par rôle.",
    benefits: [
      "Un outil adapté à votre organisation, pas l'inverse",
      "Des données centralisées, prêtes à être analysées",
      "Des droits d'accès clairs pour chaque profil d'utilisateur",
    ],
    useCases: [
      "Applications web de gestion",
      "Outils internes et interfaces d'administration",
      "Plateformes de mise en relation",
      "Numérisation de processus papier",
    ],
    tools: ["Django", "Python", "React / Next.js", "PostgreSQL"],
    proof: ["gestionpro", "digi-farm"],
  },
];

export const APPROACH = {
  statement: "Des données fiables d'abord. Des décisions plus claires ensuite.",
  intro:
    "Mon travail commence toujours par une question business : vendre plus, perdre moins de marge, mieux servir ses clients. Puis par la vérification des données, car un beau tableau de bord construit sur des chiffres faux ne sert à rien. Les indicateurs, les visuels et les recommandations viennent ensuite.",
  steps: [
    {
      number: "01",
      title: "Comprendre",
      text: "Cadrer la question business, les décisions à prendre et les indicateurs qui comptent vraiment.",
    },
    {
      number: "02",
      title: "Fiabiliser",
      text: "Collecter, nettoyer, recouper et documenter les données avant toute analyse.",
    },
    {
      number: "03",
      title: "Construire",
      text: "Modéliser, calculer les KPI et concevoir le tableau de bord ou l'outil adapté.",
    },
    {
      number: "04",
      title: "Restituer",
      text: "Expliquer les résultats, recommander des actions et rendre l'outil simple à utiliser.",
    },
  ],
  principles: [
    "Contrôle qualité des données en amont",
    "Synthèses en français et en anglais",
    "Livrables documentés et réutilisables",
    "Travail à distance, points réguliers",
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
    "Un tableau de bord à construire, des données à fiabiliser, un outil à développer ? Décrivez votre besoin : je vous réponds personnellement.",
};
