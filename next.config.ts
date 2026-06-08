import type { NextConfig } from "next";

/**
 * Golf-1 fundament: SSG waar mogelijk.
 *
 * We forceren bewust GEEN `output: "export"`, omdat golf-2 mogelijk
 * dynamische metadata-routes (sitemap/robots) en ISR wil benutten. Next.js
 * rendert deze app standaard statisch (alle pagina's zijn dataloos t.o.v.
 * request-tijd), dus `next build` levert statische HTML waar mogelijk.
 *
 * GAP: definitieve build-/deploy-strategie wordt in sites-factory bepaald
 * (per-tenant host, CDN, revalidatie). Zie INTEGRATION-NOTES.md.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
