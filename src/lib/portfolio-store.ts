import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultPortfolio, type PortfolioData } from "@/data/portfolio";
import { getSupabase, STORAGE_BUCKET } from "@/lib/supabase";

/**
 * Couche d'accès aux données du portfolio.
 * - Avec Supabase configuré : lecture/écriture dans la table `portfolio`
 *   (une ligne JSONB) et upload des images dans le bucket Storage.
 * - Sans Supabase (ex. développement) : lecture/écriture du JSON local
 *   et images enregistrées dans public/uploads.
 */

const LOCAL_JSON = path.join(process.cwd(), "src", "data", "portfolio.json");
const ROW_ID = 1;
const isProd = process.env.NODE_ENV === "production";

export async function getPortfolio(): Promise<PortfolioData> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("portfolio")
      .select("content")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (!error && data?.content) return data.content as PortfolioData;
  }
  return defaultPortfolio;
}

export async function savePortfolio(content: PortfolioData): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("portfolio").upsert({
      id: ROW_ID,
      content,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(`Supabase : ${error.message}`);
    return;
  }
  if (isProd) {
    throw new Error(
      "Supabase n'est pas configuré : impossible d'enregistrer en production."
    );
  }
  await fs.writeFile(LOCAL_JSON, JSON.stringify(content, null, 2) + "\n", "utf-8");
}

const IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 Mo

/** Enregistre une image et retourne son URL publique. */
export async function uploadImage(file: File): Promise<string> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) {
    throw new Error("Format non supporté (PNG, JPEG, WebP ou GIF uniquement).");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image trop lourde (4 Mo maximum).");
  }

  const base = (file.name.replace(/\.[^.]*$/, "") || "image")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const filename = `${Date.now()}-${base || "image"}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = getSupabase();
  if (supabase) {
    const objectPath = `projets/${filename}`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(objectPath, buffer, { contentType: file.type, upsert: false });
    if (error) throw new Error(`Supabase Storage : ${error.message}`);
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
    return data.publicUrl;
  }

  if (isProd) {
    throw new Error(
      "Supabase n'est pas configuré : impossible d'uploader en production."
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}
