import { getAllJobs } from "./jobsRepository.js";

/**
 * Overzichtspagina: haalt alle vacatures op via de datalaag en rendert ze als
 * kaarten. Elke kaart linkt naar de detailpagina (job.html?id=<id>).
 */

const listEl = document.getElementById("job-list");

/** Voorkomt HTML-injectie wanneer job-velden in de DOM worden gezet. */
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jobCardMarkup(job) {
  const href = `job.html?id=${encodeURIComponent(job.id)}`;
  const description = job.description
    ? `<p class="job-card__description">${escapeHtml(job.description)}</p>`
    : "";

  return `
    <article class="job-card">
      <a class="job-card__link" href="${href}">
        <h2 class="job-card__title">${escapeHtml(job.title)}</h2>
        <p class="job-card__company">${escapeHtml(job.company)}</p>
        <ul class="job-card__meta">
          <li class="job-card__location">${escapeHtml(job.location)}</li>
          <li class="job-card__type">${escapeHtml(job.type)}</li>
        </ul>
        ${description}
      </a>
    </article>
  `;
}

function renderJobs(jobs) {
  if (!jobs.length) {
    listEl.classList.add("job-grid--empty");
    listEl.innerHTML = `
      <p class="job-status job-status--empty">
        Er zijn op dit moment geen openstaande vacatures.
      </p>`;
    return;
  }

  listEl.classList.remove("job-grid--empty");
  listEl.innerHTML = jobs.map(jobCardMarkup).join("");
}

function renderError() {
  listEl.classList.add("job-grid--empty");
  listEl.innerHTML = `
    <p class="job-status job-status--error">
      Vacatures konden niet geladen worden. Probeer het later opnieuw.
    </p>`;
}

async function init() {
  try {
    const jobs = await getAllJobs();
    renderJobs(jobs);
  } catch (error) {
    console.error("Kon vacatures niet laden:", error);
    renderError();
  } finally {
    listEl.setAttribute("aria-busy", "false");
  }
}

init();
