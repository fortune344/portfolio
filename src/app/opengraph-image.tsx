import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Fortune Assouan — Consultant Power BI & Data Analyst freelance";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Consultant Power BI · Data Analyst",
    title: "Fortune Assouan",
    footer: "Tableaux de bord, analyse de données, applications web",
  });
}
