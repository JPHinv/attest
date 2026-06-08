# Integratie-notities — vacature-site (golf 1)

Deze repo (`attest`) is een **TEST/voorbeeld**: een eerste, later-integreerbare
vorm van het sites-factory `site_type` **`vacature-site`**. Golf 1 levert
alleen het **fundament** + het **bevroren contract**. De overzicht- en
detailpagina komen in golf 2 door andere workers.

Dit document benoemt de punten die later in **sites-factory** moeten landen.
Hier wordt **geen** sites-factory-architectuur besloten — elk punt is een
`GAP`-marker met een verwijzing naar het bestaande patroon dat als referentie
dient. De koppelingen zelf zijn **stubs**.

---

## GAP: site_type-cascade

**Wat:** `site.config.ts` zet `site_type: "vacature-site"` als expliciet veld.
In sites-factory wordt config niet los gekozen maar via de **site_type-cascade**
opgebouwd (defaults per site_type → tenant-overrides).

**Nu (golf 1):** één `SiteConfig` met twee presets, geselecteerd via de env-var
`SITE_PRESET`. Tenant-neutraal; niets hardgecodeerd.

**Later:** vervang de preset-selectie in `site.config.ts` door de resolved
config uit de site_type-cascade. `site.config.ts` is bewust de ENIGE plek waar
de actieve config instroomt, zodat dit een puntwijziging is.

**Referentie/stub:** `site.config.ts` (`resolveSiteConfig()`),
`config/presets/*.ts`, `config/types.ts` (`SiteConfig`).

---

## GAP: definitieve config-laag (tenant-resolver)

**Wat:** Welke tenant/site is dit, en welke config hoort daarbij? In golf 1
gebeurt dat met een env-var; in sites-factory hoort hier een **tenant-resolver**
(bv. op basis van host/domein → tenant → config).

**Nu (golf 1):** `SITE_PRESET` kiest tussen de branche- en stad-preset. De
canonieke host komt uit `SiteConfig.domain`.

**Later:** een tenant-resolver bepaalt de actieve `SiteConfig` per request/build
(host-based of build-target-based). De rest van de app verandert niet, want
alles leest via `siteConfig`.

**Referentie/stub:** `site.config.ts`, `config/types.ts`. Geen tenant-resolver
gebouwd (GAP).

---

## GAP: IH-Hub-adapter

**Wat:** De echte vacaturebron. In golf 1 **niet gebouwd** — geen scraping,
geen externe calls.

**Nu (golf 1):** `lib/jobSource/localSource.ts` levert ~12 **synthetische**
testvacatures (elke company-naam draagt `(testdata)`). `lib/jobSource/index.ts`
(`getJobSource()`) is de ENIGE plek waar de actieve bron wordt gekozen.

**Later:** implementeer `lib/jobSource/ihHubAdapter.ts` op het bevroren
`JobSource`-contract:

- auth/credentials per tenant (uit de config-laag);
- mapping van IH-Hub-velden → bevroren `Job`-model;
- caching/revalidatie passend bij SSG (build-time fetch of ISR);
- **luide** foutafhandeling — een falende bron mag de build niet stil met lege
  data laten slagen.

Activeer daarna de bron in `getJobSource()` (één regel). De stub-methods gooien
nu bewust, zodat per ongeluk activeren direct zichtbaar faalt.

**Referentie/stub:** `lib/jobSource/ihHubAdapter.ts` (stub met `GAP`-marker),
`lib/jobSource/index.ts` (adapter-laag), `lib/jobSource/types.ts` (contract).

---

## GAP: JobPosting validThrough

**Wat:** Google raadt voor een `JobPosting` een `validThrough` (vervaldatum van
de vacature) aan. Het bevroren `Job`-contract (`lib/jobSource/types.ts`) kent
**geen** vervaldatum-veld.

