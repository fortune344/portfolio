import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">Erreur 404</p>
      <h1 className="mt-4 font-display text-[clamp(3.5rem,14vw,9rem)] uppercase leading-[0.9] tracking-tight">
        Page introuvable
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl border border-foreground/40 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-foreground hover:text-ink"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
