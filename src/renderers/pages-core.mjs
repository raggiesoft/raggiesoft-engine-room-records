/**
 * @license MIT
 * ============================================================================
 * src/renderers/pages-core.mjs — Engine Room Records (engineroom.raggiesoft.com)
 * ============================================================================
 * Architectural Overview:
 * Renders the Three Core Pillars of Engine Room Records:
 * 1. `renderHomePage` (`/`):
 *    - Pillar 1: "What Kind of Music Do I Make?" (7-Band Directory passing visitors
 *      directly to `https://music.raggiesoft.com`).
 *    - Pillar 2: Behind the Scenes on Music Generation summary.
 *    - Pillar 3: Real-World Imprint (`Engine Room Records`, no "LLC") vs.
 *      In-Universe Lore Entity (`Engine Room Records, LLC`).
 *    - Closed Submission Policy.
 * 2. `renderStudioEngineeringPage` (`/studio-engineering`):
 *    - Deep studio engineering documentation (Suno v5/v6 pipeline, phonetic vowel
 *      extensions, 74% Cover Audio Influence protocol, Dual Timeline spec, and
 *      Open-Culture Trademark Policy).
 * 3. `renderCorporatePage` (`/corporate`):
 *    - Full dual-layer corporate breakdown and recursive org-chart renderer for
 *      `corporate-structure.json`.
 * ============================================================================
 */

import { escapeHtml, renderDocumentShell } from './shell.mjs';
import { ARTIST_LORE_PROFILES } from '../data/artistLore.mjs';

/**
 * Computes album and playable track totals per artist from `catalog.json`.
 * @param {Array<any>} catalog
 * @returns {Map<string, { albumCount: number, trackCount: number, playableCount: number, albums: Array<any> }>}
 */
export function buildArtistStats(catalog) {
  const stats = new Map();
  for (const slug of Object.keys(ARTIST_LORE_PROFILES)) {
    stats.set(slug, { albumCount: 0, trackCount: 0, playableCount: 0, albums: [] });
  }
  for (const album of catalog) {
    const slug = album.artistSlug;
    if (!stats.has(slug)) {
      stats.set(slug, { albumCount: 0, trackCount: 0, playableCount: 0, albums: [] });
    }
    const entry = stats.get(slug);
    entry.albumCount += 1;
    entry.trackCount += Number(album.totalTracksCount || album.tracks?.length || 0);
    entry.playableCount += Number(album.playableTrackCount || 0);
    entry.albums.push(album);
  }
  return stats;
}

/**
 * Renders the Home Landing Page (`/`).
 * @param {Array<any>} catalog
 * @returns {string}
 */
