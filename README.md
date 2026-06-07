# Vacature Job Board

Een vacature-job-board in vanilla HTML/JS — geen build-stap, geen framework,
geen database. De vacatures komen uit `data/jobs.json` en worden ontsloten via
de datalaag in `src/jobsRepository.js`.

De overzichtspagina (`index.html`) toont alle vacatures in een responsive
kaart-grid met een groene huisstijl, een client-side zoekveld (op functie,
bedrijf of plaats) en filter-chips op dienstverband. De detailpagina
(`job.html?id=<id>`) toont één vacature in dezelfde stijl.

Alle visuals zijn **zelf-gegenereerd**: de beeldvlakken zijn CSS-gradients en
de bedrijfslogo's zijn gekleurde cirkels met initialen, beide deterministisch
afgeleid uit de bedrijfsnaam (`src/branding.js`). Er worden bewust geen externe
afbeeldingen of netwerk-bronnen geladen, zodat het board volledig offline werkt
over een simpele http-server.

## Lokaal draaien

ES-modules (`import`/`export`) en `fetch()` werken **niet** via het
`file://`-protocol. Open de pagina's daarom niet rechtstreeks vanaf schijf,
maar serveer de map via een lokale webserver.

Vanuit de hoofdmap van het project:

```sh
python3 -m http.server 8080
```

Open vervolgens in je browser:

```
http://localhost:8080
```

Elke andere statische webserver werkt ook, zolang je de pagina's via
`http://` opent in plaats van `file://`.

## Datalaag

De databron zit volledig verborgen achter twee async functies in
`src/jobsRepository.js`:

```js
import { getAllJobs, getJobById } from "./src/jobsRepository.js";

const jobs = await getAllJobs();      // Promise<Job[]>
const job = await getJobById("1");    // Promise<Job|null>
```

Het `Job`-model (bevroren contract):

| Veld          | Type     | Omschrijving                                  |
| ------------- | -------- | --------------------------------------------- |
| `id`          | `string` | Stabiele, unieke identifier                   |
| `title`       | `string` | Functietitel                                  |
| `company`     | `string` | Naam van het bedrijf                          |
| `location`    | `string` | Standplaats                                   |
| `type`        | `string` | Dienstverband (`Fulltime` / `Parttime` / ...) |
| `description` | `string` | Omschrijving van de vacature                  |
| `category`    | `string` | Optioneel: sector/rubriek (bv. `Techniek`)    |

De kernvelden `id`, `title`, `company`, `location`, `type` en `description`
liggen vast. `category` is een optionele uitbreiding: ontbreekt die in de bron,
dan normaliseert de repository die naar een lege string. Visuele afgeleiden
(logo-initialen, gradient) zitten **niet** in het model maar worden in de UI
uit `company` afgeleid.

Omdat de UI alleen met deze functies praat, kan de bron later vervangen
worden (bijvoorbeeld door een externe IH Hub) zonder de UI aan te passen.
