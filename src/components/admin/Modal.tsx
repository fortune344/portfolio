"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  /** Boutons du pied (ex. Supprimer / Valider). */
  footer?: ReactNode;
};

/**
 * Modale d'édition : overlay flouté, fermeture par Échap, clic extérieur ou
 * croix, verrouillage du scroll de fond, focus initial et animation d'entrée.
 */
export function Modal({ open, title, subtitle, onClose, children, footer }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus le premier champ de la modale.
    panelRef.current
      ?.querySelector<HTMLElement>("input, textarea, select, button")
      ?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="modal-enter flex max-h-[92svh] w-full max-w-2xl flex-col rounded-t-3xl border border-line bg-panel shadow-2xl sm:rounded-3xl"
      >
        {/* En-tête */}
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl uppercase tracking-wide">{title}</h2>
            {subtitle ? <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corps défilable */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">{children}</div>

        {/* Pied */}
        {footer ? (
          <div className="flex items-center justify-end gap-3 border-t border-line px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
