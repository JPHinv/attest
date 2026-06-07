# Vacature Job Board

Een simpel vacature-job-board in vanilla HTML/JS — geen build-stap, geen
framework, geen database. De vacatures komen uit `data/jobs.json` en worden
ontsloten via de datalaag in `src/jobsRepository.js`.

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

Omdat de UI alleen met deze functies praat, kan de bron later vervangen
worden (bijvoorbeeld door een externe IH Hub) zonder de UI aan te passen.
