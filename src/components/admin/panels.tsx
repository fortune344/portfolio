"use client";

import {
  Briefcase,
  FileDown,
  FileText,
  FolderGit2,
  GraduationCap,
  Languages as LanguagesIcon,
  MapPin,
  Quote,
  Rocket,
  Sparkles,
  User,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { AddCard, Card, CardGrid } from "@/components/admin/CardGrid";
import { Modal } from "@/components/admin/Modal";
import {
  BTN_ADD,
  BTN_PRIMARY,
  BTN_SMALL,
  Field,
  FileField,
  ImageField,
  INPUT,
  LABEL,
  ListField,
  moveInList,
} from "@/components/admin/primitives";
import type {
  Language,
  PortfolioData,
  Project,
  ProjectCategory,
  ProjectScreenKind,
  SkillGroup,
  TimelineEntry,
} from "@/data/portfolio";

const CATEGORIES: ProjectCategory[] = ["Data", "Web", "Mobile", "Outil"];
const SCREENS: { value: ProjectScreenKind; label: string }[] = [
  { value: "chart", label: "Graphique (dashboard)" },
  { value: "kanban", label: "Kanban (app web)" },
  { value: "table", label: "Tableau (SQL / Excel)" },
  { value: "terminal", label: "Terminal (script)" },
];

type SetData = Dispatch<SetStateAction<PortfolioData | null>>;
type PanelProps = { data: PortfolioData; setData: SetData; reloadKey: number };

/** Boutons standard du pied de modale (supprimer + valider). */
function ModalFooter({
  onDelete,
  onClose,
}: {
  onDelete?: () => void;
  onClose: () => void;
}) {
  return (
    <>
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="mr-auto rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
        >
          Supprimer
        </button>
      ) : null}
      <button type="button" onClick={onClose} className={BTN_PRIMARY}>
        Terminé
      </button>
    </>
  );
}

/* ═══════════════════════════ PROFIL ═══════════════════════════ */
/* Cartes thématiques : Identité, Coordonnées, Hero. */

type ProfileCard = "identite" | "contact" | "hero" | "cv" | null;

