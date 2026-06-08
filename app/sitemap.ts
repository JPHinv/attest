import type { MetadataRoute } from "next";
import { getJobSource } from "@/lib/jobSource";
import { canonicalUrl, jobDetailPath } from "@/lib/seo";

/**
 * Sitemap (Next metadata route), gevoed vanuit de jobSource + config.
 *
 * Bevat de homepage plus één entry per vacature, op de canonieke detail-pad-
 * conventie (jobDetailPath). De detailroute zelf bouwt golf 2; door de URL's
 * hier alvast te genereren ligt de conventie vast en is de sitemap meteen
 * compleet zodra golf 2 de route toevoegt.
 *
 * Canonieke host komt uit de config (via canonicalUrl) — geen hardcoding.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const jobs = getJobSource().getAllJobs();

  const home: MetadataRoute.Sitemap[number] = {
    url: canonicalUrl("/"),
    changeFrequency: "daily",
    priority: 1,
  };

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: canonicalUrl(jobDetailPath(job.id)),
    lastModified: job.postedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [home, ...jobEntries];
}
