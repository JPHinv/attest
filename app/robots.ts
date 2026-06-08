import type { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/seo";

/**
 * robots.txt (Next metadata route), gevoed vanuit de config.
 *
 * Verwijst naar de sitemap op de canonieke host uit de config — geen
 * hardcoding van het domein.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: canonicalUrl("/sitemap.xml"),
    host: canonicalUrl("/"),
  };
}
