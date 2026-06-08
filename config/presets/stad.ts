import type { SiteConfig } from "../types";

/**
 * Stad-gerichte preset (testdata/demo).
 *
 * Organiseert de site primair langs STAD. Identieke structuur als de
 * branche-preset; alleen de config-waarden verschillen. Daarmee bewijst dit
 * dat branche- versus stad-gericht puur een config-keuze is, geen code.
 */
export const stadPreset: SiteConfig = {
  site_type: "vacature-site",
  presetKey: "stad",
  brandName: "StadBanen (demo)",
  description:
    "Vind vacatures in jouw stad — van Rotterdam tot Groningen. Demo-site met synthetische testdata.",
  primaryAxis: "stad",
  domain: "https://stad.voorbeeld-vacaturesite.test",
  locale: "nl",
  theme: {
    primaryColor: "#1d4e89",
    onPrimaryColor: "#ffffff",
    accentColor: "#cfe0f5",
  },
  logo: {
    wordmark: "StadBanen",
    initials: "SB",
  },
};
