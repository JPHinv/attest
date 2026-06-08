import type { Job, JobSource } from "./types";

/* ============================================================================
 *  ⚠️  SYNTHETISCHE TESTDATA — GEEN ECHTE VACATURES  ⚠️
 * ----------------------------------------------------------------------------
 *  Alle vacatures hieronder zijn VERZONNEN voor het golf-1 fundament. Elke
 *  company-naam draagt het label "(testdata)" zodat het in de UI direct
 *  zichtbaar is dat dit géén echte werkgevers of vacatures zijn.
 *
 *  Bron is bewust lokaal en in-memory: GEEN scraping, GEEN externe bronnen.
 *  De echte bron (IH-Hub) komt later via lib/jobSource/ihHubAdapter.ts en
 *  wordt geactiveerd in lib/jobSource/index.ts. Zie INTEGRATION-NOTES.md.
 *
 *  Spreiding (bewust gevarieerd zodat zowel een branche- als een stad-as
 *  zinvol te demonstreren is):
 *    branches : Techniek, Zorg, Logistiek, Onderwijs, ICT, Horeca, Bouw, Retail
 *    steden   : Rotterdam, Den Haag, Utrecht, Eindhoven, Groningen, Tilburg,
 *               Amsterdam, Zwolle
 * ========================================================================== */

const TESTDATA_LABEL = "(testdata)";

