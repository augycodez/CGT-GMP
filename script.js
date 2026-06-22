/**
 * ============================================================
 * GLOBAL GMP INTELLIGENCE PLATFORM — Main Script
 * script.js — Handles: search, theme toggle, data loading,
 * country cards, agency cards, CGT cards, mobile nav
 * ============================================================
 * HOW TO EDIT: All section blocks are clearly labelled.
 * Data comes from: data/guidelines.json, data/countries.json, data/agencies.json
 * ============================================================
 */

// ── SECTION 1: THEME TOGGLE ──────────────────────────────────

/**
 * Initialises the dark/light mode toggle.
 * Saves the user's choice in localStorage so it persists.
 */
function initTheme() {
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');

  // Load saved preference, or default to dark
  const savedTheme = localStorage.getItem('gmp-theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
  }

  if (!toggle) return;

  toggle.addEventListener('click', function () {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('gmp-theme', isLight ? 'light' : 'dark');
    // Update icon
    const knob = toggle.querySelector('.theme-toggle-knob');
    if (knob) knob.textContent = isLight ? '☀️' : '🌙';
  });

  // Set initial icon
  const knob = toggle.querySelector('.theme-toggle-knob');
  const isLight = body.classList.contains('light-mode');
  if (knob) knob.textContent = isLight ? '☀️' : '🌙';
}

// ── SECTION 2: MOBILE NAV ─────────────────────────────────────

function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('mobile-open');
  });

  // Close on clicking a link
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('mobile-open');
    });
  });
}

// ── SECTION 3: DATA LOADER ────────────────────────────────────

// We store loaded data globally so functions can reuse it
let guidelinesData = [];
let countriesData  = [];
let agenciesData   = [];

/**
 * Fetches a JSON file and returns the parsed data.
 * @param {string} url - Path to the JSON file
 * @returns {Promise<Array>}
 */
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Could not load ' + url);
    return await response.json();
  } catch (error) {
    console.warn('JSON load failed:', error.message);
    return [];
  }
}

/**
 * Loads all three data files on page start.
 */
async function loadAllData() {
  // Fetch in parallel — faster than one at a time
  const [guidelines, countries, agencies] = await Promise.all([
    fetchJSON('data/guidelines.json'),
    fetchJSON('data/countries.json'),
    fetchJSON('data/agencies.json'),
  ]);

  guidelinesData = guidelines;
  countriesData  = countries;
  agenciesData   = agencies;

  // After data loads, build the page sections
  buildCountryCards();
  buildAgencyCards();
  buildCGTCards();
}

// ── SECTION 4: SEARCH ─────────────────────────────────────────

/**
 * Searches guidelines by: title, country, agency, category, keywords
 * @param {string} query - The search term from the user
 * @returns {Array} - Matching guideline objects
 */
function searchGuidelines(query) {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();

  return guidelinesData.filter(function (item) {
    // Build a single searchable string per item
    const searchable = [
      item.title,
      item.country,
      item.agency,
      item.category,
      item.description,
      item.year,
      (item.keywords || []).join(' ')
    ].join(' ').toLowerCase();

    return searchable.includes(q);
  });
}

/**
 * Builds a single search result row for the dropdown.
 * @param {Object} item - A guideline object from guidelines.json
 * @returns {HTMLElement}
 */
function buildSearchResultItem(item) {
  const div = document.createElement('div');
  div.className = 'search-result-item';

  // Build the external link or empty
  const extLink = item.external
    ? `<a class="btn btn-secondary" href="${item.external}" target="_blank" rel="noopener">Visit Official Site ↗</a>`
    : '';

  // Show PDF button only if pdf path is set
  const pdfLink = item.pdf
    ? `<a class="btn btn-primary" href="${item.pdf}" target="_blank">View PDF</a>`
    : '';

  div.innerHTML = `
    <span class="result-id tag tag-id">${item.id}</span>
    <div class="result-body">
      <div class="result-title">${item.title}</div>
      <div class="result-meta">${item.country} · ${item.agency} · ${item.category} · ${item.year}</div>
      <div class="result-actions mt-2">
        ${pdfLink}
        ${extLink}
      </div>
    </div>
  `;

  return div;
}

/**
 * Initialises the hero search box with live filtering.
 */
