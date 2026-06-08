import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

/**
 * Site-brede SEO-helpers (golf 1).
 *
 * Golf-2-workers importeren deze helpers om PER-PAGINA metadata en canonical
 * URL's te genereren. Merk/host komen uit site.config — NIETS hardcoden.
 */

/**
 * Bouwt een absolute canonical-URL uit een pad, op basis van de canonieke
 * host uit de config. Een leeg pad of "/" levert de host zelf.
 */
export function canonicalUrl(path = "/"): string {
  const host = siteConfig.domain.replace(/\/+$/, "");
  if (!path || path === "/") {
    return `${host}/`;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${host}${normalized}`;
}

/** Basis voor metadata-resolutie; gebruikt door app/layout.tsx. */
export function metadataBase(): URL {
  return new URL(siteConfig.domain);
}

/**
 * Canonieke pad-conventie voor een vacature-detailpagina.
 *
 * Eén plek zodat golf-1 (sitemap) en golf-2 (de detailroute app/vacatures/[id])
 * gegarandeerd dezelfde URL-structuur gebruiken. Wijzig je dit, dan verandert
 * de detail-route mee — daarom hier centraal vastgelegd.
 */
export function jobDetailPath(id: string): string {
  return `/vacatures/${encodeURIComponent(id)}`;
}

export interface PageMetaInput {
  /** Pagina-titel zonder merk-suffix (die voegt het title-template toe). */
  title?: string;
  /** Pagina-specifieke beschrijving; valt terug op de site-default. */
  description?: string;
  /** Pad voor de canonical-URL (bv. "/vacatures/123"). */
  path?: string;
}

/**
 * Stelt per-pagina Next.js Metadata samen met correcte canonical + OpenGraph,
 * consistent afgeleid uit de config. Golf-2-pagina's roepen dit aan vanuit
 * hun `generateMetadata`/`metadata`.
 */
export function buildPageMetadata({
  title,
  description,
  path = "/",
}: PageMetaInput): Metadata {
  const url = canonicalUrl(path);
  const resolvedDescription = description ?? siteConfig.description;

  return {
    title,
    description: resolvedDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.brandName,
      title: title ?? siteConfig.brandName,
      description: resolvedDescription,
      url,
      locale: siteConfig.locale,
    },
  };
}
