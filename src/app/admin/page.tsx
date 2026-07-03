"use client";

import {
  Briefcase,
  FolderGit2,
  Languages,
  LayoutDashboard,
  Menu,
  Route as RouteIcon,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  AboutPanel,
  ExtrasPanel,
  JourneyPanel,
  ProfilePanel,
  ProjectsPanel,
  SkillsPanel,
} from "@/components/admin/panels";
import { BTN_PRIMARY, BTN_SMALL, INPUT, LABEL } from "@/components/admin/primitives";
import type { PortfolioData } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Tableau de bord d'administration du portfolio.
 * Navigation latérale par onglets (un panneau visible à la fois) — connexion
 * par mot de passe, données Supabase (ou JSON local en dev), upload d'images.
 */

type TabId = "profil" | "apropos" | "competences" | "projets" | "parcours" | "extras";

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "profil", label: "Profil", icon: User },
  { id: "apropos", label: "À propos", icon: LayoutDashboard },
  { id: "competences", label: "Compétences", icon: Briefcase },
  { id: "projets", label: "Projets", icon: FolderGit2 },
  { id: "parcours", label: "Parcours", icon: RouteIcon },
  { id: "extras", label: "Langues & intérêts", icon: Languages },
];

type View = "loading" | "login" | "disabled" | "ready";

export default function AdminPage() {
  const [view, setView] = useState<View>("loading");
  const [data, setData] = useState<PortfolioData | null>(null);
  const [passwordConfigured, setPasswordConfigured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [tab, setTab] = useState<TabId>("profil");
  const [navOpen, setNavOpen] = useState(false);

  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    document.title = "Admin — Portfolio";
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      if (res.status === 401) return setView("login");
      if (res.status === 403) return setView("disabled");
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
      if (res.status === 401) return setView("login");
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Erreur lors de l'enregistrement.");
      setMessage("✓ Enregistré — le site est à jour.");
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
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-line bg-white/[0.02] p-8">
          <h1 className="font-display text-3xl uppercase tracking-wide">Admin</h1>
          <p className="mt-2 text-sm text-muted">Entre ton mot de passe pour gérer le portfolio.</p>
          <label className="mt-6 block">
            <span className={LABEL}>Mot de passe</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus className={INPUT} />
          </label>
          {loginError ? <p className="mt-3 text-xs text-red-400">{loginError}</p> : null}
          <button type="submit" disabled={loggingIn} className={`${BTN_PRIMARY} mt-6 w-full`}>
            {loggingIn ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </main>
    );
  }

  if (!data) return null;

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  const panelProps = { data, setData, reloadKey };

  return (
    <div className="min-h-svh md:grid md:grid-cols-[248px_1fr]">
      {/* ————— Barre latérale ————— */}
      <aside
        className={cn(
          "z-40 flex flex-col border-r border-line bg-panel md:sticky md:top-0 md:h-svh",
          "fixed inset-y-0 left-0 w-64 transition-transform duration-300 md:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <span className="font-display text-xl uppercase tracking-wide">
            Admin<span className="text-muted">.</span>
          </span>
          <button type="button" onClick={() => setNavOpen(false)} aria-label="Fermer le menu" className="md:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  setNavOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-foreground text-ink font-semibold"
                    : "text-muted hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon size={17} />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-line p-3">
          <a href="/" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground">
            ↗ Voir le site
          </a>
          {passwordConfigured ? (
            <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground">
              ← Se déconnecter
            </button>
          ) : null}
        </div>
      </aside>

      {/* Voile mobile */}
      {navOpen ? (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      ) : null}

      {/* ————— Contenu ————— */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-background/90 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setNavOpen(true)} aria-label="Ouvrir le menu" className="md:hidden">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="font-display text-xl uppercase tracking-wide sm:text-2xl">
                {active.label}
              </h1>
              <p className="hidden text-xs text-muted sm:block">
                {passwordConfigured
                  ? "Modifie puis enregistre — publié immédiatement."
                  : "Mode développement (aucun mot de passe configuré)."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {message ? (
              <span className="hidden max-w-xs truncate text-xs text-muted sm:inline">{message}</span>
            ) : null}
            <button type="button" onClick={load} className={BTN_SMALL}>
              Recharger
            </button>
            <button type="button" onClick={save} disabled={saving} className={BTN_PRIMARY}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </header>

        {message ? (
          <p className="border-b border-line bg-white/[0.02] px-5 py-2 text-xs text-muted sm:hidden">{message}</p>
        ) : null}

        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:px-8">
          {tab === "profil" && <ProfilePanel {...panelProps} />}
          {tab === "apropos" && <AboutPanel {...panelProps} />}
          {tab === "competences" && <SkillsPanel {...panelProps} />}
          {tab === "projets" && <ProjectsPanel {...panelProps} />}
          {tab === "parcours" && <JourneyPanel {...panelProps} />}
          {tab === "extras" && <ExtrasPanel {...panelProps} />}
        </main>
      </div>
    </div>
  );
}
