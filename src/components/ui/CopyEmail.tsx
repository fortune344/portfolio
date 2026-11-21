"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Copie l'adresse e-mail dans le presse-papiers (utile quand aucun client mail n'est configuré). */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* presse-papiers indisponible : le lien mailto reste utilisable */
        }
      }}
      aria-label={copied ? "Adresse copiée" : "Copier l'adresse e-mail"}
      title={copied ? "Copiée !" : "Copier"}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-foreground/50 hover:text-foreground"
    >
      {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      <span aria-live="polite" className="sr-only">{copied ? "Adresse copiée" : ""}</span>
    </button>
  );
}
