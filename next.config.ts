import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  turbopack: {
    // Évite que Next remonte au lockfile parasite du dossier utilisateur.
    root: __dirname,
  },
};

export default nextConfig;
