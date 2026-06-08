import type { Job, JobSource } from "./types";

/**
 * IH-Hub-adapter — STUB (golf 1).
 *
 * Deze adapter ZOU het bevroren JobSource-contract implementeren bovenop de
 * echte IH-Hub-vacaturebron. In golf 1 bouwen we de koppeling BEWUST NIET:
 * geen netwerkcalls, geen scraping, geen externe afhankelijkheden.
 *
 * GAP: IH-Hub-adapter — later.
 *   - Auth/credentials per tenant (komt uit de sites-factory config-laag).
 *   - Mapping van IH-Hub-velden naar het bevroren Job-model.
 *   - Caching/revalidatie passend bij SSG (build-time fetch of ISR).
 *   - Foutafhandeling: een falende bron mag de build niet stil laten slagen
 *     met lege data — faal luid of val expliciet terug. Zie INTEGRATION-NOTES.md.
 *
 * Zolang de adapter niet is gebouwd gooien de methods, zodat per ongeluk
 * activeren in lib/jobSource/index.ts onmiddellijk en zichtbaar faalt in
 * plaats van stilletjes lege data te leveren.
 */
export const ihHubAdapter: JobSource = {
  getAllJobs(): Job[] {
    // GAP: IH-Hub-adapter — later. Haal vacatures op en map naar Job[].
    throw new Error(
      "ihHubAdapter.getAllJobs() is nog niet geïmplementeerd (golf-1 stub). " +
        "Zie GAP: IH-Hub-adapter in INTEGRATION-NOTES.md.",
    );
  },

  getJobById(_id: string): Job | undefined {
    // GAP: IH-Hub-adapter — later. Haal één vacature op en map naar Job.
    throw new Error(
      "ihHubAdapter.getJobById() is nog niet geïmplementeerd (golf-1 stub). " +
        "Zie GAP: IH-Hub-adapter in INTEGRATION-NOTES.md.",
    );
  },
};
