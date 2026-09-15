/**
 * Événements de tracking côté application : un simple `dataLayer.push`
 * typé, sans appel à gtag. C'est le conteneur GTM qui décide quoi en faire.
 *
 * `window.dataLayer` est déclaré globalement par @next/third-parties ; il
 * n'existe qu'en production (GTM n'est chargé que là) — sinon on ne fait rien.
 */

export type AnalyticsEvent =
  | { event: "contact_submit"; method: "email" | "phone" }
  | { event: "project_click"; project_name: string }
  | { event: "github_click"; link_url: string };

function getDataLayer(): unknown[] | null {
  if (typeof window === "undefined") return null;
  const layer: unknown = window.dataLayer;
  return Array.isArray(layer) ? layer : null;
}

/** Pousse un événement dans le dataLayer GTM s'il est présent. */
export function trackEvent(payload: AnalyticsEvent): void {
  getDataLayer()?.push(payload);
}
