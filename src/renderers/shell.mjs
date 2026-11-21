/**
 * @license MIT
 * ============================================================================
 * src/renderers/shell.mjs — Engine Room Records (engineroom.raggiesoft.com)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL JAVASCRIPT GUIDE):
 * What is this file?
 *   Every webpage on `engineroom.raggiesoft.com` needs the same outer HTML5
 *   skeleton: the document head (character set, mobile viewport, Light/Dark
 *   theme detector, SEO title/description, social preview cards, JSON-LD
 *   search-engine schema, and CSS links), the top RaggieSoft Network bar,
 *   the sticky Engine Room Records navigation bar, a `<main>` content area,
 *   and the global legal disclaimer footer.
 *
 *   Instead of duplicating those ~250 lines of HTML across 80+ pages, this
 *   module exports two reusable functions:
 *   1. `escapeHtml(str)` — Sanitizes dynamic strings so special characters like
 *      `<`, `>`, `&`, `"`, and `'` cannot accidentally break HTML attributes or
 *      inject unwanted markup (Cross-Site Scripting / XSS prevention).
 *   2. `renderDocumentShell(opts)` — Accepts page-specific options (`title`,
 *      `description`, `canonicalPath`, `bodyHtml`, etc.) and returns a complete
 *      `<!doctype html>...</html>` string ready to save to `./dist/.../index.html`.
 *
 * How does it fit into the build lifecycle?
 *   - Called by every page renderer in `pages-core.mjs`, `pages-artists-and-legal.mjs`,
 *     and directly by `scripts/build.mjs` (for the 73 ported archival dossiers
 *     and `/404.html`).
 *   - Runs 100% at build time in Node.js; visitors receive pure, pre-rendered HTML.
 * ============================================================================
 */

/**
 * Escapes the five HTML-sensitive characters (`&`, `<`, `>`, `"`, `'`) into
 * safe HTML entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`).
 *
 * 100-Level JS Tip:
 *   - `str ?? ''` uses the Nullish Coalescing operator (`??`): if `str` is
 *     `null` or `undefined`, it falls back to an empty string `''` before
 *     `String(...)` converts numbers or booleans to text.
 *   - Notice `&` MUST be replaced FIRST! If we replaced `<` with `&lt;` first
 *     and ran `.replace(/&/g, '&amp;')` second, `&lt;` would get double-escaped
 *     into `&amp;lt;`.
 *
 * @param {string} str - Raw input string from JSON or lore data.
 * @returns {string} HTML-escaped string safe for text or attribute interpolation.
 */
export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Wraps inner page markup (`bodyHtml`) inside the complete Engine Room Records
 * HTML5 document shell.
 *
 * 100-Level JS Tip (Destructured Options Object):
 *   Instead of passing 8 positional arguments like `renderDocumentShell(a, b, c, ...)`,
 *   where callers could easily mix up the order, this function accepts a single
 *   configuration object `{ title, description, ... }` with `=` default values
 *   for optional properties (`canonicalPath = '/'`, `noindex = false`, etc.).
 *
 * @param {Object} opts
 * @param {string} opts.title - Browser tab & OpenGraph title (clamped to <= 60 characters).
 * @param {string} opts.description - Meta & OpenGraph summary (clamped to <= 155 characters).
 * @param {string} [opts.canonicalPath='/'] - Route path starting with `/` (or `'/404'` for the error page).
 * @param {string} [opts.ogImage] - Full URL to a 1200x630 social preview banner.
 * @param {string} [opts.ogType='website'] - OpenGraph resource type (`'website'` or `'profile'`).
 * @param {boolean} [opts.noindex=false] - When `true`, instructs search crawlers not to index the page.
 * @param {Array<Object>} [opts.extraJsonLd=[]] - Additional Schema.org JSON-LD nodes (e.g., `MusicGroup`).
 * @param {string} opts.bodyHtml - Inner HTML content injected inside `<main id="content">`.
 * @returns {string} Complete HTML5 document string.
 */
