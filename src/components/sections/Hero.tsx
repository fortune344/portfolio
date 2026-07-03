"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useRef } from "react";
import type { Profile } from "@/data/portfolio";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const nameLine: Variants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: 0,
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE },
  }),
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

export function Hero({ profile }: { profile: Profile }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Parallaxe légère : le nom remonte moins vite que le scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const avatarY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="accueil"
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* Coins supérieurs */}
      <motion.div
        variants={fadeUp}
        custom={0.9}
        initial="hidden"
        animate="visible"
        className="z-20 flex items-center justify-between p-5 sm:p-8"
      >
        <a
          href="#contact"
          className="rounded-xl border border-foreground/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-foreground hover:text-ink sm:px-5 sm:text-xs"
        >
          Me contacter
        </a>
        <nav className="flex items-center gap-5 text-sm font-medium sm:gap-8">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-70"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-70"
          >
            LinkedIn
          </a>
        </nav>
      </motion.div>

      {/* Nom géant + avatar */}
      <div className="relative z-0 flex flex-1 flex-col items-center justify-center px-4">
        <motion.div
          style={reduceMotion ? undefined : { y: nameY, opacity: fade }}
          className="relative flex flex-col items-center"
        >
          {/* Point décoratif flottant */}
          <motion.span
            aria-hidden
            variants={fadeUp}
            custom={1.1}
            initial="hidden"
            animate="visible"
            className="absolute -top-8 left-[12%] z-20 sm:-top-10"
          >
            <span className="block h-6 w-6 animate-float-slow rounded-full bg-foreground sm:h-9 sm:w-9" />
          </motion.span>

          <h1 className="text-center font-display uppercase leading-[0.86] tracking-tight">
            <span className="block overflow-hidden">
              <motion.span
                variants={nameLine}
                custom={0}
                initial="hidden"
                animate="visible"
                className="block text-[clamp(3.8rem,15vw,11.5rem)]"
              >
                {profile.firstName}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                variants={nameLine}
                custom={1}
                initial="hidden"
                animate="visible"
                className="block text-[clamp(3.8rem,15vw,11.5rem)]"
              >
                {profile.lastName}
              </motion.span>
            </span>
          </h1>

          {/* Avatar chevauchant le nom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            style={reduceMotion ? undefined : { y: avatarY }}
            className="z-10 -mt-[2.2rem] sm:-mt-[3.6rem] md:-mt-[4.5rem]"
          >
            <div className="group relative">
              <div className="color-reveal h-36 w-36 overflow-hidden rounded-[1.75rem] border border-foreground/15 bg-[#26272e] shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:h-48 sm:w-48 md:h-56 md:w-56 md:rounded-[2.25rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avatar.svg"
                  alt={`Avatar de ${profile.name}`}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Info-bulle au survol, comme sur la référence */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 scale-90 whitespace-nowrap rounded-lg bg-[#f2ecdf] px-4 py-2 text-xs font-semibold text-ink opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                {profile.availability} — Écrivez-moi !
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Coins inférieurs */}
      <motion.div
        variants={fadeUp}
        custom={1.2}
        initial="hidden"
        animate="visible"
        className="z-10 grid gap-3 p-5 text-sm leading-relaxed sm:grid-cols-2 sm:gap-10 sm:p-8"
      >
        <p className="max-w-sm">
          {profile.statusLine}{" "}
          <a href={profile.statusLink.href} className="link-underline">
            {profile.statusLink.label}
          </a>
          .
        </p>
        <p className="max-w-sm text-muted sm:justify-self-end sm:text-right sm:text-foreground">
          {profile.focusLine}
        </p>
      </motion.div>
    </section>
  );
}
