/**
 * @license MIT
 * ============================================================================
 * src/renderers/shell.mjs — Engine Room Records (engineroom.raggiesoft.com)
 * ============================================================================
 * Architectural Overview:
 * Renders the outer HTML5 document shell, accessible sticky navigation bar,
 * Modern Web Guidance dark/light mode toggle, OpenGraph (`og:*`) + Twitter Card
 * social tags (`title` <= 60 chars, `description` <= 155 chars), and the
 * mandatory RaggieSoft Fictitious Persons & Entities Disclaimer + Real-World vs.
 * In-Universe LLC corporate disclosure footer.
 * ============================================================================
 */

/**
 * Escapes HTML special characters for safe attribute and text interpolation.
 * @param {string} str
 * @returns {string}
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
 * Wraps page body content in the canonical Engine Room Records HTML shell.
 *
 * @param {Object} opts
 * @param {string} opts.title - Page title (strictly <= 60 characters)
 * @param {string} opts.description - Meta/OG description (strictly <= 155 characters)
 * @param {string} opts.canonicalPath - Route path starting with `/`
 * @param {string} [opts.ogImage] - Full URL to 1200x630 OpenGraph image
 * @param {string} [opts.ogType] - OpenGraph type (`website` or `profile`)
 * @param {string} opts.bodyHtml - Inner `<main id="content">` HTML markup
 * @returns {string}
 */
export function renderDocumentShell({
  title,
  description,
  canonicalPath = '/',
  ogImage = 'https://assets.raggiesoft.com/engine-room-records/images/og/engine-room-og.jpg',
  ogType = 'website',
  bodyHtml
}) {
  const safeTitle = escapeHtml(title.slice(0, 60));
  const safeDesc = escapeHtml(description.slice(0, 155));
  const canonicalUrl = `https://engineroom.raggiesoft.com${canonicalPath === '/' ? '' : canonicalPath}`;

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

  const navHtml = navItems
    .map((item) => {
      const isCurrent =
        item.href === canonicalPath ||
        (item.href !== '/' && canonicalPath.startsWith(item.href + '/'));
      return `<li><a href="${item.href}" class="nav-link"${isCurrent ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a></li>`;
    })
    .join('\n            ');

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
    <meta name="description" content="${safeDesc}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
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
    <link rel="icon" type="image/png" href="https://assets.raggiesoft.com/engine-room-records/images/logos/engine-room-records-logo.png" media="(prefers-color-scheme: light)" />
    <link rel="icon" type="image/png" href="https://assets.raggiesoft.com/engine-room-records/images/logos/engine-room-records-logo-white.png" media="(prefers-color-scheme: dark)" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Black+Ops+One&family=Great+Vibes&family=Herr+Von+Muellerhoff&family=Mrs+Saint+Delafield&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Titillium+Web:wght@400;600;700&family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://assets.raggiesoft.com/common/vendor/bootstrap/bootstrap.min.css" />
    <link rel="stylesheet" href="https://assets.raggiesoft.com/fonts/phosphor/phosphor.min.css" />
    <link rel="stylesheet" href="https://assets.raggiesoft.com/common/css/raggiesoft-logo.css" />
    <link rel="stylesheet" href="/assets/err-main.css?v=20261017m" />
    <link rel="stylesheet" href="https://assets.raggiesoft.com/common/css/raggiesoft-network.css?v=20261017m" />
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
          <li><a href="https://michaelpragsdale.com">👔 Michael P. Ragsdale</a></li>
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
    <script src="https://assets.raggiesoft.com/common/js/raggiesoft-network.js?v=20261017m" defer></script>
  </body>
</html>`;
}