export function renderHomePage(catalog) {
  const statsMap = buildArtistStats(catalog);
  const totalAlbums = catalog.length;
  const totalTracks = catalog.reduce((acc, a) => acc + Number(a.totalTracksCount || a.tracks?.length || 0), 0);

  const artistCardsHtml = Object.values(ARTIST_LORE_PROFILES)
    .map((artist) => {
      const stat = statsMap.get(artist.slug) || { albumCount: 0, trackCount: 0, playableCount: 0 };
      const loreHref =
        artist.slug === 'the-stardust-engine'
          ? 'https://stardust.raggiesoft.com'
          : `/artists/${artist.slug}`;
      const loreLabel =
        artist.slug === 'the-stardust-engine'
          ? '🚀 Cosmic Portal (stardust.raggiesoft.com) ↗'
          : `📖 ${artist.name} Lore & Roster`;

      return `
        <article class="card card-accent-primary" aria-labelledby="band-${escapeHtml(artist.slug)}">
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
                  <span class="badge">${stat.albumCount} Releases • ${stat.trackCount} Tracks</span>
                </div>
                <h3 id="band-${escapeHtml(artist.slug)}" style="margin: 0;">${escapeHtml(artist.name)}</h3>
              </div>
            </div>

            <p style="font-size: 0.84rem; font-weight: 700; color: var(--accent-amber); margin: 0 0 0.5rem;">
              ${escapeHtml(artist.primaryGenre)}
            </p>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0 0 0.75rem;">
              <strong>What It Sounds Like:</strong> ${escapeHtml(artist.whatKindOfMusic)}
            </p>
            <p style="font-size: 0.86rem; color: var(--text-muted); margin: 0;">
              ${escapeHtml(artist.summary)}
            </p>
          </div>

          <div class="btn-row">
            <a href="${escapeHtml(artist.listeningRoomUrl)}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
              🎧 Listen in The Listening Room ↗
            </a>
            <a href="${escapeHtml(loreHref)}" class="btn">
              ${escapeHtml(loreLabel)}
            </a>
            ${
              artist.bookReaderUrl
                ? `<a href="${escapeHtml(artist.bookReaderUrl)}" class="btn btn-amber" target="_blank" rel="noopener noreferrer">📚 Companion Book ↗</a>`
                : ''
            }
          </div>
        </article>`;
    })
    .join('\n');

  const bodyHtml = `
    <section class="hero-card" aria-labelledby="hero-heading">
      <span class="eyebrow">Engine Room Records • Official Imprint &amp; Studio Gateway</span>
      <h1 id="hero-heading">&ldquo;What Kind of Music Do I Make?&rdquo;</h1>
      <p class="lead">
        Welcome to <strong>Engine Room Records</strong> (<a href="https://engineroom.raggiesoft.com">engineroom.raggiesoft.com</a>, also reachable via our vanity domain <code>engineroom-records.com</code>).
        In real life, <strong>Engine Room Records</strong> is the private creative imprint under which <strong>Michael P. Ragsdale</strong> writes, engineers, and distributes <strong>${totalAlbums} albums (${totalTracks} songs)</strong> across seven distinct musical projects—spanning 1980s stadium synth-rock, zero-gravity <em>80s Cosmic Pop</em>, British art-rock operas, holiday symphonic metal, 16-bit RPG progressive rock, and 1980s fantasy-adventure movie soundtracks.
      </p>
      <div class="btn-row">
        <a href="https://music.raggiesoft.com" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          🎧 Launch The Listening Room (Stream &amp; CC BY-SA 4.0 Downloads) ↗
        </a>
        <a href="#pillar-1-directory" class="btn">
          1. Explore the 7 Bands ↓
        </a>
        <a href="/studio-engineering" class="btn btn-amber">
          2. Behind the Scenes on Music Generation →
        </a>
        <a href="/corporate" class="btn btn-emerald">
          3. Real-World Imprint vs. In-Universe Lore →
        </a>
      </div>
    </section>

    <!-- PILLAR 1: WHAT KIND OF MUSIC DO I MAKE? -->
    <section id="pillar-1-directory" class="section-block" aria-labelledby="pillar-1-heading">
      <div class="section-header">
        <span class="eyebrow">Core Pillar 01 • Roster &amp; Genre Directory</span>
        <h2 id="pillar-1-heading">1. What Kind of Music Do I Make? (The 7 Projects)</h2>
        <p style="margin: 0; color: var(--text-secondary);">
          Rather than forcing every genre under a single artist name, each musical style and narrative universe has its own dedicated band project. Select any project below to stream full tracks, read synchronized lyrics, or download free <strong>CC BY-SA 4.0 128kbps MP3 archives</strong> in <a href="https://music.raggiesoft.com">The Listening Room</a>.
        </p>
      </div>
      <div class="grid-2">
        ${artistCardsHtml}
      </div>
    </section>

    <!-- PILLAR 2: BEHIND THE SCENES ON MUSIC GENERATION -->
    <section class="section-block" aria-labelledby="pillar-2-heading">
      <div class="section-header">
        <span class="eyebrow">Core Pillar 02 • Studio Transparency</span>
        <h2 id="pillar-2-heading">2. Behind the Scenes on Music Generation</h2>
        <p style="margin: 0; color: var(--text-secondary);">
          Full engineering transparency into how human direction, narrative libretto writing, acoustic &amp; phonetic vowel extensions, and the 74% Cover Audio Influence protocol shape every release.
        </p>
      </div>

      <div class="grid-3">
        <article class="card card-accent-amber">
          <div>
            <h3>Human Direction + AI Studio Pipeline</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              Every song begins with Michael P. Ragsdale's human creative direction, narrative architecture, and co-written lyrics with Google Gemini, engineered into audio via a commercial <strong>Suno v5 / v6</strong> studio subscription and mastered locally through our automated <strong>Harper Audio Engine</strong>.
            </p>
          </div>
          <div class="btn-row">
            <a href="/studio-engineering#pipeline" class="btn">Read Pipeline Spec →</a>
          </div>
        </article>

        <article class="card card-accent-primary">
          <div>
            <h3>Phonetic Vowel Extension &amp; 74% Cover Protocol</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              To prevent clipped phrasing and unlock sustained stadium vocal belts, lyrics are engineered with explicit phonetic vowel extensions (<code>ooh</code>, <code>aah</code>, <code>ee</code>, <code>oh</code>). For our remastered <em>Starfield Calibration</em> sessions, a precise <strong>74% Audio Influence</strong> Cover ratio preserved original melodies while upgrading acoustic separation.
            </p>
          </div>
          <div class="btn-row">
            <a href="/studio-engineering#cover-protocol" class="btn">Explore 74% Protocol →</a>
          </div>
        </article>

        <article class="card card-accent-emerald">
          <div>
            <h3>The Cosmic Tidal Lock Sound™ vs. 80s Cosmic Pop</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              We protect <strong>The Cosmic Tidal Lock Sound™</strong> as the proprietary brand mark of <a href="https://stardust.raggiesoft.com">The Stardust Engine</a>, while keeping the underlying genre descriptor—<strong>&ldquo;80s Cosmic Pop&rdquo;</strong>—100% open and free for any musician or creator to use.
            </p>
          </div>
          <div class="btn-row">
            <a href="/studio-engineering#trademark-policy" class="btn">View Open-Culture Policy →</a>
          </div>
        </article>
      </div>
    </section>

    <!-- PILLAR 3: THE CORPORATE ENTITY OF ENGINE ROOM RECORDS -->
    <section class="section-block" aria-labelledby="pillar-3-heading">
      <div class="section-header">
        <span class="eyebrow">Core Pillar 03 • Dual-Layer Architecture</span>
        <h2 id="pillar-3-heading">3. The Corporate Entity of Engine Room Records</h2>
        <p style="margin: 0; color: var(--text-secondary);">
          Understanding the boundary between our real-world publishing brand and our in-universe fictional conglomerate.
        </p>
      </div>

      <div class="grid-2">
        <article class="card card-accent-emerald">
          <div>
            <span class="badge" style="margin-bottom: 0.5rem;">Real-World Reality (Non-Fiction)</span>
            <h3>Engine Room Records (Strictly NO &ldquo;LLC&rdquo;)</h3>
            <p style="font-size: 0.92rem; color: var(--text-secondary);">
              In the real world, there is only <strong>Engine Room Records</strong>—never <em>Engine Room Records, LLC</em>. It is the sole-proprietor creative brand and record imprint under which <strong>Michael P. Ragsdale</strong> publishes his music to Spotify, Apple Music, Amazon Music, YouTube Music, and <a href="https://music.raggiesoft.com">The Listening Room</a>.
            </p>
            <ul style="font-size: 0.88rem; color: var(--text-secondary); padding-left: 1.2rem;">
              <li><strong>Owner &amp; Executive Producer:</strong> Michael P. Ragsdale</li>
              <li><strong>Consumer Free Downloads:</strong> 128kbps MP3 tracks &amp; album ZIPs licensed under <strong>CC BY-SA 4.0</strong> on <a href="https://music.raggiesoft.com">music.raggiesoft.com</a>.</li>
              <li><strong>Commercial Sync Clearance:</strong> Direct B2B synchronization licensing via <a href="/commercial-licensing">/commercial-licensing</a>.</li>
            </ul>
          </div>
          <div class="btn-row">
            <a href="/dsp-verification" class="btn btn-emerald">DSP Chain-of-Custody Ledger →</a>
          </div>
        </article>

        <article class="card card-accent-violet">
          <div>
            <span class="badge" style="margin-bottom: 0.5rem;">In-Universe Narrative Lore (Work of Fiction)</span>
            <h3>Engine Room Records, LLC &amp; The O'Connell Family Trust</h3>
            <p style="font-size: 0.92rem; color: var(--text-secondary);">
              Anything with <strong>&ldquo;LLC&rdquo;</strong>, <strong>&ldquo;Trust&rdquo;</strong>, or <strong>&ldquo;Holdings&rdquo;</strong> in its name is strictly a <strong>fictitious, in-universe narrative entity</strong>. Within the story world, <em>Engine Room Records, LLC</em> was founded in <strong>1992</strong> by <strong>Holly O'Connell, J.D., CFA</strong> after The Stardust Engine walked out of Apex Records' <em>Friction</em> sessions.
            </p>
            <ul style="font-size: 0.88rem; color: var(--text-secondary); padding-left: 1.2rem;">
              <li><strong>Parent Trust:</strong> <em>The O'Connell Family Revocable Trust</em> (Est. 2012 / 2015 DE Restructure, $2.4B+ AUM).</li>
              <li><strong>Subsidiaries:</strong> <em>The O'Connell Family, LLC</em>, <em>Artists First Management, LLC</em>, <em>Stardust Properties, LLC</em>, <em>Stardust Strategic Assets, LLC</em>, <em>Jessica Miller Center, LLC</em>, and <em>Aethelgard Holdings, LLC</em>.</li>
            </ul>
          </div>
          <div class="btn-row">
            <a href="/corporate" class="btn">Explore Full In-Universe Corporate Org Chart →</a>
          </div>
        </article>
      </div>
    </section>

    <!-- CLOSED SUBMISSION POLICY -->
    <section class="section-block" aria-labelledby="submission-policy-heading">
      <div class="callout-box card-accent-rose">
        <span class="badge" style="margin-bottom: 0.5rem;">Mandatory Imprint Policy</span>
        <h2 id="submission-policy-heading" style="margin-bottom: 0.5rem;">Closed Submission Policy (No Unsolicited Demos)</h2>
        <p style="margin: 0; font-size: 0.94rem; color: var(--text-secondary);">
          <strong>Engine Room Records is a strictly closed private imprint dedicated exclusively to the creative works of Michael P. Ragsdale.</strong>
          We do not accept unsolicited demos, artist submissions, or representation inquiries. Any unsolicited submissions sent to our domain are automatically deleted at the mail transport layer before they ever arrive at an inbox.
        </p>
      </div>
    </section>
  `;

  return renderDocumentShell({
    title: 'Engine Room Records | Official Imprint & Studio Hub',
    description: 'What kind of music do I make? Explore all 7 Engine Room Records bands, studio engineering, and our dual-layer corporate lore.',
    canonicalPath: '/',
    bodyHtml
  });
}

