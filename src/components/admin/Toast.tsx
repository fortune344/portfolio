"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";
import { FOCUS } from "@/components/admin/primitives";
import { cn } from "@/lib/utils";

export type ToastState = { kind: "success" | "error"; text: string } | null;

type ToastProps = {
  toast: ToastState;
  onClose: () => void;
  /** Durée avant fermeture automatique (ms). Les erreurs restent affichées. */
  duration?: number;
};

/** Notification discrète en bas de l'écran, annoncée aux lecteurs d'écran. */
export function Toast({ toast, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (!toast || toast.kind === "error") return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [toast, duration, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex justify-center px-5"
    >
      {toast ? (
        <div
          className={cn(
            "modal-enter pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur",
            toast.kind === "success"
              ? "border-emerald-400/30 bg-[#12181a]/95 text-foreground"
              : "border-red-500/40 bg-[#1c1214]/95 text-foreground"
          )}
        >
          {toast.kind === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
          )}
          <p className="leading-relaxed">{toast.text}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la notification"
            className={cn("-mr-1 ml-1 shrink-0 rounded-md p-1 text-muted transition-colors hover:text-foreground", FOCUS)}
          >
            <X size={16} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
