import { CASE_STUDIES, getCaseStudy } from "@/content/case-studies";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Étude de cas — Fortune Assouan";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return renderOgImage({
    eyebrow: `Étude de cas · ${study?.sector ?? ""}`,
    title: study?.name ?? "Étude de cas",
    footer: study?.tools.slice(0, 4).join(" · ") ?? "",
  });
}
