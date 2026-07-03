import type { Metadata, Viewport } from "next";
import { Anton, Poppins } from "next/font/google";
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

const siteUrl = "https://fortune-assouan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fortune Assouan — Data Analyst & Développeur IT",
    template: "%s — Fortune Assouan",
  },
  description:
    "Portfolio de Fortune Assouan, étudiant en Bachelor Systèmes d'Information à Lomé Business School. Analyse de données (Python, SQL, Power BI) et développement web (Django). À la recherche d'un stage en Data.",
  keywords: [
    "Fortune Assouan",
    "Data Analyst",
    "Développeur IT",
    "Python",
    "SQL",
    "Power BI",
    "Django",
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
    title: "Fortune Assouan — Data Analyst & Développeur IT",
    description:
      "Analyse de données (Python, SQL, Power BI) et développement web (Django). Étudiant en Bachelor SI à Lomé Business School, à la recherche d'un stage en Data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Assouan — Data Analyst & Développeur IT",
    description:
      "Analyse de données (Python, SQL, Power BI) et développement web (Django).",
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
  jobTitle: "Data Analyst / Développeur IT",
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
  knowsAbout: ["Python", "SQL", "Power BI", "Pandas", "Django", "Excel"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${anton.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
