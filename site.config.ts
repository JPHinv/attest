import type { SiteConfig } from "./config/types";
import { branchePreset } from "./config/presets/branche";
import { stadPreset } from "./config/presets/stad";

export type { SiteConfig, PrimaryAxis, ThemeConfig, LogoConfig } from "./config/types";

/**
 * Site-configuratie — de ENE plek waar de actieve config wordt gekozen.
 *
 * Golf 1 levert twee presets (branche-gericht en stad-gericht). De actieve
 * preset is selecteerbaar via de env-var SITE_PRESET, zodat de demo kan
 * wisselen ZONDER code te raken:
 *
 *     SITE_PRESET=branche   (default)
 *     SITE_PRESET=stad
 *
 * GAP: in de sites-factory wordt de config niet via een env-var maar via de
 * site_type-cascade + tenant-resolver bepaald. Deze module is het integratie-
 * punt waar die resolved config later instroomt. Zie INTEGRATION-NOTES.md.
 */

const PRESETS: Record<string, SiteConfig> = {
  branche: branchePreset,
  stad: stadPreset,
};

const DEFAULT_PRESET = "branche";

function resolveSiteConfig(): SiteConfig {
  const requested = process.env.SITE_PRESET?.trim().toLowerCase();
  if (requested && !(requested in PRESETS)) {
    // Onbekende preset: faal luid in plaats van stil terug te vallen, zodat
    // een typefout in de env-var niet onopgemerkt de verkeerde site oplevert.
    const known = Object.keys(PRESETS).join(", ");
    throw new Error(
      `Onbekende SITE_PRESET "${requested}". Geldige waarden: ${known}.`,
    );
  }
  return PRESETS[requested ?? DEFAULT_PRESET];
}

export const siteConfig: SiteConfig = resolveSiteConfig();
