/**
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
  var visibleCountEl = document.getElementById('dsp-visible-count');
  var resetBtn = document.getElementById('dsp-reset-filter-btn');
  var artistClaimSection = document.getElementById('dsp-artist-claim-section');
  var artistClaimTitle = document.getElementById('dsp-artist-claim-title');
  var artistClaimBody = document.getElementById('dsp-artist-claim-body');
  var trackAffidavitSection = document.getElementById('dsp-track-affidavit-section');
  var trackAffidavitTitle = document.getElementById('dsp-affidavit-track-title');
  var trackAffidavitSubtitle = document.getElementById('dsp-affidavit-subtitle');
  var trackAffidavitDetails = document.getElementById('dsp-affidavit-details');

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
        '<strong>Notice to Platform Verification Teams (DistroKid, DistributeMusic.ai, Apple Music for Artists, Spotify for Artists, Amazon Music for Artists, YouTube Music):</strong> ' +
        'You have been routed to this official Engine Room Records verification ledger via an authenticated domain or claim link for <strong>' +
        displayArtist +
        (displayAlbum ? ' — <em>' + displayAlbum + '</em>' + (displayUpc ? ' (UPC: <code>' + displayUpc + '</code>)' : '') : '') +
        '</strong>. This confirms that <strong>Michael P. Ragsdale</strong> (<code>dsp.operations@engineroom-records.com</code>) is the sole human creator, songwriter, producer, and 100% legal rights holder authorized to claim, distribute, and administer the official artist profile and catalog for <strong>' +
        displayArtist +
        '</strong> across both DistroKid and DistributeMusic.ai as well as all DSPs.';
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

  // Interactive ISRC & ERR Catalog ID Decoder on /isrc
  var decoderInput = document.getElementById('isrc-decoder-input');
  var decoderBtn = document.getElementById('isrc-decoder-btn');
  var decoderResult = document.getElementById('isrc-decoder-result');
  var catalogDataEl = document.getElementById('err-isrc-catalog-data');

  if (decoderInput && decoderResult && catalogDataEl) {
    var catalogList = [];
    try {
      catalogList = JSON.parse(catalogDataEl.textContent || '[]');
    } catch (e) {
      catalogList = [];
    }

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

    function esc(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

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
            var listenHref =
              'https://music.raggiesoft.com/artists/' +
              encodeURIComponent(m.artistSlug) +
              '/' +
              encodeURIComponent(m.albumSlug) +
              '?track=' +
              encodeURIComponent(m.trackSlug);
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

    var urlParams = new URLSearchParams(window.location.search);
    var initialParam = urlParams.get('code') || urlParams.get('isrc') || urlParams.get('err') || '';
    if (initialParam) {
      decoderInput.value = initialParam.trim().toUpperCase();
      runDecoder(decoderInput.value, true);
    } else {
      runDecoder(decoderInput.value || 'QTAHP2600046', false);
    }

    decoderInput.addEventListener('input', function (e) {
      runDecoder(e.target.value, false);
    });

    if (decoderBtn) {
      decoderBtn.addEventListener('click', function () {
        runDecoder(decoderInput.value, false);
      });
    }

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
