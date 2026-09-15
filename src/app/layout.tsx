import type { Metadata, Viewport } from "next";
import { Anton, Poppins } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const siteUrl = "https://fortuneassouan.vercel.app";

// Google Tag Manager — chargé uniquement en production (pas en `next dev`)
// pour ne pas polluer les statistiques avec les visites locales.
const gtmId = "GTM-WHJH3BZX";
const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fortune Assouan — Consultant BI & Analytics · Développeur web",
    template: "%s — Fortune Assouan",
  },
  description:
    "Portfolio de Fortune Assouan, consultant BI & Analytics à Lomé (Togo) : Power BI, KPI et qualité des données. Cadrage des questions business, préparation des données (SQL, Python, Excel) et tableaux de bord orientés décision. Disponible en freelance et à distance.",
  keywords: [
    "Fortune Assouan",
    "Consultant BI",
    "Business Intelligence",
    "Data Analyst",
    "Power BI",
    "DAX",
    "Power Query",
    "KPI",
    "Qualité des données",
    "SQL",
    "Python",
    "Freelance",
    "Portfolio",
    "Lomé",
    "Togo",
  ],
  authors: [{ name: "Fortune Assouan", url: siteUrl }],
  creator: "Fortune Assouan",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Fortune Assouan — Portfolio",
    title: "Fortune Assouan — Consultant BI & Analytics · Développeur web",
    description:
      "Power BI, KPI et qualité des données : de la question business à la recommandation chiffrée. Consultant BI & Analytics à Lomé, disponible en freelance et à distance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Assouan — Consultant BI & Analytics · Développeur web",
    description:
      "Power BI, KPI et qualité des données : de la question business à la recommandation chiffrée.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0e",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Fortune Assouan",
  jobTitle: "Consultant BI & Analytics · Développeur web",
  url: siteUrl,
  email: "mailto:fortune.assouan@lomebs.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lomé",
    addressCountry: "TG",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Lomé Business School",
  },
  sameAs: [
    "https://github.com/fortune344",
    "https://www.linkedin.com/in/fortuné-assouan-a29561a74",
  ],
  knowsAbout: [
    "Power BI",
    "DAX",
    "Power Query",
    "SQL",
    "Python",
    "Pandas",
    "Excel",
    "Qualité des données",
    "Business Intelligence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${anton.variable}`}>
      {isProduction && <GoogleTagManager gtmId={gtmId} />}
      <body>
        {isProduction && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
