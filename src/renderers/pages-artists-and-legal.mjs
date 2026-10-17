/**
 * @license MIT
 * ============================================================================
 * src/renderers/pages-artists-and-legal.mjs — Engine Room Records
 * ============================================================================
 * Architectural Overview:
 * Renders:
 * 1. `renderArtistsIndexPage` (`/artists`): Complete 7-project roster index.
 * 2. `renderArtistDetailPage` (`/artists/<slug>`): Dedicated lore dossier,
 *    member roster, and full chronological discography for each of the 7 bands
 *    (including `/artists/fractured-prisms`, the destination for the 301 redirect
 *    from `https://fracturedprisms.com`).
 * 3. `renderCommercialLicensingPage` (`/commercial-licensing`): B2B non-exclusive
 *    synchronization clearance portal.
 * 4. `renderDspVerificationPage` (`/dsp-verification`): Administrative DSP
 *    chain-of-custody & ISRC verification portal powered by `master-catalog.json`.
 * ============================================================================
 */

import { escapeHtml, renderDocumentShell } from './shell.mjs';
import { ARTIST_LORE_PROFILES } from '../data/artistLore.mjs';
import { buildArtistStats } from './pages-core.mjs';

/**
 * Renders `/artists` index page.
 * @param {Array<any>} catalog
 * @returns {string}
 */
export function renderArtistsIndexPage(catalog) {
  const statsMap = buildArtistStats(catalog);

  const cardsHtml = Object.values(ARTIST_LORE_PROFILES)
    .map((artist) => {
      const stat = statsMap.get(artist.slug) || { albumCount: 0, trackCount: 0, playableCount: 0 };
      return `
        <article class="card card-accent-primary">
          <div>
            <div class="artist-header">
              <img
                src="${escapeHtml(artist.logoUrl)}"
                alt="${escapeHtml(artist.name)} emblem"
                class="artist-logo"
                width="56"
                height="56"
                loading="lazy"
              />
              <div>
                <div class="badge-row" style="margin-bottom: 0.25rem;">
                  <span class="badge">${escapeHtml(artist.errId)}</span>
                  <span class="badge">${escapeHtml(artist.yearsActive)}</span>
                  <span class="badge">${stat.albumCount} Albums • ${stat.trackCount} Tracks</span>
                </div>
                <h2 style="font-size: 1.3rem; margin: 0;">${escapeHtml(artist.name)}</h2>
              </div>
            </div>
            <p style="font-size: 0.85rem; font-weight: 700; color: var(--accent-amber); margin: 0 0 0.45rem;">
              ${escapeHtml(artist.tagline)}
            </p>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0 0 0.65rem;">
              ${escapeHtml(artist.summary)}
            </p>
          </div>
          <div class="btn-row">
            <a href="/artists/${escapeHtml(artist.slug)}" class="btn btn-primary">
              📖 Read ${escapeHtml(artist.name)} Dossier →
            </a>
            <a href="${escapeHtml(artist.listeningRoomUrl)}" class="btn" target="_blank" rel="noopener noreferrer">
              🎧 Stream on music.raggiesoft.com ↗
            </a>
            ${
              artist.slug === 'the-stardust-engine'
                ? `<a href="https://stardust.raggiesoft.com" class="btn btn-amber" target="_blank" rel="noopener noreferrer">🚀 Cosmic Portal (stardust.raggiesoft.com) ↗</a>`
                : ''
            }
          </div>
        </article>`;
    })
    .join('\n');

  const bodyHtml = `
    <section class="hero-card" aria-labelledby="roster-heading">
      <span class="eyebrow">Engine Room Records • Roster Directory (ERR-001 – ERR-007)</span>
      <h1 id="roster-heading">Official Artist Roster &amp; Band Lore Directory</h1>
      <p class="lead">
        Explore all seven musical projects produced under <strong>Engine Room Records</strong>. Every project links directly to <a href="https://music.raggiesoft.com">The Listening Room</a> for full-track streaming, synchronized WebVTT lyrics, and free <strong>CC BY-SA 4.0 128kbps MP3 downloads</strong>, alongside companion novels on <a href="https://books.raggiesoft.com">RaggieSoft Book Reader</a>.
      </p>
    </section>

    <section class="section-block" aria-label="All 7 Engine Room Records Bands">
      <div class="grid-2">
        ${cardsHtml}
      </div>
    </section>
  `;

  return renderDocumentShell({
    title: 'Artist Roster & Band Lore Directory | Engine Room Records',
    description: 'Explore all 7 bands on Engine Room Records: The Stardust Engine, Fractured Prisms, The Paper Wall, Arctic Symphony, Crimson Node, Mana Canvas, and Firelight.',
    canonicalPath: '/artists',
    bodyHtml
  });
}

