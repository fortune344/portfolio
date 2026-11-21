"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { OPEN_MENU_EVENT } from "@/lib/events";
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SiteNavProps = {
  email: string;
  linkedin: string;
  github: string;
  cvUrl?: string | null;
};

/**
 * Navigation du site.
 * - Barre compacte en pilule, qui apparaît une fois le hero dépassé (toujours
 *   visible sur les études de cas), avec la section active surlignée.
 * - Menu plein écran sur mobile : grands liens Anton en cascade, Échap pour
 *   fermer, défilement de la page bloqué, focus renvoyé au bouton d'origine.
 */
export function SiteNav({ email, linkedin, github, cvUrl }: SiteNavProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(!isHome);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  // Apparition de la barre après le hero.
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Section active : celle qui occupe le milieu de l'écran.
  useEffect(() => {
    if (!isHome) return;
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  const openMenu = useCallback(() => {
    lastTrigger.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    lastTrigger.current?.focus();
  }, []);

  useEffect(() => {
    window.addEventListener(OPEN_MENU_EVENT, openMenu);
    return () => window.removeEventListener(OPEN_MENU_EVENT, openMenu);
  }, [openMenu]);

  // Menu ouvert : Échap, blocage du scroll, focus sur le premier lien.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstLink.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, closeMenu]);

  const showBar = scrolled || !isHome;

  return (
    <>
      <AnimatePresence>
        {showBar ? (
          <m.header
            key="bar"
            initial={reduceMotion ? false : { y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: -80, opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE.expo }}
            className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4"
          >
            <nav
              aria-label="Navigation principale"
              className="flex w-full max-w-3xl items-center justify-between gap-2 rounded-full border border-line bg-background/75 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md md:w-auto"
            >
              <Link
                href="/"
                aria-label="Accueil — Fortune Assouan"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground font-display text-sm uppercase text-ink transition-transform duration-200 hover:scale-105"
                onClick={(e) => {
                  if (isHome) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
                  }
                }}
              >
                FA
              </Link>

              <ul className="hidden items-center md:flex">
                {NAV_ITEMS.filter((n) => n.id !== "contact").map((item) => {
                  const isActive = active === item.id;
                  return (
                    <li key={item.id} className="relative">
                      <a
                        href={href(item.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "relative z-10 block rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200",
                          isActive ? "text-ink" : "text-muted hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </a>
                      {isActive ? (
                        <m.span
                          layoutId="nav-active"
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-foreground"
                          transition={{ duration: DURATION.base, ease: EASE.expo }}
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-1.5">
                <a
                  href={href("contact")}
                  onClick={() => trackEvent({ event: "cta_click", cta: "nav_discutons" })}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-foreground/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-foreground hover:text-ink"
                >
                  Discutons
                  <ArrowUpRight size={14} aria-hidden className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <button
                  type="button"
                  onClick={openMenu}
                  aria-label="Ouvrir le menu"
                  aria-haspopup="dialog"
                  aria-expanded={open}
                  aria-controls={open ? "menu-mobile" : undefined}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white/5 md:hidden"
                >
                  <Menu size={19} aria-hidden />
                </button>
              </div>
            </nav>
          </m.header>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <m.div
            key="menu"
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduceMotion ? { opacity: 0 } : { clipPath: "circle(0% at 100% 0%)" }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: "circle(150% at 100% 0%)" }}
            exit={reduceMotion ? { opacity: 0 } : { clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: EASE.inOut }}
            className="fixed inset-0 z-[60] flex flex-col bg-foreground text-ink"
          >
            <div className="flex items-center justify-between p-5">
              <span className="font-display text-xl uppercase">Fortune Assouan</span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Fermer le menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-foreground"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <m.ul
              className="flex flex-1 flex-col justify-center gap-1 px-5"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: STAGGER.base, delayChildren: 0.2 } } }}
            >
              {NAV_ITEMS.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <m.a
                    ref={i === 0 ? firstLink : undefined}
                    href={href(item.id)}
                    onClick={() => setOpen(false)}
                    variants={{
                      hidden: reduceMotion ? { opacity: 0 } : { y: "100%" },
                      visible: { y: 0, opacity: 1, transition: { duration: DURATION.slow, ease: EASE.expo } },
                    }}
                    className="flex items-baseline gap-4 py-1 font-display text-[clamp(2.8rem,13vw,5rem)] uppercase leading-[1] tracking-tight"
                  >
                    <span className="font-sans text-xs font-semibold tracking-[0.2em] text-ink/50">0{i + 1}</span>
                    {item.label}
                  </m.a>
                </li>
              ))}
            </m.ul>

            <div className="grid gap-2 border-t border-ink/15 p-5 text-sm font-medium">
              <a href={`mailto:${email}`} className="underline underline-offset-4">{email}</a>
              <div className="flex gap-6">
                <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a>
                {cvUrl ? (
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer">CV (PDF)</a>
                ) : null}
              </div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
