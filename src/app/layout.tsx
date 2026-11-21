import type { Metadata, Viewport } from "next";
import { Anton, Poppins } from "next/font/google";
import Script from "next/script";
import { SERVICES, SITE_URL } from "@/content/site";
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

// Google Tag Manager — production uniquement, chargé en différé (lazyOnload)
// pour ne pas peser sur l'affichage initial ni compter les visites locales.
const gtmId = "GTM-WHJH3BZX";
const isProduction = process.env.NODE_ENV === "production";

const TITLE = "Fortune Assouan — Consultant Power BI & Data Analyst freelance";
const DESCRIPTION =
  "Consultant Power BI et data analyst freelance basé à Lomé (Togo) : tableaux de bord Power BI, analyse et fiabilisation des données, automatisation Excel et applications web métier. Missions au Togo, au Bénin, en Afrique francophone et à distance.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s — Fortune Assouan" },
  description: DESCRIPTION,
  keywords: [
    "Consultant Power BI",
    "Data Analyst freelance",
    "Tableau de bord Power BI",
    "Business Intelligence",
    "Analyse de données",
    "Développement d'applications web",
    "Lomé",
    "Togo",
    "Bénin",
  ],
  authors: [{ name: "Fortune Assouan", url: SITE_URL }],
  creator: "Fortune Assouan",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Fortune Assouan",
    title: TITLE,
    description:
      "Tableaux de bord Power BI, analyse de données et applications web pour les entreprises. Basé à Lomé, missions au Togo, au Bénin et à distance.",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Tableaux de bord Power BI, analyse de données et applications web pour les entreprises. Basé à Lomé, missions à distance.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0e",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Fortune Assouan",
      alternateName: "Djawou Fortuné Assouan",
      jobTitle: "Consultant Power BI · Data Analyst",
      url: SITE_URL,
      email: "mailto:fortune.assouan@lomebs.com",
      address: { "@type": "PostalAddress", addressLocality: "Lomé", addressCountry: "TG" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Lomé Business School" },
      sameAs: [
        "https://github.com/fortune344",
        "https://www.linkedin.com/in/fortun%C3%A9-assouan-a29561a7",
      ],
      knowsAbout: ["Power BI", "DAX", "Power Query", "SQL", "Python", "Pandas", "Excel", "Qualité des données", "Business Intelligence", "Django"],
      knowsLanguage: ["fr", "en"],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: "Fortune Assouan — Power BI, analyse de données et applications web",
      url: SITE_URL,
      email: "fortune.assouan@lomebs.com",
      founder: { "@id": `${SITE_URL}/#person` },
      address: { "@type": "PostalAddress", addressLocality: "Lomé", addressCountry: "TG" },
      areaServed: [
        { "@type": "Country", name: "Togo" },
        { "@type": "Country", name: "Bénin" },
        { "@type": "Place", name: "Afrique francophone" },
      ],
      availableLanguage: ["fr", "en"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.solution },
        })),
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${anton.variable}`}>
      <body>
        {isProduction && (
          <>
            <Script id="gtm" strategy="lazyOnload">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
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
