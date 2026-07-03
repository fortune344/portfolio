"use client";

import type { Dispatch, SetStateAction } from "react";
import type {
  PortfolioData,
  Project,
  ProjectCategory,
  ProjectScreenKind,
} from "@/data/portfolio";
import {
  BTN_ADD,
  BTN_SMALL,
  CARD,
  Field,
  ImageField,
  INPUT,
  LABEL,
  ListField,
  moveInList,
} from "@/components/admin/primitives";

const CATEGORIES: ProjectCategory[] = ["Data", "Web", "Mobile", "Outil"];
const SCREENS: { value: ProjectScreenKind; label: string }[] = [
  { value: "chart", label: "Graphique (dashboard)" },
  { value: "kanban", label: "Kanban (app web)" },
  { value: "table", label: "Tableau (SQL / Excel)" },
  { value: "terminal", label: "Terminal (script)" },
];

type SetData = Dispatch<SetStateAction<PortfolioData | null>>;

type PanelProps = {
  data: PortfolioData;
  setData: SetData;
  reloadKey: number;
};

/* ————————————————————————— Profil ————————————————————————— */

export function ProfilePanel({ data, setData }: PanelProps) {
  const { profile } = data;
  const patch = (p: Partial<PortfolioData["profile"]>) =>
    setData((d) => d && { ...d, profile: { ...d.profile, ...p } });

  return (
    <div className="space-y-6">
      <div className={CARD}>
        <h3 className="mb-4 text-sm font-semibold">Identité</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Prénom" value={profile.firstName} onChange={(v) => patch({ firstName: v })} />
          <Field label="Nom" value={profile.lastName} onChange={(v) => patch({ lastName: v })} />
          <Field label="Nom complet" value={profile.name} onChange={(v) => patch({ name: v })} />
          <Field label="Rôle" value={profile.role} onChange={(v) => patch({ role: v })} />
        </div>
      </div>

      <div className={CARD}>
        <h3 className="mb-4 text-sm font-semibold">Coordonnées & réseaux</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="E-mail" value={profile.email} onChange={(v) => patch({ email: v })} />
          <Field label="Localisation" value={profile.location} onChange={(v) => patch({ location: v })} />
          <Field label="Téléphone (affiché)" value={profile.phone} onChange={(v) => patch({ phone: v })} />
          <Field label="Téléphone (lien tel:)" value={profile.phoneHref} onChange={(v) => patch({ phoneHref: v })} />
          <Field label="Lien GitHub" value={profile.github} onChange={(v) => patch({ github: v })} />
          <Field label="Lien LinkedIn" value={profile.linkedin} onChange={(v) => patch({ linkedin: v })} />
        </div>
      </div>

      <div className={CARD}>
        <h3 className="mb-4 text-sm font-semibold">Textes du Hero</h3>
        <div className="space-y-5">
          <Field label="Disponibilité (bulle avatar)" value={profile.availability} onChange={(v) => patch({ availability: v })} />
          <Field label="Texte en bas à gauche" value={profile.statusLine} onChange={(v) => patch({ statusLine: v })} textarea />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Texte du lien souligné"
              value={profile.statusLink.label}
              onChange={(v) => patch({ statusLink: { ...profile.statusLink, label: v } })}
            />
            <Field
              label="Cible du lien (#contact, URL…)"
              value={profile.statusLink.href}
              onChange={(v) => patch({ statusLink: { ...profile.statusLink, href: v } })}
            />
          </div>
          <Field label="Texte en bas à droite" value={profile.focusLine} onChange={(v) => patch({ focusLine: v })} textarea />
        </div>
      </div>
    </div>
  );
}

/* ————————————————————————— À propos ————————————————————————— */

