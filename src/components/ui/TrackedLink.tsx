"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Événement poussé dans le dataLayer au clic. */
  track: AnalyticsEvent;
};

/** Lien `<a>` qui pousse un événement GTM au clic — utilisable depuis un composant serveur. */
export function TrackedLink({ track, onClick, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(track);
        onClick?.(e);
      }}
    />
  );
}