/**
 * Renders an individual artist lore & discography dossier (`/artists/<slug>`).
 * @param {string} slug
 * @param {Array<any>} catalog
 * @returns {string}
 */
export function renderArtistDetailPage(slug, catalog) {
  const artist = ARTIST_LORE_PROFILES[slug];
  if (!artist) {
    throw new Error(`Unknown artist slug: ${slug}`);
  }

  const artistAlbums = catalog.filter((a) => a.artistSlug === slug);

  const membersHtml = artist.members
    .map(
      (m) => `
      <div class="card" style="padding: 1.1rem;">
        <div>
          <h3 style="font-size: 1.05rem; margin: 0 0 0.25rem;">${escapeHtml(m.name)}</h3>
          <p style="font-size: 0.82rem; font-weight: 700; color: var(--accent-primary); margin: 0 0 0.45rem;">
            ${escapeHtml(m.role)}
          </p>
          <p style="font-size: 0.86rem; color: var(--text-secondary); margin: 0;">
            ${escapeHtml(m.notes)}
          </p>
        </div>
      </div>`
    )
    .join('\n');

  const pillarsHtml = artist.lorePillars
    .map(
      (p) => `
      <article class="card card-accent-amber">
        <div>
          <h3>${escapeHtml(p.title)}</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); margin: 0;">
            ${escapeHtml(p.body)}
          </p>
        </div>
      </article>`
    )
    .join('\n');

  const albumsHtml =
    artistAlbums.length > 0
      ? artistAlbums
          .map((album) => {
            const listeningRoomAlbumUrl = `https://music.raggiesoft.com/${album.artistSlug}/${album.slug}`;
            return `
              <article class="card">
                <div>
                  <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 0.85rem;">
                    <img
                      src="${escapeHtml(album.artwork)}"
                      alt="Album cover for ${escapeHtml(album.title)}"
                      width="76"
                      height="76"
                      style="border-radius: 0.5rem; object-fit: cover; border: 1px solid var(--border-strong); flex-shrink: 0;"
                      loading="lazy"
                    />
                    <div>
                      <div class="badge-row" style="margin-bottom: 0.25rem;">
                        <span class="badge">${escapeHtml(album.year || ' Lore Era')}</span>
                        <span class="badge">${escapeHtml(album.albumTypeLabel || 'Album')}</span>
                        <span class="badge">${Number(album.totalTracksCount || 0)} Tracks</span>
                      </div>
                      <h3 style="margin: 0 0 0.2rem; font-size: 1.1rem;">${escapeHtml(album.title)}</h3>
                      ${
                        album.subtitle
                          ? `<p style="margin: 0; font-size: 0.8rem; color: var(--accent-amber); font-weight: 700;">${escapeHtml(album.subtitle)}</p>`
                          : ''
                      }
                    </div>
                  </div>
                  <p style="font-size: 0.87rem; color: var(--text-secondary); margin: 0 0 0.75rem;">
                    ${escapeHtml(album.description)}
                  </p>
                </div>
                <div class="btn-row">
                  <a href="${escapeHtml(listeningRoomAlbumUrl)}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    🎧 Stream &amp; Lyrics in Listening Room ↗
                  </a>
                  ${
                    album.freeArchiveUrl
                      ? `<a href="${escapeHtml(album.freeArchiveUrl)}" class="btn btn-emerald" download target="_blank" rel="noopener noreferrer">⬇ Free 128kbps MP3 (.zip)</a>`
                      : ''
                  }
                </div>
              </article>`;
          })
          .join('\n')
      : `<div class="callout-box"><p style="margin: 0;">Full discography streaming in <a href="${escapeHtml(artist.listeningRoomUrl)}">The Listening Room</a>.</p></div>`;

  const bodyHtml = `
    <nav aria-label="Breadcrumb" style="margin-bottom: 1rem; font-size: 0.85rem;">
      <a href="/">Engine Room Records</a> &rsaquo; <a href="/artists">Artist Roster</a> &rsaquo; <strong>${escapeHtml(artist.name)}</strong>
    </nav>

    <section class="hero-card" aria-labelledby="artist-heading">
      <div class="artist-header">
        <img
          src="${escapeHtml(artist.logoUrl)}"
          alt="${escapeHtml(artist.name)} emblem"
          class="artist-logo"
          width="72"
          height="72"
        />
        <div>
          <span class="eyebrow">${escapeHtml(artist.errId)} • ${escapeHtml(artist.origin)} • ${escapeHtml(artist.yearsActive)}</span>
          <h1 id="artist-heading" style="margin-bottom: 0.25rem;">${escapeHtml(artist.name)}</h1>
          <p style="margin: 0; font-weight: 700; color: var(--accent-amber);">${escapeHtml(artist.tagline)}</p>
        </div>
      </div>

      <p class="lead" style="margin-top: 1rem;">
        ${escapeHtml(artist.summary)}
      </p>

      <div class="callout-box" style="margin-bottom: 1.25rem;">
        <strong>What Kind of Music Is ${escapeHtml(artist.name)}?</strong>
        <span style="color: var(--text-secondary);"> ${escapeHtml(artist.whatKindOfMusic)}</span>
      </div>

      <div class="btn-row">
        <a href="${escapeHtml(artist.listeningRoomUrl)}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          🎧 Listen to ${escapeHtml(artist.name)} in The Listening Room ↗
        </a>
        ${
          artist.slug === 'the-stardust-engine'
            ? `<a href="https://stardust.raggiesoft.com" class="btn btn-amber" target="_blank" rel="noopener noreferrer">🚀 Launch Dedicated Cosmic Portal (stardust.raggiesoft.com) ↗</a>`
            : ''
        }
        ${
          artist.bookReaderUrl
            ? `<a href="${escapeHtml(artist.bookReaderUrl)}" class="btn btn-emerald" target="_blank" rel="noopener noreferrer">📚 Read Companion Novel on Book Reader ↗</a>`
            : ''
        }
        ${
          artist.secondaryBookUrl
            ? `<a href="${escapeHtml(artist.secondaryBookUrl)}" class="btn" target="_blank" rel="noopener noreferrer">📖 ${escapeHtml(artist.secondaryBookTitle)} ↗</a>`
            : ''
        }
      </div>
    </section>

    <section class="section-block" aria-labelledby="lore-pillars-heading">
      <div class="section-header">
        <span class="eyebrow">Canonical In-Universe History</span>
        <h2 id="lore-pillars-heading">1. Canonical Band Lore &amp; Sanctuary History</h2>
      </div>
      <div class="grid-3">
        ${pillarsHtml}
      </div>
    </section>

    <section class="section-block" aria-labelledby="members-heading">
      <div class="section-header">
        <span class="eyebrow">Personnel &amp; Roles</span>
        <h2 id="members-heading">2. Band Members &amp; Studio Collective</h2>
      </div>
      <div class="grid-2">
        ${membersHtml}
      </div>
    </section>

    <section class="section-block" aria-labelledby="discog-heading">
      <div class="section-header">
        <span class="eyebrow">The Listening Room Handoff • CC BY-SA 4.0</span>
        <h2 id="discog-heading">3. Discography &amp; Free 128kbps MP3 Archives (${artistAlbums.length} Releases)</h2>
        <p style="margin: 0; color: var(--text-secondary);">
          Select any release below to stream in <a href="${escapeHtml(artist.listeningRoomUrl)}">The Listening Room</a> or download the complete 128kbps MP3 ZIP archive under our <strong>CC BY-SA 4.0</strong> license.
        </p>
      </div>
      <div class="grid-2">
        ${albumsHtml}
      </div>
    </section>
  `;

  return renderDocumentShell({
    title: `${artist.name} | Lore & Discography | Engine Room Records`,
    description: `${artist.name} (${artist.primaryGenre}): ${artist.summary}`.slice(0, 155),
    canonicalPath: `/artists/${slug}`,
    ogImage: artist.ogImage,
    ogType: 'profile',
    bodyHtml
  });
}

