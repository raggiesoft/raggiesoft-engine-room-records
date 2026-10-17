/**
 * @license MIT
 * ============================================================================
 * scripts/build.mjs — Engine Room Records (engineroom.raggiesoft.com)
 * ============================================================================
 * Architectural Overview:
 * Static Site Generation (SSG) compiler for `engineroom.raggiesoft.com`.
 * Reads the canonical flat-file JSON manifests in `raggiesoft-assets`:
 * - `raggiesoft-assets/engine-room-records/catalog.json`
 * - `raggiesoft-assets/engine-room-records/json/corporate-structure.json`
 * - `raggiesoft-assets/engine-room-records/json/master-catalog.json`
 *
 * Emits 100% static, zero-database HTML routes and client assets to `./dist`:
 * - `/index.html`
 * - `/studio-engineering/index.html`
 * - `/corporate/index.html`
 * - `/artists/index.html`
 * - `/artists/<slug>/index.html` (all 7 bands + `/artists/stardust-engine` alias)
 * - `/commercial-licensing/index.html`
 * - `/dsp-verification/index.html`
 * - `/assets/err-main.css`
 * - `/assets/err-client.js`
 * - `/data/master-catalog.json`
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

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
  renderDspVerificationPage
} from '../src/renderers/pages-artists-and-legal.mjs';
import { renderDocumentShell, escapeHtml } from '../src/renderers/shell.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

/**
 * Resolves the `raggiesoft-assets/engine-room-records` directory across local
 * and production server layouts.
 * @returns {string}
 */
function resolveEngineRoomAssetsDir() {
  const candidates = [
    path.resolve(projectRoot, '../../../raggiesoft-assets/engine-room-records'),
    path.resolve(projectRoot, '../../raggiesoft-assets/engine-room-records'),
    path.resolve(projectRoot, '../raggiesoft-assets/engine-room-records'),
    '/var/www/raggiesoft-assets/engine-room-records'
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
  }
  throw new Error('Could not locate raggiesoft-assets/engine-room-records directory.');
}

/**
 * Writes a file to `dist`, creating parent directories automatically.
 * @param {string} relPath
 * @param {string} content
 */
function writeDistFile(relPath, content) {
  const fullPath = path.join(distDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
}

/**
 * Generates the progressive-enhancement client script (`/assets/err-client.js`)
 * implementing the Modern Web Guidance two-state `<meta name="color-scheme">`
 * theme toggle (reverting to system default when matching OS preference),
 * Bootstrap `data-bs-theme` synchronization, and the `/dsp-verification` instant search filter.
 * @returns {string}
 */
function buildClientJs() {
  return `/**
 * @license MIT
 * err-client.js — Progressive Enhancement for engineroom.raggiesoft.com
 * Implements Modern Web Guidance dark-mode-toggle, mobile navigation drawer,
 * and DSP verification instant filtering.
 */
(function () {
  var meta = document.querySelector('meta[name="color-scheme"]');
  var toggleBtn = document.getElementById('theme-toggle');
  var toggleLabel = document.getElementById('theme-toggle-label');
  var mobileToggle = document.getElementById('mobile-menu-toggle');
  var primaryNav = document.getElementById('primary-navigation');

  if (mobileToggle && primaryNav) {
    mobileToggle.addEventListener('click', function () {
      var expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      primaryNav.classList.toggle('is-open', !expanded);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        mobileToggle.focus();
      }
    });
  }

  function getSystemScheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

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

  function updateButtonLabel() {
    var current = getRenderedScheme();
    document.documentElement.setAttribute('data-bs-theme', current);
    if (!toggleLabel) return;
    toggleLabel.textContent = current === 'dark' ? '🌙 Dark' : '☀️ Light';
  }

  if (toggleBtn && meta) {
    updateButtonLabel();
    toggleBtn.addEventListener('click', function () {
      var current = getRenderedScheme();
      var target = current === 'dark' ? 'light' : 'dark';
      var sys = getSystemScheme();
      try {
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

    window.addEventListener('storage', function (e) {
      if (e.key === 'color-scheme') {
        meta.content = e.newValue || 'light dark';
        updateButtonLabel();
      }
    });
  }

  // DSP Verification table instant filter + URL query param filter (?artist=, ?album=, ?track=)
  var searchInput = document.getElementById('dsp-search');
  var table = document.getElementById('dsp-ledger-table');
  if (table) {
    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('track') || params.get('album') || params.get('artist') || '';
    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }

    function filterRows(q) {
      var needle = String(q || '').trim().toLowerCase();
      rows.forEach(function (row) {
        if (!needle) {
          row.style.display = '';
          return;
        }
        var text = (row.textContent || '').toLowerCase();
        var attrs = [
          row.getAttribute('data-artist') || '',
          row.getAttribute('data-album') || '',
          row.getAttribute('data-track') || ''
        ].join(' ').toLowerCase();
        row.style.display = text.indexOf(needle) !== -1 || attrs.indexOf(needle) !== -1 ? '' : 'none';
      });
    }

    if (initialQuery) {
      filterRows(initialQuery);
    }
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        filterRows(e.target.value);
      });
    }
  }
})();
`;
}

/**
 * Generates an interactive directory card grid for all 73 ported corporate, trust,
 * and artist dossiers on engineroom.raggiesoft.com.
 * @param {Array<Object>} portedPages
 * @returns {string}
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
 * Runs the full static site build.
 */
function buildSite() {
  const assetsDir = resolveEngineRoomAssetsDir();
  const catalogPath = path.join(assetsDir, 'catalog.json');
  const corpPath = path.join(assetsDir, 'json', 'corporate-structure.json');
  const masterCatalogPath = path.join(assetsDir, 'json', 'master-catalog.json');
  const portedPagesPath = path.join(projectRoot, 'src', 'data', 'ported-pages.json');

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

  const portedByRoute = new Map(portedPages.map((p) => [p.route, p]));
  const masterIndexHtml = renderEngineRoomMasterArchiveIndex(portedPages);

  // Clean and recreate dist directory
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  // 1. Copy CSS and write client JS + JSON ledger (to both ./dist and /raggiesoft-assets CDN)
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

  // 2. Render core 3-pillar pages (with Master Archive Index appended to /corporate and /artists)
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

  // 3. Render all 7 artist dossier routes (appending any ported overview HTML right below the structured roster header!)
  const customRenderedRoutes = new Set([
    '/',
    '/studio-engineering',
    '/corporate',
    '/artists',
    '/commercial-licensing',
    '/dsp-verification'
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
  let portedCount = 0;
  for (const page of portedPages) {
    if (customRenderedRoutes.has(page.route)) {
      const altRoute = page.route === '/' ? '/archive-overview' : `${page.route}/overview`;
      writeDistFile(
        `${altRoute.slice(1)}/index.html`,
        renderDocumentShell({
          title: page.title,
          description: page.description,
          canonicalPath: altRoute,
          ogImage: page.ogImage || undefined,
          bodyHtml: page.html
        })
      );
      portedCount++;
      continue;
    }

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

  console.log(
    `✅ Built engineroom.raggiesoft.com static bundle in ${distDir} (${Object.keys(ARTIST_LORE_PROFILES).length} artist hubs, ${catalog.length} albums, and ${portedCount} ported corporate/artist dossiers compiled).`
  );
}

buildSite();

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

