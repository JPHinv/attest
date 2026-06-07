import { getAllJobs } from "./jobsRepository.js";
import {
  escapeHtml,
  companyInitials,
  companyGradient,
  companyColor,
} from "./branding.js";

/**
 * Overzichtspagina: haalt alle vacatures op via de datalaag en rendert ze als
 * kaarten in een responsive grid. Bovenaan kan de bezoeker client-side zoeken
 * (titel/bedrijf/locatie) en filteren op dienstverband. Elke kaart linkt naar
 * de detailpagina (job.html?id=<id>).
 *
 * De UI praat UITSLUITEND met getAllJobs() — jobs.json wordt nooit direct
 * gelezen. Visuals (initialen, gradient) komen uit branding.js.
 */

const listEl = document.getElementById("job-list");
const countEl = document.getElementById("job-count");
const filtersEl = document.getElementById("job-filters");
const searchInput = document.getElementById("job-search");

/** Alle vacatures, één keer geladen; daarna puur in het geheugen gefilterd. */
let allJobs = [];
/** Actief dienstverband-filter ("" = alles). */
let activeType = "";
/** Huidige zoekterm (genormaliseerd naar kleine letters). */
let searchTerm = "";

function jobCardMarkup(job) {
  const href = `job.html?id=${encodeURIComponent(job.id)}`;
  const gradient = companyGradient(job.company);
  const logoColor = companyColor(job.company);
  const initials = escapeHtml(companyInitials(job.company));
  const category = job.category
    ? `<p class="job-card__category">${escapeHtml(job.category)}</p>`
    : "";

  return `
    <article class="job-card">
      <a class="job-card__link" href="${href}">
        <div class="job-card__media" style="background-image: ${gradient};">
          ${job.type ? `<span class="job-card__tag">${escapeHtml(job.type)}</span>` : ""}
          <span class="job-card__logo" style="background: ${logoColor};">${initials}</span>
        </div>
        <div class="job-card__body">
          ${category}
          <h2 class="job-card__title">${escapeHtml(job.title)}</h2>
          <p class="job-card__meta">
            <span class="job-card__company">${escapeHtml(job.company)}</span>
            <span class="job-card__sep" aria-hidden="true">·</span>
            <span class="job-card__location">${escapeHtml(job.location)}</span>
          </p>
          <span class="job-card__cta">Bekijk vacature</span>
        </div>
      </a>
    </article>
  `;
}

/** Bepaalt of een vacature matcht met de huidige zoekterm + type-filter. */
function matchesFilters(job) {
  if (activeType && job.type !== activeType) return false;
  if (!searchTerm) return true;

  const haystack = `${job.title} ${job.company} ${job.location}`.toLowerCase();
  return haystack.includes(searchTerm);
}

function renderCount(visible, total) {
  if (total === 0) {
    countEl.textContent = "";
    return;
  }
  if (visible === total) {
    countEl.textContent = `${total} vacatures`;
    return;
  }
  countEl.textContent = `${visible} van ${total} vacatures`;
}

function renderJobs() {
  const visible = allJobs.filter(matchesFilters);
  renderCount(visible.length, allJobs.length);

  if (!visible.length) {
    listEl.classList.add("job-grid--empty");
    const message = allJobs.length
      ? "Geen vacatures gevonden. Pas je zoekopdracht of filter aan."
      : "Er zijn op dit moment geen openstaande vacatures.";
    listEl.innerHTML = `<p class="job-status job-status--empty">${message}</p>`;
    return;
  }

  listEl.classList.remove("job-grid--empty");
  listEl.innerHTML = visible.map(jobCardMarkup).join("");
}

/** Bouwt de filter-chips op basis van de dienstverbanden die echt voorkomen. */
function renderFilters() {
  const types = [...new Set(allJobs.map((job) => job.type).filter(Boolean))];
  const chips = [{ label: "Alle", value: "" }].concat(
    types.map((type) => ({ label: type, value: type }))
  );

  filtersEl.innerHTML = chips
    .map(
      (chip) => `
        <button
          type="button"
          class="chip${chip.value === activeType ? " chip--active" : ""}"
          data-type="${escapeHtml(chip.value)}"
          aria-pressed="${chip.value === activeType}"
        >${escapeHtml(chip.label)}</button>`
    )
    .join("");
}

function renderError() {
  listEl.classList.add("job-grid--empty");
  countEl.textContent = "";
  listEl.innerHTML = `
    <p class="job-status job-status--error">
      Vacatures konden niet geladen worden. Probeer het later opnieuw.
    </p>`;
}

function bindEvents() {
  searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderJobs();
  });

  filtersEl.addEventListener("click", (event) => {
    const button = event.target.closest(".chip");
    if (!button) return;
    activeType = button.dataset.type ?? "";
    renderFilters();
    renderJobs();
  });
}

async function init() {
  try {
    allJobs = await getAllJobs();
    renderFilters();
    renderJobs();
    bindEvents();
  } catch (error) {
    console.error("Kon vacatures niet laden:", error);
    renderError();
  } finally {
    listEl.setAttribute("aria-busy", "false");
  }
}

init();
