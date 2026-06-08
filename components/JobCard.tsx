import Link from "next/link";
import type { Job } from "@/lib/jobSource";
import { jobDetailPath } from "@/lib/seo";
import { siteConfig } from "@/site.config";
import styles from "./JobCard.module.css";

/**
 * Presentatie van één vacature als klikbare kaart in het overzicht.
 *
 * Bewust geen "use client": de component is puur presentationeel en werkt
 * zowel server- als client-side. In het overzicht wordt hij gerenderd binnen
 * de client-side JobFilter, maar hij houdt zelf geen state vast.
 *
 * De volledige kaart linkt naar de detailpagina via jobDetailPath() uit het
 * fundament, zodat de URL-structuur gegarandeerd gelijk is aan die van de
 * detail-route (/vacatures/<id>).
 */

/**
 * Formatteert een kale datum (YYYY-MM-DD) naar de voertaal uit de config.
 * Forceert UTC zodat server- en client-render identiek zijn — anders zou een
 * tijdzone-verschil een hydration-mismatch kunnen veroorzaken.
 */
function formatPostedAt(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat(siteConfig.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function JobCard({ job }: { job: Job }) {
  return (
    <article className={styles.card}>
      <Link href={jobDetailPath(job.id)} className={styles.link}>
        <h2 className={styles.title}>{job.title}</h2>
        <p className={styles.company}>{job.company}</p>

        <ul className={styles.meta} aria-label="Kenmerken">
          <li className={styles.badge}>{job.branche}</li>
          <li className={styles.badge}>{job.location}</li>
          <li className={styles.badge}>{job.type}</li>
        </ul>

        <p className={styles.excerpt}>{job.description}</p>

        <p className={styles.footer}>
          <time dateTime={job.postedAt}>{formatPostedAt(job.postedAt)}</time>
          <span className={styles.cta} aria-hidden="true">
            Bekijk vacature →
          </span>
        </p>
      </Link>
    </article>
  );
}
