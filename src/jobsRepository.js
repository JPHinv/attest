/**
 * Datalaag voor het vacature-job-board.
 *
 * De databron (data/jobs.json) zit VOLLEDIG verborgen achter dit module.
 * De rest van de applicatie praat alleen met getAllJobs() en getJobById().
 * Daardoor kan de bron later vervangen worden door bijvoorbeeld een externe
 * IH Hub zonder dat de UI hoeft te veranderen.
 *
 * @typedef {Object} Job
 * @property {string} id           Stabiele, unieke identifier.
 * @property {string} title        Functietitel.
 * @property {string} company      Naam van het bedrijf.
 * @property {string} location     Standplaats.
 * @property {string} type         Dienstverband, bv. "Fulltime" / "Parttime" / "Stage".
 * @property {string} description  Omschrijving van de vacature.
 * @property {string} category     Optionele sector/rubriek, bv. "Techniek". Leeg ("") als de bron die niet levert.
 */

// Pad relatief aan de root-pagina's (index.html / job.html).
const SOURCE_URL = "./data/jobs.json";

/**
 * Normaliseer een ruwe bron-record naar het bevroren Job-model.
 * Alle velden worden geforceerd naar string zodat de UI altijd veilig
 * met strings kan werken, ongeacht wat de bron levert.
 *
 * De kernvelden {id,title,company,location,type,description} liggen vast.
 * `category` is een optionele uitbreiding: levert de bron die niet, dan
 * normaliseren we naar een lege string zodat de UI er veilig op kan leunen.
 * Visuele afgeleiden (logo-initialen, gradient) worden NIET hier bepaald maar
 * in de UI afgeleid uit `company`, zodat de databron daar niets van hoeft te weten.
 *
 * @param {Object} raw
 * @returns {Job}
 */
function normalizeJob(raw) {
  return {
    id: String(raw.id),
    title: String(raw.title ?? ""),
    company: String(raw.company ?? ""),
    location: String(raw.location ?? ""),
    type: String(raw.type ?? ""),
    description: String(raw.description ?? ""),
    category: String(raw.category ?? ""),
  };
}

/**
 * Haal alle vacatures op.
 *
 * @returns {Promise<Job[]>}
 * @throws {Error} Wanneer de bron niet geladen of geparsed kan worden.
 */
export async function getAllJobs() {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) {
    throw new Error(
      `Kon vacatures niet laden (${response.status} ${response.statusText}).`
    );
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Onverwacht bronformaat: verwachtte een array met vacatures.");
  }

  return data.map(normalizeJob);
}

/**
 * Haal één vacature op aan de hand van zijn id.
 *
 * @param {string} id
 * @returns {Promise<Job|null>} De vacature, of null als die niet bestaat.
 */
export async function getJobById(id) {
  const wanted = String(id);
  const jobs = await getAllJobs();
  return jobs.find((job) => job.id === wanted) ?? null;
}
