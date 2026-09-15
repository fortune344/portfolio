"use client";

import {
  AlertCircle,
  Briefcase,
  Eye,
  EyeOff,
  ExternalLink,
  FolderGit2,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  RefreshCw,
  Route as RouteIcon,
  Save,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AboutPanel,
  ExtrasPanel,
  JourneyPanel,
  ProfilePanel,
  ProjectsPanel,
  SkillsPanel,
} from "@/components/admin/panels";
import { BTN_PRIMARY, BTN_SMALL, FOCUS, INPUT, LABEL } from "@/components/admin/primitives";
import { Toast, type ToastState } from "@/components/admin/Toast";
import type { PortfolioData } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Tableau de bord d'administration du portfolio.
 * Navigation latérale par onglets (un panneau visible à la fois) — connexion
 * par mot de passe, données Supabase (ou JSON local en dev), upload d'images.
 * Suit les modifications non enregistrées (bouton, badge, garde-fou à la
 * fermeture de l'onglet) et accepte Ctrl+S / ⌘S pour enregistrer.
 */

type TabId = "profil" | "apropos" | "competences" | "projets" | "parcours" | "extras";

const TABS: { id: TabId; label: string; description: string; icon: LucideIcon }[] = [
  { id: "profil", label: "Profil", description: "Identité, coordonnées, textes du Hero et CV.", icon: User },
  { id: "apropos", label: "À propos", description: "Les paragraphes de la biographie.", icon: LayoutDashboard },
  { id: "competences", label: "Compétences", description: "Groupes de compétences affichés à droite de la bio.", icon: Briefcase },
  { id: "projets", label: "Projets", description: "Cartes vedettes (4 max conseillé) et liste compacte, dans l'ordre d'affichage.", icon: FolderGit2 },
  { id: "parcours", label: "Parcours", description: "Expériences, formations et projets marquants, du plus récent au plus ancien.", icon: RouteIcon },
  { id: "extras", label: "Langues & intérêts", description: "Langues parlées et centres d'intérêt.", icon: Languages },
];

type View = "loading" | "login" | "disabled" | "ready";

const NAV_ITEM = `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${FOCUS}`;

export default function AdminPage() {
  const [view, setView] = useState<View>("loading");
  const [data, setData] = useState<PortfolioData | null>(null);
  /** Instantané du dernier état enregistré, pour détecter les modifications. */
  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  const [passwordConfigured, setPasswordConfigured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [tab, setTab] = useState<TabId>("profil");
  const [navOpen, setNavOpen] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const dirty = useMemo(
    () => data !== null && JSON.stringify(data) !== savedSnapshot,
    [data, savedSnapshot]
  );
  const closeToast = useCallback(() => setToast(null), []);

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
      setSavedSnapshot(JSON.stringify(json.data));
      setPasswordConfigured(json.meta.passwordConfigured);
      setReloadKey((k) => k + 1);
      setView("ready");
    } catch {
      setToast({ kind: "error", text: "Impossible de charger les données." });
      setView("login");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Garde-fou : prévenir avant de quitter la page avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

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
      setShowPassword(false);
      setView("loading");
      await load();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    if (dirty && !window.confirm("Des modifications ne sont pas enregistrées. Se déconnecter quand même ?")) return;
    await fetch("/api/auth/logout", { method: "POST" });
    setData(null);
    setSavedSnapshot("");
    setView("login");
  }

  async function reload() {
    if (dirty && !window.confirm("Recharger effacera les modifications non enregistrées. Continuer ?")) return;
    await load();
    setToast({ kind: "success", text: "Données rechargées depuis le site." });
  }

  const save = useCallback(async () => {
    if (!data || saving) return;
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 401) return setView("login");
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Erreur lors de l'enregistrement.");
      setSavedSnapshot(JSON.stringify(data));
      setToast({ kind: "success", text: "Enregistré — le site est à jour." });
    } catch (err) {
      setToast({ kind: "error", text: err instanceof Error ? err.message : "Erreur lors de l'enregistrement." });
    } finally {
      setSaving(false);
    }
  }, [data, saving]);

  // Raccourci clavier Ctrl+S / ⌘S.
  useEffect(() => {
    if (view !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty) save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, dirty, save]);

  /* ————— Écrans d'état ————— */

  if (view === "loading") {
    return (
      <main className="min-h-svh md:grid md:grid-cols-[248px_1fr]" aria-busy="true" aria-label="Chargement de l'administration">
        <div className="hidden border-r border-line bg-panel md:block" />
        <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">
          <div className="h-7 w-40 animate-pulse rounded-md bg-white/10" />
          <div className="mt-3 h-3 w-64 animate-pulse rounded bg-white/5" />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border border-line bg-white/[0.03]" />
            ))}
          </div>
          <p className="sr-only">Chargement…</p>
        </div>
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
      <main className="flex min-h-svh items-center justify-center px-5 py-10">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-line bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
        >
          <span className="inline-flex rounded-xl border border-line bg-white/5 p-2.5 text-muted">
            <LockKeyhole size={20} aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-3xl uppercase tracking-wide">Admin</h1>
          <p className="mt-2 text-sm text-muted">Entre ton mot de passe pour gérer le portfolio.</p>

          <div className="mt-6">
            <label htmlFor="admin-password" className={LABEL}>
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                aria-invalid={loginError ? true : undefined}
                aria-describedby={loginError ? "admin-login-error" : undefined}
                className={cn(INPUT, "pr-11")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                aria-pressed={showPassword}
                title={showPassword ? "Masquer" : "Afficher"}
                className={cn(
                  "absolute inset-y-0 right-0 my-1 mr-1 flex w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-white/5 hover:text-foreground",
                  FOCUS
                )}
              >
                {showPassword ? <EyeOff size={17} aria-hidden /> : <Eye size={17} aria-hidden />}
              </button>
            </div>
          </div>

          {loginError ? (
            <p id="admin-login-error" role="alert" className="mt-3 flex items-start gap-2 text-xs text-red-400">
              <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
              {loginError}
            </p>
          ) : null}

          <button type="submit" disabled={loggingIn || !password} className={`${BTN_PRIMARY} mt-6 w-full`}>
            {loggingIn ? "Connexion…" : "Se connecter"}
          </button>

          <details className="group mt-6 border-t border-line pt-4 text-xs text-muted">
            <summary className={cn("cursor-pointer select-none rounded-md font-medium text-foreground/80 hover:text-foreground", FOCUS)}>
              Mot de passe oublié ?
            </summary>
            <div className="mt-3 space-y-2 leading-relaxed">
              <p>
                Le mot de passe n&apos;est stocké nulle part dans le site : c&apos;est la variable
                d&apos;environnement <code className="text-foreground">ADMIN_PASSWORD</code> du projet sur Vercel.
              </p>
              <ol className="list-decimal space-y-1 pl-4">
                <li>
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-foreground"
                  >
                    Vercel
                  </a>{" "}
                  → projet → <span className="text-foreground">Settings</span> →{" "}
                  <span className="text-foreground">Environment Variables</span>
                </li>
                <li>
                  Sur <code className="text-foreground">ADMIN_PASSWORD</code> : l&apos;icône œil révèle la valeur,{" "}
                  <span className="text-foreground">Edit</span>{" "}
                  permet d&apos;en définir une nouvelle.
                </li>
                <li>
                  Après modification : <span className="text-foreground">Deployments → ⋯ → Redeploy</span>.
                </li>
              </ol>
            </div>
          </details>
        </form>
      </main>
    );
  }

  if (!data) return null;

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  const panelProps = { data, setData, reloadKey };
  const counts: Partial<Record<TabId, number>> = {
    competences: data.skillGroups.length,
    projets: data.projects.length,
    parcours: data.timeline.length,
    extras: data.languages.length,
  };

  return (
    <div className="min-h-svh md:grid md:grid-cols-[248px_1fr]">
      {/* ————— Barre latérale ————— */}
      <aside
        className={cn(
          "z-40 flex flex-col border-r border-line bg-panel md:sticky md:top-0 md:h-svh",
          "fixed inset-y-0 left-0 w-64 transition-transform duration-300 md:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Navigation de l'administration"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground font-display text-sm uppercase text-ink">
              {data.profile.initials || "A"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{data.profile.name}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Portfolio · Admin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            aria-label="Fermer le menu"
            className={cn("rounded-md p-1 text-muted hover:text-foreground md:hidden", FOCUS)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3" aria-label="Sections">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === tab;
            const count = counts[t.id];
            return (
              <button
                key={t.id}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  setTab(t.id);
                  setNavOpen(false);
                }}
                className={cn(
                  NAV_ITEM,
                  isActive
                    ? "bg-foreground font-semibold text-ink"
                    : "text-muted hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon size={17} aria-hidden />
                <span className="flex-1 text-left">{t.label}</span>
                {count !== undefined ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                      isActive ? "bg-ink/15 text-ink" : "bg-white/5 text-muted"
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-line p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(NAV_ITEM, "text-muted hover:bg-white/5 hover:text-foreground")}
          >
            <ExternalLink size={16} aria-hidden />
            Voir le site
          </a>
          {passwordConfigured ? (
            <button
              type="button"
              onClick={handleLogout}
              className={cn(NAV_ITEM, "text-muted hover:bg-white/5 hover:text-foreground")}
            >
              <LogOut size={16} aria-hidden />
              Se déconnecter
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
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Ouvrir le menu"
              className={cn("rounded-md p-1 md:hidden", FOCUS)}
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl uppercase tracking-wide sm:text-2xl">{active.label}</h1>
              <p className="hidden truncate text-xs text-muted sm:block">{active.description}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "hidden items-center gap-1.5 text-xs transition-opacity sm:flex",
                dirty ? "text-amber-300 opacity-100" : "text-muted opacity-0"
              )}
              aria-live="polite"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden />
              Modifications non enregistrées
            </span>
            <button type="button" onClick={reload} className={cn(BTN_SMALL, "inline-flex items-center gap-1.5 py-1.5")} title="Recharger depuis le site">
              <RefreshCw size={13} aria-hidden />
              <span className="hidden sm:inline">Recharger</span>
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || !dirty}
              title={dirty ? "Enregistrer (Ctrl+S)" : "Aucune modification à enregistrer"}
              className={BTN_PRIMARY}
            >
              <Save size={15} aria-hidden />
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </header>

        {dirty ? (
          <p className="border-b border-amber-400/20 bg-amber-400/5 px-5 py-2 text-xs text-amber-200 sm:hidden">
            Modifications non enregistrées
          </p>
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

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
