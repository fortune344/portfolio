"use client";

import { useState, type ChangeEvent } from "react";

/** Styles partagés des champs de l'admin. */
export const INPUT =
  "w-full rounded-lg border border-line bg-black/40 px-3 py-2 text-sm outline-none transition-colors focus:border-foreground/60";
export const LABEL =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted";
export const BTN_SMALL =
  "rounded-md border border-line px-2.5 py-1 text-xs text-muted transition-colors hover:border-foreground/50 hover:text-foreground disabled:opacity-30";
export const BTN_ADD =
  "rounded-lg border border-dashed border-line px-4 py-2.5 text-sm text-muted transition-colors hover:border-foreground/50 hover:text-foreground";
export const BTN_PRIMARY =
  "rounded-lg bg-foreground px-5 py-2 text-sm font-semibold text-ink transition-opacity hover:opacity-85 disabled:opacity-50";
export const CARD =
  "rounded-xl border border-line bg-white/[0.02] p-4 sm:p-5";

export function Field({
  label,
  value,
  onChange,
  textarea = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className={INPUT}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={INPUT}
        />
      )}
    </label>
  );
}

/** Champ « liste » séparé par des virgules (commit au blur). */
export function ListField({
  label,
  values,
  onCommit,
  reloadKey,
}: {
  label: string;
  values: string[];
  onCommit: (values: string[]) => void;
  reloadKey: number;
}) {
  return (
    <label className="block">
      <span className={LABEL}>{label} (séparés par des virgules)</span>
      <textarea
        key={reloadKey}
        defaultValue={values.join(", ")}
        onBlur={(e) =>
          onCommit(
            e.target.value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          )
        }
        rows={2}
        className={INPUT}
      />
    </label>
  );
}

/** Upload d'image de projet avec aperçu. */
export function ImageField({
  value,
  onChange,
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error || "Erreur d'upload.");
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'upload.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <span className={LABEL}>Image du projet (affichée dans le laptop)</span>
      {value ? (
        <div className="mb-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Aperçu de l'image du projet"
            className="h-20 w-32 rounded-md border border-line object-cover"
          />
          <button type="button" onClick={() => onChange(null)} className={BTN_SMALL}>
            Retirer l&apos;image
          </button>
        </div>
      ) : null}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFile}
        disabled={uploading}
        aria-label="Choisir une image de projet"
        className="block w-full text-xs text-muted file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink"
      />
      {uploading ? <p className="mt-1 text-xs text-muted">Envoi en cours…</p> : null}
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
      <p className="mt-1 text-[10px] text-muted">
        PNG, JPEG, WebP ou GIF — 4 Mo max. Sans image, un aperçu dessiné est affiché.
      </p>
    </div>
  );
}

export function moveInList<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}
