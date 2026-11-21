/**
 * Formulaire de contact : options et validation partagées entre le
 * navigateur (retour immédiat) et l'API (seule validation qui fait foi).
 */

export const SERVICE_OPTIONS = [
  { value: "powerbi", label: "Tableau de bord Power BI" },
  { value: "analyse", label: "Analyse de données" },
  { value: "excel", label: "Automatisation / Excel" },
  { value: "web", label: "Application web" },
  { value: "autre", label: "Autre / je ne sais pas encore" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "", label: "Je préfère ne pas préciser" },
  { value: "a-definir", label: "À définir ensemble" },
  { value: "moins-300k", label: "Moins de 300 000 FCFA (≈ 460 €)" },
  { value: "300k-1m", label: "300 000 – 1 000 000 FCFA" },
  { value: "plus-1m", label: "Plus de 1 000 000 FCFA (≈ 1 500 €)" },
] as const;

export type ServiceValue = (typeof SERVICE_OPTIONS)[number]["value"];
export type BudgetValue = (typeof BUDGET_OPTIONS)[number]["value"];

export type ContactInput = {
  name: string;
  email: string;
  company: string;
  service: ServiceValue;
  budget: BudgetValue;
  message: string;
};

export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 200 },
  company: { max: 120 },
  message: { min: 20, max: 4000 },
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function labelOf(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Valide et normalise une saisie. Retourne soit les données propres, soit les erreurs par champ. */
export function validateContact(
  raw: unknown
): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const r = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const data = {
    name: str(r.name),
    email: str(r.email).toLowerCase(),
    company: str(r.company),
    service: str(r.service),
    budget: str(r.budget),
    message: str(r.message),
  };
  const errors: ContactErrors = {};

  if (data.name.length < LIMITS.name.min) errors.name = "Indiquez votre nom.";
  else if (data.name.length > LIMITS.name.max) errors.name = "Nom trop long.";

  if (!data.email) errors.email = "Indiquez votre adresse e-mail.";
  else if (data.email.length > LIMITS.email.max || !EMAIL_RE.test(data.email))
    errors.email = "Cette adresse e-mail ne semble pas valide.";

  if (data.company.length > LIMITS.company.max) errors.company = "Nom d'entreprise trop long.";

  if (!SERVICE_OPTIONS.some((o) => o.value === data.service))
    errors.service = "Choisissez le type de besoin.";

  if (!BUDGET_OPTIONS.some((o) => o.value === data.budget)) errors.budget = "Budget invalide.";

  if (data.message.length < LIMITS.message.min)
    errors.message = `Décrivez votre besoin en quelques phrases (${LIMITS.message.min} caractères minimum).`;
  else if (data.message.length > LIMITS.message.max)
    errors.message = `Message trop long (${LIMITS.message.max} caractères maximum).`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: data as ContactInput };
}
