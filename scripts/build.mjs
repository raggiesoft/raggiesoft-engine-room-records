/**
 * @license MIT
 * ============================================================================
 * scripts/build.mjs — Engine Room Records (engineroom.raggiesoft.com)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL JAVASCRIPT & NODE.JS SSG GUIDE):
 * What is a Static Site Generator (SSG), and what does this script do?
 *   Traditional dynamic websites run a server database (like MySQL) on every
 *   single visitor click to build HTML on the fly. By contrast, a **Static Site
 *   Generator (SSG)** runs ONCE at build time (`npm run build` -> `node scripts/build.mjs`),
 *   reads flat JSON data files on disk, and pre-builds 100% finished `.html`,
 *   `.css`, `.js`, and `.xml` files into `./dist`. When deployed behind Nginx,
 *   visitors get instant, zero-database page loads with zero server attack surface!
 *
 * Data Inputs Read at Build Time:
 *   1. `raggiesoft-assets/engine-room-records/catalog.json` — Live albums & tracklists.
 *   2. `raggiesoft-assets/engine-room-records/json/corporate-structure.json` — In-universe org tree.
 *   3. `raggiesoft-assets/engine-room-records/json/master-catalog.json` — Complete ISRC/UPC/ERR-ID ledger.
 *   4. `src/data/artistLore.mjs` — Biographies, personnel, and lore pillars for all bands.
 *   5. `src/data/ported-pages.json` — 73 archival corporate, property, and character dossiers.
 *   6. `src/styles/err-main.css` — Master Light/Dark WCAG 2.1 AA stylesheet.
 *
 * Outputs Written by `buildSite()`:
 *   - `./dist/index.html`, `/studio-engineering/index.html`, `/corporate/index.html`,
 *     `/artists/index.html`, `/artists/<slug>/index.html` (+ `/artists/stardust-engine` alias),
 *     `/commercial-licensing/index.html`, `/dsp-verification/index.html`, `/isrc/index.html`,
 *     `/terms/index.html`, `/privacy/index.html`, all 73 ported dossier routes,
 *     `/404.html`, `/sitemap.xml`, `/robots.txt`, and IndexNow verification key.
 *   - `./dist/assets/err-main.css` AND mirrored 1:1 to `raggiesoft-assets/engine-room-records/css/err-main.css`.
 *   - `./dist/assets/err-client.js` AND mirrored 1:1 to `raggiesoft-assets/engine-room-records/js/err-client.js`.
 *   - Optional local preview web server when invoked with `node scripts/build.mjs --serve`.
 * ============================================================================
 */

// Node.js built-in modules (`node:` prefix explicitly imports core runtime APIs
// rather than npm packages from `node_modules/`):
// - `fs`: File System API for reading JSON/CSS files and writing `./dist` outputs.
// - `path`: Cross-platform file path joiner/resolver (`/` on macOS/Linux, `\` on Windows).
// - `http`: Built-in HTTP server used only when `--serve` is passed for local previewing.
// - `fileURLToPath`: Converts ES Module `import.meta.url` (`file:///...`) into an OS path.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

// Import artist lore records and HTML page-rendering functions from `src/`.
import { ARTIST_LORE_PROFILES } from '../src/data/artistLore.mjs';
import {
  renderHomePage,
  renderStudioEngineeringPage,
  renderCorporatePage
} from '../src/renderers/pages-core.mjs';
import {
  renderArtistsIndexPage,
  renderArtistDetailPage,
  renderCommercialLicensingPage,
  renderDspVerificationPage,
  renderIsrcExplainerPage,
  renderTermsPage,
  renderPrivacyPage
} from '../src/renderers/pages-artists-and-legal.mjs';
import { renderDocumentShell, escapeHtml } from '../src/renderers/shell.mjs';

// 100-Level Node.js ESM Tip:
// Older CommonJS scripts had magic globals named `__filename` and `__dirname`.
// In modern ES Modules (`"type": "module"`), we derive them from `import.meta.url`:
// - `__filename`: Absolute path to `.../subdomains/engineroom/scripts/build.mjs`
// - `__dirname`:  Absolute path to `.../subdomains/engineroom/scripts`
// - `projectRoot`: One folder up (`..`) -> `.../subdomains/engineroom`
// - `distDir`:    Output directory -> `.../subdomains/engineroom/dist`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

/**
 * Locates the shared `raggiesoft-assets/engine-room-records` directory across both
 * local developer machines (`raggiesoft-servers/raggiesoft.com/subdomains/engineroom`
 * -> `../../../raggiesoft-assets/...`) and the DigitalOcean production server
 * (`/var/www/raggiesoft-assets/engine-room-records`).
 *
 * @returns {string} Absolute path to `raggiesoft-assets/engine-room-records`.
 */
function resolveEngineRoomAssetsDir() {
  const candidates = [
    path.resolve(projectRoot, '../../../raggiesoft-assets/engine-room-records'),
    path.resolve(projectRoot, '../../raggiesoft-assets/engine-room-records'),
    path.resolve(projectRoot, '../raggiesoft-assets/engine-room-records'),
    '/var/www/raggiesoft-assets/engine-room-records'
  ];
  // Return the first candidate path that actually exists as a directory on disk.
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
  }
  throw new Error('Could not locate raggiesoft-assets/engine-room-records directory.');
}

/**
 * Writes a UTF-8 text file inside `./dist`, automatically creating any missing
 * parent folders (`{ recursive: true }` behaves like `mkdir -p` in the terminal).
 *
 * @param {string} relPath - Path relative to `./dist` (e.g., `'corporate/index.html'`).
 * @param {string} content - UTF-8 file contents to write.
 */