**Nu (golf 2):** we emitten `validThrough` **niet**. Een vervaldatum
**fabriceren** (bv. plaatsingsdatum + X dagen) is expliciet verboden door de
golf-2-brief ("Verzin GEEN salaris, vervaldatum of bedrijfsgegevens die er niet
zijn"). `validThrough` is bij Google **"recommended"**, niet **"required"**,
dus de JobPosting blijft zonder dit veld **valide** voor Google for Jobs.
`types.ts` blijft ongewijzigd (bevroren contract).

**Later:** zodra de echte bron een vervaldatum levert, hoort `validThrough` als
**contract-uitbreiding** op het `Job`-model te komen — afkomstig uit de
IH-Hub-bron, niet afgeleid/verzonnen. De waarde stroomt dan via de adapter-laag
binnen en wordt hier 1-op-1 doorgegeven.

**Referentie/stub:** `components/JobPostingJsonLd.tsx` (geen `validThrough`),
`lib/jobSource/types.ts` (`Job` — bevroren, geen vervaldatum). Zie ook
**GAP: IH-Hub-adapter** voor waar de echte velden vandaan moeten komen.

---

## GAP: JobPosting jobLocation land

**Wat:** Een `JobPosting` heeft binnen `jobLocation.address` een
`addressCountry` nodig (verplicht voor een valide adres bij Google for Jobs).
Voorheen stond hier een **hardgecodeerde** `"NL"` — in strijd met de
golf-2-anti-hardcode-discipline ("Niets hardgecodeerd ... geen stad in code");
land valt onder diezelfde regel.

**Nu (golf 2):** `addressCountry` wordt **afgeleid** uit `siteConfig.locale`
via `toAddressCountry()` in `components/JobPostingJsonLd.tsx`, niet meer
gehardcode. Draagt de locale een regio-subtag (BCP-47, bv. `"nl-BE"`,
`"en-GB"`), dan wordt die als landcode gebruikt; ontbreekt de regio (bv.
`"nl"`), dan mapt een kleine, expliciete **taal->land best-effort proxy** de
taal naar een land (`nl` → `NL`). Onbekende locales **falen luid** (throw,
build-time) i.p.v. stil een verkeerd land te claimen.

**Subtiliteit / waarom dit een GAP blijft:**

- Een locale beschrijft een **TAAL**, niet per se een **LAND**. `siteConfig.locale`
  als landbron is daarom een **proxy**, geen waarheid.
- Een **vacature kan in een ander land liggen dan de site** (een NL-talige site
  met een vacature in België). Eén land-per-site is dus principieel te grof.

**Later:** het definitieve land hoort uit de **config-laag** te komen
(per-tenant, expliciet land i.p.v. afgeleid uit taal) en/of **per vacature** uit
de echte bron, als **contract-uitbreiding** op het bevroren `Job`-model
(`lib/jobSource/types.ts`) — afkomstig uit de IH-Hub-bron, niet afgeleid. De
waarde stroomt dan via de adapter-laag binnen en wordt hier 1-op-1 doorgegeven.
Het bevroren `SiteConfig`- én `Job`-contract blijven nu **ongewijzigd**.

**Referentie/stub:** `components/JobPostingJsonLd.tsx` (`toAddressCountry()`),
`config/types.ts` (`SiteConfig.locale` — bevroren, geen apart land-veld),
`lib/jobSource/types.ts` (`Job` — bevroren, geen land-veld). Zie ook
**GAP: IH-Hub-adapter** voor waar de echte per-vacature velden vandaan moeten
komen, en **GAP: definitieve config-laag (tenant-resolver)** voor een expliciet
per-tenant land.

---

## GAP: definitieve build-/deploy-strategie

**Wat:** Per-tenant host, CDN, en revalidatie/ISR. In golf 1 bewust open
gelaten.

**Nu (golf 1):** standaard `next build` (SSG waar mogelijk); geen
`output: "export"` geforceerd, zodat golf 2 desgewenst metadata-routes/ISR kan
gebruiken.

**Later:** sites-factory bepaalt host, CDN en revalidatiestrategie per tenant.

**Referentie/stub:** `next.config.ts`.

---

## Bevroren contract — niet wijzigen zonder revisie

Golf-2-workers bouwen hierop. Wijzig deze niet zonder expliciete
contract-revisie:

- `lib/jobSource/types.ts` — `Job` + `JobSource`.
- `lib/jobSource/index.ts` — `getJobSource()` (de ene bron-selectie).
- `site.config.ts` / `config/types.ts` — `SiteConfig` incl. `site_type` en
  `primaryAxis`.
- `lib/seo.ts` — `canonicalUrl`, `buildPageMetadata`, `jobDetailPath`
  (URL-conventie voor de detailroute die golf 2 bouwt).