export function renderDocumentShell({
  title,
  description,
  canonicalPath = '/',
  ogImage = 'https://assets.raggiesoft.com/engine-room-records/images/og/engine-room-og.jpg',
  ogType = 'website',
  noindex = false,
  extraJsonLd = [],
  bodyHtml
}) {
  // Clamp `title` to 60 chars and `description` to 155 chars using `.slice(0, N)`
  // so search engines and social cards never truncate metadata mid-sentence, then
  // escape HTML special characters so quotes or ampersands cannot break meta tags.
  const safeTitle = escapeHtml(title.slice(0, 60));
  const safeDesc = escapeHtml(description.slice(0, 155));

  // Error pages (`/404`) should NOT emit a canonical link pointing to `/404`.
  const isErrorPage = canonicalPath === '/404';

  // Build the full production URL. For the home page (`'/'`), omit the trailing
  // slash (`https://engineroom.raggiesoft.com`) to match `trailingSlash: 'never'`.
  const canonicalUrl = `https://engineroom.raggiesoft.com${canonicalPath === '/' ? '' : canonicalPath}`;

  // Conditionally emit a `noindex, follow` meta directive on archival duplicate/404 pages
  // so search engines follow links on the page without indexing it as a primary search result.
  const robotsMetaHtml = noindex
    ? '\n    <meta name="robots" content="noindex, follow" />'
    : '';

  // Emit the canonical link element on every route except `/404`.
  const canonicalLinkHtml = isErrorPage
    ? ''
    : `\n    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;

  // Ordered list of primary navigation links rendered in the sticky site header.
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/artists', label: 'Artists (7)' },
    { href: '/studio-engineering', label: 'Studio' },
    { href: '/corporate', label: 'Corporate' },
    { href: '/oconnell-trust', label: 'Trust' },
    { href: '/jessica-miller-center', label: 'Miller Center' },
    { href: '/commercial-licensing', label: 'Licensing' },
    { href: '/isrc', label: 'ISRC (QTAHP)' },
    { href: '/dsp-verification', label: 'DSP' }
  ];

  // Transform the `navItems` array into an HTML string of `<li><a ...>` elements:
  // - `.map()` visits each navigation item and checks whether the current page matches
  //   `item.href` exactly OR lives in a sub-folder beneath `item.href` (e.g., `/artists/firelight`
  //   highlights the `/artists` tab).
  // - When `isCurrent` is true, `aria-current="page"` tells both CSS (active highlight)
  //   and screen readers which section the visitor is currently viewing.
  // - `.join('\n            ')` glues all `<li>` strings together with neat indentation.
  const navHtml = navItems
    .map((item) => {
      const isCurrent =
        item.href === canonicalPath ||
        (item.href !== '/' && canonicalPath.startsWith(item.href + '/'));
      return `<li><a href="${item.href}" class="nav-link"${isCurrent ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a></li>`;
    })
    .join('\n            ');

  // Assemble and return the complete HTML5 document using a JavaScript template literal.
  // Key architectural details inside the template below:
  // 1. Synchronous `<script>` in `<head>`: Reads `localStorage.getItem('color-scheme')`
  //    BEFORE stylesheets finish rendering so `meta[name="color-scheme"]` and Bootstrap's
  //    `data-bs-theme` attribute match the visitor's saved Light/Dark preference with zero FOUC.
  // 2. `<script type="application/ld+json">`: Embeds a Schema.org `@graph` linking
  //    `Organization`, `WebSite`, `WebPage`, and any page-specific `extraJsonLd` nodes
  //    (spread in via `...(Array.isArray(extraJsonLd) ? extraJsonLd : [])`).
  // 3. Dual favicons & dual header logos: Automatically swap black vs. white crests
  //    for Light Mode vs. Dark Mode.
  // 4. `<main id="content" tabindex="-1">`: Target of `.skip-link` so keyboard users
  //    pressing Enter on "Skip to main content" land focus directly on the main content.
  // 5. Global footer: Enforces the Real-World Imprint vs. Fictitious In-Universe LLC
  //    disclosure, Closed Submission Policy, and CC BY-SA 4.0 / MIT licensing notices.
  return `<!doctype html>
<html lang="en" data-bs-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <script>
      try {
        var storedScheme = localStorage.getItem('color-scheme');
        document.querySelector('meta[name="color-scheme"]').content = storedScheme ?? 'light dark';
        var resolvedBsTheme = (storedScheme === 'light' || storedScheme === 'dark')
          ? storedScheme
          : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        document.documentElement.setAttribute('data-bs-theme', resolvedBsTheme);
      } catch (e) {}
    </script>
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDesc}" />${robotsMetaHtml}${canonicalLinkHtml}
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="${escapeHtml(ogType)}" />
    <meta property="og:site_name" content="Engine Room Records" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
    <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://engineroom.raggiesoft.com/#organization',
          name: 'Engine Room Records',
          url: 'https://engineroom.raggiesoft.com',
          logo: 'https://assets.raggiesoft.com/engine-room-records/images/logos/engine-room-records-logo.png',
          description: 'Independent open-culture record label and audio engineering archive founded by Michael P. Ragsdale (US ISRC Prefix: QTAHP). All master recordings released under CC BY-SA 4.0.',
          founder: {
            '@type': 'Person',
            '@id': 'https://michaelpragsdale.com/#michael-ragsdale',
            name: 'Michael P. Ragsdale',
            url: 'https://michaelpragsdale.com'
          },
          parentOrganization: {
            '@type': 'Organization',
            '@id': 'https://raggiesoft.com/#organization',
            name: 'RaggieSoft',
            url: 'https://raggiesoft.com'
          },
          sameAs: [
            'https://engineroom.raggiesoft.com',
            'https://engineroom-records.com',
            'https://store.raggiesoft.com',
            'https://github.com/raggiesoft'
          ]
        },
        {
          '@type': 'WebSite',
          '@id': 'https://engineroom.raggiesoft.com/#website',
          url: 'https://engineroom.raggiesoft.com',
          name: 'Engine Room Records',
          publisher: { '@id': 'https://engineroom.raggiesoft.com/#organization' }
        },
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: title,
          description: description,
          isPartOf: { '@id': 'https://engineroom.raggiesoft.com/#website' },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: ogImage
          },
          license: 'https://creativecommons.org/licenses/by-sa/4.0/'
        },
        ...(Array.isArray(extraJsonLd) ? extraJsonLd : [])
      ]
    })}</script>
    <link rel="icon" type="image/png" href="https://assets.raggiesoft.com/engine-room-records/images/logos/engine-room-records-logo.png" media="(prefers-color-scheme: light)" />
    <link rel="icon" type="image/png" href="https://assets.raggiesoft.com/engine-room-records/images/logos/engine-room-records-logo-white.png" media="(prefers-color-scheme: dark)" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Black+Ops+One&family=Great+Vibes&family=Herr+Von+Muellerhoff&family=Mrs+Saint+Delafield&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Titillium+Web:wght@400;600;700&family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://assets.raggiesoft.com/common/vendor/bootstrap/bootstrap.min.css" />
    <link rel="stylesheet" href="https://assets.raggiesoft.com/fonts/phosphor/phosphor.min.css" />
    <link rel="stylesheet" href="https://assets.raggiesoft.com/common/css/raggiesoft-logo.css" />
    <link rel="stylesheet" href="/assets/err-main.css?v=20261017m" />
    <link rel="stylesheet" href="https://assets.raggiesoft.com/common/css/raggiesoft-network.css?v=20261120b" />
    <!-- Google Analytics 4 (GA4) Telemetry Integration (G-P9RG9JVYB6) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-P9RG9JVYB6"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-P9RG9JVYB6');
    </script>
  </head>
  <body>
    <a href="#content" class="skip-link">Skip to main content</a>

    <nav class="rs-network-bar no-print" aria-label="RaggieSoft Ecosystem Network">
      <div class="rs-network-bar-inner">
        <span class="rs-network-label">✦ RaggieSoft Network:</span>
        <ul class="rs-network-links">
          <li><a href="https://raggiesoft.com">🌐 Hub</a></li>
          <li><a href="https://nebulae.raggiesoft.com">🌌 Nebulae</a></li>
          <li><a href="https://books.raggiesoft.com">📚 Books</a></li>
          <li class="rs-network-dropdown">
            <button type="button" class="rs-network-dropdown-toggle is-active" aria-expanded="false" aria-haspopup="true">
              <span aria-hidden="true">⚙️</span>
              <span>Engine Room</span>
              <span class="rs-network-caret" aria-hidden="true">▾</span>
            </button>
            <ul class="rs-network-dropdown-menu" role="menu" aria-label="Engine Room Records &amp; Band Roster">
              <li role="none"><a role="menuitem" href="https://engineroom.raggiesoft.com">⚙️ Engine Room Records Hub</a></li>
              <li role="none"><a role="menuitem" href="https://music.raggiesoft.com">🎧 The Listening Room</a></li>
              <li role="none"><a role="menuitem" href="https://engineroom.raggiesoft.com/artists">🎸 All Artists Directory (7)</a></li>
              <li role="none"><a role="menuitem" href="https://engineroom.raggiesoft.com/isrc">🏷️ Official ISRC Registry (QTAHP)</a></li>
              <li role="none"><a role="menuitem" href="https://engineroom.raggiesoft.com/dsp-verification">🔍 DSP Verification Ledger</a></li>
              <li class="rs-network-dropdown-divider" role="separator"></li>
              <li class="rs-network-dropdown-header" role="presentation">✦ Band Roster (A–Z)</li>
              <li role="none"><a role="menuitem" href="https://engineroom.raggiesoft.com/artists/crimson-node">🔴 Crimson Node</a></li>
              <li role="none"><a role="menuitem" href="https://engineroom.raggiesoft.com/artists/firelight">🔥 Firelight</a></li>
              <li role="none"><a role="menuitem" href="https://engineroom.raggiesoft.com/artists/fractured-prisms">💎 Fractured Prisms</a></li>
              <li role="none"><a role="menuitem" href="https://engineroom.raggiesoft.com/artists/mana-canvas">🎨 Mana Canvas</a></li>
              <li role="none"><a role="menuitem" href="https://engineroom.raggiesoft.com/artists/the-arctic-symphony-project">❄️ The Arctic Symphony Project</a></li>
              <li role="none"><a role="menuitem" href="https://engineroom.raggiesoft.com/artists/the-paper-wall">🧱 The Paper Wall</a></li>
              <li role="none"><a role="menuitem" href="https://stardust.raggiesoft.com">🚀 The Stardust Engine</a></li>
            </ul>
          </li>
          <li><a href="https://corporate.raggiesoft.com">🏢 Corporate</a></li>
          <li><a href="https://storetrainer.raggiesoft.com">💾 StoreTrainer</a></li>
          <li><a href="https://michaelpragsdale.com">👔 Portfolio &amp; Resume</a></li>
        </ul>
      </div>
    </nav>

    <header class="site-header" role="banner">
      <div class="container header-inner">
        <a href="/" class="brand-link" aria-label="Engine Room Records Home">
          <!-- Light Mode Logo: Black on Transparent Background -->
          <img
            src="https://assets.raggiesoft.com/engine-room-records/images/logos/engine-room-records-logo.png"
            alt="Engine Room Records industrial gear crest"
            class="brand-logo brand-logo-light"
            width="36"
            height="36"
          />
          <!-- Dark Mode Logo: White on Transparent Background -->
          <img
            src="https://assets.raggiesoft.com/engine-room-records/images/logos/engine-room-records-logo-white.png"
            alt="Engine Room Records industrial gear crest"
            class="brand-logo brand-logo-dark"
            width="36"
            height="36"
          />
          <span class="brand-text">
            <span class="brand-title">Engine Room Records</span>
            <span class="brand-subtitle">Imprint of Michael P. Ragsdale</span>
          </span>
        </a>

        <button
          type="button"
          class="mobile-menu-toggle"
          id="mobile-menu-toggle"
          aria-expanded="false"
          aria-controls="primary-navigation"
          aria-label="Toggle navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <nav id="primary-navigation" class="primary-nav" aria-label="Primary Navigation">
          <ul class="nav-links">
            ${navHtml}
            <li>
              <a href="https://music.raggiesoft.com" class="nav-cta" target="_blank" rel="noopener noreferrer">
                🎧 Listen ↗
              </a>
            </li>
            <li>
              <button
                type="button"
                id="theme-toggle"
                class="theme-toggle-btn"
                aria-label="Toggle color scheme between light and dark mode"
                title="Toggle Light / Dark Mode (Reverts to System default when matching OS)"
              >
                <span id="theme-toggle-label">◐ Theme</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main id="content" class="container" tabindex="-1">
      ${bodyHtml}
    </main>

    <footer class="site-footer" role="contentinfo">
      <div class="container">
        <div class="grid-3" style="margin-bottom: 1.5rem;">
          <div>
            <h2 style="font-size: 1rem; margin-bottom: 0.5rem;">Engine Room Records (Real-World Imprint)</h2>
            <p style="margin: 0 0 0.5rem; font-size: 0.83rem;">
              In real life, <strong>Engine Room Records</strong> (never &ldquo;Engine Room Records, LLC&rdquo;) is the creative brand and private record imprint under which <strong>Michael P. Ragsdale</strong> produces and distributes his music.
            </p>
            <p style="margin: 0; font-size: 0.8rem;">
              <a href="/about">📜 About</a> • <a href="/history">🕰️ Label History</a> • <a href="/assets">🏛️ Strategic Assets</a> • <a href="/isrc">🏷️ ISRC (QTAHP)</a> • <a href="/dsp-verification">🔍 DSP Verification</a> • <a href="/terms">⚖️ Terms</a> • <a href="/privacy">🔒 Privacy</a>
            </p>
          </div>
          <div>
            <h2 style="font-size: 1rem; margin-bottom: 0.5rem;">Closed Submission Policy</h2>
            <p style="margin: 0; font-size: 0.83rem;">
              <strong>Engine Room Records does not accept unsolicited demos, artist submissions, or representation inquiries.</strong> Any submissions received are automatically deleted before reaching any inbox.
            </p>
          </div>
          <div>
            <h2 style="font-size: 1rem; margin-bottom: 0.5rem;">RaggieSoft Ecosystem Directory</h2>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.83rem; display: grid; gap: 0.3rem;">
              <li><a href="https://music.raggiesoft.com">🎧 The Listening Room (music.raggiesoft.com)</a></li>
              <li><a href="https://stardust.raggiesoft.com">🚀 The Stardust Engine (stardust.raggiesoft.com)</a></li>
              <li><a href="https://books.raggiesoft.com">📚 RaggieSoft Book Reader (books.raggiesoft.com)</a></li>
              <li><a href="https://nebulae.raggiesoft.com">🌌 The RaggieSoft Nebulae (nebulae.raggiesoft.com)</a></li>
              <li><a href="https://raggiesoft.com">🌐 RaggieSoft Hub (raggiesoft.com)</a></li>
              <li><a href="https://corporate.raggiesoft.com">🏢 RaggieSoft Media (corporate.raggiesoft.com)</a></li>
              <li><a href="https://storetrainer.raggiesoft.com">💾 StoreTrainer Utility (storetrainer.raggiesoft.com)</a></li>
              <li><a href="https://michaelpragsdale.com">👔 Michael P. Ragsdale (michaelpragsdale.com)</a></li>
            </ul>
          </div>
        </div>

        <div class="disclaimer-box" role="note" aria-label="Fictitious Persons and Entities Disclaimer">
          <strong>Fictitious Persons, Bands &amp; Corporate Entities Disclaimer:</strong> All narrative characters (including Ryan, Cassidy, and Holly O'Connell, Evan and Tyler Wright, Claire and Rhys Manning, Julian Croft, Maya Sterling, Julian Rowlands, and Matt Miller), bands, biographies, universities (including Commonwealth Polytechnic Institute / CPI, The Forgers, and The Crucible), corporations (including OmniCorp, Apex Records, Vanguard Horizon, Prairie Coachworks, and Sainte-Claire), transit agencies (Blue Ridge Transit), in-universe legal filings, and any entity with <strong>&ldquo;LLC&rdquo;</strong>, <strong>&ldquo;Trust&rdquo;</strong>, or <strong>&ldquo;Holdings&rdquo;</strong> in its name (including <em>Engine Room Records, LLC</em>, <em>The O'Connell Family Revocable Trust</em>, <em>The O'Connell Family, LLC</em>, <em>Artists First Management, LLC</em>, <em>Stardust Properties, LLC</em>, <em>Stardust Blacksburg, LLC</em>, <em>Stardust Strategic Assets, LLC</em>, <em>Pacific Rim Properties, LLC</em>, <em>Jessica Miller Center, LLC</em>, and <em>Aethelgard Holdings, LLC</em>) are strictly works of fiction. Any resemblance to actual persons, living or dead, businesses, institutions, or events is purely coincidental.
        </div>

        <p style="margin: 0.75rem 0 0; font-size: 0.8rem; color: var(--text-muted);">
          &copy; 2026 Michael P. Ragsdale / Engine Room Records. Source code licensed under the
          <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT License</a>.
          Creative narrative &amp; 128kbps web audio archives licensed under
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>
          (alongside applicable DSP consumer streaming licenses or direct commercial synchronization clearances via
          <a href="/commercial-licensing">Commercial Licensing</a>) •
          <a href="/terms">Terms &amp; Licensing</a> •
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </footer>

    <script src="/assets/err-client.js?v=20261017e" defer></script>
    <script src="https://assets.raggiesoft.com/common/js/raggiesoft-network.js?v=20261120b" defer></script>
  </body>
</html>`;
}
