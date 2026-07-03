import type { Profile } from "@/data/portfolio";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-[11px] font-semibold uppercase tracking-[0.18em] sm:flex-row sm:px-8">
        <p>Copyright {new Date().getFullYear()}</p>
        <p className="text-center text-muted">
          Un projet data ou web ? Écrivez-moi{" "}
          <a href={`mailto:${profile.email}`} className="link-underline text-foreground">
            {profile.name}
          </a>
        </p>
      </div>
    </footer>
  );
}
