import { BUDGET_OPTIONS, SERVICE_OPTIONS, labelOf, type ContactInput } from "@/lib/contact";
import { getSupabase } from "@/lib/supabase";

/**
 * Livraison des messages du formulaire de contact.
 * Deux canaux indépendants, chacun optionnel :
 * - Supabase : table `contact_messages` (voir supabase/schema.sql), lisible dans /admin ;
 * - Resend : e-mail de notification (RESEND_API_KEY + CONTACT_TO_EMAIL).
 * Un message est considéré comme reçu si au moins un canal a réussi.
 * Aucun canal configuré = erreur explicite, jamais d'envoi simulé.
 */

export type ContactMessage = ContactInput & {
  id: string;
  created_at: string;
  read: boolean;
};

const TABLE = "contact_messages";

function resendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !to) return null;
  return {
    apiKey,
    to,
    from: process.env.RESEND_FROM?.trim() || "Portfolio Fortune Assouan <onboarding@resend.dev>",
  };
}

export function contactChannels() {
  return { supabase: Boolean(getSupabase()), email: Boolean(resendConfig()) };
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function saveToSupabase(input: ContactInput): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase non configuré");
  const { error } = await supabase.from(TABLE).insert({
    name: input.name,
    email: input.email,
    company: input.company || null,
    service: input.service,
    budget: input.budget || null,
    message: input.message,
  });
  if (error) throw new Error(`Supabase : ${error.message}`);
}

async function sendEmail(input: ContactInput): Promise<void> {
  const cfg = resendConfig();
  if (!cfg) throw new Error("Resend non configuré");
  const service = labelOf(SERVICE_OPTIONS, input.service);
  const budget = input.budget ? labelOf(BUDGET_OPTIONS, input.budget) : "Non précisé";
  const rows: [string, string][] = [
    ["Nom", input.name],
    ["E-mail", input.email],
    ["Entreprise", input.company || "—"],
    ["Besoin", service],
    ["Budget", budget],
  ];
  const text = `${rows.map(([k, v]) => `${k} : ${v}`).join("\n")}\n\n${input.message}`;
  const html = `<table style="font-family:sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#666">${k}</td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(input.message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: cfg.from,
      to: [cfg.to],
      reply_to: input.email,
      subject: `Nouveau contact portfolio — ${service} — ${input.name}`,
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend : HTTP ${res.status} ${await res.text().catch(() => "")}`);
}

export type DeliveryResult =
  | { ok: true; stored: boolean; emailed: boolean }
  | { ok: false; reason: "not_configured" | "failed" };

export async function deliverContact(input: ContactInput): Promise<DeliveryResult> {
  const channels = contactChannels();
  if (!channels.supabase && !channels.email) return { ok: false, reason: "not_configured" };

  const [stored, emailed] = await Promise.allSettled([
    channels.supabase ? saveToSupabase(input) : Promise.reject(new Error("off")),
    channels.email ? sendEmail(input) : Promise.reject(new Error("off")),
  ]);
  for (const r of [stored, emailed]) {
    if (r.status === "rejected" && (r.reason as Error).message !== "off") {
      console.error("[contact]", (r.reason as Error).message);
    }
  }
  const okStored = stored.status === "fulfilled";
  const okEmailed = emailed.status === "fulfilled";
  if (!okStored && !okEmailed) return { ok: false, reason: "failed" };
  return { ok: true, stored: okStored, emailed: okEmailed };
}

/* ——— Lecture pour l'admin ——— */

export async function listMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as ContactMessage[];
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase non configuré");
  const { error } = await supabase.from(TABLE).update({ read }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteMessage(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase non configuré");
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
