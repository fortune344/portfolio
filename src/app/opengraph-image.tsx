import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Fortune Assouan — Développeur web & Data Analyst";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Développeur web · Data Analyst",
    title: "Fortune Assouan",
    footer: "Applications web, tableaux de bord, analyse de données",
  });
}
