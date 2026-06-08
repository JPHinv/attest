import { getJobById } from "./jobsRepository.js";
import {
  escapeHtml,
  companyInitials,
  companyGradient,
  companyColor,
} from "./branding.js";

const root = document.getElementById("detail");

/** Read the requested job id from the page query string (?id=<id>). */
function getRequestedId() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  return id !== null ? id.trim() : "";
}

const backLink = `<a class="detail__back" href="index.html">&larr; Terug naar overzicht</a>`;

/** Render a full vacancy in the green house style. */
function renderJob(job) {
  const gradient = companyGradient(job.company);
  const logoColor = companyColor(job.company);
  const initials = escapeHtml(companyInitials(job.company));
  const category = job.category
    ? `<p class="detail__category">${escapeHtml(job.category)}</p>`
    : "";

  root.innerHTML = `
    ${backLink}
    <article class="detail__job">
      <div class="detail__banner" style="background-image: ${gradient};">
        <span class="detail__logo" style="background: ${logoColor};">${initials}</span>
      </div>
      <header class="detail__header">
        ${category}
        <h1 class="detail__title">${escapeHtml(job.title)}</h1>
        <p class="detail__company">${escapeHtml(job.company)}</p>
        <ul class="detail__meta">
          <li class="detail__meta-item detail__meta-item--location">${escapeHtml(job.location)}</li>
          <li class="detail__meta-item detail__meta-item--type">${escapeHtml(job.type)}</li>
        </ul>
      </header>
      <section class="detail__description">${escapeHtml(job.description)}</section>
      <a class="detail__apply" href="index.html">Solliciteer op deze vacature</a>
    </article>
  `;
}

/** Render the "not found" state, used for a missing or unknown id. */
function renderNotFound(message) {
  root.innerHTML = `
    ${backLink}
    <div class="detail__empty" role="status">
      <h1 class="detail__empty-title">Vacature niet gevonden</h1>
      <p class="detail__empty-text">${escapeHtml(message)}</p>
    </div>
  `;
}

/** Render a generic error state when loading fails unexpectedly. */
function renderError() {
  root.innerHTML = `
    ${backLink}
    <div class="detail__empty detail__empty--error" role="alert">
      <h1 class="detail__empty-title">Er ging iets mis</h1>
      <p class="detail__empty-text">De vacature kon niet worden geladen. Probeer het later opnieuw.</p>
    </div>
  `;
}

async function init() {
  const id = getRequestedId();

  if (!id) {
    renderNotFound("Er is geen vacature opgegeven.");
    return;
  }

  try {
    const job = await getJobById(id);
    if (!job) {
      renderNotFound(`Er bestaat geen vacature met id "${id}".`);
      return;
    }
    renderJob(job);
  } catch (error) {
    console.error("Laden van vacature mislukt:", error);
    renderError();
  }
}

init();