function initSearch() {
  const input   = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const clearBtn = document.getElementById('search-clear');
  const searchBtn = document.getElementById('search-btn');

  if (!input || !results) return;

  // Typing handler — runs on every keystroke
  input.addEventListener('input', function () {
    const query = input.value.trim();

    // Show/hide the clear (✕) button
    if (clearBtn) {
      clearBtn.classList.toggle('visible', query.length > 0);
    }

    if (query.length < 2) {
      results.classList.remove('visible');
      results.innerHTML = '';
      return;
    }

    const matches = searchGuidelines(query);
    renderSearchResults(matches, results);
  });

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      input.value = '';
      clearBtn.classList.remove('visible');
      results.classList.remove('visible');
      results.innerHTML = '';
      input.focus();
    });
  }

  // Search button
  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      const query = input.value.trim();
      if (query.length >= 2) {
        const matches = searchGuidelines(query);
        renderSearchResults(matches, results);
      }
    });
  }

  // Enter key
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const query = input.value.trim();
      const matches = searchGuidelines(query);
      renderSearchResults(matches, results);
    }
    // Escape closes results
    if (e.key === 'Escape') {
      results.classList.remove('visible');
    }
  });

  // Close results when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-container')) {
      results.classList.remove('visible');
    }
  });
}

/**
 * Renders the array of matching guidelines into the results panel.
 * @param {Array} matches - Filtered guideline objects
 * @param {HTMLElement} container - The results div
 */
function renderSearchResults(matches, container) {
  container.innerHTML = '';

  if (matches.length === 0) {
    container.innerHTML = `
      <div style="padding:24px;text-align:center;color:var(--color-text-muted);font-size:13px;">
        No guidelines found. Try a different term — e.g. "FDA Annex 1" or "CAR-T India".
      </div>
    `;
    container.classList.add('visible');
    return;
  }

  // Show up to 8 results in the dropdown
  const limit = Math.min(matches.length, 8);
  for (let i = 0; i < limit; i++) {
    container.appendChild(buildSearchResultItem(matches[i]));
  }

  // If more results exist, show a footer hint
  if (matches.length > 8) {
    const more = document.createElement('div');
    more.style.cssText = 'padding:12px 16px;text-align:center;font-size:11px;color:var(--color-text-muted);border-top:1px solid var(--color-border)';
    more.textContent = `+ ${matches.length - 8} more results — refine your search.`;
    container.appendChild(more);
  }

  container.classList.add('visible');
}

/**
 * Handles the quick-search "chips" under the search bar.
 * Clicking a chip fills the search box and triggers search.
 */
function initSearchChips() {
  const chips = document.querySelectorAll('.search-chip');
  const input = document.getElementById('search-input');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const query = chip.dataset.query || chip.textContent.trim();
      if (input) {
        input.value = query;
        input.dispatchEvent(new Event('input'));
        input.focus();
      }
    });
  });
}

// ── SECTION 5: COUNTRY CARDS ──────────────────────────────────

/**
 * Builds country cards dynamically from countries.json.
 * Renders into #countries-grid on the homepage.
 */
