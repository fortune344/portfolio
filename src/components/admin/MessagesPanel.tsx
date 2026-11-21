"use client";

import { Mail, MailOpen, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BTN_SMALL } from "@/components/admin/primitives";
import { BUDGET_OPTIONS, SERVICE_OPTIONS, labelOf } from "@/lib/contact";
import type { ContactMessage } from "@/lib/contact-store";
import { cn } from "@/lib/utils";

type Channels = { supabase: boolean; email: boolean };

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

/** Boîte de réception : messages du formulaire de contact (table Supabase `contact_messages`). */
export function MessagesPanel({ onError }: { onError: (text: string) => void }) {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [channels, setChannels] = useState<Channels | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      const json = (await res.json()) as { messages?: ContactMessage[]; channels?: Channels; error?: string };
      if (!res.ok) throw new Error(json.error || "Chargement impossible.");
      setMessages(json.messages ?? []);
      setChannels(json.channels ?? null);
      setError(json.error ?? null);
    } catch (err) {
      setMessages([]);
      setError(err instanceof Error ? err.message : "Chargement impossible.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chargement initial depuis l'API
    load();
  }, [load]);

  async function call(method: "PATCH" | "DELETE", body: Record<string, unknown>) {
    const res = await fetch("/api/messages", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(json.error || "Action impossible.");
    }
  }

  async function toggleRead(m: ContactMessage, read = !m.read) {
    setMessages((list) => list?.map((x) => (x.id === m.id ? { ...x, read } : x)) ?? null);
    try {
      await call("PATCH", { id: m.id, read });
    } catch (err) {
      onError(err instanceof Error ? err.message : "Action impossible.");
      load();
    }
  }

  async function remove(m: ContactMessage) {
    if (!window.confirm(`Supprimer définitivement le message de ${m.name} ?`)) return;
    try {
      await call("DELETE", { id: m.id });
      setMessages((list) => list?.filter((x) => x.id !== m.id) ?? null);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Suppression impossible.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.02] p-4 text-xs text-muted">
        <p>
          Enregistrement Supabase :{" "}
          <strong className={channels?.supabase ? "text-emerald-300" : "text-amber-300"}>
            {channels ? (channels.supabase ? "actif" : "non configuré") : "…"}
          </strong>
          {" · "}Notification e-mail (Resend) :{" "}
          <strong className={channels?.email ? "text-emerald-300" : "text-amber-300"}>
            {channels ? (channels.email ? "active" : "non configurée") : "…"}
          </strong>
        </p>
        <button type="button" onClick={load} className={cn(BTN_SMALL, "inline-flex items-center gap-1.5")}>
          <RefreshCw size={13} aria-hidden /> Actualiser
        </button>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100">
          {error}
        </p>
      ) : null}

      {messages === null ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
          Aucun message pour le moment.
        </p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => {
            const open = openId === m.id;
            return (
              <li key={m.id} className={cn("rounded-xl border bg-white/[0.02]", m.read ? "border-line" : "border-foreground/40")}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => {
                    setOpenId(open ? null : m.id);
                    if (!m.read) toggleRead(m, true);
                  }}
                  className="flex w-full items-start gap-3 p-4 text-left"
                >
                  {m.read ? <MailOpen size={17} className="mt-0.5 shrink-0 text-muted" aria-hidden /> : <Mail size={17} className="mt-0.5 shrink-0" aria-hidden />}
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-sm", m.read ? "text-muted" : "font-semibold")}>
                      {m.name}
                      {m.company ? ` · ${m.company}` : ""}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {labelOf(SERVICE_OPTIONS, m.service)} — {m.message}
                    </span>
                  </span>
                  <time dateTime={m.created_at} className="shrink-0 text-[11px] text-muted">
                    {dateFmt.format(new Date(m.created_at))}
                  </time>
                </button>
                {open ? (
                  <div className="space-y-4 border-t border-line p-4 text-sm">
                    <dl className="grid gap-2 sm:grid-cols-2">
                      <div><dt className="text-xs text-muted">E-mail</dt><dd><a className="link-underline" href={`mailto:${m.email}`}>{m.email}</a></dd></div>
                      <div><dt className="text-xs text-muted">Budget</dt><dd>{m.budget ? labelOf(BUDGET_OPTIONS, m.budget) : "Non précisé"}</dd></div>
                    </dl>
                    <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    <div className="flex flex-wrap gap-2">
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re : votre demande")}`} className={BTN_SMALL}>Répondre</a>
                      <button type="button" onClick={() => toggleRead(m)} className={BTN_SMALL}>
                        Marquer comme {m.read ? "non lu" : "lu"}
                      </button>
                      <button type="button" onClick={() => remove(m)} className={cn(BTN_SMALL, "inline-flex items-center gap-1.5 text-red-300")}>
                        <Trash2 size={13} aria-hidden /> Supprimer
                      </button>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