/**
 * Renders `/commercial-licensing` page.
 * @returns {string}
 */
export function renderCommercialLicensingPage() {
  const bodyHtml = `
    <section class="hero-card" aria-labelledby="lic-heading">
      <span class="eyebrow">B2B Synchronization &amp; Broadcast Clearance</span>
      <h1 id="lic-heading">Commercial Synchronization Licensing</h1>
      <p class="lead">
        All music published under <strong>Engine Room Records</strong> is 100% independently owned by <strong>Michael P. Ragsdale</strong> (both Master Recording and Musical Composition / Publishing) with zero third-party sample encumbrances—enabling rapid, one-stop clearance.
      </p>
      <div class="btn-row">
        <a href="https://raggiesoft.com/raggiesoft-media/licensing/commercial" class="btn btn-primary">
          📄 Request Commercial Sync License on RaggieSoft.com →
        </a>
        <a href="/dsp-verification" class="btn">
          🔍 View ISRC &amp; Chain-of-Custody Ledger →
        </a>
      </div>
    </section>

    <section class="section-block" aria-labelledby="tiers-heading">
      <div class="section-header">
        <span class="eyebrow">Dual-Track Licensing Model</span>
        <h2 id="tiers-heading">Consumer CC BY-SA 4.0 vs. Commercial B2B Sync Clearance</h2>
      </div>
      <div class="grid-2">
        <article class="card card-accent-emerald">
          <span class="badge" style="margin-bottom: 0.5rem;">Free / Open Culture Tier</span>
          <h3>Creative Commons BY-SA 4.0 (128kbps Web Archives)</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            Every playable track and 128kbps MP3 album ZIP archive hosted on <a href="https://music.raggiesoft.com">music.raggiesoft.com</a> is freely downloadable and shareable under the <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</a> license with proper attribution to <strong>Michael P. Ragsdale / Engine Room Records</strong>.
          </p>
        </article>
        <article class="card card-accent-amber">
          <span class="badge" style="margin-bottom: 0.5rem;">Proprietary Commercial Sync Tier</span>
          <h3>Direct B2B Synchronization &amp; Master Waiver</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            For film, television, commercial video games, advertising, or proprietary broadcast productions that cannot comply with CC BY-SA 4.0's ShareAlike requirement—or that require uncompressed 24-bit WAV studio stems—Michael P. Ragsdale issues direct, non-exclusive commercial synchronization licenses via <a href="https://raggiesoft.com/raggiesoft-media/licensing/commercial">RaggieSoft Media Commercial Licensing</a>.
          </p>
        </article>
      </div>
    </section>
  `;

  return renderDocumentShell({
    title: 'Commercial Synchronization Licensing | Engine Room Records',
    description: 'Non-exclusive commercial synchronization clearances for Film, TV, Games, and Broadcast across the Engine Room Records catalog.',
    canonicalPath: '/commercial-licensing',
    bodyHtml
  });
}

