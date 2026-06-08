/**
 * branding.js — kleine, gedeelde UI-helpers voor het vacature-job-board.
 *
 * Hier worden de ZELF-GEGENEREERDE visuals afgeleid: bedrijfsinitialen en een
 * deterministische CSS-gradient/accentkleur op basis van de bedrijfsnaam.
 * Er worden bewust GEEN externe afbeeldingen of netwerk-bronnen gebruikt, zodat
 * het board volledig offline werkt over een simpele http-server.
 *
 * Deze afgeleiden horen NIET in de datalaag (jobsRepository.js): de bron levert
 * alleen tekstvelden, de presentatie maakt er visuals van.
 */

/** Voorkomt HTML-injectie wanneer waarden in de DOM worden gezet. */
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Stabiele, niet-cryptografische hash van een string.
 * Gelijke invoer geeft altijd dezelfde uitkomst, zodat een bedrijf telkens
 * exact dezelfde kleur/gradient krijgt (consistent over kaarten en detail).
 *
 * @param {string} value
 * @returns {number} Niet-negatief geheel getal.
 */
function hashString(value) {
  let hash = 0;
  const text = String(value ?? "");
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Basis-hue (0-359) voor een bedrijf, deterministisch afgeleid uit de naam. */
function companyHue(company) {
  return hashString(company) % 360;
}

/**
 * Initialen van een bedrijf, max. 2 letters, voor het logo-rondje.
 * Bijv. "Groenhart Kwekerijen" -> "GK", "Poeldijk Digital" -> "PD".
 *
 * @param {string} company
 * @returns {string}
 */
export function companyInitials(company) {
  const words = String(company ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * CSS-gradient voor het beeldvlak bovenaan een kaart/detail-header.
 * Twee verwante tinten rond de bedrijfs-hue geven een fris, kasachtig verloop.
 *
 * @param {string} company
 * @returns {string} Een `linear-gradient(...)`-waarde.
 */
export function companyGradient(company) {
  const hue = companyHue(company);
  const hueShift = (hue + 42) % 360;
  return `linear-gradient(135deg, hsl(${hue} 48% 52%), hsl(${hueShift} 52% 38%))`;
}

/**
 * Egale accentkleur voor het logo-rondje (witte initialen er bovenop).
 *
 * @param {string} company
 * @returns {string} Een `hsl(...)`-kleur.
 */
export function companyColor(company) {
  return `hsl(${companyHue(company)} 46% 42%)`;
}