const jobs: Job[] = [
  {
    id: "tech-onderhoudsmonteur-rotterdam",
    title: "Onderhoudsmonteur Productielijn",
    company: `Maasstad Machinebouw ${TESTDATA_LABEL}`,
    location: "Rotterdam",
    branche: "Techniek",
    type: "Fulltime",
    description:
      "Als onderhoudsmonteur houd je de productielijnen draaiend: je voert preventief onderhoud uit, verhelpt storingen en denkt mee over verbeteringen. Je werkt in een hecht technisch team en krijgt ruimte om je te specialiseren in mechatronica.",
    postedAt: "2026-05-21",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/tech-onderhoudsmonteur-rotterdam",
  },
  {
    id: "zorg-wijkverpleegkundige-denhaag",
    title: "Wijkverpleegkundige",
    company: `Duinzorg Thuis ${TESTDATA_LABEL}`,
    location: "Den Haag",
    branche: "Zorg",
    type: "Parttime",
    description:
      "Je biedt verpleegkundige zorg bij mensen thuis, stelt zorgplannen op en coördineert met huisartsen en mantelzorgers. Een zelfstandige functie (24-32 uur) met veel afwisseling en eigen regie over je route.",
    postedAt: "2026-05-28",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/zorg-wijkverpleegkundige-denhaag",
  },
  {
    id: "log-teamleider-magazijn-utrecht",
    title: "Teamleider Magazijn",
    company: `Domstad Distributie ${TESTDATA_LABEL}`,
    location: "Utrecht",
    branche: "Logistiek",
    type: "Fulltime",
    description:
      "Je geeft leiding aan een ploeg van vijftien magazijnmedewerkers, stuurt op orderpicking en voorraadbeheer en bewaakt de dagelijkse KPI's. Ervaring met WMS-systemen en het aansturen van een team is een pré.",
    postedAt: "2026-06-02",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/log-teamleider-magazijn-utrecht",
  },
  {
    id: "ond-docent-wiskunde-eindhoven",
    title: "Docent Wiskunde (eerste graad)",
    company: `Brainport College ${TESTDATA_LABEL}`,
    location: "Eindhoven",
    branche: "Onderwijs",
    type: "Parttime",
    description:
      "Je geeft wiskunde aan de bovenbouw havo/vwo, begeleidt examenklassen en draagt bij aan de vakgroep. Een inspirerende functie (0,6-0,8 fte) op een school die volop investeert in technisch talent.",
    postedAt: "2026-05-15",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/ond-docent-wiskunde-eindhoven",
  },
  {
    id: "ict-fullstack-developer-groningen",
    title: "Fullstack Developer",
    company: `Noorderlicht Software ${TESTDATA_LABEL}`,
    location: "Groningen",
    branche: "ICT",
    type: "Fulltime",
    description:
      "Je bouwt aan webapplicaties met TypeScript, React en Node. Je werkt in een scrum-team, denkt mee over architectuur en levert features van ontwerp tot productie. Hybride werken en een sterke leercultuur.",
    postedAt: "2026-06-04",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/ict-fullstack-developer-groningen",
  },
  {
    id: "hor-zelfstandig-werkend-kok-tilburg",
    title: "Zelfstandig Werkend Kok",
    company: `Brabants Tafelhuis ${TESTDATA_LABEL}`,
    location: "Tilburg",
    branche: "Horeca",
    type: "Fulltime",
    description:
      "Je staat zelfstandig op je partij, bereidt gerechten met seizoensproducten en bewaakt de kwaliteit tijdens drukke services. Een warme keukenbrigade die ruimte geeft aan eigen creativiteit op de kaart.",
    postedAt: "2026-05-24",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/hor-zelfstandig-werkend-kok-tilburg",
  },
  {
    id: "bouw-uitvoerder-woningbouw-amsterdam",
    title: "Uitvoerder Woningbouw",
    company: `Grachtgordel Bouw ${TESTDATA_LABEL}`,
    location: "Amsterdam",
    branche: "Bouw",
    type: "Fulltime",
    description:
      "Je stuurt bouwprojecten aan op de bouwplaats: planning, onderaannemers, veiligheid en kwaliteit. Je bent het aanspreekpunt op locatie en zorgt dat woningen op tijd en binnen budget worden opgeleverd.",
    postedAt: "2026-05-30",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/bouw-uitvoerder-woningbouw-amsterdam",
  },
  {
    id: "ret-assistent-filiaalmanager-zwolle",
    title: "Assistent Filiaalmanager",
    company: `Hanze Retail Groep ${TESTDATA_LABEL}`,
    location: "Zwolle",
    branche: "Retail",
    type: "Parttime",
    description:
      "Je ondersteunt de filiaalmanager bij de dagelijkse winkelvoering: personeelsplanning, voorraad en klanttevredenheid. Een groeifunctie (28-32 uur) voor wie wil doorgroeien naar filiaalmanager.",
    postedAt: "2026-06-01",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/ret-assistent-filiaalmanager-zwolle",
  },
  {
    id: "ict-data-analist-rotterdam",
    title: "Data-analist",
    company: `Maasstad Insights ${TESTDATA_LABEL}`,
    location: "Rotterdam",
    branche: "ICT",
    type: "Fulltime",
    description:
      "Je vertaalt ruwe data naar bruikbare inzichten met SQL, Python en moderne BI-tooling. Je bouwt dashboards, onderzoekt trends en adviseert het management op basis van cijfers.",
    postedAt: "2026-05-18",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/ict-data-analist-rotterdam",
  },
  {
    id: "zorg-doktersassistent-utrecht",
    title: "Doktersassistent",
    company: `Domstad Huisartsenzorg ${TESTDATA_LABEL}`,
    location: "Utrecht",
    branche: "Zorg",
    type: "Parttime",
    description:
      "Je bent het eerste aanspreekpunt in de huisartsenpraktijk: triage aan de telefoon, kleine medische handelingen en administratie. Een veelzijdige functie (20-28 uur) in een vriendelijk team.",
    postedAt: "2026-06-05",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/zorg-doktersassistent-utrecht",
  },
  {
    id: "tech-elektrotechnicus-eindhoven",
    title: "Elektrotechnicus",
    company: `Brainport Elektro ${TESTDATA_LABEL}`,
    location: "Eindhoven",
    branche: "Techniek",
    type: "Fulltime",
    description:
      "Je installeert en onderhoudt elektrotechnische installaties bij bedrijven in de regio. Van het lezen van schema's tot het oplossen van storingen: techniek die je in de praktijk ziet werken.",
    postedAt: "2026-05-26",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/tech-elektrotechnicus-eindhoven",
  },
  {
    id: "log-internationaal-chauffeur-tilburg",
    title: "Internationaal Chauffeur (C+E)",
    company: `Brabants Transport ${TESTDATA_LABEL}`,
    location: "Tilburg",
    branche: "Logistiek",
    type: "Fulltime",
    description:
      "Je rijdt internationale ritten binnen de Benelux en Duitsland, laadt en lost zelfstandig en houdt je rij- en rusttijden netjes bij. Modern wagenpark en een vast team van planners.",
    postedAt: "2026-05-12",
    applyUrl: "https://voorbeeld-vacaturesite.test/solliciteer/log-internationaal-chauffeur-tilburg",
  },
];

/**
 * Lokale, in-memory JobSource met synthetische testdata.
 *
 * Implementeert het bevroren JobSource-contract. Dit is in golf 1 de ENIGE
 * actieve bron; lib/jobSource/index.ts beslist welke bron actief is.
 */
export const localSource: JobSource = {
  getAllJobs(): Job[] {
    // Defensieve kopie zodat consumers de bron niet per ongeluk muteren.
    return jobs.map((job) => ({ ...job }));
  },

  getJobById(id: string): Job | undefined {
    const job = jobs.find((candidate) => candidate.id === id);
    return job ? { ...job } : undefined;
  },
};
