# vacature-site (golf-1 fundament)

Een statisch-renderende, SEO-sterke **vacature-site** in Next.js (App Router,
TypeScript, SSG). Dit is een **TEST/voorbeeld** in deze repo (`attest`): een
eerste, later-integreerbare vorm van het sites-factory `site_type`
**`vacature-site`** — los van sites-factory zelf.

> Golf 1 levert alleen het **fundament** + het **bevroren contract**. De
> overzicht- en detailpagina komen in **golf 2** (andere workers). De
> homepage is nu een minimale placeholder.
>
> Alle vacatures zijn **synthetische testdata** (elke werkgever draagt het
> label `(testdata)`). Geen scraping, geen externe bronnen.

## Draaien

```sh
npm install
npm run dev      # ontwikkelserver op http://localhost:3000
```

Productiebuild:

```sh
npm run build    # next build (SSG waar mogelijk) — moet slagen
npm run start    # serveer de productiebuild
```

Typecheck:

```sh
npm run typecheck
```

## Twee presets (branche vs. stad)

De site is tenant-neutraal: branche, stad, kleur, logo en domein zijn **config**,
niet hardgecodeerd. Twee presets bewijzen dat het verschil puur config is. Kies
de actieve preset via de env-var `SITE_PRESET` (default `branche`):

```sh
SITE_PRESET=branche npm run dev   # branche-gerichte preset (default)
SITE_PRESET=stad    npm run dev   # stad-gerichte preset
```

## Structuur

```
site.config.ts            # ENE plek voor actieve config (preset-selectie via SITE_PRESET)
config/
  types.ts                # SiteConfig (incl. site_type + primaryAxis)
  presets/branche.ts      # branche-gerichte preset (demo/testdata)
  presets/stad.ts         # stad-gerichte preset (demo/testdata)
lib/
  jobSource/
    types.ts              # BEVROREN CONTRACT: Job + JobSource
    localSource.ts        # synthetische testvacatures (actieve bron in golf 1)
    ihHubAdapter.ts       # STUB — GAP: IH-Hub-adapter (later)
    index.ts              # adapter-laag: getJobSource() — ENE bron-selectie
  seo.ts                  # canonicalUrl, buildPageMetadata, jobDetailPath
app/
  layout.tsx              # site-brede metadata-defaults + viewport + thema
  page.tsx                # MINIMALE placeholder-homepage (golf 2 vervangt dit)
  sitemap.ts              # sitemap uit jobSource + config
  robots.ts               # robots.txt uit config
  globals.css             # globale basis-CSS
```

## Bevroren contract

Golf-2-workers bouwen hierop; **niet wijzigen** zonder expliciete
contract-revisie. Zie [`INTEGRATION-NOTES.md`](./INTEGRATION-NOTES.md) voor de
integratiepunten richting sites-factory (site_type-cascade, config-laag,
IH-Hub-adapter, tenant-resolver), elk met een `GAP`-marker.

```ts
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  branche: string;
  type: string;
  description: string;
  postedAt: string;
  applyUrl: string;
}

export interface JobSource {
  getAllJobs(): Job[];
  getJobById(id: string): Job | undefined;
}
```