/**
 * Renders `/dsp-verification` page with interactive & print-ready catalog table.
 * @param {any} masterCatalog
 * @returns {string}
 */
export function renderDspVerificationPage(masterCatalog) {
  const artists = Array.isArray(masterCatalog?.artists) ? masterCatalog.artists : [];
  let rowsHtml = '';
  let totalTracks = 0;

  for (const artist of artists) {
    const albums = Array.isArray(artist.albums) ? artist.albums : [];
    for (const album of albums) {
      const tracks = Array.isArray(album.tracks) ? album.tracks : [];
      for (const track of tracks) {
        totalTracks += 1;
        rowsHtml += `
          <tr data-artist="${escapeHtml(artist.slug || '')}" data-album="${escapeHtml(album.slug || '')}" data-track="${escapeHtml(track.slug || '')}">
            <td><code>${escapeHtml(track.errId || artist.errId || 'ERR')}</code></td>
            <td><strong>${escapeHtml(track.title || '')}</strong></td>
            <td>${escapeHtml(artist.name || '')}</td>
            <td>${escapeHtml(album.title || '')} (${escapeHtml(String(album.narrativeYear || ''))})</td>
            <td><code>${escapeHtml(track.isrc || 'Pending')}</code></td>
            <td>${escapeHtml(track.duration || '')}</td>
          </tr>`;
      }
    }
  }

  const bodyHtml = `
    <section class="hero-card" aria-labelledby="dsp-heading">
      <span class="eyebrow">Administrative Chain-of-Custody &amp; Copyright Dossier</span>
      <h1 id="dsp-heading">DSP Identity, ISRC &amp; Commercial Rights Verification</h1>
      <p class="lead">
        Official verification portal for Digital Service Providers (Spotify, Apple Music, Amazon Music, YouTube Music, DistroKid) confirming that <strong>Michael P. Ragsdale</strong> is the sole real-world human owner, copyright holder, and commercial rights registrant for all releases under the <strong>Engine Room Records</strong> imprint (${totalTracks} registered works).
      </p>
      <div class="btn-row no-print">
        <button type="button" class="btn btn-primary" onclick="window.print()">
          🖨️ Print / Save Official PDF Verification Dossier
        </button>
        <a href="/data/master-catalog.json" class="btn" target="_blank" rel="noopener noreferrer">
          📦 Raw JSON Ledger (master-catalog.json) ↗
        </a>
      </div>
    </section>

    <section class="section-block" aria-labelledby="affidavit-heading">
      <div class="callout-box card-accent-emerald">
        <h2 id="affidavit-heading" style="font-size: 1.2rem; margin-bottom: 0.5rem;">Official Chain-of-Custody Statement for Content Review Teams</h2>
        <ul style="margin: 0; padding-left: 1.3rem; font-size: 0.9rem; color: var(--text-secondary); display: grid; gap: 0.4rem;">
          <li><strong>Real-World Owner &amp; Claimant:</strong> Michael P. Ragsdale (<a href="https://raggiesoft.com">https://raggiesoft.com</a> / <a href="https://michaelpragsdale.com">https://michaelpragsdale.com</a>)</li>
          <li><strong>Record Imprint Name:</strong> Engine Room Records (Real-world brand name; <em>Engine Room Records, LLC</em> is strictly a work of fiction).</li>
          <li><strong>Commercial AI Generation Clearance:</strong> All audio tracks are produced using Michael P. Ragsdale's paid commercial Suno Studio subscription with full commercial distribution rights assigned to the subscriber under Suno's Terms of Service.</li>
          <li><strong>Fictitious Band &amp; Narrative Disclosure:</strong> All band names (<em>The Stardust Engine</em>, <em>Fractured Prisms</em>, <em>The Paper Wall</em>, <em>The Arctic Symphony Project</em>, <em>Crimson Node</em>, <em>Mana Canvas</em>, and <em>Firelight</em>) and character biographies are original works of fiction created by Michael P. Ragsdale.</li>
        </ul>
      </div>
    </section>

    <section class="section-block" aria-labelledby="ledger-heading">
      <div class="section-header">
        <span class="eyebrow">Master Registry • Filterable by URL Params (?artist=, ?album=, ?track=)</span>
        <h2 id="ledger-heading">Registered Catalog &amp; ISRC Ledger (${totalTracks} Tracks)</h2>
        <div class="no-print" style="margin-top: 0.75rem;">
          <label for="dsp-search" style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 0.35rem;">
            Filter by ISRC, Track Title, Artist, or Album:
          </label>
          <input
            type="search"
            id="dsp-search"
            placeholder="e.g. QZRP52580801, Escape Velocity, Fractured Prisms..."
            style="width: 100%; max-width: 520px; padding: 0.55rem 0.85rem; border-radius: 0.5rem; border: 1px solid var(--border-strong); background: var(--bg-elevated); color: var(--text-primary);"
          />
        </div>
      </div>

      <div class="table-wrap">
        <table id="dsp-ledger-table">
          <thead>
            <tr>
              <th scope="col">ERR-ID</th>
              <th scope="col">Track Title</th>
              <th scope="col">Artist Project</th>
              <th scope="col">Album (Lore Year)</th>
              <th scope="col">ISRC</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </section>
  `;

  return renderDocumentShell({
    title: 'DSP Identity & Copyright Verification | Engine Room Records',
    description: 'Official administrative portal for DSP identity, ISRC registry, and chain-of-custody verification for Engine Room Records.',
    canonicalPath: '/dsp-verification',
    bodyHtml
  });
}

