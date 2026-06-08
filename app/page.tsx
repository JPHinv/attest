import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { getJobSource } from "@/lib/jobSource";
import { buildPageMetadata } from "@/lib/seo";

/**
 * MINIMALE placeholder-homepage (golf 1).
 *
 * Bestaat alleen zodat het project bouwt en lokaal draait. Golf-2-workers
 * VERVANGEN deze pagina door het echte vacature-overzicht. Bouw hier dus geen
 * definitieve UI; houd het bewust simpel.
 *
 * Er wordt GEEN app/vacatures/[id]-route gemaakt — dat is golf 2.
 */

export const metadata: Metadata = buildPageMetadata({
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  // Bewijst dat de adapter-laag werkt en de testdata laadt — puur indicatief.
  const jobCount = getJobSource().getAllJobs().length;

  return (
    <main className="container">
      <p
        style={{
          display: "inline-block",
          background: "var(--color-accent)",
          color: "var(--color-text)",
          padding: "0.25rem 0.6rem",
          borderRadius: "var(--radius)",
          fontSize: "0.8rem",
          fontWeight: 600,
        }}
      >
        Golf-1 fundament · placeholder
      </p>

      <h1>{siteConfig.brandName}</h1>
      <p style={{ color: "var(--color-muted)", maxWidth: "40rem" }}>
        {siteConfig.description}
      </p>

      <p>
        Dit is de tijdelijke homepage van het golf-1 fundament. De
        overzicht- en detailpagina&apos;s worden in golf 2 gebouwd. De actieve
        configuratie is de <strong>{siteConfig.presetKey}</strong>-preset
        (primaire as: <strong>{siteConfig.primaryAxis}</strong>), met{" "}
        <strong>{jobCount}</strong> synthetische voorbeeldvacatures uit de
        lokale testbron.
      </p>

      <p style={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
        site_type: <code>{siteConfig.site_type}</code> · Alle vacatures zijn
        verzonnen testdata.
      </p>
    </main>
  );
}
