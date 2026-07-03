"use client";

import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type {
  PortfolioData,
  Project,
  ProjectCategory,
  ProjectScreenKind,
} from "@/data/portfolio";

/**
 * Panneau d'administration du portfolio.
 * - Connexion par mot de passe (ADMIN_PASSWORD) avec session sécurisée.
 * - Lecture/écriture dans Supabase (ou JSON local en développement).
 * - Upload d'images de projets vers Supabase Storage.
 */

const CATEGORIES: ProjectCategory[] = ["Data", "Web", "Mobile", "Outil"];
const SCREENS: { value: ProjectScreenKind; label: string }[] = [
  { value: "chart", label: "Graphique (dashboard)" },
  { value: "kanban", label: "Kanban (app web)" },
  { value: "table", label: "Tableau (SQL / Excel)" },
  { value: "terminal", label: "Terminal (script)" },
];

const INPUT =
  "w-full rounded-lg border border-line bg-black/40 px-3 py-2 text-sm outline-none transition-colors focus:border-foreground/60";
const LABEL =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted";
const BTN_SMALL =
  "rounded-md border border-line px-2.5 py-1 text-xs text-muted transition-colors hover:border-foreground/50 hover:text-foreground disabled:opacity-30";
const BTN_ADD =
  "rounded-lg border border-dashed border-line px-4 py-2.5 text-sm text-muted transition-colors hover:border-foreground/50 hover:text-foreground";
const BTN_PRIMARY =
  "rounded-lg bg-foreground px-5 py-2 text-sm font-semibold text-ink transition-opacity hover:opacity-85 disabled:opacity-50";

