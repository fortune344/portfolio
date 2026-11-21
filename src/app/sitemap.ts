import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "@/content/case-studies";
import { SITE_URL } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...CASE_STUDIES.map((c) => ({
      url: `${SITE_URL}/realisations/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
