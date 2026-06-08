import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { getJobSource } from "@/lib/jobSource";
import { buildPageMetadata } from "@/lib/seo";
import { JobFilter } from "@/components/JobFilter";
import styles from "./page.module.css";

/**
 * Vacature-OVERZICHT (golf 2) — vervangt de golf-1 placeholder.
 *
 * Server-component die statisch (SSG) alle vacatures rendert. Data komt
 * uitsluitend via de adapter-laag (getJobSource); de bron wordt nooit direct
 * gelezen. Merk, kleur en logo komen uit site.config.
 *
 * De filter-as is CONFIG-GEDREVEN: siteConfig.primaryAxis bepaalt of er op
 * branche of op stad (location) gefilterd wordt. De filterwaarden worden in
 * JobFilter afgeleid uit de vacatures zelf — niets hardgecodeerd.
 */

export const metadata: Metadata = buildPageMetadata({
  title: "Alle vacatures",
  description: siteConfig.description,
  path: "/",
});

/**
 * Vertaalt de primaire as uit de config naar het Job-veld waarop gefilterd
 * wordt en een leesbaar label voor de UI.
 */
function resolveFilterAxis(): { axis: "branche" | "location"; label: string } {
  return siteConfig.primaryAxis === "stad"
    ? { axis: "location", label: "Stad" }
    : { axis: "branche", label: "Branche" };
}

export default function HomePage() {
  const jobs = getJobSource().getAllJobs();
  const { axis, label } = resolveFilterAxis();

  return (
    <main>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.brand}>
            <span className={styles.logoMark} aria-hidden="true">
              {siteConfig.logo.initials}
            </span>
            <span className={styles.wordmark}>{siteConfig.logo.wordmark}</span>
          </div>

          <h1 className={styles.title}>{siteConfig.brandName}</h1>
          <p className={styles.subtitle}>{siteConfig.description}</p>
          <p className={styles.disclaimer}>
            Alle getoonde vacatures zijn synthetische testdata.
          </p>
        </div>
      </header>

      <div className={styles.listSection}>
        <JobFilter jobs={jobs} axis={axis} axisLabel={label} />
      </div>
    </main>
  );
}
