import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobSource } from "@/lib/jobSource";
import { buildPageMetadata, canonicalUrl, jobDetailPath } from "@/lib/seo";
import { JobPostingJsonLd } from "@/components/JobPostingJsonLd";
import { ApplyButton } from "@/components/ApplyButton";
import styles from "./detail.module.css";

/**
 * Vacature-detailpagina (golf 2) — volledig STATISCH geprerenderd (SSG).
 *
 * - generateStaticParams() levert één route per vacature uit de adapter-laag,
 *   zodat `next build` alle detailpagina's vooraf rendert.
 * - Data komt UITSLUITEND via lib/jobSource (bevroren contract).
 * - Rendert JobPosting JSON-LD voor Google for Jobs.
 * - Onbekende id → notFound().
 */

interface DetailPageProps {
  // Next.js 15: route-params zijn async.
  params: Promise<{ id: string }>;
}

/** Alle vacature-id's → statische routes (SSG). */
export function generateStaticParams(): Array<{ id: string }> {
  return getJobSource()
    .getAllJobs()
    .map((job) => ({ id: job.id }));
}

/**
 * Korte, per-vacature meta-description. Inline gehouden (geen gedeeld util-
 * bestand) en afgekapt zodat hij netjes binnen de SEO-snippetlengte blijft.
 */
function buildJobDescription(
  title: string,
  company: string,
  location: string,
  description: string,
): string {
  const lead = `${title} bij ${company} in ${location}. `;
  const room = 155 - lead.length;
  const body =
    description.length > room
      ? `${description.slice(0, Math.max(0, room - 1)).trimEnd()}…`
      : description;
  return `${lead}${body}`;
}

/** Datum tonen in Nederlands formaat; valt terug op de ruwe waarde. */
function formatDate(postedAt: string): string {
  const date = new Date(postedAt);
  if (Number.isNaN(date.getTime())) {
    return postedAt;
  }
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJobSource().getJobById(id);

  if (!job) {
    return buildPageMetadata({
      title: "Vacature niet gevonden",
      description: "Deze vacature bestaat niet (meer).",
      path: jobDetailPath(id),
    });
  }

  return buildPageMetadata({
    title: `${job.title} — ${job.company}`,
    description: buildJobDescription(
      job.title,
      job.company,
      job.location,
      job.description,
    ),
    path: jobDetailPath(job.id),
  });
}

export default async function VacatureDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const job = getJobSource().getJobById(id);

  if (!job) {
    notFound();
  }

  const url = canonicalUrl(jobDetailPath(job.id));

  return (
    <main className={styles.page}>
      <JobPostingJsonLd job={job} url={url} />

      <nav className={styles.breadcrumb} aria-label="Kruimelpad">
        <Link href="/">Vacatures</Link> <span aria-hidden="true">/</span>{" "}
        <span>{job.title}</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{job.title}</h1>
        <p className={styles.company}>{job.company}</p>

        <ul className={styles.meta}>
          <li className={styles.metaItem}>
            <span className={styles.metaLabel}>Locatie</span>
            {job.location}
          </li>
          <li className={styles.metaItem}>
            <span className={styles.metaLabel}>Branche</span>
            {job.branche}
          </li>
          <li className={styles.metaItem}>
            <span className={styles.metaLabel}>Dienstverband</span>
            {job.type}
          </li>
          <li className={styles.metaItem}>
            <span className={styles.metaLabel}>Geplaatst</span>
            <time dateTime={job.postedAt}>{formatDate(job.postedAt)}</time>
          </li>
        </ul>
      </header>

      <section aria-labelledby="omschrijving-titel">
        <h2 id="omschrijving-titel" className={styles.sectionTitle}>
          Functieomschrijving
        </h2>
        <p className={styles.description}>{job.description}</p>
      </section>

      <ApplyButton
        jobId={job.id}
        jobTitle={job.title}
        applyUrl={job.applyUrl}
      />
    </main>
  );
}
