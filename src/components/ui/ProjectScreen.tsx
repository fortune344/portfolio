import type { ProjectScreenKind } from "@/data/portfolio";

/**
 * Aperçus de projet entièrement dessinés en CSS, affichés dans un mockup
 * laptop : aucun screenshot à charger, rendu net à toutes les tailles.
 */

function WindowChrome() {
  return (
    <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-white/25" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/10" />
    </div>
  );
}

function ChartScreen() {
  const bars = [
    "h-[42%] bg-foreground/25",
    "h-[68%] bg-foreground/25",
    "h-[50%] bg-foreground/25",
    "h-[82%] bg-foreground/25",
    "h-[58%] bg-foreground/25",
    "h-[95%] bg-foreground",
    "h-[72%] bg-foreground/25",
    "h-[62%] bg-foreground/25",
  ];
  return (
    <div className="flex h-full flex-col">
      <WindowChrome />
      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-md bg-white/[0.07] p-1.5">
              <div className="h-1.5 w-2/3 rounded-full bg-white/20" />
              <div className="mt-1.5 h-2 w-1/2 rounded-full bg-foreground/80" />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1.5 rounded-md bg-white/[0.04] p-2">
          {bars.map((bar, i) => (
            <div key={i} className={`flex-1 rounded-sm ${bar}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function KanbanScreen() {
  const columns = [
    ["h-10 bg-white/[0.08]", "h-7 bg-white/[0.08]"],
    ["h-8 border border-foreground/50 bg-foreground/15", "h-10 bg-white/[0.08]", "h-6 bg-white/[0.08]"],
    ["h-7 bg-white/[0.08]", "h-9 bg-white/[0.08]"],
  ];
  return (
    <div className="flex h-full flex-col">
      <WindowChrome />
      <div className="grid flex-1 grid-cols-3 gap-2 p-3">
        {columns.map((cards, i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-md bg-white/[0.04] p-1.5">
            <div className="h-1.5 w-2/3 rounded-full bg-white/25" />
            {cards.map((card, j) => (
              <div key={j} className={`rounded ${card}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TableScreen() {
  return (
    <div className="flex h-full flex-col">
      <WindowChrome />
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-2.5 rounded-sm bg-foreground/40" />
          ))}
        </div>
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((cell) => (
              <div
                key={cell}
                className={`h-2 rounded-sm ${
                  cell === 3 && row % 2 === 0 ? "bg-foreground/50" : "bg-white/[0.08]"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TerminalScreen() {
  return (
    <div className="flex h-full flex-col bg-[#0b0c11]">
      <WindowChrome />
      <div className="flex-1 space-y-1 p-3 font-mono text-[9px] leading-relaxed sm:text-[10px]">
        <p className="text-foreground/90">$ python main.py</p>
        <p className="text-white/40">Chargement du dataset… 12 480 lignes</p>
        <p className="text-white/40">Nettoyage des valeurs manquantes… OK</p>
        <p className="text-white/40">Entraînement du modèle…</p>
        <p className="text-foreground/90">
          Précision : 94 %<span className="ml-1 inline-block h-2.5 w-1.5 animate-pulse bg-foreground/80 align-middle" />
        </p>
      </div>
    </div>
  );
}

const screens: Record<ProjectScreenKind, () => React.ReactElement> = {
  chart: ChartScreen,
  kanban: KanbanScreen,
  table: TableScreen,
  terminal: TerminalScreen,
};

type ProjectScreenProps = {
  kind: ProjectScreenKind;
  /** Image réelle du projet — remplace l'aperçu CSS si fournie. */
  image?: string | null;
  alt?: string;
};

/** Mockup laptop : image du projet à l'écran, ou aperçu CSS en secours. */
export function ProjectScreen({ kind, image, alt = "" }: ProjectScreenProps) {
  const Screen = screens[kind];
  return (
    <div className="w-full max-w-[26rem]">
      {/* Écran */}
      <div className="rounded-[0.9rem] border border-white/10 bg-[#0e0f14] p-2 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="aspect-[16/10] overflow-hidden rounded-[0.55rem] bg-[#151721]">
          {image ? (
            <div className="color-reveal h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={alt}
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
            </div>
          ) : (
            <Screen />
          )}
        </div>
      </div>
      {/* Base du laptop */}
      <div className="relative left-1/2 h-3.5 w-[112%] -translate-x-1/2 rounded-b-xl bg-gradient-to-b from-[#41454f] to-[#20222a]">
        <div className="absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 rounded-b-md bg-[#181a20]" />
      </div>
    </div>
  );
}
