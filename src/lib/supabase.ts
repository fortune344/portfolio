import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Nom du bucket Supabase Storage pour les images du portfolio. */
export const STORAGE_BUCKET = "portfolio";

let cached: SupabaseClient | null | undefined;

/**
 * Nettoie une variable d'environnement copiée-collée : retire espaces,
 * guillemets et slash final éventuels. Ces caractères parasites cassent
 * l'URL Supabase (« Invalid path specified in request URL »).
 */
function clean(value: string | undefined): string {
  return (value ?? "").trim().replace(/^['"]|['"]$/g, "");
}

/** Diagnostic de configuration Supabase (sans exposer la clé). */
export function supabaseConfigError(): string | null {
  const url = clean(process.env.SUPABASE_URL);
  const key = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url && !key) return null; // Supabase non configuré : repli local assumé.
  if (!url) return "SUPABASE_URL est manquante.";
  if (!key) return "SUPABASE_SERVICE_ROLE_KEY est manquante.";
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url.replace(/\/+$/, ""))) {
    return `SUPABASE_URL invalide : « ${url} ». Attendu : https://xxxx.supabase.co (sans slash final, sans guillemets).`;
  }
  return null;
}

/**
 * Client Supabase côté serveur (clé service role — ne jamais l'exposer au
 * navigateur). Retourne null si Supabase n'est pas configuré : le site
 * bascule alors sur les données locales (src/data/portfolio.json).
 */
export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = clean(process.env.SUPABASE_URL).replace(/\/+$/, "");
  const key = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  cached =
    url && key
      ? createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;
  return cached;
}
