/**
 * Tenant-neutrale site-configuratie (golf 1).
 *
 * Niets in de app mag branche, stad, kleur, logo of domein hardcoden — alles
 * komt uit een SiteConfig. In golf 1 leveren we twee presets om te BEWIJZEN
 * dat een branche-gerichte versus stad-gerichte site puur een config-verschil
 * is (zie config/presets/). Later vervangt de sites-factory config-laag deze
 * presets door een per-tenant resolved config. Zie INTEGRATION-NOTES.md.
 */

/**
 * De primaire as waarlangs de site is georganiseerd. Bepaalt later (golf 2)
 * de hoofd-navigatiestructuur en clustering van het overzicht.
 */
export type PrimaryAxis = "branche" | "stad";

export interface ThemeConfig {
  /** Primaire merkkleur (CSS-kleurwaarde, bv. hex). */
  primaryColor: string;
  /** Contrastkleur voor tekst/icoon op de primaire kleur. */
  onPrimaryColor: string;
  /** Accent-/secundaire kleur. */
  accentColor: string;
}

export interface LogoConfig {
  /** Korte tekst-/woordmerk-weergave (geen extern beeld nodig in golf 1). */
  wordmark: string;
  /** Optionele initialen voor een compact logo-merkteken. */
  initials: string;
}

export interface SiteConfig {
  /**
   * Expliciet site_type-veld voor de latere sites-factory
   * site_type-cascade. Voor deze repo altijd "vacature-site".
   */
  site_type: "vacature-site";

  /** Sleutel van de actieve preset (informatief/debug). */
  presetKey: string;

  /** Merknaam, gebruikt in titels en OpenGraph. */
  brandName: string;

  /** Korte sitebeschrijving (SEO default description). */
  description: string;

  /** Primaire organisatie-as: branche- of stad-gericht. */
  primaryAxis: PrimaryAxis;

  /** Canonieke host ZONDER trailing slash, bv. "https://example.test". */
  domain: string;

  /** Voertaal van de site (bv. "nl"). */
  locale: string;

  theme: ThemeConfig;
  logo: LogoConfig;
}