function Field({
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
function ListField({
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
function ImageField({
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white/[0.02] p-5 sm:p-7">
      <h2 className="mb-6 font-display text-2xl uppercase tracking-wide">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function moveInList<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

type View = "loading" | "login" | "disabled" | "ready";

export default function AdminPage() {
  const [view, setView] = useState<View>("loading");
  const [data, setData] = useState<PortfolioData | null>(null);
  const [passwordConfigured, setPasswordConfigured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // État du formulaire de connexion
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    document.title = "Admin — Portfolio";
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      if (res.status === 401) {
        setView("login");
        return;
      }
      if (res.status === 403) {
        setView("disabled");
        return;
      }
      if (!res.ok) throw new Error();
      const json = (await res.json()) as {
        data: PortfolioData;
        meta: { passwordConfigured: boolean };
      };
      setData(json.data);
      setPasswordConfigured(json.meta.passwordConfigured);
      setReloadKey((k) => k + 1);
      setView("ready");
    } catch {
      setMessage("Impossible de charger les données.");
      setView("login");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Connexion impossible.");
      setPassword("");
      setView("loading");
      await load();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setData(null);
    setView("login");
  }

  async function save() {
    if (!data) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 401) {
        setView("login");
        return;
      }
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Erreur lors de l'enregistrement.");
      setMessage("Enregistré — le site est à jour.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 6000);
    }
  }

  /* ————— Écrans d'état ————— */

  if (view === "loading") {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-muted">Chargement…</p>
      </main>
    );
  }

  if (view === "disabled") {
    return (
      <main className="flex min-h-svh items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl uppercase">Admin désactivé</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            Définis la variable d&apos;environnement{" "}
            <code className="text-foreground">ADMIN_PASSWORD</code> (et les clés
            Supabase) sur Vercel pour activer l&apos;administration en ligne.
          </p>
        </div>
      </main>
    );
  }

  if (view === "login") {
    return (
      <main className="flex min-h-svh items-center justify-center px-5">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-line bg-white/[0.02] p-8"
        >
          <h1 className="font-display text-3xl uppercase tracking-wide">Admin</h1>
          <p className="mt-2 text-sm text-muted">
            Entre ton mot de passe pour gérer le portfolio.
          </p>
          <label className="mt-6 block">
            <span className={LABEL}>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className={INPUT}
            />
          </label>
          {loginError ? (
            <p className="mt-3 text-xs text-red-400">{loginError}</p>
          ) : null}
          <button
            type="submit"
            disabled={loggingIn}
            className={`${BTN_PRIMARY} mt-6 w-full`}
          >
            {loggingIn ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </main>
    );
  }

  if (!data) return null;

  const { profile } = data;
  const patchProfile = (patch: Partial<PortfolioData["profile"]>) =>
    setData((d) => d && { ...d, profile: { ...d.profile, ...patch } });
  const patchProject = (index: number, patch: Partial<Project>) =>
    setData(
      (d) =>
        d && {
          ...d,
          projects: d.projects.map((p, j) => (j === index ? { ...p, ...patch } : p)),
        }
    );

  return (
    <main className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
      {/* Barre d'actions */}
      <header className="sticky top-0 z-10 -mx-5 mb-10 border-b border-line bg-background/90 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl uppercase tracking-wide">
              Admin — Portfolio
            </h1>
            <p className="text-xs text-muted">
              {passwordConfigured
                ? "Connecté. Les modifications sont publiées dès l'enregistrement."
                : "Mode développement (aucun mot de passe configuré)."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {message ? <span className="text-xs text-muted">{message}</span> : null}
            <a href="/" className={BTN_SMALL}>
              Voir le site
            </a>
            <button type="button" onClick={load} className={BTN_SMALL}>
              Recharger
            </button>
            {passwordConfigured ? (
              <button type="button" onClick={handleLogout} className={BTN_SMALL}>
                Se déconnecter
              </button>
            ) : null}
            <button type="button" onClick={save} disabled={saving} className={BTN_PRIMARY}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {/* ————— Profil ————— */}
        <Section title="Profil">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Prénom" value={profile.firstName} onChange={(v) => patchProfile({ firstName: v })} />
            <Field label="Nom" value={profile.lastName} onChange={(v) => patchProfile({ lastName: v })} />
            <Field label="Nom complet" value={profile.name} onChange={(v) => patchProfile({ name: v })} />
            <Field label="Rôle" value={profile.role} onChange={(v) => patchProfile({ role: v })} />
            <Field label="E-mail" value={profile.email} onChange={(v) => patchProfile({ email: v })} />
            <Field label="Téléphone (affiché)" value={profile.phone} onChange={(v) => patchProfile({ phone: v })} />
            <Field label="Téléphone (lien tel:)" value={profile.phoneHref} onChange={(v) => patchProfile({ phoneHref: v })} />
            <Field label="Localisation" value={profile.location} onChange={(v) => patchProfile({ location: v })} />
            <Field label="Lien GitHub" value={profile.github} onChange={(v) => patchProfile({ github: v })} />
            <Field label="Lien LinkedIn" value={profile.linkedin} onChange={(v) => patchProfile({ linkedin: v })} />
            <Field label="Disponibilité (bulle avatar)" value={profile.availability} onChange={(v) => patchProfile({ availability: v })} />
          </div>
          <Field
            label="Hero — texte en bas à gauche"
            value={profile.statusLine}
            onChange={(v) => patchProfile({ statusLine: v })}
            textarea
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Hero — texte du lien souligné"
              value={profile.statusLink.label}
              onChange={(v) => patchProfile({ statusLink: { ...profile.statusLink, label: v } })}
            />
            <Field
              label="Hero — cible du lien (#contact, URL…)"
              value={profile.statusLink.href}
              onChange={(v) => patchProfile({ statusLink: { ...profile.statusLink, href: v } })}
            />
          </div>
          <Field
            label="Hero — texte en bas à droite"
            value={profile.focusLine}
            onChange={(v) => patchProfile({ focusLine: v })}
            textarea
          />
        </Section>

        {/* ————— Manifeste & bio ————— */}
        <Section title="À propos">
          <div>
            <span className={LABEL}>Manifeste (une ligne géante par champ)</span>
            <div className="space-y-2">
              {profile.manifesto.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={line}
                    onChange={(e) =>
                      patchProfile({
                        manifesto: profile.manifesto.map((l, j) =>
                          j === i ? e.target.value : l
                        ),
                      })
                    }
                    aria-label={`Ligne ${i + 1} du manifeste`}
                    className={INPUT}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patchProfile({ manifesto: profile.manifesto.filter((_, j) => j !== i) })
                    }
                    className={BTN_SMALL}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => patchProfile({ manifesto: [...profile.manifesto, ""] })}
              className={`${BTN_ADD} mt-3`}
            >
              + Ajouter une ligne
            </button>
          </div>
          <div>
            <span className={LABEL}>Bio (un paragraphe par champ)</span>
            <div className="space-y-2">
              {profile.bio.map((paragraph, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) =>
                      patchProfile({
                        bio: profile.bio.map((p, j) => (j === i ? e.target.value : p)),
                      })
                    }
                    rows={3}
                    aria-label={`Paragraphe ${i + 1} de la bio`}
                    className={INPUT}
                  />
                  <button
                    type="button"
                    onClick={() => patchProfile({ bio: profile.bio.filter((_, j) => j !== i) })}
                    className={BTN_SMALL}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => patchProfile({ bio: [...profile.bio, ""] })}
              className={`${BTN_ADD} mt-3`}
            >
              + Ajouter un paragraphe
            </button>
          </div>
        </Section>

        {/* ————— Compétences ————— */}
        <Section title="Compétences">
          {data.skillGroups.map((group, i) => (
            <div key={i} className="rounded-xl border border-line p-4">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-4">
                  <Field
                    label="Titre du groupe"
                    value={group.title}
                    onChange={(v) =>
                      setData((d) => d && {
                        ...d,
                        skillGroups: d.skillGroups.map((g, j) =>
                          j === i ? { ...g, title: v } : g
                        ),
                      })
                    }
                  />
                  <ListField
                    label="Compétences"
                    values={group.skills}
                    reloadKey={reloadKey}
                    onCommit={(values) =>
                      setData((d) => d && {
                        ...d,
                        skillGroups: d.skillGroups.map((g, j) =>
                          j === i ? { ...g, skills: values } : g
                        ),
                      })
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setData((d) => d && {
                      ...d,
                      skillGroups: d.skillGroups.filter((_, j) => j !== i),
                    })
                  }
                  className={BTN_SMALL}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setData((d) => d && {
                ...d,
                skillGroups: [...d.skillGroups, { title: "Nouveau groupe", skills: [] }],
              })
            }
            className={BTN_ADD}
          >
            + Ajouter un groupe
          </button>
        </Section>

        {/* ————— Projets ————— */}
        <Section title="Projets">
          {data.projects.map((project, i) => (
            <div key={i} className="rounded-xl border border-line p-4">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Projet {i + 1}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() =>
                      setData((d) => d && { ...d, projects: moveInList(d.projects, i, -1) })
                    }
                    className={BTN_SMALL}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={i === data.projects.length - 1}
                    onClick={() =>
                      setData((d) => d && { ...d, projects: moveInList(d.projects, i, 1) })
                    }
                    className={BTN_SMALL}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setData((d) => d && {
                        ...d,
                        projects: d.projects.filter((_, j) => j !== i),
                      })
                    }
                    className={BTN_SMALL}
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <Field label="Titre" value={project.title} onChange={(v) => patchProject(i, { title: v })} />
                <Field
                  label="Description"
                  value={project.description}
                  textarea
                  onChange={(v) => patchProject(i, { description: v })}
                />
                <ImageField
                  value={project.image}
                  onChange={(url) => patchProject(i, { image: url })}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Lien GitHub (optionnel)"
                    value={project.github ?? ""}
                    placeholder="https://github.com/…"
                    onChange={(v) => patchProject(i, { github: v.trim() || null })}
                  />
                  <Field
                    label="Lien du site en ligne (optionnel)"
                    value={project.liveUrl ?? ""}
                    placeholder="https://…"
                    onChange={(v) => patchProject(i, { liveUrl: v.trim() || null })}
                  />
                  <ListField
                    label="Tags"
                    values={project.tags}
                    reloadKey={reloadKey}
                    onCommit={(values) => patchProject(i, { tags: values })}
                  />
                  <label className="block">
                    <span className={LABEL}>Catégorie</span>
                    <select
                      value={project.category}
                      onChange={(e) =>
                        patchProject(i, { category: e.target.value as Project["category"] })
                      }
                      className={INPUT}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className={LABEL}>Aperçu dessiné (si aucune image)</span>
                    <select
                      value={project.screen}
                      onChange={(e) =>
                        patchProject(i, { screen: e.target.value as Project["screen"] })
                      }
                      className={INPUT}
                    >
                      {SCREENS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="flex items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={project.featured}
                    onChange={(e) => patchProject(i, { featured: e.target.checked })}
                    className="h-4 w-4 accent-[#e8e3d7]"
                  />
                  Projet vedette (grande carte avec mockup) — sinon affiché en liste compacte
                </label>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setData((d) => d && {
                ...d,
                projects: [
                  ...d.projects,
                  {
                    title: "Nouveau projet",
                    description: "",
                    tags: [],
                    github: null,
                    liveUrl: null,
                    image: null,
                    category: "Data",
                    featured: false,
                    screen: "chart",
                  },
                ],
              })
            }
            className={BTN_ADD}
          >
            + Ajouter un projet
          </button>
        </Section>

        {/* ————— Parcours ————— */}
        <Section title="Parcours">
          {data.timeline.map((entry, i) => (
            <div key={i} className="rounded-xl border border-line p-4">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Étape {i + 1}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() =>
                      setData((d) => d && { ...d, timeline: moveInList(d.timeline, i, -1) })
                    }
                    className={BTN_SMALL}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={i === data.timeline.length - 1}
                    onClick={() =>
                      setData((d) => d && { ...d, timeline: moveInList(d.timeline, i, 1) })
                    }
                    className={BTN_SMALL}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setData((d) => d && {
                        ...d,
                        timeline: d.timeline.filter((_, j) => j !== i),
                      })
                    }
                    className={BTN_SMALL}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Période"
                  value={entry.period}
                  onChange={(v) =>
                    setData((d) => d && {
                      ...d,
                      timeline: d.timeline.map((t, j) => (j === i ? { ...t, period: v } : t)),
                    })
                  }
                />
                <label className="block">
                  <span className={LABEL}>Type</span>
                  <select
                    value={entry.type}
                    onChange={(e) =>
                      setData((d) => d && {
                        ...d,
                        timeline: d.timeline.map((t, j) =>
                          j === i
                            ? { ...t, type: e.target.value as "formation" | "projet" }
                            : t
                        ),
                      })
                    }
                    className={INPUT}
                  >
                    <option value="formation">Formation</option>
                    <option value="projet">Projet</option>
                  </select>
                </label>
                <Field
                  label="Titre"
                  value={entry.title}
                  onChange={(v) =>
                    setData((d) => d && {
                      ...d,
                      timeline: d.timeline.map((t, j) => (j === i ? { ...t, title: v } : t)),
                    })
                  }
                />
                <Field
                  label="Lieu / contexte"
                  value={entry.place}
                  onChange={(v) =>
                    setData((d) => d && {
                      ...d,
                      timeline: d.timeline.map((t, j) => (j === i ? { ...t, place: v } : t)),
                    })
                  }
                />
              </div>
              <div className="mt-4">
                <Field
                  label="Description"
                  value={entry.description}
                  textarea
                  onChange={(v) =>
                    setData((d) => d && {
                      ...d,
                      timeline: d.timeline.map((t, j) =>
                        j === i ? { ...t, description: v } : t
                      ),
                    })
                  }
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setData((d) => d && {
                ...d,
                timeline: [
                  ...d.timeline,
                  {
                    period: "2026",
                    title: "Nouvelle étape",
                    place: "",
                    description: "",
                    type: "projet",
                  },
                ],
              })
            }
            className={BTN_ADD}
          >
            + Ajouter une étape
          </button>
        </Section>

        {/* ————— Langues & intérêts ————— */}
        <Section title="Langues & centres d'intérêt">
          {data.languages.map((lang, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Langue"
                  value={lang.name}
                  onChange={(v) =>
                    setData((d) => d && {
                      ...d,
                      languages: d.languages.map((l, j) => (j === i ? { ...l, name: v } : l)),
                    })
                  }
                />
                <Field
                  label="Niveau"
                  value={lang.level}
                  onChange={(v) =>
                    setData((d) => d && {
                      ...d,
                      languages: d.languages.map((l, j) => (j === i ? { ...l, level: v } : l)),
                    })
                  }
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setData((d) => d && {
                    ...d,
                    languages: d.languages.filter((_, j) => j !== i),
                  })
                }
                className={`${BTN_SMALL} mb-1`}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setData((d) => d && {
                ...d,
                languages: [...d.languages, { name: "", level: "" }],
              })
            }
            className={BTN_ADD}
          >
            + Ajouter une langue
          </button>
          <ListField
            label="Centres d'intérêt"
            values={data.interests}
            reloadKey={reloadKey}
            onCommit={(values) => setData((d) => d && { ...d, interests: values })}
          />
        </Section>
      </div>
    </main>
  );
}
