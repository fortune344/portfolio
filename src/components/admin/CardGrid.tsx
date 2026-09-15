"use client";

import { Plus, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { FOCUS } from "@/components/admin/primitives";
import { cn } from "@/lib/utils";

/** Grille responsive de petites cartes cliquables. */
export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

type CardProps = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  /** Vignette (image du projet, avatar…). */
  thumb?: string | null;
  badge?: string;
  /** Badge d'alerte (ex. « À rédiger ») affiché en ambre. */
  warning?: string;
  /** Sans vignette : afficher une zone de substitution (grille homogène). */
  placeholder?: boolean;
  onClick: () => void;
  className?: string;
};

/** Petite carte : titre, sous-titre, éventuelle vignette, ouvre une modale. */
export function Card({ title, subtitle, icon: Icon, thumb, badge, warning, placeholder, onClick, className }: CardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white/[0.02] text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-white/[0.04]",
        FOCUS,
        className
      )}
    >
      {thumb ? (
        <div className="aspect-[16/9] w-full overflow-hidden border-b border-line bg-black/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        </div>
      ) : placeholder ? (
        <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-1.5 border-b border-line bg-[radial-gradient(circle_at_30%_20%,rgba(232,227,215,0.06),transparent_60%)] text-muted">
          {Icon ? <Icon size={22} aria-hidden /> : null}
          <span className="text-[10px] uppercase tracking-[0.18em]">Aperçu dessiné</span>
        </div>
      ) : null}
      <div className="flex flex-1 items-start gap-3 p-4">
        {Icon && !thumb && !placeholder ? (
          <span className="mt-0.5 shrink-0 rounded-lg bg-white/5 p-2 text-muted transition-colors group-hover:text-foreground">
            <Icon size={18} />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle ? <p className="mt-1 line-clamp-2 text-xs text-muted">{subtitle}</p> : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {badge ? (
            <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
              {badge}
            </span>
          ) : null}
          {warning ? (
            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-300">
              {warning}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

/** Carte « + » pour ajouter un élément. */
export function AddCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line text-muted transition-colors duration-200 hover:border-foreground/50 hover:text-foreground",
        FOCUS
      )}
    >
      <Plus size={20} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
