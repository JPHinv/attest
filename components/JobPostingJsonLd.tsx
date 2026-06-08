import type { Job } from "@/lib/jobSource";
import { siteConfig } from "@/site.config";

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
 * Leidt de ISO-3166-1-alpha-2-landcode voor `jobLocation.address.addressCountry`
 * af uit de site-locale (`siteConfig.locale`) i.p.v. een hardgecodeerde "NL".
 * Anti-hardcode-discipline (golf-2-brief): "Niets hardgecodeerd ... geen stad
 * in code" — land valt onder diezelfde regel en moet uit de config-laag komen.
 *
 * SUBTILITEIT: een locale beschrijft een TAAL (bv. "nl"), NIET per se een LAND.
 * Een BCP-47-locale kán een regio-subtag dragen ("nl-BE", "en-GB"); is die
 * aanwezig, dan is dat de betrouwbaarste landindicatie en gebruiken we die
 * direct. Ontbreekt de regio, dan mappen we de taal als BEST-EFFORT proxy naar
 * een land. Dit is bewust GEEN waarheid over de feitelijke vacaturelocatie —
 * een vacature kan in een ander land liggen dan de site. Zie
 * INTEGRATION-NOTES.md (GAP: JobPosting jobLocation land).
 *
 * Onbekende locales vallen NIET stil terug op een verkeerd land: we gooien
 * (luid, build-time) zodat een verkeerde config zichtbaar faalt i.p.v.
 * stilletjes een onjuist "NL" te claimen — net als resolveSiteConfig().
 */
function toAddressCountry(locale: string): string {
  // BCP-47: scheid taal- van optionele regio-subtag ("nl", "nl-BE", "nl_BE").
  const [languageRaw, regionRaw] = locale.trim().split(/[-_]/);

  if (regionRaw) {
    // Expliciete regio-subtag = betrouwbaarste landindicatie; gebruik direct.
    return regionRaw.toUpperCase();
  }

  // Best-effort taal->land proxy. Bewust klein en expliciet; structureel
  // uitbreiden hoort bij een echte config-/contract-uitbreiding, niet hier.
  const languageToCountry: Record<string, string> = {
    nl: "NL",
  };
  const country = languageToCountry[languageRaw.toLowerCase()];
  if (!country) {
    throw new Error(
      `Kan geen landcode afleiden uit locale "${locale}". Voeg een regio-subtag ` +
        `toe (bv. "${languageRaw}-XX") of breid de taal->land-mapping uit in ` +
        `components/JobPostingJsonLd.tsx. Zie INTEGRATION-NOTES.md ` +
        `(GAP: JobPosting jobLocation land).`,
    );
  }
  return country;
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
  // BEWUST GEEN validThrough: het bevroren Job-contract kent geen vervaldatum,
  // en die mag niet gefabriceerd worden (zie golf-2-brief: "Verzin GEEN salaris,
  // vervaldatum of bedrijfsgegevens die er niet zijn"). validThrough is bij
  // Google "recommended", niet "required", dus de JobPosting blijft valide
  // zonder. Zie INTEGRATION-NOTES.md (GAP: JobPosting validThrough).
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
        // Afgeleid uit siteConfig.locale (best-effort proxy), NIET hardgecodeerd.
        // Zie toAddressCountry() en INTEGRATION-NOTES.md (GAP: JobPosting jobLocation land).
        addressCountry: toAddressCountry(siteConfig.locale),
      },
    },
    // BEWUST GEEN directApply: solliciteren loopt (later) via een doorzet naar
    // een externe IH-Hub-flow, niet binnen deze pagina. directApply: true zou
    // richting Google een directe-sollicitatie-ervaring claimen die we niet
    // bieden; het veld is optioneel, dus we laten het weg i.p.v. iets te
    // beweren wat (nog) niet klopt. Zie components/ApplyButton.tsx (stub).
    url,
  };

  return (
    <script
      type="application/ld+json"
      // Server-gerenderd, statisch tijdens build; veilig ge-escaped via safeJsonLd.
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
