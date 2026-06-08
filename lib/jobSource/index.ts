import type { JobSource } from "./types";
import { localSource } from "./localSource";
// import { ihHubAdapter } from "./ihHubAdapter"; // GAP: activeer zodra de adapter is gebouwd.

export type { Job, JobSource } from "./types";

/**
 * ADAPTER-LAAG — de ENE plek waar de actieve vacaturebron wordt gekozen.
 *
 * Alle (latere) externe calls moeten via deze laag lopen. Pagina's en helpers
 * importeren NOOIT rechtstreeks een concrete bron, maar altijd getJobSource().
 * Zo kan de bron later worden omgezet (localSource -> ihHubAdapter) zonder
 * één pagina aan te raken.
 *
 * Golf 1: de actieve bron is altijd localSource (synthetische testdata).
 *
 * GAP: bron-selectie wordt later tenant-/config-gestuurd vanuit de
 * sites-factory config-laag (bv. per tenant localSource óf ihHubAdapter).
 * Zie INTEGRATION-NOTES.md.
 */
export function getJobSource(): JobSource {
  return localSource;
}
