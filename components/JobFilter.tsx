"use client";

import { useMemo, useState } from "react";
import type { Job } from "@/lib/jobSource";
import { JobCard } from "./JobCard";
import styles from "./JobFilter.module.css";

/**
 * Client-side filter + raster voor het vacature-overzicht.
 *
 * De PAGINA blijft een server-component (SSG): alle vacatures worden statisch
 * meegegeven. Alleen het filteren gebeurt hier client-side, zodat er geen
 * extra requests of dynamische rendering nodig zijn.
 *
 * Config-gedreven: `axis` is het Job-veld waarop gefilterd wordt en wordt door
 * de pagina afgeleid uit siteConfig.primaryAxis ("branche" -> "branche",
 * "stad" -> "location"). De filterwaarden zelf worden afgeleid uit de
 * vacatures — niets is hardgecodeerd.
 */

/** Job-velden die als filter-as kunnen dienen (beide zijn string-waarden). */
type FilterAxis = "branche" | "location";

interface JobFilterProps {
  jobs: Job[];
  axis: FilterAxis;
  /** Leesbaar label voor de as, bv. "Branche" of "Stad". */
  axisLabel: string;
}

/** Sentinel voor "geen filter" — botst niet met echte vacaturewaarden. */
const ALL = "__all__";

export function JobFilter({ jobs, axis, axisLabel }: JobFilterProps) {
  const [active, setActive] = useState<string>(ALL);

  // Unieke filterwaarden + aantallen, afgeleid uit de vacatures zelf.
  const facets = useMemo(() => {
    const counts = new Map<string, number>();
    for (const job of jobs) {
      const value = job[axis];
      if (value) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [jobs, axis]);

  const filtered = useMemo(
    () => (active === ALL ? jobs : jobs.filter((job) => job[axis] === active)),
    [jobs, axis, active],
  );

  return (
    <section>
      <div
        className={styles.filterBar}
        role="group"
        aria-label={`Filter op ${axisLabel.toLowerCase()}`}
      >
        <button
          type="button"
          className={`${styles.chip} ${active === ALL ? styles.chipActive : ""}`}
          aria-pressed={active === ALL}
          onClick={() => setActive(ALL)}
        >
          Alle <span className={styles.chipCount}>{jobs.length}</span>
        </button>

        {facets.map(({ value, count }) => (
          <button
            key={value}
            type="button"
            className={`${styles.chip} ${active === value ? styles.chipActive : ""}`}
            aria-pressed={active === value}
            onClick={() => setActive(value)}
          >
            {value} <span className={styles.chipCount}>{count}</span>
          </button>
        ))}
      </div>

      <p className={styles.count} aria-live="polite">
        {filtered.length}{" "}
        {filtered.length === 1 ? "vacature" : "vacatures"}
        {active !== ALL ? ` in ${axisLabel.toLowerCase()} ${active}` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className={styles.empty}>Geen vacatures gevonden voor deze keuze.</p>
      ) : (
        <ul className={styles.grid}>
          {filtered.map((job) => (
            <li key={job.id}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