function buildCountryCards() {
  const grid = document.getElementById('countries-grid');
  if (!grid || countriesData.length === 0) return;

  // Clear any placeholder content
  grid.innerHTML = '';

  countriesData.forEach(function (country) {
    const card = document.createElement('a');
    card.className = 'country-card';
    card.href = country.page || '#';

    // Format agency codes as mono-style string
    const agencyCodes = country.agencies.join(' · ');

    card.innerHTML = `
      <div class="card-flag">${country.flag}</div>
      <div class="card-country-name">${country.name}</div>
      <div class="card-agencies">${agencyCodes}</div>
      <div class="card-stats">
        <div class="card-stat">
          <span class="card-stat-n">${country.guidelineCount}</span>
          <span class="card-stat-l">Guidelines</span>
        </div>
        <div class="card-stat">
          <span class="card-stat-n text-amber">${country.cgtGuidelines}</span>
          <span class="card-stat-l">CGT</span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ── SECTION 6: AGENCY CARDS ───────────────────────────────────

/**
 * Builds agency cards dynamically from agencies.json.
 * Renders into #agencies-grid on the homepage.
 */
function buildAgencyCards() {
  const grid = document.getElementById('agencies-grid');
  if (!grid || agenciesData.length === 0) return;

  grid.innerHTML = '';

  agenciesData.forEach(function (agency) {
    const card = document.createElement('a');
    card.className = 'agency-card';
    card.href = agency.page || '#';

    card.innerHTML = `
      <div class="agency-badge">${agency.name}</div>
      <div class="agency-info">
        <div class="agency-name">${agency.fullName}</div>
        <div class="agency-country">${agency.flag}  ${agency.country}</div>
        <div class="agency-desc">${agency.description}</div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ── SECTION 7: CGT HUB ───────────────────────────────────────

/**
 * CGT product and topic definitions.
 * Add new items here — they will appear automatically on the page.
 */
const CGT_PRODUCTS = [
  { name: 'CAR-T',            icon: '🧬', tag: 'Gene-modified cell', page: 'cgt/car-t.html' },
  { name: 'CAR-NK',           icon: '🔬', tag: 'NK cell therapy',    page: 'cgt/car-nk.html' },
  { name: 'MSC Therapy',      icon: '🧫', tag: 'Stem cell',          page: 'cgt/msc.html' },
  { name: 'Stem Cell Therapy',icon: '⚗️',  tag: 'Cell therapy',      page: 'cgt/stemcells.html' },
  { name: 'AAV Vector',       icon: '🦠', tag: 'Viral vector',       page: 'cgt/aav.html' },
  { name: 'Lentivirus',       icon: '🧪', tag: 'Viral vector',       page: 'cgt/lentivirus.html' },
  { name: 'CRISPR',           icon: '✂️', tag: 'Gene editing',        page: 'cgt/crispr.html' },
  { name: 'Exosomes',         icon: '💊', tag: 'Extracellular vesicle', page: '#' },
  { name: 'ATMP',             icon: '🏭', tag: 'Advanced therapy',   page: '#' },
  { name: 'Organoids',        icon: '🔭', tag: 'Cell model',         page: '#' },
  { name: 'Retrovirus',       icon: '🔗', tag: 'Viral vector',       page: '#' },
  { name: 'Gene Editing',     icon: '🖊️', tag: 'Genome therapy',     page: '#' },
];

const GMP_TOPICS = [
  { name: 'Annex 1',                 page: '#' },
  { name: 'Aseptic Processing',      page: '#' },
  { name: 'APS / Media Fill',        page: '#' },
  { name: 'Environmental Monitoring',page: '#' },
  { name: 'Contamination Control',   page: '#' },
  { name: 'Sterility Testing',       page: '#' },
  { name: 'Mycoplasma Testing',      page: '#' },
  { name: 'Potency Assays',          page: '#' },
  { name: 'Flow Cytometry QC',       page: '#' },
  { name: 'Data Integrity',          page: '#' },
  { name: 'CAPA',                    page: '#' },
  { name: 'Deviations',              page: '#' },
  { name: 'Quality Management',      page: '#' },
  { name: 'Process Validation',      page: '#' },
  { name: 'CSV / CQV',              page: '#' },
  { name: 'Release Testing',         page: '#' },
];

/**
 * Builds CGT product cards and GMP topic tags.
 */
function buildCGTCards() {
  const productGrid = document.getElementById('cgt-products-grid');
  const topicsGrid  = document.getElementById('gmp-topics-grid');

  if (productGrid) {
    productGrid.innerHTML = '';
    CGT_PRODUCTS.forEach(function (item) {
      const card = document.createElement('a');
      card.className = 'cgt-card';
      card.href = item.page;
      card.innerHTML = `
        <span class="cgt-card-icon">${item.icon}</span>
        <div class="cgt-card-name">${item.name}</div>
        <div class="cgt-card-tag">${item.tag}</div>
      `;
      productGrid.appendChild(card);
    });
  }

  if (topicsGrid) {
    topicsGrid.innerHTML = '';
    GMP_TOPICS.forEach(function (topic) {
      const card = document.createElement('a');
      card.className = 'topic-card';
      card.href = topic.page;
      card.innerHTML = `
        <span class="topic-dot"></span>
        <span class="topic-name">${topic.name}</span>
      `;
      topicsGrid.appendChild(card);
    });
  }
}

// ── SECTION 8: ACTIVE NAV LINK ────────────────────────────────

/**
 * Marks the current page link as active in the navbar.
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  const links = document.querySelectorAll('.nav-links a');

  links.forEach(function (link) {
    const linkPath = new URL(link.href, window.location.href).pathname;
    const linkHash = new URL(link.href, window.location.href).hash;
    const isSamePath = currentPath === linkPath || currentPath.endsWith(linkPath);

    link.classList.remove('active');

    if (isSamePath && linkHash && currentHash === linkHash) {
      link.classList.add('active');
    } else if (isSamePath && !linkHash && !currentHash) {
      link.classList.add('active');
    }
  });
}

// ── SECTION 9: NAVBAR SCROLL EFFECT ──────────────────────────

/**
 * Adds a subtle shadow to the navbar when user scrolls down.
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

// ── SECTION 10: INIT ──────────────────────────────────────────

/**
 * Main init — runs after the HTML is fully loaded.
 * Add new init calls here to extend functionality.
 */
document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initMobileNav();
  initNavbarScroll();
  setActiveNavLink();
  initSearch();
  initSearchChips();
  window.addEventListener('hashchange', setActiveNavLink);

  // Load JSON data and build dynamic sections
  loadAllData();

  console.log('Global GMP Intelligence Platform — ready ✓');
});
