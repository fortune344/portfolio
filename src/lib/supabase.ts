import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Nom du bucket Supabase Storage pour les images du portfolio. */
export const STORAGE_BUCKET = "portfolio";

let cached: SupabaseClient | null | undefined;

/**
 * Client Supabase côté serveur (clé service role — ne jamais l'exposer au
 * navigateur). Retourne null si Supabase n'est pas configuré : le site
 * bascule alors sur les données locales (src/data/portfolio.json).
 */
export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cached =
    url && key
      ? createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;
  return cached;
}