/**
 * Renders Pillar 2: Behind the Scenes on Music Generation (`/studio-engineering`).
 * @returns {string}
 */
export function renderStudioEngineeringPage() {
  const bodyHtml = `
    <section class="hero-card" aria-labelledby="eng-heading">
      <span class="eyebrow">Core Pillar 02 • Studio Engineering &amp; Production Dossier</span>
      <h1 id="eng-heading">Behind the Scenes on Music Generation</h1>
      <p class="lead">
        At <strong>Engine Room Records</strong>, artificial intelligence is never treated as a &ldquo;push-button replacement&rdquo; for human storytelling. Every album is a multi-stage studio collaboration combining <strong>Michael P. Ragsdale's</strong> personal narrative concepts, libretto co-writing with <strong>Google Gemini</strong>, iterative vocal and acoustic engineering in <strong>Suno v5 / v6</strong>, and local mastering via our automated <strong>Harper Audio Engine</strong>.
      </p>
      <div class="btn-row">
        <a href="https://music.raggiesoft.com/playlists/cosmic-tidal-lock-sound" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          🎧 Hear The Cosmic Tidal Lock Sound™ in The Listening Room ↗
        </a>
        <a href="https://music.raggiesoft.com/the-stardust-engine/2011-starfield-calibration" class="btn btn-amber" target="_blank" rel="noopener noreferrer">
          🎛️ Listen to Starfield Calibration (2011 / 2026) ↗
        </a>
      </div>
    </section>

    <section id="pipeline" class="section-block" aria-labelledby="pipeline-heading">
      <div class="section-header">
        <span class="eyebrow">Stage 01–04 • End-to-End Studio Workflow</span>
        <h2 id="pipeline-heading">1. The 4-Stage Human + AI Production Architecture</h2>
      </div>
      <div class="grid-2">
        <article class="card card-accent-primary">
          <h3>Stage 1: Human Narrative Architecture &amp; Libretto</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            Every song starts in the Markdown narrative archives (<a href="https://books.raggiesoft.com">books.raggiesoft.com</a>). Before a single note is rendered, we establish who is singing, why the song exists in-universe (such as Cassidy finding safety in Ryan's embrace on <a href="https://music.raggiesoft.com/the-stardust-engine/1997-hard-reset?track=the-stardust-engine-1997-hard-reset-1-9"><em>Echoes in the Wire</em></a>, or the Rowlands siblings broadcasting <a href="https://music.raggiesoft.com/the-arctic-symphony-project/1996-a-symphony-of-snow?track=the-arctic-symphony-project-1996-a-symphony-of-snow-1-1"><em>Upon This Winter's Night</em></a> across the Appalachian mountains for Julian), and its exact tempo, key feel, and structural cues.
          </p>
        </article>
        <article class="card card-accent-amber">
          <h3>Stage 2: Acoustic &amp; Phonetic Vowel Extensions</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            Standard written prose often produces clipped or rushed vocal synthesis on long melodic sustains. To engineer soaring 1980s stadium belts and zero-gravity harmonic tails, our librettos embed explicit <strong>phonetic vowel extensions</strong> (<code>ooh</code>, <code>aah</code>, <code>ee</code>, <code>oh</code>) and breath-cadence markers directly into the studio lyric sheets. In-universe on <a href="https://music.raggiesoft.com/the-stardust-engine/2011-starfield-calibration"><em>Starfield Calibration</em></a>, these lyrical evolutions celebrate the band's freedom from Apex Records alongside Cassidy's open-room acoustic phrasing.
          </p>
        </article>
        <article class="card card-accent-emerald">
          <h3>Stage 3: Suno v5 / v6 Generation &amp; 74% Cover Calibration</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            Tracks are generated under a paid commercial Suno subscription (granting 100% commercial ownership to Michael P. Ragsdale). When upgrading legacy recordings into our signature 2011 remaster suite (<a href="https://music.raggiesoft.com/the-stardust-engine/2011-starfield-calibration"><em>Starfield Calibration</em></a>), we discovered the <strong>74% Cover Audio Influence Protocol</strong>—the exact threshold where the engine preserves 100% of the core melody and sibling vocal chemistry while rebuilding the instrumentation with wide-field analog space-synth separation.
          </p>
        </article>
        <article class="card card-accent-violet">
          <h3>Stage 4: Local Harper Mastering &amp; Decoupled Vaults</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            Once a master 24-bit WAV passes human quality review, our local <strong>Harper Audio Engine</strong> (<code>harper.sh</code>) transcodes the master into 128kbps web preview MP3s and free <strong>CC BY-SA 4.0 ZIP archives</strong> for <a href="https://music.raggiesoft.com">music.raggiesoft.com</a>, while keeping multi-gigabyte uncompressed WAV/FLAC masters isolated inside our local <code>/raggiesoft-vaults</code> sanctuary.
          </p>
        </article>
      </div>
    </section>

    <section id="cover-protocol" class="section-block" aria-labelledby="cover-heading">
      <div class="section-header">
        <span class="eyebrow">Acoustic Discovery • The 74% Sweet Spot</span>
        <h2 id="cover-heading">2. Why Lyrical &amp; Sonic Changes Happened on <em>Starfield Calibration</em></h2>
      </div>
      <div class="callout-box card-accent-amber">
        <p style="margin: 0 0 0.75rem; font-size: 0.95rem;">
          Listeners comparing original 1987–1997 releases (such as <a href="https://music.raggiesoft.com/the-stardust-engine/1987-electric-color"><em>Electric Color</em></a>, <a href="https://music.raggiesoft.com/the-stardust-engine/1989-neon-hearts"><em>Neon Hearts</em></a>, and <a href="https://music.raggiesoft.com/the-stardust-engine/1997-hard-reset"><em>Hard Reset</em></a>) against the 2011 <a href="https://music.raggiesoft.com/the-stardust-engine/2011-starfield-calibration"><strong>Starfield Calibration</strong></a> Cosmic Tidal Lock mixes will notice intentional lyrical and vocal phrasing updates. Both the in-universe and studio reasons are one and the same:
        </p>
        <ol style="margin: 0; padding-left: 1.4rem; color: var(--text-secondary); font-size: 0.92rem; display: grid; gap: 0.5rem;">
          <li>
            <strong>Celebrating Emancipation from Apex Records:</strong> In-universe, Ryan, Cassidy, Evan, and Tyler reclaimed their early 1980s songs from Apex Records' suffocating corporate pop template, rewriting coerced lines into an unapologetic celebration of family autonomy. Notably, <a href="https://music.raggiesoft.com/the-stardust-engine/1997-hard-reset?track=the-stardust-engine-1997-hard-reset-1-9"><em>Echoes in the Wire</em></a> (and its <a href="https://music.raggiesoft.com/the-stardust-engine/2011-starfield-calibration?track=the-stardust-engine-2011-starfield-calibration-1-10"><em>Cosmic Tidal Lock Mix</em></a>) permanently replaced Apex's coerced 1989 ballad <em>If You Walked Away</em>—transforming a song of manufactured heartbreak into the true story of Cassidy finding comfort and safety when her brother Ryan is hugging her tightly.
          </li>
          <li>
            <strong>Acoustic &amp; Phonetic Vowel Extensions:</strong> By opening cramped syllables into resonant vowel sustains (<code>ooh</code>, <code>aah</code>, <code>ee</code>, <code>oh</code>) and pairing them with our <strong>74% Cover Audio Influence</strong> calibration, the vocal harmonies lock into synchronous phase with Cassidy's analog synthesizer pads.
          </li>
        </ol>
      </div>
    </section>

    <section id="trademark-policy" class="section-block" aria-labelledby="tm-heading">
      <div class="section-header">
        <span class="eyebrow">Intellectual Property &amp; Open Culture</span>
        <h2 id="tm-heading">3. Open-Culture Trademark Policy &amp; Dual Timeline Specification</h2>
      </div>
      <div class="grid-2">
        <article class="card card-accent-emerald">
          <h3>Proprietary Brand Mark vs. Open Genre</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            <strong>The Cosmic Tidal Lock Sound™</strong> is the proprietary brand mark identifying works produced by <strong>Engine Room Records</strong> and <a href="https://stardust.raggiesoft.com"><strong>The Stardust Engine</strong></a>. However, we believe musical genres belong to everyone: the descriptive genre term <strong>&ldquo;80s Cosmic Pop&rdquo;</strong> is intentionally dedicated to the open creative commons so any artist, producer, or fan can freely tag and create music in that style.
          </p>
        </article>
        <article class="card card-accent-primary">
          <h3>Dual Timeline Policy &amp; Zero-Numbers DSP Artwork</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            Every release carries two explicit ISO 8601 dates in its Schema.org metadata: <code>temporalCoverage</code> (the in-universe lore year, e.g., <code>1987</code> for <em>Electric Color</em> or <code>2004-09-21</code> for <em>Progress Street</em>) and <code>datePublished</code> (the real-world <code>2026</code> production year). To comply with strict Apple Music and Spotify cover-art inspection rules, all 1:1 album covers contain <strong>zero numbers or dates</strong>, featuring only the artist name and album title.
          </p>
        </article>
      </div>
    </section>
  `;

  return renderDocumentShell({
    title: 'Behind the Scenes: Studio Engineering | Engine Room Records',
    description: 'How Engine Room Records engineers music: human direction, Suno v5/v6 pipeline, phonetic vowel extensions, and the 74% Cover Influence protocol.',
    canonicalPath: '/studio-engineering',
    bodyHtml
  });
}

