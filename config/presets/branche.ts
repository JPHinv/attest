import type { SiteConfig } from "../types";

/**
 * Branche-gerichte preset (testdata/demo).
 *
 * Organiseert de site primair langs BRANCHE. Tenant-neutraal: dit zijn
 * voorbeeldwaarden om aan te tonen dat de as puur config is. Alle merk-,
 * kleur- en domeinwaarden zijn verzonnen voorbeelden.
 */
export const branchePreset: SiteConfig = {
  site_type: "vacature-site",
  presetKey: "branche",
  brandName: "BrancheBanen (demo)",
  description:
    "Vind vacatures per branche — van techniek tot zorg. Demo-site met synthetische testdata.",
  primaryAxis: "branche",
  domain: "https://branche.voorbeeld-vacaturesite.test",
  locale: "nl",
  theme: {
    primaryColor: "#1f6f54",
    onPrimaryColor: "#ffffff",
    accentColor: "#c7e8d8",
  },
  logo: {
    wordmark: "BrancheBanen",
    initials: "BB",
  },
};
