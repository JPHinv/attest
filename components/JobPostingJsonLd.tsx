import type { Job } from "@/lib/jobSource";

/**
 * JobPosting JSON-LD (schema.org) voor Google for Jobs.
 *
 * Rendert een <script type="application/ld+json"> met een VOLLEDIGE en VALIDE
 * JobPosting op basis van het bevroren Job-contract. Dit is cruciaal voor de
 * vindbaarheid in Google for Jobs, dus de verplichte velden (title,
 * description, datePosted, hiringOrganization, jobLocation) zijn altijd gevuld.
 *
 * Bewust geen gedeeld util-bestand: alle helpers staan hier inline.
 */

interface JobPostingJsonLdProps {
  job: Job;
  /** Absolute canonical-URL van de detailpagina (uit lib/seo). */
  url: string;
}

/**
 * Mapt het vrije `type`-veld uit het Job-contract naar een door schema.org /
 * Google erkende employmentType-waarde. Onbekende waarden vallen veilig terug
 * op "OTHER" zodat de JSON-LD altijd geldig blijft.
 */
function toEmploymentType(type: string): string {
  const normalized = type.toLowerCase().replace(/[\s_-]/g, "");
  const map: Record<string, string> = {
    fulltime: "FULL_TIME",
    voltijd: "FULL_TIME",
    parttime: "PART_TIME",
    deeltijd: "PART_TIME",
    tijdelijk: "TEMPORARY",
    temporary: "TEMPORARY",
    stage: "INTERN",
    intern: "INTERN",
    internship: "INTERN",
    contractor: "CONTRACTOR",
    zzp: "CONTRACTOR",
    freelance: "CONTRACTOR",
    vrijwilliger: "VOLUNTEER",
    volunteer: "VOLUNTEER",
  };
  return map[normalized] ?? "OTHER";
}

/**
 * Berekent een redelijke `validThrough` (ISO-8601) op basis van de
 * plaatsingsdatum + 60 dagen. Google waardeert een einddatum; we leiden er een
 * af i.p.v. hem leeg te laten. Bij een onparseerbare datum wordt het veld
 * weggelaten (undefined) zodat de JSON valide blijft.
 */
function deriveValidThrough(postedAt: string): string | undefined {
  const posted = new Date(postedAt);
  if (Number.isNaN(posted.getTime())) {
    return undefined;
  }
  const validUntil = new Date(posted);
  validUntil.setDate(validUntil.getDate() + 60);
  return validUntil.toISOString();
}

/**
 * Voorkomt dat een letterlijke `</script>` of HTML-injectie in de data de
 * JSON-LD uit zijn script-context breekt. We escapen `<`, `>` en `&` naar hun
 * unicode-escapes; de JSON blijft daarmee geldig én veilig inline-baar.
 */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JobPostingJsonLd({ job, url }: JobPostingJsonLdProps) {
  const validThrough = deriveValidThrough(job.postedAt);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt,
    employmentType: toEmploymentType(job.type),
    industry: job.branche,
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: job.id,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "NL",
      },
    },
    // De sollicitatie verloopt via de pagina zelf (ApplyButton-stub), dus
    // directApply is hier zinvol en correct.
    directApply: true,
    url,
  };

  if (validThrough) {
    jsonLd.validThrough = validThrough;
  }

  return (
    <script
      type="application/ld+json"
      // Server-gerenderd, statisch tijdens build; veilig ge-escaped via safeJsonLd.
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