function writeDistFile(relPath, content) {
  const fullPath = path.join(distDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
}

/**
 * Returns the browser JavaScript source code emitted to BOTH `./dist/assets/err-client.js`
 * and `raggiesoft-assets/engine-room-records/js/err-client.js`.
 *
 * Why Progressive Enhancement?
 *   Every HTML page already works with JavaScript turned off! This script adds four
 *   interactive browser upgrades once the DOM has parsed (`defer`):
 *   1. Mobile Hamburger Menu Drawer (`aria-expanded` + `Escape` key dismissal).
 *   2. Modern Web Guidance Two-State Light/Dark Mode Toggle (syncing `<meta name="color-scheme">`,
 *      `localStorage`, Bootstrap `data-bs-theme`, and cross-tab `storage` events).
 *   3. `/dsp-verification` Instant Table Search & URL Query Parameter Affidavits
 *      (`?artist=`, `?album=`, `?track=`).
 *   4. `/isrc` Interactive ISO 3901:2019 ISRC & `ERR` Catalog Number Decoder (`?code=`).
 *
 * @returns {string} Complete browser-ready JavaScript file source.
 */
function buildClientJs() {
  return `/**
 * @license MIT
 * ============================================================================
 * err-client.js — Client-Side Progressive Enhancement (engineroom.raggiesoft.com)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL JAVASCRIPT GUIDE):
 * What is this file?
 *   This browser script runs on every page of engineroom.raggiesoft.com (loaded
 *   with the HTML defer attribute so it never blocks initial page rendering).
 *   Generated by buildClientJs() in scripts/build.mjs and mirrored to both
 *   /assets/err-client.js and raggiesoft-assets/engine-room-records/js/err-client.js.
 *
 * Four Interactive Features Powered by This Script:
 *   1. Mobile Navigation Drawer: Opens/closes #primary-navigation on narrow screens
 *      and closes cleanly when the visitor presses the Escape key.
 *   2. Light / Dark Mode Toggle: Switches between Light Mode and Dark Mode,
 *      updating meta[name="color-scheme"] and html[data-bs-theme]. Smart cleanup:
 *      if the user toggles back to their operating system's default preference,
 *      it removes the localStorage override so OS auto-switching works again!
 *   3. DSP Verification Ledger Filter (/dsp-verification): Reads ?artist=, ?album=,
 *      and ?track= URL query parameters plus live search input to filter catalog
 *      rows and render official Artist Claim or Single-Track Affidavit cards.
 *   4. Interactive ISRC & ERR Catalog Decoder (/isrc): Parses any 12-character
 *      ISO 3901 ISRC (e.g., QTAHP2600046) or ERR-ID (e.g., ERR-001-2015-101) into
 *      its human-readable segments and cross-checks embedded catalog JSON.
 * ============================================================================
 */
// Wrap everything in an IIFE (Immediately Invoked Function Expression) so helper
// variables and functions stay private instead of polluting window.*.
(function () {
  // --- 1. DOM ELEMENT LOOKUPS FOR HEADER & THEME CONTROLS ---
  var meta = document.querySelector('meta[name="color-scheme"]');
  var toggleBtn = document.getElementById('theme-toggle');
  var toggleLabel = document.getElementById('theme-toggle-label');
  var mobileToggle = document.getElementById('mobile-menu-toggle');
  var primaryNav = document.getElementById('primary-navigation');

  // --- 2. ACCESSIBLE MOBILE HAMBURGER MENU DRAWER ---
  if (mobileToggle && primaryNav) {
    // Toggle the mobile menu open/closed on button click and sync aria-expanded for screen readers.
    mobileToggle.addEventListener('click', function () {
      var expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      primaryNav.classList.toggle('is-open', !expanded);
    });
    // Allow keyboard users to dismiss an open mobile drawer with the Escape key
    // and return keyboard focus directly to the toggle button (WCAG 2.1 AA).
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        mobileToggle.focus();
      }
    });
  }

  // --- 3. TWO-STATE LIGHT / DARK THEME TOGGLE ---
  // Detects whether the visitor's operating system currently prefers Dark Mode.
  function getSystemScheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  // Returns the active theme: checks localStorage first for a manual override,
  // otherwise falls back to the operating system's prefers-color-scheme setting.
  function getRenderedScheme() {
    var stored = null;
    try {
      stored = localStorage.getItem('color-scheme');
    } catch (e) {}
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return getSystemScheme();
  }

  // Synchronizes Bootstrap 5's data-bs-theme attribute on the root html element
  // and updates the visible label inside the header's theme toggle button.
  function updateButtonLabel() {
    var current = getRenderedScheme();
    document.documentElement.setAttribute('data-bs-theme', current);
    if (!toggleLabel) return;
    toggleLabel.textContent = current === 'dark' ? '🌙 Dark' : '☀️ Light';
  }

  if (toggleBtn && meta) {
    // Set initial button text and data-bs-theme attribute on page load.
    updateButtonLabel();
    toggleBtn.addEventListener('click', function () {
      var current = getRenderedScheme();
      var target = current === 'dark' ? 'light' : 'dark';
      var sys = getSystemScheme();
      try {
        // Modern Web Guidance pattern: if the user switches back to whatever their
        // OS already prefers, clear localStorage and restore 'light dark' auto mode!
        if (target === sys) {
          localStorage.removeItem('color-scheme');
          meta.content = 'light dark';
        } else {
          localStorage.setItem('color-scheme', target);
          meta.content = target;
        }
      } catch (e) {
        meta.content = target;
      }
      updateButtonLabel();
    });

    // Keep multiple open browser tabs of engineroom.raggiesoft.com in sync if the
    // user toggles Light/Dark mode in another tab.
    window.addEventListener('storage', function (e) {
      if (e.key === 'color-scheme') {
        meta.content = e.newValue || 'light dark';
        updateButtonLabel();
      }
    });
  }

  // --- 4. DSP VERIFICATION LEDGER INSTANT FILTER & AFFIDAVIT HYDRATION (/dsp-verification) ---
  // Note: On pages other than /dsp-verification, table is null and this block safely skips.
  var searchInput = document.getElementById('dsp-search');
  var table = document.getElementById('dsp-ledger-table');
  var visibleCountEl = document.getElementById('dsp-visible-count');
  var resetBtn = document.getElementById('dsp-reset-filter-btn');
  var artistClaimSection = document.getElementById('dsp-artist-claim-section');
  var artistClaimTitle = document.getElementById('dsp-artist-claim-title');
  var artistClaimBody = document.getElementById('dsp-artist-claim-body');
  var trackAffidavitSection = document.getElementById('dsp-track-affidavit-section');
  var trackAffidavitTitle = document.getElementById('dsp-affidavit-track-title');
  var trackAffidavitSubtitle = document.getElementById('dsp-affidavit-subtitle');
  var trackAffidavitDetails = document.getElementById('dsp-affidavit-details');

  // Maps shorthand or legacy band aliases in URL query strings (like ?artist=mirage
  // or ?artist=winter-palace) to their canonical catalog artistSlug.
  function normalizeArtistSlug(slug) {
    var s = String(slug || '').trim().toLowerCase();
    if (s === 'stardust-engine' || s === 'thestardustengine') return 'the-stardust-engine';
    if (s === 'fracturedprisms') return 'fractured-prisms';
    if (s === 'paper-wall' || s === 'mirage' || s === 'thepaperwall') return 'the-paper-wall';
    if (s === 'arctic-symphony-project' || s === 'winter-palace' || s === 'the-winter-palace') return 'the-arctic-symphony-project';
    if (s === 'crimsonnode') return 'crimson-node';
    if (s === 'manacanvas') return 'mana-canvas';
    if (s === 'hoshizora-ensemble' || s === 'hoshizora' || s === 'thehoshizoraensemble') return 'the-hoshizora-ensemble';
    return s;
  }

  var ARTIST_NAMES = {
    'the-stardust-engine': 'The Stardust Engine',
    'fractured-prisms': 'Fractured Prisms',
    'the-paper-wall': 'The Paper Wall',
    'the-arctic-symphony-project': 'The Arctic Symphony Project',
    'crimson-node': 'Crimson Node',
    'mana-canvas': 'Mana Canvas',
    'the-hoshizora-ensemble': 'The Hoshizora Ensemble',
    'firelight': 'Firelight'
  };

  if (table) {
    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
    var params = new URLSearchParams(window.location.search);
    var rawArtist = params.get('artist') || '';
    var normArtist = normalizeArtistSlug(rawArtist);
    var paramAlbum = (params.get('album') || '').trim().toLowerCase();
    var paramTrack = (params.get('track') || '').trim().toLowerCase();

    if (rawArtist || paramAlbum || paramTrack) {
      if (resetBtn) resetBtn.style.display = 'inline-flex';
    }

    // Populate Artist / Album Direct Claim Banner if ?artist= or ?album= is provided
    if ((normArtist || paramAlbum) && artistClaimSection && artistClaimTitle && artistClaimBody) {
      var matchedAlbumRow = null;
      for (var j = 0; j < rows.length; j++) {
        var rowItem = rows[j];
        var rowArtist = (rowItem.getAttribute('data-artist') || '').toLowerCase();
        var rowAlbum = (rowItem.getAttribute('data-album') || '').toLowerCase();
        if ((!normArtist || rowArtist === normArtist) && (!paramAlbum || rowAlbum === paramAlbum)) {
          matchedAlbumRow = rowItem;
          break;
        }
      }
      var displayArtist =
        (matchedAlbumRow && matchedAlbumRow.getAttribute('data-artist-name')) ||
        ARTIST_NAMES[normArtist] ||
        rawArtist ||
        'Engine Room Records Artist';
      var displayAlbum =
        paramAlbum && matchedAlbumRow ? matchedAlbumRow.getAttribute('data-album-title') || '' : '';
      var displayUpc =
        paramAlbum && matchedAlbumRow ? matchedAlbumRow.getAttribute('data-upc') || '' : '';

      artistClaimTitle.textContent = displayAlbum
        ? 'Direct Release & Artist Claim Verification: ' + displayArtist + ' — ' + displayAlbum
        : 'Direct Artist Profile Claim Verification: ' + displayArtist;
      artistClaimBody.innerHTML =
        '<strong>Notice to Platform Verification Teams (DistroKid, Apple Music for Artists, Spotify for Artists, Amazon Music for Artists, YouTube Music):</strong> ' +
        'You have been routed to this official Engine Room Records verification ledger via an authenticated domain or claim link for <strong>' +
        displayArtist +
        (displayAlbum ? ' — <em>' + displayAlbum + '</em>' + (displayUpc ? ' (UPC: <code>' + displayUpc + '</code>)' : '') : '') +
        '</strong>. This confirms that <strong>Michael P. Ragsdale</strong> (<code>dsp.operations@engineroom-records.com</code>) is the sole human creator, songwriter, producer, and 100% legal rights holder authorized to claim, distribute, and administer the official artist profile and catalog for <strong>' +
        displayArtist +
        '</strong> via DistroKid across all DSPs.';
      artistClaimSection.style.display = 'block';
    }

    // Populate Single-Track Affidavit if ?track= matches a row
    if (paramTrack && trackAffidavitSection && trackAffidavitTitle && trackAffidavitSubtitle && trackAffidavitDetails) {
      var matchedRow = null;
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var rTrack = (r.getAttribute('data-track') || '').toLowerCase();
        var rAlbum = (r.getAttribute('data-album') || '').toLowerCase();
        var rArtist = (r.getAttribute('data-artist') || '').toLowerCase();
        if (rTrack === paramTrack && (!paramAlbum || rAlbum === paramAlbum) && (!normArtist || rArtist === normArtist)) {
          matchedRow = r;
          break;
        }
      }
      if (matchedRow) {
        var tTitle = matchedRow.getAttribute('data-track-title') || '';
        var aName = matchedRow.getAttribute('data-artist-name') || '';
        var alTitle = matchedRow.getAttribute('data-album-title') || '';
        var errId = matchedRow.getAttribute('data-err-id') || '';
        var isrc = matchedRow.getAttribute('data-isrc') || '';
        var upc = matchedRow.getAttribute('data-upc') || '';
        var dist = matchedRow.getAttribute('data-distributor') || '';
        var clr = matchedRow.getAttribute('data-clearance') || '';
        var rel = matchedRow.getAttribute('data-release-date') || '';

        trackAffidavitTitle.textContent = 'Verified Recording: "' + tTitle + '" — ' + aName;
        trackAffidavitSubtitle.textContent = 'Album: ' + alTitle + ' • Catalog ID: ' + errId + ' • ISRC: ' + isrc;
        trackAffidavitDetails.innerHTML =
          '<div class="card" style="padding: 0.9rem;">' +
          '<div><strong>ISRC Code:</strong> <code>' + isrc + '</code></div>' +
          '<div><strong>Release UPC:</strong> <code>' + upc + '</code></div>' +
          '<div><strong>Catalog ID:</strong> <code>' + errId + '</code></div>' +
          '<div><strong>Release Date:</strong> ' + rel + '</div>' +
          '</div>' +
          '<div class="card" style="padding: 0.9rem;">' +
          '<div><strong>Legal Owner:</strong> Michael P. Ragsdale (<code>dsp.operations@engineroom-records.com</code>)</div>' +
          '<div><strong>US ISRC Agency Prefix:</strong> <code>QTAHP</code> (Registrant ID <code>185611</code>)</div>' +
          '<div><strong>Artist Persona:</strong> ' + aName + ' (Fictitious Project)</div>' +
          '<div><strong>Aggregator:</strong> ' + dist + '</div>' +
          '<div><strong>Commercial AI Clearance:</strong> ' + clr + '</div>' +
          '</div>';
        trackAffidavitSection.style.display = 'block';
      }
    }

    function filterByParamsAndSearch(q) {
      var needle = String(q || '').trim().toLowerCase();
      var shown = 0;
      rows.forEach(function (row) {
        var rArtist = (row.getAttribute('data-artist') || '').toLowerCase();
        var rAlbum = (row.getAttribute('data-album') || '').toLowerCase();
        var rTrack = (row.getAttribute('data-track') || '').toLowerCase();

        // If URL params are active and user hasn't typed a custom override, filter by URL params
        if (!needle && (normArtist || paramAlbum || paramTrack)) {
          var matchArtist = !normArtist || rArtist === normArtist;
          var matchAlbum = !paramAlbum || rAlbum === paramAlbum;
          var matchTrack = !paramTrack || rTrack === paramTrack;
          var ok = matchArtist && matchAlbum && matchTrack;
          row.style.display = ok ? '' : 'none';
          if (ok) shown++;
          return;
        }

        if (!needle) {
          row.style.display = '';
          shown++;
          return;
        }
        var text = (row.textContent || '').toLowerCase();
        var attrs = [rArtist, rAlbum, rTrack, row.getAttribute('data-isrc') || '', row.getAttribute('data-upc') || ''].join(' ').toLowerCase();
        var match = text.indexOf(needle) !== -1 || attrs.indexOf(needle) !== -1;
        row.style.display = match ? '' : 'none';
        if (match) shown++;
      });
      if (visibleCountEl) visibleCountEl.textContent = String(shown);
    }

    if (searchInput && (paramTrack || paramAlbum || normArtist)) {
      searchInput.placeholder = 'Filtered by URL (' + (paramTrack || paramAlbum || normArtist) + ') — type here to search all tracks...';
    }
    filterByParamsAndSearch('');

    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        filterByParamsAndSearch(e.target.value);
      });
    }
  }

  // --- 5. INTERACTIVE ISRC & ERR CATALOG ID DECODER (/isrc) ---
  // Reads the embedded JSON catalog script tag (#err-isrc-catalog-data) on /isrc
  // and decodes any 12-char ISO 3901 ISRC or ERR-XXX-YYYY-ZZZ catalog number live.
  var decoderInput = document.getElementById('isrc-decoder-input');
  var decoderBtn = document.getElementById('isrc-decoder-btn');
  var decoderResult = document.getElementById('isrc-decoder-result');
  var catalogDataEl = document.getElementById('err-isrc-catalog-data');

  if (decoderInput && decoderResult && catalogDataEl) {
    // Parse the pre-rendered JSON array of tracks embedded in the /isrc HTML page.
    var catalogList = [];
    try {
      catalogList = JSON.parse(catalogDataEl.textContent || '[]');
    } catch (e) {
      catalogList = [];
    }

    // Lookup dictionary mapping the 3-digit ERR roster number to its artist & genre description.
    var ROSTER_MAP = {
      '001': 'The Stardust Engine (Rock Opera / Progressive Synth-Rock)',
      '002': 'Fractured Prisms (Industrial / Melodic Post-Hardcore)',
      '003': 'The Paper Wall (Alternative / Indie Rock)',
      '004': 'Firelight (Acoustic / Heartland Folk-Rock)',
      '005': 'The Arctic Symphony Project (Cinematic Symphonic Metal)',
      '006': 'Crimson Node (Cyberpunk Synthwave / Darksynth)',
      '007': 'Mana Canvas (Runebreaker Fantasy Orchestral / Chiptune)',
      '008': 'The Hoshizora Ensemble (1970s Japanese City Pop / Jazz Fusion)'
    };

    // Client-side HTML entity escaper preventing XSS when injecting user queries into innerHTML.
    function esc(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // Core decoder routine: accepts an ISRC or ERR-ID string, resolves catalog matches
    // (including sibling compilation entries sharing the same ISRC), and renders result cards.
    function runDecoder(rawQuery, shouldScroll) {
      var clean = String(rawQuery || '').trim().toUpperCase();
      if (!clean) {
        decoderResult.innerHTML = '';
        return;
      }

      // Normalize hyphenated ISRCs like QT-AHP-26-00046 if someone pastes with hyphens
      var normalizedIsrcCandidate = clean.indexOf('ERR-') === 0 ? '' : clean.replace(/[^A-Z0-9]/g, '');

      // Look up matching tracks in master-catalog.json
      var matches = [];
      for (var i = 0; i < catalogList.length; i++) {
        var item = catalogList[i];
        var itemIsrc = String(item.isrc || '').toUpperCase();
        var itemErr = String(item.err_id || '').toUpperCase();
        if (
          (normalizedIsrcCandidate && itemIsrc === normalizedIsrcCandidate) ||
          itemErr === clean ||
          itemIsrc === clean
        ) {
          matches.push(item);
        }
      }

      // If matched by ERR-ID, also pull in any sibling release sharing the same ISRC
      var resolvedIsrc = matches.length > 0 ? String(matches[0].isrc || '').toUpperCase() : normalizedIsrcCandidate;
      var resolvedErr = matches.length > 0 ? String(matches[0].err_id || '').toUpperCase() : (clean.indexOf('ERR-') === 0 ? clean : '');

      if (resolvedIsrc && matches.length === 1) {
        for (var k = 0; k < catalogList.length; k++) {
          var sibling = catalogList[k];
          if (
            String(sibling.isrc || '').toUpperCase() === resolvedIsrc &&
            String(sibling.err_id || '').toUpperCase() !== String(matches[0].err_id || '').toUpperCase()
          ) {
            matches.push(sibling);
          }
        }
      }

      var htmlParts = [];

      // 1. Render ISO 3901:2019 12-Character ISRC Anatomy if we have a 12-char alphanumeric code
      if (resolvedIsrc && /^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/.test(resolvedIsrc)) {
        var ctry = resolvedIsrc.slice(0, 2);
        var reg = resolvedIsrc.slice(2, 5);
        var yr = resolvedIsrc.slice(5, 7);
        var desig = resolvedIsrc.slice(7, 12);
        var isQtahp = resolvedIsrc.indexOf('QTAHP') === 0;

        var ctryDesc =
          ctry === 'QT' || ctry === 'QZ' || ctry === 'QM' || ctry === 'US'
            ? 'United States (US ISRC Agency / IFPI ISO 3901 Namespace)'
            : 'International ISRC Agency Country Prefix (' + esc(ctry) + ')';

        var regDesc = isQtahp
          ? '<strong>Michael Ragsdale / Engine Room Records</strong> (Official US ISRC Agency Registrant #185611 • Direct First-Party Allocation)'
          : '<strong>Preserved Distributor Block (<code>' +
            esc(reg) +
            '</code>)</strong> — Allocated via DistroKid prior to Oct 20, 2026 &amp; permanently retained under the ISO 3901 Single-ISRC Rule';

        htmlParts.push(
          '<div class="card card-accent-primary" style="margin-bottom: 0.9rem; padding: 1.1rem;">' +
            '<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">' +
              '<span class="badge">' +
                (isQtahp ? '✓ Official First-Party QTAHP ISRC (Registrant #185611)' : '✓ Preserved Legacy Distributor ISRC (Single-ISRC Rule)') +
              '</span>' +
              '<div style="font-family: monospace; font-size: 1.35rem; font-weight: 800; letter-spacing: 0.08em;">' +
                '<span style="color: var(--accent-primary);">' + esc(ctry) + '</span>' +
                '<span style="color: var(--accent-amber);">' + esc(reg) + '</span>' +
                '<span style="color: var(--accent-emerald);">' + esc(yr) + '</span>' +
                '<span>' + esc(desig) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="grid-2" style="font-size: 0.85rem; gap: 0.65rem;">' +
              '<div><strong>1. Country (<code>' + esc(ctry) + '</code>):</strong> ' + ctryDesc + '</div>' +
              '<div><strong>2. Registrant (<code>' + esc(reg) + '</code>):</strong> ' + regDesc + '</div>' +
              '<div><strong>3. Reference Year (<code>' + esc(yr) + '</code>):</strong> 20' + esc(yr) + ' Real-World Production &amp; Allocation Year</div>' +
              '<div><strong>4. Designation (<code>' + esc(desig) + '</code>):</strong> Unique 5-Digit Master Recording Serial (#' + parseInt(desig, 10) + ')</div>' +
            '</div>' +
          '</div>'
        );
      }

      // 2. Render ERR Catalog Number Anatomy if we have an ERR-XXX-YYYY-ZZZ code
      if (resolvedErr && /^ERR-[0-9]{3}-[0-9]{4}-[0-9]{3}$/.test(resolvedErr)) {
        var parts = resolvedErr.split('-');
        var rosterNum = parts[1];
        var eraYr = parts[2];
        var discTrack = parts[3];
        var discNum = discTrack.slice(0, 1);
        var trackNum = discTrack.slice(1);
        var rosterLabel = ROSTER_MAP[rosterNum] || 'Engine Room Records Roster Artist (#' + esc(rosterNum) + ')';

        htmlParts.push(
          '<div class="card card-accent-emerald" style="margin-bottom: 0.9rem; padding: 1.1rem;">' +
            '<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.65rem;">' +
              '<span class="badge">Shared Real-World &amp; In-Universe Catalog Number</span>' +
              '<code style="font-size: 1.15rem; font-weight: 800; color: var(--accent-emerald);">' + esc(resolvedErr) + '</code>' +
            '</div>' +
            '<div class="grid-2" style="font-size: 0.85rem; gap: 0.65rem;">' +
              '<div><strong>Imprint Prefix (<code>ERR</code>):</strong> Real-World <strong>Engine Room Records</strong> (Michael P. Ragsdale) &amp; In-Universe <em>Engine Room Records, LLC</em> (Holly O&rsquo;Connell)</div>' +
              '<div><strong>Artist Roster (<code>ERR-' + esc(rosterNum) + '</code>):</strong> ' + esc(rosterLabel) + '</div>' +
              '<div><strong>Canonical Era Year (<code>' + esc(eraYr) + '</code>):</strong> ' + esc(eraYr) + ' Album Narrative / Release Era</div>' +
              '<div><strong>Disc &amp; Track (<code>' + esc(discTrack) + '</code>):</strong> Disc ' + esc(discNum) + ', Track ' + esc(trackNum) + '</div>' +
            '</div>' +
          '</div>'
        );
      }

      // 3. Render Matched Catalog Recording Card(s)
      if (matches.length > 0) {
        var cardsHtml = matches
          .map(function (m) {
            var cleanSongSlug = String(m.trackSlug || '')
              .toLowerCase()
              .replace(/\.mp3$/i, '')
              .replace(/^\d+-\d+-/, '')
              .replace(/^\d+-/, '');
            var listenHref =
              'https://music.raggiesoft.com/' +
              encodeURIComponent(m.artistSlug) +
              '/' +
              encodeURIComponent(m.albumSlug) +
              '/' +
              encodeURIComponent(cleanSongSlug);
            var affidavitHref =
              '/dsp-verification?artist=' +
              encodeURIComponent(m.artistSlug) +
              '&album=' +
              encodeURIComponent(m.albumSlug) +
              '&track=' +
              encodeURIComponent(m.trackSlug);

            return (
              '<div class="card" style="padding: 1rem; margin-top: 0.65rem;">' +
                '<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 0.75rem;">' +
                  '<div>' +
                    '<div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 0.2rem;">' +
                      '<strong>' + esc(m.artist) + '</strong> &bull; <em>' + esc(m.album) + '</em>' +
                    '</div>' +
                    '<h3 style="font-size: 1.15rem; margin: 0 0 0.45rem;">' + esc(m.title) + '</h3>' +
                    '<div style="font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 0.75rem;">' +
                      '<span><strong>ISRC:</strong> <code>' + esc(m.isrc) + '</code></span>' +
                      '<span><strong>ERR-ID:</strong> <code>' + esc(m.err_id) + '</code></span>' +
                      (m.upc ? '<span><strong>UPC:</strong> <code>' + esc(m.upc) + '</code></span>' : '') +
                      '<span><strong>Real-World Release:</strong> ' + esc(m.date) + '</span>' +
                      '<span><strong>Rights Holder:</strong> Michael P. Ragsdale (Engine Room Records)</span>' +
                    '</div>' +
                  '</div>' +
                  '<div class="btn-row no-print" style="margin: 0;">' +
                    '<a href="' + esc(listenHref) + '" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.82rem;" target="_blank" rel="noopener noreferrer">🎧 Stream in The Listening Room ↗</a>' +
                    '<a href="' + esc(affidavitHref) + '" class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.82rem;">📄 View DSP Affidavit →</a>' +
                  '</div>' +
                '</div>' +
              '</div>'
            );
          })
          .join('');

        htmlParts.push(
          '<div>' +
            '<div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-emerald); text-transform: uppercase; letter-spacing: 0.05em;">' +
              '✓ Verified in Master Catalog (' + matches.length + (matches.length === 1 ? ' Release Entry' : ' Linked Release Entries under Permanent Single-ISRC Rule') + ')' +
            '</div>' +
            cardsHtml +
          '</div>'
        );
      } else {
        htmlParts.push(
          '<div class="card" style="padding: 1rem;">' +
            '<strong>No exact catalog match found for <code>' + esc(clean) + '</code> in the current ' + catalogList.length + '-track ledger.</strong> ' +
            '<span style="color: var(--text-secondary); font-size: 0.88rem;">If this is a newly minted <code>QTAHP</code> designation reserved for an upcoming master, its ISO 3901 segment breakdown is shown above. You can also search by title or album on the <a href="/dsp-verification">DSP Verification Ledger</a>.</span>' +
          '</div>'
        );
      }

      decoderResult.innerHTML = htmlParts.join('');

      if (shouldScroll) {
        var sec = document.getElementById('isrc-decoder-section');
        if (sec && sec.scrollIntoView) {
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    // Check if the visitor arrived via a deep link like /isrc?code=QTAHP2600046
    // (used when clicking ISRC badges in The Listening Room or /dsp-verification).
    var urlParams = new URLSearchParams(window.location.search);
    var initialParam = urlParams.get('code') || urlParams.get('isrc') || urlParams.get('err') || '';
    if (initialParam) {
      decoderInput.value = initialParam.trim().toUpperCase();
      runDecoder(decoderInput.value, true);
    } else {
      runDecoder(decoderInput.value || 'QTAHP2600046', false);
    }

    // Re-decode live on every keystroke in the search box.
    decoderInput.addEventListener('input', function (e) {
      runDecoder(e.target.value, false);
    });

    // Also support clicking the explicit "Decode Identifier" button.
    if (decoderBtn) {
      decoderBtn.addEventListener('click', function () {
        runDecoder(decoderInput.value, false);
      });
    }

    // Event delegation: listen once on document for clicks on any sample chip or
    // table code link carrying data-decode-code="...", update the URL bar cleanly
    // via history.replaceState without reloading the page, and scroll to the decoder!
    document.addEventListener('click', function (e) {
      var trigger = e.target && e.target.closest ? e.target.closest('[data-decode-code]') : null;
      if (trigger) {
        e.preventDefault();
        var targetCode = trigger.getAttribute('data-decode-code') || '';
        if (targetCode) {
          decoderInput.value = targetCode;
          try {
            window.history.replaceState(null, '', '/isrc?code=' + encodeURIComponent(targetCode));
          } catch (err) {}
          runDecoder(targetCode, true);
        }
      }
    });
  }
})();
`;
}

/**
 * Groups all 73 archival routes from `src/data/ported-pages.json` into four thematic
 * categories and renders a 3-column directory grid appended to `/corporate` and `/artists`.
 *
 * @param {Array<Object>} portedPages - Array of `{ route, title, description, html }` dossiers.
 * @returns {string} HTML `<section>` markup listing all ported archival dossiers.
 */
function renderEngineRoomMasterArchiveIndex(portedPages) {
  const groups = [
    {
      title: "The O'Connell Family Revocable Trust, Corporate Governance & Jessica Miller Center",
      filter: (p) =>
        p.route.startsWith('/oconnell-trust') ||
        p.route.startsWith('/jessica-miller-center') ||
        p.route === '/about' ||
        p.route === '/history' ||
        p.route === '/assets' ||
        (p.route.startsWith('/corporate') &&
          !p.route.startsWith('/corporate/stardust-blacksburg') &&
          !p.route.startsWith('/corporate/strategic-assets'))
    },
    {
      title: 'Stardust Blacksburg, LLC & Stardust Strategic Assets, LLC (Property & Studio Vaults)',
      filter: (p) =>
        p.route.startsWith('/corporate/stardust-blacksburg') ||
        p.route.startsWith('/corporate/strategic-assets')
    },
    {
      title: 'Fractured Prisms, The Paper Wall (Mirage) & The Arctic Symphony Project (Winter Palace)',
      filter: (p) =>
        p.route.startsWith('/artists/fractured-prisms') ||
        p.route.startsWith('/artists/mirage') ||
        p.route.startsWith('/artists/the-paper-wall') ||
        p.route.startsWith('/artists/the-arctic-symphony-project') ||
        p.route.startsWith('/artists/the-winter-palace')
    },
    {
      title: 'Crimson Node — Miller/Pelletier Family, Northwood High & Piedmont Character Dossiers',
      filter: (p) => p.route.startsWith('/artists/crimson-node')
    }
  ];

  return `
    <section class="section-block mt-5 pt-4 border-top border-secondary-subtle" aria-labelledby="err-master-dossier-heading">
      <div class="section-header">
        <span class="eyebrow">Complete Archival Dossier Directory • 73 Ported Routes</span>
        <h2 id="err-master-dossier-heading">All Corporate Entities, Real Estate Holdings &amp; Artist Character Dossiers</h2>
        <p style="margin: 0; color: var(--text-secondary);">
          Every single corporate charter, Stardust Blacksburg tenant policy, Strategic Assets blueprint, Jessica Miller Center specification, and band character profile ported 1:1.
        </p>
      </div>
      ${groups
        .map((g) => {
          const items = portedPages.filter(g.filter);
          return `
            <div class="mb-4">
              <h3 class="h5 mb-3" style="color: var(--accent-amber);">${escapeHtml(g.title)} (${items.length})</h3>
              <div class="grid-3">
                ${items
                  .map(
                    (item) => `
                  <article class="card card-accent-cobalt">
                    <div>
                      <div class="badge-row">
                        <span class="badge">${escapeHtml(item.route)}</span>
                      </div>
                      <h4 class="h6 fw-bold mb-2"><a href="${item.route}" style="text-decoration: none; color: var(--text-primary);">${escapeHtml(item.title)}</a></h4>
                      <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 0.85rem;">${escapeHtml(item.description)}</p>
                    </div>
                    <div>
                      <a href="${item.route}" class="btn btn-primary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">Open Dossier →</a>
                    </div>
                  </article>`
                  )
                  .join('\n')}
              </div>
            </div>`;
        })
        .join('\n')}
    </section>`;
}

/**
 * Orchestrates the end-to-end static site build:
 *   Step 0: Resolve and parse all flat-file JSON manifests (`catalog.json`,
 *           `corporate-structure.json`, `master-catalog.json`, `ported-pages.json`).
 *   Step 1: Wipe `./dist` clean, emit CSS/JS assets to `./dist/assets/`, and mirror
 *           those exact CSS/JS files 1:1 into `raggiesoft-assets/engine-room-records/`.
 *   Step 2: Render core hub, engineering, corporate, roster, licensing, DSP, ISRC,
 *           terms, and privacy routes.
 *   Step 3: Render individual `/artists/<slug>` dossiers (merging structured lore +
 *           discography + any ported archival sub-pages) plus the `/artists/stardust-engine` alias.
 *   Step 4: Render all remaining ported routes from `ported-pages.json` (preserving
 *           colliding legacy overviews at `/.../overview` with `noindex: true`).
 *   Step 5: Emit `/404.html`, `/sitemap.xml`, `/robots.txt`, and IndexNow verification key.
 */
function buildSite() {
  // Locate the shared `raggiesoft-assets/engine-room-records` folder and construct manifest paths.
  const assetsDir = resolveEngineRoomAssetsDir();
  const catalogPath = path.join(assetsDir, 'catalog.json');
  const corpPath = path.join(assetsDir, 'json', 'corporate-structure.json');
  const masterCatalogPath = path.join(assetsDir, 'json', 'master-catalog.json');
  const portedPagesPath = path.join(projectRoot, 'src', 'data', 'ported-pages.json');

  // Parse each JSON file into memory with safe empty fallbacks if a file is absent.
  const catalog = fs.existsSync(catalogPath)
    ? JSON.parse(fs.readFileSync(catalogPath, 'utf-8'))
    : [];
  const corporateStructure = fs.existsSync(corpPath)
    ? JSON.parse(fs.readFileSync(corpPath, 'utf-8'))
    : { title: "The O'Connell Family Revocable Trust", children: [] };
  const masterCatalog = fs.existsSync(masterCatalogPath)
    ? JSON.parse(fs.readFileSync(masterCatalogPath, 'utf-8'))
    : { artists: [] };
  const portedPages = fs.existsSync(portedPagesPath)
    ? JSON.parse(fs.readFileSync(portedPagesPath, 'utf-8'))
    : [];

  // Index `portedPages` by `route` in a `Map` for fast O(1) lookup when merging artist dossiers.
  const portedByRoute = new Map(portedPages.map((p) => [p.route, p]));
  const masterIndexHtml = renderEngineRoomMasterArchiveIndex(portedPages);

  // Clean and recreate `./dist` from scratch so stale files from old builds never linger.
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  // Step 1: Copy `err-main.css` and write `err-client.js` + `master-catalog.json`
  // to `./dist`, AND mirror `err-main.css` + `err-client.js` 1:1 into `raggiesoft-assets`
  // so the shared `https://assets.raggiesoft.com/engine-room-records/` CDN stays 100% synced!
  const cssContent = fs.readFileSync(path.join(projectRoot, 'src', 'styles', 'err-main.css'), 'utf-8');
  const clientJsContent = buildClientJs();
  writeDistFile('assets/err-main.css', cssContent);
  writeDistFile('assets/err-client.js', clientJsContent);
  const sharedCdnCssDir = path.join(assetsDir, 'css');
  const sharedCdnJsDir = path.join(assetsDir, 'js');
  fs.mkdirSync(sharedCdnCssDir, { recursive: true });
  fs.mkdirSync(sharedCdnJsDir, { recursive: true });
  fs.writeFileSync(path.join(sharedCdnCssDir, 'err-main.css'), cssContent, 'utf-8');
  fs.writeFileSync(path.join(sharedCdnJsDir, 'err-client.js'), clientJsContent, 'utf-8');
  writeDistFile('data/master-catalog.json', JSON.stringify(masterCatalog, null, 2));

  // Step 2: Render core pages (injecting the 73-dossier Master Archive Index right before
  // the closing `</main>` tag on `/corporate` and `/artists`).
  writeDistFile('index.html', renderHomePage(catalog));
  writeDistFile('studio-engineering/index.html', renderStudioEngineeringPage());
  writeDistFile(
    'corporate/index.html',
    renderCorporatePage(corporateStructure).replace('</main>', `${masterIndexHtml}\n    </main>`)
  );
  writeDistFile(
    'artists/index.html',
    renderArtistsIndexPage(catalog).replace('</main>', `${masterIndexHtml}\n    </main>`)
  );
  writeDistFile('commercial-licensing/index.html', renderCommercialLicensingPage());
  writeDistFile('dsp-verification/index.html', renderDspVerificationPage(masterCatalog));
  writeDistFile('isrc/index.html', renderIsrcExplainerPage(masterCatalog));
  writeDistFile('terms/index.html', renderTermsPage());
  writeDistFile('privacy/index.html', renderPrivacyPage());

  // Step 3: Track all primary routes in a `Set` (which automatically prevents duplicate entries)
  // and compile every artist dossier route in `ARTIST_LORE_PROFILES`.
  const customRenderedRoutes = new Set([
    '/',
    '/studio-engineering',
    '/corporate',
    '/artists',
    '/commercial-licensing',
    '/dsp-verification',
    '/isrc',
    '/terms',
    '/privacy'
  ]);

  for (const slug of Object.keys(ARTIST_LORE_PROFILES)) {
    const route = `/artists/${slug}`;
    customRenderedRoutes.add(route);
    let html = renderArtistDetailPage(slug, catalog);
    const ported = portedByRoute.get(route);
    if (ported) {
      const subPages = portedPages.filter((p) => p.route.startsWith(`${route}/`));
      const subLinksHtml =
        subPages.length > 0
          ? `<section class="section-block mt-4 pt-4 border-top border-secondary-subtle">
               <span class="eyebrow">Deep Band Dossiers (${subPages.length})</span>
               <h2>Explore All ${escapeHtml(ARTIST_LORE_PROFILES[slug].name)} Sub-Pages</h2>
               <div class="grid-3">
                 ${subPages
                   .map(
                     (sp) => `
                   <article class="card card-accent-amber">
                     <div>
                       <span class="badge mb-2">${escapeHtml(sp.route)}</span>
                       <h3 class="h6 fw-bold"><a href="${sp.route}" style="text-decoration: none; color: var(--text-primary);">${escapeHtml(sp.title)}</a></h3>
                       <p style="font-size: 0.83rem; color: var(--text-secondary);">${escapeHtml(sp.description)}</p>
                     </div>
                     <div><a href="${sp.route}" class="btn btn-primary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">Open Dossier →</a></div>
                   </article>`
                   )
                   .join('\n')}
               </div>
             </section>`
          : '';
      const archivalSection = `
        ${subLinksHtml}
        <section class="section-block mt-4 pt-4 border-top border-secondary-subtle">
          <span class="eyebrow">Original Archival Dossier</span>
          ${ported.html}
        </section>`;
      html = html.replace('</main>', `${archivalSection}\n    </main>`);
    }
    writeDistFile(`artists/${slug}/index.html`, html);
  }
  // Also emit `/artists/stardust-engine/index.html` alias for legacy path resilience
  writeDistFile(
    'artists/stardust-engine/index.html',
    renderArtistDetailPage('the-stardust-engine', catalog)
  );

  // 4. Render all remaining ported routes from src/data/ported-pages.json
  const canonicalSitemapRoutes = new Set(customRenderedRoutes);
  let portedCount = 0;
  for (const page of portedPages) {
    if (customRenderedRoutes.has(page.route)) {
      const altRoute = page.route === '/' ? '/archive-overview' : `${page.route}/overview`;
      writeDistFile(
        `${altRoute.slice(1)}/index.html`,
        renderDocumentShell({
          title: page.title,
          description: page.description,
          canonicalPath: page.route,
          ogImage: page.ogImage || undefined,
          noindex: true,
          bodyHtml: page.html
        })
      );
      portedCount++;
      continue;
    }

    canonicalSitemapRoutes.add(page.route);
    const relFile = `${page.route.slice(1)}/index.html`;
    writeDistFile(
      relFile,
      renderDocumentShell({
        title: page.title,
        description: page.description,
        canonicalPath: page.route,
        ogImage: page.ogImage || undefined,
        bodyHtml: page.html
      })
    );
    portedCount++;
  }

  // 5. Emit accessible consumer-friendly /404.html, robots.txt, sitemap.xml, and IndexNow key
  writeDistFile(
    '404.html',
    renderDocumentShell({
      title: 'Page Not Found | Engine Room Records',
      description: 'The requested dossier or catalog page could not be found on Engine Room Records.',
      canonicalPath: '/404',
      noindex: true,
      bodyHtml: `
        <section class="hero-card" aria-labelledby="err-404-heading" style="margin-top: 1.5rem;">
          <span class="eyebrow">Engine Room Records • Page Not Found</span>
          <h1 id="err-404-heading">We Could Not Find That Page</h1>
          <p class="lead">
            The artist dossier, studio record, or catalog link you followed may have moved to a new home across the Engine Room Records archive or <a href="https://music.raggiesoft.com">The Listening Room</a>.
          </p>
          <div class="btn-row">
            <a href="/" class="btn btn-primary">⚙️ Engine Room Records Home</a>
            <a href="/artists" class="btn btn-amber">🎸 Browse All 7 Artists</a>
            <a href="https://music.raggiesoft.com" class="btn btn-emerald">🎧 Stream Music &amp; Lyrics</a>
            <a href="https://books.raggiesoft.com" class="btn">📚 Explore Companion Books</a>
          </div>
        </section>`
    })
  );

  const todayIso = new Date().toISOString().split('T')[0];
  const sortedRoutes = Array.from(canonicalSitemapRoutes).sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sortedRoutes
    .map((route) => {
      const loc = `https://engineroom.raggiesoft.com${route === '/' ? '/' : route}`;
      return `  <url>\n    <loc>${escapeHtml(loc)}</loc>\n    <lastmod>${todayIso}</lastmod>\n  </url>`;
    })
    .join('\n')}\n</urlset>\n`;
  writeDistFile('sitemap.xml', sitemapXml);
  writeDistFile(
    'robots.txt',
    `User-agent: *\nAllow: /\n\nSitemap: https://engineroom.raggiesoft.com/sitemap.xml\n`
  );
  writeDistFile('726167676965736f6674696e6465786e.txt', '726167676965736f6674696e6465786e\n');

  console.log(
    `✅ Built engineroom.raggiesoft.com static bundle in ${distDir} (${Object.keys(ARTIST_LORE_PROFILES).length} artist hubs, ${catalog.length} albums, ${portedCount} ported corporate/artist dossiers, and ${sortedRoutes.length} sitemap URLs compiled).`
  );
}

// Execute the static site build immediately when `node scripts/build.mjs` runs.
buildSite();

// Optional zero-dependency local HTTP preview server (`npm run preview` -> `node scripts/build.mjs --serve`).
// Resolves clean extensionless directory URLs (like `/corporate` -> `./dist/corporate/index.html`)
// and serves `.html`, `.css`, `.js`, and `.json` files with accurate `Content-Type` MIME headers.
if (process.argv.includes('--serve')) {
  const port = Number(process.env.PORT || 4321);
  const server = http.createServer((req, res) => {
    const urlPath = (req.url || '/').split('?')[0];
    let filePath = path.join(distDir, urlPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!path.extname(filePath) && fs.existsSync(`${filePath}/index.html`)) {
      filePath = `${filePath}/index.html`;
    }
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath);
    const mime =
      ext === '.css'
        ? 'text/css; charset=utf-8'
        : ext === '.js'
          ? 'application/javascript; charset=utf-8'
          : ext === '.json'
            ? 'application/json; charset=utf-8'
            : 'text/html; charset=utf-8';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(fs.readFileSync(filePath));
  });
  server.listen(port, () => {
    console.log(`🚀 Preview server running at http://localhost:${port}`);
  });
}