/**
 * Recursively renders nodes from `corporate-structure.json` into semantic cards.
 * @param {any} node
 * @param {number} depth
 * @returns {string}
 */
function renderCorporateNode(node, depth = 0) {
  const childrenHtml = Array.isArray(node.children) && node.children.length > 0
    ? `<div style="margin-top: 1rem; padding-left: 1rem; border-left: 2px solid var(--border-strong); display: grid; gap: 0.85rem;">
        ${node.children.map((child) => renderCorporateNode(child, depth + 1)).join('\n')}
       </div>`
    : '';

  return `
    <div class="card" style="padding: 1.15rem;">
      <div>
        <div class="badge-row" style="margin-bottom: 0.35rem;">
          <span class="badge">${escapeHtml(node.role || 'Fictitious Subsidiary')}</span>
          ${node.meta ? `<span class="badge">${escapeHtml(node.meta)}</span>` : ''}
          <span class="badge">In-Universe Fiction</span>
        </div>
        <h3 style="font-size: ${depth === 0 ? '1.25rem' : '1.05rem'}; margin: 0 0 0.35rem;">
          ${escapeHtml(node.title)}
        </h3>
        ${
          node.description
            ? `<p style="margin: 0; font-size: 0.88rem; color: var(--text-secondary);">${escapeHtml(node.description)}</p>`
            : ''
        }
      </div>
      ${childrenHtml}
    </div>`;
}