export function ProfilePanel({ data, setData }: PanelProps) {
  const [open, setOpen] = useState<ProfileCard>(null);
  const { profile } = data;
  const patch = (p: Partial<PortfolioData["profile"]>) =>
    setData((d) => d && { ...d, profile: { ...d.profile, ...p } });

  return (
    <>
      <CardGrid>
        <Card icon={User} title="Identité" subtitle={`${profile.name} — ${profile.role}`} onClick={() => setOpen("identite")} />
        <Card icon={MapPin} title="Coordonnées & réseaux" subtitle={profile.email} onClick={() => setOpen("contact")} />
        <Card icon={FileText} title="Textes du Hero" subtitle="Disponibilité, phrases d'accroche" onClick={() => setOpen("hero")} />
        <Card icon={FileDown} title="CV téléchargeable" subtitle={profile.cvUrl ? "CV en ligne — cliquez pour gérer" : "Aucun CV — cliquez pour en ajouter un"} onClick={() => setOpen("cv")} />
      </CardGrid>

      <Modal open={open === "identite"} title="Identité" onClose={() => setOpen(null)} footer={<ModalFooter onClose={() => setOpen(null)} />}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Prénom" value={profile.firstName} onChange={(v) => patch({ firstName: v })} />
          <Field label="Nom" value={profile.lastName} onChange={(v) => patch({ lastName: v })} />
          <Field label="Nom complet" value={profile.name} onChange={(v) => patch({ name: v })} />
          <Field label="Rôle" value={profile.role} onChange={(v) => patch({ role: v })} />
        </div>
      </Modal>

      <Modal open={open === "contact"} title="Coordonnées & réseaux" onClose={() => setOpen(null)} footer={<ModalFooter onClose={() => setOpen(null)} />}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="E-mail" value={profile.email} onChange={(v) => patch({ email: v })} />
          <Field label="Localisation" value={profile.location} onChange={(v) => patch({ location: v })} />
          <Field label="Téléphone (affiché)" value={profile.phone} onChange={(v) => patch({ phone: v })} />
          <Field label="Téléphone (lien tel:)" value={profile.phoneHref} onChange={(v) => patch({ phoneHref: v })} />
          <Field label="Lien GitHub" value={profile.github} onChange={(v) => patch({ github: v })} />
          <Field label="Lien LinkedIn" value={profile.linkedin} onChange={(v) => patch({ linkedin: v })} />
        </div>
      </Modal>

      <Modal open={open === "hero"} title="Textes du Hero" onClose={() => setOpen(null)} footer={<ModalFooter onClose={() => setOpen(null)} />}>
        <Field label="Disponibilité (bulle avatar)" value={profile.availability} onChange={(v) => patch({ availability: v })} />
        <Field label="Texte en bas à gauche" value={profile.statusLine} onChange={(v) => patch({ statusLine: v })} textarea />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Texte du lien souligné" value={profile.statusLink.label} onChange={(v) => patch({ statusLink: { ...profile.statusLink, label: v } })} />
          <Field label="Cible du lien (#contact, URL…)" value={profile.statusLink.href} onChange={(v) => patch({ statusLink: { ...profile.statusLink, href: v } })} />
        </div>
        <Field label="Texte en bas à droite" value={profile.focusLine} onChange={(v) => patch({ focusLine: v })} textarea />
      </Modal>

      <Modal open={open === "cv"} title="CV téléchargeable" subtitle="Le bouton « Télécharger mon CV » n'apparaît sur le site que si un fichier est présent." onClose={() => setOpen(null)} footer={<ModalFooter onClose={() => setOpen(null)} />}>
        <FileField label="Fichier du CV (PDF recommandé)" value={profile.cvUrl} onChange={(url) => patch({ cvUrl: url })} />
        <p className="text-xs leading-relaxed text-muted">
          Après avoir choisi un fichier, ferme cette fenêtre puis clique sur
          <span className="text-foreground"> Enregistrer</span> en haut pour publier.
        </p>
      </Modal>
    </>
  );
}

/* ═══════════════════════════ À PROPOS ═══════════════════════════ */

type AboutCard = "manifeste" | "bio" | null;

