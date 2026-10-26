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
 * Renders `/dsp-verification` page with interactive & print-ready catalog table,
 * plus full support for `?artist=`, `?album=`, and `?track=` URL query parameters
 * used by Cloudflare DSP verification redirects (`fracturedprisms.com/dsp-verification`,
 * `thestardustengine.com/dsp-verification`, etc.) and DistroKid/Spotify/Apple Music review links.
 * @param {any} masterCatalog
 * @returns {string}
 */
export function renderDspVerificationPage(masterCatalog) {
  const flatTracks = Array.isArray(masterCatalog) ? masterCatalog : [];
  let rowsHtml = '';
  let totalTracks = flatTracks.length;

  for (const item of flatTracks) {
    const artistSlug = String(item.artistSlug || '');
    const albumSlug = String(item.albumSlug || '');
    const trackSlug = String(item.trackSlug || '');
    const affidavitUrl = `/dsp-verification?artist=${encodeURIComponent(artistSlug)}&album=${encodeURIComponent(albumSlug)}&track=${encodeURIComponent(trackSlug)}`;
    rowsHtml += `
      <tr
        data-artist="${escapeHtml(artistSlug)}"
        data-artist-name="${escapeHtml(item.artistPersona || '')}"
        data-album="${escapeHtml(albumSlug)}"
        data-album-title="${escapeHtml(item.albumTitle || '')}"
        data-track="${escapeHtml(trackSlug)}"
        data-track-title="${escapeHtml(item.trackTitle || '')}"
        data-err-id="${escapeHtml(item.err_id || 'ERR')}"
        data-isrc="${escapeHtml(item.isrc || 'Pending')}"
        data-upc="${escapeHtml(item.albumUPC || 'N/A')}"
        data-distributor="${escapeHtml(item.distributor || 'DistroKid')}"
        data-clearance="${escapeHtml(item.aiClearance || 'Suno Commercial Pro Plan')}"
        data-release-date="${escapeHtml(item.realReleaseDate || '')}"
      >
        <td><a href="/isrc?code=${encodeURIComponent(item.err_id || '')}" title="Inspect ERR Catalog Number ${escapeHtml(item.err_id || 'ERR')} in the ISRC &amp; Catalog Decoder" style="text-decoration: none;"><code style="color: var(--accent-primary);">${escapeHtml(item.err_id || 'ERR')}</code></a></td>
        <td><a href="/isrc?code=${encodeURIComponent(item.isrc || '')}" title="Inspect ISRC ${escapeHtml(item.isrc || 'Pending')} in the ISRC &amp; Catalog Decoder" style="text-decoration: none;"><code style="color: var(--accent-amber); font-weight: 700;">${escapeHtml(item.isrc || 'Pending')}</code></a></td>
        <td>
          <strong><a href="${escapeHtml(affidavitUrl)}" style="color: var(--accent-primary); text-decoration: none;">${escapeHtml(item.trackTitle || '')}</a></strong>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">UPC: <code>${escapeHtml(item.albumUPC || 'N/A')}</code> • ${escapeHtml(item.realReleaseDate || '')}</div>
        </td>
        <td>
          <a href="/dsp-verification?artist=${encodeURIComponent(artistSlug)}" style="color: var(--text-primary); font-weight: 600; text-decoration: none;">${escapeHtml(item.artistPersona || '')}</a>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">${escapeHtml(item.albumTitle || '')}</div>
        </td>
        <td>
          <span class="badge">${escapeHtml(item.distributor || 'DistroKid')}</span>
          <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 0.2rem;">${escapeHtml(item.aiClearance || 'Suno Commercial Pro')}</div>
        </td>
        <td class="no-print">
          <a href="${escapeHtml(affidavitUrl)}" class="btn" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;">📄 Affidavit</a>
        </td>
      </tr>`;
  }

  const bodyHtml = `
    <section class="hero-card" aria-labelledby="dsp-heading">
      <span class="eyebrow">Administrative Chain-of-Custody &amp; Copyright Dossier</span>
      <h1 id="dsp-heading">DSP Identity, ISRC &amp; Commercial Rights Verification</h1>
      <p class="lead">
        Official verification portal for Digital Service Providers and our Sole Authorized Distributor (<strong>DistroKid</strong>, plus Spotify for Artists, Apple Music for Artists, Amazon Music, and YouTube Music) confirming that <strong>Michael P. Ragsdale</strong> (<code>dsp.operations@engineroom-records.com</code>) is the sole real-world human owner, songwriter, copyright holder, and commercial rights registrant for all artist profiles and releases under the <strong>Engine Room Records</strong> imprint (${totalTracks} registered works).
      </p>
      <div class="btn-row no-print">
        <button type="button" class="btn btn-primary" onclick="window.print()">
          🖨️ Print / Save Official PDF Verification Dossier
        </button>
        <a href="/isrc" class="btn btn-amber">
          🏷️ Official US ISRC Prefix Explainer (QTAHP) →
        </a>
        <a href="/dsp-verification" class="btn" id="dsp-reset-filter-btn" style="display: none;">
          🔄 View Full Master Catalog (${totalTracks} Tracks)
        </a>
        <a href="/data/master-catalog.json" class="btn" target="_blank" rel="noopener noreferrer">
          📦 Raw JSON Ledger (master-catalog.json) ↗
        </a>
      </div>
    </section>

    <!-- Dynamic Artist Direct Claim Callout (Populated when ?artist=<slug> is present) -->
    <section id="dsp-artist-claim-section" class="section-block" style="display: none;" aria-live="polite">
      <div class="callout-box card-accent-amber" style="border-width: 2px;">
        <span class="eyebrow">DSP Artist Profile Claim Verification</span>
        <h2 id="dsp-artist-claim-title" style="font-size: 1.35rem; margin-bottom: 0.5rem;">Notice to Platform Verification Teams</h2>
        <p id="dsp-artist-claim-body" style="font-size: 0.95rem; margin-bottom: 0.75rem;"></p>
        <div class="grid-3" style="font-size: 0.86rem;">
          <div class="card" style="padding: 0.85rem;">
            <strong>Legal Owner &amp; Claimant</strong>
            <div style="color: var(--text-secondary);">Michael P. Ragsdale (Sole Proprietor)<br><a href="mailto:dsp.operations@engineroom-records.com">dsp.operations@engineroom-records.com</a></div>
          </div>
          <div class="card" style="padding: 0.85rem;">
            <strong>Record Imprint</strong>
            <div style="color: var(--text-secondary);">Engine Room Records (Real-World Brand)<br><a href="https://engineroom-records.com/">engineroom-records.com</a> / <a href="https://engineroom.raggiesoft.com">engineroom.raggiesoft.com</a></div>
          </div>
          <div class="card" style="padding: 0.85rem;">
            <strong>US ISRC Agency &amp; Distribution</strong>
            <div style="color: var(--text-secondary);">US ISRC Prefix: <a href="/isrc"><code>QTAHP</code> (Reg. ID <code>185611</code>)</a><br>DistroKid (Sole Authorized Distributor) • 100% Master &amp; Publishing</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dynamic Single-Track Affidavit View (Populated when ?artist=...&album=...&track=... is present) -->
    <section id="dsp-track-affidavit-section" class="section-block" style="display: none;" aria-live="polite">
      <div class="hero-card card-accent-emerald" style="border: 2px solid var(--accent-emerald);">
        <span class="eyebrow">Official Track-Level Chain-of-Custody Affidavit</span>
        <h2 id="dsp-affidavit-track-title" style="font-size: 1.5rem; margin-bottom: 0.35rem;">Track Verification Affidavit</h2>
        <p id="dsp-affidavit-subtitle" class="lead" style="font-size: 1rem; margin-bottom: 1rem;"></p>
        <div class="grid-2" id="dsp-affidavit-details" style="margin-bottom: 1rem;"></div>
        <div class="callout-box" style="margin-bottom: 0;">
          <strong>Declaration of Commercial Rights &amp; Origin:</strong>
          <p style="margin: 0.35rem 0 0; font-size: 0.9rem; color: var(--text-secondary);">
            I, <strong>Michael P. Ragsdale</strong> (<code>dsp.operations@engineroom-records.com</code> • Official US ISRC Agency Registrant ID <code>185611</code>, Allocated Prefix <code>QTAHP</code>), hereby certify under penalty of perjury that I am the sole creator, producer, and legal owner of this sound recording and underlying composition. All generative audio components were synthesized under an active, paid commercial <strong>Suno Pro / Premier Studio</strong> subscription granting 100% commercial ownership and monetization clearance, combined with human lyric authoring, phonetic arrangement, and local digital signal processing (DSP) mastering.
          </p>
        </div>
      </div>
    </section>

    <section class="section-block" aria-labelledby="affidavit-heading">
      <div class="callout-box card-accent-emerald">
        <h2 id="affidavit-heading" style="font-size: 1.2rem; margin-bottom: 0.5rem;">Official Chain-of-Custody &amp; Dual Timelines Statement for Content Review Teams</h2>
        <ul style="margin: 0; padding-left: 1.3rem; font-size: 0.9rem; color: var(--text-secondary); display: grid; gap: 0.45rem;">
          <li><strong>Real-World Owner &amp; Claimant:</strong> Michael P. Ragsdale (<a href="https://engineroom-records.com/">https://engineroom-records.com</a> / <a href="https://raggiesoft.com">https://raggiesoft.com</a> / <a href="https://michaelpragsdale.com">https://michaelpragsdale.com</a>) • Official DistroKid &amp; DSP Operations Contact: <a href="mailto:dsp.operations@engineroom-records.com">dsp.operations@engineroom-records.com</a></li>
          <li><strong>Sole Authorized Distributor (DistroKid) &amp; Active DSP Roster Verification:</strong> The <strong>DistroKid</strong> account registered to <strong>Michael Ragsdale</strong> (<code>dsp.operations@engineroom-records.com</code>) is the sole entity authorized by the copyright owner to claim, administer, and distribute all 8 Engine Room Records artist profiles to DSPs—including all 5 roster artists with active DSP profiles: (1) <strong>The Stardust Engine</strong> (Spotify Artist ID <code>7Lr6o5qOo1OgVQGumUjFFT</code> • Apple Music ID <code>1889194363</code> • <a href="https://thestardustengine.com">thestardustengine.com</a>); (2) <strong>The Paper Wall</strong> (Spotify Album IDs <code>3AXeGI3wpwpBjfpm1Ansnr</code>, <code>5A9hnaTMfrF7p99uyAR5AG</code>, <code>5N0GMm7fd7cPms8jqlYh6M</code>, <code>5lxSx8MezosR2RUNyBQAgB</code>, <code>7GyxW6QnkarySeooPmEkCs</code>); (3) <strong>Fractured Prisms</strong> (Spotify Album ID <code>4G2HvFggcDQf4q3vomSHH6</code> • Apple Music ID <code>1895041529</code> • UPC <code>825324041559</code> • <a href="https://fracturedprisms.com">fracturedprisms.com</a>); (4) <strong>Crimson Node</strong> (Spotify Album ID <code>448KLGl3955P1ywJXhTmII</code> • Apple Music ID <code>6809679637</code> • UPC <code>700299546240</code>); and (5) <strong>Mana Canvas</strong> (<em>Runebreaker</em> — Spotify Album ID <code>3NmbtTmm70oBp5oIR8kFZG</code> • Apple Music ID <code>6821775434</code> • Amazon Music ID <code>B0HMPHJB3C</code> • UPC <code>700521520499</code> • ISRCs <code>QTA7V2622545</code>–<code>QTA7V2622568</code>)—as well as <strong>Firelight</strong>, <strong>The Arctic Symphony Project</strong>, and <strong>The Hoshizora Ensemble</strong>.</li>
          <li><strong>Official US ISRC Agency Registrant Allocation (<a href="/isrc">Read Full QTAHP ISRC Architecture &amp; Registry →</a>):</strong> Registrant Name: <strong>Michael Ragsdale</strong> • Registrant ID: <code>185611</code> • Allocated US ISRC Prefix: <strong><a href="/isrc"><code>QTAHP</code></a></strong> (Allocated <code>2026-10-20 02:02:28 UTC</code> via <a href="https://usisrc.org" target="_blank" rel="noopener noreferrer">US ISRC Agency</a> to <code>dsp.operations@engineroom-records.com</code>). Direct first-party recordings mint sequential ISRCs under <code>QTAHP26xxxxx</code> alongside legacy aggregator-assigned <code>QZW...</code> / <code>QZR...</code> / <code>QTA7V...</code> ISRCs.</li>
          <li><strong>Record Imprint Name:</strong> Engine Room Records (Real-world brand name; <em>Engine Room Records, LLC</em> is strictly a work of fiction).</li>
          <li><strong>Dual Timelines Policy (1976–2016 Lore Eras vs. 2026 Real-World Production):</strong> Historical dates displayed in album URLs and narrative descriptions (e.g., <strong>2001</strong> for <em>Midnight Drivers</em> and <strong>2011</strong> for <em>Starfield Calibration</em>) represent fictional <strong>In-Universe Narrative Lore Eras</strong> (<code>schema:temporalCoverage</code>) within the Ocean View Archives Rock Opera universe. <strong>100% of all sound recordings, lyrics, melodies, and masters were created and produced in 2026</strong> (<code>schema:datePublished: 2026</code>) by Michael P. Ragsdale.</li>
          <li><strong>First-Party Remaster Chain of Custody (<em>&ldquo;The Horizon Line&rdquo;</em> • DistroKid Ref: Z0MB5RT4):</strong> (1) Michael P. Ragsdale&rsquo;s original song <strong>&ldquo;The Horizon Line&rdquo;</strong> on <em>Midnight Drivers</em> (<code>ERR-001-2001-105</code>, DistroKid ISRC <code>QZWFW2601360</code>, UPC <code>825324114857</code>) came first, released via DistroKid on <strong>2026-05-01</strong>. (2) A third-party artist (<code>coffeeandpop</code>) subsequently released an independent Suno AI generation titled <em>&ldquo;Horizon Line&rdquo;</em> on <strong>2026-06-23</strong> (UPC <code>882518230267</code>) that shares only the common song title and Suno&rsquo;s synthesized female vocal model. (3) Track 13 on <em>Starfield Calibration</em> (<strong>&ldquo;The Horizon Line [Cosmic Tidal Lock Mix]&rdquo;</strong>, <code>ERR-001-2011-113</code>, UPC <code>700299965607</code>, uploaded <strong>2026-10-17</strong>) is a 100% first-party studio remaster of Michael P. Ragsdale&rsquo;s own May 1, 2026 song (<code>ISRC: QZWFW2601360</code>); neither artist sampled or copied from the other.</li>
          <li><strong>Commercial AI Generation Clearance:</strong> All audio tracks are produced using Michael P. Ragsdale's paid commercial Suno Studio subscription with full commercial distribution rights assigned to the subscriber under Suno's Terms of Service, with zero third-party samples or stems.</li>
          <li><strong>Fictitious Band &amp; Narrative Disclosure:</strong> All band names (<em>The Stardust Engine</em>, <em>Fractured Prisms</em>, <em>The Paper Wall</em>, <em>The Arctic Symphony Project</em>, <em>Crimson Node</em>, <em>Mana Canvas</em>, <em>The Hoshizora Ensemble</em>, and <em>Firelight</em>) and character biographies are original works of fiction created by Michael P. Ragsdale.</li>
        </ul>
      </div>
      <div class="btn-row no-print" style="margin-top: 0.85rem;">
        <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); align-self: center;">Quick Artist Claim Filters:</span>
        <a href="/dsp-verification/?artist=the-stardust-engine" class="btn" style="padding: 0.35rem 0.7rem; font-size: 0.8rem;">🚀 The Stardust Engine</a>
        <a href="/dsp-verification/?artist=fractured-prisms" class="btn" style="padding: 0.35rem 0.7rem; font-size: 0.8rem;">💎 Fractured Prisms</a>
        <a href="/dsp-verification/?artist=the-paper-wall" class="btn" style="padding: 0.35rem 0.7rem; font-size: 0.8rem;">🧱 The Paper Wall</a>
        <a href="/dsp-verification/?artist=the-arctic-symphony-project" class="btn" style="padding: 0.35rem 0.7rem; font-size: 0.8rem;">❄️ The Arctic Symphony Project</a>
        <a href="/dsp-verification/?artist=crimson-node" class="btn" style="padding: 0.35rem 0.7rem; font-size: 0.8rem;">🔴 Crimson Node</a>
        <a href="/dsp-verification/?artist=mana-canvas" class="btn" style="padding: 0.35rem 0.7rem; font-size: 0.8rem;">🎨 Mana Canvas</a>
        <a href="/dsp-verification/?artist=the-hoshizora-ensemble" class="btn" style="padding: 0.35rem 0.7rem; font-size: 0.8rem;">⛴️ The Hoshizora Ensemble</a>
        <a href="/dsp-verification/?artist=firelight" class="btn" style="padding: 0.35rem 0.7rem; font-size: 0.8rem;">🔥 Firelight</a>
      </div>
    </section>

    <section class="section-block" aria-labelledby="ledger-heading">
      <div class="section-header">
        <span class="eyebrow">Master Registry • Filterable by URL Params (?artist=, ?album=, ?track=)</span>
        <h2 id="ledger-heading">Registered Catalog &amp; ISRC Ledger (<span id="dsp-visible-count">${totalTracks}</span> of ${totalTracks} Tracks)</h2>
        <div class="no-print" style="margin-top: 0.75rem;">
          <label for="dsp-search" style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 0.35rem;">
            Filter by ISRC, UPC, ERR-ID, Track Title, Artist, or Album:
          </label>
          <input
            type="search"
            id="dsp-search"
            placeholder="e.g. QTAHP2600001, QZRP52580801, Escape Velocity, Fractured Prisms..."
            style="width: 100%; max-width: 560px; padding: 0.55rem 0.85rem; border-radius: 0.5rem; border: 1px solid var(--border-strong); background: var(--bg-elevated); color: var(--text-primary);"
          />
        </div>
      </div>

      <div class="table-wrap">
        <table id="dsp-ledger-table">
          <thead>
            <tr>
              <th scope="col">ERR-ID</th>
              <th scope="col">ISRC</th>
              <th scope="col">Track Title &amp; Release UPC</th>
              <th scope="col">Artist Persona &amp; Album</th>
              <th scope="col">Aggregator &amp; AI Clearance</th>
              <th scope="col" class="no-print">Dossier</th>
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

/**
 * Renders `/isrc` page explaining Michael P. Ragsdale's official US ISRC Agency
 * Registrant Prefix (`QTAHP`, Registrant ID `185611`), ISO 3901:2019 structure,
 * the Interactive Client-Side ISRC & ERR Catalog ID Decoder (`?code=`),
 * the Real-World `Engine Room Records` vs. Fictional `Engine Room Records, LLC`
 * distinction (and shared `ERR` catalog numbers), the Permanent Single-ISRC Rule,
 * the Dual Timelines Policy, Harper's automated binary tagging pipeline, and the
 * live allocation table of all `QTAHP` recordings.
 *
 * @param {any} masterCatalog
 * @returns {string}
 */
export function renderIsrcExplainerPage(masterCatalog) {
  const flatTracks = Array.isArray(masterCatalog) ? masterCatalog : [];

  // Group all tracks that have a QTAHP ISRC by their ISRC code, sorted numerically
  const byIsrc = new Map();
  let legacyCount = 0;
  for (const item of flatTracks) {
    const code = String(item.isrc || '').trim();
    if (code.startsWith('QTAHP')) {
      if (!byIsrc.has(code)) {
        byIsrc.set(code, []);
      }
      byIsrc.get(code).push(item);
    } else if (code && code !== 'Pending') {
      legacyCount++;
    }
  }

  const sortedQtahpCodes = Array.from(byIsrc.keys()).sort((a, b) => a.localeCompare(b));
  const highestCode = sortedQtahpCodes.length > 0 ? sortedQtahpCodes[sortedQtahpCodes.length - 1] : 'QTAHP2600001';

  // Compact JSON payload for the instantaneous client-side ISRC & ERR-ID decoder
  const decoderPayload = flatTracks.map((t) => ({
    err_id: String(t.err_id || ''),
    isrc: String(t.isrc || ''),
    upc: String(t.albumUPC || ''),
    title: String(t.taggedTitle || t.trackTitle || ''),
    album: String(t.albumTitle || ''),
    artist: String(t.artistPersona || ''),
    artistSlug: String(t.artistSlug || ''),
    albumSlug: String(t.albumSlug || ''),
    trackSlug: String(t.trackSlug || ''),
    distributor: String(t.distributor || 'Engine Room Records'),
    clearance: String(t.aiClearance || 'Cleared - Suno Commercial Premium License'),
    date: String(t.realReleaseDate || '2026')
  }));
  const safeJsonPayload = JSON.stringify(decoderPayload).replace(/</g, '\\u003c');

  const qtahpRowsHtml = sortedQtahpCodes
    .map((code) => {
      const entries = byIsrc.get(code) || [];
      const primary = entries[0];
      const artistSlug = String(primary.artistSlug || '');
      const albumSlug = String(primary.albumSlug || '');
      const trackSlug = String(primary.trackSlug || '');
      const listeningUrl = `https://music.raggiesoft.com/artists/${encodeURIComponent(artistSlug)}/${encodeURIComponent(albumSlug)}?track=${encodeURIComponent(trackSlug)}`;
      const affidavitUrl = `/dsp-verification?artist=${encodeURIComponent(artistSlug)}&album=${encodeURIComponent(albumSlug)}&track=${encodeURIComponent(trackSlug)}`;

      const releasesHtml = entries
        .map((e) => {
          const eListen = `https://music.raggiesoft.com/artists/${encodeURIComponent(e.artistSlug || '')}/${encodeURIComponent(e.albumSlug || '')}?track=${encodeURIComponent(e.trackSlug || '')}`;
          const errCode = String(e.err_id || '');
          return `<div><a href="${escapeHtml(eListen)}" target="_blank" rel="noopener noreferrer" style="font-weight: 600;">${escapeHtml(e.albumTitle || '')}</a> <a href="/isrc?code=${encodeURIComponent(errCode)}" data-decode-code="${escapeHtml(errCode)}" title="Decode ${escapeHtml(errCode)}" style="font-size: 0.76rem; color: var(--text-secondary); text-decoration: none;">(<code>${escapeHtml(errCode)}</code>)</a></div>`;
        })
        .join('');

      return `
        <tr>
          <td><a href="/isrc?code=${encodeURIComponent(code)}" data-decode-code="${escapeHtml(code)}" title="Inspect ${escapeHtml(code)} in the Interactive Decoder" style="text-decoration: none;"><code style="font-weight: 700; color: var(--accent-amber);">${escapeHtml(code)}</code></a></td>
          <td>
            <strong><a href="${escapeHtml(listeningUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary); text-decoration: none;">${escapeHtml(primary.taggedTitle || primary.trackTitle || '')} ↗</a></strong>
            ${
              entries.length > 1
                ? `<div style="font-size: 0.75rem; color: var(--accent-emerald); margin-top: 0.15rem;">✦ Shared across ${entries.length} releases under the Permanent Single-ISRC Rule</div>`
                : ''
            }
          </td>
          <td>
            <strong>${escapeHtml(primary.artistPersona || '')}</strong>
            <div style="font-size: 0.8rem; margin-top: 0.15rem;">${releasesHtml}</div>
          </td>
          <td>
            <span class="badge">${escapeHtml(primary.realReleaseDate || '2026')}</span>
          </td>
          <td class="no-print">
            <div class="btn-row" style="gap: 0.35rem;">
              <button type="button" class="btn" data-decode-code="${escapeHtml(code)}" style="padding: 0.28rem 0.6rem; font-size: 0.76rem;">🔎 Decode</button>
              <a href="${escapeHtml(listeningUrl)}" class="btn btn-primary" style="padding: 0.28rem 0.6rem; font-size: 0.76rem;" target="_blank" rel="noopener noreferrer">🎧 Listen ↗</a>
              <a href="${escapeHtml(affidavitUrl)}" class="btn" style="padding: 0.28rem 0.6rem; font-size: 0.76rem;">📄 Affidavit</a>
            </div>
          </td>
        </tr>`;
    })
    .join('\n');

  const bodyHtml = `
    <nav aria-label="Breadcrumb" style="margin-bottom: 1rem; font-size: 0.85rem;">
      <a href="/">Engine Room Records</a> &rsaquo; <a href="/dsp-verification">DSP Verification</a> &rsaquo; <strong>Official US ISRC Prefix (QTAHP) &amp; ERR Catalog Registry</strong>
    </nav>

    <section class="hero-card" aria-labelledby="isrc-heading">
      <span class="eyebrow">ISO 3901:2019 Standard • US ISRC Agency Registrant #185611</span>
      <h1 id="isrc-heading">Official US ISRC Registrant Prefix: <code>QTAHP</code> &amp; <code>ERR</code> Catalog Registry</h1>
      <p class="lead">
        On October 20, 2026, the official <a href="https://usisrc.org" target="_blank" rel="noopener noreferrer">United States ISRC Agency</a> allocated the permanent Registrant Code <strong><code>AHP</code></strong> (Country + Registrant Prefix: <strong><code>QTAHP</code></strong>) to <strong>Michael Ragsdale</strong> (<strong>Engine Room Records</strong>). Every sound recording minted under the <code>QTAHP</code> prefix is 100% independently produced, mastered, and owned by Michael P. Ragsdale.
      </p>
      <div class="btn-row no-print">
        <a href="#isrc-decoder-section" class="btn btn-amber">
          🔎 Interactive ISRC &amp; ERR-ID Decoder ↓
        </a>
        <a href="/dsp-verification" class="btn btn-primary">
          🔍 Open Full DSP Chain-of-Custody &amp; ISRC Ledger (${flatTracks.length} Tracks) →
        </a>
        <a href="https://music.raggiesoft.com" class="btn" target="_blank" rel="noopener noreferrer">
          🎧 Stream Catalog in The Listening Room ↗
        </a>
        <a href="/studio-engineering" class="btn">
          🎛️ Studio Engineering &amp; Harper Pipeline →
        </a>
      </div>
    </section>

    <!-- Interactive Client-Side ISRC & ERR Catalog ID Decoder -->
    <section id="isrc-decoder-section" class="section-block" aria-labelledby="decoder-heading">
      <div class="callout-box card-accent-amber" style="border-width: 2px; padding: 1.5rem;">
        <div class="section-header" style="margin-bottom: 1rem;">
          <span class="eyebrow">Interactive Inspector • Supports ?code= Deep Links from The Listening Room</span>
          <h2 id="decoder-heading" style="margin-bottom: 0.35rem;">Interactive ISRC &amp; <code>ERR</code> Catalog Number Decoder</h2>
          <p style="margin: 0; color: var(--text-secondary); font-size: 0.92rem;">
            Paste or click any Engine Room Records <strong>ISRC</strong> (first-party <code>QTAHP26xxxxx</code> or legacy distributor-assigned <code>QZW...</code> / <code>QZR...</code> / <code>QTA7V...</code>) or <strong><code>ERR</code> Catalog Number</strong> (<code>ERR-001-2015-101</code>) to inspect its ISO 3901:2019 segments, catalog anatomy, and verified chain-of-custody record across all ${flatTracks.length} tracks.
          </p>
        </div>

        <div class="no-print" style="display: flex; flex-wrap: wrap; gap: 0.65rem; align-items: center; margin-bottom: 0.85rem;">
          <label for="isrc-decoder-input" class="sr-only" style="font-weight: 700; font-size: 0.85rem;">Enter ISRC or ERR Catalog ID:</label>
          <input
            type="search"
            id="isrc-decoder-input"
            value="QTAHP2600046"
            placeholder="Enter ISRC (e.g. QTAHP2600046, QZWFW2601360) or ERR-ID (e.g. ERR-001-2015-101)..."
            aria-label="Enter an ISRC code or ERR catalog number to decode"
            style="flex: 1 1 320px; max-width: 520px; padding: 0.65rem 0.95rem; border-radius: 0.5rem; border: 1px solid var(--border-strong); background: var(--bg-elevated); color: var(--text-primary); font-family: monospace; font-size: 1rem; font-weight: 700;"
          />
          <button type="button" id="isrc-decoder-btn" class="btn btn-primary" style="padding: 0.65rem 1.1rem;">
            🔎 Decode Identifier
          </button>
        </div>

        <div class="btn-row no-print" style="gap: 0.45rem; margin-bottom: 1.15rem;">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); align-self: center;">Sample Identifiers:</span>
          <button type="button" class="btn" data-decode-code="QTAHP2600046" style="padding: 0.25rem 0.6rem; font-size: 0.76rem;"><code>QTAHP2600046</code> (Reignition Track 1)</button>
          <button type="button" class="btn" data-decode-code="QTAHP2600001" style="padding: 0.25rem 0.6rem; font-size: 0.76rem;"><code>QTAHP2600001</code> (First QTAHP Code)</button>
          <button type="button" class="btn" data-decode-code="QTAHP2600037" style="padding: 0.25rem 0.6rem; font-size: 0.76rem;"><code>QTAHP2600037</code> (Shared Dual-Release Master)</button>
          <button type="button" class="btn" data-decode-code="ERR-001-2015-101" style="padding: 0.25rem 0.6rem; font-size: 0.76rem;"><code>ERR-001-2015-101</code> (Decode by ERR-ID)</button>
          <button type="button" class="btn" data-decode-code="QZWFW2601360" style="padding: 0.25rem 0.6rem; font-size: 0.76rem;"><code>QZWFW2601360</code> (Legacy DistroKid ISRC)</button>
        </div>

        <div id="isrc-decoder-result" aria-live="polite"></div>
      </div>
    </section>

    <script id="err-isrc-catalog-data" type="application/json">${safeJsonPayload}</script>

    <!-- Section 1: Official Registrant Credential Card -->
    <section class="section-block" aria-labelledby="credential-heading">
      <div class="section-header">
        <span class="eyebrow">1. Official Registration Certificate Summary</span>
        <h2 id="credential-heading">US ISRC Agency Registrant Credentials</h2>
      </div>
      <div class="grid-3">
        <article class="card card-accent-amber">
          <div>
            <span class="badge" style="margin-bottom: 0.5rem;">Allocated Prefix</span>
            <h3 style="font-size: 1.5rem; margin: 0 0 0.35rem; font-family: monospace;">QTAHP</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">
              Composed of Country Code <code>QT</code> (United States, assigned by IFPI / ISO 3901) + Permanent Registrant Code <code>AHP</code>. Capacity: <strong>100,000 unique sound recordings per calendar year</strong> (<code>00001</code>–<code>99999</code>).
            </p>
          </div>
        </article>
        <article class="card card-accent-primary">
          <div>
            <span class="badge" style="margin-bottom: 0.5rem;">Registrant of Record</span>
            <h3 style="font-size: 1.2rem; margin: 0 0 0.35rem;">Michael Ragsdale (ID #185611)</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">
              Allocated <code>2026-10-20 02:02:28 UTC</code> via RIAA / US ISRC Agency (<a href="https://usisrc.org" target="_blank" rel="noopener noreferrer">usisrc.org</a>).<br />
              <strong>Imprint:</strong> Engine Room Records (Real-World Brand)<br />
              <strong>DSP Contact:</strong> <a href="mailto:dsp.operations@engineroom-records.com">dsp.operations@engineroom-records.com</a>
            </p>
          </div>
        </article>
        <article class="card card-accent-emerald">
          <div>
            <span class="badge" style="margin-bottom: 0.5rem;">Active Registry Status</span>
            <h3 style="font-size: 1.2rem; margin: 0 0 0.35rem;">${sortedQtahpCodes.length} Direct <code>QTAHP</code> Masters</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">
              Currently allocated from <code>QTAHP2600001</code> through <code>${escapeHtml(highestCode)}</code>, alongside <strong>${legacyCount}</strong> previously published recordings retaining their original distributor-suballocated ISRCs (<code>QZW...</code> / <code>QZR...</code> / <code>QTA7V...</code>).
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- Section 2: Real-World Engine Room Records vs. Fictional Engine Room Records, LLC & Shared ERR Catalog Numbers -->
    <section class="section-block" aria-labelledby="layers-heading">
      <div class="section-header">
        <span class="eyebrow">2. Real-World Administration vs. In-Universe World-Building</span>
        <h2 id="layers-heading">Real-World <strong>Engine Room Records</strong> vs. Fictional <em>Engine Room Records, LLC</em> — And How <code>ERR</code> Catalog Numbers Bridge Both</h2>
        <p style="margin: 0; color: var(--text-secondary);">
          Because our projects weave concept albums into interconnected novels and archival lore, we maintain a strict, transparent boundary between our real-world legal administration and our fictional narrative universe—while using a unified <strong><code>ERR</code> Catalog Numbering System</strong> across both.
        </p>
      </div>

      <div class="grid-3" style="margin-bottom: 1.25rem;">
        <article class="card card-accent-primary">
          <div>
            <span class="badge" style="margin-bottom: 0.45rem;">Real-World Layer (Non-Fiction)</span>
            <h3>Engine Room Records (Michael P. Ragsdale)</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              In the real world, there is only <strong>Engine Room Records</strong> (never with <em>&ldquo;LLC&rdquo;</em>). It is the real-world creative brand and publishing imprint of sole human creator <strong>Michael P. Ragsdale</strong>.
            </p>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">
              All real-world identifiers—including US ISRC Agency Prefix <strong><code>QTAHP</code> (Registrant #185611)</strong>, GS1/distributor UPC barcodes, and our sole authorized distributor account on <strong>DistroKid</strong>—belong strictly to <strong>Michael P. Ragsdale</strong>.
            </p>
          </div>
        </article>

        <article class="card card-accent-amber">
          <div>
            <span class="badge" style="margin-bottom: 0.45rem;">In-Universe Layer (100% Fiction)</span>
            <h3><em>Engine Room Records, LLC</em> (Holly O&rsquo;Connell)</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              Anything with <strong><code>LLC</code></strong>, <strong><code>Trust</code></strong>, or <strong><code>Holdings</code></strong> in its name (including <em>Engine Room Records, LLC</em>, <em>The O&rsquo;Connell Family, LLC</em>, <em>Artists First Management, LLC</em>, and <em>Stardust Properties, LLC</em>) is strictly a <strong>fictitious, in-universe narrative entity</strong>.
            </p>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">
              In our stories, <em>Engine Room Records, LLC</em> was founded in 1992 by the fictional character <strong>Holly O&rsquo;Connell</strong> to rescue <em>The Stardust Engine</em>&rsquo;s master tapes from the fictional conglomerate <em>Apex Records</em>. (<a href="/corporate">Explore the Corporate Lore →</a>)
            </p>
          </div>
        </article>

        <article class="card card-accent-emerald">
          <div>
            <span class="badge" style="margin-bottom: 0.45rem;">Shared Dual-Layer Bridge</span>
            <h3><code>ERR</code> Catalog Numbers (<code>ERR-001-2015-101</code>)</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              Unlike <code>QTAHP</code> (which is strictly real-world), our <strong><code>ERR</code> Catalog Numbers</strong> are <strong>real to Michael P. Ragsdale</strong> <em>and</em> used interchangeably in-universe by <strong>Holly O&rsquo;Connell</strong>!
            </p>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">
              In the real world, our studio build script (<strong>Harper</strong>) mints an <code>ERR-ID</code> for every track in <code>master-catalog.json</code> and embeds it in ID3v2/RIFF metadata. In-universe, that exact same <code>ERR-ID</code> is the archival vault number stamped on Holly O&rsquo;Connell&rsquo;s master tape reels in Blacksburg, VA.
            </p>
          </div>
        </article>
      </div>

      <div class="callout-box" style="padding: 1.25rem;">
        <h3 style="font-size: 1.05rem; margin: 0 0 0.5rem;">How to Read an <code>ERR</code> Catalog Number (e.g., <code>ERR-001-2015-101</code>)</h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0 0 0.75rem;">
          Every track in the Engine Room Records catalog is indexed by a four-part hyphenated key (<code>ERR-&lt;RosterCode&gt;-&lt;EraYear&gt;-&lt;DiscTrack&gt;</code>) shared between Michael P. Ragsdale&rsquo;s real-world master ledger and Holly O&rsquo;Connell&rsquo;s in-universe vault:
        </p>
        <div class="grid-2" style="font-size: 0.86rem;">
          <div>
            <strong>1. Imprint &amp; Artist Roster Prefix (<code>ERR-001</code> – <code>ERR-008</code>):</strong>
            <ul style="margin: 0.35rem 0 0; padding-left: 1.2rem; color: var(--text-secondary);">
              <li><code>ERR-001</code> — <strong>The Stardust Engine</strong> (Rock Opera / Progressive Synth-Rock)</li>
              <li><code>ERR-002</code> — <strong>Fractured Prisms</strong> (Industrial / Melodic Post-Hardcore)</li>
              <li><code>ERR-003</code> — <strong>The Paper Wall</strong> (Alternative / Indie Rock)</li>
              <li><code>ERR-004</code> — <strong>Firelight</strong> (Acoustic / Heartland Folk-Rock)</li>
              <li><code>ERR-005</code> — <strong>The Arctic Symphony Project</strong> (Cinematic Symphonic Metal)</li>
              <li><code>ERR-006</code> — <strong>Crimson Node</strong> (Cyberpunk Synthwave / Darksynth)</li>
              <li><code>ERR-007</code> — <strong>Mana Canvas</strong> (<em>Runebreaker</em> Fantasy Orchestral / Chiptune)</li>
              <li><code>ERR-008</code> — <strong>The Hoshizora Ensemble</strong> (1970s Japanese City Pop / Jazz Fusion)</li>
            </ul>
          </div>
          <div>
            <strong>2. Era Year &amp; Disc/Track Index (<code>-2015-101</code>):</strong>
            <ul style="margin: 0.35rem 0 0; padding-left: 1.2rem; color: var(--text-secondary);">
              <li><strong>Middle 4 Digits (<code>2015</code>):</strong> The album&rsquo;s canonical era or release year (for example, <code>1987</code> for <em>Electric Color</em>, <code>2001</code> for <em>Midnight Drivers</em>, or <code>2015</code> for <em>Reignition</em>).</li>
              <li><strong>Final 3 Digits (<code>101</code>):</strong> The disc number (<code>1</code> = Disc 1) followed by the two-digit track number (<code>01</code> = Track 1; e.g., Disc 3 Track 8 of <em>Live at the Crucible</em> is <code>308</code>).</li>
              <li><strong>Try It Above:</strong> Paste any <code>ERR-...</code> number into the <a href="#isrc-decoder-section">Interactive Decoder</a> above to resolve its corresponding <code>QTAHP</code> or <code>QZ...</code> ISRC!</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Anatomy of a QTAHP ISRC Code -->
    <section class="section-block" aria-labelledby="anatomy-heading">
      <div class="section-header">
        <span class="eyebrow">3. ISO 3901:2019 Technical Structure</span>
        <h2 id="anatomy-heading">How to Read an Engine Room Records <code>QTAHP</code> ISRC</h2>
        <p style="margin: 0; color: var(--text-secondary);">
          Every 12-character International Standard Recording Code (ISRC) issued by Engine Room Records follows the strict four-segment ISO 3901:2019 specification. Here is how Track 1 of <a href="https://music.raggiesoft.com/artists/the-stardust-engine/2015-reignition?track=1-01-reignition-lights-up-on-progress-street" target="_blank" rel="noopener noreferrer"><em>The Stardust Engine — Reignition</em></a> (<code>QTAHP2600046</code>) breaks down:
        </p>
      </div>

      <div class="callout-box card-accent-primary" style="margin-bottom: 1.25rem; text-align: center; padding: 1.5rem;">
        <div style="font-family: monospace; font-size: clamp(1.4rem, 4vw, 2.3rem); font-weight: 800; letter-spacing: 0.08em; margin-bottom: 0.5rem;">
          <span style="color: var(--accent-primary);">QT</span><span style="color: var(--accent-amber);">AHP</span><span style="color: var(--accent-emerald);">26</span><span>00046</span>
        </div>
        <div style="font-size: 0.88rem; color: var(--text-secondary);">
          Example Recording: <strong>&ldquo;Reignition: Lights Up on Progress Street&rdquo;</strong> — <em>The Stardust Engine</em> (Catalog ID: <code>ERR-001-2015-101</code>)
        </div>
      </div>

      <div class="grid-2">
        <article class="card">
          <div>
            <span class="badge" style="margin-bottom: 0.4rem;">Characters 1–2 • Country Code</span>
            <h3><code>QT</code> — United States (US ISRC Agency)</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">
              Because the United States music industry exhausted the original <code>US</code>, <code>QM</code>, and <code>QZ</code> two-character country namespaces, the International ISRC Registration Authority (IFPI) allocated <strong><code>QT</code></strong> exclusively to the United States ISRC Agency. Any ISRC beginning with <code>QT</code> originates from a registered United States rights holder.
            </p>
          </div>
        </article>

        <article class="card">
          <div>
            <span class="badge" style="margin-bottom: 0.4rem;">Characters 3–5 • Registrant Code</span>
            <h3><code>AHP</code> — Michael Ragsdale / Engine Room Records</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">
              Permanently assigned to <strong>Michael Ragsdale (Registrant #185611)</strong>. Unlike distributor-suballocated codes where the 3-character registrant block belongs to the aggregator, <code>AHP</code> identifies Michael P. Ragsdale / Engine Room Records directly in the global DDEX supply chain across Spotify, Apple Music, YouTube Music, Amazon Music, and SoundExchange.
            </p>
          </div>
        </article>

        <article class="card">
          <div>
            <span class="badge" style="margin-bottom: 0.4rem;">Characters 6–7 • Year of Reference</span>
            <h3><code>26</code> — Real-World Allocation Year (2026)</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">
              Per ISO 3901:2019 §4.3, these two digits represent the real-world calendar year in which the ISRC is allocated to the recording (<code>26</code> = <code>2026</code>). Under our <strong>Dual Timelines Policy</strong>, even when a concept album is set in an earlier in-universe narrative era (such as <em>1978</em>, <em>1987</em>, or <em>2015</em>), the ISRC Year of Reference and DSP release year always reflect the true real-world production year.
            </p>
          </div>
        </article>

        <article class="card">
          <div>
            <span class="badge" style="margin-bottom: 0.4rem;">Characters 8–12 • Designation Code</span>
            <h3><code>00046</code> — Sequential Master Designation</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">
              A unique, monotonically increasing 5-digit integer (starting at <code>00001</code> each calendar year) assigned automatically by our studio build engineer, <strong>Harper (<code>harper.sh</code>)</strong>, the moment a final 48kHz/16-bit stereo PCM WAV master is locked into the local studio vault.
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- Section 4: The Permanent Single-ISRC Rule & Dual Distributor Architecture -->
    <section class="section-block" aria-labelledby="policy-heading">
      <div class="section-header">
        <span class="eyebrow">4. Governance &amp; Chain of Custody</span>
        <h2 id="policy-heading">The Permanent Single-ISRC Rule &amp; Why You Will See Both <code>QTAHP</code> and <code>QZ...</code> Codes</h2>
      </div>
      <div class="grid-2">
        <article class="card card-accent-emerald">
          <div>
            <h3>Rule 1: Never Re-Mint an Existing Recording&rsquo;s ISRC</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              Under ISO 3901:2019, <strong>a sound recording may only ever have one ISRC for its entire lifespan</strong>, and an ISRC may never be reused for a different recording. All Engine Room Records releases published prior to October 20, 2026 received valid ISRCs from DistroKid&rsquo;s sub-allocated US ISRC blocks (beginning with <code>QZW...</code>, <code>QZR...</code>, or <code>QTA7V...</code>). Those ${legacyCount} recordings permanently keep their original ISRCs forever.
            </p>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">
              Similarly, when an identical master recording appears on both a primary album and a companion archival release (such as <em>&ldquo;Ignition: The Forger&rsquo;s Call [Live at the Crucible]&rdquo;</em>, <code>QTAHP2600037</code>), both releases reference the exact same ISRC so play counts and rights metadata remain unified.
            </p>
          </div>
        </article>

        <article class="card card-accent-amber">
          <div>
            <h3>Rule 2: Binary Embedding Across All Audio Tiers</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              Whenever <strong>Harper (<code>harper.sh</code>)</strong> processes a master WAV in the studio vault, the track&rsquo;s canonical ISRC (whether <code>QTAHP26xxxxx</code> or legacy <code>QZ...</code>) and <code>ERR</code> Catalog Number are written directly into the binary container headers of every distribution tier:
            </p>
            <ul style="font-size: 0.88rem; color: var(--text-secondary); margin: 0; padding-left: 1.2rem;">
              <li><strong>48kHz / 16-bit Lossless WAV (<code>vault/wav/</code>):</strong> Embedded in the RIFF <code>LIST/INFO</code> <code>ISRC</code> chunk and Broadcast Wave (<code>bext</code>) header.</li>
              <li><strong>Lossless FLAC &amp; Ogg Vorbis (<code>vault/flac/</code>, <code>vault/ogg/</code>):</strong> Embedded as standard Vorbis <code>ISRC</code> and <code>CATALOGNUMBER</code> comments.</li>
              <li><strong>MP3 320kbps V0 &amp; 128kbps Web Stream (<code>web-mp3/</code>):</strong> Embedded in ID3v2.3 <code>TSRC</code> frames alongside full AI &amp; CC BY-SA 4.0 disclosures.</li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <!-- Section 5: Live QTAHP Allocation Table -->
    <section class="section-block" aria-labelledby="qtahp-table-heading">
      <div class="section-header">
        <span class="eyebrow">5. Live First-Party Registry (QTAHP2600001 – ${escapeHtml(highestCode)})</span>
        <h2 id="qtahp-table-heading">Allocated <code>QTAHP</code> Sound Recordings (${sortedQtahpCodes.length} Unique ISRCs)</h2>
        <p style="margin: 0; color: var(--text-secondary);">
          Below is every sound recording currently assigned a first-party <code>QTAHP</code> ISRC. Click any <code>QTAHP</code> or <code>ERR</code> code to inspect it in the decoder above, or visit the <a href="/dsp-verification">DSP Verification Ledger</a> for the complete ${flatTracks.length}-track catalog.
        </p>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Allocated ISRC</th>
              <th scope="col">Sound Recording Title</th>
              <th scope="col">Artist Persona &amp; Release(s)</th>
              <th scope="col">Real-World Date</th>
              <th scope="col" class="no-print">Verify &amp; Stream</th>
            </tr>
          </thead>
          <tbody>
            ${qtahpRowsHtml}
          </tbody>
        </table>
      </div>
    </section>
  `;

  return renderDocumentShell({
    title: 'Official US ISRC Registrant Prefix (QTAHP) | Engine Room',
    description: 'Official explainer and interactive decoder for US ISRC Agency prefix QTAHP (Registrant #185611, Michael Ragsdale / Engine Room Records) and ERR catalog numbers.',
    canonicalPath: '/isrc',
    bodyHtml
  });
}