/**
 * Renders Pillar 3: The Corporate Entity of Engine Room Records (`/corporate`).
 * @param {any} corporateStructure
 * @returns {string}
 */
export function renderCorporatePage(corporateStructure) {
  const orgTreeHtml = renderCorporateNode(corporateStructure, 0);

  const bodyHtml = `
    <section class="hero-card" aria-labelledby="corp-heading">
      <span class="eyebrow">Core Pillar 03 • Real-World Brand vs. In-Universe Lore</span>
      <h1 id="corp-heading">The Corporate Entity of Engine Room Records</h1>
      <p class="lead">
        Because <strong>Engine Room Records</strong> operates simultaneously as a real-world digital music imprint and as the anchor of a multi-decade literary universe, this page documents the exact boundary between <strong>real-world legal reality</strong> and <strong>in-universe narrative lore</strong>.
      </p>
    </section>

    <section class="section-block" aria-labelledby="dual-layer-heading">
      <div class="section-header">
        <span class="eyebrow">Legal &amp; Canonical Boundary</span>
        <h2 id="dual-layer-heading">1. Real-World Brand Name vs. Fictitious In-Universe &ldquo;LLC&rdquo; Entities</h2>
      </div>
      <div class="grid-2">
        <article class="card card-accent-emerald">
          <span class="badge" style="margin-bottom: 0.5rem;">Layer A • Real-World Fact</span>
          <h3>Engine Room Records (Never &ldquo;LLC&rdquo;)</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            In real life, there is only <strong>Engine Room Records</strong> (strictly without &ldquo;LLC&rdquo;). It is the real-world creative brand name under which <strong>Michael P. Ragsdale</strong> distributes his original music catalog across global DSPs and <a href="https://music.raggiesoft.com">The Listening Room</a>.
          </p>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">
            All real-world copyright, commercial Suno AI studio clearances, and ISRC assignments are held directly by Michael P. Ragsdale.
          </p>
        </article>

        <article class="card card-accent-violet">
          <span class="badge" style="margin-bottom: 0.5rem;">Layer B • In-Universe Fiction</span>
          <h3>Engine Room Records, LLC &amp; The O'Connell Family Trust</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            Anything with <strong>&ldquo;LLC&rdquo;</strong>, <strong>&ldquo;Trust&rdquo;</strong>, or <strong>&ldquo;Holdings&rdquo;</strong> in its name is strictly a <strong>fictitious, in-universe created entity</strong>. In the narrative canon, <em>Engine Room Records, LLC</em> was founded in 1992 by <strong>Holly O'Connell</strong> to shield <a href="https://stardust.raggiesoft.com">The Stardust Engine</a> from predatory record labels, later evolving into the 2015 Delaware holding structure under <em>The O'Connell Family Revocable Trust</em>.
          </p>
        </article>
      </div>
    </section>

    <section class="section-block" aria-labelledby="org-chart-heading">
      <div class="section-header">
        <span class="eyebrow">Source: corporate-structure.json • 2015 Delaware Ring-Fence</span>
        <h2 id="org-chart-heading">2. In-Universe Corporate Hierarchy (Fictitious Lore Registry)</h2>
        <p style="margin: 0; color: var(--text-secondary);">
          Rendered directly from <code>raggiesoft-assets/engine-room-records/json/corporate-structure.json</code>. Every entity below is part of the fictional narrative world of <a href="https://books.raggiesoft.com/books/stardust-engine">The Stardust Engine</a> and <a href="https://lore.raggiesoft.com">The Lore Omnibus</a>.
        </p>
      </div>
      ${orgTreeHtml}
    </section>

    <section class="section-block" aria-labelledby="assets-heading">
      <div class="section-header">
        <span class="eyebrow">Stardust Strategic Assets, LLC • Physical Sanctuary Lore</span>
        <h2 id="assets-heading">3. Key In-Universe Sanctuary Properties &amp; Rolling Fleet</h2>
      </div>
      <div class="grid-2">
        <article class="card card-accent-primary">
          <h3>The Fortress &amp; Stardust Studios (Progress Street, Blacksburg)</h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">
            In-universe, <strong>The Fortress</strong> (on Progress Street) is the barrier-free residential compound of the O'Connell and Wright family in Blacksburg, Virginia, paired with <strong>Stardust Studios</strong> (Global HQ, Est. 2013) and <strong>The Vault</strong> (subterranean master tape archive). Meanwhile, <em>Stardust Blacksburg, LLC</em> (DBA &ldquo;The Ironwood Collective&rdquo;) provides subsidized, wheelchair-accessible housing for CPI students.
          </p>
        </article>
        <article class="card card-accent-amber">
          <h3>The Rolling Sanctuary Fleet (Sainte-Claire 45H3 &amp; Prairie RLFD30)</h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">
            Operated in-universe by Class A CDL holders Tyler Wright, Evan Wright, and Holly O'Connell:
            <strong>The Iron Horse</strong> (a 2002 <em>Sainte-Claire 45H3</em> 45-foot unpainted stainless-steel motorcoach with a custom mid-ship hydraulic wheelchair platform lift for Ryan) and <strong>Fleet Unit #1985</strong> (Serial #001 2004 <em>Prairie Coachworks RLFD30</em> 30-foot low-floor urban shuttle with a front-door flip-out ADA ramp).
          </p>
          <div class="btn-row">
            <a href="https://stardust.raggiesoft.com/fleet" class="btn btn-amber" target="_blank" rel="noopener noreferrer">
              🚌 Inspect the Fleet on stardust.raggiesoft.com ↗
            </a>
          </div>
        </article>
      </div>
    </section>
  `;

  return renderDocumentShell({
    title: 'Corporate Architecture & Lore | Engine Room Records',
    description: 'Real-world imprint (Engine Room Records) vs. in-universe conglomerate (Engine Room Records, LLC & The O\'Connell Family Trust).',
    canonicalPath: '/corporate',
    bodyHtml
  });
}

