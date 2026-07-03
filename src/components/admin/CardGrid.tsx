"use client";

import { Plus, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
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
  onClick: () => void;
  className?: string;
};

/** Petite carte : titre, sous-titre, éventuelle vignette, ouvre une modale. */
export function Card({ title, subtitle, icon: Icon, thumb, badge, onClick, className }: CardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white/[0.02] text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-white/[0.04]",
        className
      )}
    >
      {thumb ? (
        <div className="aspect-[16/9] w-full overflow-hidden border-b border-line bg-black/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      <div className="flex flex-1 items-start gap-3 p-4">
        {Icon && !thumb ? (
          <span className="mt-0.5 shrink-0 rounded-lg bg-white/5 p-2 text-muted transition-colors group-hover:text-foreground">
            <Icon size={18} />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle ? <p className="mt-1 line-clamp-2 text-xs text-muted">{subtitle}</p> : null}
        </div>
        {badge ? (
          <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
            {badge}
          </span>
        ) : null}
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
      className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line text-muted transition-colors duration-200 hover:border-foreground/50 hover:text-foreground"
    >
      <Plus size={20} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
