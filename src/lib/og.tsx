import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Anton (police display du site) pour les images de partage. Repli silencieux sur la police par défaut. */
async function loadAnton(): Promise<ArrayBuffer | null> {
  try {
    // Sans User-Agent moderne, Google Fonts renvoie un fichier TrueType (lisible par Satori).
    const css = await (await fetch("https://fonts.googleapis.com/css2?family=Anton&display=swap")).text();
    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

/** Image de partage dans l'identité du site : fond noir, typographie Anton crème. */
export async function renderOgImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  const anton = await loadAnton();
  const display = anton ? "Anton" : "sans-serif";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "radial-gradient(ellipse at 30% 20%, #2a2c33 0%, #0c0c0e 65%)",
          color: "#e8e3d7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#a09b90" }}>
          <div style={{ width: 18, height: 18, borderRadius: 999, background: "#e8e3d7" }} />
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontFamily: display, fontSize: title.length > 40 ? 92 : 120, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: -1, maxWidth: 1050 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a09b90" }}>
          <span>{footer}</span>
          <span style={{ color: "#e8e3d7" }}>fortuneassouan.vercel.app</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: anton ? [{ name: "Anton", data: anton, style: "normal", weight: 400 }] : undefined }
  );
}
