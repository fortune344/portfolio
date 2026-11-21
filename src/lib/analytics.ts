/**
 * Événements de tracking côté application : un simple `dataLayer.push`
 * typé, sans appel à gtag. C'est le conteneur GTM qui décide quoi en faire.
 *
 * GTM est chargé en différé (après le chargement de la page) et uniquement en
 * production : le dataLayer est créé ici s'il n'existe pas encore, GTM traite
 * ensuite les événements déjà empilés.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export type AnalyticsEvent =
  | { event: "contact_submit"; method: "email" | "phone" | "form"; service?: string }
  | { event: "project_click"; project_name: string }
  | { event: "github_click"; link_url: string }
  | { event: "cta_click"; cta: string };

/** Pousse un événement dans le dataLayer GTM (production uniquement). */
export function trackEvent(payload: AnalyticsEvent): void {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "production") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}
