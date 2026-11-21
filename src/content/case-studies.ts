/**
 * Études de cas — rédigées à partir des README, données et captures des
 * dépôts GitHub. Règle : aucun chiffre qui ne figure pas dans les sources
 * (README, dashboards). Chaque chiffre clé indique sa provenance dans `source`.
 */
import type { Project } from "@/data/portfolio";
import type { ServiceId } from "@/content/site";

export type CaseImage = { src: string; alt: string; width: number; height: number; caption?: string };

/** Chiffre clé animé. `value` est la valeur numérique exacte de la source. */
export type KeyFigure = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type ChartDatum = { label: string; value: number; highlight?: boolean; note?: string };

export type CaseChart = {
  title: string;
  caption: string;
  data: ChartDatum[];
  /** Unité affichée après chaque valeur. */
  unit: string;
  source: string;
};

export type CaseStudy = {
  slug: string;
  kind: "data" | "web";
  service: ServiceId;
  title: string;
  /** Titre court pour les cartes et la navigation. */
  name: string;
  sector: string;
  context: string;
  year: string;
  status?: string;
  summary: string;
  problem: string;
  objectives: string[];
  /** Fiche « données » : libellé → valeur. */
  facts: { label: string; value: string }[];
  dataNote?: string;
  method: { title: string; text: string }[];
  tools: string[];
  figures?: KeyFigure[];
  figuresSource?: string;
  /** Constats (data) ou fonctionnalités (web). */
  insightsTitle: string;
  insights: string[];
  chart?: CaseChart;
  recommendations?: string[];
  limits: string[];
  deliverables: string[];
  cover: CaseImage;
  gallery: CaseImage[];
  links: { label: string; href: string; kind: "github" | "live" }[];
  /** Liens GitHub / fragments de titre qui rattachent des projets Supabase à cette étude. */
  matches: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "global-superstore",
    kind: "data",
    service: "powerbi",
    title: "Global Superstore — rentabilité et politique de remises",
    name: "Global Superstore",
    sector: "Distribution · commerce multi-marchés",
    context: "Programme AnalystLab Africa",
    year: "2026",
    summary:
      "Comprendre pourquoi une partie du chiffre d'affaires ne génère aucun profit, et donner à la direction un outil pour piloter les remises.",
    problem:
      "Le chiffre d'affaires a progressé de 90 % en quatre ans, mais la marge reste à 11,61 %. La direction doit savoir où se perd le profit : quels produits, quels marchés, et quel rôle jouent les remises commerciales.",
    objectives: [
      "Réunir les KPI commerciaux (ventes, profit, marge, commandes) dans un seul tableau de bord",
      "Mesurer l'impact des remises sur la rentabilité",
      "Repérer les catégories, produits et marchés qui détruisent de la marge",
      "Formuler des recommandations actionnables",
    ],
    facts: [
      { label: "Lignes de commande", value: "51 290" },
      { label: "Commandes", value: "25 035" },
      { label: "Clients", value: "1 590" },
      { label: "Période", value: "2011 – 2014" },
      { label: "Couverture", value: "7 marchés, 147 pays" },
      { label: "Catalogue", value: "3 catégories, 17 sous-catégories, 3 788 produits" },
    ],
    dataNote:
      "Jeu de données public Global Superstore (commerce de détail fictif), utilisé comme cas d'entraînement : les montants sont fictifs.",
    method: [
      {
        title: "Préparer",
        text: "Import et transformation des données dans Power Query, typage des colonnes et contrôle de cohérence avant toute mesure.",
      },
      {
        title: "Mesurer",
        text: "7 mesures DAX (ventes, profit, marge, panier moyen…) et 2 mesures de croissance pour comparer les années.",
      },
      {
        title: "Visualiser",
        text: "Dashboard Power BI de 4 pages : vue d'ensemble, rentabilité, impact des remises, produits et régions, avec filtres par année, marché et catégorie.",
      },
      {
        title: "Recommander",
        text: "Rapport d'insights et de recommandations, résumé exécutif en anglais, et version Looker Studio consultable en ligne.",
      },
    ],
    tools: ["Power BI", "DAX", "Power Query", "Looker Studio"],
    figures: [
      { value: 12.64, decimals: 2, suffix: " M$", label: "Chiffre d'affaires analysé" },
      { value: 1.47, decimals: 2, suffix: " M$", label: "Profit total" },
      { value: 11.61, decimals: 2, suffix: " %", label: "Marge globale" },
      { value: 90, prefix: "+", suffix: " %", label: "Croissance des ventes sur 4 ans" },
    ],
    figuresSource: "README du dépôt Global-superstore-advanced-powerbi-analysis",
    insightsTitle: "Ce que montrent les données",
    insights: [
      "Au-delà d'environ 20 % de remise, les ventes deviennent structurellement déficitaires : la marge passe de +25,3 % sans remise à −51,3 % au-delà de 30 %.",
      "Tables est la seule sous-catégorie en perte : 67 % de ses produits sont individuellement déficitaires, avec un taux de remise moyen deux fois plus élevé que la moyenne.",
      "Furniture ne dégage que 6,9 % de marge, contre environ 14 % pour Technology et Office Supplies.",
      "Deux marchés, la Turquie et le Nigeria, cumulent à eux seuls −179 K$ de profit.",
      "L'activité est très saisonnière : les ventes de novembre et décembre représentent environ trois fois celles de février.",
    ],
    chart: {
      title: "Marge selon le niveau de remise",
      caption: "Au-delà d'environ 20 % de remise, chaque vente supplémentaire coûte de la marge.",
      unit: " %",
      data: [
        { label: "Sans remise", value: 25.3 },
        { label: "Remise > 30 %", value: -51.3, highlight: true },
      ],
      source: "README du dépôt Global-superstore-advanced-powerbi-analysis",
    },
    recommendations: [
      "Encadrer la politique de remises par des règles de validation",
      "Revoir les produits structurellement déficitaires",
      "Investir dans la catégorie Technology, la plus rentable",
      "Répliquer les pratiques des régions à forte marge",
      "Suivre les commandes en perte comme un indicateur à part entière",
      "Cibler les segments de clientèle à potentiel",
    ],
    limits: [
      "Données d'entraînement fictives : la démarche est transposable, pas les montants.",
      "Les recommandations n'ont pas été testées sur le terrain.",
    ],
    deliverables: [
      "Dashboard Power BI 4 pages (.pbix et PDF)",
      "Version Looker Studio en ligne",
      "Rapport d'insights et de recommandations",
      "Résumé exécutif en anglais",
    ],
    cover: {
      src: "/realisations/superstore/advanced-01.png",
      alt: "Page « Executive Overview » du dashboard Power BI Global Superstore : ventes 12,64 M, profit 1,47 M, marge 11,61 %, tendance des ventes et du profit, ventes par marché et profit par catégorie.",
      width: 1311,
      height: 752,
    },
    gallery: [
      {
        src: "/realisations/superstore/advanced-03.png",
        alt: "Page « Pricing & Discount Analysis » : ventes et profit par tranche de remise, marge par tranche de remise (négative au-delà de 20 %), tableau par sous-catégorie.",
        width: 1301,
        height: 741,
        caption: "Impact des remises sur la marge",
      },
      {
        src: "/realisations/superstore/advanced-02.png",
        alt: "Page « Profitability & Risk » : profit par catégorie et par sous-catégorie (Tables en perte), nuage ventes / profit, tableau des marges.",
        width: 1297,
        height: 750,
        caption: "Rentabilité par catégorie et sous-catégorie",
      },
      {
        src: "/realisations/superstore/advanced-04.png",
        alt: "Page « Products & Regions » : top 10 des produits par ventes, profit par région, 10 produits les moins rentables, tableau par marché.",
        width: 1312,
        height: 748,
        caption: "Produits et régions",
      },
      {
        src: "/realisations/superstore/looker-studio.png",
        alt: "Version Looker Studio du dashboard : KPI ventes, profit, marge et commandes, courbe temporelle, carte des ventes et ventes par catégorie.",
        width: 687,
        height: 545,
        caption: "Version Looker Studio, consultable en ligne",
      },
    ],
    links: [
      { label: "Analyse avancée (GitHub)", href: "https://github.com/fortune344/Global-superstore-advanced-powerbi-analysis", kind: "github" },
      { label: "Dashboard BI (GitHub)", href: "https://github.com/fortune344/Global-Superstore-Business-Intelligence-Dashboard", kind: "github" },
      { label: "Ouvrir le dashboard Looker Studio", href: "https://datastudio.google.com/reporting/9ccf57ae-5258-4f4a-a070-4d8751efdc61", kind: "live" },
    ],
    matches: [
      "github.com/fortune344/global-superstore-advanced-powerbi-analysis",
      "github.com/fortune344/global-superstore-business-intelligence-dashboard",
      "superstore",
    ],
  },
  {
    slug: "healthconnect",
    kind: "data",
    service: "analyse",
    title: "HealthConnect — comprendre les rendez-vous manqués",
    name: "HealthConnect",
    sector: "Santé · clinique (cas fictif)",
    context: "Programme AnalystLab Africa",
    year: "2026",
    summary:
      "Explorer 5 000 rendez-vous pour comprendre ce qui fait qu'un patient ne se présente pas, et donner à la clinique un tableau de bord de suivi.",
    problem:
      "Près d'un rendez-vous sur deux n'est pas honoré. La clinique veut savoir quels facteurs sont associés aux absences, pour mieux cibler ses rappels et organiser ses plannings.",
    objectives: [
      "Mesurer précisément le taux d'absence et ses variations",
      "Identifier les facteurs associés au risque d'absence",
      "Construire un tableau de bord de suivi pour les responsables",
      "Tester si un score simple peut aider à prioriser les relances",
    ],
    facts: [
      { label: "Rendez-vous", value: "5 000" },
      { label: "Variables", value: "18" },
      { label: "Patients uniques", value: "1 696" },
      { label: "Période", value: "janv. 2025 – juin 2026" },
      { label: "Qualité", value: "aucun doublon, ~2 % de valeurs manquantes" },
    ],
    dataNote:
      "Données fictives et anonymisées. Les valeurs manquantes (distance, temps d'attente) ont été imputées par la médiane.",
    method: [
      {
        title: "Auditer",
        text: "Contrôle qualité en Python (Pandas) : doublons, valeurs manquantes, types, puis documentation du jeu de données.",
      },
      {
        title: "Explorer",
        text: "Analyse du taux d'absence selon le délai de réservation, la distance, les antécédents et le canal de rappel.",
      },
      {
        title: "Piloter",
        text: "Dashboard Power BI : 5 KPI, 5 graphiques et filtres par type de rendez-vous, âge et genre, amélioré d'une semaine à l'autre.",
      },
      {
        title: "Tester",
        text: "Score de risque de 0 à 4 facteurs, puis modèles de classification (scikit-learn) pour mesurer ce qu'ils apportent réellement.",
      },
    ],
    tools: ["Power BI", "DAX", "Python (Pandas)", "scikit-learn", "Jupyter"],
    figures: [
      { value: 48.5, decimals: 1, suffix: " %", label: "Taux d'absence" },
      { value: 72.7, decimals: 1, suffix: " %", label: "Rendez-vous avec rappel envoyé" },
      { value: 29.6, decimals: 1, suffix: " j", label: "Délai moyen de réservation" },
      { value: 1696, label: "Patients uniques" },
    ],
    figuresSource: "README du dépôt HealthConnect-Healthcare-Appointment-Analytics",
    insightsTitle: "Ce que montrent les données",
    insights: [
      "Le délai de réservation est le facteur le plus marqué : 24,8 % d'absences pour un rendez-vous pris 0 à 3 jours avant, contre 60,5 % au-delà de 30 jours.",
      "Les patients qui ont déjà manqué un rendez-vous s'absentent davantage (55,4 % contre 43,5 %), et le taux monte avec le nombre d'antécédents, jusqu'à 67,9 %.",
      "Au-delà de 20 km de la clinique, le taux d'absence atteint 57,8 %.",
      "Le SMS ressort comme le canal de rappel le plus efficace.",
      "Les modèles testés restent modestes (AUC de 0,62 à 0,67) et la random forest surapprend (75,8 % en entraînement contre 61,4 % en test) : le score sert à prioriser, pas à prédire individuellement.",
    ],
    chart: {
      title: "Taux d'absence selon le score de risque",
      caption: "Nombre de facteurs de risque cumulés par rendez-vous, de 0 à 4.",
      unit: " %",
      data: [
        { label: "0 facteur", value: 31.4, note: "1 013 rdv" },
        { label: "1 facteur", value: 44.9, note: "2 125 rdv" },
        { label: "2 facteurs", value: 59.3, note: "1 470 rdv" },
        { label: "3 facteurs", value: 71.1, highlight: true, note: "370 rdv" },
        { label: "4 facteurs", value: 68.2, note: "22 rdv · échantillon réduit" },
      ],
      source: "README du dépôt HealthConnect-Healthcare-Appointment-Analytics",
    },
    recommendations: [
      "Utiliser le score de risque dans le dashboard pour prioriser les patients à relancer",
      "Conserver les quatre facteurs séparément pour un futur modèle prédictif",
      "Garder l'historique d'absences en valeur continue plutôt qu'en catégories",
    ],
    limits: [
      "Données fictives : les résultats illustrent une démarche, ce n'est pas une solution médicale validée.",
      "Pouvoir prédictif modeste des modèles testés ; les facteurs sont associés aux absences, pas nécessairement leur cause.",
    ],
    deliverables: [
      "Notebook d'analyse documenté",
      "Dashboard Power BI (.pbix)",
      "Rapports hebdomadaires et présentation finale",
    ],
    cover: {
      src: "/realisations/healthconnect/dashboard.png",
      alt: "Dashboard Power BI HealthConnect : taux de no-show 48,46 %, taux de rappel 72,68 %, no-show selon le délai de réservation, l'historique, le type de rendez-vous, la distance et le canal de rappel.",
      width: 1317,
      height: 691,
    },
    gallery: [
      {
        src: "/realisations/healthconnect/regression-lead-time.png",
        alt: "Nuage de points du taux de no-show selon le délai de réservation en jours, avec droite de régression croissante.",
        width: 1064,
        height: 669,
        caption: "Taux d'absence selon le délai de réservation",
      },
      {
        src: "/realisations/healthconnect/extension-charts.png",
        alt: "Deux graphiques : écart d'accuracy entre entraînement et test pour deux random forests, et profil des absences non détectées par le modèle.",
        width: 1634,
        height: 630,
        caption: "Tests des modèles : surapprentissage et absences non détectées",
      },
    ],
    links: [
      { label: "Voir le dépôt GitHub", href: "https://github.com/fortune344/HealthConnect-Healthcare-Appointment-Analytics", kind: "github" },
    ],
    matches: ["github.com/fortune344/healthconnect-healthcare-appointment-analytics", "healthconnect"],
  },
  {
    slug: "telco-churn",
    kind: "data",
    service: "analyse",
    title: "Telco Customer Churn — pourquoi les clients partent",
    name: "Telco Customer Churn",
    sector: "Télécoms · fidélisation client",
    context: "Projet d'analyse de bout en bout",
    year: "2026",
    summary:
      "Identifier les profils de clients qui résilient, pour passer d'une rétention réactive à une rétention proactive.",
    problem:
      "L'opérateur perd plus d'un client sur quatre. Sans savoir qui part et pourquoi, les actions de fidélisation arrivent trop tard.",
    objectives: [
      "Mesurer le taux de résiliation",
      "Comparer les départs selon le contrat, le service internet, le support technique, le montant facturé et l'ancienneté",
      "Livrer un dashboard interactif filtrable par profil de client",
    ],
    facts: [
      { label: "Clients", value: "7 043" },
      { label: "Variables", value: "21" },
      { label: "Après nettoyage", value: "7 032 clients" },
      { label: "Lignes retirées", value: "11 (TotalCharges manquant, 0,16 %)" },
    ],
    dataNote: "Jeu de données de référence d'un opérateur télécom (clients anonymisés).",
    method: [
      {
        title: "Nettoyer",
        text: "Traitement des valeurs manquantes de TotalCharges et renommage des colonnes en français avec Pandas.",
      },
      {
        title: "Explorer",
        text: "Analyse exploratoire des départs avec Matplotlib et Seaborn, variable par variable.",
      },
      {
        title: "Visualiser",
        text: "Dashboard Power BI : KPI, cinq axes d'analyse et filtres par contrat, service internet, genre et âge.",
      },
      {
        title: "Restituer",
        text: "Rapport d'analyse et présentation des résultats.",
      },
    ],
    tools: ["Python", "Pandas", "Matplotlib", "Seaborn", "Power BI"],
    figures: [
      { value: 26.58, decimals: 2, suffix: " %", label: "Taux de churn" },
      { value: 1869, label: "Clients partis" },
      { value: 7032, label: "Clients analysés" },
      { value: 64.8, decimals: 2, prefix: "$", label: "Facture mensuelle moyenne" },
    ],
    figuresSource: "README et dashboard du dépôt Telco-Customer-Churn",
    insightsTitle: "Ce que montrent les données",
    insights: [
      "Le contrat mensuel concentre l'essentiel des départs ; les engagements d'un ou deux ans retiennent nettement mieux.",
      "Les clients équipés de la fibre optique et ceux sans support technique résilient davantage.",
      "Les clients qui partent paient en moyenne plus cher chaque mois et ont une ancienneté plus courte.",
    ],
    limits: [
      "Analyse descriptive : elle met en évidence des facteurs associés au départ, pas des causes démontrées.",
    ],
    deliverables: [
      "Dashboard Power BI (.pbix)",
      "Script d'analyse Python",
      "Rapport et présentation",
    ],
    cover: {
      src: "/realisations/telco/dashboard.png",
      alt: "Dashboard Power BI Telco Customer Churn : 7 032 clients, 1 869 départs, taux de churn 26,58 %, départs par type de contrat, service internet et support technique, ancienneté et facture moyennes.",
      width: 1151,
      height: 647,
    },
    gallery: [],
    links: [{ label: "Voir le dépôt GitHub", href: "https://github.com/fortune344/Telco-Customer-Churn", kind: "github" }],
    matches: ["github.com/fortune344/telco-customer-churn"],
  },
  {
    slug: "gestionpro",
    kind: "web",
    service: "web",
    title: "GestionPro — plateforme de gestion de projets",
    name: "GestionPro",
    sector: "Outil interne · gestion de projets",
    context: "Projet personnel",
    year: "2026",
    summary:
      "Une application web collaborative pour organiser les projets d'une équipe : tâches en Kanban, rôles, invitations et notifications.",
    problem:
      "Quand les tâches vivent entre fichiers, e-mails et messageries, personne n'a la même vision de l'avancement. Une équipe a besoin d'un espace unique, avec des rôles clairs.",
    objectives: [
      "Centraliser projets, tâches et échanges dans un seul outil",
      "Donner à chacun des droits adaptés à son rôle",
      "Rendre l'avancement visible d'un coup d'œil",
    ],
    facts: [
      { label: "Framework", value: "Django 5" },
      { label: "Base de données", value: "SQLite" },
      { label: "Interface", value: "Templates Django, CSS et JavaScript" },
      { label: "Qualité", value: "Tests unitaires (projets, tâches)" },
    ],
    method: [
      { title: "Modéliser", text: "Projets, membres, statuts, tâches, commentaires, invitations et notifications, avec leurs relations." },
      { title: "Sécuriser", text: "Comptes, rôles par projet et panneau d'administration des utilisateurs." },
      { title: "Fluidifier", text: "Kanban en glisser-déposer, détection des retards et journal d'activité." },
    ],
    tools: ["Django", "Python", "SQLite", "JavaScript", "HTML / CSS"],
    insightsTitle: "Fonctionnalités livrées",
    insights: [
      "Projets avec statut, dates et pourcentage d'avancement",
      "Rôles par projet : responsable, membre, observateur",
      "Tableau Kanban à colonnes personnalisables, en glisser-déposer",
      "Tâches avec priorités, échéances, plusieurs assignés, pièces jointes et détection des retards",
      "Invitations par e-mail avec lien sécurisé à durée limitée, révocables",
      "Commentaires avec mentions et journal d'activité",
      "Notifications dans l'application et tableau de bord personnel",
    ],
    limits: [
      "Notifications uniquement dans l'application : pas d'e-mail ni de temps réel.",
      "Pas de démonstration en ligne pour le moment.",
    ],
    deliverables: ["Application Django complète", "Tests unitaires", "Code source documenté"],
    cover: {
      src: "/realisations/gestionpro/accueil.png",
      alt: "Page d'accueil de GestionPro : « Pilotez vos projets avec clarté », boutons de création de compte et illustration d'un tableau Kanban.",
      width: 1532,
      height: 892,
    },
    gallery: [],
    links: [{ label: "Voir le dépôt GitHub", href: "https://github.com/fortune344/GestionPro", kind: "github" }],
    matches: ["github.com/fortune344/gestionpro"],
  },
  {
    slug: "digi-farm",
    kind: "web",
    service: "web",
    title: "Digi-Farm — marketplace agricole au Togo",
    name: "Digi-Farm",
    sector: "Agriculture · place de marché",
    context: "Projet personnel",
    year: "2026",
    status: "En développement",
    summary:
      "Une place de marché qui met en relation producteurs et acheteurs, avec un parcours de commande complet. Le paiement réel n'est pas encore intégré.",
    problem:
      "Mettre en relation directe producteurs et acheteurs, avec des garanties pour chacun : un paiement conservé jusqu'à la réception, et un suivi clair de chaque commande.",
    objectives: [
      "Permettre aux producteurs de publier leurs produits simplement",
      "Offrir aux acheteurs une recherche par catégorie et par région",
      "Préparer un paiement sous séquestre traçable",
    ],
    facts: [
      { label: "Framework", value: "Django 5.2 (LTS), Python 3.13" },
      { label: "Interface", value: "Tailwind CSS 4, HTMX" },
      { label: "Base de données", value: "SQLite (mode WAL)" },
      { label: "Qualité", value: "Suite de tests pytest" },
    ],
    method: [
      { title: "Structurer", text: "Applications séparées : comptes, annonces, commandes et socle commun, avec un contrôle d'accès centralisé (session, rôle, propriété)." },
      { title: "Tracer", text: "Chaque commande garde une copie du titre et du prix au moment de l'achat ; chaque mouvement de paiement est inscrit dans un journal inaltérable." },
      { title: "Préparer le paiement", text: "Logique de séquestre et de commission codée, branchée pour l'instant sur un agrégateur simulé." },
    ],
    tools: ["Django", "Python", "Tailwind CSS", "HTMX", "pytest"],
    insightsTitle: "Fonctionnalités en place",
    insights: [
      "Comptes producteur, acheteur et administrateur, rattachés aux régions du Togo",
      "Annonces : 8 catégories, prix en FCFA, unités (kg, sac, tonne), jusqu'à 5 photos converties en WebP",
      "Marché avec filtres par catégorie et par région",
      "Commande suivie de bout en bout : préparation, expédition, confirmation de réception, signalement de litige",
      "Logique de séquestre, commission de 5 % et journal de paiement",
    ],
    limits: [
      "Paiement réel non intégré : l'agrégateur est simulé et aucun argent ne circule. L'intégration d'un prestataire mobile money est envisagée.",
      "Restent à développer : l'arbitrage des litiges par l'administrateur, les avis sur les vendeurs et la mise en ligne.",
    ],
    deliverables: ["Application Django", "Tests automatisés", "Jeu de démonstration (26 annonces)"],
    cover: {
      src: "/realisations/digi-farm/accueil.png",
      alt: "Page d'accueil de Digi-Farm : « Achetez la récolte directement à l'agriculteur », barre de recherche par produit et par région, sur une photo d'ananas.",
      width: 1672,
      height: 862,
    },
    gallery: [],
    links: [{ label: "Voir le dépôt GitHub", href: "https://github.com/fortune344/Digi-Farm", kind: "github" }],
    matches: ["github.com/fortune344/digi-farm"],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/** Étude de cas suivante (boucle), pour la navigation entre projets. */
export function getNextCaseStudy(slug: string): CaseStudy {
  const i = CASE_STUDIES.findIndex((c) => c.slug === slug);
  return CASE_STUDIES[(i + 1) % CASE_STUDIES.length];
}

const normalize = (s: string) => s.toLowerCase().replace(/^https?:\/\/(www\.)?/, "").replace(/\/+$/, "");

/** Un projet Supabase est-il déjà présenté par une étude de cas ? */
export function isCoveredByCaseStudy(project: Project): boolean {
  const github = project.github ? normalize(project.github) : "";
  const title = project.title.toLowerCase();
  return CASE_STUDIES.some((c) =>
    c.matches.some((m) => (m.includes("github.com") ? github === m : title.includes(m)))
  );
}