export function AboutPanel({ data, setData }: PanelProps) {
  const { profile } = data;
  const patch = (p: Partial<PortfolioData["profile"]>) =>
    setData((d) => d && { ...d, profile: { ...d.profile, ...p } });

  return (
    <div className="space-y-6">
      <div className={CARD}>
        <span className={LABEL}>Manifeste (une ligne géante par champ)</span>
        <div className="space-y-2">
          {profile.manifesto.map((line, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={line}
                onChange={(e) =>
                  patch({ manifesto: profile.manifesto.map((l, j) => (j === i ? e.target.value : l)) })
                }
                aria-label={`Ligne ${i + 1} du manifeste`}
                className={INPUT}
              />
              <button
                type="button"
                onClick={() => patch({ manifesto: profile.manifesto.filter((_, j) => j !== i) })}
                className={BTN_SMALL}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => patch({ manifesto: [...profile.manifesto, ""] })} className={`${BTN_ADD} mt-3`}>
          + Ajouter une ligne
        </button>
      </div>

      <div className={CARD}>
        <span className={LABEL}>Bio (un paragraphe par champ)</span>
        <div className="space-y-2">
          {profile.bio.map((paragraph, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                value={paragraph}
                onChange={(e) => patch({ bio: profile.bio.map((p, j) => (j === i ? e.target.value : p)) })}
                rows={3}
                aria-label={`Paragraphe ${i + 1} de la bio`}
                className={INPUT}
              />
              <button
                type="button"
                onClick={() => patch({ bio: profile.bio.filter((_, j) => j !== i) })}
                className={BTN_SMALL}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => patch({ bio: [...profile.bio, ""] })} className={`${BTN_ADD} mt-3`}>
          + Ajouter un paragraphe
        </button>
      </div>
    </div>
  );
}

/* ————————————————————————— Compétences ————————————————————————— */

export function SkillsPanel({ data, setData, reloadKey }: PanelProps) {
  return (
    <div className="space-y-4">
      {data.skillGroups.map((group, i) => (
        <div key={i} className={CARD}>
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-4">
              <Field
                label="Titre du groupe"
                value={group.title}
                onChange={(v) =>
                  setData((d) => d && {
                    ...d,
                    skillGroups: d.skillGroups.map((g, j) => (j === i ? { ...g, title: v } : g)),
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
                    skillGroups: d.skillGroups.map((g, j) => (j === i ? { ...g, skills: values } : g)),
                  })
                }
              />
            </div>
            <button
              type="button"
              onClick={() => setData((d) => d && { ...d, skillGroups: d.skillGroups.filter((_, j) => j !== i) })}
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
          setData((d) => d && { ...d, skillGroups: [...d.skillGroups, { title: "Nouveau groupe", skills: [] }] })
        }
        className={BTN_ADD}
      >
        + Ajouter un groupe
      </button>
    </div>
  );
}

/* ————————————————————————— Projets ————————————————————————— */

export function ProjectsPanel({ data, setData, reloadKey }: PanelProps) {
  const patchProject = (index: number, patch: Partial<Project>) =>
    setData((d) => d && {
      ...d,
      projects: d.projects.map((p, j) => (j === index ? { ...p, ...patch } : p)),
    });

  return (
    <div className="space-y-4">
      {data.projects.map((project, i) => (
        <div key={i} className={CARD}>
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {project.title || `Projet ${i + 1}`}
            </p>
            <div className="flex gap-2">
              <button type="button" disabled={i === 0} onClick={() => setData((d) => d && { ...d, projects: moveInList(d.projects, i, -1) })} className={BTN_SMALL}>↑</button>
              <button type="button" disabled={i === data.projects.length - 1} onClick={() => setData((d) => d && { ...d, projects: moveInList(d.projects, i, 1) })} className={BTN_SMALL}>↓</button>
              <button type="button" onClick={() => setData((d) => d && { ...d, projects: d.projects.filter((_, j) => j !== i) })} className={BTN_SMALL}>Supprimer</button>
            </div>
          </div>

          <div className="space-y-4">
            <Field label="Titre" value={project.title} onChange={(v) => patchProject(i, { title: v })} />
            <Field label="Description" value={project.description} textarea onChange={(v) => patchProject(i, { description: v })} />
            <ImageField value={project.image} onChange={(url) => patchProject(i, { image: url })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Lien GitHub (optionnel)" value={project.github ?? ""} placeholder="https://github.com/…" onChange={(v) => patchProject(i, { github: v.trim() || null })} />
              <Field label="Lien du site en ligne (optionnel)" value={project.liveUrl ?? ""} placeholder="https://…" onChange={(v) => patchProject(i, { liveUrl: v.trim() || null })} />
              <ListField label="Tags" values={project.tags} reloadKey={reloadKey} onCommit={(values) => patchProject(i, { tags: values })} />
              <label className="block">
                <span className={LABEL}>Catégorie</span>
                <select value={project.category} onChange={(e) => patchProject(i, { category: e.target.value as Project["category"] })} className={INPUT}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className={LABEL}>Aperçu dessiné (si aucune image)</span>
                <select value={project.screen} onChange={(e) => patchProject(i, { screen: e.target.value as Project["screen"] })} className={INPUT}>
                  {SCREENS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
            </div>
            <label className="flex items-center gap-2.5 text-sm">
              <input type="checkbox" checked={project.featured} onChange={(e) => patchProject(i, { featured: e.target.checked })} className="h-4 w-4 accent-[#e8e3d7]" />
              Projet vedette (grande carte avec mockup) — sinon liste compacte
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
              { title: "Nouveau projet", description: "", tags: [], github: null, liveUrl: null, image: null, category: "Data", featured: false, screen: "chart" },
            ],
          })
        }
        className={BTN_ADD}
      >
        + Ajouter un projet
      </button>
    </div>
  );
}

/* ————————————————————————— Parcours ————————————————————————— */

export function JourneyPanel({ data, setData }: PanelProps) {
  const patchEntry = (index: number, patch: Partial<PortfolioData["timeline"][number]>) =>
    setData((d) => d && {
      ...d,
      timeline: d.timeline.map((t, j) => (j === index ? { ...t, ...patch } : t)),
    });

  return (
    <div className="space-y-4">
      {data.timeline.map((entry, i) => (
        <div key={i} className={CARD}>
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {entry.title || `Étape ${i + 1}`}
            </p>
            <div className="flex gap-2">
              <button type="button" disabled={i === 0} onClick={() => setData((d) => d && { ...d, timeline: moveInList(d.timeline, i, -1) })} className={BTN_SMALL}>↑</button>
              <button type="button" disabled={i === data.timeline.length - 1} onClick={() => setData((d) => d && { ...d, timeline: moveInList(d.timeline, i, 1) })} className={BTN_SMALL}>↓</button>
              <button type="button" onClick={() => setData((d) => d && { ...d, timeline: d.timeline.filter((_, j) => j !== i) })} className={BTN_SMALL}>Supprimer</button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Période" value={entry.period} onChange={(v) => patchEntry(i, { period: v })} />
            <label className="block">
              <span className={LABEL}>Type</span>
              <select value={entry.type} onChange={(e) => patchEntry(i, { type: e.target.value as "formation" | "projet" })} className={INPUT}>
                <option value="formation">Formation</option>
                <option value="projet">Projet</option>
              </select>
            </label>
            <Field label="Titre" value={entry.title} onChange={(v) => patchEntry(i, { title: v })} />
            <Field label="Lieu / contexte" value={entry.place} onChange={(v) => patchEntry(i, { place: v })} />
          </div>
          <div className="mt-4">
            <Field label="Description" value={entry.description} textarea onChange={(v) => patchEntry(i, { description: v })} />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setData((d) => d && {
            ...d,
            timeline: [...d.timeline, { period: "2026", title: "Nouvelle étape", place: "", description: "", type: "projet" }],
          })
        }
        className={BTN_ADD}
      >
        + Ajouter une étape
      </button>
    </div>
  );
}

/* ————————————————————— Langues & intérêts ————————————————————— */

export function ExtrasPanel({ data, setData, reloadKey }: PanelProps) {
  return (
    <div className="space-y-6">
      <div className={CARD}>
        <h3 className="mb-4 text-sm font-semibold">Langues</h3>
        <div className="space-y-3">
          {data.languages.map((lang, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <Field label="Langue" value={lang.name} onChange={(v) => setData((d) => d && { ...d, languages: d.languages.map((l, j) => (j === i ? { ...l, name: v } : l)) })} />
                <Field label="Niveau" value={lang.level} onChange={(v) => setData((d) => d && { ...d, languages: d.languages.map((l, j) => (j === i ? { ...l, level: v } : l)) })} />
              </div>
              <button type="button" onClick={() => setData((d) => d && { ...d, languages: d.languages.filter((_, j) => j !== i) })} className={`${BTN_SMALL} mb-1`}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setData((d) => d && { ...d, languages: [...d.languages, { name: "", level: "" }] })} className={`${BTN_ADD} mt-3`}>
          + Ajouter une langue
        </button>
      </div>

      <div className={CARD}>
        <h3 className="mb-4 text-sm font-semibold">Centres d&apos;intérêt</h3>
        <ListField
          label="Centres d'intérêt"
          values={data.interests}
          reloadKey={reloadKey}
          onCommit={(values) => setData((d) => d && { ...d, interests: values })}
        />
      </div>
    </div>
  );
}
