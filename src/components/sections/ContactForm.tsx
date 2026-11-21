"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  BUDGET_OPTIONS,
  LIMITS,
  SERVICE_OPTIONS,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactInput,
} from "@/lib/contact";
import { SELECT_SERVICE_EVENT } from "@/lib/events";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: ContactInput = { name: "", email: "", company: "", service: "powerbi", budget: "", message: "" };
const FIELD_ORDER: ContactField[] = ["name", "email", "company", "service", "budget", "message"];

const LABEL = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted";
const INPUT =
  "w-full rounded-xl border border-line bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors duration-200 hover:border-foreground/30 focus:border-foreground focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-red-400/70";

const isService = (v: unknown): v is ContactInput["service"] =>
  SERVICE_OPTIONS.some((o) => o.value === v);

/** Formulaire de contact réel : POST /api/contact, aucune simulation d'envoi. */
export function ContactForm({ email }: { email: string }) {
  const uid = useId();
  const reduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // champ piège anti-robot

  // Présélection du service : bouton « Parler de ce besoin » ou lien `?service=`.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("service");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture de l'URL après montage
    if (isService(fromUrl)) setValues((v) => ({ ...v, service: fromUrl }));
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (isService(id)) setValues((v) => ({ ...v, service: id }));
    };
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  const fieldId = (f: ContactField) => `${uid}-${f}`;
  const errorId = (f: ContactField) => `${uid}-${f}-error`;

  function update<K extends ContactField>(field: K, value: ContactInput[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) {
      const r = validateContact(next);
      setErrors(r.ok ? {} : r.errors);
    }
  }

  function blur(field: ContactField) {
    setTouched((t) => ({ ...t, [field]: true }));
    const r = validateContact(values);
    setErrors(r.ok ? {} : r.errors);
  }

  const shownError = (f: ContactField) => (touched[f] ? errors[f] : undefined);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    const r = validateContact(values);
    if (!r.ok) {
      setErrors(r.errors);
      setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
      const first = FIELD_ORDER.find((f) => r.errors[f]);
      if (first) formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(first))}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...r.data, website }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; fields?: ContactErrors };
      if (!res.ok) {
        if (json.fields) {
          setErrors(json.fields);
          setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
        }
        throw new Error(json.error || "Votre message n'a pas pu être envoyé.");
      }
      trackEvent({ event: "contact_submit", method: "form", service: r.data.service });
      setStatus("sent");
    } catch (err) {
      setServerError(
        err instanceof TypeError
          ? "Connexion impossible. Vérifiez votre réseau, puis réessayez."
          : err instanceof Error
            ? err.message
            : "Votre message n'a pas pu être envoyé."
      );
      setStatus("error");
    }
  }

  function reset() {
    setValues(EMPTY);
    setTouched({});
    setErrors({});
    setServerError(null);
    setStatus("idle");
  }

  const describedBy = (f: ContactField) => (shownError(f) ? errorId(f) : undefined);
  const errorText = (f: ContactField) =>
    shownError(f) ? (
      <p id={errorId(f)} className="mt-1.5 text-xs text-red-300">
        {shownError(f)}
      </p>
    ) : null;

  return (
    <div className="relative rounded-[2rem] border border-line bg-card/80 p-6 backdrop-blur-sm sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <m.div
            key="sent"
            role="status"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE.expo }}
            className="flex min-h-[28rem] flex-col items-start justify-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-ink">
              <Check size={26} aria-hidden />
            </span>
            <h3 className="mt-6 font-display text-4xl uppercase tracking-tight">Message envoyé</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Merci {values.name.split(" ")[0]}, votre message est bien arrivé. Je vous réponds personnellement à
              l&apos;adresse {values.email}.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 rounded-xl border border-foreground/40 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-foreground hover:text-ink"
            >
              Envoyer un autre message
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            aria-label="Formulaire de contact"
            initial={false}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.fast }}
            className="grid gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={fieldId("name")} className={LABEL}>
                  Nom <span aria-hidden>*</span>
                </label>
                <input
                  id={fieldId("name")}
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={LIMITS.name.max}
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => blur("name")}
                  aria-invalid={Boolean(shownError("name"))}
                  aria-describedby={describedBy("name")}
                  className={INPUT}
                />
                {errorText("name")}
              </div>
              <div>
                <label htmlFor={fieldId("email")} className={LABEL}>
                  E-mail <span aria-hidden>*</span>
                </label>
                <input
                  id={fieldId("email")}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  maxLength={LIMITS.email.max}
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={() => blur("email")}
                  aria-invalid={Boolean(shownError("email"))}
                  aria-describedby={describedBy("email")}
                  className={INPUT}
                />
                {errorText("email")}
              </div>
            </div>

            <div>
              <label htmlFor={fieldId("company")} className={LABEL}>
                Entreprise <span className="normal-case tracking-normal text-muted">(facultatif)</span>
              </label>
              <input
                id={fieldId("company")}
                name="company"
                autoComplete="organization"
                maxLength={LIMITS.company.max}
                value={values.company}
                onChange={(e) => update("company", e.target.value)}
                onBlur={() => blur("company")}
                aria-invalid={Boolean(shownError("company"))}
                aria-describedby={describedBy("company")}
                className={INPUT}
              />
              {errorText("company")}
            </div>

            <fieldset>
              <legend className={LABEL}>
                Votre besoin <span aria-hidden>*</span>
              </legend>
              <div className="flex flex-wrap gap-2" id={fieldId("service")}>
                {SERVICE_OPTIONS.map((o) => {
                  const checked = values.service === o.value;
                  return (
                    <label
                      key={o.value}
                      className={cn(
                        "cursor-pointer rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground",
                        checked ? "border-foreground bg-foreground text-ink" : "border-line text-muted hover:border-foreground/50 hover:text-foreground"
                      )}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={o.value}
                        checked={checked}
                        onChange={() => update("service", o.value)}
                        className="sr-only"
                      />
                      {o.label}
                    </label>
                  );
                })}
              </div>
              {errorText("service")}
            </fieldset>

            <div>
              <label htmlFor={fieldId("budget")} className={LABEL}>
                Budget indicatif <span className="normal-case tracking-normal text-muted">(facultatif)</span>
              </label>
              <select
                id={fieldId("budget")}
                name="budget"
                value={values.budget}
                onChange={(e) => update("budget", e.target.value as ContactInput["budget"])}
                className={cn(INPUT, "appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10")}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23a09b90' stroke-width='1.5'/%3E%3C/svg%3E\")",
                }}
              >
                {BUDGET_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-card">
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={fieldId("message")} className={LABEL}>
                Description du besoin <span aria-hidden>*</span>
              </label>
              <textarea
                id={fieldId("message")}
                name="message"
                required
                rows={5}
                maxLength={LIMITS.message.max}
                placeholder="Votre activité, vos données actuelles, ce que vous aimeriez suivre ou améliorer…"
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                onBlur={() => blur("message")}
                aria-invalid={Boolean(shownError("message"))}
                aria-describedby={[describedBy("message"), `${uid}-count`].filter(Boolean).join(" ")}
                className={cn(INPUT, "resize-y leading-relaxed")}
              />
              <div className="mt-1.5 flex items-start justify-between gap-4">
                {errorText("message")}
                <p id={`${uid}-count`} className="ml-auto shrink-0 text-[11px] tabular-nums text-muted">
                  {values.message.trim().length} / {LIMITS.message.max}
                </p>
              </div>
            </div>

            {/* Champ piège : invisible pour les humains, rempli par les robots */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={`${uid}-website`}>Ne pas remplir</label>
              <input
                id={`${uid}-website`}
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {status === "error" && serverError ? (
              <div role="alert" className="flex gap-3 rounded-xl border border-red-400/30 bg-red-400/[0.06] p-4 text-sm">
                <AlertCircle size={18} aria-hidden className="mt-0.5 shrink-0 text-red-300" />
                <p className="leading-relaxed">
                  {serverError}{" "}
                  <a href={`mailto:${email}`} className="link-underline font-semibold">
                    {email}
                  </a>
                </p>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <p className="max-w-xs text-[11px] leading-relaxed text-muted">
                Vos informations servent uniquement à vous répondre.
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-transform duration-200 enabled:hover:-translate-y-0.5 disabled:opacity-70"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={15} aria-hidden className="animate-spin" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    Envoyer le message
                    <ArrowUpRight size={15} aria-hidden className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
            <p aria-live="polite" className="sr-only">
              {status === "sending" ? "Envoi du message en cours." : ""}
            </p>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