export function AboutPanel({ data, setData }: PanelProps) {
  const [open, setOpen] = useState<AboutCard>(null);
  const { profile } = data;
  const patch = (p: Partial<PortfolioData["profile"]>) =>
    setData((d) => d && { ...d, profile: { ...d.profile, ...p } });

  return (
    <>
      <CardGrid>
        <Card icon={Quote} title="Manifeste" subtitle={`${profile.manifesto.length} ligne(s) — ${profile.manifesto[0] ?? ""}`} onClick={() => setOpen("manifeste")} />
        <Card icon={FileText} title="Biographie" subtitle={`${profile.bio.length} paragraphe(s)`} onClick={() => setOpen("bio")} />
      </CardGrid>

      <Modal open={open === "manifeste"} title="Manifeste" subtitle="Les grandes lignes affichées en typographie géante" onClose={() => setOpen(null)} footer={<ModalFooter onClose={() => setOpen(null)} />}>
        <div className="space-y-2">
          {profile.manifesto.map((line, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={line}
                onChange={(e) => patch({ manifesto: profile.manifesto.map((l, j) => (j === i ? e.target.value : l)) })}
                aria-label={`Ligne ${i + 1} du manifeste`}
                className={INPUT}
              />
              <button type="button" onClick={() => patch({ manifesto: profile.manifesto.filter((_, j) => j !== i) })} className={BTN_SMALL}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => patch({ manifesto: [...profile.manifesto, ""] })} className={BTN_ADD}>+ Ajouter une ligne</button>
      </Modal>

      <Modal open={open === "bio"} title="Biographie" onClose={() => setOpen(null)} footer={<ModalFooter onClose={() => setOpen(null)} />}>
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
              <button type="button" onClick={() => patch({ bio: profile.bio.filter((_, j) => j !== i) })} className={BTN_SMALL}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => patch({ bio: [...profile.bio, ""] })} className={BTN_ADD}>+ Ajouter un paragraphe</button>
      </Modal>
    </>
  );
}

/* ═══════════════════════════ COMPÉTENCES ═══════════════════════════ */

export function SkillsPanel({ data, setData, reloadKey }: PanelProps) {
  const [editing, setEditing] = useState<number | null>(null);
  const group = editing !== null ? data.skillGroups[editing] : null;

  const update = (index: number, patch: Partial<SkillGroup>) =>
    setData((d) => d && { ...d, skillGroups: d.skillGroups.map((g, j) => (j === index ? { ...g, ...patch } : g)) });
  const remove = (index: number) =>
    setData((d) => d && { ...d, skillGroups: d.skillGroups.filter((_, j) => j !== index) });
  const add = () => {
    setData((d) => d && { ...d, skillGroups: [...d.skillGroups, { title: "Nouveau groupe", skills: [] }] });
    setEditing(data.skillGroups.length);
  };

  return (
    <>
      <CardGrid>
        {data.skillGroups.map((g, i) => (
          <Card key={i} icon={Briefcase} title={g.title || "Sans titre"} subtitle={g.skills.join(", ") || "Aucune compétence"} onClick={() => setEditing(i)} />
        ))}
        <AddCard label="Ajouter un groupe" onClick={add} />
      </CardGrid>

      <Modal
        open={group !== null}
        title={group?.title || "Groupe de compétences"}
        onClose={() => setEditing(null)}
        footer={<ModalFooter onClose={() => setEditing(null)} onDelete={editing !== null ? () => { remove(editing); setEditing(null); } : undefined} />}
      >
        {group && editing !== null ? (
          <>
            <Field label="Titre du groupe" value={group.title} onChange={(v) => update(editing, { title: v })} />
            <ListField label="Compétences" values={group.skills} reloadKey={reloadKey} onCommit={(values) => update(editing, { skills: values })} />
          </>
        ) : null}
      </Modal>
    </>
  );
}

/* ═══════════════════════════ PROJETS ═══════════════════════════ */

const SCREEN_ICON = { chart: Briefcase, kanban: FolderGit2, table: FileText, terminal: FolderGit2 } as const;

export function ProjectsPanel({ data, setData, reloadKey }: PanelProps) {
  const [editing, setEditing] = useState<number | null>(null);
  const project = editing !== null ? data.projects[editing] : null;

  const update = (index: number, patch: Partial<Project>) =>
    setData((d) => d && { ...d, projects: d.projects.map((p, j) => (j === index ? { ...p, ...patch } : p)) });
  const remove = (index: number) =>
    setData((d) => d && { ...d, projects: d.projects.filter((_, j) => j !== index) });
  const move = (index: number, dir: -1 | 1) =>
    setData((d) => d && { ...d, projects: moveInList(d.projects, index, dir) });
  const add = () => {
    setData((d) => d && {
      ...d,
      projects: [...d.projects, { title: "Nouveau projet", description: "", tags: [], github: null, liveUrl: null, image: null, category: "Data", featured: false, screen: "chart" }],
    });
    setEditing(data.projects.length);
  };

  return (
    <>
      <CardGrid>
        {data.projects.map((p, i) => (
          <Card
            key={i}
            title={p.title || "Sans titre"}
            subtitle={p.description || "Pas de description"}
            thumb={p.image}
            icon={SCREEN_ICON[p.screen]}
            badge={p.featured ? "Vedette" : p.category}
            onClick={() => setEditing(i)}
          />
        ))}
        <AddCard label="Ajouter un projet" onClick={add} />
      </CardGrid>

      <Modal
        open={project !== null}
        title={project?.title || "Projet"}
        subtitle={project ? project.category : undefined}
        onClose={() => setEditing(null)}
        footer={
          <ModalFooter
            onClose={() => setEditing(null)}
            onDelete={editing !== null ? () => { remove(editing); setEditing(null); } : undefined}
          />
        }
      >
        {project && editing !== null ? (
          <>
            <Field label="Titre" value={project.title} onChange={(v) => update(editing, { title: v })} />
            <Field label="Description" value={project.description} textarea onChange={(v) => update(editing, { description: v })} />
            <ImageField value={project.image} onChange={(url) => update(editing, { image: url })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Lien GitHub (optionnel)" value={project.github ?? ""} placeholder="https://github.com/…" onChange={(v) => update(editing, { github: v.trim() || null })} />
              <Field label="Lien du site en ligne (optionnel)" value={project.liveUrl ?? ""} placeholder="https://…" onChange={(v) => update(editing, { liveUrl: v.trim() || null })} />
              <ListField label="Tags" values={project.tags} reloadKey={reloadKey} onCommit={(values) => update(editing, { tags: values })} />
              <label className="block">
                <span className={LABEL}>Catégorie</span>
                <select value={project.category} onChange={(e) => update(editing, { category: e.target.value as Project["category"] })} className={INPUT}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className={LABEL}>Aperçu dessiné (si aucune image)</span>
                <select value={project.screen} onChange={(e) => update(editing, { screen: e.target.value as Project["screen"] })} className={INPUT}>
                  {SCREENS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
            </div>
            <label className="flex items-center gap-2.5 text-sm">
              <input type="checkbox" checked={project.featured} onChange={(e) => update(editing, { featured: e.target.checked })} className="h-4 w-4 accent-[#e8e3d7]" />
              Projet vedette (grande carte avec mockup) — sinon liste compacte
            </label>
            <div className="flex items-center gap-2 border-t border-line pt-4">
              <span className={LABEL}>Ordre</span>
              <button type="button" disabled={editing === 0} onClick={() => { move(editing, -1); setEditing(editing - 1); }} className={BTN_SMALL}>↑ Monter</button>
              <button type="button" disabled={editing === data.projects.length - 1} onClick={() => { move(editing, 1); setEditing(editing + 1); }} className={BTN_SMALL}>↓ Descendre</button>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
}

/* ═══════════════════════════ PARCOURS ═══════════════════════════ */

export function JourneyPanel({ data, setData }: PanelProps) {
  const [editing, setEditing] = useState<number | null>(null);
  const entry = editing !== null ? data.timeline[editing] : null;

  const update = (index: number, patch: Partial<TimelineEntry>) =>
    setData((d) => d && { ...d, timeline: d.timeline.map((t, j) => (j === index ? { ...t, ...patch } : t)) });
  const remove = (index: number) =>
    setData((d) => d && { ...d, timeline: d.timeline.filter((_, j) => j !== index) });
  const move = (index: number, dir: -1 | 1) =>
    setData((d) => d && { ...d, timeline: moveInList(d.timeline, index, dir) });
  const add = () => {
    setData((d) => d && { ...d, timeline: [...d.timeline, { period: "2026", title: "Nouvelle étape", place: "", description: "", type: "projet" }] });
    setEditing(data.timeline.length);
  };

  return (
    <>
      <CardGrid>
        {data.timeline.map((t, i) => (
          <Card
            key={i}
            icon={t.type === "formation" ? GraduationCap : Rocket}
            title={t.title || "Sans titre"}
            subtitle={t.place || t.description}
            badge={t.period}
            onClick={() => setEditing(i)}
          />
        ))}
        <AddCard label="Ajouter une étape" onClick={add} />
      </CardGrid>

      <Modal
        open={entry !== null}
        title={entry?.title || "Étape du parcours"}
        subtitle={entry?.period}
        onClose={() => setEditing(null)}
        footer={<ModalFooter onClose={() => setEditing(null)} onDelete={editing !== null ? () => { remove(editing); setEditing(null); } : undefined} />}
      >
        {entry && editing !== null ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Période" value={entry.period} onChange={(v) => update(editing, { period: v })} />
              <label className="block">
                <span className={LABEL}>Type</span>
                <select value={entry.type} onChange={(e) => update(editing, { type: e.target.value as "formation" | "projet" })} className={INPUT}>
                  <option value="formation">Formation</option>
                  <option value="projet">Projet</option>
                </select>
              </label>
              <Field label="Titre" value={entry.title} onChange={(v) => update(editing, { title: v })} />
              <Field label="Lieu / contexte" value={entry.place} onChange={(v) => update(editing, { place: v })} />
            </div>
            <Field label="Description" value={entry.description} textarea onChange={(v) => update(editing, { description: v })} />
            <div className="flex items-center gap-2 border-t border-line pt-4">
              <span className={LABEL}>Ordre</span>
              <button type="button" disabled={editing === 0} onClick={() => { move(editing, -1); setEditing(editing - 1); }} className={BTN_SMALL}>↑ Monter</button>
              <button type="button" disabled={editing === data.timeline.length - 1} onClick={() => { move(editing, 1); setEditing(editing + 1); }} className={BTN_SMALL}>↓ Descendre</button>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
}

/* ═══════════════════════ LANGUES & INTÉRÊTS ═══════════════════════ */

type ExtrasCard = { kind: "lang"; index: number } | { kind: "interests" } | null;

export function ExtrasPanel({ data, setData, reloadKey }: PanelProps) {
  const [open, setOpen] = useState<ExtrasCard>(null);

  const updateLang = (index: number, patch: Partial<Language>) =>
    setData((d) => d && { ...d, languages: d.languages.map((l, j) => (j === index ? { ...l, ...patch } : l)) });
  const removeLang = (index: number) =>
    setData((d) => d && { ...d, languages: d.languages.filter((_, j) => j !== index) });
  const addLang = () => {
    setData((d) => d && { ...d, languages: [...d.languages, { name: "Nouvelle langue", level: "" }] });
    setOpen({ kind: "lang", index: data.languages.length });
  };

  const lang = open?.kind === "lang" ? data.languages[open.index] : null;

  return (
    <>
      <div className="space-y-8">
        <div>
          <p className={`${LABEL} mb-3`}>Langues</p>
          <CardGrid>
            {data.languages.map((l, i) => (
              <Card key={i} icon={LanguagesIcon} title={l.name || "Sans nom"} subtitle={l.level} onClick={() => setOpen({ kind: "lang", index: i })} />
            ))}
            <AddCard label="Ajouter une langue" onClick={addLang} />
          </CardGrid>
        </div>

        <div>
          <p className={`${LABEL} mb-3`}>Centres d&apos;intérêt</p>
          <CardGrid>
            <Card icon={Sparkles} title="Centres d'intérêt" subtitle={data.interests.join(", ") || "Aucun"} onClick={() => setOpen({ kind: "interests" })} />
          </CardGrid>
        </div>
      </div>

      <Modal
        open={open?.kind === "lang"}
        title={lang?.name || "Langue"}
        onClose={() => setOpen(null)}
        footer={<ModalFooter onClose={() => setOpen(null)} onDelete={open?.kind === "lang" ? () => { removeLang(open.index); setOpen(null); } : undefined} />}
      >
        {lang && open?.kind === "lang" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Langue" value={lang.name} onChange={(v) => updateLang(open.index, { name: v })} />
            <Field label="Niveau" value={lang.level} onChange={(v) => updateLang(open.index, { level: v })} />
          </div>
        ) : null}
      </Modal>

      <Modal
        open={open?.kind === "interests"}
        title="Centres d'intérêt"
        onClose={() => setOpen(null)}
        footer={<ModalFooter onClose={() => setOpen(null)} />}
      >
        <ListField label="Centres d'intérêt" values={data.interests} reloadKey={reloadKey} onCommit={(values) => setData((d) => d && { ...d, interests: values })} />
      </Modal>
    </>
  );
}
